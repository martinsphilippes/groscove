"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { joinLaunchListAction, type LeadFormState } from "@/app/actions";
import { formatBrPhoneInput } from "@/lib/phone";
import type { LeadKind } from "@/lib/launch-leads";

type Props = { kind: LeadKind; utm: Record<string, string> };

export function LeadForm({ kind, utm }: Props) {
  const t = useTranslations("form");
  const locale = useLocale();
  const [phone, setPhone] = useState("");
  const [state, action, pending] = useActionState<LeadFormState, FormData>(joinLaunchListAction, { status: "idle" });

  if (state.status === "success") {
    return (
      <p className="lead-form__success" role="status">
        {t("success")}
      </p>
    );
  }

  const fe = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const err = (k: keyof typeof fe) =>
    fe[k] ? (
      <span id={`err-${k}`} className="lead-form__error">
        {t(`errors.${k}`)}
      </span>
    ) : null;

  return (
    <form action={action} className="lead-form" noValidate>
      <h2 className="lead-form__title">{t("title")}</h2>
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="locale" value={locale} />
      {Object.entries(utm).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      {/* Honeypot: invisível para pessoas, robôs costumam preencher. */}
      <div className="lead-form__hp" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="lead-form__field">
        <span>{t("name")}</span>
        <input name="name" autoComplete="name" required maxLength={120} aria-invalid={!!fe.name} aria-describedby={fe.name ? "err-name" : undefined} />
        {err("name")}
      </label>

      <label className="lead-form__field">
        <span>{t("phone")}</span>
        <input
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="(11) 98765-4321"
          required
          value={phone}
          onChange={(e) => setPhone(formatBrPhoneInput(e.target.value))}
          aria-invalid={!!fe.phone}
          aria-describedby={fe.phone ? "err-phone" : undefined}
        />
        {err("phone")}
      </label>

      <label className="lead-form__field">
        <span>{t("email")}</span>
        <input name="email" type="email" autoComplete="email" required maxLength={254} aria-invalid={!!fe.email} aria-describedby={fe.email ? "err-email" : undefined} />
        {err("email")}
      </label>

      {kind === "influencer" && (
        <label className="lead-form__field">
          <span>
            {t("instagram")} <em className="lead-form__optional">({t("optional")})</em>
          </span>
          <input name="instagram" autoComplete="off" placeholder="@" maxLength={60} aria-invalid={!!fe.instagram} aria-describedby={fe.instagram ? "err-instagram" : undefined} />
          {err("instagram")}
        </label>
      )}

      <label className="lead-form__consent">
        <input type="checkbox" name="consent" required aria-invalid={!!fe.consent} aria-describedby={fe.consent ? "err-consent" : undefined} />
        <span>
          {t("consent")}{" "}
          <Link href="/privacidade" target="_blank">
            {t("privacyLink")}
          </Link>
        </span>
      </label>
      {err("consent")}

      {state.status === "error" && state.error && (
        <p className="lead-form__error lead-form__error--global" role="alert">
          {t(`errors.${state.error}`)}
        </p>
      )}

      <button type="submit" className="lead-form__submit" disabled={pending}>
        {pending ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
