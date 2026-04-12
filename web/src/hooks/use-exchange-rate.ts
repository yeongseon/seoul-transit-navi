"use client";

import { useEffect, useState } from "react";

import { getExchangeRate, type ExchangeRate } from "../lib/exchange-rate";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export function useExchangeRate() {
  const [rate, setRate] = useState<ExchangeRate | null>(null);

  useEffect(() => {
    getExchangeRate(API_BASE).then(setRate).catch(() => {});
  }, []);

  return rate;
}
