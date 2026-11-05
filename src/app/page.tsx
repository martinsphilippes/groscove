import { getTranslations } from "next-intl/server";
import { TeaserShell } from "@/components/TeaserShell";
import { LaunchLogo } from "@/components/LaunchLogo";
import { Countdown } from "@/components/Countdown";
import { LeadForm } from "@/components/LeadForm";
import { getLaunchAt } from "@/lib/launch";
import { pickUtm } from "@/lib/utm";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function HomePage({ searchParams }: Props) {
  const t = await getTranslations("teaser");
  const utm = pickUtm(await searchParams);
  return (
    <TeaserShell topAction="influencer">
      <LaunchLogo className="teaser__logo" />
      <p className="teaser__launch">{t("launch")}</p>
      <h1 className="teaser__headline shine-text">{t("headline")}</h1>
      <Countdown targetIso={getLaunchAt().toISOString()} initialNow={Date.now()} />
      <LeadForm kind="public" utm={utm} />
    </TeaserShell>
  );
}
