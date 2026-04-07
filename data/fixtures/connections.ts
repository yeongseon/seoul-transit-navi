import type { LineId } from "../../shared/constants/index.ts";

export type ConnectionFixture = {
  fromStationNameKo: string;
  toStationNameKo: string;
  lineId: LineId;
  travelTimeSec: number;
};

type LineConnectionSequence = {
  lineId: LineId;
  stationNames: string[];
  patternOffset: number;
};

const TRAVEL_TIME_PATTERN = [120, 150, 180] as const;

const LINE_CONNECTION_SEQUENCES: LineConnectionSequence[] = [
  {
    lineId: "line_1",
    patternOffset: 0,
    stationNames: ["서울역", "시청", "종각", "종로3가", "종로5가", "동대문", "동묘앞"],
  },
  {
    lineId: "line_2",
    patternOffset: 1,
    stationNames: [
      "시청",
      "을지로입구",
      "을지로3가",
      "을지로4가",
      "동대문역사문화공원",
      "신당",
      "상왕십리",
      "왕십리",
      "한양대",
      "뚝섬",
      "성수",
      "건대입구",
      "구의",
      "강변",
      "잠실나루",
      "잠실",
      "잠실새내",
      "종합운동장",
      "삼성",
      "선릉",
      "역삼",
      "강남",
      "교대",
      "서초",
      "방배",
      "사당",
      "낙성대",
      "서울대입구",
      "봉천",
      "신림",
      "신대방",
      "구로디지털단지",
      "대림",
      "신도림",
      "문래",
      "영등포구청",
      "당산",
      "합정",
      "홍대입구",
      "신촌",
      "이대",
      "아현",
      "충정로",
    ],
  },
  {
    lineId: "line_3",
    patternOffset: 2,
    stationNames: [
      "경복궁",
      "안국",
      "종로3가",
      "을지로3가",
      "충무로",
      "동대입구",
      "약수",
      "금호",
      "옥수",
      "압구정",
      "신사",
      "잠원",
      "고속터미널",
      "교대",
      "남부터미널",
      "양재",
      "매봉",
      "도곡",
      "대치",
      "학여울",
      "대청",
      "일원",
      "수서",
    ],
  },
  {
    lineId: "line_4",
    patternOffset: 0,
    stationNames: [
      "명동",
      "충무로",
      "동대문역사문화공원",
      "동대문",
      "혜화",
      "한성대입구",
      "성신여대입구",
      "길음",
      "미아사거리",
      "삼각지",
      "숙대입구",
      "서울역",
      "회현",
    ],
  },
  {
    lineId: "line_5",
    patternOffset: 1,
    stationNames: ["방화", "개화산", "여의도", "여의나루", "마포", "광화문", "종로3가", "을지로4가", "동대문역사문화공원", "왕십리", "청구"],
  },
  {
    lineId: "line_6",
    patternOffset: 2,
    stationNames: ["응암", "합정", "상수", "삼각지", "녹사평", "이태원", "한강진", "버티고개", "약수", "청구", "신당", "동묘앞"],
  },
  {
    lineId: "line_7",
    patternOffset: 0,
    stationNames: ["장암", "건대입구", "이수", "남성", "숭실대입구", "상도", "장승배기", "신대방삼거리", "보라매", "신풍", "대림", "가산디지털단지"],
  },
  {
    lineId: "line_8",
    patternOffset: 1,
    stationNames: ["잠실", "석촌", "모란"],
  },
  {
    lineId: "line_9",
    patternOffset: 2,
    stationNames: ["개화", "여의도", "동작", "고속터미널", "신논현", "선정릉", "삼성중앙", "봉은사", "종합운동장", "삼전", "석촌고분", "석촌"],
  },
];

function buildLineConnections(sequence: LineConnectionSequence): ConnectionFixture[] {
  return sequence.stationNames.flatMap((fromStationNameKo, index, stationNames) => {
    const toStationNameKo = stationNames[index + 1];

    if (!toStationNameKo) {
      return [];
    }

    const travelTimeSec = TRAVEL_TIME_PATTERN[(index + sequence.patternOffset) % TRAVEL_TIME_PATTERN.length];

    return [
      {
        fromStationNameKo,
        toStationNameKo,
        lineId: sequence.lineId,
        travelTimeSec,
      },
      {
        fromStationNameKo: toStationNameKo,
        toStationNameKo: fromStationNameKo,
        lineId: sequence.lineId,
        travelTimeSec,
      },
    ];
  });
}

export const CONNECTIONS: ConnectionFixture[] = LINE_CONNECTION_SEQUENCES.flatMap(buildLineConnections);

export default {
  CONNECTIONS,
};
