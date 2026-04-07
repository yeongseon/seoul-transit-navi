"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { RouteResult } from "../../../../../shared/types";
import { RouteStepItem } from "../../../components/route-step";
import { ROUTE_TYPE_LABELS } from "../../../../../shared/constants";

export default function RouteDetailPage({
  params,
}: {
  params: Promise<{ routeId: string }>;
}) {
  const router = useRouter();
  const { routeId } = use(params);

  const [route, setRoute] = useState<RouteResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchRoute = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const res = await fetch(`${apiUrl}/api/routes/${routeId}`);
        if (!res.ok) {
          throw new Error("経路の取得に失敗しました");
        }
        const { data } = await res.json();
        setRoute(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "エラーが発生しました");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoute();
  }, [routeId]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getBadgeStyle = (type: string) => {
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

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10 sm:py-16 text-slate-900">
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          <div className="h-8 w-24 animate-pulse rounded-lg bg-slate-200/50" />
          <div className="h-48 animate-pulse rounded-3xl bg-slate-200/50" />
          <div className="h-96 animate-pulse rounded-3xl bg-slate-200/50" />
        </div>
      </main>
    );
  }

  if (error || !route) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10 sm:py-16 text-slate-900">
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center rounded-3xl bg-white p-12 shadow-sm ring-1 ring-slate-200">
          <span className="text-4xl mb-4">⚠️</span>
          <p className="text-lg font-bold text-slate-800">
            {error || "経路が見つかりませんでした"}
          </p>
          <button
            type="button"
            onClick={() => router.back()}
            className="mt-6 rounded-2xl bg-slate-100 px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
          >
            戻る
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 sm:py-16 text-slate-900">
      <div className="mx-auto flex max-w-2xl flex-col gap-8">
        <header className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-semibold text-sky-600 transition hover:text-sky-700"
          >
            <span className="text-lg">←</span>
            検索結果に戻る
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="relative flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
          >
            <span>🔗</span>
            共有
            {copied && (
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-white shadow-md after:absolute after:left-1/2 after:top-full after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-slate-800">
                コピーしました
              </span>
            )}
          </button>
        </header>

        <section className="flex flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-bold ring-1 ring-inset ${getBadgeStyle(
                route.routeType
              )}`}
            >
              {ROUTE_TYPE_LABELS[route.routeType]}
            </span>
          </div>

          <div className="mb-4 flex items-baseline gap-3">
            <span className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              {route.durationMin}
              <span className="text-2xl font-semibold text-slate-500">分</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-base font-semibold text-slate-600">
            <span className="flex items-center gap-1.5">
              <span>¥</span>
              {route.fareKrw.toLocaleString()}
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>乗換 {route.transferCount}回</span>
          </div>
          
          {route.notesJa && route.notesJa.length > 0 && (
            <div className="mt-6 flex flex-col gap-2">
              {route.notesJa.map((note, index) => (
                <div
                  key={`route-note-${index}`}
                  className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 ring-1 ring-inset ring-slate-200"
                >
                  💡 {note}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <h2 className="mb-8 text-xl font-bold tracking-tight text-slate-900">
            ルート詳細
          </h2>
          <div className="flex flex-col">
            {route.steps.map((step, index) => (
              <RouteStepItem
                key={`step-${step.order}`}
                step={step}
                isLast={index === route.steps.length - 1}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
