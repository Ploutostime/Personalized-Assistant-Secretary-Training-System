-- 为秘书形象表添加声音配置字段
ALTER TABLE secretary_avatars 
ADD COLUMN IF NOT EXISTS voice_config JSONB DEFAULT '{}'::jsonb;

-- 为每个秘书类型配置个性化的声音参数
-- 经典系列
UPDATE secretary_avatars SET voice_config = '{
  "voice_id": "female-shaonv",
  "speed": 1.2,
  "pitch": 5,
  "vol": 1.0,
  "emotion": "happy"
}'::jsonb WHERE type = 'loli';

UPDATE secretary_avatars SET voice_config = '{
  "voice_id": "female-yujie",
  "speed": 0.9,
  "pitch": -3,
  "vol": 1.0,
  "emotion": "calm"
}'::jsonb WHERE type = 'oneesan';

UPDATE secretary_avatars SET voice_config = '{
  "voice_id": "male-qn-dax叔",
  "speed": 0.95,
  "pitch": -5,
  "vol": 1.0,
  "emotion": "calm"
}'::jsonb WHERE type = 'uncle';

UPDATE secretary_avatars SET voice_config = '{
  "voice_id": "male-qn-qingse",
  "speed": 1.0,
  "pitch": 0,
  "vol": 1.1,
  "emotion": "fluent"
}'::jsonb WHERE type = 'boss';

UPDATE secretary_avatars SET voice_config = '{
  "voice_id": "female-tianmei",
  "speed": 1.0,
  "pitch": 2,
  "vol": 1.0,
  "emotion": "calm"
}'::jsonb WHERE type = 'senior_sister';

-- 奇幻系列
UPDATE secretary_avatars SET voice_config = '{
  "voice_id": "female-yujie",
  "speed": 0.85,
  "pitch": 3,
  "vol": 0.9,
  "emotion": "calm"
}'::jsonb WHERE type = 'elf';

UPDATE secretary_avatars SET voice_config = '{
  "voice_id": "male-qn-qingse",
  "speed": 1.0,
  "pitch": -2,
  "vol": 1.1,
  "emotion": "fluent"
}'::jsonb WHERE type = 'knight';

UPDATE secretary_avatars SET voice_config = '{
  "voice_id": "female-yujie",
  "speed": 0.9,
  "pitch": 0,
  "vol": 0.95,
  "emotion": "calm"
}'::jsonb WHERE type = 'witch';

UPDATE secretary_avatars SET voice_config = '{
  "voice_id": "female-tianmei",
  "speed": 0.85,
  "pitch": 4,
  "vol": 0.9,
  "emotion": "calm"
}'::jsonb WHERE type = 'angel';

-- 古风系列
UPDATE secretary_avatars SET voice_config = '{
  "voice_id": "male-qn-qingse",
  "speed": 0.9,
  "pitch": 1,
  "vol": 1.0,
  "emotion": "calm"
}'::jsonb WHERE type = 'scholar';

UPDATE secretary_avatars SET voice_config = '{
  "voice_id": "male-qn-jingying",
  "speed": 1.0,
  "pitch": -3,
  "vol": 1.1,
  "emotion": "fluent"
}'::jsonb WHERE type = 'warrior';

UPDATE secretary_avatars SET voice_config = '{
  "voice_id": "female-tianmei",
  "speed": 0.85,
  "pitch": 2,
  "vol": 0.95,
  "emotion": "calm"
}'::jsonb WHERE type = 'princess';

-- 现代系列
UPDATE secretary_avatars SET voice_config = '{
  "voice_id": "male-qn-qingse",
  "speed": 1.1,
  "pitch": 0,
  "vol": 1.0,
  "emotion": "fluent"
}'::jsonb WHERE type = 'programmer';

UPDATE secretary_avatars SET voice_config = '{
  "voice_id": "female-yujie",
  "speed": 1.0,
  "pitch": 1,
  "vol": 1.0,
  "emotion": "happy"
}'::jsonb WHERE type = 'artist';

UPDATE secretary_avatars SET voice_config = '{
  "voice_id": "male-qn-jingying",
  "speed": 1.1,
  "pitch": 0,
  "vol": 1.1,
  "emotion": "happy"
}'::jsonb WHERE type = 'athlete';

-- 添加注释
COMMENT ON COLUMN secretary_avatars.voice_config IS '声音配置参数：voice_id(音色ID), speed(语速0.5-2), pitch(音调-12到12), vol(音量0-10), emotion(情绪)';
