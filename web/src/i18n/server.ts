import { cookies } from "next/headers";
import type { Locale } from "./config";
import { DEFAULT_LOCALE, LOCALES, COOKIE_NAME } from "./config";
import jaMessages from "./locales/ja.json";
import koMessages from "./locales/ko.json";

const messages: Record<Locale, Record<string, unknown>> = {
  ja: jaMessages,
  ko: koMessages,
};

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(COOKIE_NAME)?.value;
  if (localeCookie && LOCALES.includes(localeCookie as Locale)) {
    return localeCookie as Locale;
  }
  return DEFAULT_LOCALE;
}

function resolveKey(obj: Record<string, unknown>, key: string): string {
  const parts = key.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== "object") {
      return key;
    }
    current = (current as Record<string, unknown>)[part];
  }
  if (typeof current === "string") {
    return current;
  }
  return key;
}

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, k) => {
    return params[k] !== undefined ? String(params[k]) : `{{${k}}}`;
  });
}

export async function getTranslation() {
  const locale = await getLocale();
  const msg = messages[locale];

  function t(key: string, params?: Record<string, string | number>): string {
    const raw = resolveKey(msg, key);
    return interpolate(raw, params);
  }

  return { t, locale };
}
