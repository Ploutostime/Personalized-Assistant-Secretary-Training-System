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
  secretary_avatar_id: string | null;
  secretary_personality_id: string | null;
  secretary_outfit_id: string | null;
  secretary_name: string | null;
  secretary_enabled: boolean;
  created_at: string;
  updated_at: string;
}

// 秘书形象类型
// 秘书形象类型
export type SecretaryAvatarType = 
  | 'loli' | 'oneesan' | 'uncle' | 'boss' | 'senior_sister' | 'senior_brother'  // 经典系列
  | 'elf_queen' | 'imperial_knight' | 'slime_girl' | 'werewolf_girl'  // 奇幻系列
  | 'imperial_consort' | 'empress' | 'regent_prince' | 'jiangnan_girl'  // 古风系列
  | 'neighbor_sister';  // 现代系列

// 秘书形象分类
export type SecretaryCategory = 'classic' | 'fantasy' | 'historical' | 'modern';

// 性格特征接口
export interface PersonalityTraits {
  cheerful?: number;  // 开朗度 0-100
  gentle?: number;    // 温柔度 0-100
  strict?: number;    // 严格度 0-100
  playful?: number;   // 活泼度 0-100
  wise?: number;      // 智慧度 0-100
  brave?: number;     // 勇敢度 0-100
  elegant?: number;   // 优雅度 0-100
  wild?: number;      // 野性度 0-100
  mysterious?: number; // 神秘度 0-100
  [key: string]: number | undefined;  // 允许其他自定义特征
}

// 语音配置接口
export interface VoiceConfig {
  pitch: number;      // 音调 0.5-2.0
  speed: number;      // 语速 0.5-2.0
  voice_id: string;   // 语音ID
  emotion: string;    // 情感类型
  echo?: number;      // 回声效果 0-1
}

// 动画配置接口
export interface AnimationConfig {
  idle: string;       // 待机动作
  talking: string;    // 说话动作
  thinking: string;   // 思考动作
  greeting: string;   // 打招呼动作
  [key: string]: string;  // 允许其他自定义动作
}

// 秘书性格类型
export type SecretaryPersonalityType = 'gentle' | 'strict' | 'lively' | 'calm' | 'motivating';

// 秘书服装类型
export type SecretaryOutfitType = 
  // 基础系列
  | 'campus'      // 校园装
  | 'business'    // 商务装
  | 'casual'      // 休闲装
  | 'formal'      // 正装
  | 'special'     // 特殊装
  // 运动系列
  | 'yoga'        // 瑜伽服
  | 'swimsuit'    // 泳衣
  | 'bikini'      // 比基尼
  | 'baseball'    // 棒球装
  | 'tennis'      // 网球装
  | 'fitness'     // 健身装
  | 'running'     // 跑步装
  | 'basketball'  // 篮球装
  // 特殊系列
  | 'lingerie'    // 情趣内衣
  | 'pajamas'     // 睡衣
  | 'kimono'      // 和服
  | 'qipao'       // 旗袍
  | 'bunny'       // 兔女郎装
  | 'gothic'      // 哥特装
  | 'lolita'      // 洛丽塔装
  // 职业系列
  | 'nurse'       // 护士装
  | 'maid'        // 女仆装
  | 'office_lady' // OL装
  | 'teacher'     // 教师装
  | 'police'      // 警察装
  | 'stewardess'  // 空姐装
  | 'secretary'   // 秘书装
  // 休闲系列
  | 'home_wear'   // 居家服
  | 'sports_casual' // 运动休闲装
  | 'dress'       // 连衣裙
  | 'sundress'    // 夏日连衣裙
  | 'sweater'     // 毛衣装
  // 古风系列
  | 'hanfu'       // 汉服
  | 'tang_suit'   // 唐装
  | 'palace'      // 宫装
  // 奇幻系列
  | 'elf'         // 精灵装
  | 'knight'      // 骑士装
  | 'witch'       // 女巫装
  | 'angel'       // 天使装;

// 秘书形象接口
export interface SecretaryAvatar {
  id: string;
  name: string;
  type: SecretaryAvatarType;
  description: string | null;
  avatar_url: string | null;
  full_body_url?: string | null; // 全身立绘图片URL
  voice_type: string | null;
  personality_traits?: PersonalityTraits | null; // 性格特征
  voice_config?: VoiceConfig | null; // 语音配置
  animation_config?: AnimationConfig | null; // 动画配置
  dialogue_style?: string | null; // 对话风格描述
  model_3d_url?: string | null; // 3D模型URL
  category?: SecretaryCategory; // 形象分类
  created_at: string;
}

