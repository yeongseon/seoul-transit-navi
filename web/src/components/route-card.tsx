"use client";

import Link from "next/link";
import { RouteResult, RouteType } from "../../../shared/types";
import { useTranslation } from "../i18n/client";

interface RouteCardProps {
  route: RouteResult;
}

export function RouteCard({ route }: RouteCardProps) {
  const { t } = useTranslation();

  const getBadgeStyle = (type: RouteType) => {
    switch (type) {
      case "tourist_friendly":
        return "bg-amber-100 text-amber-800 ring-amber-200";
      case "fastest":
        return "bg-rose-100 text-rose-800 ring-rose-200";
      case "easy":
        return "bg-emerald-100 text-emerald-800 ring-emerald-200";
      case "few_transfers":
        return "bg-sky-100 text-sky-800 ring-sky-200";
      default:
        return "bg-slate-100 text-slate-800 ring-slate-200";
    }
  };

  const modeIcons = {
    subway: "🚇",
    bus: "🚌",
    walk: "🚶",
    airport_rail: "✈️",
  };

  return (
    <div
      className={`group relative flex flex-col rounded-3xl bg-white p-5 shadow-sm ring-1 transition-all hover:shadow-md ${
        route.recommended
          ? "ring-2 ring-sky-500 hover:ring-sky-600"
          : "ring-slate-200 hover:ring-slate-300"
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getBadgeStyle(
            route.routeType
          )}`}
        >
          {t(`routeTypes.${route.routeType}`)}
        </span>
        {route.recommended && (
          <span className="text-xs font-bold text-sky-600">{t("components.recommended")}</span>
        )}
      </div>

      <div className="mb-4 flex items-baseline gap-3">
        <span className="text-3xl font-extrabold tracking-tight text-slate-900">
          {route.durationMin}
          <span className="text-xl font-semibold text-slate-500">{t("components.minutes")}</span>
        </span>
        <div className="flex flex-col text-sm font-medium text-slate-600">
          <span>₩{route.fareKrw.toLocaleString()}</span>
          <span>{t("components.transfers", { count: route.transferCount })}</span>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {route.transportModes.map((mode, index) => (
          <div key={`${route.id}-mode-${mode}-${index}`} className="flex items-center gap-1.5">
            <span className="text-lg">{modeIcons[mode as keyof typeof modeIcons]}</span>
            {index < route.transportModes.length - 1 && (
              <span className="text-slate-300">›</span>
            )}
          </div>
        ))}
      </div>

      <p className="mb-6 line-clamp-2 text-sm text-slate-600">
        {route.summary}
      </p>

      <Link
        href={`/routes/${route.id}`}
        className="mt-auto flex w-full items-center justify-center rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 ring-1 ring-inset ring-slate-200 transition-colors group-hover:bg-slate-100 group-hover:text-slate-900"
      >
        {t("components.viewDetails")}
      </Link>
    </div>
  );
}
