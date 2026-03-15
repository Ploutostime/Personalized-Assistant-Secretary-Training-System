import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2, MessageCircle, X, GripHorizontal, ChevronUp, ChevronDown } from 'lucide-react';
import { supabase } from '@/db/supabase';
import { getSecretaryAvatarByType } from '@/db/api';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface SecretaryChatProps {
  secretaryConfig: {
    name: string;
    avatarType: string;
    personalityType: string;
  };
  userId: string;
  onClose?: () => void;
}

export default function SecretaryChat({ secretaryConfig, userId, onClose }: SecretaryChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isAvatarCollapsed, setIsAvatarCollapsed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // 拖动相关状态
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // 缩放相关状态
  const [isResizing, setIsResizing] = useState(false);
  const [size, setSize] = useState({ width: 900, height: 600 });
  const [resizeHandle, setResizeHandle] = useState<'nw' | 'ne' | 'sw' | 'se' | null>(null);
  const resizeStartRef = useRef({
    mouseX: 0,
    mouseY: 0,
    width: 900,
    height: 600,
    x: 0,
    y: 0,
    handle: null as 'nw' | 'ne' | 'sw' | 'se' | null,
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    // 只有在 Header 上按下鼠标才触发拖动
    if ((e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - dragPosition.x,
        y: e.clientY - dragPosition.y
      });
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      setDragPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
      return;
    }

    if (isResizing) {
      const dx = e.clientX - resizeStartRef.current.mouseX;
      const dy = e.clientY - resizeStartRef.current.mouseY;
      const handle = resizeStartRef.current.handle;

      const minW = 520;
      const minH = 420;

      let nextW = resizeStartRef.current.width;
      let nextH = resizeStartRef.current.height;
      let nextX = resizeStartRef.current.x;
      let nextY = resizeStartRef.current.y;

      if (handle === 'se') {
        nextW = resizeStartRef.current.width + dx;
        nextH = resizeStartRef.current.height + dy;
      } else if (handle === 'sw') {
        nextW = resizeStartRef.current.width - dx;
        nextH = resizeStartRef.current.height + dy;
        nextX = resizeStartRef.current.x + dx;
      } else if (handle === 'ne') {
        nextW = resizeStartRef.current.width + dx;
        nextH = resizeStartRef.current.height - dy;
        nextY = resizeStartRef.current.y + dy;
      } else if (handle === 'nw') {
        nextW = resizeStartRef.current.width - dx;
        nextH = resizeStartRef.current.height - dy;
        nextX = resizeStartRef.current.x + dx;
        nextY = resizeStartRef.current.y + dy;
      }

      // clamp with position compensation for left/top handles
      if (nextW < minW) {
        if (handle === 'sw' || handle === 'nw') {
          // keep right edge fixed
          nextX -= (minW - nextW);
        }
        nextW = minW;
      }
      if (nextH < minH) {
        if (handle === 'ne' || handle === 'nw') {
          // keep bottom edge fixed
          nextY -= (minH - nextH);
        }
        nextH = minH;
      }

      setSize({ width: nextW, height: nextH });
      setDragPosition({ x: nextX, y: nextY });
    }
  }, [isDragging, dragOffset, isResizing]);

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, handleMouseMove]);

  // 加载秘书头像
  useEffect(() => {
    loadAvatar();
  }, [secretaryConfig.avatarType]);

  // 加载历史对话
  useEffect(() => {
    loadChatHistory();
  }, [userId]);

  // 自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadAvatar = async () => {
    try {
      const avatar = await getSecretaryAvatarByType(secretaryConfig.avatarType);
      if (avatar) {
        setAvatarUrl(avatar.avatar_url || '');
      }
    } catch (error) {
      console.error('加载秘书头像失败:', error);
    }
  };

  const loadChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('secretary_chat_history')
        .select('role, content, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;

      if (data) {
        setMessages(
          data
            .filter((msg) => msg.role !== 'system')
            .map((msg) => ({
              role: msg.role as 'user' | 'assistant',
              content: msg.content,
              timestamp: new Date(msg.created_at),
            }))
        );
      }
    } catch (error) {
      console.error('加载对话历史失败:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsTalking(true);

    try {
      const { data, error } = await supabase.functions.invoke('secretary-chat', {
        body: {
          message: userMessage.content,
          userId,
          secretaryConfig,
        },
      });

      if (error) {
        const errorMsg = await error?.context?.text();
        console.error('调用AI失败:', errorMsg || error?.message);
        throw new Error('对话失败，请稍后重试');
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // 模拟说话动画持续时间
      setTimeout(() => {
        setIsTalking(false);
      }, 2000);
    } catch (error: any) {
      console.error('发送消息失败:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: '抱歉，我现在有点忙，稍后再聊吧~',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsTalking(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card 
      className={cn(
        "flex flex-col transition-shadow relative select-none",
        isDragging ? "shadow-2xl ring-2 ring-primary/20" : "shadow-xl"
      )}
      style={{
        transform: `translate(${dragPosition.x}px, ${dragPosition.y}px)`,
        cursor: isDragging ? 'grabbing' : 'auto',
        width: `${size.width}px`,
        height: `${size.height}px`,
      }}
    >
      <CardHeader 
        className="flex flex-row items-center justify-between space-y-0 pb-4 drag-handle cursor-grab active:cursor-grabbing select-none border-b mb-2"
        onMouseDown={handleMouseDown}
      >
        <CardTitle className="flex items-center gap-2">
          <GripHorizontal className="w-4 h-4 text-muted-foreground" />
          <MessageCircle className="w-5 h-5 text-primary" />
          与 {secretaryConfig.name} 对话
        </CardTitle>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 min-h-0">
        {/* 秘书头像显示 - 可折叠 */}
        <div className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden relative group",
          isAvatarCollapsed ? "h-0 opacity-0 mb-[-1rem]" : "h-48 opacity-100"
        )}>
          <div className="w-full h-48 bg-gradient-to-b from-primary/5 to-secondary/10 rounded-lg flex items-center justify-center">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={secretaryConfig.name}
                className={`h-full w-auto object-contain transition-all duration-300 ${
                  isTalking ? 'animate-bounce-subtle' : 'animate-float'
                }`}
                style={{
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                }}
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                <MessageCircle className="w-12 h-12 text-primary/40" />
              </div>
            )}
          </div>
        </div>

        {/* 折叠/展开控制条 */}
        <div className="flex justify-center -my-2 relative z-10">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-12 rounded-full bg-background border shadow-sm hover:bg-muted p-0"
            onClick={() => setIsAvatarCollapsed(!isAvatarCollapsed)}
            title={isAvatarCollapsed ? "展开形象" : "折叠形象"}
          >
            {isAvatarCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* 对话区域 */}
        <div ref={scrollRef} className="flex-1 pr-4 min-h-0 overflow-y-auto">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <p>开始和 {secretaryConfig.name} 聊天吧！</p>
                <p className="text-sm mt-2">你可以问我关于学习、任务管理的任何问题~</p>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {msg.timestamp.toLocaleTimeString('zh-CN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 输入区域 */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`和 ${secretaryConfig.name} 说点什么...`}
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={sendMessage} disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardContent>

      {/* 四角缩放手柄 */}
      <div
        className="absolute top-1 left-1 h-3 w-3 cursor-nwse-resize opacity-50 hover:opacity-100"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsResizing(true);
          setResizeHandle('nw');
          resizeStartRef.current = {
            mouseX: e.clientX,
            mouseY: e.clientY,
            width: size.width,
            height: size.height,
            x: dragPosition.x,
            y: dragPosition.y,
            handle: 'nw',
          };
        }}
      />
      <div
        className="absolute top-1 right-1 h-3 w-3 cursor-nesw-resize opacity-50 hover:opacity-100"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsResizing(true);
          setResizeHandle('ne');
          resizeStartRef.current = {
            mouseX: e.clientX,
            mouseY: e.clientY,
            width: size.width,
            height: size.height,
            x: dragPosition.x,
            y: dragPosition.y,
            handle: 'ne',
          };
        }}
      />
      <div
        className="absolute bottom-1 left-1 h-3 w-3 cursor-nesw-resize opacity-50 hover:opacity-100"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsResizing(true);
          setResizeHandle('sw');
          resizeStartRef.current = {
            mouseX: e.clientX,
            mouseY: e.clientY,
            width: size.width,
            height: size.height,
            x: dragPosition.x,
            y: dragPosition.y,
            handle: 'sw',
          };
        }}
      />
      <div
        className="absolute bottom-1 right-1 h-3 w-3 cursor-nwse-resize opacity-50 hover:opacity-100"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsResizing(true);
          setResizeHandle('se');
          resizeStartRef.current = {
            mouseX: e.clientX,
            mouseY: e.clientY,
            width: size.width,
            height: size.height,
            x: dragPosition.x,
            y: dragPosition.y,
            handle: 'se',
          };
        }}
      />

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

        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 0.5s ease-in-out infinite;
        }
      `}</style>
    </Card>
  );
}
