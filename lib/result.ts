import { getSupabase } from "./supabase";
import { ResponseRow } from "./types";
import { loadLocalResult } from "./diagnosis";

export async function loadResult(id: string): Promise<ResponseRow | null> {
  const supabase = getSupabase();
  if (supabase) {
    const { data } = await supabase.from("responses").select("*").eq("id", id).maybeSingle();
    if (data) return data as ResponseRow;
  }
  return loadLocalResult(id);
}

export interface RegionPeers {
  scores: number[];
  avg: number;
  sample: number;
}

export async function loadRegionPeers(region: string): Promise<RegionPeers | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data } = await supabase.from("responses").select("total_score").eq("region", region);
  if (!data || data.length < 3) return null;
  const scores = data.map((r) => r.total_score as number);
  const avg = Math.round(scores.reduce((s, v) => s + v, 0) / scores.length);
  return { scores, avg, sample: scores.length };
}

export function computePercentile(score: number, peers: number[]): number {
  if (peers.length === 0) return 50;
  const lower = peers.filter((s) => s < score).length;
  return Math.round((lower / peers.length) * 100);
}
