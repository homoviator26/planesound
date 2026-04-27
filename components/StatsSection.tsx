import { fetchSiteStats } from "@/lib/stats";

export const revalidate = 60;

export async function StatsSection() {
  const stats = await fetchSiteStats();

  if (!stats.configured) {
    return (
      <section className="container-narrow mt-12">
        <div className="rounded-2xl border border-border bg-white p-6 text-center shadow-card">
          <p className="text-xs uppercase tracking-widest text-sky-deep">데이터 수집 준비 중</p>
          <p className="mt-2 text-sm text-muted">
            곧 제주 거주민의 익명 진단 데이터가 이곳에 누적됩니다.
          </p>
        </div>
      </section>
    );
  }

  const items = [
    { label: "전체 참여자", value: stats.total > 0 ? stats.total.toLocaleString() : "—", suffix: stats.total > 0 ? "명" : "" },
    { label: "평균 피해 지수", value: stats.total > 0 ? stats.avgScore : "—", suffix: stats.total > 0 ? "점" : "" },
    { label: "최고 피해 지역", value: stats.topRegion?.name ?? "—", suffix: stats.topRegion ? `· ${stats.topRegion.avg}점` : "" },
  ];

  return (
    <section className="container-narrow mt-12">
      <div className="grid grid-cols-3 gap-3 rounded-2xl border border-border bg-white p-2 shadow-card">
        {items.map((it) => (
          <div key={it.label} className="rounded-xl px-3 py-4 text-center">
            <p className="text-[11px] tracking-wider text-muted">{it.label}</p>
            <p className="mt-2 text-lg font-bold text-navy md:text-2xl">
              {it.value}
              {it.suffix && <span className="ml-1 text-xs font-normal text-muted">{it.suffix}</span>}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-muted">실시간 익명 집계 · 1분마다 갱신</p>
    </section>
  );
}
