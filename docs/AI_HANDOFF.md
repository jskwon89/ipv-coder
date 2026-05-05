# AI Handoff Log

이 문서는 Claude Code와 Codex가 작업 상태를 넘겨받기 위한 공유 메모다. 최신 항목을 위에 쓴다.

## 현재 작업 잠금

- 없음

## 최신 상태

- 2026-05-05: Codex가 협업 체계 문서 초안을 추가했다.
- 레포는 Next.js 16.2.2, React 19.2.4 기반이다.
- 주요 운영 연동은 Supabase, Vercel, GitHub Actions keep-alive, Discord/Nodemailer 알림, 파일 업로드/다운로드, Excel/PDF/ZIP 처리다.
- `node_modules`가 설치되어 있다. Next.js 코드 수정 전 관련 문서는 `node_modules/next/dist/docs/`에서 먼저 확인한다.

## 다음 작업자에게

- Claude Code는 UI 작업 전에 `docs/AI_COLLABORATION.md`의 Claude 담당 영역을 확인한다.
- Codex는 운영/성능/구축 작업 전에 `docs/OPS_RUNBOOK.md`를 확인한다.
- 기존 `PROGRESS.md`에는 오래된 작업 이력이 많지만 콘솔 환경에 따라 한글이 깨져 보일 수 있다. 내용 복구나 정리는 별도 작업으로 다루는 편이 안전하다.

## 인수인계 작성 양식

아래 양식을 복사해서 최신 항목 위에 붙인다.

```md
## YYYY-MM-DD HH:mm - AgentName

담당:

변경 파일:

완료:

검증:

남은 일:

다음 작업자 주의:
```

## 2026-05-05 17:08 - Codex

담당:

- `jskwon@kicj.re.kr` `/my` 미노출 추가 진단, auth 로딩 레이스 보완, 관리자 디버그 엔드포인트 추가

변경 파일:

- `src/app/my/page.tsx`
- `src/contexts/UserAuthContext.tsx`
- `src/app/api/auth/signup/route.ts`
- `src/lib/db.ts`
- `src/app/api/admin/debug/route.ts`
- `docs/OPS_RUNBOOK.md`
- `docs/AI_HANDOFF.md`

완료:

- Supabase 기준 `jskwon@kicj.re.kr`은 service_requests 정확 일치 3건, 정규화 일치 3건, 대소문자/공백 mismatch 0건으로 확인했다.
- 프로덕션 API 기준 `/api/research-design`, `/api/stats-design`, `/api/contest`가 `jskwon@kicj.re.kr`로 각각 1건씩 반환하는 것을 확인했다.
- `/my`가 Supabase Auth 세션 복원 중 `user === null` 상태를 로그인 필요로 오판하지 않도록 `UserAuthContext.loading`을 반영했다.
- 로그인/회원가입 이메일, `contact_inquiries.email` 저장/수정도 trim/lowercase 정규화하도록 보완했다.
- 관리자 세션 전용 `/api/admin/debug?email=...` 엔드포인트를 추가해 Auth 사용자, `/my` 대상 의뢰 매칭, 빈 이메일 row, 문의 이메일 상태를 점검할 수 있게 했다.
- `docs/OPS_RUNBOOK.md`에 기존 `service_requests`, `contact_inquiries` 이메일 정규화 SQL을 기록했다.

검증:

- `git diff --check` 통과
- `npm run lint` 통과. 기존 warning 82건은 남아 있음.
- `npm run build` 통과

남은 일:

- Supabase SQL Editor에서 정규화 SQL 실행 여부는 운영자가 결정해야 한다. 이번 작업에서는 production 데이터 update를 수행하지 않았다.
- 기존 빈 이메일 row `1775696531610-p0zjv1x` 수동 연결 여부는 사용자 확인 후 진행한다.

다음 작업자 주의:

- `/api/admin/debug`은 관리자 세션 쿠키가 있어야 접근 가능하다.
- `image/landing*.webp` 미추적 파일은 이번 Codex 작업과 무관하므로 건드리지 않았다.

## 2026-05-05 16:59 - Codex

담당:

- `/my` 사용자 의뢰 노출 이슈 진단 및 service_requests 이메일 정규화

변경 파일:

- `src/lib/db.ts`
- `src/app/my/page.tsx`
- `src/app/project/[id]/page.tsx`
- `src/app/api/judgment-coding/route.ts`
- `docs/AI_HANDOFF.md`

완료:

- Supabase `service_requests` 분포 확인: 전체 4건, `email=''` 1건, `email IS NULL` 0건, trim 후 blank 1건.
- `overod998@gmail.com`은 정확 일치 0건, trim/lowercase 정규화 일치도 0건. 대소문자/공백 차이 row는 발견되지 않았다.
- 빈 이메일 row는 `id=1775696531610-p0zjv1x`, `service_type=judgment-coding`, `projectId=1775662256546-dx7emb0`, `projectName=2023~2025 IPV 판결문`, `created_at=2026-04-09T01:02:11.61+00:00`.
- 원인은 `src/app/project/[id]/page.tsx`의 판결문 코딩 의뢰 POST가 `email: ""`을 전송하던 경로로 확인했다.
- `/my` fetchAll은 로그인 이메일을 trim/lowercase 후 13개 서비스 API에 전달하도록 변경했다.
- 13개 서비스 API의 email 조회 비교는 공통 `_getServiceRequests()`에서 trim/lowercase 정규화 후 `.eq('email', normalizedEmail)`로 통일했다.
- 새 service_requests 저장도 공통 `serviceRequestToRow()`에서 email을 trim/lowercase로 저장하도록 통일했다.
- 판결문 코딩 의뢰 API는 이메일이 비어 있으면 400으로 막아 같은 유형의 빈 row 생성을 방지했다.

