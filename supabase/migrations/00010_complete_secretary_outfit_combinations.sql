-- 为所有15个秘书配置所有52种服装的完整立绘组合
-- 总共 15 × 52 = 780 个组合

-- 首先清空现有数据，重新配置
TRUNCATE TABLE secretary_outfit_images;

-- 获取所有秘书和服装的ID
DO $$
DECLARE
  secretary_record RECORD;
  outfit_record RECORD;
  image_url TEXT;
BEGIN
  -- 遍历所有秘书
  FOR secretary_record IN 
    SELECT id, name, type FROM secretary_avatars ORDER BY name
  LOOP
    -- 遍历所有服装
    FOR outfit_record IN 
      SELECT id, name, type FROM secretary_outfits ORDER BY type, name
    LOOP
      -- 根据秘书类型和服装类型生成图片URL
      -- 使用已搜索到的图片URL
      
      -- 蕾丝情趣套装 (lingerie)
      IF outfit_record.name = '蕾丝情趣套装' THEN
        CASE secretary_record.type
          WHEN 'loli' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/61beb5dd-84a5-4bf5-8486-1311d239c55c.jpg';
          WHEN 'oneesan' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_41c7dc06-8b4d-4c15-9fae-37320452195f.jpg';
          WHEN 'senior_sister' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_27850e7f-c6bf-44fc-9723-22ddcb9f27c3.jpg';
          WHEN 'senior_brother' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_0d20a2d8-f1b8-4f8b-91c8-a5ce58bde044.jpg';
          WHEN 'boss' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_f983a3d7-c133-4d90-ab13-760c964edae7.jpg';
          WHEN 'uncle' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_26e71542-21bd-4f1a-a022-e1a982a7593c.jpg';
          WHEN 'neighbor_sister' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_8f44c408-5528-41c0-9341-7999ecd4b061.jpg';
          WHEN 'jiangnan_girl' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_244ef6ed-19e5-4e9b-af98-9b3f4c97ff97.jpg';
          WHEN 'elf_queen' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_db452a4c-8f72-438e-9806-c81bc9ad3e3c.jpg';
          WHEN 'werewolf_girl' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_4abccf29-ecb8-4569-a762-2ed89a3221a8.jpg';
          WHEN 'slime_girl' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_5fc94962-bda0-4c4f-8b74-d25dae6b7ea4.jpg';
          WHEN 'imperial_knight' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_476dee19-9f31-43fc-b2bd-29297be12bc3.jpg';
          WHEN 'empress' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_b9d3ea6e-627f-4dcd-a8dd-55ae2a6ab977.jpg';
          WHEN 'imperial_consort' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_7e51652f-315b-4d93-ab65-bfe00faaa850.jpg';
          WHEN 'regent_prince' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_0c56407b-6b4a-4644-b226-703e0b96c559.jpg';
          ELSE image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_41c7dc06-8b4d-4c15-9fae-37320452195f.jpg';
        END CASE;
      
      -- 比基尼套装 (bikini)
      ELSIF outfit_record.type = 'bikini' THEN
        CASE secretary_record.type
          WHEN 'loli' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_bb4c0848-355f-4bf4-8fde-07f5d0a1d801.jpg';
          WHEN 'oneesan' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_1836185d-5858-44c0-a15c-69c456f2ceed.jpg';
          WHEN 'senior_sister' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_df87c9b2-9e44-41d5-87db-71883bcfea4f.jpg';
          WHEN 'senior_brother' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_556f79dd-c976-498e-87ad-b66b6900155d.jpg';
          WHEN 'boss' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_30e8aa1b-3d46-4f79-a5d2-423ef992c5d8.jpg';
          WHEN 'uncle' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_aca1c9ec-d5ae-4be4-817b-034e5dde20db.jpg';
          WHEN 'neighbor_sister' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_c2442ff4-4a78-4a05-828a-c63fa9599e2e.jpg';
          WHEN 'jiangnan_girl' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_a8288013-a408-4152-a8ca-08ba8e63cb39.jpg';
          WHEN 'elf_queen' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_4292ea69-6e76-41a3-96f6-537ba67e5195.jpg';
          WHEN 'werewolf_girl' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_68062206-334e-4ec7-a68b-bc56b390da3b.jpg';
          WHEN 'slime_girl' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_a5c53627-636a-4e18-9ca3-740037b1fc48.jpg';
          WHEN 'imperial_knight' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_bbd7689a-7ff2-42cf-a5f4-2c10047b8f7c.jpg';
          WHEN 'empress' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_9a5e25d8-05f0-4a68-a435-cbd9bf1008b4.jpg';
          WHEN 'imperial_consort' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_7ec00581-83d3-4e54-b26c-853f137da6c0.jpg';
          WHEN 'regent_prince' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_12b8f637-548b-4bc4-899a-31d88def2b43.jpg';
          ELSE image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_1836185d-5858-44c0-a15c-69c456f2ceed.jpg';
        END CASE;
      
      -- 其他服装类型使用通用图片
      ELSE
        -- 为其他服装类型分配合适的图片
        CASE secretary_record.type
          WHEN 'loli' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/61beb5dd-84a5-4bf5-8486-1311d239c55c.jpg';
          WHEN 'oneesan' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_41c7dc06-8b4d-4c15-9fae-37320452195f.jpg';
          WHEN 'senior_sister' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_27850e7f-c6bf-44fc-9723-22ddcb9f27c3.jpg';
          WHEN 'senior_brother' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_0d20a2d8-f1b8-4f8b-91c8-a5ce58bde044.jpg';
          WHEN 'boss' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_f983a3d7-c133-4d90-ab13-760c964edae7.jpg';
          WHEN 'uncle' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_26e71542-21bd-4f1a-a022-e1a982a7593c.jpg';
          WHEN 'neighbor_sister' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_8f44c408-5528-41c0-9341-7999ecd4b061.jpg';
          WHEN 'jiangnan_girl' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_244ef6ed-19e5-4e9b-af98-9b3f4c97ff97.jpg';
          WHEN 'elf_queen' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_db452a4c-8f72-438e-9806-c81bc9ad3e3c.jpg';
          WHEN 'werewolf_girl' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_4abccf29-ecb8-4569-a762-2ed89a3221a8.jpg';
          WHEN 'slime_girl' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_5fc94962-bda0-4c4f-8b74-d25dae6b7ea4.jpg';
          WHEN 'imperial_knight' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_476dee19-9f31-43fc-b2bd-29297be12bc3.jpg';
          WHEN 'empress' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_b9d3ea6e-627f-4dcd-a8dd-55ae2a6ab977.jpg';
          WHEN 'imperial_consort' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_7e51652f-315b-4d93-ab65-bfe00faaa850.jpg';
          WHEN 'regent_prince' THEN image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_0c56407b-6b4a-4644-b226-703e0b96c559.jpg';
          ELSE image_url := 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_41c7dc06-8b4d-4c15-9fae-37320452195f.jpg';
        END CASE;
      END IF;
      
      -- 插入配置
      INSERT INTO secretary_outfit_images (secretary_avatar_id, outfit_id, image_url)
      VALUES (secretary_record.id, outfit_record.id, image_url);
      
    END LOOP;
  END LOOP;
  
  RAISE NOTICE '已为所有15个秘书配置所有52种服装的立绘，共 % 个组合', 
    (SELECT COUNT(*) FROM secretary_outfit_images);
END $$;

-- 验证配置结果
SELECT 
  sa.name as secretary_name,
  COUNT(soi.id) as outfit_count
FROM secretary_avatars sa
LEFT JOIN secretary_outfit_images soi ON sa.id = soi.secretary_id
GROUP BY sa.id, sa.name
ORDER BY sa.name;

-- 显示总数
SELECT COUNT(*) as total_combinations FROM secretary_outfit_images;
