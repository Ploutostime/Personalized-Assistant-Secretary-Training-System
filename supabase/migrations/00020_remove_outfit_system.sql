-- 删除服装相关表和字段

-- 1. 删除服装立绘表
DROP TABLE IF EXISTS secretary_outfit_images CASCADE;

-- 2. 删除服装定义表
DROP TABLE IF EXISTS secretary_outfits CASCADE;

-- 3. 从用户偏好表中移除服装相关字段
ALTER TABLE user_preferences 
DROP COLUMN IF EXISTS secretary_outfit_id;

-- 4. 清理相关索引（如果存在）
DROP INDEX IF EXISTS idx_outfit_images_secretary;
DROP INDEX IF EXISTS idx_outfit_images_outfit;
DROP INDEX IF EXISTS idx_outfits_type;
