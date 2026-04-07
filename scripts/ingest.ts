import fs from "node:fs";
import path from "node:path";

import connectionFixtures from "../data/fixtures/connections.ts";
import transferFixtures from "../data/fixtures/transfers.ts";
import * as sharedConstants from "../shared/constants/index.ts";
import type { LineId } from "../shared/constants/index.ts";
import type { ParsedData } from "./parse-stations.ts";
import { parseStationsCSV } from "./parse-stations.ts";

const { LINES } = sharedConstants;
const { CONNECTIONS } = connectionFixtures;
const { TRANSFERS } = transferFixtures;
const SCRIPT_DIR = import.meta.dirname;

function escapeSqlString(value: string | null): string {
  if (value === null) {
    return "NULL";
  }

  return `'${value.replace(/'/g, "''")}'`;
}

function buildStationLookup(data: ParsedData): {
  stationIdByNameKo: Map<string, string>;
  lineIdsByStationNameKo: Map<string, Set<LineId>>;
} {
  const stationIdByNameKo = new Map<string, string>();
  const stationNameById = new Map<string, string>();

  for (const station of data.stations) {
    stationIdByNameKo.set(station.nameKo, station.id);
    stationNameById.set(station.id, station.nameKo);
  }

  const lineIdsByStationNameKo = new Map<string, Set<LineId>>();

  for (const stationLine of data.stationLines) {
    const stationNameKo = stationNameById.get(stationLine.stationId);

    if (!stationNameKo) {
      throw new Error(`Missing station name for station id: ${stationLine.stationId}`);
    }

    const existing = lineIdsByStationNameKo.get(stationNameKo);

    if (existing) {
      existing.add(stationLine.lineId);
      continue;
    }

    lineIdsByStationNameKo.set(stationNameKo, new Set<LineId>([stationLine.lineId]));
  }

  return {
    stationIdByNameKo,
    lineIdsByStationNameKo,
  };
}

function requireStationId(stationIdByNameKo: Map<string, string>, stationNameKo: string): string {
  const stationId = stationIdByNameKo.get(stationNameKo);

  if (!stationId) {
    throw new Error(`Unknown station fixture name: ${stationNameKo}`);
  }

  return stationId;
}

function requireStationLine(lineIdsByStationNameKo: Map<string, Set<LineId>>, stationNameKo: string, lineId: LineId): void {
  const lineIds = lineIdsByStationNameKo.get(stationNameKo);

  if (!lineIds || !lineIds.has(lineId)) {
    throw new Error(`Station ${stationNameKo} is not mapped to ${lineId}`);
  }
}

