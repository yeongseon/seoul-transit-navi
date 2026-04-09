import Link from "next/link";
import { getTranslation } from "../../../i18n/server";

export default async function PlaceNotFound() {
  const { t } = await getTranslation();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-4 text-center">
      <div className="flex max-w-md flex-col items-center gap-6 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <span className="text-5xl">👀</span>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-slate-900">
            {t("placeNotFound.title")}
          </h2>
          <p className="text-sm text-slate-500">
            {t("placeNotFound.description")}
          </p>
        </div>
        <Link
          href="/places"
          className="w-full rounded-2xl bg-sky-600 px-6 py-3.5 text-base font-bold text-white transition hover:bg-sky-700 active:bg-sky-800"
        >
          {t("placeNotFound.backToList")}
        </Link>
      </div>
    </div>
  );
}
