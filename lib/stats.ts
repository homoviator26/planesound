import { getSupabase } from "./supabase";

export interface SiteStats {
  total: number;
  avgScore: number;
  topRegion: { name: string; avg: number; count: number } | null;
  configured: boolean;
}

export async function fetchSiteStats(): Promise<SiteStats> {
  const supabase = getSupabase();
  if (!supabase) {
    return { total: 0, avgScore: 0, topRegion: null, configured: false };
  }

  const { data, error } = await supabase
    .from("responses")
    .select("region, total_score");

  if (error || !data || data.length === 0) {
    return { total: 0, avgScore: 0, topRegion: null, configured: true };
  }

  const total = data.length;
  const avgScore = Math.round(data.reduce((s, r) => s + (r.total_score ?? 0), 0) / total);

  const groups = new Map<string, { sum: number; count: number }>();
  for (const row of data) {
    const g = groups.get(row.region) ?? { sum: 0, count: 0 };
    g.sum += row.total_score ?? 0;
    g.count += 1;
    groups.set(row.region, g);
  }

  const ranked = [...groups.entries()]
    .map(([name, { sum, count }]) => ({ name, avg: Math.round(sum / count), count }))
    .filter((g) => g.count >= 3)
    .sort((a, b) => b.avg - a.avg);

  return { total, avgScore, topRegion: ranked[0] ?? null, configured: true };
}
