import { fetchDashboard } from "@/lib/dashboard";
import { RegionBars } from "@/components/dashboard/RegionBars";
import { AvgRadar } from "@/components/dashboard/AvgRadar";
import { MonthlyTrend } from "@/components/dashboard/MonthlyTrend";
import { GradeDonut } from "@/components/dashboard/GradeDonut";

export const revalidate = 60;

export default async function DashboardPage() {
  const data = await fetchDashboard();

  if (!data.configured) {
    return (
      <main className="container-narrow py-24 text-center">
        <p className="text-xs uppercase tracking-widest text-sky-deep">집단 현황</p>
        <h1 className="mt-3 text-2xl font-bold text-navy sm:text-3xl">데이터 수집 준비 중</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
          익명 응답 데이터베이스가 곧 연결됩니다. 응답이 누적되면 이곳에서
          제주 전체의 항공 소음 피해 현황이 시각화됩니다.
        </p>
      </main>
    );
  }

  return (
    <main className="container-wide py-12 sm:py-16">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-widest text-sky-deep">집단 현황</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
          제주 항공 소음 피해 현황
        </h1>
        <p className="mt-3 text-sm text-muted">
          응답 데이터는 완전 익명으로 수집되며, 개별 행은 조회되지 않습니다.
        </p>
      </header>

      {/* headline stats */}
      <section className="grid gap-3 sm:grid-cols-3">
        <Stat label="전체 응답자" value={data.total.toLocaleString()} suffix="명" />
        <Stat label="평균 피해 지수" value={data.avgScore} suffix="점" />
        <Stat label="WHO 위험권 비율" value={data.riskRatio} suffix="%" note="총합 점수 50점 이상" />
      </section>

      {/* charts grid */}
      <section className="mt-10 grid gap-5 lg:grid-cols-2">
        <Card title="읍·면·동별 평균 피해 (상위 10)">
          <RegionBars data={data.topRegions} />
        </Card>
        <Card title="5개 영역 전체 평균">
          <AvgRadar scores={data.areaAverages} />
        </Card>
        <Card title="월별 응답 추이" subtitle="응답 수(실선) · 평균 점수(점선)">
          <MonthlyTrend data={data.monthly} />
        </Card>
        <Card title="피해 등급 분포">
          <GradeDonut data={data.gradeDist} />
        </Card>
      </section>

      <p className="mt-10 text-center text-[11px] text-muted">
        데이터 출처: 플레인사운드 익명 자가진단 / WHO Environmental Noise Guidelines (2018) / ISO 15666:2003
      </p>
    </main>
  );
}

function Stat({ label, value, suffix, note }: { label: string; value: string | number; suffix: string; note?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-2 flex items-baseline gap-1">
        <span className="text-3xl font-extrabold tracking-tight text-navy">{value}</span>
        <span className="text-sm font-semibold text-navy">{suffix}</span>
      </p>
      {note && <p className="mt-1 text-[11px] text-muted">{note}</p>}
    </div>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
      <header className="mb-4">
        <h2 className="text-sm font-semibold text-navy">{title}</h2>
        {subtitle && <p className="mt-1 text-[11px] text-muted">{subtitle}</p>}
      </header>
      {children}
    </div>
  );
}
