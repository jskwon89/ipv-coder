# ResearchOn 프로젝트 진행상황

## 2026-04-09 작업 내용

### 완료된 작업

**로그인/UI 개선**
- 로그아웃 시 로그인 버튼 사라지는 버그 수정
- 로그인/사용자 정보를 대시보드 "환영합니다" 우측으로 이동
- 로그인 버튼 가시성 개선 (골드 배경 + 흰색 텍스트)

**AI 용어 전면 제거**
- "AI 기반", "AI 코딩", "AI 분석" → "전문가 기반" 서비스로 문구 통일
- 랜딩, 대시보드, 판결문, FAQ, 크레딧, 기초통계 등 8개 파일 수정

**랜딩페이지 강점 섹션 추가**
- "왜 ResearchOn인가요?" 섹션 (서비스/이용절차 사이)
- 합리적인 가격 / 검증된 품질 / 수정보완 보장 / 1:1 맞춤 소통 / 데이터 보안 / 빠른 처리

**연구 설계 폼 개선**
- 연구 유형 체크박스 추가 (학술논문 국내/국외, 학위논문 석사/박사, 연구보고서, 기타)

**파일 업로드 시스템 전면 개편**
- 모든 파싱/분류 로직 제거 (IPV 분류, PDF 텍스트 추출 등)
- Supabase Storage로 파일 저장 (Vercel 서버리스 호환)
- 원래 파일명은 file_uploads 테이블에 기록
- 모든 파일 형식 업로드 가능 (PDF, HWP, Excel, ZIP 등 제한 없음)

**프로젝트 페이지 전면 간소화**
- 사건 테이블 (번호/법원/사건번호/상태/전문확인) 제거
- 불필요한 버튼 제거 (전문 일괄확인, AI 코딩, 통계, Excel 내보내기)
- 드래그앤드롭 업로드 + 파일 목록 + 의뢰하기를 하나의 화면으로 통합

**드래그앤드롭 파일 첨부 추가 (3개 페이지)**
- 데이터 전처리 의뢰 (Excel, CSV, SPSS, Stata, R 파일)
- 질적분석 의뢰 (녹취록, 문서, 텍스트 파일)
- 계량분석 의뢰 (Excel, CSV, SPSS, Stata, R 파일)

**대시보드 통계 카드 개선**
- 접수/진행/완료 숫자 클릭 시 해당 상태의 결과 페이지로 바로 이동

**Supabase 테이블 추가**
- file_uploads 테이블 생성 (project_id, original_name, storage_path, size, content_type)
- Supabase Storage: uploads 버킷 사용

**SSH 원격 접속 환경 구성**
- Windows OpenSSH Server 설치, sshuser 계정 생성
- Termius 모바일 앱으로 PC 접속 성공
- claude.ai/code 웹앱으로 모바일 작업 가능 확인

---

## 내일 할 일 (2026-04-10)

### 1. 관리자 알림 시스템 (우선)
- 의뢰 접수 → Supabase DB에 저장 (프로젝트 의뢰 API 실제 연동)
- /admin 페이지에서 새 의뢰 목록 확인 가능하게
- Discord 웹훅으로 의뢰 접수 시 모바일 알림

### 2. 의뢰 흐름 완성
- 프로젝트 "의뢰하기" 버튼 → DB 저장 + Discord 알림
- 관리자가 의뢰 확인 → 상태 변경 (접수→진행→완료)
- 각 의뢰 페이지 파일 첨부 → Supabase Storage 실제 연동 (현재 UI만 있음)

### 3. 기타 검토
- 기초통계 페이지 크레딧 결제 흐름 (나중에)
- 커스텀 도메인 설정

---

## 2026-04-08 작업 내용

### 완료된 작업
- 툴팁 개선 (10개 서비스 페이지)
- Supabase DB 연동 (파일기반 JSON → PostgreSQL 전환)
- 로그인/회원가입 시스템 구현 (Supabase Auth)
- 대시보드 통계 카드 세분화 (접수/진행/완료)
- 랜딩 페이지 문구/로고 수정

### Supabase 설정
- 프로젝트: researchon (ozpqlxpiblptcyqaipvd)
- DB 테이블 9개 (projects, cases, dyads, service_requests, chat_messages, credits, credit_transactions, contact_inquiries, file_uploads)
- Storage: uploads 버킷
- RLS 정책: Allow all (서버사이드 API 전용)

### 사이트 URL
- researchon.vercel.app

### Vercel 환경변수
- NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY (설정 완료)
