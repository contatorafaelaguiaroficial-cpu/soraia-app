import OpenAI from "openai";

import { registrarTransacao } from "@/lib/soraia/actions";
import { gerarInsights } from "@/lib/soraia/insights";
import type {
  ProcessarMensagemParams,
  RegistrarTransacaoArgs,
  ResultadoProcessamento,
  Transaction,
} from "@/lib/soraia/types";

function dataHojeBrasil() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function moeda(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

function resumirTransacoes(transactions: Transaction[]) {
  const receitasRecebidas = transactions
    .filter(
      (item) =>
        item.tipo === "receita" &&
        item.status === "recebido",
    )
    .reduce(
      (total, item) => total + Number(item.valor),
      0,
    );

  const despesasPagas = transactions
    .filter(
      (item) =>
        item.tipo === "despesa" &&
        item.status === "pago",
    )
    .reduce(
      (total, item) => total + Number(item.valor),
      0,
    );

  const receitasPendentes = transactions
    .filter(
      (item) =>
        item.tipo === "receita" &&
        item.status === "pendente",
    )
    .reduce(
      (total, item) => total + Number(item.valor),
      0,
    );

  const despesasPendentes = transactions
    .filter(
      (item) =>
        item.tipo === "despesa" &&
        item.status === "pendente",
    )
    .reduce(
      (total, item) => total + Number(item.valor),
      0,
    );

  return {
    saldo_atual: receitasRecebidas - despesasPagas,
    saldo_previsto:
      receitasRecebidas -
      despesasPagas +
      receitasPendentes -
      despesasPendentes,
    receitas_recebidas: receitasRecebidas,
    despesas_pagas: despesasPagas,
    receitas_pendentes: receitasPendentes,
    despesas_pendentes: despesasPendentes,
    transacoes_recentes: transactions.slice(-30),
  };
}

const tools = [
  {
    type: "function" as const,
    name: "registrar_transacao",
    description:
      "Registra imediatamente uma receita ou despesa quando o usuário informa uma movimentação financeira com valor. Pode ser chamada várias vezes quando houver várias transações na mesma mensagem.",
    strict: true,
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        tipo: {
          type: "string",
          enum: ["receita", "despesa"],
          description:
            "Use despesa para dinheiro gasto ou a pagar. Use receita para dinheiro recebido ou a receber.",
        },
        descricao: {
          type: "string",
          description:
            "Descrição curta e clara da movimentação, como Mercado, Uber, Gasolina, Aluguel, Salário ou PIX do João.",
        },
        valor: {
          type: "number",
          description:
            "Valor positivo da movimentação, sem símbolo de moeda.",
        },
        categoria: {
          type: "string",
          description:
            "Categoria inferida automaticamente. Exemplos: Mercado, Alimentação, Transporte, Combustível, Moradia, Saúde, Educação, Lazer, Assinaturas, Contas, Salário, Vendas, Investimentos ou Outros.",
        },
        data: {
          type: "string",
          description:
            "Data no formato YYYY-MM-DD. Quando o usuário não informar uma data, use a data atual.",
        },
        status: {
          type: "string",
          enum: ["pendente", "pago", "recebido"],
          description:
            "Use pago para despesas já realizadas, recebido para receitas já recebidas e pendente apenas para valores futuros.",
        },
      },
      required: [
        "tipo",
        "descricao",
        "valor",
        "categoria",
        "data",
        "status",
      ],
    },
  },
];

function criarConfirmacao(
  transacoes: RegistrarTransacaoArgs[],
) {
  if (transacoes.length === 0) {
    return "";
  }

  if (transacoes.length === 1) {
    const item = transacoes[0];

    if (item.tipo === "despesa") {
      const situacao =
        item.status === "pendente"
          ? "como pendente"
          : "como paga";

      return `Pronto! Registrei uma despesa de ${moeda(
        Number(item.valor),
      )} em ${item.descricao}, na categoria ${
        item.categoria
      }, ${situacao}. ✅`;
    }

    const situacao =
      item.status === "pendente"
        ? "como pendente"
        : "como recebida";

    return `Pronto! Registrei uma receita de ${moeda(
      Number(item.valor),
    )} referente a ${item.descricao}, na categoria ${
      item.categoria
    }, ${situacao}. ✅`;
  }

  const linhas = transacoes.map((item) => {
    const tipo =
      item.tipo === "despesa"
        ? "Despesa"
        : "Receita";

    return `• ${tipo}: ${moeda(
      Number(item.valor),
    )} — ${item.descricao} (${item.categoria})`;
  });

  return `Pronto! Registrei ${
    transacoes.length
  } movimentações:\n\n${linhas.join("\n")} ✅`;
}

