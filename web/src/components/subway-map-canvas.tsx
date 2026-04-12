import { useMemo } from "react";
import { LINES } from "../../../shared/constants";
import { MAJOR_STATION_IDS, type SubwayMapLine, type SubwayMapStation } from "../data/subway-map-data";

type OffsetStyle = {
  badge: { dx: number; dy: number };
  name: { dx: number; dy: number; textAnchor: "start" | "middle" | "end" };
};

type PathPoint = {
  x: number;
  y: number;
};

type SharedSegments = Map<string, SubwayMapLine["id"][]>;

const PATH_EPSILON = 0.001;
const PARALLEL_LINE_OFFSET_STEP = 1.8;

const BADGE_COLORS: Partial<Record<string, string>> = {
  line_2: "#007A33",
  line_3: "#A95500",
  line_4: "#0077A8",
  line_6: "#8A4F14",
  line_9: "#7A6A42",
  airport_rail: "#006C9E",
  gyeongui_jungang: "#2C7A5D",
};

const REGULAR_LABEL_STYLES: Record<SubwayMapStation["labelDirection"], OffsetStyle> = {
  n: { badge: { dx: 0, dy: -2.8 }, name: { dx: 0, dy: 2.4, textAnchor: "middle" } },
  s: { badge: { dx: 0, dy: 2.8 }, name: { dx: 0, dy: -2.0, textAnchor: "middle" } },
  e: { badge: { dx: 2.8, dy: 0 }, name: { dx: -2.2, dy: 0.3, textAnchor: "end" } },
  w: { badge: { dx: -2.8, dy: 0 }, name: { dx: 2.2, dy: 0.3, textAnchor: "start" } },
};

const TRANSFER_LABEL_STYLES: Record<SubwayMapStation["labelDirection"], OffsetStyle> = {
  n: { badge: { dx: 0, dy: -3.8 }, name: { dx: 0, dy: 3.0, textAnchor: "middle" } },
  s: { badge: { dx: 0, dy: 3.8 }, name: { dx: 0, dy: -2.6, textAnchor: "middle" } },
  e: { badge: { dx: 4.4, dy: 0 }, name: { dx: -2.6, dy: 0.3, textAnchor: "end" } },
  w: { badge: { dx: -4.4, dy: 0 }, name: { dx: 2.6, dy: 0.3, textAnchor: "start" } },
};

function getSegmentKey(firstStationId: string, secondStationId: string): string {
  return firstStationId < secondStationId
    ? `${firstStationId}:${secondStationId}`
    : `${secondStationId}:${firstStationId}`;
}

function buildSharedSegments(
  lines: SubwayMapLine[],
  stationsById: Record<string, SubwayMapStation>,
): SharedSegments {
  const segments: SharedSegments = new Map();

  lines.forEach((line) => {
    if (line.stationIds.length < 2) {
      return;
    }

    const segmentCount = line.loop ? line.stationIds.length : line.stationIds.length - 1;

    for (let index = 0; index < segmentCount; index += 1) {
      const startStationId = line.stationIds[index];
      const endStationId = line.stationIds[(index + 1) % line.stationIds.length];

      if (!stationsById[startStationId] || !stationsById[endStationId]) {
        continue;
      }

      const segmentKey = getSegmentKey(startStationId, endStationId);
      const sharedLineIds = segments.get(segmentKey);

      if (!sharedLineIds) {
        segments.set(segmentKey, [line.id]);
        continue;
      }

      if (!sharedLineIds.includes(line.id)) {
        sharedLineIds.push(line.id);
      }
    }
  });

  return new Map(Array.from(segments.entries()).filter(([, sharedLineIds]) => sharedLineIds.length > 1));
}

function arePointsEqual(first: PathPoint, second: PathPoint): boolean {
  return Math.abs(first.x - second.x) < PATH_EPSILON && Math.abs(first.y - second.y) < PATH_EPSILON;
}

function appendSegmentPath(
  commands: string[],
  start: PathPoint,
  end: PathPoint,
  routePreference: SubwayMapLine["routePreference"],
): void {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const diagonal = Math.abs(Math.abs(dx) - Math.abs(dy)) < PATH_EPSILON;

  if (dx === 0 || dy === 0 || diagonal || routePreference === "auto") {
    commands.push(`L ${end.x} ${end.y}`);
    return;
  }

  const cornerX = routePreference === "vertical-first" ? start.x : end.x;
  const cornerY = routePreference === "vertical-first" ? end.y : start.y;
  commands.push(`L ${cornerX} ${cornerY} L ${end.x} ${end.y}`);
}

