import { DiagnosisInput, ResponseRow } from "./types";
import { diagnose } from "./scoring";
import { getSupabase } from "./supabase";

const LOCAL_KEY_PREFIX = "planesound:result:";

export async function submitDiagnosis(
  input: DiagnosisInput,
): Promise<{ id: string; mode: "supabase" | "local" }> {
  const result = diagnose(input);

  const row = {
    region: input.region,
    housing_type: input.housing_type,
    bedtime: input.bedtime,
    scores: result.scores,
    total_score: result.total_score,
    who_multiplier: result.who_multiplier,
    sleep_disruptions_annual: result.sleep_disruptions_annual,
    soundproofing: input.soundproofing,
    awareness_duration: input.awareness_duration,
  };

  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from("responses")
      .insert(row)
      .select("id")
      .single();
    if (!error && data?.id) {
      return { id: data.id, mode: "supabase" };
    }
  }

  const id = (typeof crypto !== "undefined" && crypto.randomUUID)
    ? crypto.randomUUID()
    : `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const localRow: ResponseRow = { ...row, id, created_at: new Date().toISOString() };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LOCAL_KEY_PREFIX + id, JSON.stringify(localRow));
  }
  return { id, mode: "local" };
}

export function loadLocalResult(id: string): ResponseRow | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(LOCAL_KEY_PREFIX + id);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ResponseRow;
  } catch {
    return null;
  }
}
