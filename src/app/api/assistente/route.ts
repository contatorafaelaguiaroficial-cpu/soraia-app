import { NextResponse } from "next/server";
import OpenAI from "openai";

import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type Transaction = {
  tipo: "receita" | "despesa";
  descricao: string;
  valor: number;
  categoria: string | null;
  data: string;
  status: "pendente" | "pago" | "recebido";
};

type RegistrarTransacaoArgs = {
  tipo: "receita" | "despesa";
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  status: "pendente" | "pago" | "recebido";
};

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

  const saldoAtual = receitasRecebidas - despesasPagas;
  const saldoPrevisto =
    saldoAtual + receitasPendentes - despesasPendentes;

  const recentes = transactions
    .slice(-20)
    .map((item) => ({
      tipo: item.tipo,
      descricao: item.descricao,
      valor: Number(item.valor),
      categoria: item.categoria,
      data: item.data,
      status: item.status,
    }));

  return {
    saldo_atual: saldoAtual,
    saldo_previsto: saldoPrevisto,
    receitas_recebidas: receitasRecebidas,
    despesas_pagas: despesasPagas,
    receitas_pendentes: receitasPendentes,
    despesas_pendentes: despesasPendentes,
    transacoes_recentes: recentes,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const mensagem = String(body?.mensagem ?? "").trim();

    if (!mensagem) {
      return NextResponse.json(
        {
          error: "Digite uma mensagem para conversar com a Soraia.",
        },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          error: "Você precisa estar conectado para usar a Soraia.",
        },
        { status: 401 },
      );
    }

    const { data, error: transactionsError } = await supabase
      .from("transactions")
      .select("tipo, descricao, valor, categoria, data, status")
      .eq("user_id", user.id)
      .order("data", { ascending: true });

    if (transactionsError) {
      console.error(
        "Erro ao carregar transações:",
        transactionsError,
      );

      return NextResponse.json(
        {
          error: "Não foi possível carregar seus dados financeiros.",
        },
        { status: 500 },
      );
    }

    const transactions = (data ?? []) as Transaction[];
    const resumo = resumirTransacoes(transactions);
    const hoje = dataHojeBrasil();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        resposta:
          "O assistente inteligente está temporariamente indisponível. Tente novamente em alguns instantes.",
        indisponivel: true,
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const tools = [
      {
        type: "function" as const,
        name: "registrar_transacao",
        description:
          "Registra uma despesa ou receita financeira do usuário no banco de dados. Use somente quando o usuário afirmar que realizou, recebeu, pagou ou deseja lançar uma transação.",
        strict: true,
        parameters: {
          type: "object",
          additionalProperties: false,
          properties: {
            tipo: {
              type: "string",
              enum: ["receita", "despesa"],
              description:
                "Use despesa para dinheiro gasto ou pago e receita para dinheiro recebido.",
            },
            descricao: {
              type: "string",
              description:
                "Descrição curta e objetiva. Exemplo: Mercado, Salário, Gasolina ou Aluguel.",
            },
            valor: {
              type: "number",
              description:
                "Valor positivo da transação, sem símbolo de moeda.",
            },
            categoria: {
              type: "string",
              description:
                "Categoria financeira adequada, como Alimentação, Moradia, Transporte, Saúde, Lazer, Salário, Vendas, Investimentos ou Outros.",
            },
            data: {
              type: "string",
              description:
                "Data da transação no formato YYYY-MM-DD.",
            },
            status: {
              type: "string",
              enum: ["pendente", "pago", "recebido"],
              description:
                "Despesa já realizada deve ser pago. Receita já recebida deve ser recebido. Use pendente somente para algo futuro ou ainda não realizado.",
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

    const primeiraResposta = await openai.responses.create({
      model: "gpt-5-mini",
      store: false,
      instructions: `
Você é a Soraia, uma assistente financeira pessoal brasileira.

Data de hoje no Brasil: ${hoje}.

Você pode conversar, analisar as finanças e registrar receitas e despesas.

REGRAS PARA REGISTRO:
- Quando o usuário disser que gastou, pagou, comprou ou teve uma despesa, use registrar_transacao com tipo "despesa".
- Quando disser que recebeu, ganhou, vendeu ou entrou dinheiro, use tipo "receita".
- "Gastei", "paguei", "comprei" e equivalentes significam status "pago".
- "Recebi", "caiu o salário", "entrou um PIX" e equivalentes significam status "recebido".
- Algo que ainda vai vencer, pagar ou receber deve ser "pendente".
- Converta valores brasileiros corretamente. Exemplo: "1.500" normalmente significa 1500.
- Quando a data não for informada, use ${hoje}.
- Não registre transação quando o usuário estiver apenas perguntando, simulando ou dando um exemplo.
- Não invente valores ou dados ausentes.
- Se não houver valor claro, faça uma pergunta curta antes de registrar.
- Não registre metas como transações.
- Não diga que registrou algo sem realmente chamar a função.
- Responda sempre em português do Brasil.
- Seja objetiva, prática, acolhedora e evite respostas excessivamente longas.

DADOS FINANCEIROS ATUAIS DO USUÁRIO:
${JSON.stringify(resumo)}
      `,
      input: mensagem,
      tools,
      tool_choice: "auto",
    });

    const chamadas = primeiraResposta.output.filter(
      (item) => item.type === "function_call",
    );

    if (chamadas.length === 0) {
      return NextResponse.json({
        resposta:
          primeiraResposta.output_text ||
          "Não consegui gerar uma resposta agora.",
      });
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
            erro: "Os dados da transação estavam inválidos.",
          }),
        });
        continue;
      }

      const valor = Number(argumentos.valor);

      if (!Number.isFinite(valor) || valor <= 0) {
        resultadosFerramentas.push({
          type: "function_call_output",
          call_id: chamada.call_id,
          output: JSON.stringify({
            sucesso: false,
            erro: "O valor precisa ser maior que zero.",
          }),
        });
        continue;
      }

      const statusCorreto =
        argumentos.tipo === "despesa"
          ? argumentos.status === "recebido"
            ? "pago"
            : argumentos.status
          : argumentos.status === "pago"
            ? "recebido"
            : argumentos.status;

      const transacao = {
        user_id: user.id,
        tipo: argumentos.tipo,
        descricao: argumentos.descricao.trim(),
        valor,
        categoria: argumentos.categoria.trim() || "Outros",
        data: argumentos.data || hoje,
        status: statusCorreto,
      };

      const { data: transacaoCriada, error: insertError } =
        await supabase
          .from("transactions")
          .insert(transacao)
          .select(
            "tipo, descricao, valor, categoria, data, status",
          )
          .single();

      if (insertError) {
        console.error(
          "Erro ao registrar transação:",
          insertError,
        );

        resultadosFerramentas.push({
          type: "function_call_output",
          call_id: chamada.call_id,
          output: JSON.stringify({
            sucesso: false,
            erro: "Não foi possível salvar a transação.",
          }),
        });

        continue;
      }

      transacoesRegistradas.push(
        transacaoCriada as RegistrarTransacaoArgs,
      );

      resultadosFerramentas.push({
        type: "function_call_output",
        call_id: chamada.call_id,
        output: JSON.stringify({
          sucesso: true,
          transacao: transacaoCriada,
        }),
      });
    }

    if (resultadosFerramentas.length === 0) {
      return NextResponse.json({
        resposta:
          primeiraResposta.output_text ||
          "Não consegui concluir essa ação.",
      });
    }

    const respostaFinal = await openai.responses.create({
      model: "gpt-5-mini",
      store: false,
      instructions: `
Você é a Soraia, assistente financeira pessoal.

Responda em português do Brasil.
Confirme de forma curta e clara o resultado da ação.
Use valores no formato brasileiro, como R$ 35,00.
Não diga que salvou algo quando o resultado indicar falha.
Não ofereça uma lista longa de próximos passos.
      `,
      input: [
        ...primeiraResposta.output,
        ...resultadosFerramentas,
      ] as OpenAI.Responses.ResponseInput,
      tools,
    });

    let textoFinal = respostaFinal.output_text;

    if (!textoFinal && transacoesRegistradas.length === 1) {
      const item = transacoesRegistradas[0];

      textoFinal =
        item.tipo === "despesa"
          ? `Pronto! Registrei a despesa de ${moeda(item.valor)} em ${item.descricao}.`
          : `Pronto! Registrei a receita de ${moeda(item.valor)} referente a ${item.descricao}.`;
    }

    return NextResponse.json({
      resposta:
        textoFinal ||
        "Pronto! A transação foi registrada.",
      acaoExecutada: transacoesRegistradas.length > 0,
      transacoes: transacoesRegistradas,
    });
  } catch (error) {
    console.error("Erro no assistente:", error);

    if (error instanceof OpenAI.AuthenticationError) {
      return NextResponse.json({
        resposta:
          "A configuração do assistente precisa ser atualizada.",
        indisponivel: true,
      });
    }

    if (error instanceof OpenAI.RateLimitError) {
      return NextResponse.json({
        resposta:
          "O assistente está temporariamente com uso elevado. Tente novamente em alguns instantes.",
        indisponivel: true,
      });
    }

    return NextResponse.json(
      {
        resposta:
          "Não consegui processar sua solicitação agora. Tente novamente.",
      },
      { status: 500 },
    );
  }
}
