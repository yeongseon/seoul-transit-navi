"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LINES } from "../../../shared/constants";
import { useTranslation } from "../i18n/client";
import {
  SUBWAY_MAP_CANVAS_SIZE,
  SUBWAY_MAP_CENTER_INSET,
  SUBWAY_MAP_INITIAL_SCROLL,
  SUBWAY_MAP_LINES,
  SUBWAY_MAP_STATIONS,
  SUBWAY_MAP_STATIONS_BY_ID,
  SUBWAY_MAP_VIEW_BOX,
} from "../data/subway-map-data";
import { MapInfoPanel } from "./map-info-panel";
import { SubwayMapCanvas } from "./subway-map-canvas";

export function SubwayMap() {
  const { locale, t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [selectedStationId, setSelectedStationId] = useState<string>(SUBWAY_MAP_STATIONS_BY_ID["station_city-hall"].id);
  const [mobilePanelExpanded, setMobilePanelExpanded] = useState(false);
  const [detailLevel, setDetailLevel] = useState<"overview" | "detailed">("overview");
  const [detailOverride, setDetailOverride] = useState<"overview" | "detailed" | null>(null);
  const [centerInsetExpanded, setCenterInsetExpanded] = useState(true);

  useEffect(() => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const left = Math.max(0, (container.scrollWidth - container.clientWidth) * SUBWAY_MAP_INITIAL_SCROLL.leftRatio);
    const top = Math.max(0, (container.scrollHeight - container.clientHeight) * SUBWAY_MAP_INITIAL_SCROLL.topRatio);
    container.scrollTo({ left, top });
  }, []);

  useEffect(() => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const updateDetailLevel = () => {
      const visibleRatio = container.clientWidth / container.scrollWidth;
      setDetailLevel(visibleRatio > 0.4 ? "detailed" : "overview");
    };

    updateDetailLevel();

    const handleScroll = () => {
      updateDetailLevel();
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateDetailLevel);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateDetailLevel);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const syncExpandedState = (event?: MediaQueryList | MediaQueryListEvent) => {
      setCenterInsetExpanded(event?.matches ?? mediaQuery.matches);
    };

    syncExpandedState(mediaQuery);
    mediaQuery.addEventListener("change", syncExpandedState);

    return () => {
      mediaQuery.removeEventListener("change", syncExpandedState);
    };
  }, []);

  const selectedStation = useMemo(
    () => SUBWAY_MAP_STATIONS_BY_ID[selectedStationId] ?? SUBWAY_MAP_STATIONS[0],
    [selectedStationId],
  );

  const centerStations = useMemo(
    () => SUBWAY_MAP_STATIONS.filter((station) => station.x >= 50 && station.x <= 135 && station.y >= 0 && station.y <= 75),
    [],
  );

  const handleSelectStation = (stationId: string) => {
    setSelectedStationId(stationId);
    setMobilePanelExpanded(false);
  };

  const effectiveDetailLevel = detailOverride ?? detailLevel;
  const detailToggleLabel = effectiveDetailLevel === "detailed" ? t("subwayMap.showMajorOnly") : t("subwayMap.showAllStations");

  return (
    <div className="space-y-4 pb-24 lg:pb-0">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white/90 px-4 py-3 ring-1 ring-slate-200">
        <p className="text-sm font-medium text-slate-600">{t("subwayMap.tapStation")}</p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setDetailOverride(effectiveDetailLevel === "detailed" ? "overview" : "detailed");
            }}
            className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-slate-700"
            aria-pressed={effectiveDetailLevel === "detailed"}
          >
            {detailToggleLabel}
          </button>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-900" />
            <span>{t("subwayMap.transfer")}</span>
          </div>
        </div>
      </div>

      <div className="relative lg:grid lg:grid-cols-[1fr_380px] lg:items-start lg:gap-4">
        <div className="overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-slate-200">
          <div
            ref={scrollRef}
            className="overflow-auto bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.04)_0,rgba(15,23,42,0.04)_1px,transparent_1px)] [background-position:0_0] [background-size:20px_20px]"
          >
            <div style={{ width: SUBWAY_MAP_CANVAS_SIZE.width, minWidth: SUBWAY_MAP_CANVAS_SIZE.width }} className="p-6">
              <SubwayMapCanvas
                stations={SUBWAY_MAP_STATIONS}
                lines={SUBWAY_MAP_LINES}
                selectedStationId={selectedStationId}
                onSelectStation={handleSelectStation}
                locale={locale}
                detailLevel={effectiveDetailLevel}
                viewBox={SUBWAY_MAP_VIEW_BOX}
                canvasSize={SUBWAY_MAP_CANVAS_SIZE}
              />
            </div>
          </div>
        </div>

        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 px-4 pb-4 lg:pointer-events-auto lg:sticky lg:top-4 lg:z-auto lg:px-0 lg:pb-0">
          <div
            className={`pointer-events-auto mx-auto max-w-[380px] transition-transform duration-300 ease-out lg:max-w-none lg:translate-y-0 ${mobilePanelExpanded ? "translate-y-0" : "translate-y-[calc(100%-5rem)]"}`}
          >
            <button
              type="button"
              className="flex h-20 w-full items-center justify-between gap-3 rounded-t-[28px] bg-white/95 px-5 shadow-sm ring-1 ring-slate-200 lg:hidden"
              onClick={() => setMobilePanelExpanded((current) => !current)}
              aria-expanded={mobilePanelExpanded}
              aria-controls="subway-map-info-panel"
            >
              <div className="min-w-0 flex-1">
                <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-slate-300" />
                <p className="truncate text-left text-sm font-semibold text-slate-900">
                  {locale === "ko" ? selectedStation.nameKo : selectedStation.nameJa}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
                {selectedStation.stationNumbers.length > 0
                  ? selectedStation.stationNumbers.map((badge) => (
                      <span
                        key={badge.lineId}
                        className="inline-flex min-w-7 items-center justify-center rounded-full px-2 py-1 text-[10px] font-bold text-white"
                        style={{ backgroundColor: badge.color }}
                      >
                        {badge.code}
                      </span>
                    ))
                  : selectedStation.lines.map((lineId) => (
                      <span
                        key={lineId}
                        className="inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-[10px] font-bold text-white"
                        style={{ backgroundColor: LINES[lineId].color }}
                      >
                        •
                      </span>
                    ))}
              </div>
            </button>

            <div id="subway-map-info-panel" className="rounded-b-[28px] lg:rounded-[28px]">
              <MapInfoPanel selectedStation={selectedStation} lines={SUBWAY_MAP_LINES} locale={locale} t={t} />
            </div>
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded-[28px] bg-white/95 shadow-sm ring-1 ring-slate-200">
        <button
          type="button"
          className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50/80"
          onClick={() => setCenterInsetExpanded((current) => !current)}
          aria-expanded={centerInsetExpanded}
          aria-controls="subway-map-center-inset"
        >
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-900">{t("subwayMap.centerInset")}</p>
            <p className="text-sm text-slate-500">{t("subwayMap.centerInsetDescription")}</p>
          </div>
          <span
            aria-hidden="true"
            className={`mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-transform ${centerInsetExpanded ? "rotate-180" : "rotate-0"}`}
          >
            ↓
          </span>
        </button>

        {centerInsetExpanded && (
          <div id="subway-map-center-inset" className="border-t border-slate-200/80 p-4 sm:p-5">
            <div className="overflow-hidden rounded-[24px] bg-slate-50 ring-1 ring-slate-200">
              <div className="overflow-auto bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.04)_0,rgba(15,23,42,0.04)_1px,transparent_1px)] [background-position:0_0] [background-size:18px_18px] p-4">
                <div style={{ width: 900, minWidth: 900 }}>
                  <SubwayMapCanvas
                    stations={centerStations}
                    lineStations={SUBWAY_MAP_STATIONS}
                    lines={SUBWAY_MAP_LINES}
                    selectedStationId={selectedStationId}
                    onSelectStation={handleSelectStation}
                    locale={locale}
                    detailLevel="detailed"
                    viewBox={SUBWAY_MAP_CENTER_INSET.viewBox}
                    canvasSize={{ width: 900, height: 788 }}
                    backgroundRect={{ x: 55, y: 5, width: 80, height: 70 }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
