export const LOCALES = ["ja", "ko"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ja";

export const COOKIE_NAME = "locale";
