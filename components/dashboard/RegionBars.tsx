"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Props {
  data: { region: string; avg: number; count: number }[];
}

export function RegionBars({ data }: Props) {
  if (data.length === 0) {
    return <EmptyBox label="3명 이상 응답한 지역이 누적되면 막대 차트가 표시됩니다." />;
  }
  return (
    <div className="h-[360px] w-full" style={{ minWidth: 0 }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={200}>
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
          <CartesianGrid horizontal={false} stroke="#E2E8F0" />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748B" }} />
          <YAxis dataKey="region" type="category" width={70} tick={{ fontSize: 12, fill: "#0A1628" }} />
          <Tooltip
            cursor={{ fill: "rgba(10,22,40,0.04)" }}
            contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12 }}
           formatter={(v, _n, p) => [`${v ?? 0}점 · ${p?.payload?.count ?? 0}명`, "평균 피해"]}
          />
          <Bar dataKey="avg" fill="#0A1628" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function EmptyBox({ label }: { label: string }) {
  return (
    <div className="flex h-[200px] items-center justify-center rounded-xl border border-dashed border-border bg-background text-center text-xs text-muted">
      {label}
    </div>
  );
}
