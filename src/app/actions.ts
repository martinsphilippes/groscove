"use server";

import { headers } from "next/headers";
import { leadFormSchema, readLeadForm, type FieldKey } from "@/lib/launch-leads";
import { submitLead } from "@/lib/leads-client";

export type LeadFormState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; error?: "rate_limited" | "unavailable"; fieldErrors?: Partial<Record<FieldKey, string>> };

function clientIpFrom(h: Headers): string | null {
  // Na Vercel, o primeiro IP de x-forwarded-for é o do visitante.
  const first = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip")?.trim();
  return first && first.length <= 64 ? first : null;
}

export async function joinLaunchListAction(_prev: LeadFormState, form: FormData): Promise<LeadFormState> {
  const { raw, honeypot } = readLeadForm(form);
  // Robô preencheu o campo escondido: finge sucesso e não envia nada.
  if (honeypot) return { status: "success" };

  const parsed = leadFormSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<FieldKey, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as FieldKey;
      if (key && !fieldErrors[key]) fieldErrors[key] = key;
    }
    return { status: "error", fieldErrors };
  }

  const h = await headers();
  const result = await submitLead(
    { ...parsed.data, source: "groscove" },
    { clientIp: clientIpFrom(h), userAgent: h.get("user-agent") },
  );
  if (result.ok) return { status: "success" };
  return { status: "error", error: result.error === "rate_limited" ? "rate_limited" : "unavailable" };
}
