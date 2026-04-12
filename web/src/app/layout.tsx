import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getLocale, getTranslation } from "../i18n/server";
import { TranslationProvider } from "../i18n/client";
import jaMessages from "../i18n/locales/ja.json";
import koMessages from "../i18n/locales/ko.json";
import type { Locale } from "../i18n/config";
import { EmergencyFooter } from "../components/emergency-footer";
import { LocaleSwitcher } from "../components/locale-switcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const messagesMap: Record<Locale, Record<string, unknown>> = {
  ja: jaMessages,
  ko: koMessages,
};

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation();
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    openGraph: {
      title: t("meta.title"),
      description: t("meta.ogDescription"),
      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = messagesMap[locale];

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TranslationProvider locale={locale} messages={messages}>
          {children}
          <EmergencyFooter />
          <LocaleSwitcher />
        </TranslationProvider>
      </body>
    </html>
  );
}
