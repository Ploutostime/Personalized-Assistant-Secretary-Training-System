import { useState, useEffect, useRef } from 'react';
import { X, MessageCircle, Minimize2, Maximize2, Volume2, VolumeX, Heart, Coffee, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import SecretaryChat from './SecretaryChat';
import {
  voiceManager,
  getSecretaryVoiceConfig,
  getRandomPhrase,
} from '@/utils/voiceManager';
import type { SecretaryAvatar } from '@/types/types';

interface FloatingSecretary2DProps {
  secretary: SecretaryAvatar;
  userId: string;
  onClose?: () => void;
}

export default function FloatingSecretary2D({ secretary, userId, onClose }: FloatingSecretary2DProps) {
  const [position, setPosition] = useState({ x: window.innerWidth - 250, y: window.innerHeight - 400 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [animation, setAnimation] = useState<'idle' | 'talking' | 'thinking'>('idle');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [dialogText, setDialogText] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const floatingRef = useRef<HTMLDivElement>(null);
  const dialogTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 从 localStorage 加载位置
  useEffect(() => {
    const savedPosition = localStorage.getItem('secretary-2d-position');
    if (savedPosition) {
      const pos = JSON.parse(savedPosition);
      setPosition(pos);
    }
  }, []);

  // 保存位置到 localStorage
  useEffect(() => {
    localStorage.setItem('secretary-2d-position', JSON.stringify(position));
  }, [position]);

  // 拖拽开始
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.no-drag')) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  // 拖拽中
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // 限制在屏幕范围内
      const maxX = window.innerWidth - 200;
      const maxY = window.innerHeight - 300;

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // 随机动画效果
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTalking && Math.random() > 0.7) {
        setAnimation('thinking');
        setTimeout(() => setAnimation('idle'), 2000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isTalking]);

  // 显示对话气泡
  const showDialogMessage = (text: string, duration = 3000) => {
    setDialogText(text);
    setShowDialog(true);
    setAnimation('talking');

    // 清除之前的定时器
    if (dialogTimerRef.current) {
      clearTimeout(dialogTimerRef.current);
    }

    // 设置新的定时器
    dialogTimerRef.current = setTimeout(() => {
      setShowDialog(false);
      setAnimation('idle');
    }, duration);
  };

  // 播放语音并显示对话
  const speakWithDialog = (type: 'greeting' | 'comment' | 'encouragement' | 'reminder') => {
    const config = getSecretaryVoiceConfig(secretary.type);
    let phrase = '';

    switch (type) {
      case 'greeting':
        phrase = getRandomPhrase(config.greetings);
        break;
      case 'comment':
        phrase = getRandomPhrase(config.comments);
        break;
      case 'encouragement':
        phrase = getRandomPhrase(config.encouragements);
        break;
      case 'reminder':
        phrase = getRandomPhrase(config.reminders);
        break;
    }

    showDialogMessage(phrase);

    if (voiceEnabled) {
      voiceManager.speak(phrase, {
        secretaryType: secretary.type,
      });
    }
  };

  // 点击秘书互动
  const handleSecretaryClick = () => {
    if (isMinimized) return;
    speakWithDialog('greeting');
  };

  // 鼓励互动
  const handleEncourage = () => {
    speakWithDialog('encouragement');
  };

  // 提醒学习
  const handleRemind = () => {
    speakWithDialog('reminder');
  };

  // 切换语音
  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (!voiceEnabled) {
      voiceManager.stop();
    }
  };

  // 获取动画类名
  const getAnimationClass = () => {
    switch (animation) {
      case 'talking':
        return 'animate-bounce-subtle';
      case 'thinking':
        return 'animate-sway';
      default:
        return 'animate-float';
    }
  };

  if (isMinimized) {
    return (
      <div
        className="fixed z-50 cursor-move"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        onMouseDown={handleMouseDown}
      >
        <Card className="p-2 shadow-lg bg-background/95 backdrop-blur">
          <div className="flex items-center gap-2">
            <img
              src={secretary.avatar_url || ''}
              alt={secretary.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="text-sm font-medium">{secretary.name}</span>
            <Button
              variant="ghost"
              size="icon"
              className="no-drag h-6 w-6"
              onClick={() => setIsMinimized(false)}
            >
              <Maximize2 className="w-3 h-3" />
            </Button>
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                className="no-drag h-6 w-6"
                onClick={onClose}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div
        ref={floatingRef}
        className="fixed z-50 cursor-move select-none"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        onMouseDown={handleMouseDown}
      >
        <Card className="relative overflow-hidden shadow-2xl bg-gradient-to-b from-background/95 to-background/90 backdrop-blur border-2">
          {/* 控制按钮 */}
          <div className="absolute top-2 right-2 z-10 flex gap-1 no-drag">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 bg-background/80 hover:bg-background"
              onClick={toggleVoice}
              title={voiceEnabled ? '关闭语音' : '开启语音'}
            >
              {voiceEnabled ? (
                <Volume2 className="w-3 h-3" />
              ) : (
                <VolumeX className="w-3 h-3" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 bg-background/80 hover:bg-background"
              onClick={() => setShowChat(!showChat)}
              title="对话"
            >
              <MessageCircle className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 bg-background/80 hover:bg-background"
              onClick={() => setIsMinimized(true)}
              title="最小化"
            >
              <Minimize2 className="w-3 h-3" />
            </Button>
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 bg-background/80 hover:bg-background"
                onClick={onClose}
                title="关闭"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>

          {/* 秘书形象 */}
          <div 
            className="relative w-48 h-64 flex items-end justify-center overflow-hidden cursor-pointer hover:bg-primary/5 transition-colors"
            onClick={handleSecretaryClick}
          >
            {/* 背景装饰 */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/10" />
            
            {/* 秘书图片 */}
            <img
              src={secretary.full_body_url || secretary.avatar_url || ''}
              alt={secretary.name}
              className={`relative h-full w-auto object-contain object-bottom transition-all duration-300 ${getAnimationClass()}`}
              style={{
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
              }}
            />

            {/* 对话气泡 */}
            {showDialog && (
              <div className="absolute top-4 left-2 right-2 bg-white dark:bg-gray-800 backdrop-blur rounded-lg p-2 shadow-lg animate-fade-in border border-primary/20">
                <p className="text-xs text-foreground">{dialogText}</p>
                <div className="absolute -bottom-2 left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-gray-800" />
              </div>
            )}
          </div>

          {/* 秘书信息和互动按钮 */}
          <div className="p-3 border-t bg-background/50 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm">{secretary.name}</h3>
                <p className="text-xs text-muted-foreground">{secretary.description}</p>
              </div>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${animation === 'idle' ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`} />
              </div>
            </div>
            
            {/* 互动按钮 */}
            <div className="flex items-center gap-1 no-drag">
              <Button
                variant="outline"
                size="sm"
                className="h-7 flex-1 text-xs"
                onClick={handleEncourage}
                title="鼓励我"
              >
                <Heart className="w-3 h-3 mr-1" />
                鼓励
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 flex-1 text-xs"
                onClick={handleRemind}
                title="提醒学习"
              >
                <BookOpen className="w-3 h-3 mr-1" />
                提醒
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* 对话窗口 */}
      {showChat && (
        <div
          className="fixed z-50"
          style={{
            left: `${Math.min(position.x + 220, window.innerWidth - 420)}px`,
            top: `${position.y}px`,
            width: '400px',
            height: '500px',
          }}
        >
          <SecretaryChat
            secretaryConfig={{
              name: secretary.name,
              avatarType: secretary.type,
              personalityType: 'gentle',
            }}
            userId={userId}
            onClose={() => setShowChat(false)}
          />
        </div>
      )}

      {/* 自定义动画样式 */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes sway {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-2deg);
          }
          75% {
            transform: rotate(2deg);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 0.5s ease-in-out infinite;
        }

        .animate-sway {
          animation: sway 2s ease-in-out;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
