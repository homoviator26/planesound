"use client";

import { AREA_META, LIKERT_LABELS, QUESTIONS_BY_AREA } from "@/lib/questions";
import { Area } from "@/lib/types";

interface Props {
  responses: Record<string, number>;
  onChange: (id: string, value: number) => void;
}

const AREA_ORDER: Area[] = ["sleep", "concentration", "annoyance", "physical", "communication"];

export function StepQuestions({ responses, onChange }: Props) {
  return (
    <div className="space-y-10">
      {AREA_ORDER.map((area) => {
        const meta = AREA_META[area];
        const qs = QUESTIONS_BY_AREA[area];
        return (
          <section key={area}>
            <header className="mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-navy">{meta.label}</h3>
                <span className="rounded-full bg-sky-pale px-2 py-0.5 text-[10px] font-medium tracking-wider text-sky-deep">
                  가중치 {Math.round(meta.weight * 100)}%
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">{meta.reference}</p>
            </header>

            <div className="space-y-5">
              {qs.map((q, qi) => (
                <div key={q.id} className="rounded-2xl border border-border bg-white p-4 shadow-card">
                  <p className="text-sm font-medium text-navy">
                    <span className="mr-2 text-muted">Q{qi + 1}.</span>
                    {q.text}
                  </p>
                  <div className="mt-4">
                    {q.type === "likert" ? (
                      <Likert value={responses[q.id]} onChange={(v) => onChange(q.id, v)} />
                    ) : (
                      <Slider value={responses[q.id] ?? 5} onChange={(v) => onChange(q.id, v)} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function Likert({ value, onChange }: { value: number | undefined; onChange: (v: number) => void }) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {LIKERT_LABELS.map((label, i) => {
        const v = i + 1;
        const selected = value === v;
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            aria-pressed={selected}
            className={`flex flex-col items-center justify-center rounded-xl border px-1 py-2.5 text-[11px] leading-tight transition-all ${
              selected
                ? "border-navy bg-navy text-white shadow-card"
                : "border-border bg-white text-muted hover:border-sky hover:text-navy"
            }`}
          >
            <span className={`mb-1 text-sm font-bold ${selected ? "text-white" : "text-navy"}`}>{v}</span>
            <span className="text-[10px]">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

function Slider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs text-muted">
        <span>0 — 전혀 성가시지 않음</span>
        <span className="text-2xl font-bold text-navy tabular-nums">{value}</span>
        <span>10 — 극도로 성가심</span>
      </div>
      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="ps-slider w-full"
        aria-label="성가심 점수"
      />
      <div className="mt-1 flex justify-between px-0.5 text-[10px] text-muted">
        {Array.from({ length: 11 }).map((_, i) => (
          <span key={i} className={i === value ? "font-semibold text-navy" : ""}>{i}</span>
        ))}
      </div>
      <style jsx>{`
        .ps-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 8px;
          background: linear-gradient(
            to right,
            #0A1628 0%,
            #0A1628 ${(value / 10) * 100}%,
            #E2E8F0 ${(value / 10) * 100}%,
            #E2E8F0 100%
          );
          border-radius: 999px;
          outline: none;
        }
        .ps-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          background: white;
          border: 3px solid #0A1628;
          border-radius: 999px;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(10, 22, 40, 0.2);
        }
        .ps-slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          background: white;
          border: 3px solid #0A1628;
          border-radius: 999px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
