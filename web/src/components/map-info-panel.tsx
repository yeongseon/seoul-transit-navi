import { useMemo, useState } from "react";
import { LINES } from "../../../shared/constants";
import type { SubwayMapLine, SubwayMapStation } from "../data/subway-map-data";

type TranslationFunction = (key: string, params?: Record<string, string | number>) => string;

type MapInfoPanelProps = {
  selectedStation: SubwayMapStation;
  lines: SubwayMapLine[];
  locale: "ja" | "ko";
  t: TranslationFunction;
};

export function MapInfoPanel({ selectedStation, lines, locale, t }: MapInfoPanelProps) {
  const [legendOpen, setLegendOpen] = useState(false);
  const stationCount = useMemo(() => new Set(lines.flatMap((line) => line.stationIds)).size, [lines]);

  return (
    <section className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
      <div className="space-y-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{t("subwayMap.selected")}</p>
            <h2 className="text-xl font-bold text-slate-900">{locale === "ko" ? selectedStation.nameKo : selectedStation.nameJa}</h2>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
            {selectedStation.nameJa} / {selectedStation.nameKo}
          </span>
        </div>

        <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <p className="text-sm font-semibold text-slate-700">{t("subwayMap.availableLines")}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedStation.stationNumbers.length > 0 ? (
              selectedStation.stationNumbers.map((badge) => (
                <span
                  key={badge.lineId}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-white"
                  style={{ backgroundColor: badge.color }}
                >
                  <span className="flex h-5 items-center justify-center rounded-full bg-white px-2 text-[10px] font-bold" style={{ color: badge.color }}>
                    {badge.code}
                  </span>
                  {locale === "ko" ? LINES[badge.lineId].nameKo : LINES[badge.lineId].nameJa}
                </span>
              ))
            ) : (
              selectedStation.lines.map((lineId) => (
                <span
                  key={lineId}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-white"
                  style={{ backgroundColor: LINES[lineId].color }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
                  {locale === "ko" ? LINES[lineId].nameKo : LINES[lineId].nameJa}
                </span>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <button
            type="button"
            className="flex w-full items-center justify-between gap-3 text-left"
            onClick={() => setLegendOpen((current) => !current)}
            aria-expanded={legendOpen}
          >
            <div>
              <h3 className="text-sm font-bold tracking-wide text-slate-700">{t("subwayMap.legend")}</h3>
              <p className="text-xs text-slate-400">{t("subwayMap.stationCount", { count: stationCount })}</p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
              {legendOpen ? "−" : "+"}
            </span>
          </button>

          <div className={legendOpen ? "mt-4 grid gap-2 sm:grid-cols-2" : "hidden"}>
            {lines.map((line) => (
              <div key={line.id} className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2 ring-1 ring-slate-200">
                <span className="h-3 w-8 rounded-full" style={{ backgroundColor: line.color }} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{locale === "ko" ? line.nameKo : line.nameJa}</p>
                  <p className="text-xs text-slate-500">{t("subwayMap.stationCount", { count: line.stationIds.length })}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
