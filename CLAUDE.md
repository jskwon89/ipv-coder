@AGENTS.md

# 작업 규칙

- 코드 변경 작업이 끝나면 반드시 git add → commit → push origin main까지 완료할 것
- 사용자가 별도로 push를 요청하지 않아도 항상 자동으로 수행
- PROGRESS.md 등 문서 변경도 동일하게 commit + push
- 단, 공유 파일(`docs/AI_COLLABORATION.md` 공유 파일 목록 참조)이나 Codex 담당 영역에 영향을 주는 변경은 commit 전에 `docs/AI_HANDOFF.md`에 인수인계를 먼저 기록한다

# Claude Code 담당 범위

- Claude Code는 이 레포에서 UI/UX, 레이아웃, 반응형, 카피, 이미지/브랜드 표현을 주 담당으로 한다.
- 운영, 성능, Next.js 구조, Vercel 배포, Supabase/API/DB, 파일 처리, 빌드 오류는 Codex 담당으로 넘긴다.
- 작업 전 `docs/AI_COLLABORATION.md`와 `docs/AI_HANDOFF.md`를 먼저 확인한다.
- 공유 파일을 수정했거나 Codex가 알아야 할 변경이 있으면 `docs/AI_HANDOFF.md`에 남긴다.
