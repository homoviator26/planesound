"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Props {
  data: { month: string; count: number; avg: number }[];
}

export function MonthlyTrend({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-xl border border-dashed border-border bg-background text-center text-xs text-muted">
        월별 응답이 누적되면 추이가 표시됩니다.
      </div>
    );
  }
  return (
    <div className="h-[260px] w-full" style={{ minWidth: 0 }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={200}>
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid stroke="#E2E8F0" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} tickFormatter={(m) => m.slice(5)} />
          <YAxis tick={{ fontSize: 11, fill: "#64748B" }} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12 }}
             formatter={(v, n) => (n === "count" ? [`${v ?? 0}명`, "응답"] : [`${v ?? 0}점`, "평균"])}
          />
          <Line type="monotone" dataKey="count" stroke="#2C6FBA" strokeWidth={2.5} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="avg" stroke="#0A1628" strokeWidth={2} strokeDasharray="4 4" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