// 秘书性格接口
export interface SecretaryPersonality {
  id: string;
  name: string;
  type: SecretaryPersonalityType;
  description: string | null;
  greeting_template: string | null;
  reminder_template: string | null;
  encouragement_template: string | null;
  created_at: string;
}

// 秘书服装接口
export interface SecretaryOutfit {
  id: string;
  name: string;
  type: SecretaryOutfitType;
  description: string | null;
  outfit_url: string | null;
  suitable_avatars: string[] | null;
  created_at: string;
}

// 秘书服装立绘接口（秘书穿着特定服装的立绘）
export interface SecretaryOutfitImage {
  id: string;
  secretary_avatar_id: string;
  outfit_id: string;
  image_url: string;
  created_at: string;
}

// 秘书配置接口（用于前端展示）
export interface SecretaryConfig {
  avatar: SecretaryAvatar | null;
  personality: SecretaryPersonality | null;
  outfit: SecretaryOutfit | null;
  name: string;
  enabled: boolean;
  avatar_id?: string;
  personality_id?: string;
  outfit_id?: string;
  current_outfit_image_url?: string | null; // 当前服装的立绘URL
}

// 情绪类型
export type EmotionType = 
  | 'happy'      // 开心
  | 'sad'        // 悲伤
  | 'excited'    // 兴奋
  | 'calm'       // 平静
  | 'worried'    // 担心
  | 'proud'      // 骄傲
  | 'neutral'    // 中性
  | 'caring'     // 关怀
  | 'playful';   // 调皮

// 情绪状态接口
export interface EmotionalState {
  id: string;
  user_id: string;
  secretary_type: string;
  current_emotion: EmotionType;
  emotion_intensity: number; // 0-100
  context: string | null;
  created_at: string;
  updated_at: string;
}

// 记忆类型
export type MemoryType = 
  | 'preference'    // 偏好
  | 'habit'         // 习惯
  | 'goal'          // 目标
  | 'achievement'   // 成就
  | 'conversation'  // 对话
  | 'emotion';      // 情感

// 记忆接口
export interface Memory {
  id: string;
  user_id: string;
  secretary_type: string;
  memory_type: MemoryType;
  memory_key: string;
  memory_value: string;
  importance: number; // 0-100
  last_accessed: string;
  created_at: string;
}

// 语言风格接口
export interface LanguageStyle {
  formality: number;   // 正式度 0-100
  intimacy: number;    // 亲密度 0-100
  elegance: number;    // 文雅度 0-100
}

// 情感表达接口
export interface EmotionalExpression {
  richness: number;    // 情感丰富度 0-100
  empathy: number;     // 共情能力 0-100
}

// 交流方式接口
export interface CommunicationStyle {
  proactivity: number; // 主动性 0-100
  guidance: number;    // 引导性 0-100
  listening: number;   // 倾听性 0-100
}

// 声音特征接口
export interface VoiceCharacteristics {
  pitch: string;        // 音调: low/medium/high
  speed: string;        // 语速: slow/normal/fast
  emotion_color: string; // 情感色彩: warm/cool/neutral
}

// 扩展的秘书性格接口
export interface ExtendedSecretaryPersonality extends SecretaryPersonality {
  language_style?: LanguageStyle | null;
  emotional_expression?: EmotionalExpression | null;
  communication_style?: CommunicationStyle | null;
  voice_characteristics?: VoiceCharacteristics | null;
  catchphrases?: string[] | null;
  emotion_reactions?: Record<string, string> | null;
}

// 扩展的秘书形象接口
export interface ExtendedSecretaryAvatar extends SecretaryAvatar {
  personality_description?: string | null;
  speaking_style?: string | null;
  emotional_traits?: Record<string, number> | null;
  interaction_preferences?: Record<string, any> | null;
}


// 趣味学习引导接口
export interface FunLearningGuide {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
  fun_explanation: string;
  related_knowledge_title: string;
  related_knowledge_content: string;
  video_url: string;
  video_title: string;
  video_cover: string;
  subject: string;
  created_at: string;
}

// 创业赛道接口
export interface StartupSector {
  id: string;
  title: string;
  description: string;
  market_trend: string | null;
  difficulty_level: string | null;
  potential_value: string | null;
  icon_name: string | null;
  tags: string[] | null;
  created_at: string;
}

// 创业知识节点接口
export interface KnowledgeNode {
  title: string;
  desc: string;
  importance?: number;
}

// 创业知识地图接口
export interface StartupKnowledgeMap {
  id: string;
  sector_id: string;
  stage_name: string;
  knowledge_nodes: KnowledgeNode[];
  order_index: number;
  created_at: string;
}

