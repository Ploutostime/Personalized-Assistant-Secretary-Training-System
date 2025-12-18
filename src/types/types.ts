// 用户角色类型
export type UserRole = 'user' | 'admin';

// 事务类型
export type TaskType = 'competition' | 'homework' | 'exam' | 'study' | 'other';

// 优先级类型
export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

// 事务状态类型
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

// 用户配置接口
export interface Profile {
  id: string;
  username: string | null;
  email: string | null;
  role: UserRole;
  avatar_url: string | null;
  major: string | null;
  grade: string | null;
  interests: string[] | null;
  created_at: string;
  updated_at: string;
}

// 学生事务接口
export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  task_type: TaskType;
  priority: PriorityLevel;
  status: TaskStatus;
  start_time: string | null;
  end_time: string | null;
  deadline: string | null;
  estimated_hours: number | null;
  actual_hours: number | null;
  reminder_enabled: boolean;
  reminder_time: string | null;
  created_at: string;
  updated_at: string;
}

// 知识点收藏接口
export interface KnowledgeItem {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  subject: string | null;
  tags: string[] | null;
  source_url: string | null;
  review_count: number;
  last_reviewed_at: string | null;
  next_review_at: string | null;
  created_at: string;
  updated_at: string;
}

// 学习时间记录接口
export interface StudySession {
  id: string;
  user_id: string;
  task_id: string | null;
  subject: string | null;
  start_time: string;
  end_time: string | null;
  duration_minutes: number | null;
  notes: string | null;
  created_at: string;
}

// 时间表配置接口
export interface ScheduleSettings {
  id: string;
  user_id: string;
  daily_study_goal_hours: number;
  preferred_start_time: string;
  preferred_end_time: string;
  break_duration_minutes: number;
  auto_schedule_enabled: boolean;
  created_at: string;
  updated_at: string;
}

// 统计数据接口
export interface StudyStats {
  totalHours: number;
  completedTasks: number;
  pendingTasks: number;
  knowledgeItems: number;
  weeklyHours: number[];
  tasksByType: Record<TaskType, number>;
}

// 专业标签接口
export interface MajorTag {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  created_at: string;
}

// 视频推荐接口
export interface VideoRecommendation {
  id: string;
  user_id: string;
  video_id: string;
  video_title: string;
  video_url: string;
  video_cover: string | null;
  author: string | null;
  duration: number | null;
  view_count: number | null;
  tags: string[] | null;
  description: string | null;
  recommended_reason: string | null;
  is_watched: boolean;
  is_favorited: boolean;
  watch_progress: number;
  watched_at: string | null;
  created_at: string;
  updated_at: string;
}

// 视频观看历史接口
export interface VideoWatchHistory {
  id: string;
  user_id: string;
  video_id: string;
  video_title: string;
  video_url: string;
  watch_duration: number | null;
  watch_progress: number | null;
  completed: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// 用户偏好设置接口
export interface UserPreferences {
  id: string;
  user_id: string;
  preferred_tags: string[] | null;
  excluded_tags: string[] | null;
  preferred_duration_min: number | null;
  preferred_duration_max: number | null;
  auto_recommend: boolean;
  daily_recommendation_count: number;
  created_at: string;
  updated_at: string;
}
