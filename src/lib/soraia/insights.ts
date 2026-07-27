import type { Transaction } from "@/lib/soraia/types";

export type TipoInsight =
  | "positivo"
  | "alerta"
  | "informativo";

export type Insight = {
  id: string;
  tipo: TipoInsight;
  titulo: string;
  mensagem: string;
  valor?: number;
  categoria?: string;
};

function moeda(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

function obterDataAtualBrasil() {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const ano = Number(
    partes.find((parte) => parte.type === "year")?.value,
  );

  const mes = Number(
    partes.find((parte) => parte.type === "month")?.value,
  );

  const dia = Number(
    partes.find((parte) => parte.type === "day")?.value,
  );

  return {
    ano,
    mes,
    dia,
  };
}

function pertenceAoMes(
  data: string,
  ano: number,
  mes: number,
) {
  const [anoTransacao, mesTransacao] = data
    .split("-")
    .map(Number);

  return (
    anoTransacao === ano &&
    mesTransacao === mes
  );
}

function pertenceAoMesAtual(data: string) {
  const hoje = obterDataAtualBrasil();

  return pertenceAoMes(
    data,
    hoje.ano,
    hoje.mes,
  );
}

function obterMesAnterior() {
  const hoje = obterDataAtualBrasil();

  if (hoje.mes === 1) {
    return {
      ano: hoje.ano - 1,
      mes: 12,
    };
  }

  return {
    ano: hoje.ano,
    mes: hoje.mes - 1,
  };
}

export function gerarInsights(
  transactions: Transaction[],
): Insight[] {
  const insights: Insight[] = [];

  const receitasRecebidas = transactions
    .filter(
      (transacao) =>
        transacao.tipo === "receita" &&
        transacao.status === "recebido",
    )
    .reduce(
      (total, transacao) =>
        total + Number(transacao.valor),
      0,
    );

  const despesasPagas = transactions
    .filter(
      (transacao) =>
        transacao.tipo === "despesa" &&
        transacao.status === "pago",
    )
    .reduce(
      (total, transacao) =>
        total + Number(transacao.valor),
      0,
    );

  const receitasPendentes = transactions
    .filter(
      (transacao) =>
        transacao.tipo === "receita" &&
        transacao.status === "pendente",
    )
    .reduce(
      (total, transacao) =>
        total + Number(transacao.valor),
      0,
    );

  const despesasPendentes = transactions
    .filter(
      (transacao) =>
        transacao.tipo === "despesa" &&
        transacao.status === "pendente",
    )
    .reduce(
      (total, transacao) =>
        total + Number(transacao.valor),
      0,
    );

  const saldoAtual =
    receitasRecebidas - despesasPagas;

  const saldoPrevisto =
    saldoAtual +
    receitasPendentes -
    despesasPendentes;

  if (saldoPrevisto < 0) {
    insights.push({
      id: "risco-saldo-negativo",
      tipo: "alerta",
      titulo: "Risco no saldo previsto",
      mensagem: `Seus compromissos pendentes podem deixar seu saldo negativo em ${moeda(
        Math.abs(saldoPrevisto),
      )}. Revise os próximos pagamentos ou planeje novas entradas.`,
      valor: saldoPrevisto,
    });
  } else if (
    despesasPendentes > 0 &&
    saldoPrevisto >= 0
  ) {
    insights.push({
      id: "saldo-previsto-positivo",
      tipo: "positivo",
      titulo: "Saldo previsto positivo",
      mensagem: `Após considerar os compromissos pendentes, seu saldo previsto é de ${moeda(
        saldoPrevisto,
      )}.`,
      valor: saldoPrevisto,
    });
  }

  const despesasDoMes = transactions.filter(
    (transacao) =>
      transacao.tipo === "despesa" &&
      transacao.status === "pago" &&
      pertenceAoMesAtual(transacao.data),
  );

  const mesAnterior = obterMesAnterior();

  const despesasMesAnterior = transactions.filter(
    (transacao) =>
      transacao.tipo === "despesa" &&
      transacao.status === "pago" &&
      pertenceAoMes(
        transacao.data,
        mesAnterior.ano,
        mesAnterior.mes,
      ),
  );

  if (despesasDoMes.length === 0) {
    insights.push({
      id: "sem-despesas",
      tipo: "informativo",
      titulo: "Nenhuma despesa registrada",
      mensagem:
        "Você ainda não possui despesas pagas registradas neste mês.",
    });

    return insights;
  }

  const totalDespesas = despesasDoMes.reduce(
    (total, transacao) =>
      total + Number(transacao.valor),
    0,
  );

  const totalMesAnterior =
    despesasMesAnterior.reduce(
      (total, transacao) =>
        total + Number(transacao.valor),
      0,
    );

  if (totalMesAnterior > 0) {
    const variacao =
      ((totalDespesas - totalMesAnterior) /
        totalMesAnterior) *
      100;

    const percentual = Math.abs(
      Math.round(variacao),
    );

    if (variacao > 0) {
      insights.push({
        id: "comparacao-mes-anterior",
        tipo: "alerta",
        titulo: "Comparação mensal",
        mensagem: `Você gastou ${percentual}% a mais que no mês passado. Neste mês foram ${moeda(
          totalDespesas,
        )}, contra ${moeda(
          totalMesAnterior,
        )} no mês anterior.`,
        valor: totalDespesas,
      });
    } else if (variacao < 0) {
      insights.push({
        id: "comparacao-mes-anterior",
        tipo: "positivo",
        titulo: "Comparação mensal",
        mensagem: `Você gastou ${percentual}% a menos que no mês passado. Neste mês foram ${moeda(
          totalDespesas,
        )}, contra ${moeda(
          totalMesAnterior,
        )} no mês anterior.`,
        valor: totalDespesas,
      });
    } else {
      insights.push({
        id: "comparacao-mes-anterior",
        tipo: "informativo",
        titulo: "Comparação mensal",
        mensagem: `Seus gastos permaneceram iguais aos do mês passado: ${moeda(
          totalDespesas,
        )}.`,
        valor: totalDespesas,
      });
    }
  }

  const totaisPorCategoria = new Map<
    string,
    number
  >();

  for (const despesa of despesasDoMes) {
    const categoria =
      despesa.categoria?.trim() || "Outros";

    const totalAtual =
      totaisPorCategoria.get(categoria) ?? 0;

    totaisPorCategoria.set(
      categoria,
      totalAtual + Number(despesa.valor),
    );
  }

  const maiorCategoria = Array.from(
    totaisPorCategoria.entries(),
  ).sort((a, b) => b[1] - a[1])[0];

  if (maiorCategoria) {
    const [categoria, valor] = maiorCategoria;

    const percentual =
      totalDespesas > 0
        ? Math.round((valor / totalDespesas) * 100)
        : 0;

    insights.push({
      id: "maior-categoria",
      tipo: "alerta",
      titulo: "Maior categoria do mês",
      mensagem: `Você gastou ${moeda(
        valor,
      )} com ${categoria}. Isso representa ${percentual}% das suas despesas pagas neste mês.`,
      valor,
      categoria,
    });
  }

  const maiorDespesa = [...despesasDoMes].sort(
    (a, b) =>
      Number(b.valor) - Number(a.valor),
  )[0];

  if (maiorDespesa) {
    insights.push({
      id: "maior-despesa",
      tipo: "informativo",
      titulo: "Maior despesa do mês",
      mensagem: `${maiorDespesa.descricao}: ${moeda(
        Number(maiorDespesa.valor),
      )}.`,
      valor: Number(maiorDespesa.valor),
      categoria:
        maiorDespesa.categoria ?? "Outros",
    });
  }

  const hoje = obterDataAtualBrasil();
  const mediaDiaria =
    totalDespesas / Math.max(hoje.dia, 1);

  insights.push({
    id: "media-diaria",
    tipo: "informativo",
    titulo: "Média diária de gastos",
    mensagem: `Sua média de despesas pagas está em ${moeda(
      mediaDiaria,
    )} por dia neste mês.`,
    valor: mediaDiaria,
  });

  insights.push({
    id: "total-despesas",
    tipo: "informativo",
    titulo: "Total gasto no mês",
    mensagem: `Você já registrou ${moeda(
      totalDespesas,
    )} em despesas pagas neste mês.`,
    valor: totalDespesas,
  });

  insights.push({
    id: "quantidade-despesas",
    tipo: "positivo",
    titulo: "Movimentações acompanhadas",
    mensagem: `A Soraia analisou ${despesasDoMes.length} ${
      despesasDoMes.length === 1
        ? "despesa paga"
        : "despesas pagas"
    } neste mês.`,
  });

  return insights;
}
