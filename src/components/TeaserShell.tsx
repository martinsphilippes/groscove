import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { LaunchLogo } from "./LaunchLogo";

/** Moldura comum: topo (idioma + botão), conteúdo e rodapé só com documentos legais. */
export async function TeaserShell({ children, topAction }: { children: React.ReactNode; topAction: "influencer" | "back" }) {
  const t = await getTranslations();
  return (
    <div className="teaser">
      <header className="teaser__top">
        <Link href="/" className="teaser__home" aria-label="Groscove Ultra">
          <LaunchLogo className="teaser__mini-logo" />
        </Link>
        <div className="teaser__top-actions">
          <LocaleSwitcher />
          {topAction === "influencer" ? (
            <Link href="/influenciador" className="teaser__pill">
              {t("teaser.influencerCta")} <span aria-hidden="true">↗</span>
            </Link>
          ) : (
            <Link href="/" className="teaser__pill">
              <span aria-hidden="true">←</span> {t("influencer.back")}
            </Link>
          )}
        </div>
      </header>
      <main className="teaser__main">{children}</main>
      <footer className="teaser__footer">
        <Link href="/termos">{t("footer.terms")}</Link>
        <span aria-hidden="true">·</span>
        <Link href="/privacidade">{t("footer.privacy")}</Link>
      </footer>
    </div>
  );
}
