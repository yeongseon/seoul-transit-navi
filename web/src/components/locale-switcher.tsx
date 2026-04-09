"use client";

import { useTranslation } from "../i18n/client";
import { trackEvent } from "../lib/analytics";

export function LocaleSwitcher() {
  const { t, locale, setLocale } = useTranslation();
  const nextLocale = locale === "ja" ? "ko" : "ja";

  return (
    <button
      type="button"
      onClick={() => {
        trackEvent({ type: "locale_switch", from: locale, to: nextLocale });
        setLocale(nextLocale);
      }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-lg ring-1 ring-slate-200 transition hover:bg-slate-50 hover:shadow-xl active:scale-95"
      aria-label={t(`localeSwitcher.switchTo_${nextLocale}`)}
    >
      <span className="text-base">🌐</span>
      {t(`localeSwitcher.${nextLocale}`)}
    </button>
  );
}