function buildSeedSql(): {
  sql: string;
  stats: {
    lineCount: number;
    stationCount: number;
    stationLineCount: number;
    aliasCount: number;
    connectionCount: number;
    transferCount: number;
  };
} {
  const data = parseStationsCSV(path.resolve(SCRIPT_DIR, "../data/fixtures/stations.csv"));
  const { stationIdByNameKo, lineIdsByStationNameKo } = buildStationLookup(data);

  const lineStatements = Object.values(LINES)
    .map(
      (line) =>
        `INSERT OR IGNORE INTO lines (id, line_number, name_ko, name_ja, name_en, color, type) VALUES (${escapeSqlString(line.id)}, ${line.lineNumber}, ${escapeSqlString(line.nameKo)}, ${escapeSqlString(line.nameJa)}, ${escapeSqlString(line.nameEn)}, ${escapeSqlString(line.color)}, ${escapeSqlString(line.type)});`,
    )
    .join("\n");

  const stationStatements = data.stations
    .map(
      (station) =>
        `INSERT OR IGNORE INTO stations (id, station_code, name_ko, name_ja, name_en, name_cn, name_hanja, lat, lng, complexity_level) VALUES (${escapeSqlString(station.id)}, ${escapeSqlString(station.stationCode)}, ${escapeSqlString(station.nameKo)}, ${escapeSqlString(station.nameJa)}, ${escapeSqlString(station.nameEn)}, ${escapeSqlString(station.nameCn)}, ${escapeSqlString(station.nameHanja)}, ${station.lat.toFixed(1)}, ${station.lng.toFixed(1)}, ${station.complexityLevel});`,
    )
    .join("\n");

  const stationLineStatements = data.stationLines
    .map(
      (stationLine) =>
        `INSERT OR IGNORE INTO station_lines (station_id, line_id) VALUES (${escapeSqlString(stationLine.stationId)}, ${escapeSqlString(stationLine.lineId)});`,
    )
    .join("\n");

  const aliasStatements = data.aliases
    .map(
      (alias) =>
        `INSERT OR IGNORE INTO station_aliases (station_id, alias) VALUES (${escapeSqlString(alias.stationId)}, ${escapeSqlString(alias.alias)});`,
    )
    .join("\n");

  const coveredStationIds = new Set<string>();

  const connectionStatements = CONNECTIONS.map((connection) => {
    requireStationLine(lineIdsByStationNameKo, connection.fromStationNameKo, connection.lineId);
    requireStationLine(lineIdsByStationNameKo, connection.toStationNameKo, connection.lineId);

    const fromStationId = requireStationId(stationIdByNameKo, connection.fromStationNameKo);
    const toStationId = requireStationId(stationIdByNameKo, connection.toStationNameKo);

    coveredStationIds.add(fromStationId);
    coveredStationIds.add(toStationId);

    return `INSERT OR IGNORE INTO connections (from_station_id, to_station_id, line_id, travel_time_sec) VALUES (${escapeSqlString(fromStationId)}, ${escapeSqlString(toStationId)}, ${escapeSqlString(connection.lineId)}, ${connection.travelTimeSec});`;
  }).join("\n");

  const missingConnectionStations = data.stations
    .filter((station) => !coveredStationIds.has(station.id))
    .map((station) => station.nameKo);

  if (missingConnectionStations.length > 0) {
    throw new Error(`Missing connection coverage for stations: ${missingConnectionStations.join(", ")}`);
  }

  const transferStatements = TRANSFERS.map((transfer) => {
    requireStationLine(lineIdsByStationNameKo, transfer.stationNameKo, transfer.fromLineId);
    requireStationLine(lineIdsByStationNameKo, transfer.stationNameKo, transfer.toLineId);

    const stationId = requireStationId(stationIdByNameKo, transfer.stationNameKo);

    return `INSERT OR IGNORE INTO transfers (station_id, from_line_id, to_line_id, transfer_time_sec, difficulty) VALUES (${escapeSqlString(stationId)}, ${escapeSqlString(transfer.fromLineId)}, ${escapeSqlString(transfer.toLineId)}, ${transfer.transferTimeSec}, ${escapeSqlString(transfer.difficulty)});`;
  }).join("\n");

  const sql = [
    lineStatements,
    stationStatements,
    stationLineStatements,
    aliasStatements,
    connectionStatements,
    transferStatements,
    "",
  ].join("\n\n");

  return {
    sql,
    stats: {
      lineCount: Object.keys(LINES).length,
      stationCount: data.stations.length,
      stationLineCount: data.stationLines.length,
      aliasCount: data.aliases.length,
      connectionCount: CONNECTIONS.length,
      transferCount: TRANSFERS.length,
    },
  };
}

function main(): void {
  const outputPath = path.resolve(SCRIPT_DIR, "../data/seed.sql");
  const { sql, stats } = buildSeedSql();

  fs.writeFileSync(outputPath, sql, "utf8");
  console.log(
    `Wrote ${outputPath} with ${stats.lineCount} lines, ${stats.stationCount} stations, ${stats.stationLineCount} station-line mappings, ${stats.aliasCount} aliases, ${stats.connectionCount} connections, ${stats.transferCount} transfers`,
  );
}

if (process.argv[1] && import.meta.filename === path.resolve(process.argv[1])) {
  main();
}
