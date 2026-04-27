# 플레인사운드 (Plane Sound) — 배포 가이드

지금까지 만든 프로젝트는 **Supabase 키만 채우면 그대로 배포 가능한 상태**입니다.
아래 순서대로 따라가면 약 15분이면 끝나요.

---

## 1. Supabase 프로젝트 만들기

1. https://supabase.com/ 접속 → **Start your project** → GitHub 로그인
2. **New project** 클릭
   - Name: `planesound`
   - Database Password: 자동 생성된 비밀번호를 안전한 곳에 저장
   - Region: `Northeast Asia (Seoul)`
   - Plan: Free
3. 프로젝트가 준비되는 데 1~2분 걸려요. 차 한잔 ☕

## 2. 데이터베이스 스키마 생성

1. 왼쪽 사이드바에서 **SQL Editor** 클릭
2. **+ New query** 클릭
3. 프로젝트의 [`supabase/schema.sql`](supabase/schema.sql) 파일 내용 **전체 복사** → 붙여넣기
4. 우측 상단 **Run** (또는 `Ctrl+Enter`)
5. "Success. No rows returned" 메시지가 나오면 OK ✅

생성된 것:
- `responses` 테이블 (10개 컬럼 + 인덱스 3개)
- RLS 활성화 + INSERT·SELECT 정책

확인: 왼쪽 **Table Editor** → `responses` 테이블이 보이고 컬럼이 다 있으면 성공.

## 3. API 키 복사

1. 왼쪽 사이드바 **Project Settings** (⚙️) → **API**
2. 두 값을 복사해두세요:
   - **Project URL**: `https://xxxxxxx.supabase.co`
   - **Project API keys** → **anon / public**: `eyJhbGc...` (긴 문자열)

> ⚠️ `service_role` 키는 절대 클라이언트에 노출하면 안 됩니다. 이 프로젝트는 `anon` 키만 씁니다.

## 4. 로컬 환경변수 설정

프로젝트 폴더에 `.env.local` 파일을 만들고 (또는 `.env.local.example` 복사) 채워넣으세요:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# 아직 배포 안 했으면 비워두거나 localhost로
NEXT_PUBLIC_SITE_URL=http://localhost:3002
```

저장한 뒤 dev 서버 재시작:

```bash
npm run dev
```

## 5. 로컬에서 동작 확인

1. http://localhost:3002 접속
2. **진단 시작하기** → 12문항 끝까지 응답 → **결과 보기**
3. 결과 페이지에서 점수가 보이면 OK
4. Supabase 대시보드 **Table Editor → responses** 새로고침 → 방금 응답한 행이 들어와 있으면 ✅

문제 발생 시:
- 결과 페이지에서 "결과를 찾을 수 없어요" → 환경변수 오타 가능성. 다시 확인 후 dev 재시작.
- 응답이 Supabase에 안 들어감 → 브라우저 콘솔(F12) 에러 확인. RLS 정책이 INSERT를 허용하는지 SQL Editor에서 재확인.

---

## 6. Vercel 배포

### 6-1. GitHub 저장소 만들기

```bash
cd plainsound
git init
git add .
git commit -m "초기 커밋"
```

GitHub 웹에서 **New repository** → 이름 `planesound` → Public 또는 Private → Create.

```bash
git remote add origin https://github.com/YOUR_USERNAME/planesound.git
git branch -M main
git push -u origin main
```

### 6-2. Vercel에서 import

1. https://vercel.com/ 접속 → GitHub 로그인
2. **Add New… → Project** → 방금 만든 `planesound` 저장소 **Import**
3. **Framework Preset**: Next.js (자동 감지됨)
4. **Environment Variables** 항목에서 다음 3개 추가:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxxxx.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...` |
   | `NEXT_PUBLIC_SITE_URL` | `https://planesound.vercel.app` (배포 후 받게 될 도메인) |

5. **Deploy** 클릭. 2~3분 후 라이브 ✅

배포 후 발급된 URL(예: `https://planesound.vercel.app`)을 위 `NEXT_PUBLIC_SITE_URL`에 채워넣고 다시 배포하면 sitemap·OG 메타까지 정확해집니다.

### 6-3. 커스텀 도메인 (선택)

자체 도메인이 있으면:
1. Vercel 프로젝트 → **Settings → Domains** → 도메인 입력
2. 도메인 등록사이트(가비아·후이즈 등)에서 안내된 DNS 레코드 추가
3. 활성화 후 `NEXT_PUBLIC_SITE_URL`을 새 도메인으로 업데이트 → 재배포

---

## 7. Supabase 운영 팁

**대시보드 데이터 모니터링**
- Supabase **Table Editor** → `responses`에서 응답 누적 확인
- 하루에 한 번이라도 들어오면 `/dashboard` 페이지에 차트가 채워집니다 (응답자 ≥ 1명 필요. 지역 막대는 ≥ 3명).

**이상 응답 정리**
- SQL Editor에서 직접 삭제 가능. 예: 자동화된 스팸 응답을 지우려면
  ```sql
  delete from responses where created_at < '2025-01-01';
  ```

**보안 강화 (선택)**
- 응답이 충분히 누적되면 `supabase/schema.sql` 하단 주석 처리된 "엄격 모드" 섹션을 적용해 개별 행 조회를 차단할 수 있습니다.
- 그 경우 `lib/result.ts`도 localStorage 전용으로 수정해야 해요. 필요할 때 알려주세요.

---

## 8. 작업 흐름 요약

```
사용자 응답
   ↓
/diagnosis (3-step 폼)
   ↓ submit
lib/scoring.ts (점수 계산)
   ↓
Supabase responses 테이블 (INSERT, anon)
   ↓ 응답 ID 반환
/result/[id] (개별 결과 표시)

집단 통계
   ↓
fetchDashboard() (Supabase SELECT, anon)
   ↓
/dashboard (4개 차트 렌더)
```

이상이에요. 배포 중 막히는 부분 있으면 단계 번호와 에러 메시지 그대로 알려주세요.
