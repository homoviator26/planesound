"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ProgressBar } from "@/components/diagnosis/ProgressBar";
import { StepBasic } from "@/components/diagnosis/StepBasic";
import { StepQuestions } from "@/components/diagnosis/StepQuestions";
import { StepEnvironment } from "@/components/diagnosis/StepEnvironment";
import { QUESTIONS } from "@/lib/questions";
import { submitDiagnosis } from "@/lib/diagnosis";
import { AwarenessDuration, Bedtime, HousingType } from "@/lib/types";

type Step = 0 | 1 | 2;

const LIKERT_IDS = QUESTIONS.filter((q) => q.type === "likert").map((q) => q.id);

export default function DiagnosisPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);

  const [region, setRegion] = useState("");
  const [housingType, setHousingType] = useState<HousingType | "">("");
  const [bedtime, setBedtime] = useState<Bedtime | "">("");

  const [responses, setResponses] = useState<Record<string, number>>({});

  const [soundproofing, setSoundproofing] = useState<boolean | null>(null);
  const [awarenessDuration, setAwarenessDuration] = useState<AwarenessDuration | "">("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stepValid = useMemo(() => {
    if (step === 0) return Boolean(region && housingType && bedtime);
    if (step === 1) return LIKERT_IDS.every((id) => typeof responses[id] === "number");
    return soundproofing !== null && awarenessDuration !== "";
  }, [step, region, housingType, bedtime, responses, soundproofing, awarenessDuration]);

  function handleNext() {
    if (!stepValid) return;
    if (step < 2) setStep((step + 1) as Step);
  }

  function handlePrev() {
    if (step > 0) setStep((step - 1) as Step);
    else router.push("/");
  }

  async function handleSubmit() {
    if (!stepValid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const { id } = await submitDiagnosis({
        region,
        housing_type: housingType as HousingType,
        bedtime: bedtime as Bedtime,
        responses,
        soundproofing: Boolean(soundproofing),
        awareness_duration: awarenessDuration as AwarenessDuration,
      });
      router.push(`/result/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "제출 중 오류가 발생했습니다.");
      setSubmitting(false);
    }
  }

  return (
    <main className="container-narrow pt-8 pb-32">
      <ProgressBar step={step} />

      <div className="mt-10">
        {step === 0 && (
          <StepBasic
            region={region}
            housingType={housingType}
            bedtime={bedtime}
            onChange={(next) => {
              if (next.region !== undefined) setRegion(next.region);
              if (next.housingType !== undefined) setHousingType(next.housingType);
              if (next.bedtime !== undefined) setBedtime(next.bedtime);
            }}
          />
        )}
        {step === 1 && (
          <StepQuestions
            responses={responses}
            onChange={(id, v) => setResponses((prev) => ({ ...prev, [id]: v }))}
          />
        )}
        {step === 2 && (
          <StepEnvironment
            soundproofing={soundproofing}
            awarenessDuration={awarenessDuration}
            onChange={(next) => {
              if (next.soundproofing !== undefined) setSoundproofing(next.soundproofing);
              if (next.awarenessDuration !== undefined) setAwarenessDuration(next.awarenessDuration);
            }}
          />
        )}
      </div>

      {error && (
        <p className="mt-6 rounded-xl bg-grade-severe/10 px-4 py-3 text-sm text-grade-severe">
          {error}
        </p>
      )}

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur">
        <div className="container-narrow flex h-20 items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrev}
            className="h-12 rounded-full border border-border bg-white px-5 text-sm font-medium text-navy transition-colors hover:border-sky"
          >
            {step === 0 ? "취소" : "이전"}
          </button>
          {step < 2 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!stepValid}
              className="h-12 flex-1 rounded-full bg-navy px-6 text-sm font-semibold text-white shadow-card transition-all hover:bg-navy-soft disabled:cursor-not-allowed disabled:bg-border disabled:text-muted disabled:shadow-none"
            >
              다음 →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!stepValid || submitting}
              className="h-12 flex-1 rounded-full bg-navy px-6 text-sm font-semibold text-white shadow-card transition-all hover:bg-navy-soft disabled:cursor-not-allowed disabled:bg-border disabled:text-muted disabled:shadow-none"
            >
              {submitting ? "분석 중..." : "결과 보기 →"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
