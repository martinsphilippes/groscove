-- JÁ APLICADO no Supabase do Ultra-hero (cjcvlfypjoxaynwtmuhz) em 2026-11-05.
-- Migrações: groscove_join_launch_list + groscove_join_launch_list_only_anon.
-- Copiar para supabase/migrations do Ultra-hero para manter o histórico do app em dia.
-- Limites e risco aceito: ver README (seção "Limites e risco aceito").
-- Única porta de entrada do groscove na tabela launch_leads. A tabela continua fechada
-- (RLS sem políticas): a chave pública só consegue chamar esta função.
create or replace function public.groscove_join_launch_list(
  p_kind text,
  p_name text,
  p_phone text,
  p_email text,
  p_instagram text default null,
  p_utm_source text default null,
  p_utm_medium text default null,
  p_utm_campaign text default null,
  p_ip_hash text default null,
  p_user_agent text default null
) returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_ig text := nullif(btrim(coalesce(p_instagram, '')), '');
begin
  if p_kind not in ('publico', 'influenciador') then return 'invalid'; end if;
  if char_length(btrim(coalesce(p_name, ''))) not between 2 and 120 then return 'invalid'; end if;
  if coalesce(p_phone, '') !~ '^\+55[1-9]{2}9[0-9]{8}$' then return 'invalid'; end if;
  if v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' or char_length(v_email) > 254 then return 'invalid'; end if;
  if v_ig is not null and v_ig !~ '^[A-Za-z0-9._]{1,30}$' then return 'invalid'; end if;

  -- Proteção contra enxurrada: por origem (IP com hash) e total do groscove.
  if p_ip_hash is not null and (
    select count(*) from public.launch_leads
    where ip_hash = p_ip_hash and updated_at > now() - interval '10 minutes'
  ) >= 5 then return 'rate_limited'; end if;
  if (
    select count(*) from public.launch_leads
    where source = 'groscove' and updated_at > now() - interval '1 minute'
  ) >= 30 then return 'rate_limited'; end if;

  insert into public.launch_leads as l
    (kind, name, phone, email, instagram, consent_at, source, utm_source, utm_medium, utm_campaign, ip_hash, user_agent)
  values
    (p_kind, btrim(p_name), p_phone, v_email, v_ig, now(), 'groscove',
     left(p_utm_source, 80), left(p_utm_medium, 80), left(p_utm_campaign, 120),
     left(p_ip_hash, 128), left(p_user_agent, 200))
  on conflict (email, kind) do update set
    name = excluded.name,
    phone = excluded.phone,
    instagram = coalesce(excluded.instagram, l.instagram),
    consent_at = excluded.consent_at,
    ip_hash = excluded.ip_hash,
    user_agent = excluded.user_agent,
    updated_at = now();

  return 'ok';
end;
$$;

revoke all on function public.groscove_join_launch_list(text, text, text, text, text, text, text, text, text, text) from public;
grant execute on function public.groscove_join_launch_list(text, text, text, text, text, text, text, text, text, text) to anon;
