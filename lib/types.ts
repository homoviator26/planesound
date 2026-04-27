export type Area = "sleep" | "concentration" | "annoyance" | "physical" | "communication";

export type HousingType = "detached" | "apartment" | "mixed";
export type Bedtime = "before_22" | "22_to_24" | "after_24";
export type AwarenessDuration = "under_1y" | "1_to_3y" | "3_to_5y" | "over_5y";

export type DamageGrade = "주의" | "경계" | "위험" | "매우 위험";

export interface QuestionLikert {
  id: string;
  area: Area;
  text: string;
  type: "likert";
  reference?: string;
}

export interface QuestionSlider {
  id: string;
  area: Area;
  text: string;
  type: "slider";
  min: 0;
  max: 10;
  reference?: string;
}

export type Question = QuestionLikert | QuestionSlider;

export interface AreaScores {
  sleep: number;
  concentration: number;
  annoyance: number;
  physical: number;
  communication: number;
}

export interface DiagnosisInput {
  region: string;
  housing_type: HousingType;
  bedtime: Bedtime;
  responses: Record<string, number>;
  soundproofing: boolean;
  awareness_duration: AwarenessDuration;
}

export interface DiagnosisResult {
  scores: AreaScores;
  total_score: number;
  grade: DamageGrade;
  who_multiplier: number;
  sleep_disruptions_annual: number;
  damage_minutes_annual: number;
  worst_area: Area;
}

export interface ResponseRow {
  id: string;
  created_at: string;
  region: string;
  housing_type: HousingType;
  bedtime: Bedtime;
  scores: AreaScores;
  total_score: number;
  who_multiplier: number;
  sleep_disruptions_annual: number;
  soundproofing: boolean;
  awareness_duration: AwarenessDuration;
}
