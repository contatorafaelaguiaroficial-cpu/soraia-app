-- Consome uma mensagem mensal do plano Free de forma atômica

create or replace function public.consumir_mensagem_free()
returns table (
  permitido boolean,
  utilizadas integer,
  limite integer
)
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid;
  v_competencia date;
  v_utilizadas integer;
  v_permitido boolean := false;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'Usuário não autenticado';
  end if;

  v_competencia :=
    date_trunc(
      'month',
      timezone('America/Sao_Paulo', now())
    )::date;

  insert into public.uso_assistente_mensal (
    user_id,
    competencia,
    mensagens_texto,
    audios,
    updated_at
  )
  values (
    v_user_id,
    v_competencia,
    1,
    0,
    now()
  )
  on conflict (user_id, competencia)
  do update
  set
    mensagens_texto =
      public.uso_assistente_mensal.mensagens_texto + 1,
    updated_at = now()
  where
    public.uso_assistente_mensal.mensagens_texto < 10
  returning mensagens_texto
  into v_utilizadas;

  if v_utilizadas is not null then
    v_permitido := true;
  else
    select mensagens_texto
    into v_utilizadas
    from public.uso_assistente_mensal
    where user_id = v_user_id
      and competencia = v_competencia;

    v_utilizadas := coalesce(v_utilizadas, 10);
  end if;

  return query
  select
    v_permitido,
    v_utilizadas,
    10;
end;
$$;

revoke all
on function public.consumir_mensagem_free()
from public;

grant execute
on function public.consumir_mensagem_free()
to authenticated;

comment on function public.consumir_mensagem_free() is
  'Autoriza e registra até 10 mensagens mensais para usuários Free.';
