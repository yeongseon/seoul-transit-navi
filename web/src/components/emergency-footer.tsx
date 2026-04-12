"use client";

import { useTranslation } from "../i18n/client";

export function EmergencyFooter() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-slate-200 bg-slate-50 px-4 py-6 text-center">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-semibold text-slate-500">{t("emergency.title")}</p>
        <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
          <span className="text-xs text-slate-500">
            <span className="font-semibold text-sky-700">1330</span> {t("emergency.tourInfo")}
          </span>
          <span className="text-xs text-slate-500">
            <span className="font-semibold">120</span> {t("emergency.dasan")}
          </span>
          <span className="text-xs text-slate-500">
            <span className="font-semibold">112</span> {t("emergency.police")}
          </span>
          <span className="text-xs text-slate-500">
            <span className="font-semibold">119</span> {t("emergency.fire")}
          </span>
        </div>
      </div>
    </footer>
  );
}
