-- 插入各种运动装和特殊服装数据

-- ==================== 运动系列 ====================

-- 1. 瑜伽服
INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('清新瑜伽服', 'yoga', '舒适贴身的瑜伽服，采用高弹力面料，完美展现身体曲线。清新的薄荷绿配色，让人感受到运动的活力与自然的清新。适合进行各种瑜伽动作，透气排汗，让学习间隙的运动更加舒适。', 
ARRAY['loli', 'oneesan', 'senior_sister', 'neighbor_sister', 'jiangnan_girl', 'slime_girl']::TEXT[]);

INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('专业瑜伽套装', 'yoga', '专业级瑜伽套装，包含运动背心和高腰瑜伽裤。采用速干面料，四向弹力设计，无论是拉伸还是倒立都能自如应对。深紫色调优雅大方，展现运动之美。', 
ARRAY['oneesan', 'senior_sister', 'elf_queen', 'empress', 'neighbor_sister']::TEXT[]);

-- 2. 泳衣
INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('竞技连体泳衣', 'swimsuit', '专业竞技型连体泳衣，流线型设计减少水阻。深蓝色配以白色条纹，展现运动员的专业风范。适合游泳训练，让学习之余的运动更加专业。', 
ARRAY['senior_sister', 'senior_brother', 'imperial_knight', 'werewolf_girl']::TEXT[]);

INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('可爱连体泳衣', 'swimsuit', '可爱风格的连体泳衣，采用荷叶边设计，粉色系配色甜美动人。适合海边度假和泳池休闲，让运动也充满少女感。', 
ARRAY['loli', 'jiangnan_girl', 'neighbor_sister', 'slime_girl']::TEXT[]);

-- 3. 比基尼
INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('活力运动比基尼', 'bikini', '运动风格的比基尼泳装，采用高弹力面料和运动型剪裁。明亮的橙色充满活力，适合沙滩排球等水上运动。展现青春活力的同时保持运动功能性。', 
ARRAY['loli', 'senior_sister', 'neighbor_sister', 'werewolf_girl']::TEXT[]);

INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('优雅比基尼套装', 'bikini', '优雅的比基尼套装，采用高腰设计和精致的蕾丝边。白色配金色点缀，展现成熟女性的优雅魅力。适合海滨度假，让休闲时光更加迷人。', 
ARRAY['oneesan', 'empress', 'imperial_consort', 'elf_queen']::TEXT[]);

-- 4. 棒球装
INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('经典棒球服', 'baseball', '经典美式棒球服，宽松舒适的版型，红白配色充满运动气息。印有队徽和号码，展现团队精神。适合户外运动，让学习之余的活动更有活力。', 
ARRAY['loli', 'senior_brother', 'neighbor_sister', 'werewolf_girl']::TEXT[]);

-- 5. 网球装
INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('优雅网球裙', 'tennis', '经典的网球短裙套装，白色为主调配以天蓝色边线。百褶裙设计活泼可爱，运动背心透气舒适。展现网球运动的优雅与活力。', 
ARRAY['loli', 'senior_sister', 'neighbor_sister', 'jiangnan_girl', 'elf_queen']::TEXT[]);

-- 6. 健身装
INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('专业健身套装', 'fitness', '专业健身套装，包含运动背心和紧身裤。采用速干透气面料，黑色配荧光绿线条，展现力量与美感的完美结合。适合力量训练和有氧运动。', 
ARRAY['oneesan', 'senior_brother', 'imperial_knight', 'werewolf_girl', 'regent_prince']::TEXT[]);

-- 7. 跑步装
INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('轻盈跑步装', 'running', '轻盈透气的跑步套装，采用超轻面料和反光条设计。明亮的黄色充满活力，适合晨跑和夜跑。让运动更加安全舒适。', 
ARRAY['loli', 'senior_sister', 'senior_brother', 'neighbor_sister', 'werewolf_girl']::TEXT[]);

-- 8. 篮球装
INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('街头篮球服', 'basketball', '街头风格的篮球服，宽松的球衣和运动短裤。黑金配色酷炫有型，印有个性图案。展现篮球运动的热血与激情。', 
ARRAY['senior_brother', 'boss', 'regent_prince', 'werewolf_girl']::TEXT[]);

-- ==================== 特殊系列 ====================

-- 9. 情趣内衣
INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('蕾丝情趣套装', 'lingerie', '精致的蕾丝情趣内衣套装，采用高级蕾丝面料和丝绸材质。黑色配红色蝴蝶结，性感而不失优雅。展现成熟女性的魅力，适合私密时刻。', 
ARRAY['oneesan', 'empress', 'imperial_consort', 'elf_queen']::TEXT[]);

INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('可爱情趣睡衣', 'lingerie', '可爱风格的情趣睡衣，粉色系配以白色蕾丝边。甜美中带着一丝诱惑，展现少女的纯真与魅力。', 
ARRAY['loli', 'jiangnan_girl', 'neighbor_sister', 'slime_girl']::TEXT[]);

