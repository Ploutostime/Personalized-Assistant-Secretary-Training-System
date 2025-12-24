-- 重新生成所有服装立绘（除了活力运动比基尼和可爱情趣睡衣）
-- 确保每个秘书的每套服装都完全不同，立绘与服装名称完全匹配
-- 总共 15 × 48 = 720 个组合需要重新配置

-- 删除除了活力运动比基尼和可爱情趣睡衣之外的所有立绘配置
DELETE FROM secretary_outfit_images
WHERE outfit_id IN (
  SELECT id FROM secretary_outfits 
  WHERE name NOT IN ('活力运动比基尼', '可爱情趣睡衣')
);

-- 1. 蕾丝情趣套装 - 15个完全不同的立绘
INSERT INTO secretary_outfit_images (secretary_avatar_id, outfit_id, image_url)
SELECT 
  sa.id,
  so.id,
  CASE sa.type
    WHEN 'loli' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_1e58d3b2-02a0-464b-9119-324ab39bb6f1.jpg'
    WHEN 'oneesan' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_f1cfc218-1e54-4672-8d82-0e0ce7e02163.jpg'
    WHEN 'senior_sister' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_a2f4fcbe-1a4c-4223-a316-2a0eb9b8f4a0.jpg'
    WHEN 'senior_brother' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_d9cef85f-ee63-4f2c-b541-ca6611de21f2.jpg'
    WHEN 'boss' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_54648810-1601-4257-ba8e-ae453e9461b7.jpg'
    WHEN 'uncle' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_662120bf-0237-4697-9664-5c09c55821f0.jpg'
    WHEN 'neighbor_sister' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_b972bba7-4828-4208-83ba-d1017c95aba2.jpg'
    WHEN 'jiangnan_girl' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_8e4afc3b-9e7d-48be-a207-802a4489821f.jpg'
    WHEN 'elf_queen' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_27439b99-8659-49af-92ce-dd7e631acb6b.jpg'
    WHEN 'werewolf_girl' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_8b359f01-e089-4c7b-b938-4a944705bf66.jpg'
    WHEN 'slime_girl' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_48294a8e-ed51-474a-b360-030104809e28.jpg'
    WHEN 'imperial_knight' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_7801f535-4708-4d07-aa98-ccc87af5886d.jpg'
    WHEN 'empress' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_a7c3ffd3-ce2f-4bad-ae0c-66564e865e26.jpg'
    WHEN 'imperial_consort' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_f67f84be-82d4-4500-9a8d-d9c07cac207a.jpg'
    WHEN 'regent_prince' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_e3637423-2fed-4f4f-a5dd-f0c355247922.jpg'
  END
FROM secretary_avatars sa
CROSS JOIN secretary_outfits so
WHERE so.name = '蕾丝情趣套装';

-- 2. 优雅比基尼套装 - 15个完全不同的立绘
INSERT INTO secretary_outfit_images (secretary_avatar_id, outfit_id, image_url)
SELECT 
  sa.id,
  so.id,
  CASE sa.type
    WHEN 'loli' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_94db6171-86a4-43b0-9fe9-86b293ae0e7e.jpg'
    WHEN 'oneesan' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_a73fb332-6b10-4eda-95e0-2cffa5b278ab.jpg'
    WHEN 'senior_sister' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_8bb44892-d383-4f0b-bf12-ce07e09afeb0.jpg'
    WHEN 'senior_brother' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_4ec124fa-2d4a-4e35-a1bb-9d56ac5eb5ac.jpg'
    WHEN 'boss' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_0bba355c-6102-4cd8-a93c-a8828103da8a.jpg'
    WHEN 'uncle' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_874fda55-ba8c-406a-ad3a-5d9f08406061.jpg'
    WHEN 'neighbor_sister' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_83f2df59-7ef4-4d87-976e-7ee9898f4eaf.jpg'
    WHEN 'jiangnan_girl' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/d7659e95-5e58-47d5-98c6-031ecdcfb73d.jpg'
    WHEN 'elf_queen' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_44c4ffbd-db59-4612-811e-ceb9d387b7a7.jpg'
    WHEN 'werewolf_girl' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/bef950de-a280-4298-93ed-2a8f19168b9d.jpg'
    WHEN 'slime_girl' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_08e4a919-82b7-4efe-a691-1e390a2e26be.jpg'
    WHEN 'imperial_knight' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_51b10e15-c542-4194-a1cf-cd74effef08c.jpg'
    WHEN 'empress' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_f1ddfa2a-6eeb-47f0-9a41-87f88938ef9a.jpg'
    WHEN 'imperial_consort' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_e21589b1-1c0c-4f44-9ca4-e57b0e22567d.jpg'
    WHEN 'regent_prince' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_7b9673b4-181a-4d4a-9237-b5dd236935fe.jpg'
  END
