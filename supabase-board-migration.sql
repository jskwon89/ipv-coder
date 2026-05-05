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

INSERT INTO board_posts (id, category, title, content, author_email, author_name, view_count, created_at, updated_at)
SELECT seed.id, 'qna', seed.title, seed.content, seed.author_email, '***', 0, seed.created_at, seed.created_at
FROM
(VALUES
  ('seed-qna-1', '설문조사는 했는데 어떤 분석을 해야 할지 모르겠어요.', '논문 설문을 180명 정도 받았고 성별, 학년 같은 기본정보와 만족도, 스트레스, 이용의도 점수가 있습니다. 평균 차이도 보고 싶고 변수끼리 관련이 있는지도 보고 싶은데 어디서부터 정해야 할지 헷갈립니다.', 'masked-qna-1@primer.local', '2026-01-01T00:00:00Z'::timestamptz),
  ('seed-qna-2', '제 연구에는 회귀분석을 쓰면 되는 건가요?', '지도교수님이 회귀분석을 해보라고 하셨는데 제 종속변수는 연구만족도 점수입니다. 독립변수는 참여동기, 사회적 지지, 전공만족도이고 모두 5점 척도라서 회귀분석이 맞는지 궁금합니다.', 'masked-qna-2@primer.local', '2026-01-01T00:01:00Z'::timestamptz),
  ('seed-qna-3', '집단이 세 개 이상이면 t검정을 여러 번 하면 안 되나요?', 'A, B, C 세 프로그램을 들은 집단의 평균 점수를 비교하려고 합니다. A-B, A-C, B-C를 각각 t검정으로 비교하면 될 것 같은데 이렇게 해도 통계적으로 괜찮은지 궁금합니다.', 'masked-qna-3@primer.local', '2026-01-01T00:02:00Z'::timestamptz),
  ('seed-qna-4', '교수님이 통제변수를 넣으라는데 그게 왜 필요한가요?', '교육 프로그램 효과를 보려고 하는데 교수님이 나이와 사전점수를 통제변수로 넣으라고 하셨습니다. 프로그램 효과만 보고 싶은데 다른 변수를 왜 같이 넣어야 하는지 잘 이해가 안 됩니다.', 'masked-qna-4@primer.local', '2026-01-01T00:03:00Z'::timestamptz),
  ('seed-qna-5', 'SPSS로 하면 부족하고 R을 써야 하나요?', '석사논문이고 빈도분석, t검정, 상관분석, 회귀분석 정도를 예상하고 있습니다. 주변에서는 R을 써야 한다고도 하는데 SPSS만으로 진행해도 되는지 궁금합니다.', 'masked-qna-5@primer.local', '2026-01-01T00:04:00Z'::timestamptz),
  ('seed-qna-6', '매개효과를 보라는데 쉽게 말하면 뭔가요?', '논문 모형에서 스트레스가 우울에 영향을 주고 그 사이에 수면의 질이 들어간다고 합니다. 교수님이 매개효과를 보라고 하셨는데 이게 어떤 의미인지 잘 모르겠습니다.', 'masked-qna-6@primer.local', '2026-01-01T00:05:00Z'::timestamptz),
  ('seed-qna-7', '조절효과는 매개효과랑 뭐가 다른가요?', '스트레스가 우울에 영향을 주는데 사회적 지지가 높으면 그 영향이 약해질 것 같다는 가설을 세웠습니다. 이게 매개효과인지 조절효과인지 헷갈립니다.', 'masked-qna-7@primer.local', '2026-01-01T00:06:00Z'::timestamptz),
  ('seed-qna-8', '종속변수가 예/아니오인데 회귀분석을 해도 되나요?', '결과변수가 재구매 여부처럼 예/아니오로 나뉩니다. 독립변수는 만족도 점수와 이용 빈도인데 이런 경우에도 일반 회귀분석을 쓰면 되는지 궁금합니다.', 'masked-qna-8@primer.local', '2026-01-01T00:07:00Z'::timestamptz),
  ('seed-qna-9', '기간이나 재발 시점 같은 자료는 어떻게 분석하나요?', '재발까지 걸린 기간을 분석하려고 합니다. 그런데 연구가 끝날 때까지 재발하지 않은 사람도 있어서 단순히 평균 기간만 비교하면 되는지 모르겠습니다.', 'masked-qna-9@primer.local', '2026-01-01T00:08:00Z'::timestamptz),
  ('seed-qna-10', '응답 패턴으로 사람들을 몇 유형으로 나눌 수 있나요?', '학생들의 학습태도 문항이 여러 개 있는데 응답 패턴이 비슷한 사람들끼리 몇 가지 유형으로 나눠보고 싶습니다. 단순히 점수 평균으로 나누는 것과 다른 방법이 있는지 궁금합니다.', 'masked-qna-10@primer.local', '2026-01-01T00:09:00Z'::timestamptz)
) AS seed(id, title, content, author_email, created_at)
ON CONFLICT (id) DO UPDATE
SET title = EXCLUDED.title,
    content = EXCLUDED.content,
    author_email = EXCLUDED.author_email,
    author_name = EXCLUDED.author_name,
    updated_at = EXCLUDED.updated_at;

