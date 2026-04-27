import { getSupabase } from "./supabase";
import { AreaScores, DamageGrade, ResponseRow } from "./types";
import { getDamageGrade } from "./scoring";

export interface DashboardData {
  configured: boolean;
  total: number;
  avgScore: number;
  riskRatio: number;
  topRegions: { region: string; avg: number; count: number }[];
  areaAverages: AreaScores;
  monthly: { month: string; count: number; avg: number }[];
  gradeDist: { grade: DamageGrade; count: number }[];
}

const EMPTY_AREA: AreaScores = { sleep: 0, concentration: 0, annoyance: 0, physical: 0, communication: 0 };

function emptyData(configured: boolean): DashboardData {
  return {
    configured,
    total: 0,
    avgScore: 0,
    riskRatio: 0,
    topRegions: [],
    areaAverages: EMPTY_AREA,
    monthly: [],
    gradeDist: [],
  };
}

export async function fetchDashboard(): Promise<DashboardData> {
  const supabase = getSupabase();
  if (!supabase) return emptyData(false);

  const { data, error } = await supabase
    .from("responses")
    .select("region, total_score, scores, created_at");

  if (error || !data || data.length === 0) return emptyData(true);

  const rows = data as Pick<ResponseRow, "region" | "total_score" | "scores" | "created_at">[];
  const total = rows.length;
  const avgScore = Math.round(rows.reduce((s, r) => s + r.total_score, 0) / total);
  const riskRatio = Math.round(
    (rows.filter((r) => r.total_score >= 50).length / total) * 100,
  );

  // top regions (min 3 samples)
  const regionMap = new Map<string, { sum: number; count: number }>();
  for (const r of rows) {
    const g = regionMap.get(r.region) ?? { sum: 0, count: 0 };
    g.sum += r.total_score;
    g.count += 1;
    regionMap.set(r.region, g);
  }
  const topRegions = [...regionMap.entries()]
    .map(([region, { sum, count }]) => ({ region, avg: Math.round(sum / count), count }))
    .filter((g) => g.count >= 3)
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 10);

  // area averages
  const areaSum: AreaScores = { ...EMPTY_AREA };
  for (const r of rows) {
    areaSum.sleep += r.scores.sleep ?? 0;
    areaSum.concentration += r.scores.concentration ?? 0;
    areaSum.annoyance += r.scores.annoyance ?? 0;
    areaSum.physical += r.scores.physical ?? 0;
    areaSum.communication += r.scores.communication ?? 0;
  }
  const areaAverages: AreaScores = {
    sleep: Math.round(areaSum.sleep / total),
    concentration: Math.round(areaSum.concentration / total),
    annoyance: Math.round(areaSum.annoyance / total),
    physical: Math.round(areaSum.physical / total),
    communication: Math.round(areaSum.communication / total),
  };

  // monthly (last 12 months)
  const monthMap = new Map<string, { sum: number; count: number }>();
  for (const r of rows) {
    const d = new Date(r.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const g = monthMap.get(key) ?? { sum: 0, count: 0 };
    g.sum += r.total_score;
    g.count += 1;
    monthMap.set(key, g);
  }
  const monthly = [...monthMap.entries()]
    .map(([month, { sum, count }]) => ({ month, count, avg: Math.round(sum / count) }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-12);

  // grade distribution
  const gradeMap = new Map<DamageGrade, number>();
  (["주의", "경계", "위험", "매우 위험"] as DamageGrade[]).forEach((g) => gradeMap.set(g, 0));
  for (const r of rows) {
    const g = getDamageGrade(r.total_score);
    gradeMap.set(g, (gradeMap.get(g) ?? 0) + 1);
  }
  const gradeDist = [...gradeMap.entries()].map(([grade, count]) => ({ grade, count }));

  return { configured: true, total, avgScore, riskRatio, topRegions, areaAverages, monthly, gradeDist };
}
