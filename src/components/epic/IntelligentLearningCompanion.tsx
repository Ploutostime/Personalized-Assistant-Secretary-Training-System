import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Heart, 
  Star, 
  Zap, 
  Brain, 
  MessageCircle, 
  Settings,
  Gift,
  TrendingUp,
  Clock,
  BookOpen,
  Target,
  Award,
  Sparkles,
  Smile,
  ThumbsUp,
  Lightbulb
} from 'lucide-react';

interface Companion {
  id: string;
  name: string;
  type: '萝莉' | '御姐' | '学姐' | '大叔' | '霸总' | '骑士' | '书生' | '武者' | '程序员' | '运动员';
  personality: '温柔' | '严格' | '活泼' | '冷静' | '激励';
  level: number;
  experience: number;
  bondLevel: number; // 亲密度 1-100
  mood: 'happy' | 'neutral' | 'sad' | 'excited' | 'focused';
  skills: {
    teaching: number;
    motivation: number;
    empathy: number;
    knowledge: number;
  };
  currentOutfit: string;
  unlockedOutfits: string[];
}

interface Interaction {
  id: string;
  type: 'greeting' | 'question' | 'encouragement' | 'reminder' | 'joke' | 'fact';
  content: string;
  timestamp: Date;
  mood: string;
}

interface LearningGoal {
  id: string;
  title: string;
  subject: string;
  target: number; // 目标值
  current: number; // 当前值
  deadline?: Date;
  completed: boolean;
}

