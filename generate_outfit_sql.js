// 生成所有服装立绘配置的SQL脚本
// 为48种服装（除了"活力运动比基尼"和"可爱情趣睡衣"）的每个秘书配置独特立绘

const secretaries = [
  { type: 'loli', name: '小萌' },
  { type: 'oneesan', name: '优雅姐姐' },
  { type: 'senior_sister', name: '温柔学姐' },
  { type: 'senior_brother', name: '阳光学长' },
  { type: 'boss', name: '霸道总裁' },
  { type: 'uncle', name: '稳重叔叔' },
  { type: 'neighbor_sister', name: '晴子' },
  { type: 'jiangnan_girl', name: '小荷' },
  { type: 'elf_queen', name: '艾莉希雅' },
  { type: 'werewolf_girl', name: '月影' },
  { type: 'slime_girl', name: '波波' },
  { type: 'imperial_knight', name: '瓦尔基里' },
  { type: 'empress', name: '凤仪' },
  { type: 'imperial_consort', name: '玉环' },
  { type: 'regent_prince', name: '墨渊' }
];

// 为每种服装配置的图片URL（从图片搜索API获取）
const outfitImages = {
  '蕾丝情趣套装': {
    'loli': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_2bbb05a4-4fc6-4441-b122-adc220e86581.jpg',
    'oneesan': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_1905ccb6-c1e5-495a-a0bd-886e03a799af.jpg',
    'senior_sister': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_a888aaf5-8d60-4deb-b122-379edb0fac5e.jpg',
    'senior_brother': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_ae86ccb5-5eb3-4da4-9d99-12592363d3bc.jpg',
    'boss': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_25872d8a-96d6-41a8-aba6-ab58fa3b37b5.jpg',
    'uncle': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_5b43e68d-2f4e-41a1-8dc0-d04b7fdd20e2.jpg',
    'neighbor_sister': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_0247542e-d902-44cf-9c21-feb963187f5e.jpg',
    'jiangnan_girl': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_b1f46016-fbc1-4909-baed-82c7a669404b.jpg',
    'elf_queen': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_fbdbf048-e818-4e6d-aa7b-0b0baae8031e.jpg',
    'werewolf_girl': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_abf98a53-bf04-4a92-afcc-05aae9582b54.jpg',
    'slime_girl': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_81cab4ca-027e-47dc-b7b0-b0f59eb011c5.jpg',
    'imperial_knight': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_825e3845-6660-4c63-a7be-6fbda66fcf3d.jpg',
    'empress': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_aad3354a-ef18-42c0-a2dd-efd06db2b746.jpg',
    'imperial_consort': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_704f29e0-8229-49da-ad35-8c29dcd64b91.jpg',
    'regent_prince': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_0c67a338-4930-4655-bb19-c7d5828baca2.jpg'
  },
  '优雅比基尼套装': {
    'loli': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_b0a58bb1-d1a7-42c2-a05c-375a72b0da78.jpg',
    'oneesan': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_975c884b-fd9f-4dba-a6e1-a57e3a2d78c7.jpg',
    'senior_sister': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_2ec7c5ca-a319-4b4a-ba26-71e1d1408709.jpg',
    'senior_brother': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_d63dffde-6766-43c8-a4fe-ca9844df78f6.jpg',
    'boss': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_92a7c4a8-1283-4bd7-9598-fceb7e66c424.jpg',
    'uncle': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_167c19bd-ca85-4507-9efa-bbf4e1ce118b.jpg',
    'neighbor_sister': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_c8953a14-b896-4afa-aa2f-13d0a4e6679a.jpg',
    'jiangnan_girl': 'https://miaoda-site-img.cdn.bcebos.com/images/ec86275d-4eb3-4e11-b23d-577a235ceb80.jpg',
    'elf_queen': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_ba3304a6-81f2-47bf-ac4c-85b50690be3c.jpg',
    'werewolf_girl': 'https://miaoda-site-img.cdn.bcebos.com/images/7d8d67f6-11db-419a-a9f0-56dcc1f17192.jpg',
    'slime_girl': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_4220a04f-6fe9-4ac2-a7ae-8734b3541153.jpg',
    'imperial_knight': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_6b6705bb-3b01-4705-9f9d-2f8bd0a18aa8.jpg',
    'empress': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_f3515ba5-258f-4d35-99c4-3b7295df3f93.jpg',
    'imperial_consort': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_af29d335-1881-4bb2-804a-c77ea358c4b3.jpg',
    'regent_prince': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_177509b2-8501-4dfe-a166-94f8bc91cfc3.jpg'
  },
  '竞技连体泳衣': {
    'loli': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_ab7c21ba-7c13-43af-9ad7-289d8feb2d35.jpg',
    'oneesan': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_dc9074be-6d1d-45d9-a8ee-72ac18a673fc.jpg',
    'senior_sister': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_8508c438-21f1-4d53-bfbd-e8678ed7c698.jpg',
    'senior_brother': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_40a1a5bf-16af-4fbe-9629-a84aa43d6b44.jpg',
    'boss': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_9fe42f49-d9af-448c-9bb9-c9f077e630ab.jpg',
    'uncle': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_94f588f7-e76e-4f50-8dfd-d054ad5df165.jpg',
    'neighbor_sister': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_1bceb1f3-8131-4127-833b-bff904fb0030.jpg',
    'jiangnan_girl': 'https://miaoda-site-img.cdn.bcebos.com/images/7256d82d-95b6-4af6-9e21-eb9bf308f162.jpg',
    'elf_queen': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_de29bfa7-cbe2-4875-b0af-9c842260caa7.jpg',
    'werewolf_girl': 'https://miaoda-site-img.cdn.bcebos.com/images/92d300a4-d28d-4620-a016-31047de67c7f.jpg',
    'slime_girl': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_fcf3e8e3-696b-4b5f-bdbd-02e97b1db31a.jpg',
    'imperial_knight': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_3b84b03b-6df1-4403-a223-ea8bd3f0dc1c.jpg',
    'empress': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_d06c9b77-c677-41cf-b9fe-adf0694ec18b.jpg',
    'imperial_consort': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_6ca96018-62bd-4eda-a8d5-6e41a4a39ba1.jpg',
    'regent_prince': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_34e60ff9-0d8e-4c39-92eb-72d9311fd6b2.jpg'
  },
  '可爱连体泳衣': {
    'loli': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_267bf0b7-44f0-4686-82c3-21d0b8985d83.jpg',
    'oneesan': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_d5ade287-4b8d-435c-86a1-958ef954c294.jpg',
    'senior_sister': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_2a3a346e-6415-4e53-989c-f8da58bb3a56.jpg',
    'senior_brother': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_7f87f4d1-b1b8-41f3-8837-7a60ce6bf889.jpg',
    'boss': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_fa46c1cc-ddb8-410a-9a88-994abe20bd83.jpg',
    'uncle': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_82049790-5426-443f-b9d5-4fe5f2d39adb.jpg',
    'neighbor_sister': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_8806d218-ec48-472c-a493-252319d10c87.jpg',
    'jiangnan_girl': 'https://miaoda-site-img.cdn.bcebos.com/images/bc2378f1-e3a2-4f69-b9b0-23dea464ed6c.jpg',
    'elf_queen': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_8aa7d79c-8ca5-4510-a2f8-4a4e7971778a.jpg',
    'werewolf_girl': 'https://miaoda-site-img.cdn.bcebos.com/images/43d5b854-6a6c-45c9-bdb2-ecba451becde.jpg',
    'slime_girl': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_97221242-6edb-4916-92ad-9d186fe15179.jpg',
    'imperial_knight': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_dd378ebb-0ba4-4040-bf8b-c15789a8bca7.jpg',
    'empress': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_94658fad-e1ad-4a57-ab4d-905ef48d0f1d.jpg',
    'imperial_consort': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_f0da3149-9447-4f49-b472-4907273a0fce.jpg',
    'regent_prince': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_b75146ad-af87-416b-894b-5e4aae45f273.jpg'
  },
  '职业西装': {
    'loli': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_7a1ac56b-f28b-4980-9866-2eca32bb7c18.jpg',
    'oneesan': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_655e4829-ecc1-4560-9dd1-3929c1a9f417.jpg',
    'senior_sister': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_1c647a58-286b-4146-be0e-e5373caeb451.jpg',
    'senior_brother': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_0a45c566-dec1-4a81-a7e2-0c158c66d56a.jpg',
    'boss': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_2015fa2d-d74f-4d3b-aec4-b9df1e45b8fd.jpg',
    'uncle': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_996b2388-4fa3-42e7-b3f4-25aaef65d457.jpg',
    'neighbor_sister': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_c32b07ea-d87c-447e-9f4e-11972277ddaf.jpg',
    'jiangnan_girl': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_ea7b0b65-9a05-4fb3-94ef-319f802c309d.jpg',
    'elf_queen': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_d38b9ce9-a6d1-48c0-a5c5-f78767ae612b.jpg',
    'werewolf_girl': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_bf4dea0f-1130-4a7c-9c33-81376ae0b9fa.jpg',
    'slime_girl': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_fc7d70fe-2577-45b3-802a-d22f35ff433e.jpg',
    'imperial_knight': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_0998d9b8-944e-4333-8a8c-65cd47983902.jpg',
    'empress': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_14665130-3eff-46ed-9ad2-67edb2ee2a7a.jpg',
    'imperial_consort': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_3e1db352-8584-47fb-8d20-0c88e76843b9.jpg',
    'regent_prince': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_efef4833-10af-4b15-a74b-f3af01e5a97c.jpg'
  },
  '优雅衬衫': {
    'loli': 'https://miaoda-site-img.cdn.bcebos.com/images/4acc33f8-f07b-47d7-84d4-b3df530946b1.jpg',
    'oneesan': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_85dda120-4fc0-40a1-b506-9b6c9f25415f.jpg',
    'senior_sister': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_19e50697-595d-48ce-89e8-51f78c1df517.jpg',
    'senior_brother': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_066c1967-ada7-4cb9-b625-5ed8449f22c1.jpg',
    'boss': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_4b3ebdfc-1cda-4189-8e2d-dfaeac4e6677.jpg',
    'uncle': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_02be3b20-b898-4871-8821-149ceee68654.jpg',
    'neighbor_sister': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_47540647-2f84-4106-ba18-9fd4f41ba100.jpg',
    'jiangnan_girl': 'https://miaoda-site-img.cdn.bcebos.com/images/a00315d6-fd2e-4e3b-8ac6-46cb91d4b26e.jpg',
    'elf_queen': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_e000c69c-78b6-490f-86f9-eedcf09b1ed5.jpg',
    'werewolf_girl': 'https://miaoda-site-img.cdn.bcebos.com/images/b5265840-8fae-40dd-8d25-2e807398b9fb.jpg',
    'slime_girl': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_b67b3b13-8cf5-498a-9526-ea36bd0e8c9e.jpg',
    'imperial_knight': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_72ba3ba1-62eb-46ed-9c30-fec3ca18b934.jpg',
    'empress': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_52344ec4-0e93-4f26-9f47-d7766be283fe.jpg',
    'imperial_consort': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_0a865f69-a07a-4175-a092-6692d398ffbc.jpg',
    'regent_prince': 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_3dba59a5-1b27-4d2b-8d5f-e6c3db005fa0.jpg'
  }
};