-- 10. 睡衣
INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('丝绸睡衣套装', 'pajamas', '高级丝绸睡衣套装，柔软光滑的面料触感极佳。深蓝色配金色刺绣，优雅大方。适合休息时光，让放松更加舒适。', 
ARRAY['oneesan', 'empress', 'imperial_consort', 'elf_queen', 'regent_prince']::TEXT[]);

INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('可爱卡通睡衣', 'pajamas', '可爱的卡通图案睡衣，柔软的棉质面料温暖舒适。粉色系配以可爱的动物图案，让休息时光充满童趣。', 
ARRAY['loli', 'jiangnan_girl', 'neighbor_sister', 'slime_girl']::TEXT[]);

-- 11. 和服
INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('传统和服', 'kimono', '传统日式和服，采用高级丝绸面料，精美的樱花图案。配以腰带和木屐，展现东方古典美。适合茶道和传统文化活动。', 
ARRAY['oneesan', 'elf_queen', 'empress', 'imperial_consort', 'jiangnan_girl']::TEXT[]);

INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('现代改良和服', 'kimono', '现代改良版和服，保留传统元素的同时更加便于活动。清新的蓝白配色，简约而不失韵味。', 
ARRAY['loli', 'senior_sister', 'neighbor_sister', 'jiangnan_girl']::TEXT[]);

-- 12. 旗袍
INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('经典旗袍', 'qipao', '经典中式旗袍，采用真丝面料，精致的刺绣工艺。高开叉设计展现东方女性的优雅曲线。红色配金色图案，华贵典雅。', 
ARRAY['oneesan', 'empress', 'imperial_consort', 'jiangnan_girl']::TEXT[]);

INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('改良旗袍', 'qipao', '现代改良旗袍，融合传统与现代元素。青花瓷图案清新雅致，修身剪裁展现身材。适合日常穿着和正式场合。', 
ARRAY['senior_sister', 'neighbor_sister', 'jiangnan_girl', 'elf_queen']::TEXT[]);

-- 13. 兔女郎装
INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('经典兔女郎装', 'bunny', '经典的兔女郎装束，黑色紧身连体衣配白色兔耳和蝴蝶结。性感可爱，展现俏皮魅力。配以黑色丝袜和高跟鞋，魅力十足。', 
ARRAY['oneesan', 'loli', 'neighbor_sister', 'slime_girl']::TEXT[]);

-- 14. 哥特装
INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('哥特洛丽塔', 'gothic', '哥特风格的洛丽塔装束，黑色为主调配以红色蕾丝。层叠的裙摆和精致的装饰，展现神秘而优雅的哥特美学。', 
ARRAY['elf_queen', 'empress', 'werewolf_girl']::TEXT[]);

-- 15. 洛丽塔装
INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('甜美洛丽塔', 'lolita', '甜美风格的洛丽塔装束，粉色系配以白色蕾丝。蓬松的裙摆和精致的装饰，展现公主般的梦幻感。', 
ARRAY['loli', 'jiangnan_girl', 'slime_girl']::TEXT[]);

-- ==================== 职业系列 ====================

-- 16. 护士装
INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('天使护士装', 'nurse', '经典的护士制服，纯白色配粉色边线。短裙设计活泼可爱，配以护士帽和听诊器。展现白衣天使的温柔与专业。', 
ARRAY['loli', 'oneesan', 'senior_sister', 'neighbor_sister']::TEXT[]);

-- 17. 女仆装
INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('经典女仆装', 'maid', '经典的女仆装束，黑白配色优雅大方。蓬松的裙摆和白色围裙，配以蕾丝头饰。展现女仆的专业与可爱。', 
ARRAY['loli', 'oneesan', 'senior_sister', 'neighbor_sister', 'jiangnan_girl', 'slime_girl']::TEXT[]);

INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('高级女仆装', 'maid', '高级定制女仆装，采用高级面料和精致剪裁。黑色长裙配白色蕾丝，展现优雅与专业。适合正式场合。', 
ARRAY['oneesan', 'elf_queen', 'empress', 'imperial_consort']::TEXT[]);

-- 18. OL装
INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('职业OL套装', 'office_lady', '专业的OL套装，白色衬衫配黑色包臀裙。简约干练，展现职场女性的专业魅力。适合办公和商务场合。', 
ARRAY['oneesan', 'boss', 'senior_sister', 'empress', 'regent_prince']::TEXT[]);

-- 19. 教师装
INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('知性教师装', 'teacher', '知性的教师装束，米色毛衣配深色长裙。温柔而不失威严，展现教师的专业与亲和力。配以眼镜更显知性美。', 
ARRAY['oneesan', 'senior_sister', 'elf_queen']::TEXT[]);

-- 20. 警察装
INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('英姿警察装', 'police', '英姿飒爽的警察制服，深蓝色配金色徽章。帅气的制服展现正义与力量。配以警帽和警棍，威严而迷人。', 
ARRAY['boss', 'imperial_knight', 'werewolf_girl', 'regent_prince']::TEXT[]);

