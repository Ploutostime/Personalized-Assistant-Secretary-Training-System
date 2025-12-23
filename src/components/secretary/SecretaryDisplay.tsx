import { useEffect, useState } from 'react';
import { supabase } from '@/db/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface SecretaryDisplayProps {
  secretaryAvatarId: string;
  outfitId: string;
  secretaryName?: string;
  outfitName?: string;
  className?: string;
  showInfo?: boolean;
}

export function SecretaryDisplay({
  secretaryAvatarId,
  outfitId,
  secretaryName,
  outfitName,
  className,
  showInfo = true,
}: SecretaryDisplayProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadImage() {
      setLoading(true);
      setError(false);

      try {
        // 查询秘书穿着该服装的立绘
        const { data, error: queryError } = await supabase
          .from('secretary_outfit_images')
          .select('image_url')
          .eq('secretary_avatar_id', secretaryAvatarId)
          .eq('outfit_id', outfitId)
          .maybeSingle();

        if (queryError) {
          console.error('查询秘书服装立绘失败:', queryError);
          setError(true);
          return;
        }

        if (data?.image_url) {
          setImageUrl(data.image_url);
        } else {
          // 如果没有特定组合的立绘，尝试获取秘书的默认立绘
          const { data: avatarData } = await supabase
            .from('secretary_avatars')
            .select('full_body_url, avatar_url')
            .eq('id', secretaryAvatarId)
            .maybeSingle();

          setImageUrl(avatarData?.full_body_url || avatarData?.avatar_url || null);
        }
      } catch (err) {
        console.error('加载秘书立绘失败:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadImage();
  }, [secretaryAvatarId, outfitId]);

  if (loading) {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <CardContent className="p-6">
          <Skeleton className="w-full aspect-[3/4] bg-muted" />
          {showInfo && (
            <div className="mt-4 space-y-2">
              <Skeleton className="h-6 w-3/4 bg-muted" />
              <Skeleton className="h-4 w-1/2 bg-muted" />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (error || !imageUrl) {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <CardContent className="p-6">
          <div className="w-full aspect-[3/4] bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">暂无立绘</p>
          </div>
          {showInfo && (
            <div className="mt-4">
              <p className="font-semibold text-foreground">{secretaryName || '未知秘书'}</p>
              <p className="text-sm text-muted-foreground">{outfitName || '未知服装'}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('overflow-hidden hover:shadow-lg transition-shadow', className)}>
      <CardContent className="p-0">
        <div className="relative w-full aspect-[3/4] bg-gradient-to-b from-primary/5 to-secondary/5">
          <img
            src={imageUrl}
            alt={`${secretaryName || '秘书'} - ${outfitName || '服装'}`}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </div>
        {showInfo && (
          <div className="p-4 bg-card">
            <p className="font-semibold text-foreground text-lg">{secretaryName || '未知秘书'}</p>
            <p className="text-sm text-muted-foreground mt-1">{outfitName || '未知服装'}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
