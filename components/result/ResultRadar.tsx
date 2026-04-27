"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { AreaScores } from "@/lib/types";

export function ResultRadar({ scores, peerAvg }: { scores: AreaScores; peerAvg?: AreaScores | null }) {
  const data = [
    { area: "수면", me: scores.sleep, peer: peerAvg?.sleep ?? 0 },
    { area: "심리", me: scores.annoyance, peer: peerAvg?.annoyance ?? 0 },
    { area: "집중", me: scores.concentration, peer: peerAvg?.concentration ?? 0 },
    { area: "신체", me: scores.physical, peer: peerAvg?.physical ?? 0 },
    { area: "대화", me: scores.communication, peer: peerAvg?.communication ?? 0 },
  ];

  return (
    <div className="aspect-square w-full" style={{ minWidth: 0, minHeight: 0 }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
        <RadarChart data={data} outerRadius="70%">
          <PolarGrid stroke="#E2E8F0" />
          <PolarAngleAxis dataKey="area" tick={{ fill: "#0A1628", fontSize: 13, fontWeight: 600 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#94A3B8", fontSize: 10 }} stroke="#E2E8F0" />
          {peerAvg && (
            <Radar name="지역 평균" dataKey="peer" stroke="#94A3B8" fill="#94A3B8" fillOpacity={0.15} strokeDasharray="4 4" />
          )}
          <Radar name="내 점수" dataKey="me" stroke="#0A1628" fill="#2C6FBA" fillOpacity={0.45} strokeWidth={2} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
