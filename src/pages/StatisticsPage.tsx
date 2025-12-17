import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getStudyStats } from '@/db/api';
import { BarChart3, TrendingUp, Clock, CheckCircle2, BookMarked, ListTodo } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const taskTypeLabels = {
  competition: '竞赛',
  homework: '作业',
  exam: '考试',
  study: '学习',
  other: '其他',
};

const taskTypeColors = {
  competition: 'hsl(var(--chart-1))',
  homework: 'hsl(var(--chart-2))',
  exam: 'hsl(var(--chart-3))',
  study: 'hsl(var(--chart-4))',
  other: 'hsl(var(--chart-5))',
};

export default function StatisticsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalHours: 0,
    completedTasks: 0,
    pendingTasks: 0,
    knowledgeItems: 0,
    weeklyHours: [] as number[],
    tasksByType: {} as Record<string, number>,
  });

  useEffect(() => {
    if (!user) return;
    loadStats();
  }, [user]);

  const loadStats = async () => {
    if (!user) return;
    setLoading(true);
    const data = await getStudyStats(user.id);
    setStats(data);
    setLoading(false);
  };

  const weeklyData = stats.weeklyHours.map((hours, index) => {
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    return {
      day: days[index],
      hours: hours,
    };
  });

  const taskTypeData = Object.entries(stats.tasksByType).map(([type, count]) => ({
    type: taskTypeLabels[type as keyof typeof taskTypeLabels] || type,
    count: count,
    color: taskTypeColors[type as keyof typeof taskTypeColors] || 'hsl(var(--chart-1))',
  }));

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 bg-muted" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 bg-muted" />
          ))}
        </div>
        <Skeleton className="h-96 bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">学习统计</h1>
        <p className="text-muted-foreground mt-1">查看你的学习数据和进度分析</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">总学习时长</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalHours} 小时</div>
            <p className="text-xs text-muted-foreground mt-1">累计学习时间</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">已完成任务</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{stats.completedTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">完成的学习任务</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">待办任务</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">等待完成的任务</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">知识收藏</CardTitle>
            <BookMarked className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.knowledgeItems}</div>
            <p className="text-xs text-muted-foreground mt-1">收藏的知识点</p>
          </CardContent>
        </Card>
      </div>

      {/* 本周学习时长图表 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            本周学习时长
          </CardTitle>
          <CardDescription>最近7天的学习时间统计</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="day"
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  label={{ value: '小时', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 任务类型分布图表 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-secondary" />
            任务类型分布
          </CardTitle>
          <CardDescription>不同类型任务的数量统计</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskTypeData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="type"
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  label={{ value: '数量', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {taskTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 学习效率分析 */}
      <Card>
        <CardHeader>
          <CardTitle>学习效率分析</CardTitle>
          <CardDescription>基于你的学习数据的建议</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold text-primary mb-1">学习进度</h4>
              <p className="text-sm text-muted-foreground">
                你已经完成了 {stats.completedTasks} 个任务，还有 {stats.pendingTasks} 个任务待完成。
                继续保持良好的学习习惯！
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/5 border border-secondary/20">
            <Clock className="h-5 w-5 text-secondary mt-0.5" />
            <div>
              <h4 className="font-semibold text-secondary mb-1">时间管理</h4>
              <p className="text-sm text-muted-foreground">
                本周平均每天学习 {(stats.weeklyHours.reduce((a, b) => a + b, 0) / 7).toFixed(1)} 小时。
                建议保持规律的学习时间，提高学习效率。
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-accent border border-border">
            <BookMarked className="h-5 w-5 text-accent-foreground mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">知识积累</h4>
              <p className="text-sm text-muted-foreground">
                你已经收藏了 {stats.knowledgeItems} 个知识点。
                定期复习可以帮助你更好地巩固知识。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
