export interface ExchangeRate {
  krwPerJpy: number;
  updatedAt: string;
}

const FALLBACK_RATE: ExchangeRate = {
  krwPerJpy: 9.2,
  updatedAt: "fallback",
};

let cachedRate: ExchangeRate | null = null;
let lastFetch = 0;
const CACHE_DURATION = 60 * 60 * 1000;

export async function getExchangeRate(apiBase: string): Promise<ExchangeRate> {
  if (cachedRate && Date.now() - lastFetch < CACHE_DURATION) {
    return cachedRate;
  }

  try {
    const res = await fetch(`${apiBase}/api/exchange-rate`);

    if (!res.ok) {
      return FALLBACK_RATE;
    }

    const data = (await res.json()) as ExchangeRate;
    cachedRate = data;
    lastFetch = Date.now();
    return cachedRate;
  } catch {
    return FALLBACK_RATE;
  }
}

export function convertKrwToJpy(krwAmount: number, rate: ExchangeRate): number {
  return Math.round(krwAmount / rate.krwPerJpy / 100) * 100;
}

export function formatWithJpy(krwText: string, rate: ExchangeRate | null): string {
  if (!rate) {
    return krwText;
  }

  return krwText.replace(/₩([\d,]+)/g, (match, amount) => {
    const numericAmount = parseInt(amount.replace(/,/g, ""), 10);

    if (Number.isNaN(numericAmount)) {
      return match;
    }

    const jpyAmount = convertKrwToJpy(numericAmount, rate);
    return `${match}（約¥${jpyAmount.toLocaleString()}）`;
  });
}
