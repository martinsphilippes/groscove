import { getTranslations } from "next-intl/server";
import { TeaserShell } from "@/components/TeaserShell";
import { LeadForm } from "@/components/LeadForm";
import { pickUtm } from "@/lib/utm";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function InfluencerPage({ searchParams }: Props) {
  const t = await getTranslations("influencer");
  const utm = pickUtm(await searchParams);
  return (
    <TeaserShell topAction="back">
      <h1 className="teaser__headline teaser__headline--influencer shine-text">{t("headline")}</h1>
      <ul className="teaser__topics">
        <li>{t("topic1")}</li>
        <li>{t("topic2")}</li>
        <li>{t("topic3")}</li>
      </ul>
      <LeadForm kind="influencer" utm={utm} />
    </TeaserShell>
  );
}
