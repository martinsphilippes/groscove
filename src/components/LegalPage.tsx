import Link from "next/link";
import { getTranslations } from "next-intl/server";

/**
 * TODO(ultra-hero): copiar o texto de `src/app/legal/*` do Ultra-hero.
 * Bloqueia a publicação: o formulário pede aceite com link para a Política de Privacidade.
 */
export async function LegalPage({ kind }: { kind: "terms" | "privacy" }) {
  const t = await getTranslations("legal");
  return (
    <main className="legal">
      <Link href="/" className="legal__back">
        ← {t("back")}
      </Link>
      <h1>{kind === "terms" ? t("termsTitle") : t("privacyTitle")}</h1>
      <p className="legal__pending">Texto em preparação.</p>
    </main>
  );
}
