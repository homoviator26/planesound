"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { DamageGrade } from "@/lib/types";

interface Props {
  data: { grade: DamageGrade; count: number }[];
}

const COLORS: Record<DamageGrade, string> = {
  주의: "#5BA3D0",
  경계: "#F4A623",
  위험: "#E27D40",
  "매우 위험": "#D03030",
};

export function GradeDonut({ data }: Props) {
  const total = data.reduce((s, d) => s + d.count, 0);
  if (total === 0) {
    return (
      <div className="flex h-[260px] items-center justify-center rounded-xl border border-dashed border-border bg-background text-center text-xs text-muted">
        등급 분포는 응답 누적 후 표시됩니다.
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="aspect-square w-full max-w-[260px]" style={{ minWidth: 0 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={200}>
          <PieChart>
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12 }}
              formatter={(v: number) => [`${v}명`, "응답"]}
            />
            <Pie
              data={data}
              dataKey="count"
              nameKey="grade"
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="90%"
              paddingAngle={2}
              stroke="white"
              strokeWidth={2}
            >
              {data.map((d) => (
                <Cell key={d.grade} fill={COLORS[d.grade]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="grid w-full grid-cols-2 gap-x-4 gap-y-2 text-xs sm:grid-cols-4">
        {data.map((d) => (
          <li key={d.grade} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: COLORS[d.grade] }} />
            <span className="text-navy">{d.grade}</span>
            <span className="ml-auto font-semibold text-navy">
              {Math.round((d.count / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
