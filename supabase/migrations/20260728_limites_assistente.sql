-- Controle mensal de uso da Soraia por usuário

create table if not exists public.uso_assistente_mensal (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  competencia date not null,
  mensagens_texto integer not null default 0,
  audios integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint uso_assistente_mensal_usuario_competencia_unique
    unique (user_id, competencia),

  constraint uso_assistente_mensal_texto_valido
    check (mensagens_texto >= 0),

  constraint uso_assistente_mensal_audio_valido
    check (audios >= 0)
);

alter table public.uso_assistente_mensal
enable row level security;

drop policy if exists
  "usuario visualiza o proprio uso"
on public.uso_assistente_mensal;

create policy
  "usuario visualiza o proprio uso"
on public.uso_assistente_mensal
for select
using (auth.uid() = user_id);

create index if not exists
  uso_assistente_mensal_user_id_idx
on public.uso_assistente_mensal(user_id);

comment on table public.uso_assistente_mensal is
  'Registra o consumo mensal de mensagens e áudios da Soraia.';

comment on column public.uso_assistente_mensal.competencia is
  'Primeiro dia do mês de referência, considerando o horário do Brasil.';
