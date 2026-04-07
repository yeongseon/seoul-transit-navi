"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function PlacesError({
  error: pageError,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(pageError);
  }, [pageError]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-4 text-center">
      <div className="flex max-w-md flex-col items-center gap-6 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <span className="text-5xl">📍</span>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-slate-900">
            目的地の読み込みに失敗しました
          </h2>
          <p className="text-sm text-slate-500">
            通信状況を確認して、もう一度お試しください。
          </p>
        </div>
        <div className="flex w-full flex-col gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full rounded-2xl bg-sky-600 px-6 py-3.5 text-base font-bold text-white transition hover:bg-sky-700 active:bg-sky-800"
          >
            再試行する
          </button>
          <Link
            href="/"
            className="w-full rounded-2xl bg-slate-100 px-6 py-3.5 text-base font-bold text-slate-700 transition hover:bg-slate-200 active:bg-slate-300"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
