# 秘书换装系统说明

## 系统概述

秘书换装系统允许同一个秘书角色穿着不同的服装，并显示对应的2D立绘。每个秘书可以拥有多套服装，每套服装都有专属的立绘图片。

## 数据库结构

### 核心表

1. **secretary_avatars** - 秘书形象表
   - 存储秘书的基本信息（名称、类型、描述等）
   - 每个秘书有唯一的ID

2. **secretary_outfits** - 服装表
   - 存储所有可用的服装信息
   - 包含42款不同风格的服装

3. **secretary_outfit_images** - 秘书服装立绘关联表（新增）
   - 存储每个秘书穿着特定服装的立绘图片
   - 关联秘书ID和服装ID
   - 每个组合有唯一的立绘URL

### 表关系

```
secretary_avatars (秘书)
    ↓ (1对多)
secretary_outfit_images (秘书+服装立绘)
    ↓ (多对1)
secretary_outfits (服装)
```

## 已配置的秘书立绘

### 1. 小萌（可爱萝莉）- 10套服装立绘

- 清新校园装 - 粉色校服，双马尾
- 天使护士装 - 白色护士装，粉色边线
- 经典女仆装 - 黑白女仆装，围裙
- 清新瑜伽服 - 粉色瑜伽服
- 可爱连体泳衣 - 粉色泳衣
- 甜美洛丽塔 - 粉色洛丽塔，蓬松裙摆
- 传统和服 - 粉色和服，樱花图案
- 可爱卡通睡衣 - 粉色睡衣
- 圣洁天使装 - 白色天使装，羽翼
- 舒适居家服 - 粉色居家服

### 2. 优雅姐姐（成熟御姐）- 10套服装立绘

- 职业OL套装 - 黑色OL职业装，白衬衫
- 知性教师装 - 米色教师装，眼镜
- 高级女仆装 - 黑色女仆长裙
- 专业瑜伽套装 - 紫色瑜伽装
- 优雅比基尼套装 - 白色比基尼，高腰
- 蕾丝情趣套装 - 黑色蕾丝情趣套装
- 经典旗袍 - 红色旗袍，金色刺绣
- 丝绸睡衣套装 - 深蓝丝绸睡衣
- 哥特洛丽塔 - 黑色哥特洛丽塔
- 优雅连衣裙 - 深蓝连衣裙

### 3. 温柔学姐 - 10套服装立绘

- 清新校园装 - 白色校服
- 天使护士装 - 粉色护士装
- 经典女仆装 - 黑白女仆装
- 清新瑜伽服 - 薰衣草绿瑜伽服
- 优雅网球裙 - 白色网球裙，百褶裙
- 甜美洛丽塔 - 粉色洛丽塔
- 现代改良和服 - 蓝白和服
- 清新夏日裙 - 碎花夏日裙
- 可爱卡通睡衣 - 粉色睡衣
- 舒适居家服 - 粉色居家服

## 前端使用方法

### 1. 查询秘书的服装立绘

```typescript
import { supabase } from '@/db/supabase';

// 获取指定秘书穿着指定服装的立绘
async function getSecretaryOutfitImage(
  secretaryAvatarId: string,
  outfitId: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from('secretary_outfit_images')
    .select('image_url')
    .eq('secretary_avatar_id', secretaryAvatarId)
    .eq('outfit_id', outfitId)
    .maybeSingle();

  if (error || !data) {
    console.error('获取秘书服装立绘失败:', error);
    return null;
  }

  return data.image_url;
}
```

### 2. 获取秘书的所有服装立绘

```typescript
// 获取秘书的所有可用服装立绘
async function getSecretaryAllOutfitImages(
  secretaryAvatarId: string
) {
  const { data, error } = await supabase
    .from('secretary_outfit_images')
    .select(`
      id,
      image_url,
      outfit:secretary_outfits(
        id,
        name,
        type,
        description
      )
    `)
    .eq('secretary_avatar_id', secretaryAvatarId);

  if (error) {
    console.error('获取秘书服装立绘列表失败:', error);
    return [];
  }

  return data;
}
```

