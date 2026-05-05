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

## 2026-05-05 - Codex

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

- 실제 코드 작업 전 Next 16.2.2 문서 확인
- 필요하면 `PROGRESS.md` 한글 인코딩 상태 점검
- 운영 환경변수와 Vercel 프로젝트 설정 대조
- 도메인 하드코딩 정리: `https://researchon.vercel.app` 가 아래 4곳에 박혀 있음. `process.env.NEXT_PUBLIC_SITE_URL` 등으로 빼야 커스텀 도메인 전환 시 한 곳에서 관리 가능
  - `src/lib/email.ts` (3곳: 접수/결과 등록/메시지 본문)
  - `src/app/api/result-files/route.ts` (1곳: 결과 파일 등록 알림 본문)
  - `.github/workflows/supabase-keep-alive.yml` (keep-alive 호출 URL)
- 옛 골드 잔재(`hover:bg-[#b08a28]`, `hover:text-[#b08a28]`) 27개 파일·50+곳에서 일괄 치환 필요. UI 작업이므로 Claude 담당
- 관리자 PIN(`4178`) 클라이언트 노출: `src/contexts/AuthContext.tsx:17`(`"use client"` 컴포넌트), `src/app/api/result-files/route.ts:10`. 서버 세션/쿠키 또는 서버 전용 env로 이전 필요
- 크레딧 시스템(`src/lib/credits.ts`)이 `fs.writeFileSync`로 동작 — Vercel 서버리스에서 휘발. 사용 안 할 거면 `/credits` 메뉴/페이지 제거, 사용할 거면 Supabase로 이전

다음 작업자 주의:

- `CLAUDE.md`에는 기존에 자동 commit/push 규칙이 있다. 사용자 의도와 실제 브랜치 전략이 다르면 먼저 확인한다.

