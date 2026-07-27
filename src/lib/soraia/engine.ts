import OpenAI from "openai";

import {
  adicionarAporteMetaSoraia,
  criarMetaSoraia,
  registrarTransacao,
} from "@/lib/soraia/actions";
import { gerarInsights } from "@/lib/soraia/insights";
import type {
  AdicionarAporteMetaArgs,
  CriarMetaArgs,
  MetaFinanceira,
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
  {
    type: "function" as const,
    name: "criar_meta",
    description:
      "Cria uma nova meta financeira quando o usuário expressa claramente que deseja criar, definir ou montar uma meta e informa o valor desejado.",
    strict: true,
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        nome: {
          type: "string",
          description:
            "Nome curto da meta, como Reserva de emergência, Viagem, Carro ou Casa própria.",
        },
        valor_meta: {
          type: "number",
          description:
            "Valor total positivo que o usuário deseja alcançar.",
        },
        prazo: {
          type: "string",
          description:
            "Prazo no formato YYYY-MM-DD. Use string vazia quando o usuário não informar prazo.",
        },
      },
      required: [
        "nome",
        "valor_meta",
        "prazo",
      ],
    },
  },
  {
    type: "function" as const,
    name: "adicionar_aporte_meta",
    description:
      "Adiciona dinheiro a uma meta existente quando o usuário diz que guardou, reservou, colocou ou adicionou determinado valor naquela meta.",
    strict: true,
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        nome_meta: {
          type: "string",
          description:
            "Nome da meta existente mencionada pelo usuário.",
        },
        valor: {
          type: "number",
          description:
            "Valor positivo que deve ser adicionado à meta.",
        },
      },
      required: [
        "nome_meta",
        "valor",
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

  const {
    data: dadosMetas,
    error: erroMetas,
  } = await supabase
    .from("metas")
    .select(
      "id, nome, valor_atual, valor_meta, prazo",
    )
    .eq("user_id", userId)
    .order("created_at", {
      ascending: true,
    });

  if (erroMetas) {
    console.error(
      "Erro ao carregar metas:",
      erroMetas,
    );
  }

  const metas = (
    dadosMetas ?? []
  ) as MetaFinanceira[];

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

METAS FINANCEIRAS:
- Quando o usuário pedir claramente para criar, definir ou montar uma meta e informar o valor total desejado, execute criar_meta.
- Não confunda uma meta com uma despesa.
- "Quero criar uma meta de R$ 10.000 para viajar" cria uma meta e não registra despesa.
- "Minha meta é guardar R$ 5.000 até dezembro" cria uma meta.
- Quando houver um prazo, converta-o para YYYY-MM-DD considerando a data atual.
- Quando não houver prazo, use uma string vazia.
- Quando o usuário disser que guardou, reservou, colocou ou adicionou dinheiro em uma meta existente, execute adicionar_aporte_meta.
- "Guardei R$ 500 na reserva de emergência" adiciona um aporte à meta e não registra uma despesa.
- Para consultas sobre metas, use os dados fornecidos e não execute ferramentas.
- Não crie uma meta em perguntas hipotéticas ou simulações.
- Nunca diga que uma meta foi criada ou recebeu aporte sem executar a ferramenta correspondente.

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

METAS FINANCEIRAS DO USUÁRIO:
${JSON.stringify(metas)}

Ao responder sobre metas:
- valor restante = valor_meta menos valor_atual;
- progresso percentual = valor_atual dividido por valor_meta;
- nunca invente metas, valores ou prazos;
- quando houver prazo, informe quanto falta guardar por mês apenas quando isso for solicitado ou útil.

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
    (item) => item.type === "function_call",
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

  const transacoesRegistradas:
    RegistrarTransacaoArgs[] = [];

  const confirmacoes: string[] = [];
  const errosFerramentas: string[] = [];

  for (const chamada of chamadas) {
    if (chamada.type !== "function_call") {
      continue;
    }

    if (chamada.name === "registrar_transacao") {
      let argumentos: RegistrarTransacaoArgs;

      try {
        argumentos = JSON.parse(
          chamada.arguments,
        ) as RegistrarTransacaoArgs;
      } catch (erro) {
        console.error(
          "Argumentos inválidos da transação:",
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
        errosFerramentas.push(resultado.erro);
      }

      continue;
    }

    if (chamada.name === "criar_meta") {
      let argumentos: CriarMetaArgs;

      try {
        argumentos = JSON.parse(
          chamada.arguments,
        ) as CriarMetaArgs;
      } catch (erro) {
        console.error(
          "Argumentos inválidos da meta:",
          erro,
        );
        continue;
      }

      const resultado = await criarMetaSoraia({
        supabase,
        userId,
        argumentos,
      });

      if (resultado.sucesso) {
        const prazoTexto = resultado.meta.prazo
          ? `, com prazo até ${new Intl.DateTimeFormat(
              "pt-BR",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                timeZone: "UTC",
              },
            ).format(
              new Date(
                `${resultado.meta.prazo}T00:00:00Z`,
              ),
            )}`
          : "";

        confirmacoes.push(
          `Pronto! Criei a meta "${resultado.meta.nome}" no valor de ${moeda(
            Number(resultado.meta.valor_meta),
          )}${prazoTexto}. 🎯`,
        );
      } else {
        errosFerramentas.push(resultado.erro);
      }

      continue;
    }

    if (
      chamada.name === "adicionar_aporte_meta"
    ) {
      let argumentos: AdicionarAporteMetaArgs;

      try {
        argumentos = JSON.parse(
          chamada.arguments,
        ) as AdicionarAporteMetaArgs;
      } catch (erro) {
        console.error(
          "Argumentos inválidos do aporte:",
          erro,
        );
        continue;
      }

      const resultado =
        await adicionarAporteMetaSoraia({
          supabase,
          userId,
          argumentos,
        });

      if (resultado.sucesso) {
        const restante = Math.max(
          Number(resultado.meta.valor_meta) -
            Number(resultado.meta.valor_atual),
          0,
        );

        confirmacoes.push(
          `Pronto! Adicionei ${moeda(
            resultado.valor_aporte,
          )} à meta "${resultado.meta.nome}". Agora ela está com ${moeda(
            Number(resultado.meta.valor_atual),
          )} e faltam ${moeda(restante)}. ✅`,
        );
      } else {
        errosFerramentas.push(resultado.erro);
      }
    }
  }

  if (transacoesRegistradas.length > 0) {
    confirmacoes.unshift(
      criarConfirmacao(transacoesRegistradas),
    );
  }

  if (confirmacoes.length === 0) {
    return {
      resposta:
        errosFerramentas[0] ||
        "Entendi o pedido, mas não consegui salvar. Tente novamente.",
      acaoExecutada: false,
      transacoes: [],
    };
  }

  return {
    resposta: confirmacoes.join("\n\n"),
    acaoExecutada: true,
    transacoes: transacoesRegistradas,
  };
}
