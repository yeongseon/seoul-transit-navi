import { LINES } from "../../../shared/constants";
import { MAJOR_STATION_IDS, type SubwayMapLine, type SubwayMapStation } from "../data/subway-map-data";

type LabelStyle = {
  dx: number;
  dy: number;
  textAnchor: "start" | "middle" | "end";
};

const LABEL_STYLES: Record<SubwayMapStation["labelDirection"], LabelStyle> = {
  n: { dx: 0, dy: -3.8, textAnchor: "middle" },
  s: { dx: 0, dy: 5.4, textAnchor: "middle" },
  e: { dx: 4.2, dy: 0.9, textAnchor: "start" },
  w: { dx: -4.2, dy: 0.9, textAnchor: "end" },
};

function getLinePath(line: SubwayMapLine, stationsById: Record<string, SubwayMapStation>): string {
  const stations = line.stationIds.map((stationId) => stationsById[stationId]);
  const commands: string[] = [];

  stations.forEach((station, index) => {
    if (index === 0) {
      commands.push(`M ${station.x} ${station.y}`);
      return;
    }

    const previous = stations[index - 1];
    const dx = station.x - previous.x;
    const dy = station.y - previous.y;
    const diagonal = Math.abs(Math.abs(dx) - Math.abs(dy)) < 0.001;

    if (dx === 0 || dy === 0 || diagonal || line.routePreference === "auto") {
      commands.push(`L ${station.x} ${station.y}`);
      return;
    }

    const cornerX = line.routePreference === "vertical-first" ? previous.x : station.x;
    const cornerY = line.routePreference === "vertical-first" ? station.y : previous.y;
    commands.push(`L ${cornerX} ${cornerY} L ${station.x} ${station.y}`);
  });

  if (line.loop) {
    const first = stations[0];
    commands.push(`L ${first.x} ${first.y}`);
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
  const stationsById = Object.fromEntries((lineStations ?? stations).map((station) => [station.id, station]));

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
          d={getLinePath(line, stationsById)}
          fill="none"
          stroke={line.color}
          strokeWidth={3.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}

      {stations.map((station) => {
        const labelStyle = LABEL_STYLES[station.labelDirection];
        const isSelected = station.id === selectedStationId;
        const stationName = locale === "ko" ? station.nameKo : station.nameJa;
        const showStationDetails = detailLevel === "detailed" || MAJOR_STATION_IDS.has(station.id);

        const primaryColor = station.stationNumbers?.[0]?.color || LINES[station.lines[0]]?.color || "#334155";
        const strokeColor = isSelected ? "#0f172a" : station.isTransfer ? "#334155" : primaryColor;
        const badges = station.stationNumbers || [];

        if (station.isTransfer) {
          const nameWidth = Math.min(40, locale === "ko" ? stationName.length * 2.4 + 4 : stationName.length * 2.8 + 4);
          const rectHeight = 5;
          const textX = station.x + labelStyle.dx;
          const textY = station.y + labelStyle.dy;

          let rectX = textX;
          if (labelStyle.textAnchor === "middle") {
            rectX = textX - nameWidth / 2;
          } else if (labelStyle.textAnchor === "start") {
            rectX = textX - 2;
          } else if (labelStyle.textAnchor === "end") {
            rectX = textX - nameWidth + 2;
          }
          const rectY = textY - rectHeight / 2 - 0.2;

          let badgesX = textX;
          let badgesY = textY;
          if (station.labelDirection === "n") {
            badgesY -= 5.5;
          } else if (station.labelDirection === "s") {
            badgesY += 5.5;
          } else if (station.labelDirection === "e") {
            badgesY -= 5.5;
            badgesX += nameWidth / 2 - 2;
          } else if (station.labelDirection === "w") {
            badgesY -= 5.5;
            badgesX -= nameWidth / 2 - 2;
          }

          return (
            <g key={station.id}>
              {badges.length > 0 && (
                <g>
                  {badges.map((badge, i) => {
                    const localDx = (i - (badges.length - 1) / 2) * 7.0;
                    return (
                      <g key={badge.lineId} transform={`translate(${badgesX + localDx}, ${badgesY})`}>
                        <circle r={3.2} fill="#ffffff" stroke={badge.color} strokeWidth={1.5} />
                        <text
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize="1.8"
                          fontWeight={700}
                          fill={badge.color}
                        >
                          {badge.code}
                        </text>
                      </g>
                    );
                  })}
                </g>
              )}

              <circle cx={station.x} cy={station.y} r={3.5} fill="#ffffff" stroke="#0f172a" strokeWidth={1.2} />
              <circle cx={station.x} cy={station.y} r={1.5} fill="#0f172a" />

              <a
                href={`#${station.id}`}
                className="cursor-pointer outline-none"
                onClick={(event) => {
                  event.preventDefault();
                  onSelectStation(station.id);
                }}
              >
                <circle cx={station.x} cy={station.y} r={6} fill="transparent" />
                <rect x={rectX} y={rectY} width={nameWidth} height={rectHeight} rx={2} ry={2} fill="#0f172a" />
                <text
                  x={textX}
                  y={textY}
                  textAnchor={labelStyle.textAnchor}
                  dominantBaseline="central"
                  fontSize="2.2"
                  fontWeight={700}
                  fill="#ffffff"
                  className="select-none"
                >
                  {stationName}
                </text>
              </a>
            </g>
          );
        }

        let badgeDx = labelStyle.dx;
        let badgeDy = labelStyle.dy;
        let textDx = labelStyle.dx;
        let textDy = labelStyle.dy;

        if (station.labelDirection === "n") {
          badgeDy = -3.8;
          textDy = -7.5;
        } else if (station.labelDirection === "s") {
          badgeDy = 5.0;
          textDy = 8.5;
        } else if (station.labelDirection === "e") {
          badgeDx = 3.5;
          textDx = 7.5;
        } else if (station.labelDirection === "w") {
          badgeDx = -3.5;
          textDx = -7.5;
        }

        const badge = badges[0];

        return (
          <g key={station.id}>
            <circle
              cx={station.x}
              cy={station.y}
              r={showStationDetails ? 1.8 : 1.2}
              fill="#ffffff"
              stroke={strokeColor}
              strokeWidth={showStationDetails ? 0.8 : 0.7}
            />

            <a
              href={`#${station.id}`}
              className="cursor-pointer outline-none"
              onClick={(event) => {
                event.preventDefault();
                onSelectStation(station.id);
              }}
              >
                <circle cx={station.x} cy={station.y} r={4.8} fill="transparent" />

              <g style={{ opacity: showStationDetails ? 1 : 0, transition: "opacity 180ms ease" }}>
                {badge && (
                  <g transform={`translate(${station.x + badgeDx}, ${station.y + badgeDy})`}>
                    <circle r={2.5} fill="#ffffff" stroke={badge.color} strokeWidth={1.2} />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="1.4"
                      fontWeight={700}
                      fill={badge.color}
                    >
                      {badge.code}
                    </text>
                  </g>
                )}

                <text
                  x={station.x + textDx}
                  y={station.y + textDy}
                  textAnchor={labelStyle.textAnchor}
                  dominantBaseline="central"
                  fontSize="1.6"
                  fontWeight={400}
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
