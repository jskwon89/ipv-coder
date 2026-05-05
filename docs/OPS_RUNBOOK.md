# Operations Runbook

Codex가 운영, 성능, 구축 작업을 맡을 때 우선 참고하는 문서다.

## 프로젝트 개요

- Framework: Next.js 16.2.2 App Router
- Runtime UI: React 19.2.4
- Styling: Tailwind CSS 4, global CSS
- Backend surface: Next.js route handlers under `src/app/api/**`
- Database/storage/auth: Supabase
- Deployment: Vercel
- Scheduled job: GitHub Actions `Supabase Keep-Alive`
- Notifications: Discord webhook, Nodemailer
- File processing: `archiver`, `xlsx`, `pdf-parse`

## 주요 경로

- 앱 화면: `src/app/**/page.tsx`
- API 라우트: `src/app/api/**/route.ts`
- 공통 UI: `src/components/**`
- 인증 컨텍스트: `src/contexts/**`
- DB/API helper: `src/lib/db.ts`
- Supabase client: `src/lib/supabase.ts`
- Supabase admin client: `src/lib/supabase-admin.ts`
- 알림/이메일: `src/lib/discord.ts`, `src/lib/email.ts`
- 파일/엑셀 처리: `src/lib/excel-export.ts`, `src/app/api/projects/**`
- 정적 이미지: `public/images/**`, `public/logo*`
- DB schema: `supabase-schema.sql`
- Vercel/Next config: `next.config.ts`
- Keep-alive workflow: `.github/workflows/supabase-keep-alive.yml`

## 로컬 시작

```powershell
npm install
npm run dev
```

기본 개발 URL:

```text
http://localhost:3000
```

## 필수 환경변수

`.env.local`은 git에 올리지 않는다.

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DISCORD_WEBHOOK_URL=
SITE_URL=
NEXT_PUBLIC_SITE_URL=
ADMIN_PIN=
ADMIN_SESSION_SECRET=
```

도메인 URL은 서버 코드에서 `SITE_URL`을 우선 사용하고, 없으면 `NEXT_PUBLIC_SITE_URL`, Vercel 기본 URL, 기존 Vercel 도메인 순서로 fallback한다. 커스텀 도메인 전환 시 Vercel 환경변수에 `SITE_URL` 또는 `NEXT_PUBLIC_SITE_URL`을 설정한다.

`ADMIN_PIN`은 관리자 로그인 PIN이다. 클라이언트 코드에 직접 쓰지 않는다. `ADMIN_SESSION_SECRET`은 관리자 세션 쿠키 서명용 값이며, 없으면 `ADMIN_PIN`을 사용해 동작하지만 운영에서는 별도 난수 문자열로 설정하는 것을 권장한다.

## 이메일 정규화 운영 SQL

`service_requests.email`과 `contact_inquiries.email`은 앱 코드에서 저장/조회 시 `trim().toLowerCase()`로 정규화한다. 기존 데이터에 대소문자나 앞뒤 공백이 섞였을 때는 Supabase SQL Editor에서 아래 SQL을 1회 실행한다.

```sql
update service_requests
set email = lower(btrim(email))
where email is not null
  and email <> lower(btrim(email));

update contact_inquiries
set email = lower(btrim(email))
where email is not null
  and email <> lower(btrim(email));
```

주의: `email=''`처럼 비어 있는 기존 의뢰는 이 SQL로 사용자 계정에 자동 연결되지 않는다. 소유자가 확인된 row만 별도 승인 후 `update service_requests set email = 'user@example.com' where id = '...'` 형태로 보정한다.

관리자 세션에서 `/api/admin/debug?email=user@example.com`을 호출하면 해당 이메일의 Auth 사용자, `/my` 대상 service_requests 매칭, 빈 이메일 row, 문의 이메일 정규화 상태를 확인할 수 있다.

이메일 발송 기능을 점검할 때는 `src/lib/email.ts`에서 실제로 요구하는 `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM_NAME` 환경변수를 확인한다.

## 검증 명령

작은 UI 문구 변경:

```powershell
npm run lint
```

API, DB, Next config, package 변경:

```powershell
npm run lint
npm run build
```

타입만 빠르게 보고 싶을 때:

```powershell
npx tsc --noEmit
```

의존성 상태 확인:

```powershell
npm ls
```

## Next.js 16 작업 규칙

`AGENTS.md` 지시가 우선이다.

Next.js 코드를 수정하기 전에는 설치된 문서를 확인한다.

```powershell
Get-ChildItem node_modules\next\dist\docs
```

`node_modules`가 없으면 먼저 의존성을 설치한다.

```powershell
npm install
```

이후 수정하려는 주제와 관련된 문서를 읽고 작업한다. 예를 들어 route handler, caching, metadata, image, font, config, middleware/proxy 같은 영역은 Next 버전별 변경 가능성이 크다.

## 배포 전 점검

1. `git status --short`로 의도하지 않은 변경이 섞였는지 확인한다.
2. `npm run lint`를 실행한다.
3. API, config, dependency, Supabase 관련 변경이 있으면 `npm run build`를 실행한다.
4. 환경변수 추가/변경이 있으면 Vercel 프로젝트 설정과 문서를 함께 갱신한다.
5. Supabase schema 변경이 있으면 `supabase-schema.sql`과 실제 DB 적용 여부를 같이 기록한다.

## Vercel 운영 점검

배포 실패 시 우선 확인할 것:

- Vercel 환경변수 누락
- Next.js version 호환성
- server/client component 경계 오류
- dynamic route handler build 오류
- Supabase service role key 사용 위치
- file upload/download route의 런타임 제약

## GitHub Actions Keep-Alive

현재 워크플로:

- `.github/workflows/supabase-keep-alive.yml`
- 매일 03:00 UTC에 GitHub repository variable `PRIMER_SITE_URL`의 `/api/keep-alive` 호출
- HTTP 200이 아니면 실패

도메인이나 API 경로가 바뀌면 GitHub repository variable `PRIMER_SITE_URL` 또는 이 워크플로를 같이 수정한다.

## 성능 점검 우선순위

1. 랜딩/대시보드 첫 화면 이미지 크기와 Next Image 사용 여부
2. client component 과다 사용 여부
3. 페이지별 중복 fetch와 불필요한 상태 관리
4. route handler에서 큰 파일/PDF/ZIP 처리 시 Vercel 제한
5. Supabase 쿼리의 필터/페이지네이션
6. 공통 컴포넌트의 bundle 영향
7. `next.config.ts` 이미지 설정과 실제 asset 크기

## 장애 대응 메모

운영 장애나 배포 실패를 고칠 때는 `docs/AI_HANDOFF.md`에 다음을 남긴다.

- 증상
- 재현 명령 또는 URL
- 원인 후보
- 수정 파일
- 검증 결과
- Vercel/Supabase/GitHub 쪽에서 별도로 바꾼 설정
