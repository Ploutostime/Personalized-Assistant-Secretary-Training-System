import { useEffect, useState, useRef } from 'react';
import { X, Minimize2, Maximize2, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserSecretaryConfig, generateSecretaryGreeting, generateSecretaryReminder, generateSecretaryEncouragement, getUpcomingTasks } from '@/db/api';
import type { SecretaryConfig } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Position {
  x: number;
  y: number;
}

export function FloatingSecretary() {
  const { user } = useAuth();
  const [config, setConfig] = useState<SecretaryConfig | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [position, setPosition] = useState<Position>({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'greeting' | 'reminder' | 'encouragement'>('greeting');
  const floatingRef = useRef<HTMLDivElement>(null);

  // 加载秘书配置
  useEffect(() => {
    loadSecretaryConfig();
  }, [user]);

  // 定时更新消息
  useEffect(() => {
    if (!config || !config.enabled) return;

    updateMessage();
    const interval = setInterval(() => {
      updateMessage();
    }, 60000); // 每分钟更新一次

    return () => clearInterval(interval);
  }, [config, user]);

  // 从 localStorage 加载位置
  useEffect(() => {
    const savedPosition = localStorage.getItem('secretary_position');
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    } else {
      // 默认位置：右下角
      setPosition({
        x: window.innerWidth - 320,
        y: window.innerHeight - 200,
      });
    }

    const savedMinimized = localStorage.getItem('secretary_minimized');
    if (savedMinimized) {
      setIsMinimized(savedMinimized === 'true');
    }

    const savedVisible = localStorage.getItem('secretary_visible');
    if (savedVisible) {
      setIsVisible(savedVisible === 'true');
    }
  }, []);

  // 保存位置到 localStorage
  useEffect(() => {
    localStorage.setItem('secretary_position', JSON.stringify(position));
  }, [position]);

  // 保存最小化状态
  useEffect(() => {
    localStorage.setItem('secretary_minimized', isMinimized.toString());
  }, [isMinimized]);

  // 保存可见状态
  useEffect(() => {
    localStorage.setItem('secretary_visible', isVisible.toString());
  }, [isVisible]);

  const loadSecretaryConfig = async () => {
    if (!user) return;

    try {
      const secretaryConfig = await getUserSecretaryConfig(user.id);
      setConfig(secretaryConfig);
    } catch (error) {
      console.error('加载秘书配置失败:', error);
    }
  };

  const updateMessage = async () => {
    if (!config || !user) return;

    const hour = new Date().getHours();
    const types: Array<'greeting' | 'reminder' | 'encouragement'> = [];

    // 根据时间决定消息类型
    if (hour >= 6 && hour < 12) {
      types.push('greeting');
    } else if (hour >= 12 && hour < 18) {
      types.push('reminder');
    } else {
      types.push('encouragement');
    }

    // 随机选择一个类型
    const type = types[Math.floor(Math.random() * types.length)];
    setMessageType(type);

    let message = '';
    if (type === 'greeting') {
      message = generateSecretaryGreeting(
        config.personality,
        config.name,
        user.email?.split('@')[0]
      );
    } else if (type === 'reminder') {
      // 获取即将到期的任务
      const tasks = await getUpcomingTasks(user.id, 3);
      if (tasks.length > 0) {
        message = generateSecretaryReminder(
          config.personality,
          config.name,
          tasks[0].title,
          '即将到期'
        );
      } else {
        message = generateSecretaryEncouragement(config.personality, config.name);
      }
    } else {
      message = generateSecretaryEncouragement(config.personality, config.name);
    }

    setCurrentMessage(message);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMinimized) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    // 限制在窗口范围内
    const maxX = window.innerWidth - (floatingRef.current?.offsetWidth || 300);
    const maxY = window.innerHeight - (floatingRef.current?.offsetHeight || 200);

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  // 获取形象图标
  const getAvatarIcon = () => {
    if (!config?.avatar) return '👤';
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

  // 如果未启用或不可见，不渲染
  if (!config || !config.enabled || !isVisible || !user) {
    return null;
  }

  return (
    <div
      ref={floatingRef}
      className="fixed z-50 transition-all duration-300"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      {isMinimized ? (
        // 最小化状态
        <Card
          className="p-3 shadow-lg hover:shadow-xl transition-shadow cursor-pointer bg-gradient-to-br from-primary/10 to-secondary/10"
          onClick={() => setIsMinimized(false)}
        >
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-2xl">
              {getAvatarIcon()}
            </div>
            <MessageCircle className="w-4 h-4 text-primary animate-pulse" />
          </div>
        </Card>
      ) : (
        // 展开状态
        <Card className="shadow-xl bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-sm">
          <div
            className="p-3 border-b cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xl">
                  {getAvatarIcon()}
                </div>
                <span className="font-semibold text-sm">{config.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setIsMinimized(true)}
                >
                  <Minimize2 className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setIsVisible(false)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 max-w-xs">
            {/* 对话气泡 */}
            <div className="relative bg-background/80 rounded-lg p-3 shadow-sm">
              <p className="text-sm leading-relaxed">{currentMessage}</p>
              {/* 气泡尾巴 */}
              <div className="absolute -bottom-2 left-4 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-background/80" />
            </div>

            {/* 秘书信息 */}
            <div className="mt-3 flex flex-wrap gap-1 text-xs text-muted-foreground">
              {config.avatar && (
                <span className="px-2 py-0.5 bg-background/60 rounded">
                  {config.avatar.name}
                </span>
              )}
              {config.personality && (
                <span className="px-2 py-0.5 bg-background/60 rounded">
                  {config.personality.name}
                </span>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
