-- 创建秘书服装立绘关联表
CREATE TABLE secretary_outfit_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  secretary_avatar_id UUID NOT NULL REFERENCES secretary_avatars(id) ON DELETE CASCADE,
  outfit_id UUID NOT NULL REFERENCES secretary_outfits(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(secretary_avatar_id, outfit_id)
);

-- 创建索引
CREATE INDEX idx_secretary_outfit_images_avatar ON secretary_outfit_images(secretary_avatar_id);
CREATE INDEX idx_secretary_outfit_images_outfit ON secretary_outfit_images(outfit_id);

-- 启用 RLS
ALTER TABLE secretary_outfit_images ENABLE ROW LEVEL SECURITY;

-- RLS 策略：所有认证用户可以查看
CREATE POLICY "认证用户可以查看秘书服装立绘" ON secretary_outfit_images
  FOR SELECT TO authenticated USING (true);

-- 管理员可以管理
CREATE POLICY "管理员可以管理秘书服装立绘" ON secretary_outfit_images
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- 注释
COMMENT ON TABLE secretary_outfit_images IS '秘书服装立绘关联表：存储每个秘书穿着不同服装的立绘图片';
COMMENT ON COLUMN secretary_outfit_images.secretary_avatar_id IS '秘书形象ID';
COMMENT ON COLUMN secretary_outfit_images.outfit_id IS '服装ID';
COMMENT ON COLUMN secretary_outfit_images.image_url IS '秘书穿着该服装的立绘图片URL';