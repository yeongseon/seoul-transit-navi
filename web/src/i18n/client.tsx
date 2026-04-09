"use client";

import { createContext, useContext, useCallback, type ReactNode } from "react";
import type { Locale } from "./config";
import { COOKIE_NAME } from "./config";

interface TranslationContextValue {
  locale: Locale;
  t: (key: string, params?: Record<string, string | number>) => string;
  setLocale: (locale: Locale) => void;
}

const TranslationContext = createContext<TranslationContextValue | null>(null);

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

interface TranslationProviderProps {
  children: ReactNode;
  locale: Locale;
  messages: Record<string, unknown>;
}

export function TranslationProvider({ children, locale, messages }: TranslationProviderProps) {
  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const raw = resolveKey(messages, key);
      return interpolate(raw, params);
    },
    [messages]
  );

  const setLocale = useCallback((newLocale: Locale) => {
    document.cookie = `${COOKIE_NAME}=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.reload();
  }, []);

  return (
    <TranslationContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation(): TranslationContextValue {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}