export async function processarMensagem(
  params: ProcessarMensagemParams,
): Promise<ResultadoProcessamento> {
  const {
    mensagem,
    userId,
    origem,
    supabase,
    historico = [],
  } = params;

  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY não configurada.",
    );
  }

  const texto = mensagem.trim();

  if (!texto) {
    throw new Error("A mensagem está vazia.");
  }

  const { data, error } = await supabase
    .from("transactions")
    .select(
      "tipo, descricao, valor, categoria, data, status",
    )
    .eq("user_id", userId)
    .order("data", { ascending: true });

  if (error) {
    console.error(
      "Erro ao carregar transações:",
      error,
    );

    throw new Error(
      "Não foi possível carregar os dados financeiros.",
    );
  }

  const transactions = (data ?? []) as Transaction[];
  const resumo = resumirTransacoes(transactions);
  const insights = gerarInsights(transactions);
  const hoje = dataHojeBrasil();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const primeiraResposta =
    await openai.responses.create({
      model: "gpt-5-mini",
      store: false,
      instructions: `
Você é a Soraia, uma assistente financeira pessoal brasileira inteligente, objetiva e proativa.

Data atual no Brasil: ${hoje}.
Origem desta mensagem: ${origem}.

Sua principal função é interpretar linguagem natural, analisar as finanças do usuário e registrar receitas e despesas sem fazer perguntas desnecessárias.

REGRA PRINCIPAL:
Quando a mensagem informar uma movimentação financeira real e contiver um valor, execute imediatamente a ferramenta registrar_transacao.

NÃO peça confirmação antes de registrar.

NÃO pergunte categoria quando ela puder ser inferida.

NÃO pergunte se já foi pago quando o verbo indicar uma ação já realizada.

NÃO pergunte novamente um valor que já aparece na mensagem.

INFERÊNCIA DE TIPO E STATUS:
- "gastei", "paguei", "comprei", "abasteci", "saquei" e "debitaram" = despesa com status "pago".
- "recebi", "ganhei", "vendi", "caiu", "entrou", "depositaram" e "recebi um PIX" = receita com status "recebido".
- "vou pagar", "preciso pagar", "vence", "conta para pagar" e "a pagar" = despesa com status "pendente".
- "vou receber", "tenho para receber" e "a receber" = receita com status "pendente".
- Só use "pendente" quando a mensagem indicar claramente uma movimentação futura ou ainda não realizada.

INFERÊNCIA DE DATA:
- Quando não houver data, use ${hoje}.
- "hoje" = ${hoje}.
- Interprete ontem, amanhã, dias da semana e datas faladas considerando a data atual.
- Não pergunte a data quando ela não for informada; use hoje.

INFERÊNCIA DE CATEGORIA:
- mercado, supermercado, atacado, açougue, feira e hortifrúti = Mercado.
- restaurante, lanche, pizza, almoço, jantar, café, padaria, delivery e iFood = Alimentação.
- Uber, 99, táxi, ônibus, metrô, passagem e estacionamento = Transporte.
- gasolina, diesel, etanol, combustível e posto = Combustível.
- aluguel, condomínio, IPTU, imóvel e prestação da casa = Moradia.
- luz, água, gás, internet e telefone = Contas.
- farmácia, remédio, médico, consulta, exame e hospital = Saúde.
- escola, faculdade, curso e material escolar = Educação.
- Netflix, Spotify, assinatura, aplicativo e mensalidade digital = Assinaturas.
- cinema, festa, jogo, passeio e entretenimento = Lazer.
- salário, pagamento do trabalho e pró-labore = Salário.
- venda, cliente e serviço prestado = Vendas.
- investimento, aplicação e rendimento = Investimentos.
- Quando nenhuma categoria específica servir, use Outros.

DESCRIÇÃO:
- Use uma descrição curta baseada no estabelecimento, item ou finalidade.
- "Gastei 35 no mercado" deve usar descrição "Mercado" e categoria "Mercado".
- "Uber 22" deve usar descrição "Uber" e categoria "Transporte".
- "Abasteci 100" deve usar descrição "Combustível" e categoria "Combustível".
- "iFood 65" deve usar descrição "iFood" e categoria "Alimentação".

VALORES:
- Entenda números escritos em algarismos ou por extenso.
- "trinta e cinco" = 35.
- "mil e duzentos" = 1200.
- "quarenta e nove e noventa" = 49,90.
- "1.500" em contexto brasileiro normalmente significa 1500.
- "49,90" significa 49.90.
- Nunca pergunte o valor quando ele já estiver explícito ou puder ser claramente interpretado.

VÁRIAS TRANSAÇÕES:
- Uma mensagem pode conter várias movimentações.
- Chame registrar_transacao uma vez para cada movimentação.
- "Gastei 35 no mercado e 180 no posto" gera duas chamadas.

QUANDO PERGUNTAR:
- Pergunte somente quando faltar o valor da movimentação.
- Exemplo: "Paguei o mercado" → pergunte apenas "Qual foi o valor?".
- Caso seja impossível saber se é receita ou despesa, faça uma pergunta curta.
- Não pergunte categoria, status ou data quando puder usar as regras acima.

NÃO REGISTRAR:
- Não registre perguntas, hipóteses, simulações ou exemplos.
- "Posso gastar R$ 500?" é uma pergunta, não uma despesa.
- "Se eu comprar algo por R$ 100" é uma simulação.
- "Quanto gastei no mercado?" é uma consulta.

EXEMPLOS OBRIGATÓRIOS:
Usuário: "Gastei 35 reais no mercado."
Ação: registrar despesa de 35, descrição Mercado, categoria Mercado, data ${hoje}, status pago.

Usuário: "Paguei 120 de internet."
Ação: registrar despesa de 120, descrição Internet, categoria Contas, data ${hoje}, status pago.

Usuário: "Recebi 1.500 do cliente."
Ação: registrar receita de 1500, descrição Pagamento de cliente, categoria Vendas, data ${hoje}, status recebido.

Usuário: "Vou pagar 800 de aluguel amanhã."
Ação: registrar despesa de 800, descrição Aluguel, categoria Moradia, data de amanhã, status pendente.

Usuário: "Comprei no mercado."
Resposta: perguntar somente o valor.

Nunca diga que uma transação foi registrada sem executar registrar_transacao.

Responda sempre em português do Brasil.

DADOS FINANCEIROS DO USUÁRIO:
${JSON.stringify(resumo)}

INSIGHTS FINANCEIROS CALCULADOS:
${JSON.stringify(insights)}

Use esses insights quando o usuário perguntar:
- como estão minhas finanças;
- onde estou gastando mais;
- qual foi minha maior despesa;
- quanto estou gastando por dia;
- quanto gastei neste mês.

Não invente valores ou insights diferentes dos dados fornecidos.
      `,
      input: [
        ...historico.map((item) => ({
          role: item.role,
          content: item.content,
        })),
        {
          role: "user",
          content: texto,
        },
      ] as OpenAI.Responses.ResponseInput,
      tools,
      tool_choice: "auto",
    });

  const chamadas = primeiraResposta.output.filter(
    (item) =>
      item.type === "function_call" &&
      item.name === "registrar_transacao",
  );

  if (chamadas.length === 0) {
    return {
      resposta:
        primeiraResposta.output_text ||
        "Não consegui gerar uma resposta agora.",
      acaoExecutada: false,
      transacoes: [],
    };
  }

  const transacoesRegistradas: RegistrarTransacaoArgs[] =
    [];

  for (const chamada of chamadas) {
    if (
      chamada.type !== "function_call" ||
      chamada.name !== "registrar_transacao"
    ) {
      continue;
    }

    let argumentos: RegistrarTransacaoArgs;

    try {
      argumentos = JSON.parse(
        chamada.arguments,
      ) as RegistrarTransacaoArgs;
    } catch (erro) {
      console.error(
        "Argumentos inválidos da ferramenta:",
        erro,
      );
      continue;
    }

    const resultado = await registrarTransacao({
      supabase,
      userId,
      argumentos,
      hoje,
    });

    if (resultado.sucesso) {
      transacoesRegistradas.push(
        resultado.transacao,
      );
    } else {
      console.error(
        "Erro ao registrar transação:",
        resultado,
      );
    }
  }

  if (transacoesRegistradas.length === 0) {
    return {
      resposta:
        "Entendi a movimentação, mas não consegui salvá-la. Tente novamente.",
      acaoExecutada: false,
      transacoes: [],
    };
  }

  return {
    resposta: criarConfirmacao(
      transacoesRegistradas,
    ),
    acaoExecutada: true,
    transacoes: transacoesRegistradas,
  };
}
