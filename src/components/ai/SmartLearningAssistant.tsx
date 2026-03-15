import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, 
  MessageSquare, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Zap,
  Lightbulb,
  Clock,
  CheckCircle2
} from 'lucide-react';

interface LearningSession {
  id: string;
  subject: string;
  duration: number; // 分钟
  focusScore: number; // 1-10
  topics: string[];
  timestamp: Date;
}

interface LearningRecommendation {
  type: 'review' | 'new' | 'practice' | 'break';
  subject: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number;
}

export function SmartLearningAssistant() {
  const [currentSession, setCurrentSession] = useState<LearningSession | null>(null);
  const [sessions, setSessions] = useState<LearningSession[]>([]);
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 模拟AI分析学习数据
  const analyzeLearningPatterns = () => {
    setIsAnalyzing(true);
    
    // 模拟AI分析过程
    setTimeout(() => {
      const newRecommendations: LearningRecommendation[] = [
        {
          type: 'review',
          subject: '高等数学',
          reason: '根据遗忘曲线，您需要复习3天前学习的内容',
          priority: 'high',
          estimatedTime: 45
        },
        {
          type: 'practice',
          subject: '编程算法',
          reason: '检测到您对递归算法的掌握度较低',
          priority: 'medium',
          estimatedTime: 60
        },
        {
          type: 'new',
          subject: '机器学习基础',
          reason: '基于您的专业方向推荐学习新知识',
          priority: 'medium',
          estimatedTime: 90
        },
        {
          type: 'break',
          subject: '休息',
          reason: '连续学习时间过长，建议休息15分钟',
          priority: 'high',
          estimatedTime: 15
        }
      ];
      
      setRecommendations(newRecommendations);
      setIsAnalyzing(false);
    }, 2000);
  };

  // 开始学习会话
  const startLearningSession = (subject: string) => {
    const newSession: LearningSession = {
      id: Date.now().toString(),
      subject,
      duration: 0,
      focusScore: 8,
      topics: [subject],
      timestamp: new Date()
    };
    
    setCurrentSession(newSession);
    
    // 模拟计时器
    const timer = setInterval(() => {
      setCurrentSession(prev => prev ? {
        ...prev,
        duration: prev.duration + 1
      } : null);
    }, 60000);
    
    return () => clearInterval(timer);
  };

  // 获取推荐类型图标
  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'review': return <BookOpen className="w-4 h-4" />;
      case 'new': return <Lightbulb className="w-4 h-4" />;
      case 'practice': return <Target className="w-4 h-4" />;
      case 'break': return <Clock className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  // 获取优先级颜色
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Brain className="w-8 h-8 text-blue-600" />
          智能学习助手
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* 当前学习状态 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-green-600" />
              <span className="font-semibold">今日学习时长</span>
            </div>
            <p className="text-2xl font-bold text-green-700">2小时 15分钟</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="font-semibold">学习效率</span>
            </div>
            <p className="text-2xl font-bold text-blue-700">85%</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-purple-600" />
              <span className="font-semibold">目标完成度</span>
            </div>
            <p className="text-2xl font-bold text-purple-700">70%</p>
          </div>
        </div>

        {/* AI分析按钮 */}
        <div className="flex gap-4">
          <Button 
            onClick={analyzeLearningPatterns}
            disabled={isAnalyzing}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Brain className="w-4 h-4 mr-2" />
            {isAnalyzing ? '分析中...' : 'AI分析学习模式'}
          </Button>
          
          <Button variant="outline" className="flex-1">
            <MessageSquare className="w-4 h-4 mr-2" />
            学习咨询
          </Button>
        </div>

        {/* 个性化推荐 */}
        {recommendations.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              AI个性化推荐
            </h3>
            
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getRecommendationIcon(rec.type)}
                        <span className="font-semibold">{rec.subject}</span>
                        <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                          {rec.priority === 'high' ? '高优先级' : rec.priority === 'medium' ? '中优先级' : '低优先级'}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">{rec.estimatedTime}分钟</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{rec.reason}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        开始学习
                      </Button>
                      <Button size="sm" variant="ghost">
                        稍后提醒
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* 快速学习入口 */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">快速开始学习</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['数学', '英语', '编程', '物理', '化学', '历史', '生物', '地理'].map((subject) => (
              <Button 
                key={subject}
                variant="outline" 
                className="h-16 text-sm"
                onClick={() => startLearningSession(subject)}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                {subject}
              </Button>
            ))}
          </div>
        </div>

        {/* 学习输入框 */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">学习问题咨询</h3>
          <div className="flex gap-2">
            <Input 
              placeholder="输入您的学习问题或困惑..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-1"
            />
            <Button>提问</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}