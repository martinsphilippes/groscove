import { describe, expect, it } from "vitest";
import { signBody, verifySignature } from "@/lib/signature";

const secret = "segredo-de-teste";
const body = JSON.stringify({ kind: "public", email: "a@b.com" });
const now = 1_800_000_000;

describe("assinatura HMAC", () => {
  it("aceita assinatura válida", () => {
    const signature = signBody(secret, now, body);
    expect(verifySignature({ secret, body, signature, timestamp: String(now), nowSeconds: now + 10 })).toEqual({ ok: true });
  });

  it("recusa corpo alterado", () => {
    const signature = signBody(secret, now, body);
    const r = verifySignature({ secret, body: body.replace("a@b", "x@b"), signature, timestamp: String(now), nowSeconds: now });
    expect(r).toEqual({ ok: false, reason: "invalid" });
  });

  it("recusa horário trocado (o horário faz parte da assinatura)", () => {
    const signature = signBody(secret, now, body);
    const r = verifySignature({ secret, body, signature, timestamp: String(now + 60), nowSeconds: now + 60 });
    expect(r).toEqual({ ok: false, reason: "invalid" });
  });

  it("recusa horário vencido (> 5 min)", () => {
    const signature = signBody(secret, now, body);
    const r = verifySignature({ secret, body, signature, timestamp: String(now), nowSeconds: now + 301 });
    expect(r).toEqual({ ok: false, reason: "stale" });
  });

  it("recusa segredo errado e cabeçalhos ausentes", () => {
    const signature = signBody("outro", now, body);
    expect(verifySignature({ secret, body, signature, timestamp: String(now), nowSeconds: now }).ok).toBe(false);
    expect(verifySignature({ secret, body, signature: null, timestamp: String(now), nowSeconds: now })).toEqual({ ok: false, reason: "missing" });
    expect(verifySignature({ secret, body, signature: "zz", timestamp: String(now), nowSeconds: now })).toEqual({ ok: false, reason: "invalid" });
  });
});