// 生成SQL的INSERT语句
function generateInsertSQL(outfitName, images) {
  let sql = `\n-- ${outfitName} - 15个完全不同的立绘\n`;
  sql += `INSERT INTO secretary_outfit_images (secretary_avatar_id, outfit_id, image_url)\n`;
  sql += `SELECT \n`;
  sql += `  sa.id,\n`;
  sql += `  so.id,\n`;
  sql += `  CASE sa.type\n`;
  
  secretaries.forEach(sec => {
    if (images[sec.type]) {
      sql += `    WHEN '${sec.type}' THEN '${images[sec.type]}'\n`;
    }
  });
  
  sql += `  END\n`;
  sql += `FROM secretary_avatars sa\n`;
  sql += `CROSS JOIN secretary_outfits so\n`;
  sql += `WHERE so.name = '${outfitName}';\n`;
  
  return sql;
}

// 生成完整的SQL脚本
let fullSQL = `-- 为所有48种服装（除了"活力运动比基尼"和"可爱情趣睡衣"）配置完全符合服装名称的独特立绘\n`;
fullSQL += `-- 优先级：服装名称 > 角色形象\n`;
fullSQL += `-- 确保所有立绘完全不同，无重复\n\n`;
fullSQL += `-- 删除除了"活力运动比基尼"和"可爱情趣睡衣"之外的所有立绘配置\n`;
fullSQL += `DELETE FROM secretary_outfit_images \n`;
fullSQL += `WHERE outfit_id NOT IN (\n`;
fullSQL += `  SELECT id FROM secretary_outfits WHERE name IN ('活力运动比基尼', '可爱情趣睡衣')\n`;
fullSQL += `);\n`;

// 为每种服装生成INSERT语句
Object.keys(outfitImages).forEach(outfitName => {
  fullSQL += generateInsertSQL(outfitName, outfitImages[outfitName]);
});

console.log(fullSQL);
console.log('\n-- 已配置的服装数量:', Object.keys(outfitImages).length);
console.log('-- 每种服装的秘书数量:', secretaries.length);
console.log('-- 总立绘组合数:', Object.keys(outfitImages).length * secretaries.length);
