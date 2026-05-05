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
  ('seed-qna-1', '통계분석 전에 연구설계를 왜 먼저 확인해야 하나요?', '통계분석은 연구문제, 가설, 변수의 측정수준, 표본구조가 맞아야 의미 있게 해석됩니다. 설계 단계에서 종속변수와 독립변수, 통제변수, 매개·조절변수, 반복측정 여부를 먼저 정리하면 나중에 분석 방법을 훨씬 정확하게 선택할 수 있습니다.', '2026-01-01T00:00:00Z'::timestamptz),
  ('seed-qna-2', '연구문제에 맞는 분석 방법은 어떻게 고르나요?', '핵심은 종속변수의 형태와 비교하려는 관계입니다. 평균 차이를 보려면 t검정이나 ANOVA, 변수 간 선형 관계를 보려면 상관·회귀분석, 이분형 결과를 예측하려면 로지스틱 회귀분석, 시간-사건 자료를 다루면 생존분석을 고려합니다.', '2026-01-01T00:01:00Z'::timestamptz),
  ('seed-qna-3', '어떤 통계분석이 자주 사용되나요?', '기초 분석으로는 빈도분석, 기술통계, 신뢰도분석, t검정, ANOVA, 상관분석, 회귀분석이 자주 쓰입니다. 고급 분석으로는 매개효과, 조절효과, 조절된 매개효과, 로지스틱 회귀, 생존분석, 다층모형, 잠재계층분석, 구조방정식, 텍스트 마이닝이 있습니다.', '2026-01-01T00:02:00Z'::timestamptz),
  ('seed-qna-4', '데이터 수집 전에는 어떤 통계 요소를 정해야 하나요?', '데이터 수집 전에는 주요 변수의 조작적 정의, 척도 구성, 표본 수, 결측 처리 계획, 통제변수, 분석 단위를 정해야 합니다. 특히 가설이 매개효과나 조절효과를 포함한다면 측정 시점과 변수 순서를 설계 단계에서 분명히 해야 합니다.', '2026-01-01T00:03:00Z'::timestamptz),
  ('seed-qna-5', 'SPSS, R, Stata, Mplus, AMOS는 각각 언제 쓰나요?', 'SPSS는 기초 통계와 회귀분석을 빠르게 확인할 때 편하고, R은 생존분석·LCA·텍스트 분석처럼 확장성이 필요한 분석에 좋습니다. Stata는 패널·생존·사회과학 계량분석에 강하고, Mplus는 잠재변수·혼합모형, AMOS는 구조방정식 경로모형을 시각적으로 다룰 때 자주 사용됩니다.', '2026-01-01T00:04:00Z'::timestamptz),
  ('seed-qna-6', 't검정, ANOVA, 회귀분석은 어떻게 구분하나요?', 't검정은 두 집단의 평균 차이를, ANOVA는 세 집단 이상 또는 여러 요인의 평균 차이를 검정합니다. 회귀분석은 독립변수가 종속변수를 얼마나 설명하거나 예측하는지 확인할 때 사용합니다. 집단 차이가 관심이면 t검정·ANOVA, 변수 간 영향 관계가 관심이면 회귀분석이 기본 출발점입니다.', '2026-01-01T00:05:00Z'::timestamptz),
  ('seed-qna-7', '매개효과와 조절효과의 차이는 무엇인가요?', '매개효과는 X가 Y에 영향을 미치는 과정에 M이 개입하는 구조입니다. 즉 X → M → Y처럼 왜 영향을 미치는지를 설명합니다. 조절효과는 X가 Y에 미치는 영향의 크기나 방향이 W에 따라 달라지는 구조입니다. 즉 언제 또는 누구에게 영향이 강해지는지를 설명합니다.', '2026-01-01T00:06:00Z'::timestamptz),
  ('seed-qna-8', '로지스틱 회귀분석은 언제 사용하나요?', '종속변수가 예/아니오, 발생/미발생, 재범/비재범처럼 범주형일 때 로지스틱 회귀분석을 사용합니다. 결과는 보통 오즈비(odds ratio)로 해석하며, 독립변수가 결과 발생 가능성을 얼마나 높이거나 낮추는지 설명할 수 있습니다.', '2026-01-01T00:07:00Z'::timestamptz),
  ('seed-qna-9', '생존분석은 어떤 자료에 적합한가요?', '생존분석은 사건이 발생하기까지의 시간을 다루는 자료에 적합합니다. 예를 들어 재발까지의 기간, 이직까지의 기간, 재범까지의 기간처럼 관찰 종료 시점까지 사건이 발생하지 않은 사례가 포함될 수 있을 때 Kaplan-Meier, Cox 비례위험모형, PWP 모형 등을 고려합니다.', '2026-01-01T00:08:00Z'::timestamptz),
  ('seed-qna-10', '다층모형, LCA, SEM은 각각 어떤 질문에 답하나요?', '다층모형은 학생-학교, 개인-지역처럼 자료가 위계적으로 묶여 있을 때 사용합니다. LCA는 관찰된 응답 패턴을 바탕으로 숨은 집단을 찾을 때 사용합니다. SEM은 잠재변수와 여러 경로를 동시에 검정하여 측정모형과 구조모형을 함께 다룰 때 적합합니다.', '2026-01-01T00:09:00Z'::timestamptz)
) AS seed(id, title, content, created_at)
ON CONFLICT (id) DO UPDATE
SET title = EXCLUDED.title,
    content = EXCLUDED.content,
    author_email = EXCLUDED.author_email,
    author_name = EXCLUDED.author_name,
    updated_at = EXCLUDED.updated_at;

UPDATE service_requests
SET status = 'completed',
    responded_at = COALESCE(responded_at, NOW())
WHERE (status <> 'completed' OR responded_at IS NULL)
  AND jsonb_typeof(data -> 'result_files') = 'array'
  AND jsonb_array_length(data -> 'result_files') > 0;