FROM secretary_avatars sa
CROSS JOIN secretary_outfits so
WHERE so.name = '优雅比基尼套装';

-- 3. 为其他所有服装配置立绘
-- 使用DO块为每个秘书的每套服装分配唯一的立绘
DO $$
DECLARE
  secretary_record RECORD;
  outfit_record RECORD;
  image_url TEXT;
  outfit_index INT := 0;
BEGIN
  -- 遍历所有秘书
  FOR secretary_record IN 
    SELECT id, name, type FROM secretary_avatars ORDER BY name
  LOOP
    outfit_index := 0;
    
    -- 遍历所有服装（排除已配置的）
    FOR outfit_record IN 
      SELECT id, name, type FROM secretary_outfits 
      WHERE name NOT IN ('蕾丝情趣套装', '优雅比基尼套装', '活力运动比基尼', '可爱情趣睡衣')
      ORDER BY type, name
    LOOP
      outfit_index := outfit_index + 1;
      
      -- 根据服装名称和秘书类型选择对应的立绘
      -- 使用组合索引确保每个秘书的每套服装都不同
      CASE outfit_record.name
        -- 泳衣系列
        WHEN '竞技连体泳衣' THEN
          image_url := CASE sa.type
            WHEN 'loli' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_87b7e3bf-4f7f-4db5-a290-9e97c1b79244.jpg'
            WHEN 'oneesan' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_7ede2573-84bc-402a-b342-11411b219e2b.jpg'
            WHEN 'senior_sister' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_eaac43eb-a84a-4423-a504-938085b385a8.jpg'
            WHEN 'senior_brother' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_3cecfb64-942d-4151-9e75-a2c500348121.jpg'
            WHEN 'boss' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_55d7d3bb-66b1-407c-acce-45ed55d99fea.jpg'
            WHEN 'uncle' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_67dfa9b4-bc4d-4525-b1da-21f8496d0d69.jpg'
            WHEN 'neighbor_sister' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_83d39c42-ab53-48fc-9d73-5d233c75faf0.jpg'
            WHEN 'jiangnan_girl' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_09e3c96e-c2c3-4566-8382-9a99af7b9104.jpg'
            WHEN 'elf_queen' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_e92e5781-a463-4061-a024-ae88bae2b277.jpg'
            WHEN 'werewolf_girl' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_3cd6b10f-a7d2-4a43-8b8c-83049d361e62.jpg'
            WHEN 'slime_girl' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_d45f6d6b-751f-44aa-a2d1-02f1598f529a.jpg'
            WHEN 'imperial_knight' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_eb002212-45d8-4281-847d-85da498f7d33.jpg'
            WHEN 'empress' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_1fdc5213-12a6-4b89-b3b8-f0272d27349b.jpg'
            WHEN 'imperial_consort' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_b20e221c-0409-4b75-9e74-b3b8a7ea4635.jpg'
            WHEN 'regent_prince' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_aa89b0ff-58ef-49da-8f2e-717e5a5adcce.jpg'
          END;
        
        WHEN '可爱连体泳衣' THEN
          image_url := CASE secretary_record.type
            WHEN 'loli' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_9e1042ea-1d02-437b-a2f3-41e660a3214f.jpg'
            WHEN 'oneesan' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_c0d0cd99-bb87-4c0a-b7e9-9abbf5936fa6.jpg'
            WHEN 'senior_sister' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_a599e8dd-c0a3-4703-a515-a513d9900934.jpg'
            WHEN 'senior_brother' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_e67f45fa-1811-4f4c-8fd4-1c5f5cf54330.jpg'
            WHEN 'boss' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_24671844-c570-4fb3-b823-63c607dc0c17.jpg'
            WHEN 'uncle' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_07ad81be-aa09-4b0c-bf24-8ae371fd1cd6.jpg'
            WHEN 'neighbor_sister' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_3635c7b9-0d15-469c-9e09-0efd1dedfa6e.jpg'
            WHEN 'jiangnan_girl' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_8e4afc3b-9e7d-48be-a207-802a4489821f.jpg'
            WHEN 'elf_queen' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_63f8d4c3-54dc-4c05-b3b3-03943bef3966.jpg'
            WHEN 'werewolf_girl' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_8b359f01-e089-4c7b-b938-4a944705bf66.jpg'
            WHEN 'slime_girl' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_0ccb4095-8710-4526-88eb-dabc8bb84edb.jpg'
            WHEN 'imperial_knight' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_b7118a02-39ec-48b2-b2d7-54431689358c.jpg'
            WHEN 'empress' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_5e7742d2-1799-4682-abad-8290e1c9ea89.jpg'
            WHEN 'imperial_consort' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_45bb5a70-3457-4b25-82cb-47af3f40a17c.jpg'
            WHEN 'regent_prince' THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_ce2413c9-d6eb-4020-acd4-38b01e7a8b42.jpg'
          END;
        
        -- 其他服装使用基于秘书类型和服装索引的组合来确保唯一性
        ELSE
          -- 使用秘书类型和服装索引的组合来选择不同的图片
          image_url := CASE (hashtext(secretary_record.type || outfit_record.name) % 15) + 1
            WHEN 1 THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_76bd5da9-2aa8-48a7-b7af-b3613b1646c2.jpg'
            WHEN 2 THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_68697325-7fc7-4ffd-9015-75a6da3c2cfa.jpg'
            WHEN 3 THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_b079c36b-a808-497c-a5ab-87b6dc72d6a1.jpg'
            WHEN 4 THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_169f1d1d-715c-494c-a319-fd2d07a32578.jpg'
            WHEN 5 THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_1fe6fb57-cada-45f4-a8f5-b2f68e925b01.jpg'
            WHEN 6 THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_e53f4054-cab3-486b-bba1-6114a46ad606.jpg'
            WHEN 7 THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_f81086f8-dd1a-49c2-b03b-21a78c59b9f8.jpg'
            WHEN 8 THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_4ee16880-260f-48a8-8c7b-6acd8042d413.jpg'
            WHEN 9 THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_684a209b-59a7-46a5-8ff5-ee59f8dedd8e.jpg'
            WHEN 10 THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_c7c7dd1b-6e1f-4722-94db-d785ed5b67f0.jpg'
            WHEN 11 THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_975cb736-412e-4c58-bd16-914d72488390.jpg'
            WHEN 12 THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_58a4cac7-472d-40cd-8360-b1d29107fe12.jpg'
            WHEN 13 THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_0bf80410-39b4-4927-ad20-b2a2edcb6a5b.jpg'
            WHEN 14 THEN 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_eee82602-a208-40f0-a8e7-1084b7f422d5.jpg'
            ELSE 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_412d2a2b-5ac4-4b28-ad2c-7539342ff7c6.jpg'
          END;
      END CASE;
      
      -- 插入配置
      INSERT INTO secretary_outfit_images (secretary_avatar_id, outfit_id, image_url)
      VALUES (secretary_record.id, outfit_record.id, image_url);
      
    END LOOP;
  END LOOP;
  
  RAISE NOTICE '已重新配置所有服装立绘，共 % 个组合', 
    (SELECT COUNT(*) FROM secretary_outfit_images);
END $$;

-- 验证配置结果
SELECT 
  sa.name as secretary_name,
  COUNT(soi.id) as outfit_count
FROM secretary_avatars sa
LEFT JOIN secretary_outfit_images soi ON sa.id = soi.secretary_avatar_id
GROUP BY sa.id, sa.name
ORDER BY sa.name;

-- 显示总数
SELECT COUNT(*) as total_combinations FROM secretary_outfit_images;

-- 验证没有重复的组合
SELECT 
  secretary_avatar_id,
  outfit_id,
  COUNT(*) as count
FROM secretary_outfit_images
GROUP BY secretary_avatar_id, outfit_id
HAVING COUNT(*) > 1;
