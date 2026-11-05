import { z } from "zod";
import { normalizeBrMobileE164 } from "./phone";

export const LEAD_KINDS = ["public", "influencer"] as const;
export type LeadKind = (typeof LEAD_KINDS)[number];

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

const utm = z.string().trim().max(120).optional();

/**
 * Validação no groscove (primeira barreira). O Ultra-hero valida de novo antes de gravar.
 * As mensagens são chaves de tradução (namespace "form.errors").
 */
export const leadFormSchema = z.object({
  kind: z.enum(LEAD_KINDS),
  name: z.string().trim().min(2, "name").max(120, "name"),
  phone: z
    .string()
    .trim()
    .transform((v, ctx) => {
      const e164 = normalizeBrMobileE164(v);
      if (!e164) {
        ctx.addIssue({ code: "custom", message: "phone" });
        return z.NEVER;
      }
      return e164;
    }),
  email: z.string().trim().toLowerCase().max(254, "email").pipe(z.email("email")),
  consent: z.literal(true, { error: "consent" }),
  instagram: z
    .string()
    .trim()
    .transform((v) => v.replace(/^@+/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//i, "").replace(/\/.*$/, ""))
    .pipe(z.string().regex(/^[A-Za-z0-9._]{0,30}$/, "instagram"))
    .optional()
    .transform((v) => (v ? v : undefined)),
  locale: z.enum(["pt-BR", "en", "es"]).optional(),
  utm_source: utm,
  utm_medium: utm,
  utm_campaign: utm,
  utm_term: utm,
  utm_content: utm,
});

export type LeadPayload = z.infer<typeof leadFormSchema> & { source: "groscove" };

export type FieldKey = "name" | "phone" | "email" | "consent" | "instagram";

/** Lê o FormData do formulário. Campo "website" é o honeypot (fica escondido). */
export function readLeadForm(form: FormData) {
  const get = (k: string) => {
    const v = form.get(k);
    return typeof v === "string" ? v : undefined;
  };
  const raw: Record<string, unknown> = {
    kind: get("kind"),
    name: get("name") ?? "",
    phone: get("phone") ?? "",
    email: get("email") ?? "",
    consent: get("consent") === "on" || get("consent") === "true",
    instagram: get("instagram") || undefined,
    locale: get("locale") || undefined,
  };
  for (const k of UTM_KEYS) raw[k] = get(k) || undefined;
  return { raw, honeypot: (get("website") ?? "").trim() };
}
