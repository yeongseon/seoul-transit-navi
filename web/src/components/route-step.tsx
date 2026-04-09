"use client";

import { RouteStep } from "../../../shared/types";
import { LINES, LineId } from "../../../shared/constants";
import { useTranslation } from "../i18n/client";

interface RouteStepProps {
  step: RouteStep;
  isLast: boolean;
}

export function RouteStepItem({ step, isLast }: RouteStepProps) {
  const { t, locale } = useTranslation();

  const getLineName = (lineId?: string, fallbackName?: string) => {
    if (lineId) {
      const line = LINES[lineId as LineId];
      if (line) {
        return locale === "ko" ? line.nameKo : line.nameJa;
      }
    }
    return fallbackName || "";
  };

  const getLineColor = (lineId?: string) => {
    if (!lineId) return "#cbd5e1";
    const line = LINES[lineId as LineId];
    return line ? line.color : "#cbd5e1";
  };

  const getStepIcon = (mode: string) => {
    switch (mode) {
      case "subway":
        return "🚇";
      case "bus":
        return "🚌";
      case "walk":
        return "🚶";
      case "airport_rail":
        return "✈️";
      case "transfer":
        return "🔄";
      default:
        return "📍";
    }
  };

  const isWalking = step.mode === "walk";
  const isTransfer = step.mode === "transfer";
  const icon = getStepIcon(step.mode);
  const color = getLineColor(step.lineId);

  return (
    <div className="relative flex min-h-[5rem] gap-5 pb-8 pl-4">
      <div className="flex flex-col items-center">
        <div
          className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[3px] border-white shadow-sm ring-1 ring-slate-200"
          style={{ backgroundColor: color }}
        >
          <span className="text-lg">{icon}</span>
        </div>
        {!isLast && (
          <div
            className={`w-1 grow bg-slate-200 mt-2 ${
              isWalking ? "border-l-[3px] border-dashed border-slate-300 bg-transparent w-0" : ""
            }`}
            style={!isWalking && !isTransfer ? { backgroundColor: color } : {}}
          />
        )}
      </div>

      <div className="flex w-full flex-col pt-1.5 pb-2">
        <p className="text-base font-bold text-slate-900 leading-snug">
          {step.instruction}
        </p>

        {(step.lineName || step.lineId || step.durationMin || step.stationCount) && (
          <div className="mt-2.5 flex flex-wrap items-center gap-3 text-sm font-medium text-slate-500">
            {(step.lineId || step.lineName) && (
              <span className="inline-flex items-center rounded-lg bg-slate-100 px-2 py-1 text-slate-700 font-semibold ring-1 ring-inset ring-slate-200">
                {getLineName(step.lineId, step.lineName)}
              </span>
            )}
            {step.durationMin && (
              <span className="text-slate-600">{step.durationMin}{t("components.minutes")}</span>
            )}
            {step.stationCount && (
              <span className="text-slate-600">{t("components.stationCount", { count: step.stationCount })}</span>
            )}
          </div>
        )}

        {step.notes && step.notes.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {step.notes.map((note, index) => (
              <p
                key={`note-${step.order}-${index}`}
                className="text-sm text-slate-500 bg-amber-50 rounded-xl px-3 py-2 border border-amber-100"
              >
                {note}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
