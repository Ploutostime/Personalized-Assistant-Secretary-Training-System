import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import type { SecretaryAvatar, SecretaryPersonality } from '@/types/types';

interface SecretaryCardProps {
  item: SecretaryAvatar | SecretaryPersonality;
  type: 'avatar' | 'personality';
  selected: boolean;
  onClick: () => void;
}

// 形象类型映射
const avatarTypeMap: Record<string, string> = {
  // 经典系列
  loli: '萝莉',
  oneesan: '御姐',
  uncle: '大叔',
  boss: '霸总',
  senior_sister: '学姐',
  senior_brother: '学长',
  // 奇幻系列
  elf_queen: '精灵女王',
  imperial_knight: '帝国骑士',
  slime_girl: '史莱姆娘',
  werewolf_girl: '狼人少女',
  // 古风系列
  imperial_consort: '贵妃',
  empress: '皇后',
  regent_prince: '摄政王',
  jiangnan_girl: '江南小妹',
  // 现代系列
  neighbor_sister: '邻家姐姐',
};

// 形象分类映射
const categoryMap: Record<string, string> = {
  classic: '经典',
  fantasy: '奇幻',
  historical: '古风',
  modern: '现代',
};

// 形象分类颜色
const categoryColor: Record<string, string> = {
  classic: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  fantasy: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  historical: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  modern: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
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
  // 经典系列
  loli: '🌸',
  oneesan: '💐',
  uncle: '🎩',
  boss: '👔',
  senior_sister: '📚',
  senior_brother: '⚡',
  // 奇幻系列
  elf_queen: '🧝',
  imperial_knight: '⚔️',
  slime_girl: '💧',
  werewolf_girl: '🐺',
  // 古风系列
  imperial_consort: '🌺',
  empress: '👑',
  regent_prince: '🗡️',
  jiangnan_girl: '🌸',
  // 现代系列
  neighbor_sister: '🏠',
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
    return personalityTypeMap[(item as SecretaryPersonality).type] || item.name;
  };

  const getTypeIcon = () => {
    if (type === 'avatar') {
      return avatarTypeIcon[(item as SecretaryAvatar).type] || '👤';
    }
    return personalityTypeIcon[(item as SecretaryPersonality).type] || '😊';
  };

  // 获取形象图片
  const getAvatarImage = () => {
    if (type === 'avatar') {
      const avatar = item as SecretaryAvatar;
      return avatar.avatar_url || null;
    }
    return null;
  };

  // 获取全身立绘图片
  const getFullBodyImage = () => {
    if (type === 'avatar') {
      const avatar = item as SecretaryAvatar;
      return avatar.full_body_url || null;
    }
    return null;
  };

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        selected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* 形象预览图 */}
          {type === 'avatar' && getFullBodyImage() && (
            <div className="flex-shrink-0">
              <div className="w-20 h-28 flex items-end justify-center overflow-hidden rounded-lg bg-gradient-to-b from-primary/5 to-secondary/10">
                <img 
                  src={getFullBodyImage()!} 
                  alt={item.name}
                  className="h-full w-auto object-contain object-bottom"
                  loading="lazy"
                />
              </div>
            </div>
          )}
          
          {/* 如果没有全身图，显示头像 */}
          {type === 'avatar' && !getFullBodyImage() && getAvatarImage() && (
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
                <img 
                  src={getAvatarImage()!} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          )}
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {/* 如果没有图片或不是形象类型，显示图标 */}
              {(type !== 'avatar' || !getAvatarImage()) && (
                <span className="text-2xl">{getTypeIcon()}</span>
              )}
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {getTypeLabel()}
                  </Badge>
                  {/* 显示形象分类 */}
                  {type === 'avatar' && (item as SecretaryAvatar).category && (
                    <Badge className={`text-xs ${categoryColor[(item as SecretaryAvatar).category!] || ''}`}>
                      {categoryMap[(item as SecretaryAvatar).category!] || ''}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            {item.description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{item.description}</p>
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
