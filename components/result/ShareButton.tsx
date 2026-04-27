"use client";

import { useRef, useState } from "react";
import { ShareCard } from "./ShareCard";
import { AreaScores, DamageGrade } from "@/lib/types";

interface Props {
  region: string;
  totalScore: number;
  grade: DamageGrade;
  whoMultiplier: number;
  sleepDisruptions: number;
  scores: AreaScores;
}

export function ShareButton(props: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleSave() {
    if (!cardRef.current || busy) return;
    setBusy(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        logging: false,
      });
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `planesound-${props.region}-${props.totalScore}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, "image/png");
    } catch (e) {
      alert("이미지 저장에 실패했어요. 잠시 후 다시 시도해주세요.");
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleSave}
        disabled={busy}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-navy px-6 text-sm font-semibold text-white shadow-card transition-all hover:bg-navy-soft disabled:bg-border disabled:text-muted disabled:shadow-none sm:w-auto"
      >
        {busy ? "이미지 생성 중..." : "공유 카드 저장"}
      </button>

      {/* offscreen capture target */}
      <div
        aria-hidden
        style={{ position: "fixed", left: -99999, top: 0, pointerEvents: "none" }}
      >
        <ShareCard ref={cardRef} {...props} />
      </div>
    </>
  );
}
