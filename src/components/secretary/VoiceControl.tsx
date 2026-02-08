import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  voiceManager,
  getSecretaryVoiceConfig,
  getRandomPhrase,
} from '@/utils/voiceManager';

interface VoiceControlProps {
  secretaryType: string;
  className?: string;
  showText?: boolean;
}

export function VoiceControl({
  secretaryType,
  className,
  showText = true,
}: VoiceControlProps) {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 检查语音状态
  useEffect(() => {
    const checkStatus = setInterval(() => {
      setIsSpeaking(voiceManager.isSpeaking());
    }, 100);

    return () => clearInterval(checkStatus);
  }, []);

  // 切换语音开关
  const toggleVoice = () => {
    if (isEnabled) {
      voiceManager.stop();
    }
    setIsEnabled(!isEnabled);
  };

  // 播放问候语
  const playGreeting = () => {
    if (!isEnabled) return;

    const config = getSecretaryVoiceConfig(secretaryType);
    const greeting = getRandomPhrase(config.greetings);

    voiceManager.speak(greeting, {
      secretaryType: secretaryType,
    });
  };

  // 停止
  const stop = () => {
    voiceManager.stop();
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* 语音开关 */}
      <Button
        variant={isEnabled ? 'default' : 'outline'}
        size="sm"
        onClick={toggleVoice}
        title={isEnabled ? '关闭语音' : '开启语音'}
      >
        {isEnabled ? (
          <Volume2 className="w-4 h-4" />
        ) : (
          <VolumeX className="w-4 h-4" />
        )}
        {showText && <span className="ml-2">{isEnabled ? '语音开启' : '语音关闭'}</span>}
      </Button>

      {/* 播放问候语 */}
      {isEnabled && !isSpeaking && (
        <Button
          variant="outline"
          size="sm"
          onClick={playGreeting}
          disabled={isSpeaking}
          title="播放问候语"
        >
          <Play className="w-4 h-4" />
          {showText && <span className="ml-2">问候</span>}
        </Button>
      )}

      {/* 停止 */}
      {isEnabled && isSpeaking && (
        <Button
          variant="outline"
          size="sm"
          onClick={stop}
          title="停止"
        >
          <VolumeX className="w-4 h-4" />
          {showText && <span className="ml-2">停止</span>}
        </Button>
      )}
    </div>
  );
}
