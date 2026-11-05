import { createHmac, timingSafeEqual } from "node:crypto";

export const SIGNATURE_HEADER = "x-groscove-signature";
export const TIMESTAMP_HEADER = "x-groscove-ts";
export const CLIENT_IP_HEADER = "x-groscove-client-ip";
export const MAX_SKEW_SECONDS = 300;

/**
 * Assina `${ts}.${corpo}`. O horário entra na assinatura para que ninguém
 * reaproveite um corpo assinado trocando só o cabeçalho de horário.
 * Mesmo código deve existir no Ultra-hero (ver docs/ultra-hero-rota-launch-leads.md).
 */
export function signBody(secret: string, timestamp: number, body: string): string {
  return createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex");
}

export type VerifyResult = { ok: true } | { ok: false; reason: "missing" | "stale" | "invalid" };

export function verifySignature(opts: {
  secret: string;
  body: string;
  signature: string | null;
  timestamp: string | null;
  nowSeconds?: number;
}): VerifyResult {
  const { secret, body, signature, timestamp } = opts;
  if (!secret || !signature || !timestamp || !/^\d{1,12}$/.test(timestamp)) return { ok: false, reason: "missing" };
  const ts = Number(timestamp);
  const now = opts.nowSeconds ?? Math.floor(Date.now() / 1000);
  if (Math.abs(now - ts) > MAX_SKEW_SECONDS) return { ok: false, reason: "stale" };
  const expected = Buffer.from(signBody(secret, ts, body), "hex");
  const given = /^[0-9a-f]{64}$/i.test(signature) ? Buffer.from(signature, "hex") : Buffer.alloc(0);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return { ok: false, reason: "invalid" };
  return { ok: true };
}