function getSegmentPoints(
  lineId: SubwayMapLine["id"],
  startStation: SubwayMapStation,
  endStation: SubwayMapStation,
  sharedSegments: SharedSegments,
): { start: PathPoint; end: PathPoint } {
  const sharedLineIds = sharedSegments.get(getSegmentKey(startStation.id, endStation.id));

  if (!sharedLineIds) {
    return {
      start: { x: startStation.x, y: startStation.y },
      end: { x: endStation.x, y: endStation.y },
    };
  }

  const lineIndex = sharedLineIds.indexOf(lineId);

  if (lineIndex === -1) {
    return {
      start: { x: startStation.x, y: startStation.y },
      end: { x: endStation.x, y: endStation.y },
    };
  }

  const offsetDistance = (lineIndex - (sharedLineIds.length - 1) / 2) * PARALLEL_LINE_OFFSET_STEP;

  if (Math.abs(offsetDistance) < PATH_EPSILON) {
    return {
      start: { x: startStation.x, y: startStation.y },
      end: { x: endStation.x, y: endStation.y },
    };
  }

  const canonicalStart = startStation.id < endStation.id ? startStation : endStation;
  const canonicalEnd = startStation.id < endStation.id ? endStation : startStation;
  const dx = canonicalEnd.x - canonicalStart.x;
  const dy = canonicalEnd.y - canonicalStart.y;
  const length = Math.hypot(dx, dy);

  if (length < PATH_EPSILON) {
    return {
      start: { x: startStation.x, y: startStation.y },
      end: { x: endStation.x, y: endStation.y },
    };
  }

  const offsetX = (-dy / length) * offsetDistance;
  const offsetY = (dx / length) * offsetDistance;

  return {
    start: { x: startStation.x + offsetX, y: startStation.y + offsetY },
    end: { x: endStation.x + offsetX, y: endStation.y + offsetY },
  };
}

function getLinePath(
  line: SubwayMapLine,
  stationsById: Record<string, SubwayMapStation>,
  sharedSegments: SharedSegments,
): string {
  const stations = line.stationIds.map((stationId) => stationsById[stationId]);

  if (stations.length === 0) {
    return "";
  }

  if (stations.length === 1) {
    const [station] = stations;
    return `M ${station.x} ${station.y}`;
  }

  const segmentCount = line.loop ? stations.length : stations.length - 1;
  const firstSegment = getSegmentPoints(line.id, stations[0], stations[1], sharedSegments);
  const commands = [`M ${firstSegment.start.x} ${firstSegment.start.y}`];
  let currentPoint = firstSegment.start;

  for (let index = 0; index < segmentCount; index += 1) {
    const startStation = stations[index];
    const endStation = stations[(index + 1) % stations.length];
    const { start, end } = getSegmentPoints(line.id, startStation, endStation, sharedSegments);

    if (!arePointsEqual(currentPoint, start)) {
      commands.push(`L ${start.x} ${start.y}`);
    }

    appendSegmentPath(commands, start, end, line.routePreference);
    currentPoint = end;
  }

  if (line.loop && !arePointsEqual(currentPoint, firstSegment.start)) {
    commands.push(`L ${firstSegment.start.x} ${firstSegment.start.y}`);
  }

  return commands.join(" ");
}

type SubwayMapCanvasProps = {
  stations: SubwayMapStation[];
  lines: SubwayMapLine[];
  selectedStationId: string;
  onSelectStation: (stationId: string) => void;
  locale: "ja" | "ko";
  detailLevel: "overview" | "detailed";
  viewBox: string;
  canvasSize: { width: number; height: number };
  backgroundRect?: { x: number; y: number; width: number; height: number };
  lineStations?: SubwayMapStation[];
};

