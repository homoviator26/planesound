"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ResultRadar } from "@/components/result/ResultRadar";
import { ShareButton } from "@/components/result/ShareButton";
import { computePercentile, loadRegionPeers, loadResult } from "@/lib/result";
import { getDamageGrade, GRADE_COLORS, GRADE_DESCRIPTION } from "@/lib/scoring";
import { AREA_META } from "@/lib/questions";
import { ResponseRow } from "@/lib/types";

interface Loaded {
  row: ResponseRow;
  peerAvg: number | null;
  peerSample: number;
  percentile: number | null;
}

export default function ResultPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [state, setState] = useState<Loaded | "loading" | "notfound">("loading");

  useEffect(() => {
    if (!id) return;
    (async () => {
      const row = await loadResult(id);
      if (!row) {
        setState("notfound");
        return;
      }
      const peers = await loadRegionPeers(row.region);
      setState({
        row,
        peerAvg: peers?.avg ?? null,
        peerSample: peers?.sample ?? 0,
        percentile: peers ? computePercentile(row.total_score, peers.scores) : null,
      });
    })();
  }, [id]);

  if (state === "loading") {
    return (
      <>
        <SiteHeader />
        <main className="container-narrow py-32 text-center">
          <p className="text-muted">결과를 불러오는 중...</p>
        </main>
      </>
    );
  }

  if (state === "notfound") {
    return (
      <>
        <SiteHeader />
        <main className="container-narrow py-32 text-center">
          <p className="text-2xl font-bold text-navy">결과를 찾을 수 없어요</p>
          <p className="mt-3 text-sm text-muted">
            링크가 만료되었거나 잘못된 ID입니다. 다시 진단해보세요.
          </p>
          <Link
            href="/diagnosis"
            className="mt-8 inline-flex h-12 items-center rounded-full bg-navy px-6 text-sm font-semibold text-white"
          >
            진단 시작하기 →
          </Link>
        </main>
      </>
    );
  }

  const { row, peerAvg, peerSample, percentile } = state;
  const grade = getDamageGrade(row.total_score);
  const worstArea = (Object.entries(row.scores) as [keyof typeof row.scores, number][])
    .sort((a, b) => b[1] - a[1])[0][0];
  const worstMeta = AREA_META[worstArea];
  const gradeColor = GRADE_COLORS[grade];
  const gradeDesc = GRADE_DESCRIPTION[grade];
  const damageMinutes = Math.round(row.sleep_disruptions_annual * (1.5 + (row.total_score / 100) * 4));

  return (
    <>
      <SiteHeader />
      <main className="container-narrow pb-20 pt-10">
        {/* hero */}
        <section className="rounded-3xl border border-border bg-white p-7 shadow-card sm:p-10">
          <div className="flex items-center gap-2">
            <span className="text-xs tracking-widest text-muted">{row.region}</span>
            <span className="text-xs text-muted">·</span>
            <span className="text-xs text-muted">진단 결과</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            종합 피해 지수
          </h1>
          <div className="mt-6 flex flex-wrap items-end gap-4">
            <span className="text-7xl font-extrabold leading-none tracking-tight text-navy sm:text-8xl">
              {row.total_score}
            </span>
            <span className="text-base text-muted">/ 100점</span>
            <span
              className="ml-auto rounded-full px-4 py-1.5 text-sm font-bold text-white"
              style={{ background: gradeColor }}
            >
              {grade}
            </span>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-muted">{gradeDesc}</p>
        </section>

        {/* key stats */}
        <section className="mt-5 grid gap-3 sm:grid-cols-3">
          <KeyStat
            label="WHO 야간 기준 대비"
            value={`${row.who_multiplier}`}
            suffix="배"
            note="권고 40 dB Lnight 환산"
          />
          <KeyStat
            label="연간 수면방해 추정"
            value={row.sleep_disruptions_annual.toLocaleString()}
            suffix="회"
            note="제주공항 야간운항 기준"
          />
          <KeyStat
            label="연간 피해 시간"
            value={damageMinutes.toLocaleString()}
            suffix="분"
            note={`약 ${Math.round(damageMinutes / 60)}시간`}
          />
        </section>

        {/* radar */}
        <section className="mt-5 rounded-3xl border border-border bg-white p-6 shadow-card sm:p-8">
          <header className="mb-2 flex items-center justify-between">
            <h2 className="text-base font-semibold text-navy">5개 영역 분포</h2>
            {peerAvg !== null && (
              <span className="text-xs text-muted">{row.region} 응답자 평균과 비교</span>
            )}
          </header>
          <ResultRadar
            scores={row.scores}
            peerAvg={null}
          />
        </section>

        {/* worst area */}
        <section className="mt-5 rounded-3xl bg-navy p-7 text-white sm:p-8">
          <p className="text-xs uppercase tracking-widest text-sky">가장 심각한 영역</p>
          <h3 className="mt-2 text-2xl font-bold">{worstMeta.label}</h3>
          <p className="mt-1 text-sm text-white/70">
            영역 점수 <span className="font-bold text-white">{row.scores[worstArea]}점</span> · 가중치 {Math.round(worstMeta.weight * 100)}%
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/85">{worstMeta.reference}</p>
        </section>

        {/* peer comparison */}
        <section className="mt-5 rounded-3xl border border-border bg-white p-6 shadow-card sm:p-8">
          <h3 className="text-base font-semibold text-navy">같은 지역과 비교</h3>
          {percentile === null ? (
            <p className="mt-3 text-sm text-muted">
              {row.region} 응답자가 아직 충분하지 않아 비교를 표시할 수 없어요.
              데이터가 누적되면 이곳에서 백분위가 보입니다.
            </p>
          ) : (
            <>
              <p className="mt-3 text-sm text-muted">
                {row.region} 응답자 <span className="font-semibold text-navy">{peerSample}명</span> 중
              </p>
              <p className="mt-1 text-2xl font-bold text-navy">
                상위 <span className="text-grade-warning">{100 - (percentile ?? 50)}%</span>
              </p>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full bg-navy transition-[width]"
                  style={{ width: `${percentile}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-muted">
                <span>지역 최저</span>
                <span>지역 평균 {peerAvg}점</span>
                <span>지역 최고</span>
              </div>
            </>
          )}
        </section>

        {/* actions */}
        <section className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ShareButton
            region={row.region}
            totalScore={row.total_score}
            grade={grade}
            whoMultiplier={row.who_multiplier}
            sleepDisruptions={row.sleep_disruptions_annual}
            scores={row.scores}
          />
          <Link
            href="/dashboard"
            className="inline-flex h-12 w-full items-center justify-center rounded-full border border-border bg-white px-6 text-sm font-medium text-navy transition-colors hover:border-sky sm:w-auto"
          >
            집단 현황 보기
          </Link>
          <Link
            href="/diagnosis"
            className="inline-flex h-12 w-full items-center justify-center rounded-full px-6 text-sm font-medium text-muted transition-colors hover:text-navy sm:w-auto"
          >
            다시 진단하기
          </Link>
        </section>

        <p className="mt-10 text-center text-[11px] leading-relaxed text-muted/80">
          본 결과는 자가 진단 도구로, WHO·ISO 가이드라인을 참고한 추정값입니다.
          <br />
          정확한 측정은 환경부 소음 측정 또는 의료적 진단을 권장합니다.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}

function KeyStat({ label, value, suffix, note }: { label: string; value: string | number; suffix: string; note: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-2 flex items-baseline gap-1">
        <span className="text-3xl font-extrabold tracking-tight text-navy">{value}</span>
        <span className="text-sm font-semibold text-navy">{suffix}</span>
      </p>
      <p className="mt-1 text-[11px] text-muted">{note}</p>
    </div>
  );
}
