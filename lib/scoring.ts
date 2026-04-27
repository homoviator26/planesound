import { Area, AreaScores, Bedtime, DamageGrade, DiagnosisInput, DiagnosisResult } from "./types";
import { AREA_META, QUESTIONS, QUESTIONS_BY_AREA } from "./questions";

const JEJU_NIGHT_FLIGHTS_PER_YEAR = 5100;
const WHO_NIGHT_LIMIT_DB = 40;
const MAX_INFERRED_DB = 70;

const BEDTIME_FACTOR: Record<Bedtime, number> = {
  before_22: 0.95,
  "22_to_24": 1.0,
  after_24: 0.65,
};

function questionScore(q: { id: string; type: "likert" | "slider" }, raw: number): number {
  if (q.type === "slider") return Math.max(0, Math.min(10, raw)) * 10;
  return Math.max(0, Math.min(4, raw - 1)) * 25;
}

export function computeAreaScores(responses: Record<string, number>): AreaScores {
  const result: AreaScores = { sleep: 0, concentration: 0, annoyance: 0, physical: 0, communication: 0 };
  (Object.keys(QUESTIONS_BY_AREA) as Area[]).forEach((area) => {
    const qs = QUESTIONS_BY_AREA[area];
    if (qs.length === 0) return;
    const sum = qs.reduce((s, q) => s + questionScore(q, responses[q.id] ?? (q.type === "slider" ? 0 : 1)), 0);
    result[area] = Math.round(sum / qs.length);
  });
  return result;
}

export function computeTotalScore(scores: AreaScores): number {
  const weighted =
    scores.sleep * AREA_META.sleep.weight +
    scores.annoyance * AREA_META.annoyance.weight +
    scores.concentration * AREA_META.concentration.weight +
    scores.physical * AREA_META.physical.weight +
    scores.communication * AREA_META.communication.weight;
  return Math.round(weighted);
}

export function getDamageGrade(total: number): DamageGrade {
  if (total >= 75) return "매우 위험";
  if (total >= 50) return "위험";
  if (total >= 25) return "경계";
  return "주의";
}

export function computeWhoMultiplier(total: number): number {
  const inferredDb = WHO_NIGHT_LIMIT_DB + (total / 100) * (MAX_INFERRED_DB - WHO_NIGHT_LIMIT_DB);
  const ratio = Math.pow(10, (inferredDb - WHO_NIGHT_LIMIT_DB) / 20);
  return Math.round(ratio * 10) / 10;
}

export function estimateAnnualSleepDisruptions(sleepScore: number, bedtime: Bedtime, soundproofing: boolean): number {
  const sleepFactor = sleepScore / 100;
  const bedtimeFactor = BEDTIME_FACTOR[bedtime];
  const soundproofingFactor = soundproofing ? 0.7 : 1.0;
  return Math.round(JEJU_NIGHT_FLIGHTS_PER_YEAR * sleepFactor * bedtimeFactor * soundproofingFactor);
}

export function estimateAnnualDamageMinutes(total: number, disruptions: number): number {
  const baselinePerEvent = 1.5 + (total / 100) * 4;
  return Math.round(disruptions * baselinePerEvent);
}

export function findWorstArea(scores: AreaScores): Area {
  const entries = Object.entries(scores) as [Area, number][];
  return entries.reduce((worst, cur) => (cur[1] > worst[1] ? cur : worst))[0];
}

export function diagnose(input: DiagnosisInput): DiagnosisResult {
  const scores = computeAreaScores(input.responses);
  const total_score = computeTotalScore(scores);
  const grade = getDamageGrade(total_score);
  const who_multiplier = computeWhoMultiplier(total_score);
  const sleep_disruptions_annual = estimateAnnualSleepDisruptions(scores.sleep, input.bedtime, input.soundproofing);
  const damage_minutes_annual = estimateAnnualDamageMinutes(total_score, sleep_disruptions_annual);
  const worst_area = findWorstArea(scores);
  return { scores, total_score, grade, who_multiplier, sleep_disruptions_annual, damage_minutes_annual, worst_area };
}

export const GRADE_COLORS: Record<DamageGrade, string> = {
  주의: "var(--grade-mild)",
  경계: "var(--grade-caution)",
  위험: "var(--grade-warning)",
  "매우 위험": "var(--grade-severe)",
};

export const GRADE_DESCRIPTION: Record<DamageGrade, string> = {
  주의: "현재까지는 일상에 큰 영향이 없는 수준이지만, 변화를 주기적으로 점검할 필요가 있습니다.",
  경계: "WHO 권고 수준을 일정 부분 초과하고 있어, 누적 노출에 따른 건강 영향이 우려됩니다.",
  위험: "장기간 노출 시 수면·심혈관·정신건강에 유의미한 영향이 보고되는 구간입니다.",
  "매우 위험": "WHO·ISO 기준을 크게 상회합니다. 즉각적인 환경 개선과 의료적 점검이 필요합니다.",
};

// validation: ensure exactly 12 questions are mapped (sanity check at module load)
if (process.env.NODE_ENV !== "production" && QUESTIONS.length !== 12) {
  console.warn(`[scoring] Expected 12 questions but found ${QUESTIONS.length}`);
}
