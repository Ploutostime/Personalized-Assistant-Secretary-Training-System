-- 创建秘书对话历史表
CREATE TABLE IF NOT EXISTS secretary_chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_secretary_chat_history_user_id ON secretary_chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_secretary_chat_history_created_at ON secretary_chat_history(created_at DESC);

-- 添加注释
COMMENT ON TABLE secretary_chat_history IS '秘书对话历史记录';
COMMENT ON COLUMN secretary_chat_history.user_id IS '用户ID';
COMMENT ON COLUMN secretary_chat_history.role IS '角色：user/assistant/system';
COMMENT ON COLUMN secretary_chat_history.content IS '对话内容';
COMMENT ON COLUMN secretary_chat_history.created_at IS '创建时间';

-- RLS策略
ALTER TABLE secretary_chat_history ENABLE ROW LEVEL SECURITY;

-- 用户只能查看和插入自己的对话历史
CREATE POLICY "用户可以查看自己的对话历史" ON secretary_chat_history
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "用户可以插入自己的对话历史" ON secretary_chat_history
  FOR INSERT WITH CHECK (user_id = auth.uid());