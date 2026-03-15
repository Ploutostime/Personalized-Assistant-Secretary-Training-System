import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Trophy, 
  Star, 
  Zap, 
  Heart, 
  Users, 
  Map, 
  Camera, 
  Brain,
  BookOpen,
  Target,
  TrendingUp,
  Clock,
  Award,
  Sparkles,
  GamepadIcon
} from 'lucide-react';

// 延迟加载史诗级组件
const VirtualLearningWorld = lazy(() => import('./VirtualLearningWorld').then(module => ({ default: module.VirtualLearningWorld })));
const IntelligentLearningCompanion = lazy(() => import('./IntelligentLearningCompanion').then(module => ({ default: module.IntelligentLearningCompanion })));
const AugmentedRealityLearning = lazy(() => import('./AugmentedRealityLearning').then(module => ({ default: module.AugmentedRealityLearning })));

interface PlayerAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'exploration' | 'social' | 'creativity' | 'mastery';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  completed: boolean;
  reward: {
    experience: number;
    coins: number;
    specialItem?: string;
  };
}

interface DailyQuest {
  id: string;
  title: string;
  description: string;
  type: 'study' | 'explore' | 'social' | 'create';
  difficulty: 'easy' | 'medium' | 'hard';
  rewards: {
    experience: number;
    coins: number;
  };
  completed: boolean;
  timeRemaining: string;
}

