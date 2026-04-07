import type { LineId } from "../../shared/constants/index.ts";

export type TransferDifficulty = "1" | "2" | "3";

export type TransferFixture = {
  stationNameKo: string;
  fromLineId: LineId;
  toLineId: LineId;
  transferTimeSec: number;
  difficulty: TransferDifficulty;
};

type TransferPair = {
  stationNameKo: string;
  lineAId: LineId;
  lineBId: LineId;
  transferTimeSec: number;
  difficulty: TransferDifficulty;
};

const TRANSFER_PAIRS: TransferPair[] = [
  { stationNameKo: "서울역", lineAId: "line_1", lineBId: "line_4", transferTimeSec: 240, difficulty: "3" },
  { stationNameKo: "시청", lineAId: "line_1", lineBId: "line_2", transferTimeSec: 180, difficulty: "2" },
  { stationNameKo: "종로3가", lineAId: "line_1", lineBId: "line_3", transferTimeSec: 180, difficulty: "2" },
  { stationNameKo: "종로3가", lineAId: "line_1", lineBId: "line_5", transferTimeSec: 240, difficulty: "3" },
  { stationNameKo: "종로3가", lineAId: "line_3", lineBId: "line_5", transferTimeSec: 150, difficulty: "2" },
  { stationNameKo: "동대문", lineAId: "line_1", lineBId: "line_4", transferTimeSec: 180, difficulty: "2" },
  { stationNameKo: "동묘앞", lineAId: "line_1", lineBId: "line_6", transferTimeSec: 180, difficulty: "2" },
  { stationNameKo: "을지로3가", lineAId: "line_2", lineBId: "line_3", transferTimeSec: 150, difficulty: "1" },
  { stationNameKo: "을지로4가", lineAId: "line_2", lineBId: "line_5", transferTimeSec: 120, difficulty: "1" },
  { stationNameKo: "동대문역사문화공원", lineAId: "line_2", lineBId: "line_4", transferTimeSec: 240, difficulty: "3" },
  { stationNameKo: "동대문역사문화공원", lineAId: "line_2", lineBId: "line_5", transferTimeSec: 180, difficulty: "2" },
  { stationNameKo: "동대문역사문화공원", lineAId: "line_4", lineBId: "line_5", transferTimeSec: 180, difficulty: "2" },
  { stationNameKo: "신당", lineAId: "line_2", lineBId: "line_6", transferTimeSec: 180, difficulty: "2" },
  { stationNameKo: "왕십리", lineAId: "line_2", lineBId: "line_5", transferTimeSec: 180, difficulty: "2" },
  { stationNameKo: "건대입구", lineAId: "line_2", lineBId: "line_7", transferTimeSec: 150, difficulty: "1" },
  { stationNameKo: "잠실", lineAId: "line_2", lineBId: "line_8", transferTimeSec: 180, difficulty: "2" },
  { stationNameKo: "종합운동장", lineAId: "line_2", lineBId: "line_9", transferTimeSec: 180, difficulty: "2" },
  { stationNameKo: "교대", lineAId: "line_2", lineBId: "line_3", transferTimeSec: 150, difficulty: "1" },
  { stationNameKo: "대림", lineAId: "line_2", lineBId: "line_7", transferTimeSec: 180, difficulty: "2" },
  { stationNameKo: "합정", lineAId: "line_2", lineBId: "line_6", transferTimeSec: 120, difficulty: "1" },
  { stationNameKo: "충무로", lineAId: "line_3", lineBId: "line_4", transferTimeSec: 120, difficulty: "1" },
  { stationNameKo: "약수", lineAId: "line_3", lineBId: "line_6", transferTimeSec: 180, difficulty: "2" },
  { stationNameKo: "고속터미널", lineAId: "line_3", lineBId: "line_9", transferTimeSec: 240, difficulty: "3" },
  { stationNameKo: "삼각지", lineAId: "line_4", lineBId: "line_6", transferTimeSec: 180, difficulty: "2" },
  { stationNameKo: "여의도", lineAId: "line_5", lineBId: "line_9", transferTimeSec: 240, difficulty: "3" },
  { stationNameKo: "청구", lineAId: "line_5", lineBId: "line_6", transferTimeSec: 150, difficulty: "1" },
  { stationNameKo: "석촌", lineAId: "line_8", lineBId: "line_9", transferTimeSec: 180, difficulty: "2" },
];

export const TRANSFERS: TransferFixture[] = TRANSFER_PAIRS.flatMap((pair) => [
  {
    stationNameKo: pair.stationNameKo,
    fromLineId: pair.lineAId,
    toLineId: pair.lineBId,
    transferTimeSec: pair.transferTimeSec,
    difficulty: pair.difficulty,
  },
  {
    stationNameKo: pair.stationNameKo,
    fromLineId: pair.lineBId,
    toLineId: pair.lineAId,
    transferTimeSec: pair.transferTimeSec,
    difficulty: pair.difficulty,
  },
]);

export default {
  TRANSFERS,
};
