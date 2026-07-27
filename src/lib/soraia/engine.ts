import OpenAI from "openai";

import { registrarTransacao } from "@/lib/soraia/actions";
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
    .reduce((total, item) => total + Number(item.valor), 0);

  const despesasPagas = transactions
    .filter(
      (item) =>
        item.tipo === "despesa" &&
        item.status === "pago",
    )
    .reduce((total, item) => total + Number(item.valor), 0);

  const receitasPendentes = transactions
    .filter(
      (item) =>
        item.tipo === "receita" &&
        item.status === "pendente",
    )
    .reduce((total, item) => total + Number(item.valor), 0);

  const despesasPendentes = transactions
    .filter(
      (item) =>
        item.tipo === "despesa" &&
        item.status === "pendente",
    )
    .reduce((total, item) => total + Number(item.valor), 0);

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
      "Registra uma ou mais receitas ou despesas financeiras. Pode ser chamada várias vezes quando a mensagem contém várias transações.",
    strict: true,
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        tipo: {
          type: "string",
          enum: ["receita", "despesa"],
        },
        descricao: {
          type: "string",
          description:
            "Descrição curta, como Mercado, Gasolina, Salário ou PIX do João.",
        },
        valor: {
          type: "number",
          description:
            "Valor positivo, sem símbolo de moeda.",
        },
        categoria: {
          type: "string",
          description:
            "Categoria adequada: Alimentação, Moradia, Transporte, Saúde, Lazer, Salário, Vendas, Investimentos ou Outros.",
        },
        data: {
          type: "string",
          description: "Data no formato YYYY-MM-DD.",
        },
        status: {
          type: "string",
          enum: ["pendente", "pago", "recebido"],
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

export async function processarMensagem(
  params: ProcessarMensagemParams,
): Promise<ResultadoProcessamento> {
  const { mensagem, userId, origem, supabase } = params;

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY não configurada.");
  }

  const texto = mensagem.trim();

  if (!texto) {
    throw new Error("A mensagem está vazia.");
  }

  const { data, error } = await supabase
    .from("transactions")
    .select("tipo, descricao, valor, categoria, data, status")
    .eq("user_id", userId)
    .order("data", { ascending: true });

  if (error) {
    console.error("Erro ao carregar transações:", error);
    throw new Error("Não foi possível carregar os dados financeiros.");
  }

  const transactions = (data ?? []) as Transaction[];
  const resumo = resumirTransacoes(transactions);
  const hoje = dataHojeBrasil();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const primeiraResposta = await openai.responses.create({
    model: "gpt-5-mini",
    store: false,
    instructions: `
Você é a Soraia, uma assistente financeira pessoal brasileira.

Data atual no Brasil: ${hoje}.
Origem desta mensagem: ${origem}.

Você conversa, analisa finanças e registra receitas e despesas.

REGRAS OBRIGATÓRIAS:
- Quando o usuário afirmar que gastou, pagou ou comprou algo, registre uma despesa.
- Quando afirmar que recebeu, ganhou, vendeu ou entrou dinheiro, registre uma receita.
- "Gastei", "paguei" e "comprei" indicam status "pago".
- "Recebi", "entrou um PIX" e "caiu o salário" indicam status "recebido".
- Algo que ainda será pago ou recebido deve ficar "pendente".
- Quando não houver data, use ${hoje}.
- Entenda números falados ou transcritos, como "trinta e cinco", "mil e duzentos" e "quarenta e nove e noventa".
- Converta corretamente formatos brasileiros: "1.500" pode representar 1500 e "49,90" representa 49.90.
- Uma mensagem pode conter várias transações. Chame registrar_transacao uma vez para cada uma.
- Exemplo: "gastei 35 no mercado e 180 no posto" deve gerar duas despesas.
- Não registre simulações, perguntas ou exemplos.
- Não invente valor, descrição ou data.
- Quando faltar um valor essencial, faça uma pergunta curta.
- Não diga que registrou algo sem executar a ferramenta.
- Responda em português do Brasil, de forma objetiva e acolhedora.

DADOS FINANCEIROS:
${JSON.stringify(resumo)}
    `,
    input: texto,
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

  const resultadosFerramentas: Array<{
    type: "function_call_output";
    call_id: string;
    output: string;
  }> = [];

  const transacoesRegistradas: RegistrarTransacaoArgs[] = [];

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
    } catch {
      resultadosFerramentas.push({
        type: "function_call_output",
        call_id: chamada.call_id,
        output: JSON.stringify({
          sucesso: false,
          erro: "Dados inválidos.",
        }),
      });

      continue;
    }

    const resultado = await registrarTransacao({
      supabase,
      userId,
      argumentos,
      hoje,
    });

    if (resultado.sucesso) {
      transacoesRegistradas.push(resultado.transacao);
    }

    resultadosFerramentas.push({
      type: "function_call_output",
      call_id: chamada.call_id,
      output: JSON.stringify(resultado),
    });
  }

  const respostaFinal = await openai.responses.create({
    model: "gpt-5-mini",
    store: false,
    instructions: `
Você é a Soraia.

Confirme de forma curta e clara as ações realizadas.
Responda em português do Brasil.
Formate dinheiro como R$ 35,00.
Quando houver várias transações, mostre uma linha para cada uma.
Não afirme que algo foi salvo quando o resultado indicar erro.
Não repita explicações longas.
    `,
    input: [
      ...primeiraResposta.output,
      ...resultadosFerramentas,
    ] as OpenAI.Responses.ResponseInput,
    tools,
  });

  let resposta = respostaFinal.output_text;

  if (!resposta && transacoesRegistradas.length === 1) {
    const item = transacoesRegistradas[0];

    resposta =
      item.tipo === "despesa"
        ? `Pronto! Registrei a despesa de ${moeda(item.valor)} em ${item.descricao}.`
        : `Pronto! Registrei a receita de ${moeda(item.valor)} referente a ${item.descricao}.`;
  }

  if (!resposta && transacoesRegistradas.length > 1) {
    resposta = `Pronto! Registrei ${transacoesRegistradas.length} transações.`;
  }

  return {
    resposta:
      resposta || "Não consegui concluir essa solicitação.",
    acaoExecutada: transacoesRegistradas.length > 0,
    transacoes: transacoesRegistradas,
  };
}
