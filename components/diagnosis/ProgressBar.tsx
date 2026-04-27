"use client";

const STEP_LABELS = ["기본 정보", "12문항 진단", "방음 환경"];

export function ProgressBar({ step }: { step: 0 | 1 | 2 }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        {STEP_LABELS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-navy" : "bg-border"
            }`}
          />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="font-semibold text-navy">{STEP_LABELS[step]}</span>
        <span className="text-muted">
          {step + 1} / {STEP_LABELS.length}
        </span>
      </div>
    </div>
  );
}
