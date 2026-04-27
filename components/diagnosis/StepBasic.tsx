"use client";

import { JEJU_REGIONS } from "@/lib/regions";
import { Bedtime, HousingType } from "@/lib/types";

interface Props {
  region: string;
  housingType: HousingType | "";
  bedtime: Bedtime | "";
  onChange: (next: { region?: string; housingType?: HousingType; bedtime?: Bedtime }) => void;
}

const HOUSING_OPTIONS: { value: HousingType; label: string }[] = [
  { value: "detached", label: "단독주택" },
  { value: "apartment", label: "아파트·빌라" },
  { value: "mixed", label: "상업시설 혼합" },
];

const BEDTIME_OPTIONS: { value: Bedtime; label: string }[] = [
  { value: "before_22", label: "오후 10시 이전" },
  { value: "22_to_24", label: "오후 10시~자정" },
  { value: "after_24", label: "자정 이후" },
];

export function StepBasic({ region, housingType, bedtime, onChange }: Props) {
  return (
    <div className="space-y-8">
      <Field label="거주 읍·면·동" required>
        <select
          value={region}
          onChange={(e) => onChange({ region: e.target.value })}
          className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-navy outline-none focus:border-sky-deep"
        >
          <option value="">지역을 선택해주세요</option>
          {JEJU_REGIONS.map((g) => (
            <optgroup key={g.city} label={g.city}>
              {g.regions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </Field>

      <Field label="주거 형태" required>
        <RadioGroup
          name="housing"
          value={housingType}
          options={HOUSING_OPTIONS}
          onChange={(v) => onChange({ housingType: v as HousingType })}
        />
      </Field>

      <Field label="주요 취침 시간대" required>
        <RadioGroup
          name="bedtime"
          value={bedtime}
          options={BEDTIME_OPTIONS}
          onChange={(v) => onChange({ bedtime: v as Bedtime })}
        />
      </Field>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-3 flex items-center gap-1 text-sm font-semibold text-navy">
        {label}
        {required && <span className="text-grade-severe">*</span>}
      </label>
      {children}
    </div>
  );
}

function RadioGroup<T extends string>({
  name,
  value,
  options,
  onChange,
}: {
  name: string;
  value: T | "";
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`h-12 rounded-xl border text-sm transition-all ${
              selected
                ? "border-navy bg-navy text-white shadow-card"
                : "border-border bg-white text-navy hover:border-sky"
            }`}
            aria-pressed={selected}
            data-name={name}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
