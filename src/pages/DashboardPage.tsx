import { useEffect, useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getUpcomingTasks, getReviewDueItems, getStudyStats, getVideoRecommendations, getProfile } from '@/db/api';
import type { Task, KnowledgeItem, VideoRecommendation } from '@/types/types';
import { Clock, ListTodo, BookMarked, TrendingUp, AlertCircle, CheckCircle2, Calendar, Video, Play, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// 延迟加载秘书助手组件（包含3D渲染）
const SecretaryAssistant = lazy(() => import('@/components/SecretaryAssistant').then(module => ({ default: module.SecretaryAssistant })));

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
        <h1 className="text-3xl font-bold text-primary">仪表盘</h1>
        <p className="text-muted-foreground mt-1">欢迎回来，开始高效学习吧！</p>
      </div>

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
            <CardTitle className="text-sm font-medium">待办任务</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">知识收藏</CardTitle>
            <BookMarked className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.knowledgeItems}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 即将到期的任务 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  即将到期
                </CardTitle>
                <CardDescription>未来7天内需要完成的任务</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/tasks">查看全部</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>暂无即将到期的任务</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium truncate">{task.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {taskTypeLabels[task.task_type]}
                        </Badge>
                      </div>
                      {task.deadline && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(task.deadline), 'MM月dd日 HH:mm', { locale: zhCN })}
                        </p>
                      )}
                    </div>
                    <Badge className={priorityColors[task.priority]}>
                      {priorityLabels[task.priority]}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 待复习知识点 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-secondary" />
                  待复习知识点
                </CardTitle>
                <CardDescription>需要复习的知识点</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/knowledge">查看全部</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {reviewItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookMarked className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>暂无待复习的知识点</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviewItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate mb-1">{item.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {item.subject && (
                          <Badge variant="secondary" className="text-xs">
                            {item.subject}
                          </Badge>
                        )}
                        <span>已复习 {item.review_count} 次</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 推荐视频 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-primary" />
                  推荐视频
                  {userMajor && (
                    <Badge variant="outline" className="ml-2">
                      {userMajor}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {userMajor ? '根据您的专业推荐' : '设置专业后获得精准推荐'}
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/video-terminal">查看全部</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!userMajor ? (
              <div className="text-center py-8">
                <Video className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground mb-4">设置您的专业信息，获得个性化视频推荐</p>
                <Button asChild>
                  <Link to="/video-terminal">立即设置</Link>
                </Button>
              </div>
            ) : recommendedVideos.length === 0 ? (
              <div className="text-center py-8">
                <Video className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground mb-4">暂无推荐视频</p>
                <Button asChild variant="outline">
                  <Link to="/video-terminal">添加视频</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recommendedVideos.map((video) => (
                  <div
                    key={video.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors group"
                  >
                    {video.video_cover && (
                      <div className="relative w-32 h-20 rounded overflow-hidden shrink-0 bg-muted">
                        <img
                          src={video.video_cover}
                          alt={video.video_title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium line-clamp-2 mb-1">{video.video_title}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {video.author && <span>{video.author}</span>}
                        {video.tags && video.tags.length > 0 && (
                          <>
                            <span>•</span>
                            <Badge variant="secondary" className="text-xs">
                              {video.tags[0]}
                            </Badge>
                          </>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="mt-2 h-7 text-xs"
                        onClick={() => window.open(video.video_url, '_blank')}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        观看视频
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
