import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center pb-safe bg-slate-50">
      <div className="flex max-w-md flex-col items-center gap-6 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <span className="text-5xl">🔍</span>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-slate-900">
            ページが見つかりませんでした
          </h2>
          <p className="text-sm text-slate-500">
            お探しのページは削除されたか、URLが変更された可能性があります。
          </p>
        </div>
        <Link
          href="/"
          className="w-full rounded-2xl bg-sky-600 px-6 py-3.5 text-base font-bold text-white transition hover:bg-sky-700 active:bg-sky-800"
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  );
}
