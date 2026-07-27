import type { SupabaseClient } from "@supabase/supabase-js";

export type OrigemMensagem = "app_texto" | "app_audio" | "whatsapp_texto" | "whatsapp_audio";

export type TipoTransacao = "receita" | "despesa";
export type StatusTransacao = "pendente" | "pago" | "recebido";

export type Transaction = {
  tipo: TipoTransacao;
  descricao: string;
  valor: number;
  categoria: string | null;
  data: string;
  status: StatusTransacao;
};

export type RegistrarTransacaoArgs = {
  tipo: TipoTransacao;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  status: StatusTransacao;
};

export type MetaFinanceira = {
  id: string;
  nome: string;
  valor_atual: number;
  valor_meta: number;
  prazo: string | null;
};

export type CriarMetaArgs = {
  nome: string;
  valor_meta: number;
  prazo: string;
};

export type AdicionarAporteMetaArgs = {
  nome_meta: string;
  valor: number;
};

export type MensagemHistorico = {
  role: "user" | "assistant";
  content: string;
};

export type ProcessarMensagemParams = {
  mensagem: string;
  userId: string;
  origem: OrigemMensagem;
  supabase: SupabaseClient;
  historico?: MensagemHistorico[];
};

export type ResultadoProcessamento = {
  resposta: string;
  acaoExecutada: boolean;
  transacoes: RegistrarTransacaoArgs[];
};
