-- Soraia · schema inicial do Supabase
-- Rodar em: painel do Supabase > SQL Editor > New query > colar tudo > Run

-- Perfis de usuário (complementa o auth.users nativo do Supabase)
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  nome text,
  telefone text unique,
  telefone_verificado boolean default false,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "usuário vê e edita só o próprio perfil"
  on profiles for all
  using (auth.uid() = id);

-- Categorias de gasto
create table categorias (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  nome text not null,
  cor text default '#8B5CF6',
  created_at timestamptz default now()
);

alter table categorias enable row level security;
create policy "usuário vê e edita só as próprias categorias"
  on categorias for all
  using (auth.uid() = user_id);

-- Lançamentos financeiros
create table lancamentos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  nome text not null,
  valor numeric(12,2) not null,
  categoria_id uuid references categorias(id),
  forma_pagamento text,
  status text default 'confirmado',
  origem text default 'manual', -- 'manual' | 'whatsapp_texto' | 'whatsapp_audio' | 'whatsapp_foto'
  data_lancamento timestamptz default now(),
  created_at timestamptz default now()
);

alter table lancamentos enable row level security;
create policy "usuário vê e edita só os próprios lançamentos"
  on lancamentos for all
  using (auth.uid() = user_id);

create index idx_lancamentos_user_data on lancamentos(user_id, data_lancamento desc);

-- Metas financeiras
create table metas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  nome text not null,
  valor_atual numeric(12,2) default 0,
  valor_meta numeric(12,2) not null,
  created_at timestamptz default now()
);

alter table metas enable row level security;
create policy "usuário vê e edita só as próprias metas"
  on metas for all
  using (auth.uid() = user_id);

-- Aportes das metas (histórico)
create table aportes_meta (
  id uuid primary key default gen_random_uuid(),
  meta_id uuid references metas(id) on delete cascade,
  valor numeric(12,2) not null,
  created_at timestamptz default now()
);

alter table aportes_meta enable row level security;
create policy "usuário vê aportes das próprias metas"
  on aportes_meta for all
  using (
    meta_id in (select id from metas where user_id = auth.uid())
  );

-- Compromissos (agenda)
create table compromissos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  titulo text not null,
  tag text,
  data_hora timestamptz not null,
  created_at timestamptz default now()
);

alter table compromissos enable row level security;
create policy "usuário vê e edita só os próprios compromissos"
  on compromissos for all
  using (auth.uid() = user_id);

-- Planos (antigo "projetos", agora genérico pra qualquer plano de vida)
create table planos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  nome text not null,
  descricao text,
  created_at timestamptz default now()
);

alter table planos enable row level security;
create policy "usuário vê e edita só os próprios planos"
  on planos for all
  using (auth.uid() = user_id);

-- Tarefas dentro de um plano
create table tarefas_plano (
  id uuid primary key default gen_random_uuid(),
  plano_id uuid references planos(id) on delete cascade,
  titulo text not null,
  feita boolean default false,
  atrasada boolean default false,
  created_at timestamptz default now()
);

alter table tarefas_plano enable row level security;
create policy "usuário vê tarefas dos próprios planos"
  on tarefas_plano for all
  using (
    plano_id in (select id from planos where user_id = auth.uid())
  );

-- Mensagens do chat com a Soraia (histórico da conversa no painel)
create table mensagens_chat (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  de text not null, -- 'soraia' | 'usuario'
  texto text not null,
  created_at timestamptz default now()
);

alter table mensagens_chat enable row level security;
create policy "usuário vê só as próprias mensagens"
  on mensagens_chat for all
  using (auth.uid() = user_id);

-- Códigos de verificação por WhatsApp (não fica exposto por RLS de usuário comum)
create table verification_codes (
  id uuid primary key default gen_random_uuid(),
  telefone text not null,
  codigo text not null,
  tentativas int default 0,
  expira_em timestamptz not null,
  created_at timestamptz default now()
);

create index idx_verification_telefone on verification_codes(telefone);
