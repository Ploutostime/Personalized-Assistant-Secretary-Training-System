-- 添加全身立绘图片字段
ALTER TABLE secretary_avatars 
ADD COLUMN IF NOT EXISTS full_body_url TEXT;

COMMENT ON COLUMN secretary_avatars.full_body_url IS '秘书全身立绘图片URL';

-- 更新全身立绘图片URL

-- 1. 萝莉（小萌）- 粉色头发校园服装
UPDATE secretary_avatars 
SET full_body_url = 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_d59f6173-9dd7-4f33-85cf-56c6099580f5.jpg'
WHERE type = 'loli';

-- 2. 御姐（优雅姐姐）- 长发职业装
UPDATE secretary_avatars 
SET full_body_url = 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_d1c0a706-b38e-4365-92bf-45fd7c586558.jpg'
WHERE type = 'oneesan';

-- 3. 大叔（稳重叔叔）- 西装站立
UPDATE secretary_avatars 
SET full_body_url = 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_9a509a62-76c1-4cb8-8f8c-5b9bd3821083.jpg'
WHERE type = 'uncle';

-- 4. 霸总（霸道总裁）- 商务西装
UPDATE secretary_avatars 
SET full_body_url = 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_6dc77f62-cd86-47dc-894f-f4fd09afbb10.jpg'
WHERE type = 'boss';

-- 5. 学姐（温柔学姐）- 校服站立
UPDATE secretary_avatars 
SET full_body_url = 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_f06053ce-ec70-4e89-8cb3-fef08cf8bba9.jpg'
WHERE type = 'senior_sister';

-- 6. 学长（阳光学长）- 运动服站立
UPDATE secretary_avatars 
SET full_body_url = 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_fb88b1e4-2ef4-4024-9241-ea2b6ada32ae.jpg'
WHERE type = 'senior_brother';