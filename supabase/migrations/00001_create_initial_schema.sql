-- 创建用户角色枚举
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- 创建事务类型枚举
CREATE TYPE task_type AS ENUM ('competition', 'homework', 'exam', 'study', 'other');

-- 创建事务优先级枚举
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');

-- 创建事务状态枚举
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');

-- 创建用户配置表
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  email TEXT,
  role user_role NOT NULL DEFAULT 'user'::user_role,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建学生事务表
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  task_type task_type NOT NULL DEFAULT 'other'::task_type,
  priority priority_level NOT NULL DEFAULT 'medium'::priority_level,
  status task_status NOT NULL DEFAULT 'pending'::task_status,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  deadline TIMESTAMPTZ,
  estimated_hours NUMERIC(5,2),
  actual_hours NUMERIC(5,2),
  reminder_enabled BOOLEAN DEFAULT true,
  reminder_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建知识点收藏表
CREATE TABLE knowledge_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  subject TEXT,
  tags TEXT[],
  source_url TEXT,
  review_count INTEGER DEFAULT 0,
  last_reviewed_at TIMESTAMPTZ,
  next_review_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建学习时间记录表
CREATE TABLE study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  subject TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  duration_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建时间表配置表
CREATE TABLE schedule_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  daily_study_goal_hours NUMERIC(4,2) DEFAULT 8.0,
  preferred_start_time TIME DEFAULT '08:00:00',
  preferred_end_time TIME DEFAULT '22:00:00',
  break_duration_minutes INTEGER DEFAULT 15,
  auto_schedule_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 创建索引
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_deadline ON tasks(deadline);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_knowledge_items_user_id ON knowledge_items(user_id);
CREATE INDEX idx_knowledge_items_next_review ON knowledge_items(next_review_at);
CREATE INDEX idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX idx_study_sessions_start_time ON study_sessions(start_time);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为需要的表添加更新时间触发器
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_items_updated_at BEFORE UPDATE ON knowledge_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedule_settings_updated_at BEFORE UPDATE ON schedule_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 创建用户同步触发器函数
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count INT;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  
  -- 从 email 中提取用户名（去掉 @miaoda.com）
  INSERT INTO profiles (id, username, email, role)
  VALUES (
    NEW.id,
    REPLACE(NEW.email, '@miaoda.com', ''),
    NEW.email,
    CASE WHEN user_count = 0 THEN 'admin'::user_role ELSE 'user'::user_role END
  );
  
  -- 为新用户创建默认时间表设置
  INSERT INTO schedule_settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

-- 创建用户确认触发器
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- 启用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_settings ENABLE ROW LEVEL SECURITY;

-- 创建管理员检查函数
CREATE OR REPLACE FUNCTION is_admin(uid UUID)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- Profiles 表的 RLS 策略
CREATE POLICY "管理员可以查看所有用户信息" ON profiles
  FOR SELECT TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "用户可以查看自己的信息" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "用户可以更新自己的信息" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

CREATE POLICY "管理员可以更新所有用户信息" ON profiles
  FOR UPDATE TO authenticated USING (is_admin(auth.uid()));

-- Tasks 表的 RLS 策略
CREATE POLICY "用户可以查看自己的事务" ON tasks
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "用户可以创建自己的事务" ON tasks
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "用户可以更新自己的事务" ON tasks
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

CREATE POLICY "用户可以删除自己的事务" ON tasks
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Knowledge Items 表的 RLS 策略
CREATE POLICY "用户可以查看自己的知识点" ON knowledge_items
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "用户可以创建自己的知识点" ON knowledge_items
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "用户可以更新自己的知识点" ON knowledge_items
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

CREATE POLICY "用户可以删除自己的知识点" ON knowledge_items
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Study Sessions 表的 RLS 策略
CREATE POLICY "用户可以查看自己的学习记录" ON study_sessions
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "用户可以创建自己的学习记录" ON study_sessions
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "用户可以更新自己的学习记录" ON study_sessions
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

CREATE POLICY "用户可以删除自己的学习记录" ON study_sessions
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Schedule Settings 表的 RLS 策略
CREATE POLICY "用户可以查看自己的时间表设置" ON schedule_settings
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "用户可以更新自己的时间表设置" ON schedule_settings
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- 创建公共视图
CREATE VIEW public_profiles AS
  SELECT id, username, role, avatar_url FROM profiles;