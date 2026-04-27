# 플레인사운드 (Plane Sound)

제주 거주민이 자신의 항공 소음 피해 수준을 WHO·ISO 국제 기준에 근거해 정량적으로 진단받고,
익명으로 누적된 데이터를 통해 제주 전체의 집단적 피해 현황을 시각화하는 웹서비스.

## 기술 스택

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + Pretendard
- Supabase (PostgreSQL, 익명 응답 저장)
- Recharts (집계 차트)
- html2canvas (인스타 스토리 9:16 공유 카드)
- Vercel 배포

## 프로젝트 구조

```
plainsound/
├── app/
│   ├── page.tsx              # 랜딩
│   ├── diagnosis/            # 3단계 진단 폼
│   ├── result/[id]/          # 개별 결과 리포트
│   ├── dashboard/            # 집단 현황 시각화
│   ├── sitemap.ts / robots.ts
│   ├── opengraph-image.tsx   # 동적 OG 이미지
│   └── icon.tsx              # 동적 파비콘
├── components/
│   ├── SiteHeader.tsx, SiteFooter.tsx, StatsSection.tsx
│   ├── diagnosis/            # 폼 스텝 컴포넌트
│   ├── result/               # 레이더, 공유 카드
│   └── dashboard/            # 4개 차트
├── lib/
│   ├── types.ts              # 모든 TS 타입
│   ├── questions.ts          # 12문항 + 영역 메타
│   ├── scoring.ts            # 점수·등급·WHO 환산 로직
│   ├── regions.ts            # 제주 43개 읍·면·동
│   ├── supabase.ts           # Supabase 클라이언트 (env 안전)
│   ├── diagnosis.ts          # 응답 제출 (Supabase ↔ localStorage)
│   ├── result.ts             # 결과 로드 + 지역 백분위
│   ├── dashboard.ts          # 대시보드 집계
│   └── stats.ts              # 랜딩 핵심 통계
└── supabase/schema.sql       # 테이블 + RLS 정책
```

## 시작하기

### 로컬 개발

```bash
npm install
npm run dev   # http://localhost:3002
```

Supabase 키 없이도 진단 → 결과 흐름이 동작합니다 (결과는 localStorage에 저장).

### Supabase 연동 + 배포

[SETUP.md](./SETUP.md) 참고. 약 15분 소요.

요약:
1. Supabase 프로젝트 생성 → SQL Editor에서 `supabase/schema.sql` 실행
2. `.env.local`에 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 추가
3. GitHub push → Vercel import → 환경변수 등록 → Deploy

## 점수 산정 방법

- **Likert (1~5)** → 0/25/50/75/100 정규화
- **ISO 11-point Slider (0~10)** → 0~100
- **영역 점수** = 해당 영역 문항 평균
- **종합 점수** = 가중 평균
  - 수면 30% / 심리 25% / 집중 20% / 신체 15% / 의사소통 10%
- **등급**: 주의 (<25) / 경계 (<50) / 위험 (<75) / 매우 위험 (75+)
- **WHO 야간 기준 배수**: 종합 점수 → 추정 dB(40~70) → 음압비
- **연간 수면 방해 추정**: 제주공항 야간운항 5,100회 × 수면 점수 × 취침 시간 보정 × 방음 보정

## 출처 / 근거

- WHO Environmental Noise Guidelines (2018) — 야간 항공소음 권고 40 dB Lnight
- ISO 15666:2003 — 11-point Annoyance Scale
- 제주공항 운항 통계 (참고치 기반 추정)

## 라이선스

비상업적 자가 진단 도구로 만들어졌습니다.
