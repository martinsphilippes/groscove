import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import "@fontsource-variable/manrope";
import "@fontsource/dm-mono/400.css";
import "@fontsource/dm-mono/500.css";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  // Endereço oficial usado nas prévias de link (WhatsApp, Instagram etc.).
  const base =
    process.env.SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
  return {
    metadataBase: new URL(base),
    title: t("title"),
    description: t("description"),
    openGraph: { title: t("title"), description: t("description"), type: "website" },
    twitter: { card: "summary_large_image", title: t("title"), description: t("description") },
  };
}

export const viewport: Viewport = { themeColor: "#000000", colorScheme: "dark" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
