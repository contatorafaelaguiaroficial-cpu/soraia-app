create table if not exists public.whatsapp_vinculos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  telefone_e164 text not null unique,
  ativo boolean not null default true,
  verificado_em timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint whatsapp_vinculos_telefone_formato
    check (telefone_e164 ~ '^\+[1-9][0-9]{7,14}$')
);

alter table public.whatsapp_vinculos enable row level security;

create policy "usuario visualiza proprio whatsapp"
on public.whatsapp_vinculos
for select
to authenticated
using (auth.uid() = user_id);

create policy "usuario cria proprio whatsapp"
on public.whatsapp_vinculos
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "usuario atualiza proprio whatsapp"
on public.whatsapp_vinculos
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "usuario remove proprio whatsapp"
on public.whatsapp_vinculos
for delete
to authenticated
using (auth.uid() = user_id);

create index if not exists whatsapp_vinculos_telefone_idx
on public.whatsapp_vinculos (telefone_e164);

create or replace function public.atualizar_updated_at_whatsapp()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trigger_whatsapp_vinculos_updated_at
on public.whatsapp_vinculos;

create trigger trigger_whatsapp_vinculos_updated_at
before update on public.whatsapp_vinculos
for each row
execute function public.atualizar_updated_at_whatsapp();
