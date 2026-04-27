"use client";

import { AwarenessDuration } from "@/lib/types";

interface Props {
  soundproofing: boolean | null;
  awarenessDuration: AwarenessDuration | "";
  onChange: (next: { soundproofing?: boolean; awarenessDuration?: AwarenessDuration }) => void;
}

const DURATION_OPTIONS: { value: AwarenessDuration; label: string }[] = [
  { value: "under_1y", label: "1년 미만" },
  { value: "1_to_3y", label: "1~3년" },
  { value: "3_to_5y", label: "3~5년" },
  { value: "over_5y", label: "5년 이상" },
];

export function StepEnvironment({ soundproofing, awarenessDuration, onChange }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <label className="mb-1 flex items-center gap-1 text-sm font-semibold text-navy">
          방음 환경<span className="text-grade-severe">*</span>
        </label>
        <p className="mb-3 text-xs text-muted">이중창, 방음창, 방음공사 등 소음 저감 시설이 갖춰져 있나요?</p>
        <div className="grid grid-cols-2 gap-2">
          {[{ v: true, l: "예, 갖춰져 있음" }, { v: false, l: "아니요" }].map((opt) => {
            const selected = soundproofing === opt.v;
            return (
              <button
                key={String(opt.v)}
                type="button"
                onClick={() => onChange({ soundproofing: opt.v })}
                aria-pressed={selected}
                className={`h-12 rounded-xl border text-sm transition-all ${
                  selected
                    ? "border-navy bg-navy text-white shadow-card"
                    : "border-border bg-white text-navy hover:border-sky"
                }`}
              >
                {opt.l}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="mb-1 flex items-center gap-1 text-sm font-semibold text-navy">
          소음 피해 인식 기간<span className="text-grade-severe">*</span>
        </label>
        <p className="mb-3 text-xs text-muted">언제부터 항공 소음을 피해라고 인식하셨나요?</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {DURATION_OPTIONS.map((opt) => {
            const selected = awarenessDuration === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ awarenessDuration: opt.value })}
                aria-pressed={selected}
                className={`h-12 rounded-xl border text-sm transition-all ${
                  selected
                    ? "border-navy bg-navy text-white shadow-card"
                    : "border-border bg-white text-navy hover:border-sky"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
