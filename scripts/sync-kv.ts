import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { parseStationsCSV } from "./parse-stations.ts";

type CacheStation = {
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
  lineIds: string[];
};

type KvBulkEntry = {
  key: string;
  value: string;
};

const SCRIPT_DIR = import.meta.dirname;

function buildCacheStations(): CacheStation[] {
  const data = parseStationsCSV(path.resolve(SCRIPT_DIR, "../data/fixtures/stations.csv"));
  const lineIdsByStationId = new Map<string, string[]>();

  for (const stationLine of data.stationLines) {
    const existing = lineIdsByStationId.get(stationLine.stationId);

    if (existing) {
      existing.push(stationLine.lineId);
      continue;
    }

    lineIdsByStationId.set(stationLine.stationId, [stationLine.lineId]);
  }

  return data.stations.map((station) => ({
    id: station.id,
    stationCode: station.stationCode,
    nameKo: station.nameKo,
    nameJa: station.nameJa,
    nameEn: station.nameEn,
    nameCn: station.nameCn,
    nameHanja: station.nameHanja,
    lat: station.lat,
    lng: station.lng,
    complexityLevel: station.complexityLevel,
    lineIds: (lineIdsByStationId.get(station.id) ?? []).slice().sort(),
  }));
}

function buildSearchIndex(stations: CacheStation[]): Map<string, string[]> {
  const matchesByPrefix = new Map<string, Set<string>>();

  for (const station of stations) {
    const characters = Array.from(station.nameJa.trim());

    for (let length = 1; length <= Math.min(3, characters.length); length += 1) {
      const prefix = characters.slice(0, length).join("");
      const existing = matchesByPrefix.get(prefix);

      if (existing) {
        existing.add(station.id);
        continue;
      }

      matchesByPrefix.set(prefix, new Set<string>([station.id]));
    }
  }

  return new Map(
    Array.from(matchesByPrefix.entries())
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([prefix, stationIds]) => [prefix, Array.from(stationIds).sort()]),
  );
}

function buildBulkEntries(): KvBulkEntry[] {
  const stations = buildCacheStations();
  const searchIndex = buildSearchIndex(stations);
  const stationEntries = stations.map((station) => ({
    key: `station:${station.id}`,
    value: JSON.stringify(station),
  }));
  const searchEntries = Array.from(searchIndex.entries()).map(([prefix, stationIds]) => ({
    key: `search:${prefix}`,
    value: JSON.stringify(stationIds),
  }));

  return [...stationEntries, ...searchEntries];
}

function main(): void {
  const bulkEntries = buildBulkEntries();
  const preview = process.argv.includes("--preview");
  const dryRun = process.argv.includes("--dry-run");
  const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "seoul-transit-navi-kv-"));
  const bulkPath = path.join(tempDirectory, "station-cache-bulk.json");

  try {
    fs.writeFileSync(bulkPath, `${JSON.stringify(bulkEntries, null, 2)}\n`, "utf8");

    if (dryRun) {
      console.log(`Prepared ${bulkEntries.length} KV entries at ${bulkPath}`);
      return;
    }

    const commandArguments = [
      "wrangler",
      "kv",
      "bulk",
      "put",
      bulkPath,
      "--binding=STATION_CACHE",
      `--config=${path.resolve(SCRIPT_DIR, "../api/wrangler.toml")}`,
    ];

    if (preview) {
      commandArguments.push("--preview");
    }

    execFileSync("npx", commandArguments, {
      cwd: path.resolve(SCRIPT_DIR, ".."),
      stdio: "inherit",
    });

    console.log(`Synced ${bulkEntries.length} KV entries to STATION_CACHE`);
  } finally {
    fs.rmSync(tempDirectory, { recursive: true, force: true });
  }
}

if (process.argv[1] && import.meta.filename === path.resolve(process.argv[1])) {
  main();
}
