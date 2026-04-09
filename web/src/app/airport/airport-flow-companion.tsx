"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { useTranslation } from "../../i18n/client";
import {
  AREA_IDS,
  AREA_PROFILES,
  buildAirportFlow,
  TERMINALS,
  TIME_OPTIONS,
  type AreaId,
  type Terminal,
  type TimeOfDay,
} from "../../data/airport-flows";

export function AirportFlowCompanion() {
  const { t } = useTranslation();
  const [terminal, setTerminal] = useState<Terminal | null>(null);
  const [areaId, setAreaId] = useState<AreaId | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay | null>(null);
  const [hasLargeLuggage, setHasLargeLuggage] = useState<boolean | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const currentStep = !terminal ? 1 : !areaId ? 2 : timeOfDay === null || hasLargeLuggage === null ? 3 : 4;

  const flow = useMemo(() => {
    if (!terminal || !areaId || !timeOfDay || hasLargeLuggage === null) {
      return null;
    }

    return buildAirportFlow(t, { terminal, areaId, timeOfDay, hasLargeLuggage });
  }, [areaId, hasLargeLuggage, t, terminal, timeOfDay]);

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedText(value);
      window.setTimeout(() => setCopiedText(null), 1800);
    } catch {
      setCopiedText(null);
    }
  };

  const resetSelections = () => {
    setTerminal(null);
    setAreaId(null);
    setTimeOfDay(null);
    setHasLargeLuggage(null);
    setCopiedText(null);
  };

  return (
    <main className="pb-safe min-h-screen bg-slate-50 px-4 py-8 pb-20 text-slate-900 sm:px-6 sm:py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <span aria-hidden="true">←</span>
            {t("airport.backToHome")}
          </Link>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <span className="inline-flex w-fit rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold tracking-wide text-sky-700">
                {t("airport.eyebrow")}
              </span>
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  {t("airport.title")}
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">{t("airport.subtitle")}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={resetSelections}
              className="inline-flex items-center justify-center rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              {t("airport.actions.reset")}
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            {[1, 2, 3, 4].map((step) => {
              const isActive = currentStep === step;
              const isDone = currentStep > step;

              return (
                <div
                  key={step}
                  className={`rounded-3xl px-4 py-4 ring-1 transition ${
                    isActive
                      ? "bg-sky-50 ring-sky-200"
                      : isDone
                        ? "bg-emerald-50 ring-emerald-200"
                        : "bg-slate-50 ring-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                        isActive
                          ? "bg-sky-600 text-white"
                          : isDone
                            ? "bg-emerald-600 text-white"
                            : "bg-white text-slate-500 ring-1 ring-slate-200"
                      }`}
                    >
                      {step}
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {t(`airport.progress.step${step}`)}
                      </p>
                      <p className="text-sm font-semibold text-slate-900">{t(`airport.progress.step${step}Title`)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-6">
            <SelectorCard
              step={1}
              stepLabel={t("airport.progress.step1")}
              currentStep={currentStep}
              title={t("airport.selectors.terminal.title")}
              description={t("airport.selectors.terminal.description")}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {TERMINALS.map((option) => {
                  const selected = terminal === option;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setTerminal(option)}
                      className={`rounded-3xl p-5 text-left ring-1 transition ${
                        selected
                          ? "bg-sky-50 ring-sky-300"
                          : "bg-slate-50 ring-slate-200 hover:bg-white hover:ring-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-lg font-bold text-slate-900">{t(`airport.terminals.${option}.label`)}</p>
                          <p className="mt-1 text-sm font-medium text-slate-700">
                            {t(`airport.terminals.${option}.name`)}
                          </p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
                          {t(`airport.terminals.${option}.walkBadge`, { minutes: option === "t1" ? 8 : 12 })}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {t(`airport.terminals.${option}.description`)}
                      </p>
                    </button>
                  );
                })}
              </div>
            </SelectorCard>

            <SelectorCard
              step={2}
              stepLabel={t("airport.progress.step2")}
              currentStep={currentStep}
              title={t("airport.selectors.area.title")}
              description={t("airport.selectors.area.description")}
            >
              <div className="grid gap-3">
                {AREA_IDS.map((id) => {
                  const area = AREA_PROFILES[id];
                  const selected = areaId === id;

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setAreaId(id)}
                      className={`rounded-3xl p-5 text-left ring-1 transition ${
                        selected
                          ? "bg-violet-50 ring-violet-300"
                          : "bg-slate-50 ring-slate-200 hover:bg-white hover:ring-slate-300"
                      }`}
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-lg font-bold text-slate-900">{t(area.nameJaKey)}</p>
                          <p className="text-sm font-semibold text-slate-500">{t(area.nameKoKey)}</p>
                        </div>
                        <span className="inline-flex w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
                          {area.taxiFareRange}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{t(area.summaryKey)}</p>
                    </button>
                  );
                })}
              </div>
            </SelectorCard>

            <SelectorCard
              step={3}
              stepLabel={t("airport.progress.step3")}
              currentStep={currentStep}
              title={t("airport.selectors.conditions.title")}
              description={t("airport.selectors.conditions.description")}
            >
              <div className="space-y-5">
                <div>
                  <p className="mb-3 text-sm font-semibold text-slate-900">{t("airport.selectors.conditions.timeTitle")}</p>
                  <div className="grid gap-3">
                    {TIME_OPTIONS.map((option) => {
                      const selected = timeOfDay === option;

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setTimeOfDay(option)}
                          className={`rounded-3xl p-4 text-left ring-1 transition ${
                            selected
                              ? "bg-amber-50 ring-amber-300"
                              : "bg-slate-50 ring-slate-200 hover:bg-white hover:ring-slate-300"
                          }`}
                        >
                          <p className="text-sm font-bold text-slate-900">{t(`airport.timeOfDay.${option}.label`)}</p>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {t(`airport.timeOfDay.${option}.description`)}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-sm font-semibold text-slate-900">{t("airport.selectors.conditions.luggageTitle")}</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[true, false].map((value) => {
                      const selected = hasLargeLuggage === value;
                      const key = value ? "yes" : "no";

                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setHasLargeLuggage(value)}
                          className={`rounded-3xl p-4 text-left ring-1 transition ${
                            selected
                              ? "bg-emerald-50 ring-emerald-300"
                              : "bg-slate-50 ring-slate-200 hover:bg-white hover:ring-slate-300"
                          }`}
                        >
                          <p className="text-sm font-bold text-slate-900">{t(`airport.actions.${key}`)}</p>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {t(`airport.selectors.conditions.luggage${value ? "Yes" : "No"}`)}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </SelectorCard>
          </div>

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-500">{t("airport.selectors.result.eyebrow")}</p>
                <h2 className="text-2xl font-bold text-slate-900">{t("airport.selectors.result.title")}</h2>
                <p className="text-sm leading-6 text-slate-600">{t("airport.selectors.result.description")}</p>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                {t("airport.selectors.result.stepBadge", { step: currentStep })}
              </div>
            </div>

            {!flow ? (
              <div className="mt-6 rounded-3xl bg-slate-50 p-6 ring-1 ring-dashed ring-slate-200">
                <p className="text-base font-semibold text-slate-900">{t("airport.selectors.result.emptyTitle")}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{t("airport.selectors.result.emptyDescription")}</p>
              </div>
            ) : (
              <div className="mt-6 space-y-6">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <SummaryCard
                    accent="sky"
                    label={t("airport.summary.recommendedMode")}
                    value={t(`airport.transportModes.${flow.mode}.label`)}
                    detail={t(flow.area.recommendedModeKey)}
                  />
                  <SummaryCard
                    accent="emerald"
                    label={t("airport.summary.totalTime")}
                    value={t("airport.summary.totalTimeValue", { minutes: flow.totalMinutes })}
                    detail={t(flow.rule.recommendationKey)}
                  />
                  <SummaryCard
                    accent="amber"
                    label={t("airport.summary.taxiFare")}
                    value={flow.area.taxiFareRange}
                    detail={t("airport.taxi.tollNote")}
                  />
                  <SummaryCard
                    accent="violet"
                    label={t("airport.summary.arrivalStation")}
                    value={t(flow.area.stationKey)}
                    detail={t(flow.area.exitGuideKey)}
                  />
                </div>

                <div className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
                  <p className="text-sm font-semibold text-slate-500">{t("airport.summary.selectionTitle")}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {t("airport.summary.selectionDescription", {
                      terminal: t(`airport.terminals.${terminal}.name`),
                      areaJa: t(flow.area.nameJaKey),
                      areaKo: t(flow.area.nameKoKey),
                      time: t(`airport.timeOfDay.${timeOfDay}.label`),
                      luggage: t(`airport.actions.${hasLargeLuggage ? "yes" : "no"}`),
                    })}
                  </p>
                </div>

                <div className="space-y-4">
                  {flow.steps.map((step, index) => (
                    <div key={`${step.id}-${index}`} className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-xl ring-1 ring-slate-200">
                          <span aria-hidden="true">{step.icon}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                {t("airport.flowSegments.stepLabel", { count: index + 1 })}
                              </p>
                              <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                            </div>
                            <span className="inline-flex w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                              {t("airport.summary.totalTimeValue", { minutes: step.minutes })}
                            </span>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-3xl bg-amber-50 p-5 ring-1 ring-amber-200">
                  <div className="flex items-start gap-3">
                    <span className="text-xl" aria-hidden="true">
                      🚕
                    </span>
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{t("airport.taxi.title")}</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-700">{t("airport.taxi.description")}</p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <InfoLine label={t("airport.taxi.standLabel")} value={t(`airport.locations.${terminal}.taxiStand`)} />
                        <InfoLine label={t("airport.taxi.fareLabel")} value={flow.area.taxiFareRange} />
                        <InfoLine label={t("airport.taxi.lateNightLabel")} value={t("airport.taxi.lateNightNote")} />
                        <InfoLine label={t("airport.taxi.paymentLabel")} value={t("airport.taxi.paymentNote")} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl bg-slate-900 p-5 text-white ring-1 ring-slate-900">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-sky-200">{t("airport.driver.badge")}</p>
                      <h3 className="mt-1 text-lg font-bold">{t("airport.driver.title")}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{t("airport.driver.description")}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(flow.area.driverText)}
                      className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                    >
                      {copiedText === flow.area.driverText ? t("airport.actions.copied") : t("airport.actions.copy")}
                    </button>
                  </div>
                  <p className="mt-4 rounded-3xl bg-white/10 px-4 py-4 text-base font-semibold leading-7" lang="ko">
                    {flow.area.driverText}
                  </p>
                </div>
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}

function SelectorCard({
  step,
  stepLabel,
  currentStep,
  title,
  description,
  children,
}: {
  step: number;
  stepLabel: string;
  currentStep: number;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{stepLabel}</p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
            currentStep === step
              ? "bg-sky-50 text-sky-700 ring-sky-200"
              : currentStep > step
                ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                : "bg-slate-50 text-slate-500 ring-slate-200"
          }`}
        >
          {currentStep > step ? "✓" : currentStep === step ? "●" : "○"}
        </span>
      </div>
      {children}
    </section>
  );
}

function SummaryCard({
  accent,
  label,
  value,
  detail,
}: {
  accent: "sky" | "emerald" | "amber" | "violet";
  label: string;
  value: string;
  detail: string;
}) {
  const accents = {
    sky: "bg-sky-50 ring-sky-200 text-sky-700",
    emerald: "bg-emerald-50 ring-emerald-200 text-emerald-700",
    amber: "bg-amber-50 ring-amber-200 text-amber-700",
    violet: "bg-violet-50 ring-violet-200 text-violet-700",
  } as const;

  return (
    <div className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${accents[accent]}`}>
        {label}
      </span>
      <p className="mt-3 text-base font-bold text-slate-900">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/70 px-4 py-3 ring-1 ring-amber-100">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-800">{label}</p>
      <p className="mt-2 text-sm leading-6 text-slate-700">{value}</p>
    </div>
  );
}
