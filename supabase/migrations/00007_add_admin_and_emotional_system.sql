-- 1. 为users表添加role字段
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. 扩展secretary_personalities表，添加详细性格配置
ALTER TABLE secretary_personalities 
ADD COLUMN IF NOT EXISTS language_style JSONB DEFAULT '{"formality": 50, "intimacy": 50, "elegance": 50}'::jsonb,
ADD COLUMN IF NOT EXISTS emotional_expression JSONB DEFAULT '{"richness": 50, "empathy": 50}'::jsonb,
ADD COLUMN IF NOT EXISTS communication_style JSONB DEFAULT '{"proactivity": 50, "guidance": 50, "listening": 50}'::jsonb,
ADD COLUMN IF NOT EXISTS voice_characteristics JSONB DEFAULT '{"pitch": "medium", "speed": "normal", "emotion_color": "warm"}'::jsonb,
ADD COLUMN IF NOT EXISTS catchphrases TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS emotion_reactions JSONB DEFAULT '{}'::jsonb;

-- 3. 创建secretary_emotional_states表（情绪状态）
CREATE TABLE IF NOT EXISTS secretary_emotional_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  secretary_type TEXT NOT NULL,
  current_emotion TEXT DEFAULT 'neutral' CHECK (current_emotion IN ('happy', 'sad', 'excited', 'calm', 'worried', 'proud', 'neutral', 'caring', 'playful')),
  emotion_intensity INTEGER DEFAULT 50 CHECK (emotion_intensity >= 0 AND emotion_intensity <= 100),
  context TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_emotional_states_user ON secretary_emotional_states(user_id);
CREATE INDEX IF NOT EXISTS idx_emotional_states_type ON secretary_emotional_states(secretary_type);

-- 4. 创建secretary_memory表（记忆系统）
CREATE TABLE IF NOT EXISTS secretary_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  secretary_type TEXT NOT NULL,
  memory_type TEXT NOT NULL CHECK (memory_type IN ('preference', 'habit', 'goal', 'achievement', 'conversation', 'emotion')),
  memory_key TEXT NOT NULL,
  memory_value TEXT NOT NULL,
  importance INTEGER DEFAULT 50 CHECK (importance >= 0 AND importance <= 100),
  last_accessed TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_memory_user ON secretary_memory(user_id);
CREATE INDEX IF NOT EXISTS idx_memory_type ON secretary_memory(secretary_type);
CREATE INDEX IF NOT EXISTS idx_memory_key ON secretary_memory(memory_key);

-- 5. 更新secretary_avatars表，添加详细性格数据
ALTER TABLE secretary_avatars
ADD COLUMN IF NOT EXISTS personality_description TEXT,
ADD COLUMN IF NOT EXISTS speaking_style TEXT,
ADD COLUMN IF NOT EXISTS emotional_traits JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS interaction_preferences JSONB DEFAULT '{}'::jsonb;

-- 6. 创建RLS策略

-- secretary_emotional_states策略
ALTER TABLE secretary_emotional_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "用户可以查看自己的情绪状态"
  ON secretary_emotional_states FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "用户可以插入自己的情绪状态"
  ON secretary_emotional_states FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以更新自己的情绪状态"
  ON secretary_emotional_states FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "管理员可以查看所有情绪状态"
  ON secretary_emotional_states FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- secretary_memory策略
ALTER TABLE secretary_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "用户可以查看自己的记忆"
  ON secretary_memory FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "用户可以插入自己的记忆"
  ON secretary_memory FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以更新自己的记忆"
  ON secretary_memory FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "用户可以删除自己的记忆"
  ON secretary_memory FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "管理员可以查看所有记忆"
  ON secretary_memory FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- 7. 创建函数：更新情绪状态的updated_at
CREATE OR REPLACE FUNCTION update_emotional_state_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_emotional_state_timestamp
BEFORE UPDATE ON secretary_emotional_states
FOR EACH ROW
EXECUTE FUNCTION update_emotional_state_timestamp();

-- 8. 创建函数：更新记忆的last_accessed
CREATE OR REPLACE FUNCTION update_memory_last_accessed()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_accessed = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_memory_last_accessed
BEFORE UPDATE ON secretary_memory
FOR EACH ROW
EXECUTE FUNCTION update_memory_last_accessed();