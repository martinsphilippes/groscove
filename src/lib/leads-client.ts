import "server-only";
import { CLIENT_IP_HEADER, SIGNATURE_HEADER, TIMESTAMP_HEADER, signBody } from "./signature";
import type { FieldKey, LeadPayload } from "./launch-leads";

export type SubmitResult =
  | { ok: true }
  | { ok: false; fieldErrors?: Partial<Record<FieldKey, string>>; error: "rate_limited" | "unavailable" | "invalid" };

const FIELD_KEYS: FieldKey[] = ["name", "phone", "email", "consent", "instagram"];

/** Converte a resposta da rota do Ultra-hero no formato que o formulário entende. */
export function mapEndpointResponse(status: number, json: unknown): SubmitResult {
  const data = (json && typeof json === "object" ? json : {}) as Record<string, unknown>;
  if (status >= 200 && status < 300 && data.ok === true) return { ok: true };
  if (status === 429 || data.error === "rate_limited") return { ok: false, error: "rate_limited" };
  if (data.fieldErrors && typeof data.fieldErrors === "object") {
    const fieldErrors: Partial<Record<FieldKey, string>> = {};
    for (const k of FIELD_KEYS) {
      if (k in (data.fieldErrors as object)) fieldErrors[k] = k;
    }
    if (Object.keys(fieldErrors).length > 0) return { ok: false, error: "invalid", fieldErrors };
  }
  return { ok: false, error: "unavailable" };
}

/** Envia o cadastro, assinado, para o Ultra-hero. Só roda no servidor. */
export async function submitLead(payload: LeadPayload, clientIp: string | null): Promise<SubmitResult> {
  const secret = process.env.GROSCOVE_LEADS_SECRET;
  const endpoint = process.env.LEADS_ENDPOINT;
  if (!secret || !endpoint) {
    console.error("[leads] GROSCOVE_LEADS_SECRET ou LEADS_ENDPOINT não configurados");
    return { ok: false, error: "unavailable" };
  }

  const body = JSON.stringify(payload);
  const ts = Math.floor(Date.now() / 1000);
  const headers: Record<string, string> = {
    "content-type": "application/json",
    [TIMESTAMP_HEADER]: String(ts),
    [SIGNATURE_HEADER]: signBody(secret, ts, body),
  };
  if (clientIp) headers[CLIENT_IP_HEADER] = clientIp;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const json = await res.json().catch(() => null);
    const result = mapEndpointResponse(res.status, json);
    if (!result.ok && result.error === "unavailable") console.error("[leads] resposta inesperada", res.status);
    return result;
  } catch (err) {
    console.error("[leads] falha ao enviar", err instanceof Error ? err.name : err);
    return { ok: false, error: "unavailable" };
  }
}
