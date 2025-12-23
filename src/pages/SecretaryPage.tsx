import { useAuth } from '@/contexts/AuthContext';
import { SecretaryWardrobe } from '@/components/secretary/SecretaryWardrobe';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export default function SecretaryPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">秘书形象</h1>
          <p className="text-muted-foreground mt-1">
            为你的学习秘书选择独特的形象和服装
          </p>
        </div>
      </div>

      {/* 功能说明 */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            换装系统说明
          </CardTitle>
          <CardDescription>
            每个秘书都有独特的2D立绘，选择不同的服装会显示对应的立绘图片
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• 在"选择秘书"标签中选择你喜欢的秘书角色</p>
          <p>• 在"选择服装"标签中为秘书挑选服装</p>
          <p>• 预览区域会实时显示秘书穿着该服装的立绘</p>
          <p>• 点击"保存配置"应用你的选择</p>
        </CardContent>
      </Card>

      {/* 换装系统 */}
      <SecretaryWardrobe userId={user.id} />
    </div>
  );
}
