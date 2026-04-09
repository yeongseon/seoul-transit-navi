import { LINES } from "../../../shared/constants/index";
import type { Line, RouteStep } from "../../../shared/types/index";

function getLine(step: RouteStep, lines: Map<string, Line>): Line | undefined {
  if (!step.lineId) {
    return undefined;
  }

  return lines.get(step.lineId) ?? LINES[step.lineId as keyof typeof LINES];
}

function extractStationMatches(value: string): string[] {
  return Array.from(value.matchAll(/([^、。\s]+?)駅/g), (match) => match[1]);
}

function getStationName(step: RouteStep, target: "from" | "to"): string {
  const matches = extractStationMatches(step.instruction);

  if (target === "from" && matches.length > 0) {
    return matches[0];
  }

  if (target === "to" && matches.length > 0) {
    return matches[matches.length - 1];
  }

  const ref = target === "from" ? step.fromRef : step.toRef;

  if (ref?.id && !ref.id.startsWith("station_")) {
    return ref.id.replace(/駅$/, "");
  }

  return "目的の";
}

function getExitNumber(step: RouteStep): string {
  const text = [step.instruction, ...step.notes].join(" ");
  const match = text.match(/([0-9０-９]+)番出口/);

  return match?.[1] ?? "案内された";
}

function getDestination(step: RouteStep): string {
  const text = [step.instruction, ...step.notes].join(" ");
  const match = text.match(/(.+?)まで徒歩/);

  if (match) {
    return match[1].trim();
  }

  if (step.toRef?.id && !step.toRef.id.startsWith("station_") && step.toRef.id !== "coord") {
    return step.toRef.id;
  }

  return "目的地";
}

export function generateRouteExplanation(steps: RouteStep[], lines: Map<string, Line>): string[] {
  return steps.map((step) => {
    const line = getLine(step, lines);
    const lineName = step.lineName ?? line?.nameJa ?? "路線";
    const lineColor = step.lineColor ?? line?.color ?? "#000000";
    const durationMin = step.durationMin ?? 0;

    if (step.mode === "transfer") {
      return `${lineName}に乗り換えます（徒歩約${durationMin}分）`;
    }

    if (step.mode === "walk") {
      if (/番出口/.test(step.instruction) || step.notes.some((note) => /番出口/.test(note))) {
        return `${getStationName(step, "from")}駅で下車し、${getExitNumber(step)}番出口へ向かいます`;
      }

      if (/出口/.test(step.instruction)) {
        return step.instruction;
      }

      return `${getDestination(step)}まで徒歩約${durationMin}分です`;
    }

    if (step.mode === "subway" || step.mode === "airport_rail") {
      if (step.stationCount && step.toRef) {
        return `${step.stationCount}駅進み、${getStationName(step, "to")}駅で下車します`;
      }

      return `${getStationName(step, "from")}駅から${lineName}（${lineColor}）に乗ります`;
    }

    return step.instruction;
  });
}
