"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { RouteResult } from "../../../../shared/types";
import { RouteCard } from "../../components/route-card";

function RoutesSearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const [routes, setRoutes] = useState<RouteResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutes = useCallback(async () => {
    if (!from || !to) {
      setError("出発地と到着地を指定してください");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
      const res = await fetch(`${apiUrl}/api/routes/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fromStationId: from, toStationId: to }),
      });

      if (!res.ok) {
        throw new Error("検索に失敗しました");
      }

      const { data } = await res.json();
      setRoutes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex w-fit items-center gap-2 text-sm font-semibold text-sky-600 transition hover:text-sky-700"
        >
          <span className="text-lg">←</span>
          戻る
        </button>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">
          ルート検索結果
        </h1>
        {from && to && (
          <p className="mt-1 text-sm font-medium text-slate-600">
            {from} <span className="mx-2 text-slate-400">→</span> {to}
          </p>
        )}
      </header>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-3xl bg-slate-200/50"
            />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">
          <span className="mb-4 text-4xl">⚠️</span>
          <p className="text-lg font-bold text-slate-800">{error}</p>
          <button
            type="button"
            onClick={() => fetchRoutes()}
            className="mt-6 rounded-2xl bg-slate-100 px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
          >
            再試行する
          </button>
        </div>
      ) : routes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">
          <span className="mb-4 text-4xl">🔍</span>
          <p className="text-lg font-bold text-slate-800">
            経路が見つかりませんでした
          </p>
          <p className="mt-2 text-sm text-slate-500">
            条件を変更して再度お試しください。
          </p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-6 rounded-2xl bg-sky-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-sky-700"
          >
            トップへ戻る
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {routes.map((route) => (
            <RouteCard key={route.id} route={route} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function RoutesSearchPage() {
  return (
    <main className="pb-safe min-h-screen bg-slate-50 px-6 py-10 sm:py-16 text-slate-900">
      <Suspense fallback={<div className="animate-pulse h-screen w-full bg-slate-100" />}>
        <RoutesSearchContent />
      </Suspense>
    </main>
  );
}
