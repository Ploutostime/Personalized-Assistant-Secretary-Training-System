import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserSecretaryConfig, generateSecretaryGreeting } from '@/db/api';
import type { SecretaryConfig } from '@/types/types';
import { useNavigate } from 'react-router-dom';

export function SecretaryAssistant() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [config, setConfig] = useState<SecretaryConfig | null>(null);
  const [greeting, setGreeting] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSecretaryConfig();
  }, [user]);

  const loadSecretaryConfig = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const secretaryConfig = await getUserSecretaryConfig(user.id);
      setConfig(secretaryConfig);

      if (secretaryConfig && secretaryConfig.enabled) {
        const greetingText = generateSecretaryGreeting(
          secretaryConfig.personality,
          secretaryConfig.name,
          user.email?.split('@')[0]
        );
        setGreeting(greetingText);
      }
    } catch (error) {
      console.error('加载秘书配置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">加载中...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!config || !config.enabled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            专属学习秘书
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              还没有设置你的专属学习秘书哦~
            </p>
            <Button onClick={() => navigate('/settings')}>
              <Settings className="w-4 h-4 mr-2" />
              立即设置
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 获取形象图标
  const getAvatarIcon = () => {
    if (!config.avatar) return '👤';
    const iconMap: Record<string, string> = {
      loli: '🌸',
      oneesan: '💐',
      uncle: '🎩',
      boss: '👔',
      senior_sister: '📚',
      senior_brother: '⚡',
    };
    return iconMap[config.avatar.type] || '👤';
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            {config.name}的问候
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/settings')}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-4">
          {/* 秘书形象 */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-4xl">
              {getAvatarIcon()}
            </div>
          </div>

          {/* 问候语 */}
          <div className="flex-1">
            <div className="bg-background/80 rounded-lg p-4 shadow-sm">
              <p className="text-sm leading-relaxed">{greeting}</p>
            </div>

            {/* 秘书信息 */}
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
              {config.avatar && (
                <span className="px-2 py-1 bg-background/60 rounded">
                  形象：{config.avatar.name}
                </span>
              )}
              {config.personality && (
                <span className="px-2 py-1 bg-background/60 rounded">
                  性格：{config.personality.name}
                </span>
              )}
              {config.outfit && (
                <span className="px-2 py-1 bg-background/60 rounded">
                  服装：{config.outfit.name}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
