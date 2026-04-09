import type { Metadata } from "next";
import { getTranslation } from "../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation();
  return {
    title: t("routesMeta.title"),
    description: t("routesMeta.description"),
    openGraph: {
      title: t("routesMeta.title"),
      description: t("routesMeta.description"),
      type: "website",
    },
  };
}

export default function RoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
