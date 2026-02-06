-- 创业赛道表
CREATE TABLE IF NOT EXISTS startup_sectors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    market_trend TEXT, -- 市场趋势描述
    difficulty_level TEXT, -- 难度等级：简单、中等、困难
    potential_value TEXT, -- 潜力估值描述
    icon_name TEXT, -- 图标名称
    tags TEXT[], -- 标签
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创业知识体系图谱表
CREATE TABLE IF NOT EXISTS startup_knowledge_maps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sector_id UUID REFERENCES startup_sectors(id) ON DELETE CASCADE,
    stage_name TEXT NOT NULL, -- 阶段名称：如 基础准备、核心技能、商业实战
    knowledge_nodes JSONB NOT NULL, -- 存储具体知识点，例如 [{"title": "Python", "desc": "基础开发语言", "importance": 5}]
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 添加 RLS 策略
ALTER TABLE startup_sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE startup_knowledge_maps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "任何人都可以读取创业赛道" ON startup_sectors FOR SELECT TO authenticated USING (true);
CREATE POLICY "任何人都可以读取创业知识图谱" ON startup_knowledge_maps FOR SELECT TO authenticated USING (true);
