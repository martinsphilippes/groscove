import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <main className="legal legal--center">
      <p className="teaser__launch">404</p>
      <h1>{t("title")}</h1>
      <Link href="/" className="teaser__pill">
        {t("back")}
      </Link>
    </main>
  );
}
