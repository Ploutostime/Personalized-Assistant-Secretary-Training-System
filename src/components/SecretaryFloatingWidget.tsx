import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserSecretaryConfig, getSecretaryAvatarById } from '@/db/api';
import type { SecretaryConfig, SecretaryAvatar } from '@/types/types';
import FloatingSecretary2D from './FloatingSecretary2D';

export function SecretaryFloatingWidget() {
  const { user } = useAuth();
  const [config, setConfig] = useState<SecretaryConfig | null>(null);
  const [avatar, setAvatar] = useState<SecretaryAvatar | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    loadConfig();
  }, [user]);

  useEffect(() => {
    const savedVisible = localStorage.getItem('secretary-widget-visible');
    if (savedVisible !== null) {
      setIsVisible(savedVisible === 'true');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('secretary-widget-visible', isVisible.toString());
  }, [isVisible]);

  const loadConfig = async () => {
    if (!user) return;

    try {
      const secretaryConfig = await getUserSecretaryConfig(user.id);
      setConfig(secretaryConfig);

      if (secretaryConfig?.avatar_id) {
        const avatarData = await getSecretaryAvatarById(secretaryConfig.avatar_id);
        setAvatar(avatarData);
      }
    } catch (error) {
      console.error('加载秘书配置失败:', error);
    }
  };

  if (!user || !config || !config.enabled || !avatar || !isVisible) {
    return null;
  }

  return (
    <FloatingSecretary2D
      secretary={avatar}
      userId={user.id}
      onClose={() => setIsVisible(false)}
    />
  );
}
