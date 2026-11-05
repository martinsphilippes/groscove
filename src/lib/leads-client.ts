import "server-only";
import { createHash } from "node:crypto";
import type { FieldKey, LeadKind, LeadPayload } from "./launch-leads";

export type SubmitResult =
  | { ok: true }
  | { ok: false; fieldErrors?: Partial<Record<FieldKey, string>>; error: "rate_limited" | "unavailable" | "invalid" };

/** Valores de `kind` usados na tabela launch_leads do Ultra-hero. */
const KIND_IN_DB: Record<LeadKind, string> = { public: "publico", influencer: "influenciador" };

/** Converte a resposta da função `groscove_join_launch_list` para o formulário. */
export function mapRpcResponse(status: number, json: unknown): SubmitResult {
  if (status >= 200 && status < 300) {
    if (json === "ok") return { ok: true };
    if (json === "rate_limited") return { ok: false, error: "rate_limited" };
    if (json === "invalid") return { ok: false, error: "invalid" };
  }
  return { ok: false, error: "unavailable" };
}

export function hashIp(ip: string, salt: string): string {
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

/**
 * Grava o interessado em public.launch_leads (banco do Ultra-hero) pela função
 * `groscove_join_launch_list`. Usa só a chave pública: a função é a única coisa
 * que essa chave consegue fazer na tabela (não lê, não apaga).
 */
export async function submitLead(
  payload: LeadPayload,
  ctx: { clientIp: string | null; userAgent: string | null },
): Promise<SubmitResult> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    console.error("[leads] SUPABASE_URL ou SUPABASE_PUBLISHABLE_KEY não configurados");
    return { ok: false, error: "unavailable" };
  }

  const body = {
    p_kind: KIND_IN_DB[payload.kind],
    p_name: payload.name,
    p_phone: payload.phone,
    p_email: payload.email,
    p_instagram: payload.instagram ?? null,
    p_utm_source: payload.utm_source ?? null,
    p_utm_medium: payload.utm_medium ?? null,
    p_utm_campaign: payload.utm_campaign ?? null,
    p_ip_hash: ctx.clientIp ? hashIp(ctx.clientIp, process.env.IP_HASH_SALT ?? "") : null,
    p_user_agent: ctx.userAgent?.slice(0, 200) ?? null,
  };

  try {
    const res = await fetch(`${url.replace(/\/+$/, "")}/rest/v1/rpc/groscove_join_launch_list`, {
      method: "POST",
      headers: { "content-type": "application/json", apikey: key, authorization: `Bearer ${key}` },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const json = await res.json().catch(() => null);
    const result = mapRpcResponse(res.status, json);
    if (!result.ok && result.error !== "rate_limited") console.error("[leads] resposta inesperada", res.status, json);
    return result;
  } catch (err) {
    console.error("[leads] falha ao gravar", err instanceof Error ? err.name : err);
    return { ok: false, error: "unavailable" };
  }
}
