-- 秘书形象库表
CREATE TABLE IF NOT EXISTS secretary_avatars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- 形象名称
  type TEXT NOT NULL, -- 形象类型：loli(萝莉), oneesan(御姐), uncle(大叔), boss(霸总), senior_sister(学姐), senior_brother(学长)
  description TEXT, -- 形象描述
  avatar_url TEXT, -- 形象图片URL
  voice_type TEXT, -- 语音类型
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 秘书性格库表
CREATE TABLE IF NOT EXISTS secretary_personalities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- 性格名称
  type TEXT NOT NULL, -- 性格类型：gentle(温柔), strict(严格), lively(活泼), calm(冷静), motivating(激励)
  description TEXT, -- 性格描述
  greeting_template TEXT, -- 问候语模板
  reminder_template TEXT, -- 提醒语模板
  encouragement_template TEXT, -- 鼓励语模板
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 秘书服装库表
CREATE TABLE IF NOT EXISTS secretary_outfits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- 服装名称
  type TEXT NOT NULL, -- 服装类型：campus(校园风), business(职业装), casual(休闲风), formal(正式装), special(特殊装)
  description TEXT, -- 服装描述
  outfit_url TEXT, -- 服装图片URL
  suitable_avatars TEXT[], -- 适合的形象类型数组
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 扩展用户偏好表，添加秘书配置
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS secretary_avatar_id UUID REFERENCES secretary_avatars(id),
ADD COLUMN IF NOT EXISTS secretary_personality_id UUID REFERENCES secretary_personalities(id),
ADD COLUMN IF NOT EXISTS secretary_outfit_id UUID REFERENCES secretary_outfits(id),
ADD COLUMN IF NOT EXISTS secretary_name TEXT DEFAULT '小秘', -- 用户自定义秘书名称
ADD COLUMN IF NOT EXISTS secretary_enabled BOOLEAN DEFAULT true; -- 是否启用秘书功能

-- 插入预置秘书形象
INSERT INTO secretary_avatars (name, type, description, voice_type) VALUES
('小萌', 'loli', '可爱活泼的萝莉形象，充满元气和活力，总是用最甜美的声音鼓励你学习', 'sweet'),
('优雅姐姐', 'oneesan', '成熟优雅的御姐形象，温柔体贴，像姐姐一样关心你的学习和生活', 'gentle'),
('稳重叔叔', 'uncle', '稳重可靠的大叔形象，经验丰富，用人生阅历指导你的学习规划', 'mature'),
('霸道总裁', 'boss', '干练高效的霸总形象，严格要求，帮助你高效完成学习目标', 'authoritative'),
('温柔学姐', 'senior_sister', '亲切耐心的学姐形象，善于引导，分享学习经验和技巧', 'friendly'),
('阳光学长', 'senior_brother', '阳光积极的学长形象，充满正能量，给你鼓励和支持', 'energetic');

-- 插入预置性格类型
INSERT INTO secretary_personalities (name, type, description, greeting_template, reminder_template, encouragement_template) VALUES
('温柔型', 'gentle', '温柔体贴，鼓励为主，语气柔和', 
 '早安呀~今天也要加油哦！{name}相信你一定可以的💕', 
 '温馨提醒：{task}的截止时间快到了，记得完成哦~不要太有压力，慢慢来就好😊',
 '哇！你真的很棒呢！继续保持这个状态，{name}一直在为你加油！✨'),

('严格型', 'strict', '严格督促，要求严格，注重效率', 
 '早上好！今天的学习计划已经准备好了，请按时完成！', 
 '注意：{task}即将到期！请立即处理，不要拖延！',
 '完成得不错，但还有提升空间。继续努力，追求更高的目标！'),

('活泼型', 'lively', '幽默风趣，轻松愉快，充满趣味', 
 '嘿！新的一天开始啦~准备好和我一起征服学习任务了吗？💪', 
 '叮咚~{task}在召唤你啦！快去完成它，然后我们一起庆祝！🎉',
 '耶！又完成一个任务！你简直是学习小超人！继续冲冲冲！🚀'),

('冷静型', 'calm', '理性分析，客观建议，逻辑清晰', 
 '早上好。根据你的学习计划，今天有{count}个任务需要完成。', 
 '提醒：{task}剩余时间{time}。建议合理安排时间，确保按时完成。',
 '任务完成效率良好。建议继续保持当前学习节奏，稳步提升。'),

('激励型', 'motivating', '充满正能量，积极向上，激发动力', 
 '早安！新的一天充满无限可能！让我们一起创造奇迹吧！🌟', 
 '加油！{task}等着你去征服！你一定可以做到的，相信自己！💪',
 '太棒了！你的努力没有白费！继续前进，成功就在前方！🏆');

-- 插入预置服装类型
INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('清新校园装', 'campus', '清新的学生装，充满青春活力', ARRAY['loli', 'senior_sister', 'senior_brother']),
('运动休闲装', 'campus', '舒适的运动服，适合轻松学习', ARRAY['loli', 'senior_sister', 'senior_brother']),
('职业西装', 'business', '正式的职业装，专业干练', ARRAY['oneesan', 'boss', 'uncle']),
('优雅衬衫', 'business', '优雅的衬衫套装，知性大方', ARRAY['oneesan', 'senior_sister']),
('休闲T恤', 'casual', '舒适的T恤，轻松自在', ARRAY['loli', 'senior_brother']),
('温暖卫衣', 'casual', '温暖的卫衣，亲切随和', ARRAY['loli', 'senior_sister', 'senior_brother']),
('正式礼服', 'formal', '正式的礼服，庄重典雅', ARRAY['oneesan', 'boss']),
('节日主题装', 'special', '节日特别款，充满节日气氛', ARRAY['loli', 'oneesan', 'senior_sister', 'senior_brother']);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_secretary_avatars_type ON secretary_avatars(type);
CREATE INDEX IF NOT EXISTS idx_secretary_personalities_type ON secretary_personalities(type);
CREATE INDEX IF NOT EXISTS idx_secretary_outfits_type ON secretary_outfits(type);
CREATE INDEX IF NOT EXISTS idx_user_preferences_secretary ON user_preferences(secretary_avatar_id, secretary_personality_id, secretary_outfit_id);

-- 添加注释
COMMENT ON TABLE secretary_avatars IS '秘书形象库表';
COMMENT ON TABLE secretary_personalities IS '秘书性格库表';
COMMENT ON TABLE secretary_outfits IS '秘书服装库表';
COMMENT ON COLUMN user_preferences.secretary_avatar_id IS '用户选择的秘书形象ID';
COMMENT ON COLUMN user_preferences.secretary_personality_id IS '用户选择的秘书性格ID';
COMMENT ON COLUMN user_preferences.secretary_outfit_id IS '用户选择的秘书服装ID';
COMMENT ON COLUMN user_preferences.secretary_name IS '用户自定义的秘书名称';
COMMENT ON COLUMN user_preferences.secretary_enabled IS '是否启用秘书功能';