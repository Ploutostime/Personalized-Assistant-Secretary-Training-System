-- 删除所有运动服装，只保留瑜伽和游泳服装
-- 需要删除的运动服装类型：baseball, basketball, fitness, running, sports_casual, tennis
-- 保留的服装类型：yoga, swimsuit, bikini

-- 1. 先删除这些服装的所有立绘配置
DELETE FROM secretary_outfit_images
WHERE outfit_id IN (
  SELECT id FROM secretary_outfits 
  WHERE type IN ('baseball', 'basketball', 'fitness', 'running', 'sports_casual', 'tennis')
);

-- 2. 删除这些服装本身
DELETE FROM secretary_outfits
WHERE type IN ('baseball', 'basketball', 'fitness', 'running', 'sports_casual', 'tennis');

-- 验证剩余的服装数量
SELECT COUNT(*) as remaining_outfits FROM secretary_outfits;

-- 验证剩余的立绘组合数量
SELECT COUNT(*) as remaining_combinations FROM secretary_outfit_images;

-- 显示剩余的运动相关服装
SELECT name, type FROM secretary_outfits 
WHERE type IN ('yoga', 'swimsuit', 'bikini')
ORDER BY type, name;