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
      console.error("Erro ao carregar transações:", transactionsError);

      return NextResponse.json(
        {
          error: "Não foi possível carregar seus dados financeiros.",
        },
        { status: 500 },
      );
    }

    const transactions = (data ?? []) as Transaction[];

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const receitasRecebidas = transactions
      .filter(
        (item) =>
          item.tipo === "receita" && item.status === "recebido",
      )
      .reduce((total, item) => total + Number(item.valor), 0);

    const despesasPagas = transactions
      .filter(
        (item) =>
          item.tipo === "despesa" && item.status === "pago",
      )
      .reduce((total, item) => total + Number(item.valor), 0);

    const receitasPendentes = transactions
      .filter(
        (item) =>
          item.tipo === "receita" && item.status === "pendente",
      )
      .reduce((total, item) => total + Number(item.valor), 0);

    const despesasPendentes = transactions
      .filter(
        (item) =>
          item.tipo === "despesa" && item.status === "pendente",
      )
      .reduce((total, item) => total + Number(item.valor), 0);

    const saldoAtual = receitasRecebidas - despesasPagas;

    const saldoPrevisto =
      saldoAtual + receitasPendentes - despesasPendentes;

    const atrasados = transactions.filter((item) => {
      if (item.status !== "pendente") {
        return false;
      }

      const dataItem = new Date(`${item.data}T00:00:00`);

      return dataItem < hoje;
    });

    const proximosCompromissos = transactions
      .filter((item) => item.status === "pendente")
      .slice(0, 10);

    const formatarMoeda = (valor: number) =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valor);

    const contextoFinanceiro = `
Resumo financeiro do usuário:

Saldo atual: ${formatarMoeda(saldoAtual)}
Receitas recebidas: ${formatarMoeda(receitasRecebidas)}
Despesas pagas: ${formatarMoeda(despesasPagas)}
Receitas pendentes: ${formatarMoeda(receitasPendentes)}
Despesas pendentes: ${formatarMoeda(despesasPendentes)}
Saldo previsto: ${formatarMoeda(saldoPrevisto)}
Quantidade de compromissos atrasados: ${atrasados.length}

Próximos compromissos:
${
  proximosCompromissos.length > 0
    ? proximosCompromissos
        .map(
          (item) =>
            `- ${item.descricao}: ${formatarMoeda(
              Number(item.valor),
            )}, tipo ${item.tipo}, data ${item.data}, status ${item.status}`,
        )
        .join("\n")
    : "Nenhum compromisso pendente."
}
`;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          resposta:
            "O assistente inteligente está temporariamente indisponível. Você ainda pode gerenciar suas receitas, despesas e compromissos normalmente.",
          indisponivel: true,
        },
        { status: 200 },
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      maxRetries: 0,
    });

    try {
      const response = await openai.responses.create({
        model: "gpt-5-mini",
        instructions: `
Você é a Soraia, uma assistente brasileira de finanças pessoais.

Responda sempre em português do Brasil.

Use somente os dados financeiros fornecidos no contexto.
Não invente valores, datas ou transações.

Seja clara, acolhedora, objetiva e prática.

Você pode:
- informar saldo atual;
- explicar compromissos futuros;
- identificar riscos financeiros;
- sugerir organização de gastos;
- ajudar o usuário a planejar pagamentos.

Não se apresente como contadora, economista ou consultora de investimentos.

Contexto financeiro:
${contextoFinanceiro}
        `,
        input: mensagem,
      });

      return NextResponse.json({
        resposta:
          response.output_text ||
          "Não consegui elaborar uma resposta neste momento.",
        indisponivel: false,
      });
    } catch (error) {
      console.error("Erro da OpenAI:", error);

      if (error instanceof OpenAI.RateLimitError) {
        return NextResponse.json(
          {
            resposta:
              "O assistente inteligente está temporariamente indisponível porque o limite da inteligência artificial ainda não está ativo. Você pode continuar usando normalmente as áreas de finanças, agenda e visão geral.",
            indisponivel: true,
          },
          { status: 200 },
        );
      }

      if (error instanceof OpenAI.AuthenticationError) {
        return NextResponse.json(
          {
            resposta:
              "O assistente inteligente ainda não foi configurado corretamente. As outras funções da Soraia continuam disponíveis.",
            indisponivel: true,
          },
          { status: 200 },
        );
      }

      return NextResponse.json(
        {
          resposta:
            "A Soraia está temporariamente indisponível. Tente novamente mais tarde.",
          indisponivel: true,
        },
        { status: 200 },
      );
    }
  } catch (error) {
    console.error("Erro na rota do assistente:", error);

    return NextResponse.json(
      {
        error: "Não foi possível processar sua mensagem.",
      },
      { status: 500 },
    );
  }
}
