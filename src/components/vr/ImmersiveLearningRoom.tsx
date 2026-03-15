import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Video, 
  Headphones, 
  BookOpen, 
  Users, 
  Zap, 
  Globe,
  Clock,
  Star,
  MessageSquare
} from 'lucide-react';

interface LearningResource {
  id: string;
  type: 'video' | 'audio' | 'text' | 'interactive';
  title: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  completed: boolean;
}

interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  members: number;
  active: boolean;
}

export function ImmersiveLearningRoom() {
  const [currentResource, setCurrentResource] = useState<LearningResource | null>(null);
  const [resources, setResources] = useState<LearningResource[]>([
    {
      id: '1',
      type: 'video',
      title: '高等数学 - 微积分基础',
      duration: 45,
      difficulty: 'beginner',
      rating: 4.8,
      completed: false
    },
    {
      id: '2',
      type: 'interactive',
      title: '编程算法 - 动态规划实战',
      duration: 60,
      difficulty: 'intermediate',
      rating: 4.9,
      completed: true
    },
    {
      id: '3',
      type: 'audio',
      title: '英语听力 - 商务对话',
      duration: 30,
      difficulty: 'advanced',
      rating: 4.7,
      completed: false
    }
  ]);

  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([
    {
      id: '1',
      name: '数学学习小组',
      subject: '数学',
      members: 12,
      active: true
    },
    {
      id: '2',
      name: '编程算法讨论',
      subject: '计算机科学',
      members: 8,
      active: true
    },
    {
      id: '3',
      name: '英语口语练习',
      subject: '英语',
      members: 15,
      active: false
    }
  ]);

  const [environment, setEnvironment] = useState('library'); // library, garden, beach, space
  const [backgroundMusic, setBackgroundMusic] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  // 3D场景引用
  const sceneRef = useRef<HTMLDivElement>(null);

  // 获取资源类型图标
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'audio': return <Headphones className="w-4 h-4" />;
      case 'text': return <BookOpen className="w-4 h-4" />;
      case 'interactive': return <Zap className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  // 获取难度颜色
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取环境背景
  const getEnvironmentBackground = () => {
    switch (environment) {
      case 'library': 
        return 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200';
      case 'garden': 
        return 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-200';
      case 'beach': 
        return 'bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-200';
      case 'space': 
        return 'bg-gradient-to-br from-purple-50 to-indigo-100 border-purple-200';
      default: 
        return 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200';
    }
  };

  // 开始学习资源
  const startLearning = (resource: LearningResource) => {
    setCurrentResource(resource);
    
    // 模拟学习过程
    setTimeout(() => {
      setResources(prev => prev.map(r => 
        r.id === resource.id ? { ...r, completed: true } : r
      ));
      setCurrentResource(null);
    }, resource.duration * 1000); // 简化时间
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className={`${getEnvironmentBackground()} transition-all duration-500`}>
        <CardTitle className="flex items-center justify-between text-2xl">
          <div className="flex items-center gap-2">
            <Globe className="w-8 h-8 text-blue-600" />
            沉浸式学习空间
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-white/80">
              {environment === 'library' ? '图书馆' : 
               environment === 'garden' ? '花园' : 
               environment === 'beach' ? '海滩' : '宇宙'}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* 环境控制 */}
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex gap-2">
            <Button 
              variant={environment === 'library' ? 'default' : 'outline'}
              onClick={() => setEnvironment('library')}
              size="sm"
            >
              📚 图书馆
            </Button>
            <Button 
              variant={environment === 'garden' ? 'default' : 'outline'}
              onClick={() => setEnvironment('garden')}
              size="sm"
            >
              🌿 花园
            </Button>
            <Button 
              variant={environment === 'beach' ? 'default' : 'outline'}
              onClick={() => setEnvironment('beach')}
              size="sm"
            >
              🏖️ 海滩
            </Button>
            <Button 
              variant={environment === 'space' ? 'default' : 'outline'}
              onClick={() => setEnvironment('space')}
              size="sm"
            >
              🚀 宇宙
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={backgroundMusic ? 'default' : 'outline'}
              onClick={() => setBackgroundMusic(!backgroundMusic)}
              size="sm"
            >
              <Headphones className="w-4 h-4 mr-1" />
              {backgroundMusic ? '关闭音乐' : '开启音乐'}
            </Button>
            <Button 
              variant={focusMode ? 'default' : 'outline'}
              onClick={() => setFocusMode(!focusMode)}
              size="sm"
            >
              <Zap className="w-4 h-4 mr-1" />
              {focusMode ? '退出专注' : '专注模式'}
            </Button>
          </div>
        </div>

        {/* 3D学习场景 */}
        <div 
          ref={sceneRef}
          className={`h-64 rounded-lg border-2 transition-all duration-500 ${
            environment === 'library' ? 'bg-amber-100 border-amber-300' :
            environment === 'garden' ? 'bg-green-100 border-green-300' :
            environment === 'beach' ? 'bg-blue-100 border-blue-300' :
            'bg-purple-100 border-purple-300'
          }`}
        >
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">
                {environment === 'library' ? '📚' :
                 environment === 'garden' ? '🌿' :
                 environment === 'beach' ? '🌊' : '🌌'}
              </div>
              <p className="text-lg font-semibold text-gray-700">
                {environment === 'library' ? '安静的学习环境' :
                 environment === 'garden' ? '自然的思考空间' :
                 environment === 'beach' ? '放松的学习氛围' : '无限的想象空间'}
              </p>
              {backgroundMusic && (
                <p className="text-sm text-gray-500 mt-2">
                  🎵 背景音乐播放中...
                </p>
              )}
              {focusMode && (
                <p className="text-sm text-green-600 mt-2">
                  ⚡ 专注模式已开启
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 学习资源网格 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            推荐学习资源
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getResourceIcon(resource.type)}
                      <span className="font-semibold text-sm">{resource.title}</span>
                    </div>
                    {resource.completed && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        已完成
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className={getDifficultyColor(resource.difficulty)}>
                      {resource.difficulty === 'beginner' ? '初级' : 
                       resource.difficulty === 'intermediate' ? '中级' : '高级'}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-3 h-3" />
                      {resource.duration}分钟
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-sm">{resource.rating}</span>
                    </div>
                    <Progress value={resource.completed ? 100 : 0} className="w-20" />
                  </div>
                  
                  <Button 
                    onClick={() => startLearning(resource)}
                    disabled={currentResource !== null || resource.completed}
                    className="w-full"
                    variant={resource.completed ? "outline" : "default"}
                  >
                    {resource.completed ? '已完成' : currentResource?.id === resource.id ? '学习中...' : '开始学习'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 学习小组 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            学习小组
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {studyGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{group.name}</span>
                    {group.active && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        活跃
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-3">
                    {group.subject} · {group.members}名成员
                  </div>
                  
                  <Button className="w-full" size="sm">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    加入讨论
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 当前学习状态 */}
        {currentResource && (
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">正在学习: {currentResource.title}</h4>
                  <p className="text-sm text-gray-600">
                    预计剩余时间: {currentResource.duration}分钟
                  </p>
                </div>
                <Button variant="outline" size="sm">暂停</Button>
              </div>
              <Progress value={50} className="mt-2" />
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}