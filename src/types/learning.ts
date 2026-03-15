// 学习相关类型定义

export interface LearningSession {
  id: string
  userId: string
  startTime: Date
  endTime?: Date
  duration: number // 分钟
  subject: string
  topic: string
  metrics: {
    focusLevel: number // 0-100
    efficiency: number // 0-100
    comprehension: number // 0-100
    retention: number // 0-100
  }
  resources: string[]
  notes?: string
  status: 'active' | 'completed' | 'paused'
}

export interface LearningGoal {
  id: string
  userId: string
  title: string
  description: string
  type: 'daily' | 'weekly' | 'monthly' | 'long-term'
  targetValue: number
  currentValue: number
  unit: string // 小时、课程、练习等
  deadline?: Date
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'active' | 'completed' | 'failed' | 'paused'
  progress: number // 0-100
  createdAt: Date
  updatedAt: Date
}

export interface LearningResource {
  id: string
  title: string
  description: string
  type: 'video' | 'article' | 'book' | 'exercise' | 'quiz' | 'course'
  subject: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number // 分钟
  rating: number // 0-5
  tags: string[]
  url?: string
  content?: string
  prerequisites: string[]
  recommended: boolean
  completed: boolean
  progress: number // 0-100
  lastAccessed?: Date
}

export interface LearningPath {
  id: string
  userId: string
  title: string
  description: string
  goals: string[]
  steps: LearningPathStep[]
  estimatedDuration: number // 小时
  progress: number // 0-100
  status: 'active' | 'completed' | 'paused'
  createdAt: Date
  updatedAt: Date
}

export interface LearningPathStep {
  id: string
  order: number
  type: 'course' | 'resource' | 'practice' | 'assessment'
  title: string
  description: string
  duration: number // 分钟
  prerequisites: string[]
  resources: string[]
  completed: boolean
  progress: number // 0-100
}

export interface LearningAnalytics {
  userId: string
  period: '7d' | '30d' | '90d' | 'all'
  totalSessions: number
  totalDuration: number // 分钟
  averageFocus: number
  averageEfficiency: number
  subjects: {
    name: string
    duration: number
    progress: number
    strength: number // 0-100
  }[]
  trends: {
    date: string
    duration: number
    efficiency: number
    focus: number
  }[]
  recommendations: LearningRecommendation[]
}

export interface LearningRecommendation {
  id: string
  type: 'course' | 'resource' | 'practice' | 'schedule'
  title: string
  description: string
  reason: string
  estimatedBenefit: number // 0-100
  timeRequired: number // 分钟
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  urgency: 'immediate' | 'soon' | 'long-term'
  confidence: number // 0-1
}

export interface CompanionState {
  userId: string
  mood: 'happy' | 'neutral' | 'sad' | 'excited' | 'focused'
  energy: number // 0-100
  bondLevel: number // 0-10
  unlockedFeatures: string[]
  preferences: {
    learningStyle: string
    preferredSubjects: string[]
    dailyGoal: number
  }
  lastInteraction: Date
}

export interface CompanionInteraction {
  id: string
  userId: string
  type: 'pet' | 'speak' | 'feed' | 'play' | 'learn'
  data?: any
  timestamp: Date
  mood: string
  response?: string
}