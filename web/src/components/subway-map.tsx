"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LINES } from "../../../shared/constants";
import { useTranslation } from "../i18n/client";
import {
  SUBWAY_MAP_CANVAS_SIZE,
  SUBWAY_MAP_INITIAL_SCROLL,
  SUBWAY_MAP_LINES,
  SUBWAY_MAP_STATIONS,
  SUBWAY_MAP_STATIONS_BY_ID,
  SUBWAY_MAP_VIEW_BOX,
  type SubwayMapLine,
  type SubwayMapStation,
} from "../data/subway-map-data";

type LabelStyle = {
  dx: number;
  dy: number;
  textAnchor: "start" | "middle" | "end";
};

const LABEL_STYLES: Record<SubwayMapStation["labelDirection"], LabelStyle> = {
  n: { dx: 0, dy: -3.8, textAnchor: "middle" },
  s: { dx: 0, dy: 5.4, textAnchor: "middle" },
  e: { dx: 4.2, dy: 0.9, textAnchor: "start" },
  w: { dx: -4.2, dy: 0.9, textAnchor: "end" },
};

function getLinePath(line: SubwayMapLine): string {
  const stations = line.stationIds.map((stationId) => SUBWAY_MAP_STATIONS_BY_ID[stationId]);
  const commands: string[] = [];

  stations.forEach((station, index) => {
    if (index === 0) {
      commands.push(`M ${station.x} ${station.y}`);
      return;
    }

    const previous = stations[index - 1];
    const dx = station.x - previous.x;
    const dy = station.y - previous.y;
    const diagonal = Math.abs(Math.abs(dx) - Math.abs(dy)) < 0.001;

    if (dx === 0 || dy === 0 || diagonal || line.routePreference === "auto") {
      commands.push(`L ${station.x} ${station.y}`);
      return;
    }

    const cornerX = line.routePreference === "vertical-first" ? previous.x : station.x;
    const cornerY = line.routePreference === "vertical-first" ? station.y : previous.y;
    commands.push(`L ${cornerX} ${cornerY} L ${station.x} ${station.y}`);
  });

  if (line.loop) {
    const first = stations[0];
    commands.push(`L ${first.x} ${first.y}`);
  }

  return commands.join(" ");
}

export function SubwayMap() {
  const { locale, t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [selectedStationId, setSelectedStationId] = useState<string>(SUBWAY_MAP_STATIONS_BY_ID["station_city-hall"].id);

  useEffect(() => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const left = Math.max(0, (container.scrollWidth - container.clientWidth) * SUBWAY_MAP_INITIAL_SCROLL.leftRatio);
    const top = Math.max(0, (container.scrollHeight - container.clientHeight) * SUBWAY_MAP_INITIAL_SCROLL.topRatio);
    container.scrollTo({ left, top });
  }, []);

  const selectedStation = useMemo(
    () => SUBWAY_MAP_STATIONS_BY_ID[selectedStationId] ?? SUBWAY_MAP_STATIONS[0],
    [selectedStationId],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white/90 px-4 py-3 ring-1 ring-slate-200">
        <p className="text-sm font-medium text-slate-600">{t("subwayMap.tapStation")}</p>
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-900" />
          <span>{t("subwayMap.transfer")}</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-slate-200">
        <div
          ref={scrollRef}
          className="overflow-auto bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.04)_0,rgba(15,23,42,0.04)_1px,transparent_1px)] [background-position:0_0] [background-size:20px_20px]"
        >
          <div style={{ width: SUBWAY_MAP_CANVAS_SIZE.width, minWidth: SUBWAY_MAP_CANVAS_SIZE.width }} className="p-6">
            <svg
              viewBox={SUBWAY_MAP_VIEW_BOX}
              width={SUBWAY_MAP_CANVAS_SIZE.width - 48}
              height={SUBWAY_MAP_CANVAS_SIZE.height - 48}
              role="img"
              aria-label={locale === "ko" ? "서울 지하철 노선도" : "ソウル地下鉄路線図"}
              className="h-auto w-full"
            >
              <rect x="-36" y="-6" width="228" height="184" rx="8" fill="#ffffff" />

              {SUBWAY_MAP_LINES.map((line) => (
                <path
                  key={line.id}
                  d={getLinePath(line)}
                  fill="none"
                  stroke={line.color}
                  strokeWidth={3.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}

              {SUBWAY_MAP_STATIONS.map((station) => {
                const labelStyle = LABEL_STYLES[station.labelDirection];
                const selected = station.id === selectedStationId;
                const stationName = locale === "ko" ? station.nameKo : station.nameJa;
                
                const primaryColor = station.stationNumbers?.[0]?.color || LINES[station.lines[0]]?.color || "#334155";
                const strokeColor = selected ? "#0f172a" : (station.isTransfer ? "#334155" : primaryColor);

                const badges = station.stationNumbers || [];
                let bx = 0;
                let by = 0;
                if (station.labelDirection === "n") by = 6;
                else if (station.labelDirection === "s") by = -6;
                else if (station.labelDirection === "e") bx = -6;
                else if (station.labelDirection === "w") bx = 6;

                return (
                  <g key={station.id}>
                    {badges.length > 0 && (
                      <g>
                        {badges.map((badge, i) => {
                          const localDx = (i - (badges.length - 1) / 2) * 6.5;
                          return (
                            <g key={badge.lineId} transform={`translate(${station.x + bx + localDx}, ${station.y + by})`}>
                              <circle r={3.0} fill="#ffffff" stroke={badge.color} strokeWidth={2} />
                              <text
                                textAnchor="middle"
                                dominantBaseline="central"
                                fontSize="1.6"
                                fontWeight={700}
                                fill={badge.color}
                              >
                                {badge.code}
                              </text>
                            </g>
                          );
                        })}
                      </g>
                    )}

                    <circle
                      cx={station.x}
                      cy={station.y}
                      r={station.isTransfer ? 3.1 : 2}
                      fill="#ffffff"
                      stroke={strokeColor}
                      strokeWidth={station.isTransfer ? 1.05 : 0.75}
                    />
                    {station.isTransfer ? (
                      <circle cx={station.x} cy={station.y} r={1.2} fill={selected ? "#0f172a" : "#475569"} />
                    ) : null}
                    <a
                      href={`#${station.id}`}
                      className="cursor-pointer outline-none"
                      onClick={(event) => {
                        event.preventDefault();
                        setSelectedStationId(station.id);
                      }}
                    >
                      <circle cx={station.x} cy={station.y} r={4.8} fill="transparent" />
                      <text
                        x={station.x + labelStyle.dx}
                        y={station.y + labelStyle.dy}
                        textAnchor={labelStyle.textAnchor}
                        fontSize="2.1"
                        fontWeight={station.isTransfer ? 700 : 500}
                        fill="#0f172a"
                        className="select-none"
                      >
                        {stationName}
                      </text>
                    </a>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold tracking-wide text-slate-700">{t("subwayMap.legend")}</h2>
            <span className="text-xs text-slate-400">{t("subwayMap.stationCount", { count: SUBWAY_MAP_STATIONS.length })}</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {SUBWAY_MAP_LINES.map((line) => (
              <div key={line.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
                <span className="h-3 w-8 rounded-full" style={{ backgroundColor: line.color }} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{locale === "ko" ? line.nameKo : line.nameJa}</p>
                  <p className="text-xs text-slate-500">{t("subwayMap.stationCount", { count: line.stationIds.length })}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
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
              {selectedStation.stationNumbers && selectedStation.stationNumbers.length > 0 ? (
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
        </section>
      </div>
    </div>
  );
}
