import { Task, TaskType, PriorityLevel, ScheduleSettings } from '../types/types';
import { addHours, addDays, startOfDay, endOfDay, isBefore, isAfter, parseISO, format } from 'date-fns';

export interface ScheduledTask extends Task {
  scheduled_start: Date;
  scheduled_end: Date;
}

export interface DailySchedule {
  date: string;
  tasks: ScheduledTask[];
}

/**
 * 时间表自动生成算法 (优化版)
 * 
 * 核心逻辑：
 * 1. 追踪每个任务的剩余预计时长。
 * 2. 严格遵守任务截止日期，不安排截止后的任务。
 * 3. 区分长线任务（分散完成）和短线任务（一次性完成）。
 * 4. 排序规则：截止日期优先 > 优先级。
 */
/**
 * 时间表自动生成算法 (紧急程度驱动版)
 * 
 * 核心逻辑：
 * 1. 长线任务 (Exam, Competition, Study)：用户无需填写总时长。
 *    - 每日分配时长取决于：优先级权重 + 临近截止日期的紧迫度。
 *    - 优先级越高，每日分配时间越多。
 * 2. 短线任务 (Homework)：倾向于一次性完成。
 * 3. 排序规则：紧急程度 (Priority) > 截止日期 (Deadline)。
 */
