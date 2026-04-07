const HIRAGANA_START = 0x3041;
const HIRAGANA_END = 0x3096;
const KATAKANA_START = 0x30A1;
const KATAKANA_END = 0x30F6;
const KANA_OFFSET = 0x60;

function convertKana(value: string, start: number, end: number, offset: number): string {
  return Array.from(value, (char) => {
    const codePoint = char.codePointAt(0);

    if (codePoint === undefined || codePoint < start || codePoint > end) {
      return char;
    }

    return String.fromCodePoint(codePoint + offset);
  }).join("");
}

export function toKatakana(value: string): string {
  return convertKana(value, HIRAGANA_START, HIRAGANA_END, KANA_OFFSET);
}

export function toHiragana(value: string): string {
  return convertKana(value, KATAKANA_START, KATAKANA_END, -KANA_OFFSET);
}

export function normalizeSearchText(value: string, lang = "ja"): string {
  const normalized = value.trim().toLowerCase();

  if (lang === "ja") {
    return toKatakana(normalized);
  }

  return normalized;
}

export function buildSearchPrefixes(value: string, lang = "ja"): string[] {
  const normalized = normalizeSearchText(value, lang);

  if (!normalized) {
    return [];
  }

  if (lang !== "ja") {
    return [normalized];
  }

  return Array.from(new Set([normalized, toKatakana(normalized), toHiragana(normalized)]));
}