export function SubwayMapCanvas({
  stations,
  lines,
  selectedStationId,
  onSelectStation,
  locale,
  detailLevel,
  viewBox,
  canvasSize,
  backgroundRect = { x: -36, y: -6, width: 228, height: 184 },
  lineStations,
}: SubwayMapCanvasProps) {
  const stationsById = useMemo(
    () =>
      (lineStations ?? stations).reduce<Record<string, SubwayMapStation>>((result, station) => {
        result[station.id] = station;
        return result;
      }, {}),
    [lineStations, stations],
  );
  const sharedSegments = useMemo(() => buildSharedSegments(lines, stationsById), [lines, stationsById]);

  return (
    <svg
      viewBox={viewBox}
      width={canvasSize.width - 48}
      height={canvasSize.height - 48}
      role="img"
      aria-label={locale === "ko" ? "서울 지하철 노선도" : "ソウル地下鉄路線図"}
      className="h-auto w-full"
    >
      <rect
        x={backgroundRect.x}
        y={backgroundRect.y}
        width={backgroundRect.width}
        height={backgroundRect.height}
        rx="8"
        fill="#ffffff"
      />

      {lines.map((line) => (
        <path
          key={line.id}
          d={getLinePath(line, stationsById, sharedSegments)}
          fill="none"
          stroke={line.color}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}

      {stations.map((station) => {
        const isSelected = station.id === selectedStationId;
        const stationName = locale === "ko" ? station.nameKo : station.nameJa;
        const showStationDetails = detailLevel === "detailed" || MAJOR_STATION_IDS.has(station.id);
        const primaryColor = station.stationNumbers?.[0]?.color || LINES[station.lines[0]]?.color || "#334155";

        if (station.isTransfer) {
          const style = TRANSFER_LABEL_STYLES[station.labelDirection];
          const badgeSpacing = 3.4;
          const numBadges = station.stationNumbers.length;
          
          const totalBadgeWidth = (numBadges - 1) * badgeSpacing;
          const isHorizontalBadges = station.labelDirection === "n" || station.labelDirection === "s";
          const startX = isHorizontalBadges
            ? station.x + style.badge.dx - totalBadgeWidth / 2
            : station.x + style.badge.dx;
          const startY = isHorizontalBadges
            ? station.y + style.badge.dy
            : station.y + style.badge.dy - totalBadgeWidth / 2;

          return (
            <g key={station.id}>
              {isSelected && <circle cx={station.x} cy={station.y} r={2.6} fill="none" stroke="#0ea5e9" strokeWidth={0.5} />}
              <circle cx={station.x} cy={station.y} r={1.6} fill="#ffffff" stroke="#334155" strokeWidth={0.6} />

              <a
                href={`#${station.id}`}
                className="cursor-pointer outline-none"
                onClick={(event) => {
                  event.preventDefault();
                  onSelectStation(station.id);
                }}
              >
                <circle cx={station.x} cy={station.y} r={4.0} fill="transparent" />                
                {station.stationNumbers.map((badge, i) => {
                  const bx = isHorizontalBadges ? startX + i * badgeSpacing : startX;
                  const by = isHorizontalBadges ? startY : startY + i * badgeSpacing;
                  const badgeColor = BADGE_COLORS[badge.lineId] ?? badge.color;
                  return (
                    <g key={badge.code}>
                      <circle cx={bx} cy={by} r={1.55} fill="#ffffff" stroke={badgeColor} strokeWidth={0.7} />
                      <text
                        x={bx}
                        y={by}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="0.95"
                        fontWeight={700}
                        fill={badgeColor}
                        className="select-none"
                      >
                        {badge.code}
                      </text>
                    </g>
                  );
                })}

                <text
                  x={station.x + style.name.dx}
                  y={station.y + style.name.dy}
                  textAnchor={style.name.textAnchor}
                  dominantBaseline="central"
                  fontSize="1.15"
                  fontWeight={600}
                  fill="#334155"
                  className="select-none"
                >
                  {stationName}
                </text>
              </a>
            </g>
          );
        }

        const style = REGULAR_LABEL_STYLES[station.labelDirection];
        const badge = station.stationNumbers?.[0];

        return (
          <g key={station.id}>
            {isSelected && <circle cx={station.x} cy={station.y} r={2.6} fill="none" stroke="#0ea5e9" strokeWidth={0.5} />}
            <circle
              cx={station.x}
              cy={station.y}
              r={showStationDetails ? 1.0 : 0.6}
              fill="#ffffff"
              stroke={primaryColor}
              strokeWidth={0.5}
            />

            <a
              href={`#${station.id}`}
              className="cursor-pointer outline-none"
              onClick={(event) => {
                event.preventDefault();
                onSelectStation(station.id);
              }}
            >
              <circle cx={station.x} cy={station.y} r={4.0} fill="transparent" />

              <g style={{ opacity: showStationDetails ? 1 : 0, transition: "opacity 180ms ease" }}>
                {badge && (
                  <g>
                    <circle cx={station.x + style.badge.dx} cy={station.y + style.badge.dy} r={1.4} fill="#ffffff" stroke={BADGE_COLORS[badge.lineId] ?? badge.color} strokeWidth={0.6} />
                    <text
                      x={station.x + style.badge.dx}
                      y={station.y + style.badge.dy}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="0.88"
                      fontWeight={700}
                      fill={BADGE_COLORS[badge.lineId] ?? badge.color}
                      className="select-none"
                    >
                      {badge.code}
                    </text>
                  </g>
                )}
                <text
                  x={station.x + style.name.dx}
                  y={station.y + style.name.dy}
                  textAnchor={style.name.textAnchor}
                  dominantBaseline="central"
                  fontSize="1.05"
                  fontWeight={500}
                  fill="#475569"
                  className="select-none"
                >
                  {stationName}
                </text>
              </g>
            </a>
          </g>
        );
      })}
    </svg>
  );
}
