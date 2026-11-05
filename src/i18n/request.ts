import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, localeFromAcceptLanguage } from "./config";

export default getRequestConfig(async () => {
  const fromCookie = (await cookies()).get(LOCALE_COOKIE)?.value;
  const locale = isLocale(fromCookie) ? fromCookie : localeFromAcceptLanguage((await headers()).get("accept-language"));
  const messages = (await import(`../../messages/${locale}.json`)).default;
  return { locale: locale ?? DEFAULT_LOCALE, messages, timeZone: "America/Sao_Paulo" };
});
