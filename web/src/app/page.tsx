export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-900">
      <div className="mx-auto flex max-w-4xl flex-col gap-10">
        <section className="space-y-4">
          <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700">
            Seoul Transit Navigation
          </span>
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              ソウル交通ナビ
            </h1>
            <p className="text-lg text-slate-600 sm:text-xl">
              地下鉄もバスも、日本語でわかりやすく。
            </p>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <div className="mb-6 space-y-2">
            <h2 className="text-2xl font-semibold">ルート検索</h2>
            <p className="text-sm text-slate-500">
              出発地と到着地を入力して、最適な移動ルートを探せる予定です。
            </p>
          </div>

          <form className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              出発地
              <input
                type="text"
                name="origin"
                placeholder="例: ソウル駅"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-sky-400 focus:bg-white"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              到着地
              <input
                type="text"
                name="destination"
                placeholder="例: 景福宮"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-sky-400 focus:bg-white"
              />
            </label>

            <button
              type="submit"
              className="sm:col-span-2 rounded-2xl bg-sky-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-sky-700"
            >
              検索する
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
