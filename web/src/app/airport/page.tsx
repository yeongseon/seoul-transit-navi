import type { Metadata } from "next";
import { getTranslation } from "../../i18n/server";
import { AirportFlowCompanion } from "./airport-flow-companion";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation();

  return {
    title: t("airport.meta.title"),
    description: t("airport.meta.description"),
    openGraph: {
      title: t("airport.meta.title"),
      description: t("airport.meta.description"),
      type: "website",
    },
  };
}

export default function AirportPage() {
  return <AirportFlowCompanion />;
}
