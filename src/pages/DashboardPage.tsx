import { useEffect, useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUpcomingTasks, getReviewDueItems, getStudyStats, getVideoRecommendations, getProfile } from '@/db/api';
import type { Task, KnowledgeItem, VideoRecommendation } from '@/types/types';
import { Clock, ListTodo, BookMarked, TrendingUp, AlertCircle, CheckCircle2, Calendar, Video, Play, Eye, Brain, Users, Globe } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// 延迟加载组件
const SecretaryAssistant = lazy(() => import('@/components/SecretaryAssistant').then(module => ({ default: module.SecretaryAssistant })));
const SmartLearningAssistant = lazy(() => import('@/components/ai/SmartLearningAssistant').then(module => ({ default: module.SmartLearningAssistant })));
const ImmersiveLearningRoom = lazy(() => import('@/components/vr/ImmersiveLearningRoom').then(module => ({ default: module.ImmersiveLearningRoom })));
const LearningCommunity = lazy(() => import('@/components/social/LearningCommunity').then(module => ({ default: module.LearningCommunity })));

const priorityColors = {
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const priorityLabels = {
  low: '低',
  medium: '中',
  high: '高',
  urgent: '紧急',
};

const taskTypeLabels = {
  competition: '竞赛',
  homework: '作业',
  exam: '考试',
  study: '学习',
  other: '其他',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [reviewItems, setReviewItems] = useState<KnowledgeItem[]>([]);
  const [recommendedVideos, setRecommendedVideos] = useState<VideoRecommendation[]>([]);
  const [userMajor, setUserMajor] = useState<string>('');
  const [stats, setStats] = useState({
    totalHours: 0,
    completedTasks: 0,
    pendingTasks: 0,
    knowledgeItems: 0,
  });
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [tasks, items, statistics, profile, videos] = await Promise.all([
          getUpcomingTasks(user.id, 7),
          getReviewDueItems(user.id),
          getStudyStats(user.id),
          getProfile(user.id),
          getVideoRecommendations(user.id, { is_watched: false }),
        ]);

        setUpcomingTasks(tasks.slice(0, 5));
        setReviewItems(items.slice(0, 5));
        setStats(statistics);
        setUserMajor(profile?.major || '');
        setRecommendedVideos(videos.slice(0, 3));
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2 bg-muted" />
          <Skeleton className="h-4 w-96 bg-muted" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24 bg-muted" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold text-primary">智能学习中心</h1>
        <p className="text-muted-foreground mt-1">欢迎回来，{userMajor ? `${userMajor}专业的同学` : '同学'}！开始高效学习吧！</p>
      </div>

      {/* 主标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <TrendingUp className="w-4 h-4 mr-2" />
            学习概览
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Brain className="w-4 h-4 mr-2" />
            AI助手
          </TabsTrigger>
          <TabsTrigger value="immersion">
            <Globe className="w-4 h-4 mr-2" />
            沉浸学习
          </TabsTrigger>
          <TabsTrigger value="community">
            <Users className="w-4 h-4 mr-2" />
            学习社区
          </TabsTrigger>
        </TabsList>

        {/* 学习概览标签页 */}
        <TabsContent value="overview" className="space-y-6">
          {/* 秘书助手 */}
          <Suspense fallback={
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-24 h-32 bg-muted" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32 bg-muted" />
                    <Skeleton className="h-3 w-48 bg-muted" />
                  </div>
                </div>
              </CardContent>
            </Card>
          }>
            <SecretaryAssistant />
          </Suspense>

          {/* 统计卡片 */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">总学习时长</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stats.totalHours} 小时</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">已完成任务</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary">{stats.completedTasks}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">待完成任务</CardTitle>
                <ListTodo className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.pendingTasks}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">知识点收藏</CardTitle>
                <BookMarked className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.knowledgeItems}</div>
              </CardContent>
            </Card>
          </div>

          {/* 主要内容区域 */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* 即将到期任务 */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  即将到期任务
                </CardTitle>
                <CardDescription>最近7天内需要完成的任务</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingTasks.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(task.due_date), 'MM月dd日 HH:mm', { locale: zhCN })}
                          </div>
                        </div>
                        <Badge className={priorityColors[task.priority]}>
                          {priorityLabels[task.priority]}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    暂无即将到期的任务
                  </div>
                )}
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link to="/tasks">查看所有任务</Link>
                </Button>
              </CardContent>
            </Card>

            {/* 需要复习的知识点 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookMarked className="h-5 w-5 text-green-600" />
                  需要复习
                </CardTitle>
                <CardDescription>根据遗忘曲线提醒</CardDescription>
              </CardHeader>
              <CardContent>
                {reviewItems.length > 0 ? (
                  <div className="space-y-3">
                    {reviewItems.map((item) => (
                      <div key={item.id} className="p-3 border rounded-lg">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-muted-foreground">
                          上次复习: {format(new Date(item.last_reviewed), 'MM月dd日', { locale: zhCN })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    暂无需要复习的知识点
                  </div>
                )}
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link to="/knowledge">管理知识点</Link>
                </Button>
              </CardContent>
            </Card>

            {/* 视频推荐 */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-blue-600" />
                  推荐视频
                </CardTitle>
                <CardDescription>根据您的专业和兴趣推荐</CardDescription>
              </CardHeader>
              <CardContent>
                {recommendedVideos.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-3">
                    {recommendedVideos.map((video) => (
                      <div key={video.id} className="border rounded-lg overflow-hidden">
                        <div className="aspect-video bg-muted relative">
                          <img
                            src={video.thumbnail_url || '/placeholder-image.jpg'}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                            <Play className="h-8 w-8 text-white opacity-0 hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        <div className="p-3">
                          <div className="font-medium text-sm mb-1 line-clamp-2">{video.title}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <Eye className="h-3 w-3" />
                            {video.duration}分钟
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    暂无推荐视频
                  </div>
                )}
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link to="/video-terminal">查看更多视频</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI助手标签页 */}
        <TabsContent value="ai">
          <Suspense fallback={
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center">
                  <Skeleton className="h-64 w-full bg-muted" />
                </div>
              </CardContent>
            </Card>
          }>
            <SmartLearningAssistant />
          </Suspense>
        </TabsContent>

        {/* 沉浸学习标签页 */}
        <TabsContent value="immersion">
          <Suspense fallback={
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center">
                  <Skeleton className="h-96 w-full bg-muted" />
                </div>
              </CardContent>
            </Card>
          }>
            <ImmersiveLearningRoom />
          </Suspense>
        </TabsContent>

        {/* 学习社区标签页 */}
        <TabsContent value="community">
          <Suspense fallback={
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center">
                  <Skeleton className="h-96 w-full bg-muted" />
                </div>
              </CardContent>
            </Card>
          }>
            <LearningCommunity />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}