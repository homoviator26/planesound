import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StatsSection } from "@/components/StatsSection";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] bg-gradient-to-b from-sky-pale via-background to-background"
          />
          <div className="container-narrow pt-16 pb-4 text-center sm:pt-24">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-sky/40 bg-white px-3 py-1 text-[11px] font-medium tracking-widest text-sky-deep">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-sky-deep" />
              제주 항공 소음 자가진단
            </p>
            <h1 className="mt-6 text-balance text-3xl font-extrabold leading-tight tracking-tight text-navy sm:text-5xl">
              내 항공 소음 피해 수준을<br className="hidden sm:block" /> 측정해보세요
            </h1>
            <p className="mx-auto mt-5 max-w-md text-pretty text-[15px] leading-relaxed text-muted sm:text-base">
              WHO·ISO 국제 기준에 근거해 12문항으로 정량 진단합니다.
              <br />
              5분이면 충분합니다.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/diagnosis"
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-navy px-7 text-sm font-semibold text-white shadow-card transition-all hover:bg-navy-soft hover:shadow-cardHover sm:w-auto"
              >
                진단 시작하기 →
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-12 w-full items-center justify-center rounded-full border border-border bg-white px-7 text-sm font-medium text-navy transition-colors hover:border-sky hover:text-sky-deep sm:w-auto"
              >
                집단 현황 보기
              </Link>
            </div>
            <p className="mt-5 text-xs text-muted">소요 시간 약 3~5분 · 로그인 불필요 · 완전 익명</p>
          </div>
        </section>

        <StatsSection />

        <section className="container-wide mt-24">
          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="rounded-2xl border border-border bg-white p-6 shadow-card">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-pale text-sm font-bold text-sky-deep">
                  {i + 1}
                </div>
                <h3 className="mt-4 text-base font-semibold text-navy">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container-narrow mt-24">
          <div className="rounded-3xl bg-navy p-8 text-white sm:p-12">
            <p className="text-xs uppercase tracking-widest text-sky">Plane Sound</p>
            <h2 className="mt-3 text-2xl font-bold leading-snug sm:text-3xl">
              우리는 소음을 데이터로 바꿉니다.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-white/75">
              플레인사운드는 제주 거주민이 일상에서 겪는 항공 소음 피해를
              개인의 호소가 아닌 <span className="text-white">정량적 데이터</span>로 가시화하는 프로젝트입니다.
              WHO 환경소음 가이드라인(2018)과 ISO 15666:2003 표준 척도에 근거해
              피해 수준을 측정하고, 익명 누적 데이터로 제주 전체의 집단적 현황을 시각화합니다.
            </p>
            <div className="mt-6 grid gap-3 text-sm text-white/80 sm:grid-cols-2">
              <div className="flex items-start gap-2">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-sky" />
                <span>WHO 야간 소음 권고 40 dB 기준 환산</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-sky" />
                <span>ISO 11-point 성가심 표준 척도</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-sky" />
                <span>5개 영역 12문항 가중 평균</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-sky" />
                <span>완전 익명 · 개별 행 조회 불가</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

const STEPS = [
  {
    title: "기본 정보 입력",
    body: "거주지, 주거 형태, 취침 시간대 등 진단 맥락을 위한 기본 정보를 익명으로 입력합니다.",
  },
  {
    title: "5개 영역 진단",
    body: "수면·집중·심리·신체·의사소통 5개 영역에 걸친 12문항에 응답합니다. 약 3분 소요.",
  },
  {
    title: "정량 리포트",
    body: "WHO·ISO 기준 환산값, 영역별 레이더 차트, 같은 지역 대비 위치를 즉시 받아봅니다.",
  },
];
