-- 创建趣味学习引导表
CREATE TABLE IF NOT EXISTS fun_learning_guides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    options JSONB NOT NULL, -- 存储选项，例如 ["A", "B", "C", "D"]
    correct_answer TEXT NOT NULL,
    fun_explanation TEXT NOT NULL, -- 通俗易懂的趣味延伸解释
    related_knowledge_title TEXT, -- 关联知识点标题
    related_knowledge_content TEXT, -- 关联知识点内容
    video_url TEXT, -- 推荐视频 URL
    video_title TEXT, -- 推荐视频标题
    video_cover TEXT, -- 推荐视频封面
    subject TEXT, -- 学科分类
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 添加 RLS 策略
ALTER TABLE fun_learning_guides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "任何人都可以读取趣味学习引导" ON fun_learning_guides
    FOR SELECT TO authenticated USING (true);