export function generateSchedule(
  tasks: Task[],
  settings: ScheduleSettings,
  startDate: Date = new Date(),
  daysToSchedule?: number // 可选，如果不传则根据任务自动计算
): DailySchedule[] {
  const schedule: DailySchedule[] = [];
  const today = startOfDay(new Date());
  
  // 1. 动态计算生成天数
  let actualDaysToSchedule = daysToSchedule || 30; // 默认 30 天
  if (!daysToSchedule) {
    const deadlines = tasks
      .filter(t => t.deadline && t.status !== 'completed' && t.status !== 'cancelled')
      .map(t => parseISO(t.deadline!));
    
    if (deadlines.length > 0) {
      const maxDeadline = new Date(Math.max(...deadlines.map(d => d.getTime())));
      const daysUntilMax = Math.ceil((maxDeadline.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      // 至少生成 30 天，最多生成 180 天（半年），防止过度计算
      actualDaysToSchedule = Math.min(Math.max(30, daysUntilMax + 1), 180);
    }
  }

  // 追踪作业类任务是否已完成安排 (支持跨日分配)
  const homeworkRemainingHours = new Map<string, number>();
  tasks.forEach(t => {
    if (t.task_type === 'homework' && t.status !== 'completed' && t.status !== 'cancelled') {
      homeworkRemainingHours.set(t.id, Number(t.estimated_hours) || 1.5);
    }
  });

  for (let i = 0; i < actualDaysToSchedule; i++) {
    const currentDay = addDays(startDate, i);
    const dateStr = format(currentDay, 'yyyy-MM-dd');
    const dayTasks: ScheduledTask[] = [];
    
    let remainingHours = settings.daily_study_goal_hours;
    let currentTime = combineDateAndTime(currentDay, settings.preferred_start_time);
    const dayEndTime = combineDateAndTime(currentDay, settings.preferred_end_time);

    // 获取当前日期下可安排的任务
    const availableTasks = tasks
      .filter(t => {
        if (t.status === 'completed' || t.status === 'cancelled') return false;
        
        // 1. 作业检查：如果剩余时长为 0 则不再安排
        if (t.task_type === 'homework') {
          const remaining = homeworkRemainingHours.get(t.id) || 0;
          if (remaining <= 0) return false;
        }

        // 2. 截止日期检查（不安排已过期的任务）
        let deadlineDate: Date | null = null;
        if (t.deadline) {
          deadlineDate = parseISO(t.deadline);
          if (isBefore(deadlineDate, startOfDay(currentDay))) return false;
        }

        // 3. 启动窗口检查 (Start Window Logic)
        if (['exam', 'competition', 'study', 'homework'].includes(t.task_type)) {
          if (!t.deadline) return true;

          const deadlineDateObj = startOfDay(parseISO(t.deadline));
          const currentDayStart = startOfDay(currentDay);

          // 计算当前天距离截止日期的天数差
          const diffDays = Math.ceil((deadlineDateObj.getTime() - currentDayStart.getTime()) / (1000 * 60 * 60 * 24));

          switch (t.priority) {
            case 'urgent':
              return true; // 紧急：即刻开始
            case 'high':
              return diffDays <= 90; // 高：提前 3 个月 (90天)
            case 'medium':
              return diffDays <= 30; // 中：提前 1 个月 (30天)
            case 'low':
              return diffDays <= 14; // 低：提前 2 周 (14天)
            default:
              return true;
          }
        }

        return true;
      })
      .sort((a, b) => {
        // 排序逻辑：优先级绝对优先，其次是截止日期
        const pDiff = comparePriority(a.priority, b.priority);
        if (pDiff !== 0) return pDiff;

        if (a.deadline && b.deadline) {
          return parseISO(a.deadline).getTime() - parseISO(b.deadline).getTime();
        }
        return a.deadline ? -1 : (b.deadline ? 1 : 0);
      });

    for (const task of availableTasks) {
      if (remainingHours <= 0 || isAfter(currentTime, dayEndTime)) break;

      let allocation = 0;

      if (['exam', 'competition', 'study'].includes(task.task_type)) {
        // 动态时长分配逻辑：
        // 1. 优先使用用户设定的“每日期望投入时间” (estimated_hours)
        // 2. 如果未设定，则使用基于优先级的默认建议值
        const baseHoursMap: Record<PriorityLevel, number> = {
          'urgent': 2.5,
          'high': 1.8,
          'medium': 1.2,
          'low': 0.8
        };

        let dailyHours = Number(task.estimated_hours) || baseHoursMap[task.priority];

        // 临近加权：只有在用户未手动指定时长的情况下，才应用自动冲刺加权
        if (!task.estimated_hours && task.deadline) {
          const daysUntil = Math.max(1, Math.ceil((parseISO(task.deadline).getTime() - currentDay.getTime()) / (1000 * 60 * 60 * 24)));
          if (daysUntil <= 3 && (task.priority === 'urgent' || task.priority === 'high')) {
            dailyHours *= 1.3; 
          }
        }

        allocation = Math.min(dailyHours, remainingHours);
      } else {
        // 作业类任务调度优化：
        // 对于大工作量作业，设定每日最大投入上限（例如 4 小时），防止单日过载
        const remainingForTask = homeworkRemainingHours.get(task.id) || 0;
        const maxDailyHomeworkHours = 4.0;
        
        allocation = Math.min(remainingForTask, remainingHours, maxDailyHomeworkHours);
        
        // 更新剩余时长
        homeworkRemainingHours.set(task.id, Math.max(0, remainingForTask - allocation));
      }

      if (allocation >= 0.25) {
        const endTime = addHours(currentTime, allocation);
        dayTasks.push({
          ...task,
          scheduled_start: currentTime,
          scheduled_end: endTime
        });
        
        currentTime = addHours(endTime, settings.break_duration_minutes / 60);
        remainingHours -= allocation;
      }
    }


    schedule.push({
      date: dateStr,
      tasks: dayTasks
    });
  }

  return schedule;
}


function isSameDay(date1: Date, date2: Date): boolean {
  return format(date1, 'yyyy-MM-dd') === format(date2, 'yyyy-MM-dd');
}


function comparePriority(a: PriorityLevel, b: PriorityLevel): number {
  const weights: Record<PriorityLevel, number> = {
    'urgent': 4,
    'high': 3,
    'medium': 2,
    'low': 1
  };
  return weights[b] - weights[a];
}

function combineDateAndTime(date: Date, timeStr: string): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const newDate = startOfDay(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
}
