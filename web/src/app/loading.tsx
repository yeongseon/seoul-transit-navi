export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 pb-safe">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600"></div>
        <p className="text-sm font-medium text-slate-500">読み込み中...</p>
      </div>
    </div>
  );
}