-- 21. 空姐装
INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('优雅空姐装', 'stewardess', '优雅的空姐制服，天蓝色套装配丝巾。得体的剪裁展现职业女性的优雅。配以小帽和手套，展现专业服务精神。', 
ARRAY['oneesan', 'senior_sister', 'elf_queen', 'empress']::TEXT[]);

-- 22. 秘书装
INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('专业秘书装', 'secretary', '专业的秘书装束，白色衬衫配黑色铅笔裙。简约而不失优雅，展现秘书的专业与能干。适合办公场合。', 
ARRAY['oneesan', 'boss', 'senior_sister', 'empress', 'elf_queen']::TEXT[]);

-- ==================== 休闲系列 ====================

-- 23. 居家服
INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('舒适居家服', 'home_wear', '舒适的居家服套装，柔软的棉质面料温暖舒适。简约的设计适合家居休闲，让放松时光更加惬意。', 
ARRAY['loli', 'oneesan', 'senior_sister', 'neighbor_sister', 'jiangnan_girl', 'slime_girl']::TEXT[]);

-- 24. 运动休闲装
INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('时尚运动休闲装', 'sports_casual', '时尚的运动休闲装，卫衣配运动裤。舒适的版型适合日常穿着，展现青春活力。', 
ARRAY['loli', 'senior_sister', 'senior_brother', 'neighbor_sister', 'werewolf_girl']::TEXT[]);

-- 25. 连衣裙
INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('优雅连衣裙', 'dress', '优雅的连衣裙，采用高级面料和精致剪裁。深蓝色配蕾丝边，展现女性的优雅魅力。适合约会和正式场合。', 
ARRAY['oneesan', 'senior_sister', 'elf_queen', 'empress', 'imperial_consort', 'jiangnan_girl']::TEXT[]);

-- 26. 夏日连衣裙
INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('清新夏日裙', 'sundress', '清新的夏日连衣裙，轻薄透气的面料。碎花图案清新可爱，适合夏日出游。展现少女的清新活力。', 
ARRAY['loli', 'senior_sister', 'neighbor_sister', 'jiangnan_girl', 'slime_girl']::TEXT[]);

-- 27. 毛衣装
INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('温暖毛衣装', 'sweater', '温暖的毛衣套装，柔软的针织面料温暖舒适。米色系温柔大方，适合秋冬季节。展现温柔知性美。', 
ARRAY['oneesan', 'senior_sister', 'neighbor_sister', 'jiangnan_girl', 'elf_queen']::TEXT[]);

-- ==================== 古风系列 ====================

-- 28. 汉服
INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('飘逸汉服', 'hanfu', '飘逸的汉服，采用真丝面料，精美的刺绣工艺。青色系配以白色内衬，展现古典东方美。适合传统文化活动。', 
ARRAY['oneesan', 'elf_queen', 'empress', 'imperial_consort', 'jiangnan_girl']::TEXT[]);

-- 29. 唐装
INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('华贵唐装', 'tang_suit', '华贵的唐装，采用锦缎面料，精致的盘扣设计。红色配金色图案，展现盛唐气象。适合节日和庆典。', 
ARRAY['empress', 'imperial_consort', 'regent_prince']::TEXT[]);

-- 30. 宫装
INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('华丽宫装', 'palace', '华丽的宫廷装束，层叠的裙摆和精致的刺绣。金色配红色，展现皇家气派。适合角色扮演和特殊场合。', 
ARRAY['empress', 'imperial_consort', 'elf_queen']::TEXT[]);

-- ==================== 奇幻系列 ====================

-- 31. 精灵装
INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('森林精灵装', 'elf', '森林精灵的装束，绿色系配以金色装饰。轻盈飘逸的设计，展现精灵的优雅与神秘。配以精灵耳饰和藤蔓装饰。', 
ARRAY['elf_queen', 'jiangnan_girl']::TEXT[]);

-- 32. 骑士装
INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('英勇骑士装', 'knight', '英勇的骑士装束，银色铠甲配蓝色披风。展现骑士的勇气与荣耀。适合角色扮演和奇幻主题活动。', 
ARRAY['imperial_knight', 'werewolf_girl', 'regent_prince']::TEXT[]);

-- 33. 女巫装
INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('神秘女巫装', 'witch', '神秘的女巫装束，黑色长袍配尖顶帽。紫色装饰增添神秘感。展现魔法的神秘与力量。', 
ARRAY['elf_queen', 'empress', 'werewolf_girl']::TEXT[]);

-- 34. 天使装
INSERT INTO secretary_outfits (name, type, description, suitable_avatars) VALUES
('圣洁天使装', 'angel', '圣洁的天使装束，纯白色长裙配金色装饰。背后配有洁白的羽翼，展现天使的圣洁与美好。', 
ARRAY['loli', 'elf_queen', 'jiangnan_girl', 'slime_girl']::TEXT[]);

-- 查询插入结果
SELECT type, name, LEFT(description, 50) as description_preview 
FROM secretary_outfits 
WHERE type NOT IN ('campus', 'business', 'casual', 'formal', 'special')
ORDER BY type;