검증:

- `git diff --check` 통과
- `npm run lint` 통과. 기존 warning 82건은 남아 있음.
- `npm run build` 통과

남은 일:

- 기존 빈 이메일 row `1775696531610-p0zjv1x`는 코드 패치만으로 자동 연결되지 않는다. 해당 의뢰가 `overod998@gmail.com` 소유가 맞다면 Supabase에서 `email='overod998@gmail.com'`으로 수동 보정 필요.
- 관리자 PIN 세션과 사용자 Supabase Auth 세션 동시 활성 정책은 아직 미결정. 사용자가 A(동시 허용) 또는 B(상호 배타)를 선택한 뒤 반영한다.

다음 작업자 주의:

- UI 골드 hover 잔재는 Claude 담당이므로 Codex 운영 커밋에서 섞지 않는다.
- `image/landing*.webp` 미추적 파일은 이번 Codex 작업과 무관하므로 건드리지 않았다.

## 2026-05-05 - Codex (협업 문서화)

담당:

- Claude/Codex 협업 문서화

변경 파일:

- `docs/AI_COLLABORATION.md`
- `docs/AI_HANDOFF.md`
- `docs/OPS_RUNBOOK.md`
- `CLAUDE.md`

완료:

- Claude는 UI 중심, Codex는 성능/운영/구축 중심으로 역할을 분리했다.
- 공유 파일과 충돌 방지 규칙을 정리했다.
- 로컬 개발, 환경변수, Vercel/GitHub Actions 점검 명령을 런북으로 정리했다.
- Claude Code가 시작할 때 협업 문서를 보도록 `CLAUDE.md`에 안내를 추가했다.

검증:

- 문서 작업이므로 앱 빌드는 실행하지 않았다.

남은 일:

- 필요하면 `PROGRESS.md` 한글 인코딩 상태 점검
- 운영 환경변수와 Vercel/GitHub 설정 대조
  - Vercel: `SITE_URL` 또는 `NEXT_PUBLIC_SITE_URL`, `ADMIN_PIN`, `ADMIN_SESSION_SECRET`
  - GitHub repository variable: `PRIMER_SITE_URL`
- 옛 골드 잔재(`hover:bg-[#b08a28]`, `hover:text-[#b08a28]`) 27개 파일·50+곳에서 일괄 치환 필요. UI 작업이므로 Claude 담당

## 2026-05-05 - Codex

담당:

- 운영/성능/구축 보완: 도메인 env 중앙화, 관리자 인증 서버 이전, 크레딧 Supabase 이전

변경 파일:

- `src/lib/site-url.ts`
- `src/lib/admin-auth.ts`
- `src/app/api/admin/session/route.ts`
- `src/lib/email.ts`
- `src/app/api/result-files/route.ts`
- `.github/workflows/supabase-keep-alive.yml`
- `src/contexts/AuthContext.tsx`
- `src/components/AdminLoginModal.tsx`
- `src/components/ResultFilesPanel.tsx`
- `src/app/admin/page.tsx`
- `src/app/project/[id]/page.tsx`
- `src/app/ClientLayout.tsx`
- `src/lib/credits.ts`
- `src/app/api/credits/route.ts`
- `src/app/api/credits/use/route.ts`
- `docs/OPS_RUNBOOK.md`
- `docs/AI_HANDOFF.md`

완료:

- `researchon.vercel.app` 호출부를 `getSiteUrl()`/`getSiteHost()` 기반으로 정리했다. 앱 코드는 `SITE_URL`, `NEXT_PUBLIC_SITE_URL`, Vercel URL, 기존 Vercel 도메인 fallback 순서로 사이트 URL을 결정한다.
- GitHub keep-alive workflow는 repository variable `PRIMER_SITE_URL`을 사용하도록 변경했다.
- 관리자 PIN 하드코딩을 제거하고 `/api/admin/session`에서 `ADMIN_PIN`을 검증한 뒤 HttpOnly 쿠키 세션을 발급하도록 변경했다.
- 결과 파일 업로드/삭제 API는 `?pin=` 대신 관리자 세션 쿠키를 확인한다.
- 크레딧 저장소를 `data/credits.json` 파일 쓰기에서 Supabase `credits`, `credit_transactions` 테이블 사용으로 변경했다.
- Next 16/React 19 lint error를 막던 `ClientLayout` route-change effect를 비동기 callback으로 조정했다.

검증:

- `git diff --check` 통과
- `npm run lint` 통과. 기존 warning 82건은 남아 있음.
- `npm run build` 통과

남은 일:

- Vercel 환경변수 설정: `ADMIN_PIN`, `ADMIN_SESSION_SECRET`, `SITE_URL` 또는 `NEXT_PUBLIC_SITE_URL`
- GitHub repository variable 설정: `PRIMER_SITE_URL`
- 골드 hover 잔재 치환은 UI 작업이므로 Claude 담당

다음 작업자 주의:

- 작업 중 `src/app/consultation/page.tsx` 등 여러 UI 파일에 골드 hover 치환 변경이 작업트리에 감지됐다. Codex 담당 변경이 아니므로 이번 운영 커밋에는 포함하지 않는다.
- `src/lib/site-url.ts`의 기존 Vercel 도메인은 env 미설정 시 fallback 용도로만 남아 있다.
