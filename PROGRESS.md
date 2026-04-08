# ResearchOn 프로젝트 진행상황 (2026-04-08)

## 오늘 완료한 작업

### 1. UI/UX 개선
- (i) 툴팁: 설명만 → 단계별 요청순서 + 지원내용 (10개 서비스 페이지)
- 툴팁 설명을 실제 UI 필드명·순서와 일치하도록 재수정
- 대시보드 통계 카드: 접수/진행/완료 상태별 세분화 (우측 세로 배치)
- 대시보드 데이터 분석 통계 실제 연동 (전처리/계량/텍스트/질적)
- 설문 빌더 하단에 "문항 추가" 버튼 추가
- 랜딩 페이지: 네비 로고 제거(깨짐), 문구 변경, "시작하기"+"로그인" 링크 추가
- 사이드바/모바일 상단바 로고: 깨지는 이미지 → "R" 텍스트 아이콘으로 교체

### 2. Supabase DB 연동 (핵심)
- 파일기반 JSON → Supabase PostgreSQL로 전환
- db.ts 전면 재작성 (모든 CRUD를 Supabase 쿼리로)
- 모든 API 라우트에 await 추가 (34개 파일)
- 통합 테이블: service_requests (9개 서비스), chat_messages, projects, cases, dyads
- **데이터 영구 저장** — 배포해도 유지됨

### 3. 로그인/회원가입 시스템 (Supabase Auth)
- 로그인/회원가입 페이지 생성 (이메일+비밀번호)
- 페이지 접근은 자유, **의뢰 접수 버튼 클릭 시에만** 로그인 체크
- 비로그인 → /login → 로그인 후 원래 페이지로 복귀
- 사이드바에 사용자 이메일 표시 + 로그아웃 버튼
- 의뢰 폼에 로그인 이메일 자동 입력
- service_role 키로 회원가입 시 이메일 인증 자동 확인 (인증 메일 불필요)

---

## 현재 상태 / 남은 작업

### Vercel 환경변수 (필수 — 이미 추가됨)
- `NEXT_PUBLIC_SUPABASE_URL` = https://ozpqlxpiblptcyqaipvd.supabase.co
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (설정 완료)
- `SUPABASE_SERVICE_ROLE_KEY` = (설정 완료 — Redeploy 필요할 수 있음)

### 확인 필요
1. **Vercel Redeploy** 후 회원가입 테스트 (이메일 인증 없이 즉시 로그인되는지)
2. 기존 유저(jskwon@kicj.re.kr)는 Supabase Auth → Users에서 삭제 후 재가입
3. 의뢰 접수 테스트 → Supabase Table Editor에서 service_requests 테이블에 데이터 저장 확인
4. 관리자 패널(/admin)에서 의뢰 관리 확인

### 사이트 URL
- 기존: ipv-coder.vercel.app
- 변경됨: **researchon.vercel.app** (Vercel 도메인 변경 완료)

### 아직 미구현
- 판결문 AI 자동 코딩 (TODO 상태)
- 기초통계/시각화 실제 계산 엔진
- 학술논문/정책문서 템플릿 ("준비 중")
- 커스텀 도메인 (researchon.site $1.99/년 구매 가능)

### Supabase 설정
- 프로젝트: researchon (ozpqlxpiblptcyqaipvd)
- DB 테이블 8개 생성 완료 (projects, cases, dyads, service_requests, chat_messages, credits, credit_transactions, contact_inquiries)
- RLS 정책: Allow all (서버사이드 API 전용)
