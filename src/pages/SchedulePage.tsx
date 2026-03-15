import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getTasks, getScheduleSettings, generateAndGetSchedule } from '@/db/api';
import type { Task, ScheduleSettings } from '@/types/types';
import type { DailySchedule, ScheduledTask } from '@/utils/scheduler';
import { Calendar as CalendarIcon, Clock, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const taskTypeLabels = {
  competition: '竞赛',
  homework: '作业',
  exam: '考试',
  study: '学习',
  other: '其他',
};

const priorityColors = {
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const isScheduledTask = (task: Task | ScheduledTask): task is ScheduledTask => {
  return 'scheduled_start' in task;
};

export default function SchedulePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [settings, setSettings] = useState<ScheduleSettings | null>(null);
  const [autoSchedule, setAutoSchedule] = useState<DailySchedule[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    const [tasksData, settingsData] = await Promise.all([
      getTasks(user.id, { status: 'pending' }),
      getScheduleSettings(user.id),
    ]);
    setTasks(tasksData.filter(t => t.deadline));
    setSettings(settingsData);
    setLoading(false);
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const getTasksForDay = (date: Date) => {
    // 如果有自动生成的计划，优先显示计划
    if (autoSchedule.length > 0) {
      const daySchedule = autoSchedule.find(s => isSameDay(new Date(s.date), date));
      if (daySchedule) return daySchedule.tasks;
    }

    return tasks.filter(task => {
      if (!task.deadline) return false;
      return isSameDay(new Date(task.deadline), date);
    });
  };

  const handleGenerateSchedule = async () => {
    if (!user) return;
    setIsGenerating(true);
    try {
      // 修正：不再传入固定天数，由算法根据任务截止日期动态决定生成时长
      const schedule = await generateAndGetSchedule(user.id, new Date());
      setAutoSchedule(schedule);
    } catch (error) {
      console.error('生成时间表失败:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const goToPreviousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const goToToday = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 bg-muted" />
        <Skeleton className="h-96 bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">时间表</h1>
          <p className="text-muted-foreground mt-1">查看你的学习计划和任务安排</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="default" 
            onClick={handleGenerateSchedule}
            disabled={isGenerating}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            一键智能生成
          </Button>
          <Button variant="outline" onClick={goToPreviousWeek}>上一周</Button>
          <Button variant="outline" onClick={goToToday}>今天</Button>
          <Button variant="outline" onClick={goToNextWeek}>下一周</Button>
        </div>
      </div>

      {/* 学习目标卡片 */}
      {settings && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              学习目标设置
            </CardTitle>
            <CardDescription>每日学习时长目标和时间偏好</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">每日目标：</span>
                <span className="font-semibold">{settings.daily_study_goal_hours} 小时</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">学习时段：</span>
                <span className="font-semibold">
                  {settings.preferred_start_time} - {settings.preferred_end_time}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">休息时长：</span>
                <span className="font-semibold">{settings.break_duration_minutes} 分钟</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 周视图时间表 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            本周计划
          </CardTitle>
          <CardDescription>
            {format(weekDays[0], 'yyyy年MM月dd日', { locale: zhCN })} -{' '}
            {format(weekDays[6], 'yyyy年MM月dd日', { locale: zhCN })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {weekDays.map((day, index) => {
              const dayTasks = getTasksForDay(day);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={index}
                  className={`border rounded-lg p-4 min-h-[200px] ${
                    isToday ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className="text-center mb-3">
                    <div className="text-sm text-muted-foreground">
                      {format(day, 'EEEE', { locale: zhCN })}
                    </div>
                    <div className={`text-2xl font-bold ${isToday ? 'text-primary' : ''}`}>
                      {format(day, 'd', { locale: zhCN })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {dayTasks.length === 0 ? (
                      <div className="text-center text-sm text-muted-foreground py-4">
                        无任务
                      </div>
                    ) : (
                      dayTasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-2 rounded-md bg-card border border-border hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">{task.title}</div>
                              <div className="flex items-center gap-1 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {taskTypeLabels[task.task_type]}
                                </Badge>
                                <Badge className={`text-xs ${priorityColors[task.priority]}`}>
                                  {task.priority === 'urgent' ? '紧急' : 
                                   task.priority === 'high' ? '高' : 
                                   task.priority === 'medium' ? '中' : '低'}
                                </Badge>
                              </div>
                              {isScheduledTask(task) ? (
                                <>
                                  <div className="text-xs text-primary font-medium mt-1 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {format(new Date(task.scheduled_start), 'HH:mm')} - {format(new Date(task.scheduled_end), 'HH:mm')}
                                  </div>
                                  {task.deadline && (
                                    <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                                      <CalendarIcon className="h-2.5 w-2.5" />
                                      截止: {format(new Date(task.deadline), 'MM-dd HH:mm')}
                                    </div>
                                  )}
                                </>
                              ) : task.deadline && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  {format(new Date(task.deadline), 'HH:mm', { locale: zhCN })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 提示信息 */}
      <Card className="border-secondary/50 bg-secondary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-secondary mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-secondary mb-1">智能时间表提示</h4>
              <p className="text-sm text-muted-foreground">
                系统会根据你的任务截止时间、优先级和学习目标，自动生成最优的学习计划。
                你可以在"设置"页面中调整学习时段和目标时长。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
