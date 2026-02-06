import React, { useEffect, useState } from 'react';
import { getStartupSectors, getStartupKnowledgeMaps } from '@/db/api';
import { StartupSector, StartupKnowledgeMap } from '@/types/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Rocket, 
  Lightbulb, 
  TrendingUp, 
  Zap, 
  Target, 
  ChevronRight, 
  BookOpen, 
  Users,
  Cpu,
  School,
  Leaf,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, any> = {
  Cpu,
  School,
  Leaf,
  Rocket
};

export default function EntrepreneurshipPage() {
  const [sectors, setSectors] = useState<StartupSector[]>([]);
  const [selectedSector, setSelectedSector] = useState<StartupSector | null>(null);
  const [knowledgeMaps, setKnowledgeMaps] = useState<StartupKnowledgeMap[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapsLoading, setMapsLoading] = useState(false);

  useEffect(() => {
    async function fetchSectors() {
      try {
        const data = await getStartupSectors();
        setSectors(data);
        if (data.length > 0) {
          setSelectedSector(data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch sectors:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSectors();
  }, []);

  useEffect(() => {
    async function fetchMaps() {
      if (!selectedSector) return;
      setMapsLoading(true);
      try {
        const data = await getStartupKnowledgeMaps(selectedSector.id);
        setKnowledgeMaps(data);
      } catch (error) {
        console.error('Failed to fetch knowledge maps:', error);
      } finally {
        setMapsLoading(false);
      }
    }
    fetchMaps();
  }, [selectedSector]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <Skeleton className="h-12 w-48 mx-auto bg-muted" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 bg-muted rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-12">
      {/* 头部标题 */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800 text-sm font-medium">
          <Rocket className="w-4 h-4" />
          创业导师模式已激活
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight flex items-center justify-center gap-3">
          <Zap className="w-10 h-10 text-orange-500 fill-orange-500" />
          梦想启航：创业赛道指南
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          不仅是学习伴侣，更是你的创业向导。为你挑选优质赛道，拆解核心知识体系，助你从 0 到 1 实现梦想。
        </p>
      </div>

      {/* 赛道选择 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sectors.map((sector) => {
          const IconComponent = iconMap[sector.icon_name || 'Rocket'] || Rocket;
          const isSelected = selectedSector?.id === sector.id;

          return (
            <button
              key={sector.id}
              onClick={() => setSelectedSector(sector)}
              className={cn(
                "group relative p-6 rounded-2xl border-2 text-left transition-all duration-300",
                isSelected 
                  ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20 shadow-lg scale-105" 
                  : "border-muted hover:border-orange-300 hover:bg-muted/50"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors",
                isSelected ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground group-hover:bg-orange-100 group-hover:text-orange-600"
              )}>
                <IconComponent className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">{sector.title}</h3>
              <div className="flex flex-wrap gap-2">
                {sector.tags?.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">{tag}</Badge>
                ))}
              </div>
              {isSelected && <Star className="absolute top-4 right-4 w-5 h-5 text-orange-500 fill-orange-500" />}
            </button>
          );
        })}
      </div>

      {/* 详细内容展示 */}
      {selectedSector && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* 左侧：赛道概况 */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="overflow-hidden border-orange-100 dark:border-orange-900">
              <CardHeader className="bg-orange-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  赛道洞察
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h4 className="font-bold text-orange-600 dark:text-orange-400 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> 市场趋势
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedSector.market_trend}
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-orange-600 dark:text-orange-400 mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4" /> 创业难度
                  </h4>
                  <Badge variant={selectedSector.difficulty_level === '简单' ? 'default' : 'destructive'} className="rounded-full">
                    {selectedSector.difficulty_level}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-bold text-orange-600 dark:text-orange-400 mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4" /> 潜力估值
                  </h4>
                  <p className="text-sm font-medium">
                    {selectedSector.potential_value}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/30 border-none">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold mb-1">导师寄语</h5>
                    <p className="text-sm text-muted-foreground italic leading-relaxed">
                      “实践是检验真理的唯一标准。选对赛道只是开始，持之以恒的技能积累才是成功的基石。加油，未来的创业者！”
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：知识图谱 */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-primary" />
                所需知识体系图谱
              </h2>
              <Badge variant="outline" className="border-primary text-primary">推荐学习路径</Badge>
            </div>

            {mapsLoading ? (
              <div className="space-y-4">
                {[1, 2].map(i => <Skeleton key={i} className="h-40 w-full bg-muted" />)}
              </div>
            ) : (
              <div className="space-y-6 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-muted">
                {knowledgeMaps.map((map, index) => (
                  <div key={map.id} className="relative pl-10">
                    {/* 时间轴圆点 */}
                    <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-md z-10">
                      {index + 1}
                    </div>
                    
                    <Card className="group hover:border-primary/50 transition-colors">
                      <CardHeader className="py-4">
                        <CardTitle className="text-lg text-primary">{map.stage_name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {map.knowledge_nodes.map((node, nIdx) => (
                            <div key={nIdx} className="p-3 rounded-lg bg-muted/50 border border-transparent group-hover:border-primary/20 transition-all">
                              <h5 className="font-bold text-sm mb-1 flex items-center gap-2">
                                <ChevronRight className="w-3 h-3 text-primary" />
                                {node.title}
                              </h5>
                              <p className="text-xs text-muted-foreground">{node.desc}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}

                {knowledgeMaps.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    该赛道的知识图谱正在加紧绘制中...
                  </div>
                )}
              </div>
            )}

            <div className="pt-6 flex justify-center">
              <Button size="lg" className="rounded-full px-10 shadow-lg shadow-primary/20">
                立即开始学习相关课程
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