export function EpicLearningDashboard() {
  const [playerStats, setPlayerStats] = useState({
    level: 7,
    experience: 1250,
    coins: 580,
    knowledgePoints: 320,
    explorationProgress: 45,
    socialPoints: 180,
    creativityScore: 95,
    streakDays: 12
  });

  const [achievements, setAchievements] = useState<PlayerAchievement[]>([
    {
      id: '1',
      title: '学习新星',
      description: '连续学习7天',
      icon: '⭐',
      category: 'learning',
      rarity: 'common',
      progress: 100,
      completed: true,
      reward: { experience: 100, coins: 50 }
    },
    {
      id: '2',
      title: '知识探索者',
      description: '发现10个AR学习标记',
      icon: '🗺️',
      category: 'exploration',
      rarity: 'rare',
      progress: 70,
      completed: false,
      reward: { experience: 200, coins: 100 }
    },
    {
      id: '3',
      title: '社交达人',
      description: '帮助10位同学解决问题',
      icon: '👥',
      category: 'social',
      rarity: 'epic',
      progress: 40,
      completed: false,
      reward: { experience: 500, coins: 250, specialItem: '友谊徽章' }
    }
  ]);

  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>([
    {
      id: '1',
      title: '数学挑战',
      description: '完成5道高等数学题目',
      type: 'study',
      difficulty: 'medium',
      rewards: { experience: 150, coins: 75 },
      completed: false,
      timeRemaining: '8小时'
    },
    {
      id: '2',
      title: 'AR探索',
      description: '使用AR功能发现3个学习标记',
      type: 'explore',
      difficulty: 'easy',
      rewards: { experience: 100, coins: 50 },
      completed: true,
      timeRemaining: '2小时'
    }
  ]);

  const [activeTab, setActiveTab] = useState('world');

  // 获取稀有度颜色
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取类别图标
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'learning': return <BookOpen className="w-4 h-4" />;
      case 'exploration': return <Map className="w-4 h-4" />;
      case 'social': return <Users className="w-4 h-4" />;
      case 'creativity': return <Sparkles className="w-4 h-4" />;
      case 'mastery': return <Trophy className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  // 获取任务类型颜色
  const getQuestTypeColor = (type: string) => {
    switch (type) {
      case 'study': return 'bg-blue-100 text-blue-800';
      case 'explore': return 'bg-green-100 text-green-800';
      case 'social': return 'bg-yellow-100 text-yellow-800';
      case 'create': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* 史诗级标题 */}
        <div className="text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            🎮 史诗学习冒险 🎮
          </h1>
          <p className="text-xl text-gray-600">将学习变成一场令人兴奋的冒险旅程！</p>
        </div>

        {/* 玩家状态概览 */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold">Lv.{playerStats.level}</div>
                  <div className="text-blue-100">冒险等级</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold">{playerStats.experience}</div>
                  <div className="text-blue-100">经验值</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold">💰{playerStats.coins}</div>
                  <div className="text-blue-100">学习金币</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold">📚{playerStats.knowledgePoints}</div>
                  <div className="text-blue-100">知识点数</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  <Trophy className="w-4 h-4 mr-1" />
                  {achievements.filter(a => a.completed).length}项成就
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  <Zap className="w-4 h-4 mr-1" />
                  连续{playerStats.streakDays}天
                </Badge>
              </div>
            </div>
            
            {/* 进度条 */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-blue-100 mb-1">
                <span>升级进度</span>
                <span>{playerStats.experience}/{playerStats.level * 100}</span>
              </div>
              <Progress value={(playerStats.experience / (playerStats.level * 100)) * 100} className="h-3 bg-white/20" />
            </div>
          </CardContent>
        </Card>

        {/* 主标签页 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="world" className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              冒险世界
            </TabsTrigger>
            <TabsTrigger value="companion" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              学习伴侣
            </TabsTrigger>
            <TabsTrigger value="ar" className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              AR探索
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              成就系统
            </TabsTrigger>
          </TabsList>

          {/* 冒险世界标签页 */}
          <TabsContent value="world">
            <Suspense fallback={
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-96 w-full bg-muted" />
                </CardContent>
              </Card>
            }>
              <VirtualLearningWorld />
            </Suspense>
          </TabsContent>

          {/* 学习伴侣标签页 */}
          <TabsContent value="companion">
            <Suspense fallback={
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-96 w-full bg-muted" />
                </CardContent>
              </Card>
            }>
              <IntelligentLearningCompanion />
            </Suspense>
          </TabsContent>

          {/* AR探索标签页 */}
          <TabsContent value="ar">
            <Suspense fallback={
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-96 w-full bg-muted" />
                </CardContent>
              </Card>
            }>
              <AugmentedRealityLearning />
            </Suspense>
          </TabsContent>

          {/* 成就系统标签页 */}
          <TabsContent value="achievements">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 成就列表 */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Trophy className="w-8 h-8 text-yellow-600" />
                      学习成就
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {achievements.map((achievement) => (
                        <Card 
                          key={achievement.id}
                          className={`border-2 transition-all hover:shadow-lg ${
                            achievement.completed ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="text-3xl">{achievement.icon}</div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold">{achievement.title}</h4>
                                    <Badge className={getRarityColor(achievement.rarity)}>
                                      {achievement.rarity === 'common' ? '普通' :
                                       achievement.rarity === 'rare' ? '稀有' :
                                       achievement.rarity === 'epic' ? '史诗' : '传说'}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600">{achievement.description}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    {getCategoryIcon(achievement.category)}
                                    <span className="text-xs text-gray-500">
                                      奖励: {achievement.reward.experience}经验 + {achievement.reward.coins}金币
                                      {achievement.reward.specialItem && ` + ${achievement.reward.specialItem}`}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                {achievement.completed ? (
                                  <Badge className="bg-green-100 text-green-800">已完成</Badge>
                                ) : (
                                  <Progress value={achievement.progress} className="w-20" />
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 每日任务和统计 */}
              <div className="space-y-6">
                {/* 每日任务 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-red-600" />
                      每日任务
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {dailyQuests.map((quest) => (
                        <Card key={quest.id} className={`border ${
                          quest.completed ? 'border-green-200 bg-green-50' : ''
                        }`}>
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm">{quest.title}</span>
                              <Badge className={getQuestTypeColor(quest.type)}>
                                {quest.type === 'study' ? '学习' :
                                 quest.type === 'explore' ? '探索' :
                                 quest.type === 'social' ? '社交' : '创造'}
                              </Badge>
                            </div>
                            
                            <p className="text-xs text-gray-600 mb-2">{quest.description}</p>
                            
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>奖励: {quest.rewards.experience}经验</span>
                              <span>剩余: {quest.timeRemaining}</span>
                            </div>
                            
                            <Button size="sm" className="w-full mt-2" disabled={quest.completed}>
                              {quest.completed ? '已完成' : '开始任务'}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 学习统计 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      学习统计
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">探索进度</span>
                        <span className="font-medium">{playerStats.explorationProgress}%</span>
                      </div>
                      <Progress value={playerStats.explorationProgress} />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">社交活跃度</span>
                        <span className="font-medium">{playerStats.socialPoints}</span>
                      </div>
                      <Progress value={(playerStats.socialPoints / 200) * 100} />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">创造力评分</span>
                        <span className="font-medium">{playerStats.creativityScore}</span>
                      </div>
                      <Progress value={playerStats.creativityScore} />
                    </div>
                  </CardContent>
                </Card>

                {/* 快速开始 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-orange-600" />
                      快速开始
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm">
                        <GamepadIcon className="w-4 h-4 mr-1" />
                        学习游戏
                      </Button>
                      <Button variant="outline" size="sm">
                        <Users className="w-4 h-4 mr-1" />
                        组队学习
                      </Button>
                      <Button variant="outline" size="sm">
                        <Award className="w-4 h-4 mr-1" />
                        挑战模式
                      </Button>
                      <Button variant="outline" size="sm">
                        <Sparkles className="w-4 h-4 mr-1" />
                        创意工坊
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* 底部导航 */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm">
                  <Brain className="w-4 h-4 mr-1" />
                  学习分析
                </Button>
                <Button variant="ghost" size="sm">
                  <BookOpen className="w-4 h-4 mr-1" />
                  知识库
                </Button>
                <Button variant="ghost" size="sm">
                  <Clock className="w-4 h-4 mr-1" />
                  学习记录
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  🎯 在线学习中
                </Badge>
                <Button size="sm">
                  <Star className="w-4 h-4 mr-1" />
                  分享成就
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}