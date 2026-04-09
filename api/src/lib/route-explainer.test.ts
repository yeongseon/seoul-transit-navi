import { describe, expect, it } from "vitest";

import { LINES } from "../../../shared/constants/index";
import type { RouteStep } from "../../../shared/types/index";
import { generateRouteExplanation } from "./route-explainer";

const lineMap = new Map(Object.entries(LINES));

const mockSteps: RouteStep[] = [
  {
    order: 1,
    mode: "subway",
    instruction: "弘大入口駅から乗車",
    lineId: "line_2",
    lineName: "2号線",
    lineColor: "#009246",
    stationCount: 6,
    durationMin: 12,
    fromRef: { type: "station", id: "station_hongik-univ" },
    toRef: { type: "station", id: "station_chungjeongno" },
    notes: [],
  },
  {
    order: 2,
    mode: "transfer",
    instruction: "5号線に乗り換え",
    lineId: "line_5",
    lineName: "5号線",
    durationMin: 2,
    notes: [],
  },
  {
    order: 3,
    mode: "walk",
    instruction: "明洞駅で下車し、6番出口へ向かいます",
    durationMin: 3,
    notes: ["混雑注意"],
  },
];

describe("generateRouteExplanation", () => {
  it("generates a boarding instruction for a subway step", () => {
    const [result] = generateRouteExplanation(
      [
        {
          order: 1,
          mode: "subway",
          instruction: "弘大入口駅から2号線に乗車します",
          lineId: "line_2",
          lineName: "2号線",
          fromRef: { type: "station", id: "station_hongik-univ" },
          notes: [],
        },
      ],
      lineMap,
    );

    expect(result).toBe("弘大入口駅から2号線（#00A84D）に乗ります");
  });

  it("generates a transfer instruction", () => {
    const [, result] = generateRouteExplanation(mockSteps, lineMap);

    expect(result).toBe("5号線に乗り換えます（徒歩約2分）");
  });

  it("generates an exit instruction for a walk step with exit info", () => {
    const [, , result] = generateRouteExplanation(mockSteps, lineMap);

    expect(result).toBe("明洞駅で下車し、6番出口へ向かいます");
  });

  it("generates a walking instruction without exit info", () => {
    const [result] = generateRouteExplanation(
      [
        {
          order: 1,
          mode: "walk",
          instruction: "目的地まで歩きます",
          durationMin: 5,
          toRef: { type: "place", id: "明洞聖堂" },
          notes: [],
        },
      ],
      lineMap,
    );

    expect(result).toBe("明洞聖堂まで徒歩約5分です");
  });

  it("generates explanations for multiple steps in sequence", () => {
    expect(generateRouteExplanation(mockSteps, lineMap)).toEqual([
      "6駅進み、弘大入口駅で下車します",
      "5号線に乗り換えます（徒歩約2分）",
      "明洞駅で下車し、6番出口へ向かいます",
    ]);
  });
});
