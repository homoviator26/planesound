"use client";

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { AreaScores } from "@/lib/types";

export function AvgRadar({ scores }: { scores: AreaScores }) {
  const empty = Object.values(scores).every((v) => v === 0);
  if (empty) {
    return (
      <div className="flex h-[260px] items-center justify-center rounded-xl border border-dashed border-border bg-background text-center text-xs text-muted">
        응답 누적 후 5개 영역 평균이 표시됩니다.
      </div>
    );
  }
  const data = [
    { area: "수면", value: scores.sleep },
    { area: "심리", value: scores.annoyance },
    { area: "집중", value: scores.concentration },
    { area: "신체", value: scores.physical },
    { area: "대화", value: scores.communication },
  ];
  return (
    <div className="aspect-square w-full" style={{ minWidth: 0 }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={200}>
        <RadarChart data={data} outerRadius="70%">
          <PolarGrid stroke="#E2E8F0" />
          <PolarAngleAxis dataKey="area" tick={{ fill: "#0A1628", fontSize: 12, fontWeight: 600 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#94A3B8", fontSize: 10 }} stroke="#E2E8F0" />
          <Radar dataKey="value" stroke="#0A1628" fill="#2C6FBA" fillOpacity={0.4} strokeWidth={2} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
