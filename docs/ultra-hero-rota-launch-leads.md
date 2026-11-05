# Rota a criar no Ultra-hero: `POST /api/launch-leads`

O groscove não tem acesso ao banco. Ele envia o cadastro, assinado, para esta rota do app,
que valida e grava em `public.launch_leads` (mesma lista do Admin › Interessados).

## Contrato

**Cabeçalhos**
- `x-groscove-ts`: horário Unix em segundos.
- `x-groscove-signature`: HMAC-SHA256 em hex de `` `${ts}.${corpo}` `` com `GROSCOVE_LEADS_SECRET`.
  (O horário entra na assinatura; assim não dá para reaproveitar um corpo trocando só o horário.)
- `x-groscove-client-ip`: IP do visitante (confiável só porque a requisição está assinada).

**Corpo (JSON)**
```json
{ "kind": "public" | "influencer", "name": "...", "phone": "+5511987654321",
  "email": "...", "consent": true, "instagram": "usuario"?, "locale": "pt-BR"?,
  "utm_source"?: "...", "utm_medium"?: "...", "utm_campaign"?: "...", "utm_term"?: "...", "utm_content"?: "...",
  "source": "groscove" }
```
Se o `kind` do app usar outros valores, mapear aqui na rota (não no groscove).

**Respostas**
- `200 { ok: true }`
- `400 { ok: false, fieldErrors: { email: [...], ... } }` (chaves: name, phone, email, consent, instagram)
- `401 { ok: false, error: "unauthorized" }` assinatura inválida ou horário vencido (> 5 min)
- `429 { ok: false, error: "rate_limited" }`
- `500 { ok: false, error: "unavailable" }`

## Código sugerido (`src/app/api/launch-leads/route.ts`)

```ts
import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
// Reaproveitar o que a joinLaunchListAction atual já usa:
import { launchLeadSchema } from "@/lib/launch-leads";
import { createAdminClient } from "@/lib/supabase/admin";
// + o limitador por IP/e-mail que a server action usa hoje

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function verify(secret: string, body: string, sig: string | null, ts: string | null) {
  if (!secret || !sig || !ts || !/^\d{1,12}$/.test(ts)) return false;
  if (Math.abs(Date.now() / 1000 - Number(ts)) > 300) return false;
  const expected = Buffer.from(createHmac("sha256", secret).update(`${ts}.${body}`).digest("hex"), "hex");
  const given = /^[0-9a-f]{64}$/i.test(sig) ? Buffer.from(sig, "hex") : Buffer.alloc(0);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function POST(req: Request) {
  const body = await req.text();
  if (body.length > 10_000) return NextResponse.json({ ok: false, error: "invalid" }, { status: 413 });
  const ok = verify(process.env.GROSCOVE_LEADS_SECRET ?? "", body,
    req.headers.get("x-groscove-signature"), req.headers.get("x-groscove-ts"));
  if (!ok) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  const ip = req.headers.get("x-groscove-client-ip");
  const parsed = launchLeadSchema.safeParse(JSON.parse(body));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, fieldErrors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  // 1) limite por IP/e-mail (mesmo da server action) -> 429 { error: "rate_limited" }
  // 2) upsert por (email, kind) com source = 'groscove' — mesmo código da joinLaunchListAction
  return NextResponse.json({ ok: true });
}
// Sem OPTIONS/CORS: a chamada é servidor -> servidor.
```

## Testes no Ultra-hero
- assinatura válida → 200; corpo alterado → 401; horário > 5 min → 401;
- campos inválidos → 400 com `fieldErrors`; limite estourado → 429.
