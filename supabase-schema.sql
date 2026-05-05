-- ============================================
-- ResearchOn Supabase Schema
-- ============================================

-- 1. 프로젝트
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  case_count INT DEFAULT 0,
  coded_count INT DEFAULT 0
);

-- 2. 판결문 케이스
CREATE TABLE cases (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  data JSONB DEFAULT '{}'
);

-- 3. 다이어드 (사건별 인시던트)
CREATE TABLE dyads (
  id TEXT PRIMARY KEY,
  case_id TEXT,
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  incidents JSONB DEFAULT '[]',
  event_duration JSONB DEFAULT '[]',
  gap JSONB DEFAULT '[]'
);

-- 4. 서비스 의뢰 (모든 유형 통합)
CREATE TABLE service_requests (
  id TEXT PRIMARY KEY,
  service_type TEXT NOT NULL,
  email TEXT DEFAULT '',
  status TEXT DEFAULT 'pending',
  data JSONB DEFAULT '{}',
  admin_response TEXT DEFAULT '',
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 채팅 메시지
CREATE TABLE chat_messages (
  id TEXT PRIMARY KEY,
  service_type TEXT NOT NULL,
  request_id TEXT NOT NULL,
  sender TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. 문의사항
CREATE TABLE contact_inquiries (
  id TEXT PRIMARY KEY,
  email TEXT DEFAULT '',
  name TEXT DEFAULT '',
  category TEXT DEFAULT '',
  subject TEXT DEFAULT '',
  message TEXT DEFAULT '',
  status TEXT DEFAULT 'pending',
  admin_reply TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  replied_at TIMESTAMPTZ
);

-- 7. 게시판
CREATE TABLE board_posts (
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

CREATE TABLE board_comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES board_posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_email TEXT NOT NULL,
  author_name TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_cases_project ON cases(project_id);
CREATE INDEX idx_dyads_project ON dyads(project_id);
CREATE INDEX idx_dyads_case ON dyads(case_id);
CREATE INDEX idx_service_requests_type ON service_requests(service_type);
CREATE INDEX idx_service_requests_status ON service_requests(status);
CREATE INDEX idx_chat_messages_request ON chat_messages(request_id);
CREATE INDEX idx_chat_messages_type ON chat_messages(service_type);
CREATE INDEX idx_board_posts_category ON board_posts(category);
CREATE INDEX idx_board_posts_created ON board_posts(created_at DESC);
CREATE INDEX idx_board_comments_post ON board_comments(post_id);

-- RLS 비활성화 (서버사이드 전용)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE dyads ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_comments ENABLE ROW LEVEL SECURITY;

-- 모든 테이블에 anon 접근 허용 (서버사이드 API에서만 호출)
CREATE POLICY "Allow all" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON cases FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON dyads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON service_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON chat_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON contact_inquiries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON board_posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON board_comments FOR ALL USING (true) WITH CHECK (true);

-- Optional manual cleanup after confirming production no longer reads credit data:
-- DROP TABLE IF EXISTS credit_transactions;
-- DROP TABLE IF EXISTS credits;
