import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import * as sharedConstants from "../shared/constants/index.ts";
import { parseStationsCSV } from "./parse-stations.ts";

const { LINES } = sharedConstants;
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));

function escapeSqlString(value: string | null): string {
  if (value === null) {
    return "NULL";
  }

  return `'${value.replace(/'/g, "''")}'`;
}

function buildSeedSql(): { sql: string; stats: { lineCount: number; stationCount: number; stationLineCount: number; aliasCount: number } } {
  const data = parseStationsCSV(path.resolve(SCRIPT_DIR, "../data/fixtures/stations.csv"));

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

  const sql = [
    lineStatements,
    stationStatements,
    stationLineStatements,
    aliasStatements,
    "",
  ].join("\n\n");

  return {
    sql,
    stats: {
      lineCount: Object.keys(LINES).length,
      stationCount: data.stations.length,
      stationLineCount: data.stationLines.length,
      aliasCount: data.aliases.length,
    },
  };
}

function main(): void {
  const outputPath = path.resolve(SCRIPT_DIR, "../data/seed.sql");
  const { sql, stats } = buildSeedSql();

  fs.writeFileSync(outputPath, sql, "utf8");
  console.log(
    `Wrote ${outputPath} with ${stats.lineCount} lines, ${stats.stationCount} stations, ${stats.stationLineCount} station-line mappings, ${stats.aliasCount} aliases`,
  );
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main();
}