export function IntelligentLearningCompanion() {
  const [companion, setCompanion] = useState<Companion>({
    id: '1',
    name: '小智',
    type: '学姐',
    personality: '温柔',
    level: 5,
    experience: 250,
    bondLevel: 75,
    mood: 'happy',
    skills: {
      teaching: 80,
      motivation: 70,
      empathy: 90,
      knowledge: 85
    },
    currentOutfit: '校园风',
    unlockedOutfits: ['校园风', '休闲装', '职业装']
  });

  const [interactions, setInteractions] = useState<Interaction[]>([
    {
      id: '1',
      type: 'greeting',
      content: '早上好！今天也要加油学习哦！',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      mood: 'happy'
    },
    {
      id: '2',
      type: 'encouragement',
      content: '昨天的数学题做得很好，继续保持！',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      mood: 'excited'
    }
  ]);

  const [learningGoals, setLearningGoals] = useState<LearningGoal[]>([
    {
      id: '1',
      title: '完成高等数学第一章',
      subject: '数学',
      target: 100,
      current: 75,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      completed: false
    },
    {
      id: '2',
      title: '掌握50个英语单词',
      subject: '英语',
      target: 50,
      current: 30,
      completed: false
    }
  ]);

  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [interactions]);

  // 获取心情图标
  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happy': return <Smile className="w-4 h-4 text-yellow-500" />;
      case 'excited': return <Zap className="w-4 h-4 text-orange-500" />;
      case 'focused': return <Target className="w-4 h-4 text-blue-500" />;
      case 'sad': return <Heart className="w-4 h-4 text-red-500" />;
      default: return <Sparkles className="w-4 h-4 text-gray-500" />;
    }
  };

  // 获取互动类型颜色
  const getInteractionColor = (type: string) => {
    switch (type) {
      case 'greeting': return 'bg-blue-100 text-blue-800';
      case 'encouragement': return 'bg-green-100 text-green-800';
      case 'reminder': return 'bg-yellow-100 text-yellow-800';
      case 'question': return 'bg-purple-100 text-purple-800';
      case 'joke': return 'bg-pink-100 text-pink-800';
      case 'fact': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 发送消息
  const sendMessage = () => {
    if (!userInput.trim()) return;

    // 添加用户消息
    const userMessage: Interaction = {
      id: Date.now().toString(),
      type: 'question',
      content: userInput,
      timestamp: new Date(),
      mood: 'neutral'
    };

    setInteractions(prev => [...prev, userMessage]);
    setUserInput('');
    setIsTyping(true);

    // 模拟AI回复
    setTimeout(() => {
      const responses = [
        '这个问题很有趣！让我想想...',
        '根据我的知识库，这个问题的答案是...',
        '我注意到你在努力学习这个主题，真棒！',
        '让我用更简单的方式解释这个问题...',
        '你提出了一个很好的问题，这说明你在认真思考！'
      ];
      
      const aiResponse: Interaction = {
        id: (Date.now() + 1).toString(),
        type: Math.random() > 0.5 ? 'encouragement' : 'fact',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        mood: 'happy'
      };

      setInteractions(prev => [...prev, aiResponse]);
      setIsTyping(false);
      
      // 增加亲密度
      setCompanion(prev => ({
        ...prev,
        bondLevel: Math.min(prev.bondLevel + 1, 100),
        experience: prev.experience + 10
      }));
    }, 2000);
  };

  // 完成学习目标
  const completeGoal = (goalId: string) => {
    setLearningGoals(prev => prev.map(goal => 
      goal.id === goalId ? { ...goal, completed: true } : goal
    ));

    // 奖励
    setCompanion(prev => ({
      ...prev,
      experience: prev.experience + 50,
      bondLevel: Math.min(prev.bondLevel + 5, 100)
    }));
  };

  // 获取技能进度条颜色
  const getSkillColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-blue-500';
    if (value >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 伴侣信息卡片 */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* 3D伴侣形象 */}
              <div className="relative">
                <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                  <AvatarImage src={`/companions/${companion.type}.png`} />
                  <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-600 text-white text-2xl">
                    {companion.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                  <Star className="w-3 h-3 text-white" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-gray-800">{companion.name}</h2>
                  <Badge variant="outline" className="bg-white/80">
                    {companion.type}
                  </Badge>
                  <Badge variant="outline" className="bg-white/80">
                    {companion.personality}型
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>亲密度: {companion.bondLevel}/100</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    <span>等级: Lv.{companion.level}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {getMoodIcon(companion.mood)}
                    <span>心情: {
                      companion.mood === 'happy' ? '开心' :
                      companion.mood === 'excited' ? '兴奋' :
                      companion.mood === 'focused' ? '专注' :
                      companion.mood === 'sad' ? '低落' : '平静'
                    }</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-1" />
                设置
              </Button>
              <Button variant="outline" size="sm">
                <Gift className="w-4 h-4 mr-1" />
                送礼
              </Button>
            </div>
          </div>

          {/* 技能进度条 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {Object.entries(companion.skills).map(([skill, value]) => (
              <div key={skill} className="text-center">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>{
                    skill === 'teaching' ? '教学能力' :
                    skill === 'motivation' ? '激励能力' :
                    skill === 'empathy' ? '共情能力' : '知识储备'
                  }</span>
                  <span>{value}%</span>
                </div>
                <Progress value={value} className={`h-2 ${getSkillColor(value)}`} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 对话界面 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                智能对话
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-96 p-4">
                <div className="space-y-4">
                  {interactions.map((interaction) => (
                    <div
                      key={interaction.id}
                      className={`flex ${interaction.type === 'question' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                          interaction.type === 'question' 
                            ? 'bg-blue-100 text-blue-900' 
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {interaction.type !== 'question' && getMoodIcon(interaction.mood)}
                          <Badge className={getInteractionColor(interaction.type)}>
                            {interaction.type === 'greeting' ? '问候' :
                             interaction.type === 'encouragement' ? '鼓励' :
                             interaction.type === 'reminder' ? '提醒' :
                             interaction.type === 'question' ? '提问' :
                             interaction.type === 'joke' ? '笑话' : '知识点'}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {interaction.timestamp.toLocaleTimeString('zh-CN', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        <p className="text-sm">{interaction.content}</p>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                          <span className="text-sm text-gray-600">{companion.name}正在思考...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="和你的学习伴侣聊天..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} disabled={isTyping}>
                    发送
                  </Button>
                </div>
                
                <div className="flex gap-1 mt-2">
                  {['加油！', '今天学什么？', '帮我制定计划', '讲个笑话'].map((quickText) => (
                    <Button
                      key={quickText}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setUserInput(quickText);
                        setTimeout(sendMessage, 100);
                      }}
                    >
                      {quickText}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 学习目标和成就 */}
        <div className="space-y-6">
          {/* 学习目标 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                学习目标
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {learningGoals.map((goal) => (
                  <div key={goal.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{goal.title}</span>
                      <Badge variant="outline">{goal.subject}</Badge>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>进度</span>
                      <span>{goal.current}/{goal.target}</span>
                    </div>
                    <Progress value={(goal.current / goal.target) * 100} />
                    
                    {goal.deadline && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Clock className="w-3 h-3" />
                        截止: {goal.deadline.toLocaleDateString('zh-CN')}
                      </div>
                    )}
                    
                    <Button 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={() => completeGoal(goal.id)}
                      disabled={goal.completed}
                    >
                      {goal.completed ? '已完成' : '标记完成'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 今日成就 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                今日成就
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm">连续学习3天</span>
                  </div>
                  <Star className="w-4 h-4 text-yellow-500" />
                </div>
                
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">完成5个知识点</span>
                  </div>
                  <Star className="w-4 h-4 text-yellow-500" />
                </div>
                
                <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">亲密度+10</span>
                  </div>
                  <Star className="w-4 h-4 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 快速互动 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-600" />
                快速互动
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  <BookOpen className="w-4 h-4 mr-1" />
                  学习建议
                </Button>
                <Button variant="outline" size="sm">
                  <Heart className="w-4 h-4 mr-1" />
                  鼓励我
                </Button>
                <Button variant="outline" size="sm">
                  <Clock className="w-4 h-4 mr-1" />
                  制定计划
                </Button>
                <Button variant="outline" size="sm">
                  <Sparkles className="w-4 h-4 mr-1" />
                  讲个笑话
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}