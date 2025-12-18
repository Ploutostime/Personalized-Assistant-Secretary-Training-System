-- 扩展用户配置表，添加专业相关字段
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS major TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS grade TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS interests TEXT[];

-- 创建专业标签表
CREATE TABLE IF NOT EXISTS major_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建视频推荐表
CREATE TABLE IF NOT EXISTS video_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL,
  video_title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  video_cover TEXT,
  author TEXT,
  duration INTEGER,
  view_count INTEGER,
  tags TEXT[],
  description TEXT,
  recommended_reason TEXT,
  is_watched BOOLEAN DEFAULT false,
  is_favorited BOOLEAN DEFAULT false,
  watch_progress INTEGER DEFAULT 0,
  watched_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建视频观看历史表
CREATE TABLE IF NOT EXISTS video_watch_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL,
  video_title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  watch_duration INTEGER,
  watch_progress INTEGER,
  completed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建用户专业偏好表
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  preferred_tags TEXT[],
  excluded_tags TEXT[],
  preferred_duration_min INTEGER,
  preferred_duration_max INTEGER,
  auto_recommend BOOLEAN DEFAULT true,
  daily_recommendation_count INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_video_recommendations_user_id ON video_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_video_recommendations_video_id ON video_recommendations(video_id);
CREATE INDEX IF NOT EXISTS idx_video_recommendations_is_favorited ON video_recommendations(is_favorited);
CREATE INDEX IF NOT EXISTS idx_video_watch_history_user_id ON video_watch_history(user_id);
CREATE INDEX IF NOT EXISTS idx_video_watch_history_video_id ON video_watch_history(video_id);

-- 添加更新时间触发器
CREATE TRIGGER update_video_recommendations_updated_at BEFORE UPDATE ON video_recommendations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_video_watch_history_updated_at BEFORE UPDATE ON video_watch_history
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 为新用户创建默认偏好设置
CREATE OR REPLACE FUNCTION create_default_user_preferences()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created_preferences
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_default_user_preferences();

-- 启用 RLS
ALTER TABLE major_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_watch_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Major Tags 表的 RLS 策略（所有人可读）
CREATE POLICY "所有人可以查看专业标签" ON major_tags
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "管理员可以管理专业标签" ON major_tags
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Video Recommendations 表的 RLS 策略
CREATE POLICY "用户可以查看自己的视频推荐" ON video_recommendations
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "用户可以创建自己的视频推荐" ON video_recommendations
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "用户可以更新自己的视频推荐" ON video_recommendations
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

CREATE POLICY "用户可以删除自己的视频推荐" ON video_recommendations
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Video Watch History 表的 RLS 策略
CREATE POLICY "用户可以查看自己的观看历史" ON video_watch_history
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "用户可以创建自己的观看历史" ON video_watch_history
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "用户可以更新自己的观看历史" ON video_watch_history
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

CREATE POLICY "用户可以删除自己的观看历史" ON video_watch_history
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- User Preferences 表的 RLS 策略
CREATE POLICY "用户可以查看自己的偏好设置" ON user_preferences
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "用户可以更新自己的偏好设置" ON user_preferences
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- 插入一些常见的专业标签
INSERT INTO major_tags (name, category, description) VALUES
  ('计算机科学', '工科', '计算机科学与技术相关专业'),
  ('软件工程', '工科', '软件开发与工程管理'),
  ('人工智能', '工科', '机器学习、深度学习等AI技术'),
  ('数据科学', '工科', '数据分析、大数据技术'),
  ('网络安全', '工科', '信息安全、网络安全技术'),
  ('电子工程', '工科', '电子信息工程相关'),
  ('机械工程', '工科', '机械设计与制造'),
  ('土木工程', '工科', '建筑与土木工程'),
  ('数学', '理科', '数学与应用数学'),
  ('物理学', '理科', '物理学及应用'),
  ('化学', '理科', '化学及化工'),
  ('生物学', '理科', '生物科学与技术'),
  ('经济学', '经管', '经济学理论与应用'),
  ('金融学', '经管', '金融与投资'),
  ('管理学', '经管', '企业管理、公共管理'),
  ('会计学', '经管', '会计与财务管理'),
  ('法学', '文科', '法律相关专业'),
  ('英语', '文科', '英语语言文学'),
  ('汉语言文学', '文科', '中文及文学'),
  ('新闻传播', '文科', '新闻学、传播学'),
  ('历史学', '文科', '历史研究'),
  ('哲学', '文科', '哲学理论'),
  ('医学', '医学', '临床医学'),
  ('护理学', '医学', '护理专业'),
  ('药学', '医学', '药学与制药工程'),
  ('艺术设计', '艺术', '视觉传达、产品设计'),
  ('音乐', '艺术', '音乐表演与理论'),
  ('美术', '艺术', '绘画、雕塑等'),
  ('教育学', '教育', '教育理论与实践'),
  ('心理学', '教育', '心理学研究与应用')
ON CONFLICT (name) DO NOTHING;