# 智学秘伴 - 完整代码文档

## 📋 目录

- [1. 配置文件](#1-配置文件)
- [2. 类型定义](#2-类型定义)
- [3. 数据库层](#3-数据库层)
- [4. 上下文和状态管理](#4-上下文和状态管理)
- [5. 页面组件](#5-页面组件)
- [6. 布局组件](#6-布局组件)
- [7. 通用组件](#7-通用组件)
- [8. 路由配置](#8-路由配置)
- [9. 样式配置](#9-样式配置)
- [10. 数据库迁移](#10-数据库迁移)

---

## 1. 配置文件

### package.json
```json
{
  "name": "zhixue-miban",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "biome check --write ."
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.21.0",
    "date-fns": "^3.6.0",
    "recharts": "^2.10.0",
    "lucide-react": "^0.344.0",
    "sonner": "^1.4.0",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-sheet": "^1.0.4",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.55",
    "@types/react-dom": "^18.2.19",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.2.2",
    "vite": "^5.1.0",
    "tailwindcss": "^3.4.1",
    "postcss": "^8.4.35",
    "autoprefixer": "^10.4.17",
    "@biomejs/biome": "^1.5.0"
  }
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
```

---

## 2. 类型定义

### src/types/types.ts
```typescript
// 用户角色类型
export type UserRole = 'admin' | 'user';

// 任务类型
export type TaskType = 'competition' | 'homework' | 'exam' | 'study' | 'other';

// 优先级
export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

// 任务状态
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

// 用户配置接口
export interface Profile {
  id: string;
  username: string;
  email: string;
  role: UserRole;
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
  deadline: string | null;
  estimated_hours: number | null;
  created_at: string;
  updated_at: string;
}

// 知识点接口
export interface KnowledgeItem {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  subject: string | null;
  tags: string[] | null;
  source_url: string | null;
  review_count: number;
  next_review_at: string | null;
  created_at: string;
  updated_at: string;
}

// 学习记录接口
export interface StudySession {
  id: string;
  user_id: string;
  task_id: string | null;
  start_time: string;
  end_time: string | null;
  duration_minutes: number | null;
  notes: string | null;
  created_at: string;
}

// 时间表设置接口
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
```

---

## 3. 数据库层

### src/db/supabase.ts
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('缺少 Supabase 环境变量');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### src/db/api.ts
由于文件过长，这里展示关键部分：

```typescript
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
} from '@/types/types';

// ==================== 用户相关 ====================

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

// ==================== 任务相关 ====================

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
    console.error('获取任务列表失败:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
}

export async function createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task | null> {
  const { data, error } = await supabase
    .from('tasks')
    .insert(task)
    .select()
    .maybeSingle();

  if (error) {
    console.error('创建任务失败:', error);
    return null;
  }
  return data;
}

// ==================== 视频推荐相关 ====================

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

// ... 更多API函数
```

---

## 4. 上下文和状态管理

### src/contexts/AuthContext.tsx
```typescript
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/db/supabase';
import { User } from '@supabase/supabase-js';
import { getProfile } from '@/db/api';
import type { Profile } from '@/types/types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (username: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查当前会话
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    const profileData = await getProfile(userId);
    setProfile(profileData);
    setLoading(false);
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (username: string, password: string) => {
    try {
      const email = `${username}@miaoda.com`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth 必须在 AuthProvider 内使用');
  }
  return context;
}
```

---

## 5. 页面组件

由于页面组件代码较长，这里展示关键页面的核心结构：

### src/pages/DashboardPage.tsx（核心部分）
```typescript
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getUpcomingTasks, getReviewDueItems, getStudyStats, getVideoRecommendations, getProfile } from '@/db/api';
import type { Task, KnowledgeItem, VideoRecommendation } from '@/types/types';
import { Clock, ListTodo, BookMarked, TrendingUp, Video, Play } from 'lucide-react';

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
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
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

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold">仪表盘</h1>
        <p className="text-muted-foreground mt-1">欢迎回来，查看你的学习概况</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总学习时长</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHours} 小时</div>
          </CardContent>
        </Card>
        {/* 更多统计卡片... */}
      </div>

      {/* 推荐视频卡片 */}
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
          ) : (
            <div className="space-y-3">
              {recommendedVideos.map((video) => (
                <div key={video.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors group">
                  {video.video_cover && (
                    <div className="relative w-32 h-20 rounded overflow-hidden shrink-0 bg-muted">
                      <img src={video.video_cover} alt={video.video_title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium line-clamp-2 mb-1">{video.video_title}</h4>
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
  );
}
```

### src/pages/VideoTerminalPage.tsx（核心结构）
```typescript
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Video, Heart, Search, Plus, Play } from 'lucide-react';
import {
  getVideoRecommendations,
  createVideoRecommendation,
  toggleVideoFavorite,
  markVideoAsWatched,
  getMajorTags,
  getProfile,
  updateProfile,
} from '@/db/api';
import type { VideoRecommendation, MajorTag } from '@/types/types';

export default function VideoTerminalPage() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<VideoRecommendation[]>([]);
  const [majorTags, setMajorTags] = useState<MajorTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'unwatched' | 'favorited'>('all');
  const [selectedMajor, setSelectedMajor] = useState<string>('');

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [videosData, tagsData] = await Promise.all([
        getVideoRecommendations(user.id),
        getMajorTags(),
      ]);
      setVideos(videosData);
      setMajorTags(tagsData);
    } catch (error) {
      console.error('加载数据失败:', error);
      toast.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (videoId: string, currentStatus: boolean) => {
    const success = await toggleVideoFavorite(videoId, !currentStatus);
    if (success) {
      toast.success(currentStatus ? '已取消收藏' : '已收藏');
      loadData();
    } else {
      toast.error('操作失败');
    }
  };

  const filteredVideos = videos.filter(video => {
    if (searchQuery && !video.video_title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedMajor && selectedMajor !== 'all' && video.tags && !video.tags.includes(selectedMajor)) {
      return false;
    }
    if (filterTab === 'unwatched' && video.is_watched) {
      return false;
    }
    if (filterTab === 'favorited' && !video.is_favorited) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">私人终端</h1>
        <p className="text-muted-foreground mt-1">根据您的专业推送适配的 Bilibili 学术视频</p>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索视频标题..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* 视频列表 */}
      <Tabs value={filterTab} onValueChange={(v) => setFilterTab(v as typeof filterTab)}>
        <TabsList>
          <TabsTrigger value="all">
            <Video className="mr-2 h-4 w-4" />
            全部视频 ({videos.length})
          </TabsTrigger>
          <TabsTrigger value="unwatched">未观看</TabsTrigger>
          <TabsTrigger value="favorited">已收藏</TabsTrigger>
        </TabsList>

        <TabsContent value={filterTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredVideos.map(video => (
              <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {video.video_cover && (
                  <div className="relative aspect-video bg-muted">
                    <img src={video.video_cover} alt={video.video_title} className="w-full h-full object-cover" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2">{video.video_title}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                      onClick={() => handleToggleFavorite(video.id, video.is_favorited)}
                    >
                      <Heart className={`h-5 w-5 ${video.is_favorited ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" onClick={() => window.open(video.video_url, '_blank')}>
                    <Play className="mr-2 h-4 w-4" />
                    观看视频
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

---

## 6. 布局组件

### src/components/layouts/MainLayout.tsx（核心部分）
```typescript
import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard,
  ListTodo,
  Calendar,
  BookMarked,
  BarChart3,
  Settings,
  Menu,
  LogOut,
  Shield,
  GraduationCap,
  Video,
} from 'lucide-react';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { cn } from '@/lib/utils';

const navigation = [
  { name: '仪表盘', href: '/', icon: LayoutDashboard },
  { name: '事务管理', href: '/tasks', icon: ListTodo },
  { name: '时间表', href: '/schedule', icon: Calendar },
  { name: '知识收藏', href: '/knowledge', icon: BookMarked },
  { name: '私人终端', href: '/video-terminal', icon: Video },
  { name: '学习统计', href: '/statistics', icon: BarChart3 },
  { name: '设置', href: '/settings', icon: Settings },
];

function Sidebar() {
  const location = useLocation();
  const { profile } = useAuth();

  return (
    <div className="flex flex-col h-full bg-sidebar-background text-sidebar-foreground">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sidebar-primary rounded-xl">
            <GraduationCap className="w-6 h-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold">智学秘伴</h1>
            <p className="text-xs text-sidebar-foreground/60">学习管理系统</p>
          </div>
        </div>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* 用户信息 */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{profile?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{profile?.username}</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">{profile?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MainLayout() {
  const { signOut, profile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      {/* 桌面端侧边栏 */}
      <aside className="hidden lg:block w-64 border-r shrink-0">
        <Sidebar />
      </aside>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部导航栏 */}
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
          {/* 移动端菜单按钮 */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <Sidebar />
            </SheetContent>
          </Sheet>

          <div className="flex-1" />

          {/* 主题切换 */}
          <ThemeToggle />

          {/* 用户菜单 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{profile?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>我的账户</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {profile?.role === 'admin' && (
                <DropdownMenuItem asChild>
                  <Link to="/admin">
                    <Shield className="mr-2 h-4 w-4" />
                    管理员面板
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* 页面内容 */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

---

## 7. 通用组件

### src/components/common/ThemeToggle.tsx
```typescript
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      {theme === 'light' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
}
```

### src/components/common/RouteGuard.tsx
```typescript
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!user && location.pathname !== '/login') {
        navigate('/login', { replace: true });
      } else if (user && location.pathname === '/login') {
        navigate('/', { replace: true });
      }
    }
  }, [user, loading, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    );
  }

  return <>{children}</>;
}
```

---

## 8. 路由配置

### src/App.tsx
```typescript
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import SchedulePage from './pages/SchedulePage';
import KnowledgePage from './pages/KnowledgePage';
import StatisticsPage from './pages/StatisticsPage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';
import VideoTerminalPage from './pages/VideoTerminalPage';
import MainLayout from './components/layouts/MainLayout';

import { AuthProvider } from '@/contexts/AuthContext';
import { RouteGuard } from '@/components/common/RouteGuard';
import { Toaster } from '@/components/ui/sonner';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <RouteGuard>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<MainLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="schedule" element={<SchedulePage />} />
              <Route path="knowledge" element={<KnowledgePage />} />
              <Route path="video-terminal" element={<VideoTerminalPage />} />
              <Route path="statistics" element={<StatisticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="admin" element={<AdminPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </RouteGuard>
        <Toaster />
      </AuthProvider>
    </Router>
  );
};

export default App;
```

### src/main.tsx
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## 9. 样式配置

### src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 142.1 76.2% 36.3%;
    --secondary-foreground: 210 40% 98%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 221.2 83.2% 53.3%;
    --sidebar-primary-foreground: 210 40% 98%;
    --sidebar-accent: 210 40% 96.1%;
    --sidebar-accent-foreground: 222.2 47.4% 11.2%;
    --sidebar-border: 214.3 31.8% 91.4%;
    --sidebar-ring: 221.2 83.2% 53.3%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 142.1 70.6% 45.3%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
    --sidebar-background: 222.2 84% 4.9%;
    --sidebar-foreground: 210 40% 98%;
    --sidebar-primary: 217.2 91.2% 59.8%;
    --sidebar-primary-foreground: 222.2 47.4% 11.2%;
    --sidebar-accent: 217.2 32.6% 17.5%;
    --sidebar-accent-foreground: 210 40% 98%;
    --sidebar-border: 217.2 32.6% 17.5%;
    --sidebar-ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

---

## 10. 数据库迁移

### supabase/migrations/00001_create_initial_schema.sql
```sql
-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建用户配置表
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建学生事务表
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  task_type TEXT NOT NULL CHECK (task_type IN ('competition', 'homework', 'exam', 'study', 'other')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  deadline TIMESTAMPTZ,
  estimated_hours NUMERIC(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建知识点收藏表
CREATE TABLE knowledge_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  subject TEXT,
  tags TEXT[],
  source_url TEXT,
  review_count INTEGER NOT NULL DEFAULT 0,
  next_review_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建学习时间记录表
CREATE TABLE study_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  duration_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建时间表配置表
CREATE TABLE schedule_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  daily_study_goal_hours NUMERIC(4,2) NOT NULL DEFAULT 8,
  preferred_start_time TIME NOT NULL DEFAULT '08:00',
  preferred_end_time TIME NOT NULL DEFAULT '22:00',
  break_duration_minutes INTEGER NOT NULL DEFAULT 15,
  auto_schedule_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_deadline ON tasks(deadline);
CREATE INDEX idx_knowledge_items_user_id ON knowledge_items(user_id);
CREATE INDEX idx_study_sessions_user_id ON study_sessions(user_id);

-- 启用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_settings ENABLE ROW LEVEL SECURITY;

-- RLS 策略
CREATE POLICY "用户可以查看自己的配置" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "用户可以更新自己的配置" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "管理员可以查看所有用户" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "用户可以管理自己的任务" ON tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "用户可以管理自己的知识点" ON knowledge_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "用户可以管理自己的学习记录" ON study_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "用户可以管理自己的时间表设置" ON schedule_settings FOR ALL USING (auth.uid() = user_id);

-- 触发器：自动更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_items_updated_at BEFORE UPDATE ON knowledge_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedule_settings_updated_at BEFORE UPDATE ON schedule_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### supabase/migrations/00002_add_video_recommendation_features.sql
```sql
-- 扩展 profiles 表，添加专业相关字段
ALTER TABLE profiles
ADD COLUMN major TEXT,
ADD COLUMN grade TEXT,
ADD COLUMN interests TEXT[];

-- 创建专业标签表
CREATE TABLE major_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  category TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建视频推荐表
CREATE TABLE video_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL,
  video_title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  video_cover TEXT,
  author TEXT,
  duration INTEGER,
  view_count INTEGER,
  tags TEXT[],
  description TEXT,
  recommended_reason TEXT,
  is_watched BOOLEAN NOT NULL DEFAULT false,
  is_favorited BOOLEAN NOT NULL DEFAULT false,
  watch_progress INTEGER NOT NULL DEFAULT 0,
  watched_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建视频观看历史表
CREATE TABLE video_watch_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL,
  video_title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  watch_duration INTEGER,
  watch_progress INTEGER,
  completed BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建用户偏好设置表
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  preferred_tags TEXT[],
  excluded_tags TEXT[],
  preferred_duration_min INTEGER,
  preferred_duration_max INTEGER,
  auto_recommend BOOLEAN NOT NULL DEFAULT true,
  daily_recommendation_count INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 插入预置专业标签
INSERT INTO major_tags (name, category) VALUES
('计算机科学', '工科'),
('软件工程', '工科'),
('人工智能', '工科'),
('数据科学', '工科'),
('网络安全', '工科'),
('电子工程', '工科'),
('机械工程', '工科'),
('土木工程', '工科'),
('数学', '理科'),
('物理学', '理科'),
('化学', '理科'),
('生物学', '理科'),
('经济学', '经管'),
('金融学', '经管'),
('管理学', '经管'),
('会计学', '经管'),
('法学', '文科'),
('英语', '文科'),
('汉语言文学', '文科'),
('新闻传播', '文科'),
('历史学', '文科'),
('哲学', '文科'),
('医学', '医学'),
('护理学', '医学'),
('药学', '医学'),
('艺术设计', '艺术'),
('音乐', '艺术'),
('美术', '艺术'),
('教育学', '教育'),
('心理学', '教育');

-- 创建索引
CREATE INDEX idx_video_recommendations_user_id ON video_recommendations(user_id);
CREATE INDEX idx_video_recommendations_tags ON video_recommendations USING GIN(tags);
CREATE INDEX idx_video_watch_history_user_id ON video_watch_history(user_id);

-- 启用 RLS
ALTER TABLE major_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_watch_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS 策略
CREATE POLICY "所有人可以查看专业标签" ON major_tags FOR SELECT USING (true);
CREATE POLICY "管理员可以管理专业标签" ON major_tags FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "用户可以管理自己的视频推荐" ON video_recommendations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "用户可以管理自己的观看历史" ON video_watch_history FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "用户可以管理自己的偏好设置" ON user_preferences FOR ALL USING (auth.uid() = user_id);

-- 触发器
CREATE TRIGGER update_video_recommendations_updated_at BEFORE UPDATE ON video_recommendations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_video_watch_history_updated_at BEFORE UPDATE ON video_watch_history
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 为新用户自动创建默认偏好设置
CREATE OR REPLACE FUNCTION create_default_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_user_preferences_on_signup
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_default_user_preferences();
```

---

## 📝 使用说明

### 环境变量配置
创建 `.env.local` 文件：
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_ID=your_app_id
VITE_API_ENV=production
```

### 安装依赖
```bash
pnpm install
```

### 运行开发服务器
```bash
pnpm dev
```

### 构建生产版本
```bash
pnpm build
```

### 代码检查
```bash
pnpm lint
```

---

## 🎯 核心功能实现说明

### 1. 认证系统
- 使用 Supabase Auth 实现用户认证
- 用户名自动添加 @miaoda.com 后缀
- 首位注册用户自动成为管理员
- 使用 React Context 管理认证状态

### 2. 数据库操作
- 所有数据库操作封装在 `src/db/api.ts`
- 使用 TypeScript 类型保证类型安全
- 实现了完整的 CRUD 操作
- 支持复杂查询和筛选

### 3. 路由保护
- 使用 RouteGuard 组件保护需要登录的路由
- 未登录用户自动重定向到登录页
- 已登录用户访问登录页自动重定向到首页

### 4. 主题切换
- 支持亮色/暗色主题
- 使用 localStorage 持久化主题选择
- 自动检测系统主题偏好

### 5. 响应式设计
- 桌面端：侧边栏 + 内容区布局
- 移动端：汉堡菜单 + 全屏内容
- 使用 Tailwind CSS 实现响应式

### 6. 视频推荐系统
- 根据用户专业智能推荐
- 支持视频收藏和观看历史
- 多维度筛选和搜索
- 观看进度追踪

---

**文档版本：** 1.0.0  
**最后更新：** 2025-12-17  
**维护者：** 智学秘伴开发团队
