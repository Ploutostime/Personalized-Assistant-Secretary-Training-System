import { supabase } from './supabase';
import type {
  Profile,
  Task,
  KnowledgeItem,
  StudySession,
  ScheduleSettings,
  TaskType,
  PriorityLevel,
  TaskStatus,
} from '@/types/types';

// ==================== Profiles ====================

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('获取用户信息失败:', error);
    return null;
  }
  return data;
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<boolean> {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) {
    console.error('更新用户信息失败:', error);
    return false;
  }
  return true;
}

export async function getAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('获取所有用户失败:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
}

// ==================== Tasks ====================

export async function getTasks(userId: string, filters?: {
  status?: TaskStatus;
  type?: TaskType;
  priority?: PriorityLevel;
}): Promise<Task[]> {
  let query = supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId);

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.type) {
    query = query.eq('task_type', filters.type);
  }
  if (filters?.priority) {
    query = query.eq('priority', filters.priority);
  }

  const { data, error } = await query.order('deadline', { ascending: true, nullsFirst: false });

  if (error) {
    console.error('获取事务列表失败:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
}

export async function getTask(taskId: string): Promise<Task | null> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .maybeSingle();

  if (error) {
    console.error('获取事务详情失败:', error);
    return null;
  }
  return data;
}

export async function createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task | null> {
  const { data, error } = await supabase
    .from('tasks')
    .insert(task)
    .select()
    .maybeSingle();

  if (error) {
    console.error('创建事务失败:', error);
    return null;
  }
  return data;
}

export async function updateTask(taskId: string, updates: Partial<Task>): Promise<boolean> {
  const { error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId);

  if (error) {
    console.error('更新事务失败:', error);
    return false;
  }
  return true;
}

export async function deleteTask(taskId: string): Promise<boolean> {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) {
    console.error('删除事务失败:', error);
    return false;
  }
  return true;
}

