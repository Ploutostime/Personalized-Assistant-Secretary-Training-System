import { useEffect, useState } from 'react';
import { supabase } from '@/db/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SecretaryDisplay } from './SecretaryDisplay';
import { VoiceControl } from './VoiceControl';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  voiceManager,
  getSecretaryVoiceConfig,
  getRandomPhrase,
} from '@/utils/voiceManager';
import type { SecretaryAvatar, SecretaryOutfit } from '@/types/types';

interface SecretaryWardrobeProps {
  userId: string;
}

interface OutfitWithImage {
  outfit: SecretaryOutfit;
  imageUrl: string;
}

export function SecretaryWardrobe({ userId }: SecretaryWardrobeProps) {
  const [secretaries, setSecretaries] = useState<SecretaryAvatar[]>([]);
  const [selectedSecretary, setSelectedSecretary] = useState<SecretaryAvatar | null>(null);
  const [availableOutfits, setAvailableOutfits] = useState<OutfitWithImage[]>([]);
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // 播放秘书语音
  const playSecretaryVoice = (type: 'greeting' | 'comment' | 'encouragement') => {
    if (!voiceEnabled || !selectedSecretary) return;

    const config = getSecretaryVoiceConfig(selectedSecretary.type);
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
    }

    voiceManager.speak(phrase, {
      pitch: config.pitch,
      rate: config.rate,
      volume: config.volume,
    });
  };

  // 加载所有秘书
  useEffect(() => {
    async function loadSecretaries() {
      const { data, error } = await supabase
        .from('secretary_avatars')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        console.error('加载秘书列表失败:', error);
        return;
      }

      if (data && data.length > 0) {
        setSecretaries(data);
        setSelectedSecretary(data[0]);
      }
      setLoading(false);
    }

    loadSecretaries();
  }, []);

  // 当选择秘书时播放问候语
  useEffect(() => {
    if (selectedSecretary) {
      // 延迟播放，避免立即触发
      const timer = setTimeout(() => {
        playSecretaryVoice('greeting');
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [selectedSecretary?.id]);

  // 加载选中秘书的可用服装
  useEffect(() => {
    if (!selectedSecretary) return;

    async function loadOutfits() {
      const { data, error } = await supabase
        .from('secretary_outfit_images')
        .select(`
          image_url,
          outfit:secretary_outfits(*)
        `)
        .eq('secretary_avatar_id', selectedSecretary.id);

      if (error) {
        console.error('加载秘书服装失败:', error);
        return;
      }

      if (data && data.length > 0) {
        const outfitsWithImages = data.map((item: any) => ({
          outfit: item.outfit,
          imageUrl: item.image_url,
        }));
        setAvailableOutfits(outfitsWithImages);
        setSelectedOutfitId(outfitsWithImages[0].outfit.id);
      } else {
        setAvailableOutfits([]);
        setSelectedOutfitId(null);
      }
    }

    loadOutfits();
  }, [selectedSecretary]);

  // 当切换服装时播放评论
  useEffect(() => {
    if (selectedOutfitId && availableOutfits.length > 0) {
      // 延迟播放，避免初始加载时触发
      const timer = setTimeout(() => {
        playSecretaryVoice('comment');
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [selectedOutfitId]);

  // 保存用户选择
  const handleSaveSelection = async () => {
    if (!selectedSecretary || !selectedOutfitId) return;

    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        secretary_avatar_id: selectedSecretary.id,
        secretary_outfit_id: selectedOutfitId,
        secretary_name: selectedSecretary.name,
        secretary_enabled: true,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('保存秘书配置失败:', error);
      alert('保存失败，请重试');
    } else {
      alert('保存成功！');
      // 播放鼓励语
      playSecretaryVoice('encouragement');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full bg-muted" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 bg-muted" />
          <Skeleton className="h-96 bg-muted" />
          <Skeleton className="h-96 bg-muted" />
        </div>
      </div>
    );
  }

  const selectedOutfit = availableOutfits.find(
    (item) => item.outfit.id === selectedOutfitId
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>秘书换装系统</CardTitle>
            {selectedSecretary && (
              <VoiceControl
                secretaryType={selectedSecretary.type}
                showText={false}
              />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="select" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="select">选择秘书</TabsTrigger>
              <TabsTrigger value="wardrobe">选择服装</TabsTrigger>
            </TabsList>

            <TabsContent value="select" className="space-y-4">
              <ScrollArea className="h-[400px] w-full">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
                  {secretaries.map((secretary) => (
                    <Card
                      key={secretary.id}
                      className={cn(
                        'cursor-pointer transition-all hover:shadow-md',
                        selectedSecretary?.id === secretary.id &&
                          'ring-2 ring-primary'
                      )}
                      onClick={() => setSelectedSecretary(secretary)}
                    >
                      <CardContent className="p-4">
                        {secretary.avatar_url && (
                          <img
                            src={secretary.avatar_url}
                            alt={secretary.name}
                            className="w-full aspect-square object-cover rounded-lg mb-2"
                          />
                        )}
                        <p className="font-semibold text-center text-sm">
                          {secretary.name}
                        </p>
                        <p className="text-xs text-muted-foreground text-center mt-1">
                          {secretary.description?.slice(0, 20)}...
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="wardrobe" className="space-y-4">
              {availableOutfits.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  该秘书暂无可用服装立绘
                </div>
              ) : (
                <ScrollArea className="h-[400px] w-full">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                    {availableOutfits.map((item) => (
                      <Card
                        key={item.outfit.id}
                        className={cn(
                          'cursor-pointer transition-all hover:shadow-md',
                          selectedOutfitId === item.outfit.id &&
                            'ring-2 ring-primary'
                        )}
                        onClick={() => setSelectedOutfitId(item.outfit.id)}
                      >
                        <CardContent className="p-3">
                          <div className="relative w-full aspect-[3/4] bg-muted rounded-lg overflow-hidden mb-2">
                            <img
                              src={item.imageUrl}
                              alt={item.outfit.name}
                              className="w-full h-full object-contain"
                              loading="lazy"
                            />
                          </div>
                          <p className="font-semibold text-center text-sm">
                            {item.outfit.name}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 预览区域 */}
      {selectedSecretary && selectedOutfitId && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>立绘预览</CardTitle>
            </CardHeader>
            <CardContent>
              <SecretaryDisplay
                secretaryAvatarId={selectedSecretary.id}
                outfitId={selectedOutfitId}
                secretaryName={selectedSecretary.name}
                outfitName={selectedOutfit?.outfit.name}
                showInfo={true}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>配置信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">秘书角色</p>
                <p className="text-lg font-semibold text-foreground">
                  {selectedSecretary.name}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedSecretary.description}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">当前服装</p>
                <p className="text-lg font-semibold text-foreground">
                  {selectedOutfit?.outfit.name || '未选择'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedOutfit?.outfit.description}
                </p>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleSaveSelection}
                  className="w-full"
                  size="lg"
                >
                  保存配置
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
