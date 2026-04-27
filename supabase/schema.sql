-- =============================================================
-- 플레인사운드 (Plane Sound) — Supabase 스키마
-- 사용법: Supabase 대시보드 → SQL Editor → 이 파일 전체 붙여넣고 RUN
-- =============================================================

-- 1) responses 테이블 생성
create table if not exists public.responses (
  id                        uuid primary key default gen_random_uuid(),
  created_at                timestamptz not null default now(),
  region                    text not null,
  housing_type              text not null check (housing_type in ('detached','apartment','mixed')),
  bedtime                   text not null check (bedtime in ('before_22','22_to_24','after_24')),
  scores                    jsonb not null,
  total_score               integer not null check (total_score between 0 and 100),
  who_multiplier            numeric not null,
  sleep_disruptions_annual  integer not null,
  soundproofing             boolean not null,
  awareness_duration        text not null check (awareness_duration in ('under_1y','1_to_3y','3_to_5y','over_5y'))
);

-- 인덱스 (대시보드 집계 성능)
create index if not exists responses_region_idx     on public.responses (region);
create index if not exists responses_created_at_idx on public.responses (created_at desc);
create index if not exists responses_total_idx      on public.responses (total_score);

-- =============================================================
-- 2) Row Level Security
-- =============================================================
alter table public.responses enable row level security;

-- INSERT: 누구나 익명으로 응답 등록 가능
drop policy if exists "anon_insert_responses" on public.responses;
create policy "anon_insert_responses"
  on public.responses
  for insert
  to anon, authenticated
  with check (true);

-- SELECT: 집계 및 결과 조회 허용
-- (개별 행 조회는 가능하지만, ID는 UUID v4(122-bit)라 추측 불가)
drop policy if exists "anon_select_responses" on public.responses;
create policy "anon_select_responses"
  on public.responses
  for select
  to anon, authenticated
  using (true);

-- UPDATE/DELETE: 정책 없음 = 차단
-- (anon 키로는 응답을 수정·삭제할 수 없음)

-- =============================================================
-- 3) [선택] 더 엄격한 모드로 업그레이드하려면:
--    아래 주석을 풀고 위의 SELECT 정책을 삭제하세요.
--    개별 결과는 localStorage에서만 보이고, 대시보드는 view로만 동작합니다.
--    이 경우 lib/result.ts에서 Supabase 조회를 제거해야 합니다.
-- =============================================================
-- drop policy if exists "anon_select_responses" on public.responses;
--
-- create or replace view public.region_stats as
-- select region, count(*) as count, round(avg(total_score))::int as avg_score
-- from public.responses
-- group by region;
--
-- create or replace view public.monthly_stats as
-- select to_char(created_at, 'YYYY-MM') as month,
--        count(*) as count,
--        round(avg(total_score))::int as avg_score
-- from public.responses
-- group by 1
-- order by 1;
--
-- grant select on public.region_stats   to anon, authenticated;
-- grant select on public.monthly_stats to anon, authenticated;
