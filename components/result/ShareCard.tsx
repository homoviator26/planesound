"use client";

import { forwardRef } from "react";
import { AREA_META } from "@/lib/questions";
import { GRADE_COLORS } from "@/lib/scoring";
import { Area, AreaScores, DamageGrade } from "@/lib/types";

interface Props {
  region: string;
  totalScore: number;
  grade: DamageGrade;
  whoMultiplier: number;
  sleepDisruptions: number;
  scores: AreaScores;
}

const AREA_ORDER: Area[] = ["sleep", "annoyance", "concentration", "physical", "communication"];

export const ShareCard = forwardRef<HTMLDivElement, Props>(function ShareCard(
  { region, totalScore, grade, whoMultiplier, sleepDisruptions, scores },
  ref,
) {
  const gradeColor = GRADE_COLORS[grade];
  return (
    <div
      ref={ref}
      style={{
        width: 540,
        height: 960,
        padding: 48,
        background: "linear-gradient(180deg, #0A1628 0%, #1B2A44 100%)",
        color: "white",
        fontFamily:
          "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 10, height: 10, borderRadius: 999, background: "#6BA9E0" }} />
        <span style={{ fontSize: 14, letterSpacing: 4, fontWeight: 700, color: "#E8F1FB" }}>PLANE SOUND</span>
      </div>

      <div style={{ marginTop: 60 }}>
        <p style={{ fontSize: 18, color: "#9DB4D1", margin: 0 }}>{region}</p>
        <p style={{ fontSize: 16, color: "#9DB4D1", margin: 0, marginTop: 4 }}>종합 피해 지수</p>
      </div>

      <div style={{ marginTop: 14, display: "flex", alignItems: "baseline", gap: 12 }}>
        <span style={{ fontSize: 140, fontWeight: 800, lineHeight: 1, letterSpacing: -4 }}>{totalScore}</span>
        <span style={{ fontSize: 24, color: "#9DB4D1" }}>/ 100</span>
      </div>

      <div
        style={{
          marginTop: 12,
          alignSelf: "flex-start",
          padding: "8px 16px",
          borderRadius: 999,
          background: gradeColor,
          color: "white",
          fontWeight: 700,
          fontSize: 16,
        }}
      >
        {grade}
      </div>

      <div style={{ marginTop: 28, display: "flex", gap: 12 }}>
        <Stat label="WHO 기준" value={`${whoMultiplier}배`} />
        <Stat label="연간 수면방해" value={`~${sleepDisruptions.toLocaleString()}회`} />
      </div>

      <div style={{ marginTop: 32 }}>
        <p style={{ fontSize: 13, color: "#9DB4D1", marginBottom: 12, letterSpacing: 2 }}>영역별 점수</p>
        {AREA_ORDER.map((a) => (
          <div key={a} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <span style={{ width: 44, fontSize: 13, color: "#E8F1FB" }}>{AREA_META[a].short}</span>
            <div style={{ flex: 1, height: 8, borderRadius: 999, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
              <div
                style={{
                  width: `${scores[a]}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #6BA9E0, #2C6FBA)",
                  borderRadius: 999,
                }}
              />
            </div>
            <span style={{ width: 32, textAlign: "right", fontSize: 13, fontWeight: 700, color: "white" }}>{scores[a]}</span>
          </div>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 20 }}>
        <p style={{ fontSize: 14, color: "#9DB4D1", margin: 0 }}>planesound.app</p>
        <p style={{ fontSize: 18, fontWeight: 700, color: "white", margin: 0, marginTop: 4 }}>내 점수도 측정해보기 →</p>
      </div>
    </div>
  );
});

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        flex: 1,
        padding: 16,
        borderRadius: 16,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <p style={{ fontSize: 12, color: "#9DB4D1", margin: 0 }}>{label}</p>
      <p style={{ fontSize: 22, fontWeight: 800, color: "white", margin: 0, marginTop: 6 }}>{value}</p>
    </div>
  );
}
