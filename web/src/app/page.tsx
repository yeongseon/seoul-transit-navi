"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StationAutocomplete } from "../components/station-autocomplete";

interface Location {
  id: string;
  name: string;
}

interface RecentSearch {
  from: Location;
  to: Location;
  timestamp: number;
}

const POPULAR_PLACES = [
  { id: "station_myeongdong", label: "明洞" },
  { id: "station_hongik-univ", label: "弘大" },
  { id: "station_seongsu", label: "聖水" },
  { id: "station_gangnam", label: "江南" },
  { id: "station_gyeongbokgung", label: "景福宮" },
  { id: "station_seoul-station", label: "ソウル駅" },
];

export default function Home() {
  const router = useRouter();
  const [from, setFrom] = useState<Location | null>(null);
  const [to, setTo] = useState<Location | null>(null);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("recentSearches");
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch {
    }
  }, []);

  const saveRecentSearch = (f: Location, t: Location) => {
    const newSearch: RecentSearch = { from: f, to: t, timestamp: Date.now() };
    const filtered = recentSearches.filter(
      (s) => !(s.from.id === f.id && s.to.id === t.id)
    );
    const updated = [newSearch, ...filtered].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    } catch {
    }
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to) return;
    saveRecentSearch(from, to);
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
            Seoul Transit Navigation
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            ソウル交通ナビ
          </h1>
          <p className="text-sm text-slate-500 sm:text-base">
            ソウルの地下鉄を、日本語でわかりやすく。
          </p>
        </section>

        <section className="relative rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="origin" className="text-sm font-bold text-slate-700">
                出発地
              </label>
              <StationAutocomplete
                id="origin"
                name="origin"
                placeholder="例: ソウル駅"
                value={from}
                onChange={setFrom}
              />
            </div>

            <div className="relative flex items-center justify-center my-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <button
                type="button"
                onClick={handleSwap}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
                aria-label="出発地と到着地を入れ替える"
              >
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <title>入れ替えアイコン</title>
                  <path d="M7 10v12" />
                  <path d="M15 14v-12" />
                  <polyline points="3 14 7 10 11 14" />
                  <polyline points="11 6 15 2 19 6" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="destination" className="text-sm font-bold text-slate-700">
                到着地
              </label>
              <StationAutocomplete
                id="destination"
                name="destination"
                placeholder="例: 景福宮"
                value={to}
                onChange={setTo}
              />
            </div>

            <button
              type="submit"
              disabled={!from || !to}
              className="mt-2 w-full rounded-2xl bg-sky-600 px-4 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-sky-700 disabled:bg-slate-300 disabled:text-slate-500"
            >
              検索する
            </button>
          </form>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-bold text-slate-700">人気のスポットへ行く</h2>
          <div className="flex flex-wrap gap-2">
            {POPULAR_PLACES.map((place) => (
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

        {recentSearches.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-bold text-slate-700">最近の検索</h2>
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
                      <title>時計アイコン</title>
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
