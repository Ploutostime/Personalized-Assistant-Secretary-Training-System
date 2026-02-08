-- 优化女性角色的声音配置，增强女性魅力
-- 优化男性角色的声音配置，增强男性磁性

-- 经典系列 - 女性角色
UPDATE secretary_avatars SET voice_config = '{
  "voice_id": "female-shaonv",
  "speed": 1.1,
  "pitch": 4,
  "vol": 1.0,
  "emotion": "happy"
}'::jsonb WHERE type = 'loli';

UPDATE secretary_avatars SET voice_config = '{
  "voice_id": "female-yujie",
  "speed": 0.85,
  "pitch": -2,
  "vol": 1.0,
  "emotion": "calm"
}'::jsonb WHERE type = 'oneesan';

UPDATE secretary_avatars SET voice_config = '{
  "voice_id": "female-tianmei",
  "speed": 0.95,
  "pitch": 3,
  "vol": 1.0,
  "emotion": "calm"
}'::jsonb WHERE type = 'senior_sister';

-- 经典系列 - 男性角色
UPDATE secretary_avatars SET voice_config = '{
  "voice_id": "male-qn-daxu",
  "speed": 0.9,
  "pitch": -6,
  "vol": 1.1,
  "emotion": "calm"
}'::jsonb WHERE type = 'uncle';

UPDATE secretary_avatars SET voice_config = '{
  "voice_id": "male-qn-qingse",
  "speed": 0.95,
  "pitch": -4,
  "vol": 1.1,
  "emotion": "fluent"
}'::jsonb WHERE type = 'boss';

-- 奇幻系列 - 女性角色
UPDATE secretary_avatars SET voice_config = '{
  "voice_id": "female-yujie",
  "speed": 0.8,
  "pitch": 2,
  "vol": 0.9,
  "emotion": "calm"
}'::jsonb WHERE type = 'elf';

UPDATE secretary_avatars SET voice_config = '{
  "voice_id": "female-yujie",
  "speed": 0.85,
  "pitch": 1,
  "vol": 0.95,
  "emotion": "calm"
}'::jsonb WHERE type = 'witch';

UPDATE secretary_avatars SET voice_config = '{
  "voice_id": "female-tianmei",
  "speed": 0.8,
  "pitch": 5,
  "vol": 0.9,
  "emotion": "calm"
}'::jsonb WHERE type = 'angel';

-- 奇幻系列 - 男性角色
UPDATE secretary_avatars SET voice_config = '{
  "voice_id": "male-qn-jingying",
  "speed": 0.95,
  "pitch": -5,
  "vol": 1.1,
  "emotion": "fluent"
}'::jsonb WHERE type = 'knight';

-- 古风系列 - 女性角色
UPDATE secretary_avatars SET voice_config = '{
  "voice_id": "female-tianmei",
  "speed": 0.8,
  "pitch": 3,
  "vol": 0.95,
  "emotion": "calm"
}'::jsonb WHERE type = 'princess';

-- 古风系列 - 男性角色
UPDATE secretary_avatars SET voice_config = '{
  "voice_id": "male-qn-qingse",
  "speed": 0.85,
  "pitch": -3,
  "vol": 1.0,
  "emotion": "calm"
}'::jsonb WHERE type = 'scholar';

UPDATE secretary_avatars SET voice_config = '{
  "voice_id": "male-qn-jingying",
  "speed": 1.0,
  "pitch": -5,
  "vol": 1.1,
  "emotion": "fluent"
}'::jsonb WHERE type = 'warrior';

-- 现代系列 - 女性角色
UPDATE secretary_avatars SET voice_config = '{
  "voice_id": "female-yujie",
  "speed": 0.95,
  "pitch": 2,
  "vol": 1.0,
  "emotion": "happy"
}'::jsonb WHERE type = 'artist';

-- 现代系列 - 男性角色
UPDATE secretary_avatars SET voice_config = '{
  "voice_id": "male-qn-qingse",
  "speed": 1.05,
  "pitch": -3,
  "vol": 1.0,
  "emotion": "fluent"
}'::jsonb WHERE type = 'programmer';

UPDATE secretary_avatars SET voice_config = '{
  "voice_id": "male-qn-jingying",
  "speed": 1.1,
  "pitch": -4,
  "vol": 1.1,
  "emotion": "happy"
}'::jsonb WHERE type = 'athlete';

-- 添加注释说明优化重点
COMMENT ON COLUMN secretary_avatars.voice_config IS '声音配置参数：voice_id(音色ID), speed(语速0.5-2), pitch(音调-12到12，女性正值增加魅力，男性负值增加磁性), vol(音量0-10), emotion(情绪)';
