import { useState, useEffect, useRef } from 'react';
import { X, Minimize2, Maximize2, MessageCircle, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  voiceManager,
  getSecretaryVoiceConfig,
  getRandomPhrase,
} from '@/utils/voiceManager';

interface DesktopPetProps {
  secretaryName: string;
  secretaryType: string;
  imageUrl: string;
  onClose?: () => void;
}

export function DesktopPet({
  secretaryName,
  secretaryType,
  imageUrl,
  onClose,
}: DesktopPetProps) {
  // 位置状态
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // 显示状态
  const [isMinimized, setIsMinimized] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogText, setDialogText] = useState('');
  
  // 语音状态
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  // 引用
  const petRef = useRef<HTMLDivElement>(null);
  const dialogTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 从localStorage加载位置
  useEffect(() => {
    const savedPosition = localStorage.getItem('desktopPetPosition');
    if (savedPosition) {
      try {
        const pos = JSON.parse(savedPosition);
        setPosition(pos);
      } catch (e) {
        console.error('加载宠物位置失败:', e);
      }
    }
  }, []);

  // 保存位置到localStorage
  useEffect(() => {
    localStorage.setItem('desktopPetPosition', JSON.stringify(position));
  }, [position]);

  // 鼠标按下开始拖拽
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMinimized) return;
    
    setIsDragging(true);
    const rect = petRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  // 鼠标移动
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // 限制在窗口范围内
      const maxX = window.innerWidth - (petRef.current?.offsetWidth || 200);
      const maxY = window.innerHeight - (petRef.current?.offsetHeight || 300);

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

  // 显示对话
  const showDialogMessage = (text: string, duration = 3000) => {
    setDialogText(text);
    setShowDialog(true);

    // 清除之前的定时器
    if (dialogTimerRef.current) {
      clearTimeout(dialogTimerRef.current);
    }

    // 设置新的定时器
    dialogTimerRef.current = setTimeout(() => {
      setShowDialog(false);
    }, duration);
  };

  // 点击秘书互动
  const handlePetClick = () => {
    if (isMinimized) return;

    const config = getSecretaryVoiceConfig(secretaryType);
    const greeting = getRandomPhrase(config.greetings);

    // 显示对话气泡
    showDialogMessage(greeting);

    // 播放语音
    if (voiceEnabled) {
      voiceManager.speak(greeting, {
        pitch: config.pitch,
        rate: config.rate,
        volume: config.volume,
      });
    }
  };

  // 说鼓励的话
  const handleEncourage = () => {
    const config = getSecretaryVoiceConfig(secretaryType);
    const encouragement = getRandomPhrase(config.encouragements);

    showDialogMessage(encouragement);

    if (voiceEnabled) {
      voiceManager.speak(encouragement, {
        pitch: config.pitch,
        rate: config.rate,
        volume: config.volume,
      });
    }
  };

  // 提醒学习
  const handleRemind = () => {
    const config = getSecretaryVoiceConfig(secretaryType);
    const reminder = getRandomPhrase(config.reminders);

    showDialogMessage(reminder);

    if (voiceEnabled) {
      voiceManager.speak(reminder, {
        pitch: config.pitch,
        rate: config.rate,
        volume: config.volume,
      });
    }
  };

  // 切换最小化
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (!isMinimized) {
      setShowDialog(false);
    }
  };

  // 切换语音
  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (!voiceEnabled) {
      voiceManager.stop();
    }
  };

  return (
    <div
      ref={petRef}
      className={cn(
        'fixed z-50 transition-all duration-300',
        isDragging && 'cursor-grabbing',
        !isDragging && !isMinimized && 'cursor-grab'
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: isMinimized ? '200px' : '250px',
      }}
    >
      <Card className="overflow-hidden shadow-2xl border-2 border-primary/20">
        {/* 标题栏 */}
        <div
          className="bg-gradient-to-r from-primary to-secondary p-2 flex items-center justify-between cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-semibold text-primary-foreground">
              {secretaryName}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-primary-foreground hover:bg-primary-foreground/20"
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
              size="sm"
              className="h-6 w-6 p-0 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={toggleMinimize}
              title={isMinimized ? '展开' : '最小化'}
            >
              {isMinimized ? (
                <Maximize2 className="w-3 h-3" />
              ) : (
                <Minimize2 className="w-3 h-3" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={onClose}
              title="关闭"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* 内容区域 */}
        {!isMinimized && (
          <div className="relative">
            {/* 对话气泡 */}
            {showDialog && (
              <div className="absolute top-2 left-2 right-2 z-10 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg border border-primary/20">
                  <p className="text-sm text-foreground">{dialogText}</p>
                  <div className="absolute -bottom-2 left-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white dark:border-t-gray-800" />
                </div>
              </div>
            )}

            {/* 秘书立绘 */}
            <div
              className="relative bg-gradient-to-b from-primary/5 to-secondary/5 cursor-pointer hover:from-primary/10 hover:to-secondary/10 transition-colors"
              onClick={handlePetClick}
            >
              <img
                src={imageUrl}
                alt={secretaryName}
                className="w-full h-auto object-contain"
                style={{ maxHeight: '300px' }}
              />
            </div>

            {/* 互动按钮 */}
            <div className="p-2 bg-card flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEncourage}
                title="鼓励我"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                鼓励
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemind}
                title="提醒学习"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                提醒
              </Button>
            </div>
          </div>
        )}

        {/* 最小化状态 */}
        {isMinimized && (
          <div className="p-3 flex items-center gap-2">
            <img
              src={imageUrl}
              alt={secretaryName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <span className="text-sm text-muted-foreground">已最小化</span>
          </div>
        )}
      </Card>
    </div>
  );
}
