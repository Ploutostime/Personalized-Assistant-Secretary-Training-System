import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Map, 
  Compass, 
  Sword, 
  Shield, 
  Star, 
  Trophy, 
  Zap,
  Users,
  BookOpen,
  Castle,
  Mountain,
  Ship,
  Rocket,
  Eye,
  Search,
  Play,
  Pause
} from 'lucide-react';

interface WorldLocation {
  id: string;
  name: string;
  type: 'castle' | 'forest' | 'ocean' | 'space' | 'mountain' | 'library';
  difficulty: number; // 1-5
  subjects: string[];
  description: string;
  unlocked: boolean;
  progress: number; // 0-100
  challenges: number;
  rewards: string[];
}

interface LearningChallenge {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'problem' | 'project' | 'exploration';
  difficulty: 'easy' | 'medium' | 'hard' | 'epic';
  rewards: {
    experience: number;
    coins: number;
    items: string[];
  };
  timeLimit?: number; // 分钟
  completed: boolean;
}

interface PlayerStats {
  level: number;
  experience: number;
  coins: number;
  knowledgePoints: number;
  explorationProgress: number;
  challengesCompleted: number;
  streakDays: number;
}

export function VirtualLearningWorld() {
  const [currentLocation, setCurrentLocation] = useState<WorldLocation | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    level: 1,
    experience: 0,
    coins: 100,
    knowledgePoints: 0,
    explorationProgress: 0,
    challengesCompleted: 0,
    streakDays: 0
  });
  const [activeChallenge, setActiveChallenge] = useState<LearningChallenge | null>(null);
  const [isExploring, setIsExploring] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 3D世界地图数据
  const worldLocations: WorldLocation[] = [
    {
      id: 'math-castle',
      name: '数学魔法城堡',
      type: 'castle',
      difficulty: 1,
      subjects: ['数学', '逻辑'],
      description: '探索数学的奥秘，解开古老的魔法谜题',
      unlocked: true,
      progress: 0,
      challenges: 5,
      rewards: ['智慧之杖', '数学徽章']
    },
    {
      id: 'science-forest',
      name: '科学探索森林',
      type: 'forest',
      difficulty: 2,
      subjects: ['物理', '化学', '生物'],
      description: '深入神秘的森林，发现科学的奇迹',
      unlocked: true,
      progress: 30,
      challenges: 8,
      rewards: ['实验工具', '科学徽章']
    },
    {
      id: 'language-ocean',
      name: '语言交流海洋',
      type: 'ocean',
      difficulty: 3,
      subjects: ['英语', '中文', '文学'],
      description: '航行在语言的海洋，与世界各地交流',
      unlocked: false,
      progress: 0,
      challenges: 6,
      rewards: ['翻译宝珠', '语言徽章']
    },
    {
      id: 'history-mountain',
      name: '历史时光山脉',
      type: 'mountain',
      difficulty: 4,
      subjects: ['历史', '地理', '文化'],
      description: '攀登历史的高峰，见证文明的变迁',
      unlocked: false,
      progress: 0,
      challenges: 7,
      rewards: ['时光沙漏', '历史徽章']
    },
    {
      id: 'tech-space',
      name: '科技未来空间',
      type: 'space',
      difficulty: 5,
      subjects: ['编程', '人工智能', '创新'],
      description: '飞向科技的未来，创造无限可能',
      unlocked: false,
      progress: 0,
      challenges: 10,
      rewards: ['代码水晶', '科技徽章']
    }
  ];

  // 获取位置图标
  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'castle': return <Castle className="w-6 h-6" />;
      case 'forest': return <Mountain className="w-6 h-6" />;
      case 'ocean': return <Ship className="w-6 h-6" />;
      case 'space': return <Rocket className="w-6 h-6" />;
      case 'mountain': return <Mountain className="w-6 h-6" />;
      case 'library': return <BookOpen className="w-6 h-6" />;
      default: return <Map className="w-6 h-6" />;
    }
  };

  // 获取难度颜色
  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-blue-100 text-blue-800';
      case 3: return 'bg-yellow-100 text-yellow-800';
      case 4: return 'bg-orange-100 text-orange-800';
      case 5: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 开始探索
  const startExploration = (location: WorldLocation) => {
    setCurrentLocation(location);
    setIsExploring(true);
    
    // 模拟探索过程
    const explorationTimer = setInterval(() => {
      setPlayerStats(prev => ({
        ...prev,
        explorationProgress: Math.min(prev.explorationProgress + 1, 100)
      }));
    }, 1000);

    // 10秒后结束探索
    setTimeout(() => {
      clearInterval(explorationTimer);
      setIsExploring(false);
      completeExploration(location);
    }, 10000);
  };

  // 完成探索
  const completeExploration = (location: WorldLocation) => {
    const experienceReward = location.difficulty * 50;
    const coinReward = location.difficulty * 20;
    
    setPlayerStats(prev => ({
      ...prev,
      experience: prev.experience + experienceReward,
      coins: prev.coins + coinReward,
      knowledgePoints: prev.knowledgePoints + location.difficulty * 10,
      challengesCompleted: prev.challengesCompleted + 1
    }));

    // 检查是否升级
    checkLevelUp();
  };

  // 检查升级
  const checkLevelUp = () => {
    const experienceNeeded = playerStats.level * 100;
    if (playerStats.experience >= experienceNeeded) {
      setPlayerStats(prev => ({
        ...prev,
        level: prev.level + 1,
        experience: prev.experience - experienceNeeded
      }));
    }
  };

  // 开始挑战
  const startChallenge = () => {
    const challenge: LearningChallenge = {
      id: 'challenge-1',
      title: '数学谜题挑战',
      description: '解决这个古老的数学谜题，证明你的智慧！',
      type: 'quiz',
      difficulty: 'medium',
      rewards: {
        experience: 100,
        coins: 50,
        items: ['智慧之杖']
      },
      completed: false
    };
    
    setActiveChallenge(challenge);
  };

  // 完成挑战
  const completeChallenge = () => {
    if (activeChallenge) {
      setPlayerStats(prev => ({
        ...prev,
        experience: prev.experience + activeChallenge.rewards.experience,
        coins: prev.coins + activeChallenge.rewards.coins,
        challengesCompleted: prev.challengesCompleted + 1
      }));
      
      setActiveChallenge(null);
      checkLevelUp();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 玩家状态栏 */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">Lv.{playerStats.level}</div>
                <div className="text-sm text-gray-600">等级</div>
              </div>
              
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">{playerStats.experience}</div>
                <div className="text-sm text-gray-600">经验值</div>
              </div>
              
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-600">{playerStats.coins}</div>
                <div className="text-sm text-gray-600">金币</div>
              </div>
              
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">{playerStats.knowledgePoints}</div>
                <div className="text-sm text-gray-600">知识点数</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                <Trophy className="w-3 h-3 mr-1" />
                连续学习 {playerStats.streakDays} 天
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Star className="w-3 h-3 mr-1" />
                完成 {playerStats.challengesCompleted} 个挑战
              </Badge>
            </div>
          </div>
          
          {/* 经验值进度条 */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>升级进度</span>
              <span>{playerStats.experience}/{playerStats.level * 100}</span>
            </div>
            <Progress value={(playerStats.experience / (playerStats.level * 100)) * 100} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 世界地图 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Map className="w-8 h-8 text-blue-600" />
                学习冒险世界
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* 搜索栏 */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="搜索学习地点或挑战..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* 3D世界地图可视化 */}
              <div className="relative h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg border-2 border-blue-200 mb-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🗺️</div>
                    <p className="text-lg font-semibold text-gray-700">交互式学习世界地图</p>
                    <p className="text-sm text-gray-500">点击地点开始探索冒险</p>
                  </div>
                </div>
                
                {/* 地点标记 */}
                {worldLocations.map((location, index) => (
                  <div
                    key={location.id}
                    className={`absolute cursor-pointer transform hover:scale-110 transition-transform ${
                      index === 0 ? 'top-1/4 left-1/4' :
                      index === 1 ? 'top-1/3 right-1/3' :
                      index === 2 ? 'bottom-1/4 left-1/3' :
                      index === 3 ? 'top-1/2 right-1/4' :
                      'bottom-1/3 left-1/2'
                    }`}
                    onClick={() => location.unlocked && startExploration(location)}
                  >
                    <div className={`p-2 rounded-full ${
                      location.unlocked ? 'bg-green-500 text-white' : 'bg-gray-400 text-gray-200'
                    }`}>
                      {getLocationIcon(location.type)}
                    </div>
                    <div className="text-xs text-center mt-1 font-medium">{location.name}</div>
                  </div>
                ))}
              </div>

              {/* 探索状态 */}
              {isExploring && currentLocation && (
                <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">正在探索: {currentLocation.name}</h4>
                        <p className="text-sm text-gray-600">{currentLocation.description}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Pause className="w-4 h-4 mr-1" />
                        暂停探索
                      </Button>
                    </div>
                    <Progress value={playerStats.explorationProgress} className="mt-2" />
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 地点列表 */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-green-600" />
                学习地点
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {worldLocations.map((location) => (
                    <Card 
                      key={location.id} 
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        !location.unlocked ? 'opacity-50' : ''
                      }`}
                      onClick={() => location.unlocked && startExploration(location)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getLocationIcon(location.type)}
                            <span className="font-semibold">{location.name}</span>
                          </div>
                          <Badge className={getDifficultyColor(location.difficulty)}>
                            难度 {location.difficulty}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{location.description}</p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{location.challenges}个挑战</span>
                          <span>{location.unlocked ? '已解锁' : '需要Lv.' + (location.difficulty * 2)}</span>
                        </div>
                        
                        <Progress value={location.progress} className="mt-2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 挑战系统 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Sword className="w-8 h-8 text-red-600" />
            学习挑战
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
              <CardContent className="p-4 text-center">
                <Zap className="w-12 h-12 text-red-600 mx-auto mb-2" />
                <h4 className="font-semibold mb-1">快速挑战</h4>
                <p className="text-sm text-gray-600 mb-3">5分钟内完成的小测验</p>
                <Button onClick={startChallenge} variant="outline" size="sm">
                  开始挑战
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <Shield className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold mb-1">团队挑战</h4>
                <p className="text-sm text-gray-600 mb-3">与其他学习者协作</p>
                <Button variant="outline" size="sm">
                  <Users className="w-4 h-4 mr-1" />
                  寻找队友
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-4 text-center">
                <Trophy className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                <h4 className="font-semibold mb-1">史诗挑战</h4>
                <p className="text-sm text-gray-600 mb-3">高难度综合项目</p>
                <Button variant="outline" size="sm">
                  查看详情
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* 活跃挑战 */}
      {activeChallenge && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">{activeChallenge.title}</h3>
                <p className="text-gray-600 mb-4">{activeChallenge.description}</p>
                
                <div className="flex gap-4 text-sm">
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    经验值: {activeChallenge.rewards.experience}
                  </Badge>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                    金币: {activeChallenge.rewards.coins}
                  </Badge>
                  <Badge variant="outline" className="bg-purple-100 text-purple-800">
                    {activeChallenge.difficulty === 'easy' ? '简单' : 
                     activeChallenge.difficulty === 'medium' ? '中等' :
                     activeChallenge.difficulty === 'hard' ? '困难' : '史诗'}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <Button onClick={completeChallenge} className="w-full">
                  <Play className="w-4 h-4 mr-1" />
                  开始答题
                </Button>
                <Button variant="outline" onClick={() => setActiveChallenge(null)}>
                  放弃挑战
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}