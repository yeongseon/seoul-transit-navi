import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ルート検索 | ソウル交通ナビ",
  openGraph: {
    title: "ルート検索 | ソウル交通ナビ",
  },
};

export default function RoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}