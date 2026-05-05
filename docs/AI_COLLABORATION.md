# AI Collaboration Guide

이 레포는 Claude Code와 Codex가 같은 코드베이스에서 함께 작업한다. 실시간 대화 대신 문서 기반 인수인계로 충돌을 줄인다.

## 짧은 답: 백엔드/프론트엔드인가?

일부는 맞지만 완전히 같지는 않다.

- Claude 담당 영역은 주로 프론트엔드 중에서도 UI/UX, 시각 디자인, 레이아웃, 카피, 반응형 경험이다.
- Codex 담당 영역은 백엔드뿐 아니라 성능, Next.js 구조, Vercel 배포, Supabase 연동, API, 빌드/린트, 운영 안정성까지 포함한다.
- 따라서 이 레포에서는 "Claude = UI", "Codex = 운영/성능/구축"으로 부르는 것이 더 정확하다.

## 담당 원칙

Claude Code는 사용자가 보는 화면의 느낌과 사용성을 우선 담당한다.

Codex는 앱이 실제로 잘 돌아가고 배포되며, 느려지거나 깨지지 않게 만드는 영역을 우선 담당한다.

공유 영역은 작업 전후에 `docs/AI_HANDOFF.md`에 기록한다. 같은 파일을 동시에 만질 가능성이 있으면 먼저 인수인계 문서에 표시한다.

## Claude Code 담당

- 랜딩 페이지, 대시보드, 서비스 신청 페이지, 결과 페이지의 UI 개선
- `src/app/**/page.tsx` 안의 화면 구성, 문구, 카드, 폼 배치, 반응형 조정
- `src/components/**` 중 순수 UI 컴포넌트의 스타일과 사용성 개선
- `src/app/globals.css`의 색상, 여백, 타이포그래피, 공통 시각 톤
  - 단, color tokens(`--primary`, `--color-*` 등 CSS 변수)는 `bg-primary`/`text-primary` 클래스로 27개 파일에 퍼져 있어 사이트 전역에 영향을 준다. 토큰 값 변경은 양쪽 합의 후 진행한다.
- `public/images/**`, `public/logo*`, `process/**` 등 화면 자산 교체와 배치
- 사용자 흐름의 문구 정리: 버튼명, 설명문, FAQ, 안내 카피

Claude가 특히 조심할 영역:

- API 응답 형식, DB 필드명, 환경변수 이름을 임의 변경하지 않는다.
- 서버 로직, Supabase service role, 견적/결제/파일 다운로드 흐름은 Codex에게 넘긴다.
- 큰 레이아웃 변경이 라우팅, 인증, 데이터 fetch 방식에 영향을 주면 `docs/AI_HANDOFF.md`에 남긴다.

## Codex 담당

- Next.js App Router 구조, Server/Client Component 경계, 빌드 호환성
- `src/app/api/**/route.ts` API 라우트와 요청/응답 계약
- Supabase 연동: `src/lib/supabase*.ts`, `src/lib/db.ts`, `supabase-schema.sql`
- Vercel 배포, GitHub Actions, keep-alive, 환경변수, 운영 점검
- 성능 개선: 이미지 최적화, 캐싱, bundle 크기, 중복 fetch, 서버/클라이언트 분리
- 파일 업로드/다운로드, Excel/PDF/ZIP 처리, 이메일/Discord 알림
- `npm run lint`, `npm run build`, 타입/런타임 오류 수정

Codex가 특히 조심할 영역:

- UI의 시각 방향을 크게 바꾸지 않는다. 필요하면 Claude에게 넘긴다.
- 기존 한글 카피의 톤을 대량 변경하지 않는다.
- PRIMER 브랜드 색/이미지/레이아웃 변경은 UI 작업으로 분류한다.

## 공유 파일

다음 파일은 양쪽이 모두 만질 가능성이 높다. 작업 전후 기록이 필요하다.

- `src/app/page.tsx`
- `src/app/dashboard/page.tsx`
- `src/app/ClientLayout.tsx`
- `src/app/globals.css`
- `src/components/**`
- `src/app/admin/page.tsx`
- `src/app/project/[id]/page.tsx`
- `src/app/*-results/page.tsx`
- `package.json`
- `next.config.ts`
- `supabase-schema.sql`

## 작업 시작 체크리스트

1. `git status --short`로 다른 에이전트나 사용자의 변경이 있는지 확인한다.
2. `docs/AI_HANDOFF.md`의 "현재 작업 잠금"과 "최근 변경"을 읽는다.
3. Next.js 코드를 수정할 때는 `AGENTS.md` 지시에 따라 현재 설치된 Next 문서를 먼저 확인한다.
4. 담당 범위를 벗어난 작업은 직접 대량 수정하지 말고 인수인계 문서에 요청으로 남긴다.

## 작업 종료 체크리스트

1. 변경 파일과 의도를 `docs/AI_HANDOFF.md`에 기록한다.
2. 가능한 경우 `npm run lint`와 `npm run build` 중 관련 검증을 실행한다.
3. 검증을 못 했으면 이유를 적는다.
4. 다음 작업자가 조심해야 할 파일이나 미완료 항목을 남긴다.

## 충돌을 줄이는 규칙

- 한 번에 한 에이전트가 하나의 주요 영역을 맡는다.
- UI 리팩터링과 API 리팩터링을 같은 파일에서 동시에 진행하지 않는다.
- 공통 컴포넌트의 props를 바꿀 때는 영향을 받는 페이지 목록을 남긴다.
- 환경변수, DB schema, API 응답 형태는 변경 전후를 문서화한다.
- 빌드가 깨진 상태로 넘길 때는 깨진 이유와 재현 명령을 적는다.
