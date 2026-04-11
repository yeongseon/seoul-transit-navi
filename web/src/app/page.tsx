"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StationAutocomplete } from "../components/station-autocomplete";
import { useTranslation } from "../i18n/client";
import { trackEvent } from "../lib/analytics";

interface Location {
  id: string;
  name: string;
}

interface RecentSearch {
  from: Location;
  to: Location;
  timestamp: number;
}

export default function Home() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const [from, setFrom] = useState<Location | null>(null);
  const [to, setTo] = useState<Location | null>(null);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);

  const POPULAR_DESTINATIONS = [
    { id: "station_myeongdong", label: t("popularPlaces.myeongdong") },
    { id: "station_hongik-univ", label: t("popularPlaces.hongdae") },
    { id: "station_seongsu", label: t("popularPlaces.seongsu") },
    { id: "station_gangnam", label: t("popularPlaces.gangnam") },
    { id: "station_gyeongbokgung", label: t("popularPlaces.gyeongbokgung") },
    { id: "station_seoul-station", label: t("popularPlaces.seoulStation") },
  ];

  const AIRPORT_SHORTCUTS = [
    { destinationId: "station_seoul-station", label: t("airportShortcuts.incheonToSeoul"), airportName: t("airportShortcuts.incheonAirport"), airportLat: 37.4602, airportLng: 126.4407 },
    { destinationId: "station_hongik-univ", label: t("airportShortcuts.incheonToHongdae"), airportName: t("airportShortcuts.incheonAirport"), airportLat: 37.4602, airportLng: 126.4407 },
    { destinationId: "station_gangnam", label: t("airportShortcuts.gimpoToGangnam"), airportName: t("airportShortcuts.gimpoAirport"), airportLat: 37.5585, airportLng: 126.7945 },
  ];

  const ROUTE_PRESETS = [
    { fromId: "station_myeongdong", toId: "station_hongik-univ", labelKey: "routePresets.myeongdongToHongdae" },
    { fromId: "station_myeongdong", toId: "station_gyeongbokgung", labelKey: "routePresets.myeongdongToGyeongbokgung" },
    { fromId: "station_hongik-univ", toId: "station_gangnam", labelKey: "routePresets.hongdaeToGangnam" },
    { fromId: "station_hongik-univ", toId: "station_seongsu", labelKey: "routePresets.hongdaeToSeongsu" },
    { fromId: "station_myeongdong", toId: "station_dongdaemun-history-and-culture-park", labelKey: "routePresets.myeongdongToDongdaemun" },
    { fromId: "station_gangnam", toId: "station_jamsil", labelKey: "routePresets.gangnamToJamsil" },
    { fromId: "station_myeongdong", toId: "station_gangnam", labelKey: "routePresets.myeongdongToGangnam" },
  ];

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`recentSearches_${locale}`);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      } else {
        setRecentSearches([]);
      }
    } catch {
      console.warn("Failed to read recent searches from localStorage");
    }
  }, [locale]);

  const saveRecentSearch = (f: Location, t: Location) => {
    const newSearch: RecentSearch = { from: f, to: t, timestamp: Date.now() };
    const filtered = recentSearches.filter(
      (s) => !(s.from.id === f.id && s.to.id === t.id)
    );
    const updated = [newSearch, ...filtered].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem(`recentSearches_${locale}`, JSON.stringify(updated));
    } catch {
      console.warn("Failed to save recent searches to localStorage");
    }
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFrom({ id: `coord_${pos.coords.latitude}_${pos.coords.longitude}`, name: t("home.currentLocation") });
        setLocationLoading(false);
      },
      () => setLocationLoading(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = () => {
    if (!from || !to) return;
    saveRecentSearch(from, to);
    trackEvent({ type: "route_search", from: from.id, to: to.id });
    router.push(`/routes?from=${from.id}&to=${to.id}&fromName=${encodeURIComponent(from.name)}&toName=${encodeURIComponent(to.name)}`);
  };

  const handlePopularClick = (placeId: string, placeName: string) => {
    const destination = { id: placeId, name: placeName };
    setTo(destination);
    if (from) {
      saveRecentSearch(from, destination);
      router.push(`/routes?from=${from.id}&to=${placeId}&fromName=${encodeURIComponent(from.name)}&toName=${encodeURIComponent(placeName)}`);
    }
  };

  const handleAirportClick = (shortcut: typeof AIRPORT_SHORTCUTS[number]) => {
    const origin = { id: `coord_${shortcut.airportLat}_${shortcut.airportLng}`, name: shortcut.airportName };
    const destName = shortcut.label.split("→")[1] || shortcut.label;
    const destination = { id: shortcut.destinationId, name: destName };

    setFrom(origin);
    setTo(destination);
    saveRecentSearch(origin, destination);
    router.push(`/routes?from=${origin.id}&to=${destination.id}&fromName=${encodeURIComponent(origin.name)}&toName=${encodeURIComponent(destination.name)}`);
  };

  const handleRoutePresetClick = (preset: typeof ROUTE_PRESETS[number]) => {
    const label = t(preset.labelKey);
    const [fromName, toName] = label.split(" → ");
    const origin = { id: preset.fromId, name: fromName || "" };
    const destination = { id: preset.toId, name: toName || "" };
    setFrom(origin);
    setTo(destination);
    saveRecentSearch(origin, destination);
    trackEvent({ type: "route_preset_click", preset: preset.labelKey });
    router.push(`/routes?from=${origin.id}&to=${destination.id}&fromName=${encodeURIComponent(origin.name)}&toName=${encodeURIComponent(destination.name)}`);
  };

  const handleRecentClick = (search: RecentSearch) => {
    setFrom(search.from);
    setTo(search.to);
    saveRecentSearch(search.from, search.to);
    router.push(`/routes?from=${search.from.id}&to=${search.to.id}&fromName=${encodeURIComponent(search.from.name)}&toName=${encodeURIComponent(search.to.name)}`);
  };

  return (
    <main className="pb-safe min-h-screen bg-slate-50 px-4 py-12 text-slate-900 sm:px-6 sm:py-16">
      <div className="mx-auto flex max-w-lg flex-col gap-8">
        <section className="flex flex-col items-center text-center space-y-3">
          <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold tracking-wide text-sky-700">
            {t("home.badge")}
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t("home.title")}
          </h1>
          <p className="text-sm text-slate-500 sm:text-base">
            {t("home.subtitle")}
          </p>
        </section>

        <section className="relative rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1.5">
              <label htmlFor="origin" className="text-sm font-bold text-slate-700">
                {t("home.origin")}
              </label>
              <StationAutocomplete
                id="origin"
                name="origin"
                placeholder={t("home.originPlaceholder")}
                value={from}
                onChange={setFrom}
              />
              <button
                type="button"
                onClick={handleCurrentLocation}
                disabled={locationLoading}
                className="mt-1 flex w-fit items-center gap-1.5 text-xs font-medium text-sky-600 transition hover:text-sky-700 disabled:text-slate-400"
              >
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {locationLoading ? t("home.locating") : t("home.useCurrentLocation")}
              </button>
            </div>

            <div className="relative flex items-center justify-center my-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <button
                type="button"
                onClick={handleSwap}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
                aria-label={t("home.swapAriaLabel")}
              >
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <title>{t("home.swapIconTitle")}</title>
                  <path d="M7 10v12" />
                  <path d="M15 14v-12" />
                  <polyline points="3 14 7 10 11 14" />
                  <polyline points="11 6 15 2 19 6" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="destination" className="text-sm font-bold text-slate-700">
                {t("home.destination")}
              </label>
              <StationAutocomplete
                id="destination"
                name="destination"
                placeholder={t("home.destinationPlaceholder")}
                value={to}
                onChange={setTo}
              />
            </div>

            <button
              type="submit"
              disabled={!from || !to}
              className="mt-2 w-full rounded-2xl bg-sky-600 px-4 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-sky-700 disabled:bg-slate-300 disabled:text-slate-500"
            >
              {t("home.search")}
            </button>
          </form>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-bold text-slate-700">{t("home.popularPlaces")}</h2>
          <div className="flex flex-wrap gap-2">
            {POPULAR_DESTINATIONS.map((place) => (
              <button
                key={place.id}
                type="button"
                onClick={() => handlePopularClick(place.id, place.label)}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
              >
                {place.label}
              </button>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-bold text-slate-700">{t("home.airportAccess")}</h2>
          <div className="flex flex-wrap gap-2">
            {AIRPORT_SHORTCUTS.map((shortcut) => (
              <button
                key={`${shortcut.airportName}-${shortcut.destinationId}`}
                type="button"
                onClick={() => handleAirportClick(shortcut)}
                className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
              >
                <span>✈️</span>
                {shortcut.label}
              </button>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-700">{t("home.popularRoutes")}</h2>
            <p className="text-xs text-slate-500">{t("home.popularRoutesDescription")}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {ROUTE_PRESETS.map((preset) => (
              <button
                key={`${preset.fromId}-${preset.toId}`}
                type="button"
                onClick={() => handleRoutePresetClick(preset)}
                className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
              >
                <span className="text-sky-500">→</span>
                {t(preset.labelKey)}
              </button>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-2">
            <Link
              href="/subway-map"
              className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-4 text-center shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              <span className="text-2xl" aria-hidden="true">🗺️</span>
              <span className="text-xs font-semibold text-slate-700">{t("subwayMap.title")}</span>
            </Link>
            <Link
              href="/airport"
              className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-4 text-center shadow-sm transition hover:border-sky-300 hover:bg-sky-50"
            >
              <span className="text-2xl" aria-hidden="true">✈️</span>
              <span className="text-xs font-semibold text-slate-700">{t("home.airportGuide")}</span>
            </Link>
            <Link
              href="/tips"
              className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-4 text-center shadow-sm transition hover:border-amber-300 hover:bg-amber-50"
            >
              <span className="text-2xl" aria-hidden="true">💡</span>
              <span className="text-xs font-semibold text-slate-700">{t("home.transitTips")}</span>
            </Link>
            <Link
              href="/area-guides"
              className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-4 text-center shadow-sm transition hover:border-orange-300 hover:bg-orange-50"
            >
              <span className="text-2xl" aria-hidden="true">📍</span>
              <span className="text-xs font-semibold text-slate-700">{t("home.areaGuides")}</span>
            </Link>
            <Link
              href="/station-guides"
              className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-4 text-center shadow-sm transition hover:border-rose-300 hover:bg-rose-50"
            >
              <span className="text-2xl" aria-hidden="true">🚉</span>
              <span className="text-xs font-semibold text-slate-700">{t("home.stationGuides")}</span>
            </Link>
          </div>
        </section>

        {recentSearches.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-bold text-slate-700">{t("home.recentSearches")}</h2>
            <div className="flex flex-col gap-2">
              {recentSearches.map((search, index) => (
                <button
                  key={`recent-${search.timestamp}-${index}`}
                  type="button"
                  onClick={() => handleRecentClick(search)}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-sky-300 hover:bg-sky-50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <title>{t("home.clockIconTitle")}</title>
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                      <span className="truncate">{search.from.name}</span>
                      <span className="text-slate-400">→</span>
                      <span className="truncate">{search.to.name}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
