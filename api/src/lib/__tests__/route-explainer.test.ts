import { describe, expect, it } from "vitest";

import type { Line, RouteStep } from "../../../../shared/types/index";
import { generateRouteExplanation } from "../route-explainer";

const lines = new Map<string, Line>([
  [
    "line_2",
    {
      id: "line_2",
      lineNumber: 2,
      nameKo: "2호선",
      nameJa: "2号線",
      nameEn: "Line 2",
      color: "#00A84D",
      type: "subway",
    },
  ],
  [
    "line_5",
    {
      id: "line_5",
      lineNumber: 5,
      nameKo: "5호선",
      nameJa: "5号線",
      nameEn: "Line 5",
      color: "#996CAC",
      type: "subway",
    },
  ],
]);

describe("generateRouteExplanation", () => {
  it("includes walking time for transfer steps when durationMin is greater than 0", () => {
    const steps: RouteStep[] = [
      {
        order: 1,
        mode: "transfer",
        instruction: "5号線に乗り換え",
        lineId: "line_5",
        durationMin: 3,
        notes: [],
      },
    ];

    expect(generateRouteExplanation(steps, lines)).toEqual(["5号線に乗り換えます（徒歩約3分）"]);
  });

  it("omits walking time for transfer steps when durationMin is missing", () => {
    const steps: RouteStep[] = [
      {
        order: 1,
        mode: "transfer",
        instruction: "5号線に乗り換え",
        lineId: "line_5",
        notes: [],
      },
    ];

    const [result] = generateRouteExplanation(steps, lines);

    expect(result).toBe("5号線に乗り換えます");
    expect(result).not.toContain("徒歩約");
    expect(result).not.toContain("0分");
  });

  it("uses fromRef.name for subway steps before falling back to regex parsing", () => {
    const steps: RouteStep[] = [
      {
        order: 1,
        mode: "subway",
        instruction: "この文には駅名を含めません",
        lineId: "line_2",
        fromRef: { type: "station", id: "station_city-hall", name: "市庁駅" },
        notes: [],
      },
    ];

    expect(generateRouteExplanation(steps, lines)).toEqual(["市庁駅から2号線（#00A84D）に乗ります"]);
  });

  it("returns a walking instruction for walk steps", () => {
    const steps: RouteStep[] = [
      {
        order: 1,
        mode: "walk",
        instruction: "目的地まで歩きます",
        durationMin: 5,
        toRef: { type: "place", id: "明洞聖堂" },
        notes: [],
      },
    ];

    expect(generateRouteExplanation(steps, lines)).toEqual(["明洞聖堂まで徒歩約5分です"]);
  });
});
