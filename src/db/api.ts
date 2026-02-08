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
  MajorTag,
  VideoRecommendation,
  VideoWatchHistory,
  UserPreferences,
  SecretaryAvatar,
  SecretaryPersonality,
  SecretaryConfig,
  StartupSector,
  StartupKnowledgeMap,
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

// ==================== Major Tags ====================

export async function getMajorTags(): Promise<MajorTag[]> {
  const { data, error } = await supabase
    .from('major_tags')
    .select('*')
    .order('category', { ascending: true });

  if (error) {
    console.error('获取专业标签失败:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
}

// ==================== Video Recommendations ====================

export async function getVideoRecommendations(
  userId: string,
  filters?: { is_favorited?: boolean; is_watched?: boolean }
): Promise<VideoRecommendation[]> {
  let query = supabase
    .from('video_recommendations')
    .select('*')
    .eq('user_id', userId);

  if (filters?.is_favorited !== undefined) {
    query = query.eq('is_favorited', filters.is_favorited);
  }
  if (filters?.is_watched !== undefined) {
    query = query.eq('is_watched', filters.is_watched);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('获取视频推荐失败:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
}

export async function getVideoRecommendation(videoId: string): Promise<VideoRecommendation | null> {
  const { data, error } = await supabase
    .from('video_recommendations')
    .select('*')
    .eq('id', videoId)
    .maybeSingle();

  if (error) {
    console.error('获取视频详情失败:', error);
    return null;
  }
  return data;
}

export async function createVideoRecommendation(
  video: Omit<VideoRecommendation, 'id' | 'created_at' | 'updated_at'>
): Promise<VideoRecommendation | null> {
  const { data, error } = await supabase
    .from('video_recommendations')
    .insert(video)
    .select()
    .maybeSingle();

  if (error) {
    console.error('创建视频推荐失败:', error);
    return null;
  }
  return data;
}

export async function updateVideoRecommendation(
  videoId: string,
  updates: Partial<VideoRecommendation>
): Promise<boolean> {
  const { error } = await supabase
    .from('video_recommendations')
    .update(updates)
    .eq('id', videoId);

  if (error) {
    console.error('更新视频推荐失败:', error);
    return false;
  }
  return true;
}

export async function deleteVideoRecommendation(videoId: string): Promise<boolean> {
  const { error } = await supabase
    .from('video_recommendations')
    .delete()
    .eq('id', videoId);

  if (error) {
    console.error('删除视频推荐失败:', error);
    return false;
  }
  return true;
}

export async function toggleVideoFavorite(videoId: string, isFavorited: boolean): Promise<boolean> {
  return updateVideoRecommendation(videoId, { is_favorited: isFavorited });
}

export async function markVideoAsWatched(videoId: string, progress: number = 100): Promise<boolean> {
  return updateVideoRecommendation(videoId, {
    is_watched: true,
    watch_progress: progress,
    watched_at: new Date().toISOString(),
  });
}

// ==================== Video Watch History ====================

export async function getVideoWatchHistory(userId: string): Promise<VideoWatchHistory[]> {
  const { data, error } = await supabase
    .from('video_watch_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('获取观看历史失败:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
}

export async function createVideoWatchHistory(
  history: Omit<VideoWatchHistory, 'id' | 'created_at' | 'updated_at'>
): Promise<VideoWatchHistory | null> {
  const { data, error } = await supabase
    .from('video_watch_history')
    .insert(history)
    .select()
    .maybeSingle();

  if (error) {
    console.error('创建观看历史失败:', error);
    return null;
  }
  return data;
}

export async function updateVideoWatchHistory(
  historyId: string,
  updates: Partial<VideoWatchHistory>
): Promise<boolean> {
  const { error } = await supabase
    .from('video_watch_history')
    .update(updates)
    .eq('id', historyId);

  if (error) {
    console.error('更新观看历史失败:', error);
    return false;
  }
  return true;
}

// ==================== User Preferences ====================

export async function getUserPreferences(userId: string): Promise<UserPreferences | null> {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('获取用户偏好失败:', error);
    return null;
  }
  return data;
}

export async function updateUserPreferences(
  userId: string,
  updates: Partial<UserPreferences>
): Promise<boolean> {
  const { error } = await supabase
    .from('user_preferences')
    .update(updates)
    .eq('user_id', userId);

  if (error) {
    console.error('更新用户偏好失败:', error);
    return false;
  }
  return true;
}

// ==================== Secretary Customization ====================

// 获取所有秘书形象
export async function getSecretaryAvatars(): Promise<SecretaryAvatar[]> {
  const { data, error } = await supabase
    .from('secretary_avatars')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('获取秘书形象失败:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
}

// 获取单个秘书形象
export async function getSecretaryAvatarById(id: string): Promise<SecretaryAvatar | null> {
  const { data, error } = await supabase
    .from('secretary_avatars')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('获取秘书形象失败:', error);
    return null;
  }
  return data;
}

// 根据类型获取秘书形象
export async function getSecretaryAvatarByType(type: string): Promise<SecretaryAvatar | null> {
  const { data, error } = await supabase
    .from('secretary_avatars')
    .select('*')
    .eq('type', type)
    .maybeSingle();

  if (error) {
    console.error('获取秘书形象失败:', error);
    return null;
  }
  return data;
}

// 获取所有秘书性格
export async function getSecretaryPersonalities(): Promise<SecretaryPersonality[]> {
  const { data, error } = await supabase
    .from('secretary_personalities')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('获取秘书性格失败:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
}

// 获取所有秘书服装

// ==================== Fun Learning Guides ====================

export async function getFunLearningGuides() {
  const { data, error } = await supabase
    .from('fun_learning_guides')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('获取趣味学习引导失败:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
}

// ==================== Entrepreneurship (Startup Mentor) ====================

// 获取所有创业赛道
export async function getStartupSectors(): Promise<StartupSector[]> {
  const { data, error } = await supabase
    .from('startup_sectors')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('获取创业赛道失败:', error);
    return [];
  }
  return data || [];
}

// 获取特定赛道的知识地图
export async function getStartupKnowledgeMaps(sectorId: string): Promise<StartupKnowledgeMap[]> {
  const { data, error } = await supabase
    .from('startup_knowledge_maps')
    .select('*')
    .eq('sector_id', sectorId)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('获取创业知识地图失败:', error);
    return [];
  }
  return data || [];
}


// 获取用户的秘书配置
export async function getUserSecretaryConfig(userId: string): Promise<SecretaryConfig | null> {
  // 获取用户偏好
  const preferences = await getUserPreferences(userId);
  if (!preferences) {
    return null;
  }

  // 获取秘书形象
  let avatar: SecretaryAvatar | null = null;
  if (preferences.secretary_avatar_id) {
    const { data } = await supabase
      .from('secretary_avatars')
      .select('*')
      .eq('id', preferences.secretary_avatar_id)
      .maybeSingle();
    avatar = data;
  }

  // 获取秘书性格
  let personality: SecretaryPersonality | null = null;
  if (preferences.secretary_personality_id) {
    const { data } = await supabase
      .from('secretary_personalities')
      .select('*')
      .eq('id', preferences.secretary_personality_id)
      .maybeSingle();
    personality = data;
  }

  return {
    avatar,
    personality,
    name: preferences.secretary_name || '小秘',
    enabled: preferences.secretary_enabled,
    avatar_id: preferences.secretary_avatar_id || undefined,
    personality_id: preferences.secretary_personality_id || undefined,
  };
}

// 更新用户的秘书配置
export async function updateSecretaryConfig(
  userId: string,
  config: {
    avatarId?: string;
    personalityId?: string;
    name?: string;
    enabled?: boolean;
  }
): Promise<boolean> {
  const updates: Partial<UserPreferences> = {};

  if (config.avatarId !== undefined) {
    updates.secretary_avatar_id = config.avatarId || null;
  }
  if (config.personalityId !== undefined) {
    updates.secretary_personality_id = config.personalityId || null;
  }
  if (config.name !== undefined) {
    updates.secretary_name = config.name;
  }
  if (config.enabled !== undefined) {
    updates.secretary_enabled = config.enabled;
  }

  return updateUserPreferences(userId, updates);
}

// 生成秘书问候语
export function generateSecretaryGreeting(
  personality: SecretaryPersonality | null,
  secretaryName: string,
  userName?: string
): string {
  if (!personality || !personality.greeting_template) {
    return `早上好！${secretaryName}在这里陪伴你学习~`;
  }

  return personality.greeting_template
    .replace('{name}', secretaryName)
    .replace('{user}', userName || '同学');
}

// 生成秘书提醒语
export function generateSecretaryReminder(
  personality: SecretaryPersonality | null,
  secretaryName: string,
  taskTitle: string,
  timeLeft?: string
): string {
  if (!personality || !personality.reminder_template) {
    return `提醒：${taskTitle}需要完成啦！`;
  }

  return personality.reminder_template
    .replace('{name}', secretaryName)
    .replace('{task}', taskTitle)
    .replace('{time}', timeLeft || '不多');
}

// 生成秘书鼓励语
export function generateSecretaryEncouragement(
  personality: SecretaryPersonality | null,
  secretaryName: string
): string {
  if (!personality || !personality.encouragement_template) {
    return `太棒了！继续加油！${secretaryName}相信你！`;
  }

  return personality.encouragement_template.replace('{name}', secretaryName);
}

// ==================== 情绪状态管理 ====================

// 获取用户的秘书情绪状态
export async function getEmotionalState(userId: string, secretaryType: string) {
  const { data, error } = await supabase
    .from('secretary_emotional_states')
    .select('*')
    .eq('user_id', userId)
    .eq('secretary_type', secretaryType)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('获取情绪状态失败:', error);
    return null;
  }
  return data;
}

// 更新秘书情绪状态
export async function updateEmotionalState(
  userId: string,
  secretaryType: string,
  emotion: string,
  intensity: number,
  context?: string
) {
  const { data, error } = await supabase
    .from('secretary_emotional_states')
    .insert({
      user_id: userId,
      secretary_type: secretaryType,
      current_emotion: emotion,
      emotion_intensity: intensity,
      context: context || null,
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error('更新情绪状态失败:', error);
    return null;
  }
  return data;
}

// ==================== 记忆系统管理 ====================

// 获取秘书记忆
export async function getSecretaryMemories(
  userId: string,
  secretaryType: string,
  memoryType?: string
) {
  let query = supabase
    .from('secretary_memory')
    .select('*')
    .eq('user_id', userId)
    .eq('secretary_type', secretaryType);

  if (memoryType) {
    query = query.eq('memory_type', memoryType);
  }

  const { data, error } = await query
    .order('importance', { ascending: false })
    .order('last_accessed', { ascending: false });

  if (error) {
    console.error('获取记忆失败:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
}

// 添加秘书记忆
export async function addSecretaryMemory(
  userId: string,
  secretaryType: string,
  memoryType: string,
  memoryKey: string,
  memoryValue: string,
  importance: number = 50
) {
  const { data, error } = await supabase
    .from('secretary_memory')
    .insert({
      user_id: userId,
      secretary_type: secretaryType,
      memory_type: memoryType,
      memory_key: memoryKey,
      memory_value: memoryValue,
      importance: importance,
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error('添加记忆失败:', error);
    return null;
  }
  return data;
}

// 更新秘书记忆
export async function updateSecretaryMemory(
  memoryId: string,
  updates: {
    memory_value?: string;
    importance?: number;
  }
) {
  const { data, error } = await supabase
    .from('secretary_memory')
    .update(updates)
    .eq('id', memoryId)
    .select()
    .maybeSingle();

  if (error) {
    console.error('更新记忆失败:', error);
    return null;
  }
  return data;
}

// 删除秘书记忆
export async function deleteSecretaryMemory(memoryId: string) {
  const { error } = await supabase
    .from('secretary_memory')
    .delete()
    .eq('id', memoryId);

  if (error) {
    console.error('删除记忆失败:', error);
    return false;
  }
  return true;
}

// 搜索秘书记忆
export async function searchSecretaryMemory(
  userId: string,
  secretaryType: string,
  keyword: string
) {
  const { data, error } = await supabase
    .from('secretary_memory')
    .select('*')
    .eq('user_id', userId)
    .eq('secretary_type', secretaryType)
    .or(`memory_key.ilike.%${keyword}%,memory_value.ilike.%${keyword}%`)
    .order('importance', { ascending: false });

  if (error) {
    console.error('搜索记忆失败:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
}

// ==================== 管理员功能 ====================

// 检查用户是否为管理员
export async function isAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('检查管理员权限失败:', error);
    return false;
  }
  return data?.role === 'admin';
}

// 获取所有用户（管理员功能）
export async function getAllUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, role, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('获取用户列表失败:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
}

// 更新用户角色（管理员功能）
export async function updateUserRole(userId: string, role: 'user' | 'admin') {
  const { error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', userId);

  if (error) {
    console.error('更新用户角色失败:', error);
    return false;
  }
  return true;
}

// 获取系统统计数据（管理员功能）
export async function getSystemStats() {
  try {
    // 获取用户总数
    const { count: userCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // 获取任务总数
    const { count: taskCount } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true });

    // 获取学习会话总数
    const { count: sessionCount } = await supabase
      .from('study_sessions')
      .select('*', { count: 'exact', head: true });

    // 获取知识点总数
    const { count: knowledgeCount } = await supabase
      .from('knowledge_items')
      .select('*', { count: 'exact', head: true });

    return {
      userCount: userCount || 0,
      taskCount: taskCount || 0,
      sessionCount: sessionCount || 0,
      knowledgeCount: knowledgeCount || 0,
    };
  } catch (error) {
    console.error('获取系统统计失败:', error);
    return {
      userCount: 0,
      taskCount: 0,
      sessionCount: 0,
      knowledgeCount: 0,
    };
  }
}
