import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Settings, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserSecretaryConfig, generateSecretaryGreeting } from '@/db/api';
import type { SecretaryConfig } from '@/types/types';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import SecretaryChat from './SecretaryChat';

export function SecretaryAssistant() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [config, setConfig] = useState<SecretaryConfig | null>(null);
  const [greeting, setGreeting] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showChatDialog, setShowChatDialog] = useState(false);

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

  // 获取形象图片
  const getAvatarImage = () => {
    if (!config.avatar || !config.avatar.avatar_url) return null;
    return config.avatar.avatar_url;
  };

  // 获取全身立绘图片
  const getFullBodyImage = () => {
    if (!config.avatar || !config.avatar.full_body_url) return null;
    return config.avatar.full_body_url;
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
          {/* 秘书2D形象 */}
          <div className="flex-shrink-0">
            <div className="w-48 h-56 rounded-lg overflow-hidden bg-gradient-to-b from-primary/5 to-secondary/10 flex items-end justify-center">
              {getFullBodyImage() ? (
                <img
                  src={getFullBodyImage()!}
                  alt={config.name}
                  className="h-full w-auto object-contain object-bottom animate-float"
                  style={{
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                  }}
                />
              ) : getAvatarImage() ? (
                <img
                  src={getAvatarImage()!}
                  alt={config.name}
                  className="w-32 h-32 rounded-full object-cover animate-float"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center text-6xl">
                  {getAvatarIcon()}
                </div>
              )}
            </div>
          </div>

          {/* 问候语和操作 */}
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <p className="text-lg leading-relaxed">{greeting}</p>
              
              {/* 秘书信息 */}
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                {config.avatar && (
                  <span className="px-2 py-1 bg-background/60 rounded">
                    {config.avatar.name}
                  </span>
                )}
                {config.personality && (
                  <span className="px-2 py-1 bg-background/60 rounded">
                    {config.personality.name}
                  </span>
                )}
                {config.outfit && (
                  <span className="px-2 py-1 bg-background/60 rounded">
                    {config.outfit.name}
                  </span>
                )}
              </div>
            </div>

            {/* AI对话按钮 */}
            <Button
              onClick={() => setShowChatDialog(true)}
              className="gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              与 {config.name} 对话
            </Button>
          </div>
        </div>

        {/* AI对话弹窗 */}
        {showChatDialog && user && (
          <Dialog open={showChatDialog} onOpenChange={setShowChatDialog}>
            <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0">
              <SecretaryChat
                secretaryConfig={{
                  name: config.name,
                  avatarType: config.avatar?.type || 'oneesan',
                  personalityType: config.personality?.type || 'gentle',
                }}
                userId={user.id}
                onClose={() => setShowChatDialog(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </CardContent>

      {/* CSS动画样式 */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </Card>
  );
}
