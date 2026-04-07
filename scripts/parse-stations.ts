import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import * as sharedConstants from "../shared/constants/index.ts";
import type { LineId } from "../shared/constants/index.ts";
import coordinateFixtures from "../data/fixtures/coordinates.ts";

const { STATION_COORDINATES } = coordinateFixtures;

const { LINES } = sharedConstants;
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));

type CsvRecord = {
  stationCode: string;
  nameKo: string;
  lineNameKo: string;
  nameHanja: string | null;
  nameEn: string;
  nameCn: string | null;
  nameJa: string;
};

export type StationRow = {
  id: string;
  stationCode: string;
  nameKo: string;
  nameJa: string;
  nameEn: string;
  nameCn: string | null;
  nameHanja: string | null;
  lat: number;
  lng: number;
  complexityLevel: number;
};

export type LineRow = {
  id: string;
  lineNumber: number;
  nameKo: string;
  nameJa: string;
  nameEn: string;
  color: string;
  type: (typeof LINES)[LineId]["type"];
};

export type StationLineRow = {
  stationId: string;
  lineId: LineId;
};

export type AliasRow = {
  stationId: string;
  alias: string;
};

export type ParsedData = {
  stations: StationRow[];
  lines: LineRow[];
  stationLines: StationLineRow[];
  aliases: AliasRow[];
};

const LINE_NAME_TO_ID = Object.values(LINES).reduce<Record<string, LineId>>((acc, line) => {
  acc[line.nameKo] = line.id;
  return acc;
}, {});

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === '"') {
      const nextChar = line[index + 1];

      if (inQuotes && nextChar === '"') {
        current += '"';
        index += 1;
        continue;
      }

      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      fields.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  fields.push(current);
  return fields;
}

function parseCsvRecords(csvContent: string): CsvRecord[] {
  const normalized = csvContent.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").trim();
  const lines = normalized.split("\n");

  if (lines.length < 2) {
    return [];
  }

  return lines.slice(1).filter(Boolean).map((line) => {
    const [stationCode, nameKo, lineNameKo, nameHanja, nameEn, nameCn, nameJa] = parseCsvLine(line);

    if (!stationCode || !nameKo || !lineNameKo || !nameEn || !nameJa) {
      throw new Error(`Invalid CSV row: ${line}`);
    }

    return {
      stationCode: stationCode.trim(),
      nameKo: nameKo.trim(),
      lineNameKo: lineNameKo.trim(),
      nameHanja: nameHanja.trim() ? nameHanja.trim() : null,
      nameEn: nameEn.trim(),
      nameCn: nameCn.trim() ? nameCn.trim() : null,
      nameJa: nameJa.trim(),
    };
  });
}

function slugifyEnglishName(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/['’.]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function getLineId(lineNameKo: string): LineId {
  const lineId = LINE_NAME_TO_ID[lineNameKo];

  if (!lineId) {
    throw new Error(`Unsupported line name: ${lineNameKo}`);
  }

  return lineId;
}

export function parseStationsCSV(csvPath: string): ParsedData {
  const csvContent = fs.readFileSync(csvPath, "utf8");
  const records = parseCsvRecords(csvContent);
  const groupedStations = new Map<string, { first: CsvRecord; stationId: string; lineIds: Set<LineId> }>();
  const encounteredLineIds = new Set<LineId>();

  for (const record of records) {
    const lineId = getLineId(record.lineNameKo);
    encounteredLineIds.add(lineId);

    const existing = groupedStations.get(record.nameKo);

    if (existing) {
      existing.lineIds.add(lineId);
      continue;
    }

    groupedStations.set(record.nameKo, {
      first: record,
      stationId: `station_${slugifyEnglishName(record.nameEn)}`,
      lineIds: new Set<LineId>([lineId]),
    });
  }

  const stations: StationRow[] = [];
  const stationLines: StationLineRow[] = [];
  const aliases: AliasRow[] = [];

  for (const { first, stationId, lineIds } of groupedStations.values()) {
    const sortedLineIds = Array.from(lineIds).sort((left, right) => LINES[left].lineNumber - LINES[right].lineNumber);
    const complexityLevel = sortedLineIds.length >= 3 ? 3 : sortedLineIds.length === 2 ? 2 : 1;

    stations.push({
      id: stationId,
      stationCode: first.stationCode,
      nameKo: first.nameKo,
      nameJa: first.nameJa,
      nameEn: first.nameEn,
      nameCn: first.nameCn,
      nameHanja: first.nameHanja,
      lat: STATION_COORDINATES[stationId]?.lat ?? 0,
      lng: STATION_COORDINATES[stationId]?.lng ?? 0,
      complexityLevel,
    });

    for (const lineId of sortedLineIds) {
      stationLines.push({ stationId, lineId });
    }

    const stationAliases = [first.nameKo, first.nameJa, first.nameEn.toLowerCase()]
      .map((alias) => alias.trim())
      .filter((alias, index, collection) => alias.length > 0 && collection.indexOf(alias) === index);

    for (const alias of stationAliases) {
      aliases.push({ stationId, alias });
    }
  }

  stations.sort((left, right) => left.id.localeCompare(right.id));
  stationLines.sort((left, right) => {
    const stationComparison = left.stationId.localeCompare(right.stationId);
    return stationComparison !== 0 ? stationComparison : left.lineId.localeCompare(right.lineId);
  });
  aliases.sort((left, right) => {
    const stationComparison = left.stationId.localeCompare(right.stationId);
    return stationComparison !== 0 ? stationComparison : left.alias.localeCompare(right.alias);
  });

  const lines: LineRow[] = Array.from(encounteredLineIds)
    .sort((left, right) => LINES[left].lineNumber - LINES[right].lineNumber)
    .map((lineId) => ({ ...LINES[lineId] }));

  return { stations, lines, stationLines, aliases };
}

function main(): void {
  const data = parseStationsCSV(path.resolve(SCRIPT_DIR, "../data/fixtures/stations.csv"));
  console.log(
    `Parsed ${data.stations.length} stations, ${data.stationLines.length} station-line mappings, ${data.aliases.length} aliases`,
  );
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main();
}
