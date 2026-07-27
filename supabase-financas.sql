create extension if not exists "pgcrypto";

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tipo text not null check (tipo in ('receita', 'despesa')),
  descricao text not null,
  valor numeric(12,2) not null check (valor > 0),
  categoria text not null default 'Outros',
  data date not null default current_date,
  recorrente boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.transactions enable row level security;

drop policy if exists "Usuários visualizam suas movimentações"
on public.transactions;

create policy "Usuários visualizam suas movimentações"
on public.transactions
for select
using (auth.uid() = user_id);

drop policy if exists "Usuários criam suas movimentações"
on public.transactions;

create policy "Usuários criam suas movimentações"
on public.transactions
for insert
with check (auth.uid() = user_id);

drop policy if exists "Usuários atualizam suas movimentações"
on public.transactions;

create policy "Usuários atualizam suas movimentações"
on public.transactions
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Usuários excluem suas movimentações"
on public.transactions;

create policy "Usuários excluem suas movimentações"
on public.transactions
for delete
using (auth.uid() = user_id);

create index if not exists transactions_user_id_idx
on public.transactions(user_id);

create index if not exists transactions_data_idx
on public.transactions(data desc);
