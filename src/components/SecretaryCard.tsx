import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import type { SecretaryAvatar, SecretaryPersonality, SecretaryOutfit } from '@/types/types';

interface SecretaryCardProps {
  item: SecretaryAvatar | SecretaryPersonality | SecretaryOutfit;
  type: 'avatar' | 'personality' | 'outfit';
  selected: boolean;
  onClick: () => void;
}

// 形象类型映射
const avatarTypeMap: Record<string, string> = {
  loli: '萝莉',
  oneesan: '御姐',
  uncle: '大叔',
  boss: '霸总',
  senior_sister: '学姐',
  senior_brother: '学长',
};

// 性格类型映射
const personalityTypeMap: Record<string, string> = {
  gentle: '温柔型',
  strict: '严格型',
  lively: '活泼型',
  calm: '冷静型',
  motivating: '激励型',
};

// 服装类型映射
const outfitTypeMap: Record<string, string> = {
  campus: '校园风',
  business: '职业装',
  casual: '休闲风',
  formal: '正式装',
  special: '特殊装',
};

// 形象类型图标
const avatarTypeIcon: Record<string, string> = {
  loli: '🌸',
  oneesan: '💐',
  uncle: '🎩',
  boss: '👔',
  senior_sister: '📚',
  senior_brother: '⚡',
};

// 性格类型图标
const personalityTypeIcon: Record<string, string> = {
  gentle: '💕',
  strict: '📋',
  lively: '🎉',
  calm: '🧘',
  motivating: '🔥',
};

// 服装类型图标
const outfitTypeIcon: Record<string, string> = {
  campus: '🎒',
  business: '💼',
  casual: '👕',
  formal: '👗',
  special: '🎭',
};

export function SecretaryCard({ item, type, selected, onClick }: SecretaryCardProps) {
  const getTypeLabel = () => {
    if (type === 'avatar') {
      return avatarTypeMap[(item as SecretaryAvatar).type] || item.name;
    }
    if (type === 'personality') {
      return personalityTypeMap[(item as SecretaryPersonality).type] || item.name;
    }
    return outfitTypeMap[(item as SecretaryOutfit).type] || item.name;
  };

  const getTypeIcon = () => {
    if (type === 'avatar') {
      return avatarTypeIcon[(item as SecretaryAvatar).type] || '👤';
    }
    if (type === 'personality') {
      return personalityTypeIcon[(item as SecretaryPersonality).type] || '😊';
    }
    return outfitTypeIcon[(item as SecretaryOutfit).type] || '👔';
  };

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        selected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{getTypeIcon()}</span>
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <Badge variant="secondary" className="text-xs">
                  {getTypeLabel()}
                </Badge>
              </div>
            </div>
            {item.description && (
              <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
            )}
          </div>
          {selected && (
            <div className="ml-2 flex-shrink-0">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
