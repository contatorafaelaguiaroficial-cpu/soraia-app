import { createClient } from "@/lib/supabase/server";
import DashboardHomeReal from "@/components/dashboard/home/DashboardHomeReal";
import { gerarInsights } from "@/lib/soraia/insights";
import type { Transaction } from "@/lib/soraia/types";

type Movimentacao = {
  id: string;
  tipo: "receita" | "despesa";
  descricao: string;
  valor: number | string;
  categoria: string;
  data: string;
  recorrente: boolean;
  status: "pendente" | "pago" | "recebido";
};

function obterHojeBrasil() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function obterInicioMes(data: string) {
  return `${data.slice(0, 7)}-01`;
}

function obterFimMes(data: string) {
  const [ano, mes] = data.split("-").map(Number);

  return new Date(Date.UTC(ano, mes, 0))
    .toISOString()
    .split("T")[0];
}

export default async function PainelPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const hoje = obterHojeBrasil();
  const inicioMes = obterInicioMes(hoje);
  const fimMes = obterFimMes(hoje);

  const { data, error } = user
    ? await supabase
        .from("transactions")
        .select(
          "id, tipo, descricao, valor, categoria, data, recorrente, status"
        )
        .eq("user_id", user.id)
        .order("data", { ascending: true })
    : { data: [], error: null };

  if (error) {
    console.error("Erro ao carregar dados do dashboard:", error);
  }

  const movimentacoes = (data || []) as Movimentacao[];

  const transacoesParaInsights: Transaction[] =
    movimentacoes.map((item) => ({
      tipo: item.tipo,
      descricao: item.descricao,
      valor: Number(item.valor),
      categoria: item.categoria || null,
      data: item.data,
      status: item.status,
    }));

  const prioridadeInsights: Record<string, number> = {
    "comparacao-mes-anterior": 1,
    "maior-categoria": 2,
    "maior-despesa": 3,
    "media-diaria": 4,
    "total-despesas": 5,
    "quantidade-despesas": 6,
    "sem-despesas": 7,
  };

  const insights = gerarInsights(
    transacoesParaInsights,
  )
    .sort(
      (a, b) =>
        (prioridadeInsights[a.id] ?? 99) -
        (prioridadeInsights[b.id] ?? 99),
    )
    .slice(0, 3);

  const efetivadas = movimentacoes.filter(
    (item) =>
      item.data <= hoje &&
      (item.status === "pago" || item.status === "recebido")
  );

  const saldoAtual = efetivadas.reduce((total, item) => {
    const valor = Number(item.valor);

    return item.tipo === "receita"
      ? total + valor
      : total - valor;
  }, 0);

  const movimentacoesDoMes = efetivadas.filter(
    (item) => item.data >= inicioMes && item.data <= fimMes
  );

  const receitasMes = movimentacoesDoMes
    .filter((item) => item.tipo === "receita")
    .reduce((total, item) => total + Number(item.valor), 0);

  const despesasMes = movimentacoesDoMes
    .filter((item) => item.tipo === "despesa")
    .reduce((total, item) => total + Number(item.valor), 0);

  const pendentes = movimentacoes.filter(
    (item) => item.status === "pendente"
  );

  const contasFuturas = pendentes.filter(
    (item) => item.data > hoje
  );

  const despesasFuturas = contasFuturas
    .filter((item) => item.tipo === "despesa")
    .reduce((total, item) => total + Number(item.valor), 0);

  const receitasFuturas = contasFuturas
    .filter((item) => item.tipo === "receita")
    .reduce((total, item) => total + Number(item.valor), 0);

  const saldoPrevisto =
    saldoAtual + receitasFuturas - despesasFuturas;

  const vencidos = pendentes.filter(
    (item) => item.data < hoje
  );

  const totalVencido = vencidos.reduce(
    (total, item) => total + Number(item.valor),
    0
  );

  const proximosCompromissos = pendentes
    .filter((item) => item.data >= hoje)
    .sort((a, b) => a.data.localeCompare(b.data))
    .slice(0, 4);

  const proximoCompromisso =
    proximosCompromissos.length > 0
      ? proximosCompromissos[0]
      : null;

  const nome =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.nome ||
    user?.email?.split("@")[0] ||
    "Rafael";

  return (
    <DashboardHomeReal
      nome={nome.split(" ")[0]}
      saldoAtual={saldoAtual}
      receitasMes={receitasMes}
      despesasMes={despesasMes}
      despesasFuturas={despesasFuturas}
      receitasFuturas={receitasFuturas}
      saldoPrevisto={saldoPrevisto}
      quantidadePendentes={pendentes.length}
      quantidadeVencidos={vencidos.length}
      totalVencido={totalVencido}
      proximoCompromisso={proximoCompromisso}
      proximosCompromissos={proximosCompromissos}
      insights={insights}
    />
  );
}