WITH primer_author AS (
  SELECT
    'PRIMER'::text AS name,
    ('admin-' || md5(coalesce(nullif(current_setting('app.admin_pin', true), ''), 'primer-admin')) || '@primer.local')::text AS email
)
INSERT INTO board_comments (id, post_id, content, author_email, author_name, created_at)
SELECT seed.id, seed.post_id, seed.content, primer_author.email, primer_author.name, seed.created_at
FROM primer_author,
(VALUES
  ('seed-qna-1-answer', 'seed-qna-1', '먼저 보려는 게 차이인지, 관계인지, 영향인지부터 나누면 됩니다. 집단 간 평균 차이를 보려면 t검정이나 ANOVA, 변수들이 같이 움직이는지 보려면 상관분석, 어떤 변수가 결과에 영향을 주는지 보려면 회귀분석을 많이 씁니다. 질문을 이렇게 나누면 분석 방향이 훨씬 선명해집니다.', '2026-01-01T00:00:30Z'::timestamptz),
  ('seed-qna-2-answer', 'seed-qna-2', '결과로 보고 싶은 변수가 점수나 척도처럼 숫자라면 회귀분석이 잘 맞는 경우가 많습니다. 예를 들어 만족도, 우울 점수, 스트레스 점수처럼 연속형 결과를 설명하고 싶을 때 사용합니다. 다만 결과가 예/아니오처럼 둘로 나뉘면 일반 회귀가 아니라 로지스틱 회귀를 생각해야 합니다.', '2026-01-01T00:01:30Z'::timestamptz),
  ('seed-qna-3-answer', 'seed-qna-3', '가능은 하지만 보통 권장하지 않습니다. t검정을 여러 번 반복하면 우연히 유의하게 나올 가능성이 커집니다. 세 집단 이상의 평균을 비교할 때는 먼저 ANOVA로 전체 차이를 확인하고, 차이가 있다면 사후검정으로 어떤 집단끼리 다른지 살펴보는 방식이 더 안전합니다.', '2026-01-01T00:02:30Z'::timestamptz),
  ('seed-qna-4-answer', 'seed-qna-4', '통제변수는 결과에 영향을 줄 수 있는 다른 요인을 잠시 잡아두는 역할을 합니다. 예를 들어 교육 프로그램 효과를 보는데 나이나 기존 점수가 결과에 영향을 줄 수 있다면, 그 변수들을 함께 넣어야 프로그램 효과를 더 공정하게 볼 수 있습니다. 회귀분석에서 자주 쓰는 방식입니다.', '2026-01-01T00:03:30Z'::timestamptz),
  ('seed-qna-5-answer', 'seed-qna-5', '기본적인 빈도분석, t검정, ANOVA, 상관분석, 회귀분석은 SPSS로도 충분한 경우가 많습니다. 다만 생존분석, 잠재계층분석, 텍스트 분석, 반복적인 그래프 작업처럼 조금 복잡하거나 재현성이 중요한 분석은 R이 더 편할 수 있습니다. 중요한 건 프로그램보다 연구문제에 맞는 분석을 고르는 것입니다.', '2026-01-01T00:04:30Z'::timestamptz),
  ('seed-qna-6-answer', 'seed-qna-6', '매개효과는 왜 그런 결과가 나오는지를 보는 분석입니다. 예를 들어 스트레스가 우울에 영향을 준다고 할 때, 그 사이에 수면의 질이 끼어 있다면 스트레스 → 수면의 질 → 우울이라는 경로를 확인합니다. 즉 X가 Y에 영향을 주는 과정에 M이 설명 역할을 하는지 보는 겁니다.', '2026-01-01T00:05:30Z'::timestamptz),
  ('seed-qna-7-answer', 'seed-qna-7', '조절효과는 언제 또는 누구에게 영향이 더 강한지를 보는 분석입니다. 예를 들어 스트레스가 우울에 영향을 주는데, 사회적 지지가 높은 사람에게서는 그 영향이 약해진다면 사회적 지지가 조절변수입니다. 매개효과가 왜를 설명한다면, 조절효과는 언제 달라지는지를 설명합니다.', '2026-01-01T00:06:30Z'::timestamptz),
  ('seed-qna-8-answer', 'seed-qna-8', '결과가 예/아니오, 발생/미발생, 합격/불합격처럼 둘로 나뉘면 일반 선형회귀보다 로지스틱 회귀분석을 사용합니다. 결과는 보통 오즈비로 해석합니다. 오즈비가 1보다 크면 발생 가능성이 높아지는 방향, 1보다 작으면 낮아지는 방향으로 이해할 수 있습니다.', '2026-01-01T00:07:30Z'::timestamptz),
  ('seed-qna-9-answer', 'seed-qna-9', '사건이 일어나기까지의 시간을 보는 자료라면 생존분석을 생각합니다. 예를 들어 재발까지 걸린 시간, 이직까지 걸린 시간, 재범까지의 기간처럼 아직 사건이 발생하지 않은 사람도 함께 다뤄야 할 때 유용합니다. Kaplan-Meier나 Cox 비례위험모형을 많이 사용합니다.', '2026-01-01T00:08:30Z'::timestamptz),
  ('seed-qna-10-answer', 'seed-qna-10', '가능합니다. 여러 문항의 응답 패턴을 바탕으로 비슷한 사람들끼리 숨은 집단을 찾고 싶다면 잠재계층분석, 즉 LCA를 사용할 수 있습니다. 시간이 지나면서 유형이 어떻게 바뀌는지까지 보고 싶다면 잠재전이분석, LTA를 고려합니다.', '2026-01-01T00:09:30Z'::timestamptz)
) AS seed(id, post_id, content, created_at)
ON CONFLICT (id) DO UPDATE
SET post_id = EXCLUDED.post_id,
    content = EXCLUDED.content,
    author_email = EXCLUDED.author_email,
    author_name = EXCLUDED.author_name,
    created_at = EXCLUDED.created_at;

UPDATE service_requests
SET status = 'completed',
    responded_at = COALESCE(responded_at, NOW())
WHERE (status <> 'completed' OR responded_at IS NULL)
  AND jsonb_typeof(data -> 'result_files') = 'array'
  AND jsonb_array_length(data -> 'result_files') > 0;
