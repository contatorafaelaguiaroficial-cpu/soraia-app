alter table public.transactions
add column if not exists status text;

update public.transactions
set status =
  case
    when data > current_date then 'pendente'
    when tipo = 'receita' then 'recebido'
    else 'pago'
  end
where status is null;

alter table public.transactions
alter column status set default 'pendente';

alter table public.transactions
alter column status set not null;

alter table public.transactions
drop constraint if exists transactions_status_check;

alter table public.transactions
add constraint transactions_status_check
check (status in ('pendente', 'pago', 'recebido'));

create index if not exists transactions_status_idx
on public.transactions(status);
