import { useState, useEffect } from 'react';
import { supabase } from '@/db/supabase';
import { DesktopPet } from './DesktopPet';
import type { SecretaryAvatar } from '@/types/types';

interface DesktopPetManagerProps {
  userId: string;
}

interface PetConfig {
  enabled: boolean;
  secretaryAvatarId: string | null;
  outfitId: string | null;
}

export function DesktopPetManager({ userId }: DesktopPetManagerProps) {
  const [petConfig, setPetConfig] = useState<PetConfig>({
    enabled: false,
    secretaryAvatarId: null,
    outfitId: null,
  });
  const [secretary, setSecretary] = useState<SecretaryAvatar | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  // 加载用户的秘书配置
  useEffect(() => {
    async function loadPetConfig() {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('secretary_avatar_id, secretary_outfit_id, secretary_enabled')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('加载秘书配置失败:', error);
        return;
      }

      if (data) {
        setPetConfig({
          enabled: data.secretary_enabled || false,
          secretaryAvatarId: data.secretary_avatar_id,
          outfitId: data.secretary_outfit_id,
        });
      }
    }

    loadPetConfig();
  }, [userId]);

  // 加载秘书信息和立绘
  useEffect(() => {
    if (!petConfig.enabled || !petConfig.secretaryAvatarId) {
      return;
    }

    async function loadSecretaryData() {
      // 加载秘书信息
      const { data: secretaryData, error: secretaryError } = await supabase
        .from('secretary_avatars')
        .select('*')
        .eq('id', petConfig.secretaryAvatarId)
        .maybeSingle();

      if (secretaryError || !secretaryData) {
        console.error('加载秘书信息失败:', secretaryError);
        return;
      }

      setSecretary(secretaryData);

      // 加载立绘
      if (petConfig.outfitId) {
        const { data: imageData, error: imageError } = await supabase
          .from('secretary_outfit_images')
          .select('image_url')
          .eq('secretary_avatar_id', petConfig.secretaryAvatarId)
          .eq('outfit_id', petConfig.outfitId)
          .maybeSingle();

        if (imageError || !imageData) {
          console.error('加载秘书立绘失败:', imageError);
          // 使用默认头像
          setImageUrl(secretaryData.avatar_url || '');
        } else {
          setImageUrl(imageData.image_url);
        }
      } else {
        // 使用默认头像
        setImageUrl(secretaryData.avatar_url || '');
      }
    }

    loadSecretaryData();
  }, [petConfig]);

  // 关闭宠物
  const handleClose = async () => {
    setPetConfig({ ...petConfig, enabled: false });

    // 更新数据库
    await supabase
      .from('user_preferences')
      .update({ secretary_enabled: false })
      .eq('user_id', userId);
  };

  // 如果未启用或没有配置，不显示
  if (!petConfig.enabled || !secretary || !imageUrl) {
    return null;
  }

  return (
    <DesktopPet
      secretaryName={secretary.name}
      secretaryType={secretary.type}
      imageUrl={imageUrl}
      onClose={handleClose}
    />
  );
}
