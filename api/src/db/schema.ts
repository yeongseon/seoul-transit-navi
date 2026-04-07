import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const stations = sqliteTable("stations", {
  id: text("id").primaryKey(),
  stationCode: text("station_code").notNull(),
  nameKo: text("name_ko").notNull(),
  nameJa: text("name_ja").notNull(),
  nameEn: text("name_en").notNull(),
  nameCn: text("name_cn"),
  nameHanja: text("name_hanja"),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  complexityLevel: integer("complexity_level").notNull().default(1),
});

export const lines = sqliteTable("lines", {
  id: text("id").primaryKey(),
  lineNumber: integer("line_number").notNull(),
  nameKo: text("name_ko").notNull(),
  nameJa: text("name_ja").notNull(),
  nameEn: text("name_en").notNull(),
  color: text("color").notNull(),
  type: text("type").notNull(),
});

export const stationLines = sqliteTable("station_lines", {
  stationId: text("station_id").notNull().references(() => stations.id),
  lineId: text("line_id").notNull().references(() => lines.id),
});

export const exits = sqliteTable("exits", {
  id: text("id").primaryKey(),
  stationId: text("station_id").notNull().references(() => stations.id),
  exitNumber: text("exit_number").notNull(),
  labelJa: text("label_ja").notNull(),
  descriptionJa: text("description_ja").notNull(),
  walkingTimeMin: integer("walking_time_min"),
});

export const stationAliases = sqliteTable("station_aliases", {
  stationId: text("station_id").notNull().references(() => stations.id),
  alias: text("alias").notNull(),
});

export const connections = sqliteTable("connections", {
  fromStationId: text("from_station_id").notNull().references(() => stations.id),
  toStationId: text("to_station_id").notNull().references(() => stations.id),
  lineId: text("line_id").notNull().references(() => lines.id),
  travelTimeSec: integer("travel_time_sec").notNull(),
});

export const transfers = sqliteTable("transfers", {
  stationId: text("station_id").notNull().references(() => stations.id),
  fromLineId: text("from_line_id").notNull().references(() => lines.id),
  toLineId: text("to_line_id").notNull().references(() => lines.id),
  transferTimeSec: integer("transfer_time_sec").notNull(),
  difficulty: text("difficulty").notNull(),
});