### 3. 在组件中使用

```typescript
import { useState, useEffect } from 'react';

function SecretaryDisplay({ 
  secretaryId, 
  outfitId 
}: { 
  secretaryId: string; 
  outfitId: string; 
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadImage() {
      setLoading(true);
      const url = await getSecretaryOutfitImage(secretaryId, outfitId);
      setImageUrl(url);
      setLoading(false);
    }

    loadImage();
  }, [secretaryId, outfitId]);

  if (loading) {
    return <div>加载中...</div>;
  }

  if (!imageUrl) {
    return <div>暂无立绘</div>;
  }

  return (
    <img 
      src={imageUrl} 
      alt="秘书立绘" 
      className="w-full h-auto"
    />
  );
}
```

### 4. 换装功能实现

```typescript
function SecretaryWardrobe({ secretaryId }: { secretaryId: string }) {
  const [outfits, setOutfits] = useState<any[]>([]);
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(null);

  useEffect(() => {
    async function loadOutfits() {
      const data = await getSecretaryAllOutfitImages(secretaryId);
      setOutfits(data);
      if (data.length > 0) {
        setSelectedOutfitId(data[0].outfit.id);
      }
    }

    loadOutfits();
  }, [secretaryId]);

  return (
    <div className="flex gap-4">
      {/* 左侧：服装选择器 */}
      <div className="w-1/3 space-y-2">
        {outfits.map((item) => (
          <button
            key={item.outfit.id}
            onClick={() => setSelectedOutfitId(item.outfit.id)}
            className={`w-full p-2 rounded ${
              selectedOutfitId === item.outfit.id
                ? 'bg-primary text-white'
                : 'bg-secondary'
            }`}
          >
            {item.outfit.name}
          </button>
        ))}
      </div>

      {/* 右侧：立绘展示 */}
      <div className="w-2/3">
        {selectedOutfitId && (
          <SecretaryDisplay 
            secretaryId={secretaryId} 
            outfitId={selectedOutfitId} 
          />
        )}
      </div>
    </div>
  );
}
```

## 扩展方法

### 为更多秘书添加立绘

1. 使用 `image_search` 工具搜索对应秘书穿着特定服装的立绘
2. 将立绘URL插入到 `secretary_outfit_images` 表

```sql
INSERT INTO secretary_outfit_images (secretary_avatar_id, outfit_id, image_url)
VALUES 
  ('秘书ID', '服装ID', '立绘图片URL');
```

### 添加新服装

1. 在 `secretary_outfits` 表中添加新服装
2. 为每个秘书搜索穿着该服装的立绘
3. 插入到 `secretary_outfit_images` 表

## 注意事项

1. **立绘匹配**：确保立绘图片与秘书角色和服装风格匹配
2. **图片质量**：使用高质量的动漫风格立绘，全身展示
3. **风格统一**：同一秘书的不同服装立绘应保持角色特征一致
4. **性能优化**：使用图片懒加载和缓存策略
5. **回退方案**：如果没有特定组合的立绘，可以显示秘书的默认立绘或服装的通用立绘

## 数据统计

- 秘书总数：10个
- 已配置立绘的秘书：3个（小萌、优雅姐姐、温柔学姐）
- 服装总数：42款
- 已配置的立绘组合：30个（每个秘书10套）
- 待扩展：剩余7个秘书 × 42款服装 = 294个立绘组合

## 技术特点

1. **灵活性**：每个秘书可以独立配置服装立绘
2. **可扩展性**：轻松添加新秘书、新服装或新立绘
3. **数据完整性**：通过外键约束确保数据一致性
4. **查询效率**：通过索引优化查询性能
5. **权限控制**：通过RLS策略保护数据安全