export async function getUpcomingTasks(userId: string, days: number = 7): Promise<Task[]> {
  const now = new Date();
  const future = new Date();
  future.setDate(future.getDate() + days);

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .neq('status', 'completed')
    .gte('deadline', now.toISOString())
    .lte('deadline', future.toISOString())
    .order('deadline', { ascending: true });

  if (error) {
    console.error('获取即将到期的事务失败:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
}

// ==================== Knowledge Items ====================

export async function getKnowledgeItems(userId: string, subject?: string): Promise<KnowledgeItem[]> {
  let query = supabase
    .from('knowledge_items')
    .select('*')
    .eq('user_id', userId);

  if (subject) {
    query = query.eq('subject', subject);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('获取知识点列表失败:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
}

export async function getKnowledgeItem(itemId: string): Promise<KnowledgeItem | null> {
  const { data, error } = await supabase
    .from('knowledge_items')
    .select('*')
    .eq('id', itemId)
    .maybeSingle();

  if (error) {
    console.error('获取知识点详情失败:', error);
    return null;
  }
  return data;
}

export async function createKnowledgeItem(
  item: Omit<KnowledgeItem, 'id' | 'created_at' | 'updated_at'>
): Promise<KnowledgeItem | null> {
  const { data, error } = await supabase
    .from('knowledge_items')
    .insert(item)
    .select()
    .maybeSingle();

  if (error) {
    console.error('创建知识点失败:', error);
    return null;
  }
  return data;
}

export async function updateKnowledgeItem(itemId: string, updates: Partial<KnowledgeItem>): Promise<boolean> {
  const { error } = await supabase
    .from('knowledge_items')
    .update(updates)
    .eq('id', itemId);

  if (error) {
    console.error('更新知识点失败:', error);
    return false;
  }
  return true;
}

export async function deleteKnowledgeItem(itemId: string): Promise<boolean> {
  const { error } = await supabase
    .from('knowledge_items')
    .delete()
    .eq('id', itemId);

  if (error) {
    console.error('删除知识点失败:', error);
    return false;
  }
  return true;
}

export async function getReviewDueItems(userId: string): Promise<KnowledgeItem[]> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('knowledge_items')
    .select('*')
    .eq('user_id', userId)
    .lte('next_review_at', now)
    .order('next_review_at', { ascending: true });

  if (error) {
    console.error('获取待复习知识点失败:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
}

// ==================== Study Sessions ====================

export async function getStudySessions(userId: string, startDate?: Date, endDate?: Date): Promise<StudySession[]> {
  let query = supabase
    .from('study_sessions')
    .select('*')
    .eq('user_id', userId);

  if (startDate) {
    query = query.gte('start_time', startDate.toISOString());
  }
  if (endDate) {
    query = query.lte('start_time', endDate.toISOString());
  }

  const { data, error } = await query.order('start_time', { ascending: false });

  if (error) {
    console.error('获取学习记录失败:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
}

export async function createStudySession(
  session: Omit<StudySession, 'id' | 'created_at'>
): Promise<StudySession | null> {
  const { data, error } = await supabase
    .from('study_sessions')
    .insert(session)
    .select()
    .maybeSingle();

  if (error) {
    console.error('创建学习记录失败:', error);
    return null;
  }
  return data;
}

export async function updateStudySession(sessionId: string, updates: Partial<StudySession>): Promise<boolean> {
  const { error } = await supabase
    .from('study_sessions')
    .update(updates)
    .eq('id', sessionId);

  if (error) {
    console.error('更新学习记录失败:', error);
    return false;
  }
  return true;
}

export async function deleteStudySession(sessionId: string): Promise<boolean> {
  const { error } = await supabase
    .from('study_sessions')
    .delete()
    .eq('id', sessionId);

  if (error) {
    console.error('删除学习记录失败:', error);
    return false;
  }
  return true;
}

// ==================== Schedule Settings ====================

export async function getScheduleSettings(userId: string): Promise<ScheduleSettings | null> {
  const { data, error } = await supabase
    .from('schedule_settings')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('获取时间表设置失败:', error);
    return null;
  }
  return data;
}

export async function updateScheduleSettings(
  userId: string,
  updates: Partial<ScheduleSettings>
): Promise<boolean> {
  const { error } = await supabase
    .from('schedule_settings')
    .update(updates)
    .eq('user_id', userId);

  if (error) {
    console.error('更新时间表设置失败:', error);
    return false;
  }
  return true;
}

// ==================== Statistics ====================

export async function getStudyStats(userId: string) {
  // 获取总学习时长
  const { data: sessions } = await supabase
    .from('study_sessions')
    .select('duration_minutes')
    .eq('user_id', userId);

  const totalMinutes = sessions?.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) || 0;
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

  // 获取任务统计
  const { data: tasks } = await supabase
    .from('tasks')
    .select('status, task_type')
    .eq('user_id', userId);

  const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0;
  const pendingTasks = tasks?.filter(t => t.status === 'pending').length || 0;

  // 获取知识点数量
  const { count: knowledgeCount } = await supabase
    .from('knowledge_items')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  // 获取最近7天的学习时长
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: recentSessions } = await supabase
    .from('study_sessions')
    .select('start_time, duration_minutes')
    .eq('user_id', userId)
    .gte('start_time', sevenDaysAgo.toISOString());

  const weeklyHours = new Array(7).fill(0);
  recentSessions?.forEach(session => {
    const date = new Date(session.start_time);
    const dayIndex = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (dayIndex >= 0 && dayIndex < 7) {
      weeklyHours[6 - dayIndex] += (session.duration_minutes || 0) / 60;
    }
  });

  // 按类型统计任务
  const tasksByType: Record<string, number> = {
    competition: 0,
    homework: 0,
    exam: 0,
    study: 0,
    other: 0,
  };
  tasks?.forEach(task => {
    tasksByType[task.task_type] = (tasksByType[task.task_type] || 0) + 1;
  });

  return {
    totalHours,
    completedTasks,
    pendingTasks,
    knowledgeItems: knowledgeCount || 0,
    weeklyHours: weeklyHours.map(h => Math.round(h * 10) / 10),
    tasksByType,
  };
}
