-- Board tables, Q&A seed data, and result-file completion backfill.
-- Optional before running seed:
-- select set_config('app.admin_pin', '<ADMIN_PIN>', false);

CREATE TABLE IF NOT EXISTS board_posts (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('free', 'qna')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_email TEXT NOT NULL,
  author_name TEXT DEFAULT '',
  view_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS board_comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES board_posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_email TEXT NOT NULL,
  author_name TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_board_posts_category ON board_posts(category);
CREATE INDEX IF NOT EXISTS idx_board_posts_created ON board_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_board_comments_post ON board_comments(post_id);

ALTER TABLE board_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_comments ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'board_posts' AND policyname = 'Allow all'
  ) THEN
    CREATE POLICY "Allow all" ON board_posts FOR ALL USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'board_comments' AND policyname = 'Allow all'
  ) THEN
    CREATE POLICY "Allow all" ON board_comments FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

WITH admin_author AS (
  SELECT
    '관리자'::text AS name,
    ('admin-' || md5(coalesce(nullif(current_setting('app.admin_pin', true), ''), 'primer-admin')) || '@primer.local')::text AS email
)
INSERT INTO board_posts (id, category, title, content, author_email, author_name, view_count, created_at, updated_at)
SELECT seed.id, 'qna', seed.title, seed.content, admin_author.email, admin_author.name, 0, seed.created_at, seed.created_at
FROM admin_author,
(VALUES
  ('seed-qna-1', 'PRIMER는 누가 이용할 수 있나요?', '학부생, 대학원생, 연구자, 실무자 등 연구와 데이터 분석이 필요한 분이라면 이용할 수 있습니다. 원하는 서비스에 의뢰를 남기면 작업 범위와 일정을 안내드립니다.', '2026-01-01T00:00:00Z'::timestamptz),
  ('seed-qna-2', '비용은 어떻게 책정되나요?', '서비스 종류, 자료의 양, 작업 범위에 따라 비용이 달라집니다. 견적 단계에서 비용을 안내하며, 견적 확인 전에는 비용이 발생하지 않습니다.', '2026-01-01T00:01:00Z'::timestamptz),
  ('seed-qna-3', '작업 기간은 보통 얼마나 걸리나요?', '단순 분석은 며칠 내로 가능하지만, 종합 연구 지원은 1~3주 이상 걸릴 수 있습니다. 자료 분량과 작업 복잡도에 따라 예상 일정을 함께 안내드립니다.', '2026-01-01T00:02:00Z'::timestamptz),
  ('seed-qna-4', '어떤 통계 프로그램을 사용하나요?', 'SPSS, Stata, R, Mplus, AMOS 등 분석 목적과 연구자가 선호하는 환경에 맞춰 선택합니다. 결과표, 그래프, 해석을 함께 제공합니다.', '2026-01-01T00:03:00Z'::timestamptz),
  ('seed-qna-5', '결과를 받은 뒤 수정 요청이 가능한가요?', '네. 작업 결과에 대한 추가 질문이나 보완 요청은 내 의뢰 상세 페이지의 채팅으로 전달할 수 있습니다.', '2026-01-01T00:04:00Z'::timestamptz),
  ('seed-qna-6', '제공한 자료의 보안은 어떻게 관리되나요?', '자료는 의뢰 처리 목적으로만 사용하며, 접근 권한을 제한합니다. 필요 시 작업 종료 후 자료 삭제 요청도 가능합니다.', '2026-01-01T00:05:00Z'::timestamptz),
  ('seed-qna-7', '결과물은 어떤 형식으로 받나요?', '작업 성격에 따라 Word, PDF, Excel, 분석 코드, 통계 출력 파일 등으로 제공합니다. 학위논문이나 학술논문 형식에 맞춘 정리도 가능합니다.', '2026-01-01T00:06:00Z'::timestamptz),
  ('seed-qna-8', '결과 파일은 어디에서 받을 수 있나요?', '로그인 후 내 의뢰 메뉴에서 해당 의뢰를 열면 결과 파일을 다운로드할 수 있습니다. 결과가 등록되면 이메일 알림도 발송됩니다.', '2026-01-01T00:07:00Z'::timestamptz)
) AS seed(id, title, content, created_at)
ON CONFLICT (id) DO NOTHING;

UPDATE service_requests
SET status = 'completed',
    responded_at = COALESCE(responded_at, NOW())
WHERE (status <> 'completed' OR responded_at IS NULL)
  AND jsonb_typeof(data -> 'result_files') = 'array'
  AND jsonb_array_length(data -> 'result_files') > 0;
