import { Question, Area } from "./types";

export const LIKERT_LABELS = [
  "전혀 없다",
  "거의 없다",
  "가끔 있다",
  "자주 있다",
  "매우 자주 있다",
] as const;

export const AREA_META: Record<Area, { label: string; short: string; weight: number; reference: string }> = {
  sleep:        { label: "수면 방해",     short: "수면", weight: 0.30, reference: "WHO Environmental Noise Guidelines 2018 — 야간 항공소음 권고 40 dB Lnight" },
  annoyance:    { label: "심리적 성가심", short: "심리", weight: 0.25, reference: "ISO 15666:2003 — 11-point Annoyance Scale" },
  concentration:{ label: "집중력 저하",   short: "집중", weight: 0.20, reference: "WHO 환경소음 가이드라인 — 인지 작업 영향" },
  physical:     { label: "신체 반응",     short: "신체", weight: 0.15, reference: "WHO 항공소음 건강영향 보고 — 심혈관·이명 영향" },
  communication:{ label: "의사소통 방해", short: "대화", weight: 0.10, reference: "WHO Community Noise Guidelines — 음성 명료도" },
};

export const QUESTIONS: Question[] = [
  // 수면
  { id: "sleep_1", area: "sleep", type: "likert", text: "항공기 소음으로 잠에서 깨거나 잠들기 어려운 날이 얼마나 됩니까?" },
  { id: "sleep_2", area: "sleep", type: "likert", text: "수면 중 소음으로 인해 다음날 피로감을 느끼는 빈도는?" },
  { id: "sleep_3", area: "sleep", type: "likert", text: "소음을 피하기 위해 취침 시간을 바꾼 적 있습니까?" },

  // 집중력
  { id: "conc_1", area: "concentration", type: "likert", text: "집에서 독서, 업무, 학습 중 항공 소음으로 방해받는 빈도는?" },
  { id: "conc_2", area: "concentration", type: "likert", text: "소음 때문에 같은 작업을 반복하거나 실수한 적이 있습니까?" },

  // 심리적 성가심
  { id: "annoy_slider", area: "annoyance", type: "slider", min: 0, max: 10, text: "항공기 소음이 얼마나 성가십니까? (0: 전혀 / 10: 극도로)", reference: "ISO 15666:2003" },
  { id: "annoy_1", area: "annoyance", type: "likert", text: "소음 때문에 집에 있는 것이 불쾌하게 느껴진 적 있습니까?" },
  { id: "annoy_2", area: "annoyance", type: "likert", text: "소음에 대해 무력감이나 분노를 느끼는 빈도는?" },

  // 신체 반응
  { id: "phys_1", area: "physical", type: "likert", text: "소음으로 인한 두통이나 이명 증상이 있습니까?" },
  { id: "phys_2", area: "physical", type: "likert", text: "항공기 소음이 있을 때 심박수 증가, 긴장감 등 신체 반응을 느낍니까?" },

  // 의사소통
  { id: "comm_1", area: "communication", type: "likert", text: "집 안에서 대화 중 항공기 소음으로 말을 멈추거나 다시 해야 한 빈도는?" },
  { id: "comm_2", area: "communication", type: "likert", text: "TV/음악 소리를 소음 때문에 키운 적이 있습니까?" },
];

export const QUESTIONS_BY_AREA: Record<Area, Question[]> = QUESTIONS.reduce(
  (acc, q) => {
    acc[q.area].push(q);
    return acc;
  },
  { sleep: [], concentration: [], annoyance: [], physical: [], communication: [] } as Record<Area, Question[]>,
);
