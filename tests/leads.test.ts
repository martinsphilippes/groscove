import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { leadFormSchema, readLeadForm } from "@/lib/launch-leads";
import { formatBrPhoneInput, normalizeBrMobileE164 } from "@/lib/phone";
import { computeCountdown, DEFAULT_LAUNCH_AT } from "@/lib/launch";
import { hashIp, mapRpcResponse } from "@/lib/leads-client";

const valid = { kind: "public", name: "Ana Souza", phone: "(11) 98765-4321", email: " Ana@Exemplo.com ", consent: true };

describe("formulário", () => {
  it("normaliza dados válidos", () => {
    const r = leadFormSchema.parse(valid);
    expect(r.phone).toBe("+5511987654321");
    expect(r.email).toBe("ana@exemplo.com");
  });

  it("exige consentimento, celular e e-mail válidos", () => {
    const r = leadFormSchema.safeParse({ ...valid, consent: false, phone: "1234", email: "x" });
    expect(r.success).toBe(false);
    const keys = r.error!.issues.map((i) => i.path[0]).sort();
    expect(keys).toEqual(["consent", "email", "phone"]);
  });

  it("limpa o @ do Instagram", () => {
    expect(leadFormSchema.parse({ ...valid, kind: "influencer", instagram: "@ana.souza" }).instagram).toBe("ana.souza");
    expect(leadFormSchema.parse({ ...valid, instagram: "https://instagram.com/ana_s/" }).instagram).toBe("ana_s");
    expect(leadFormSchema.safeParse({ ...valid, instagram: "ana souza!" }).success).toBe(false);
  });

  it("lê o honeypot do FormData", () => {
    const fd = new FormData();
    fd.set("website", "spam");
    fd.set("consent", "on");
    const { raw, honeypot } = readLeadForm(fd);
    expect(honeypot).toBe("spam");
    expect(raw.consent).toBe(true);
  });
});

describe("celular", () => {
  it("aplica a máscara", () => {
    expect(formatBrPhoneInput("11987654321")).toBe("(11) 98765-4321");
    expect(formatBrPhoneInput("1198")).toBe("(11) 98");
    expect(formatBrPhoneInput("5511987654321")).toBe("(11) 98765-4321");
  });
  it("só aceita celular", () => {
    expect(normalizeBrMobileE164("+55 11 98765-4321")).toBe("+5511987654321");
    expect(normalizeBrMobileE164("(11) 3333-4444")).toBeNull();
    expect(normalizeBrMobileE164("(01) 98765-4321")).toBeNull();
  });
});

describe("contagem", () => {
  it("calcula até 01/01/2027 00:00 em São Paulo", () => {
    const target = new Date(DEFAULT_LAUNCH_AT).getTime();
    const c = computeCountdown(target, new Date("2026-12-31T02:59:59Z").getTime());
    expect(c).toEqual({ days: 1, hours: 0, minutes: 0, seconds: 1, done: false });
    expect(computeCountdown(target, target + 5000).done).toBe(true);
  });
});

describe("resposta do banco", () => {
  it("mapeia ok, limite, inválido e falhas", () => {
    expect(mapRpcResponse(200, "ok")).toEqual({ ok: true });
    expect(mapRpcResponse(200, "rate_limited")).toEqual({ ok: false, error: "rate_limited" });
    expect(mapRpcResponse(200, "invalid")).toEqual({ ok: false, error: "invalid" });
    expect(mapRpcResponse(401, { message: "x" })).toEqual({ ok: false, error: "unavailable" });
    expect(mapRpcResponse(500, null)).toEqual({ ok: false, error: "unavailable" });
  });
  it("não guarda o IP puro", () => {
    expect(hashIp("1.2.3.4", "sal")).toMatch(/^[0-9a-f]{64}$/);
    expect(hashIp("1.2.3.4", "sal")).not.toBe(hashIp("1.2.3.4", "outro"));
  });
});
