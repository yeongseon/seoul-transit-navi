import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ルート検索結果 | ソウル交通ナビ",
  description: "ソウル地下鉄のルート検索結果",
  openGraph: {
    title: "ルート検索結果 | ソウル交通ナビ",
    description: "ソウル地下鉄のルート検索結果",
    type: "website",
  },
};

export default function RoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
