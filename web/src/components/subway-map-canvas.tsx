import { LINES } from "../../../shared/constants";
import { MAJOR_STATION_IDS, type SubwayMapLine, type SubwayMapStation } from "../data/subway-map-data";

type LabelStyle = {
  dx: number;
  dy: number;
  textAnchor: "start" | "middle" | "end";
};

const LABEL_STYLES: Record<SubwayMapStation["labelDirection"], LabelStyle> = {
  n: { dx: 0, dy: -3.2, textAnchor: "middle" },
  s: { dx: 0, dy: 3.8, textAnchor: "middle" },
  e: { dx: 3.0, dy: 0.6, textAnchor: "start" },
  w: { dx: -3.0, dy: 0.6, textAnchor: "end" },
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
          strokeWidth={2.4}
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

        if (station.isTransfer) {
          const nameWidth = Math.min(28, locale === "ko" ? stationName.length * 1.7 + 3 : stationName.length * 2.0 + 3);
          const rectHeight = 3.4;
          const textX = station.x + labelStyle.dx;
          const textY = station.y + labelStyle.dy;

          let rectX = textX;
          if (labelStyle.textAnchor === "middle") {
            rectX = textX - nameWidth / 2;
          } else if (labelStyle.textAnchor === "start") {
            rectX = textX - 1.2;
          } else if (labelStyle.textAnchor === "end") {
            rectX = textX - nameWidth + 1.2;
          }
          const rectY = textY - rectHeight / 2 - 0.1;

          return (
            <g key={station.id}>
              <circle cx={station.x} cy={station.y} r={2.4} fill="#ffffff" stroke="#0f172a" strokeWidth={0.9} />
              <circle cx={station.x} cy={station.y} r={1.0} fill={isSelected ? "#0f172a" : "#475569"} />

              <a
                href={`#${station.id}`}
                className="cursor-pointer outline-none"
                onClick={(event) => {
                  event.preventDefault();
                  onSelectStation(station.id);
                }}
              >
                <circle cx={station.x} cy={station.y} r={4.5} fill="transparent" />
                <rect x={rectX} y={rectY} width={nameWidth} height={rectHeight} rx={1.5} ry={1.5} fill="#0f172a" />
                <text
                  x={textX}
                  y={textY}
                  textAnchor={labelStyle.textAnchor}
                  dominantBaseline="central"
                  fontSize="1.6"
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

        return (
          <g key={station.id}>
            <circle
              cx={station.x}
              cy={station.y}
              r={showStationDetails ? 1.4 : 0.9}
              fill="#ffffff"
              stroke={strokeColor}
              strokeWidth={showStationDetails ? 0.6 : 0.5}
            />

            <a
              href={`#${station.id}`}
              className="cursor-pointer outline-none"
              onClick={(event) => {
                event.preventDefault();
                onSelectStation(station.id);
              }}
            >
              <circle cx={station.x} cy={station.y} r={3.6} fill="transparent" />

              <g style={{ opacity: showStationDetails ? 1 : 0, transition: "opacity 180ms ease" }}>
                <text
                  x={station.x + labelStyle.dx}
                  y={station.y + labelStyle.dy}
                  textAnchor={labelStyle.textAnchor}
                  dominantBaseline="central"
                  fontSize="1.4"
                  fontWeight={500}
                  fill="#334155"
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
