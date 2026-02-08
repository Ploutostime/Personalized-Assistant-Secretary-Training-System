import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getSecretaryAvatars } from '@/db/api';
import { supabase } from '@/db/supabase';
import type { SecretaryAvatar } from '@/types/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function SecretaryPage() {
  const { user } = useAuth();
  const [secretaries, setSecretaries] = useState<SecretaryAvatar[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const avatars = await getSecretaryAvatars();
        setSecretaries(avatars);
        
        // 加载用户当前选择
        if (user) {
          const { data } = await supabase
            .from('user_preferences')
            .select('secretary_avatar_id')
            .eq('user_id', user.id)
            .maybeSingle();
          
          if (data?.secretary_avatar_id) {
            setSelectedId(data.secretary_avatar_id);
          }
        }
      } catch (error) {
        console.error('加载秘书列表失败:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleSave = async () => {
    if (!selectedId || !user) {
      toast.error('请先选择一个秘书形象');
      return;
    }

    setSaving(true);
    try {
      const { data: existing } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      const selectedSecretary = secretaries.find(s => s.id === selectedId);
      const prefsData = {
        user_id: user.id,
        secretary_avatar_id: selectedId,
        secretary_name: selectedSecretary?.name || '秘书',
        secretary_enabled: true,
        updated_at: new Date().toISOString(),
      };

      if (existing) {
        await supabase
          .from('user_preferences')
          .update(prefsData)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('user_preferences')
          .insert({ ...prefsData, created_at: new Date().toISOString() });
      }

      toast.success('保存成功！秘书已启用');
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('保存失败:', error);
      toast.error('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">秘书形象</h1>
          <p className="text-muted-foreground mt-1">
            选择你喜欢的学习秘书形象
          </p>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            秘书系统说明
          </CardTitle>
          <CardDescription>
            选择一个秘书形象作为你的学习伙伴，TA 将以桌面宠物的形式陪伴你学习
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {secretaries.map((secretary) => (
          <button
            key={secretary.id}
            onClick={() => setSelectedId(secretary.id)}
            className={cn(
              'relative p-4 rounded-xl border-2 transition-all hover:shadow-lg',
              selectedId === secretary.id
                ? 'border-primary bg-primary/5 shadow-md'
                : 'border-muted hover:border-primary/50'
            )}
          >
            {selectedId === secretary.id && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
            {secretary.avatar_url && (
              <img
                src={secretary.avatar_url}
                alt={secretary.name}
                className="w-full aspect-square object-cover rounded-lg mb-2"
              />
            )}
            <p className="font-semibold text-center text-sm">{secretary.name}</p>
            <p className="text-xs text-muted-foreground text-center mt-1 line-clamp-2">
              {secretary.description}
            </p>
          </button>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <Button
          size="lg"
          onClick={handleSave}
          disabled={!selectedId || saving}
          className="px-12"
        >
          {saving ? '保存中...' : '保存并启用'}
        </Button>
      </div>
    </div>
  );
}
