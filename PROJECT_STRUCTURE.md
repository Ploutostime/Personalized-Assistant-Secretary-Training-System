# 智学秘伴 - 项目结构文档

## 📁 项目目录结构

```
智学秘伴/
├── 📂 docs/                          # 文档目录
│   └── prd.md                        # 产品需求文档
│
├── 📂 public/                        # 静态资源目录
│   ├── 📂 images/                    # 图片资源
│   │   ├── 📂 error/                 # 错误页面图片
│   │   │   ├── 404.svg              # 404错误图片（亮色）
│   │   │   ├── 404-dark.svg         # 404错误图片（暗色）
│   │   │   ├── 500.svg              # 500错误图片（亮色）
│   │   │   ├── 500-dark.svg         # 500错误图片（暗色）
│   │   │   ├── 503.svg              # 503错误图片（亮色）
│   │   │   └── 503-dark.svg         # 503错误图片（暗色）
│   │   ├── 📂 logo/                  # Logo资源
│   │   │   ├── auth-logo.svg        # 认证页面Logo
│   │   │   ├── logo-dark.svg        # 暗色主题Logo
│   │   │   └── logo-icon.svg        # Logo图标
│   │   ├── 📂 shape/                 # 装饰图形
│   │   │   └── grid-01.svg          # 网格背景
│   │   └── favicon.ico              # 网站图标
│   └── favicon.png                   # 备用网站图标
│
├── 📂 src/                           # 源代码目录
│   ├── 📂 components/                # 组件目录
│   │   ├── 📂 common/                # 通用组件
│   │   │   ├── PageMeta.tsx         # 页面元信息组件
│   │   │   ├── RouteGuard.tsx       # 路由守卫组件
│   │   │   └── ThemeToggle.tsx      # 主题切换组件
│   │   │
│   │   ├── 📂 layouts/               # 布局组件
│   │   │   └── MainLayout.tsx       # 主布局（侧边栏+内容区）
│   │   │
│   │   ├── 📂 ui/                    # UI基础组件（shadcn/ui）
│   │   │   ├── accordion.tsx        # 手风琴组件
│   │   │   ├── alert-dialog.tsx     # 警告对话框
│   │   │   ├── alert.tsx            # 警告提示
│   │   │   ├── avatar.tsx           # 头像组件
│   │   │   ├── badge.tsx            # 徽章组件
│   │   │   ├── button.tsx           # 按钮组件
│   │   │   ├── calendar.tsx         # 日历组件
│   │   │   ├── card.tsx             # 卡片组件
│   │   │   ├── chart.tsx            # 图表组件
│   │   │   ├── checkbox.tsx         # 复选框
│   │   │   ├── dialog.tsx           # 对话框
│   │   │   ├── dropdown-menu.tsx    # 下拉菜单
│   │   │   ├── form.tsx             # 表单组件
│   │   │   ├── input.tsx            # 输入框
│   │   │   ├── label.tsx            # 标签
│   │   │   ├── map.tsx              # 地图组件
│   │   │   ├── multi-select.tsx     # 多选组件
│   │   │   ├── popover.tsx          # 弹出框
│   │   │   ├── progress.tsx         # 进度条
│   │   │   ├── qrcodedataurl.tsx    # 二维码生成组件
│   │   │   ├── select.tsx           # 选择器
│   │   │   ├── separator.tsx        # 分隔线
│   │   │   ├── sheet.tsx            # 侧边抽屉
│   │   │   ├── skeleton.tsx         # 骨架屏
│   │   │   ├── slider.tsx           # 滑块
│   │   │   ├── sonner.tsx           # Toast通知
│   │   │   ├── switch.tsx           # 开关
│   │   │   ├── table.tsx            # 表格
│   │   │   ├── tabs.tsx             # 标签页
│   │   │   ├── textarea.tsx         # 文本域
│   │   │   ├── tooltip.tsx          # 工具提示
│   │   │   └── video.tsx            # 视频播放器
│   │   │
│   │   └── dropzone.tsx             # 文件拖放上传组件
│   │
│   ├── 📂 contexts/                  # React Context
│   │   └── AuthContext.tsx          # 认证上下文（用户状态管理）
│   │
│   ├── 📂 db/                        # 数据库相关
│   │   ├── api.ts                   # 数据库API封装
│   │   └── supabase.ts              # Supabase客户端配置
│   │
│   ├── 📂 hooks/                     # 自定义Hooks
│   │   ├── use-debounce.ts          # 防抖Hook
│   │   ├── use-go-back.ts           # 返回导航Hook
│   │   ├── use-mobile.ts            # 移动端检测Hook
│   │   ├── use-supabase-upload.ts   # Supabase上传Hook
│   │   └── use-toast.tsx            # Toast通知Hook
│   │
│   ├── 📂 lib/                       # 工具库
│   │   └── utils.ts                 # 通用工具函数
│   │
│   ├── 📂 pages/                     # 页面组件
│   │   ├── AdminPage.tsx            # 管理员页面
│   │   ├── DashboardPage.tsx        # 仪表盘页面 ⭐
│   │   ├── KnowledgePage.tsx        # 知识收藏页面
│   │   ├── LoginPage.tsx            # 登录页面
│   │   ├── NotFound.tsx             # 404页面
│   │   ├── SchedulePage.tsx         # 时间表页面
│   │   ├── SettingsPage.tsx         # 设置页面 ⭐
│   │   ├── StatisticsPage.tsx       # 学习统计页面
│   │   ├── TasksPage.tsx            # 事务管理页面
│   │   └── VideoTerminalPage.tsx    # 私人终端页面 ⭐ 新增
│   │
│   ├── 📂 services/                  # 服务层（预留）
│   │
│   ├── 📂 types/                     # TypeScript类型定义
│   │   ├── index.ts                 # 类型导出
│   │   └── types.ts                 # 业务类型定义
│   │
│   ├── App.tsx                      # 应用根组件
│   ├── main.tsx                     # 应用入口
│   ├── routes.tsx                   # 路由配置
│   ├── index.css                    # 全局样式
│   ├── global.d.ts                  # 全局类型声明
│   ├── svg.d.ts                     # SVG类型声明
│   └── vite-env.d.ts                # Vite环境类型
│
├── 📂 supabase/                      # Supabase配置
│   ├── 📂 migrations/                # 数据库迁移文件
│   │   ├── 00001_create_initial_schema.sql        # 初始数据库结构
│   │   └── 00002_add_video_recommendation_features.sql  # 视频推荐功能
│   └── config.toml                  # Supabase配置文件
│
├── 📄 README.md                      # 项目说明文档
├── 📄 TODO.md                        # 任务清单
├── 📄 PROJECT_STRUCTURE.md           # 项目结构文档（本文件）
├── 📄 package.json                   # 项目依赖配置
├── 📄 pnpm-lock.yaml                 # 依赖锁定文件
├── 📄 tsconfig.json                  # TypeScript配置
├── 📄 tailwind.config.js             # Tailwind CSS配置
├── 📄 vite.config.ts                 # Vite构建配置
├── 📄 biome.json                     # Biome代码检查配置
└── 📄 components.json                # shadcn/ui组件配置
```

## 📊 核心模块说明

### 1. 页面模块 (src/pages/)

#### 🏠 DashboardPage.tsx - 仪表盘
**功能：** 系统首页，数据概览中心
- 显示学习统计数据（总学习时长、完成任务数、待办任务数、知识点数量）
- 展示即将到期的任务列表（7天内）
- 显示待复习的知识点
- **新增：** 推荐视频卡片（根据用户专业推荐）
- 快速导航到各功能模块

#### 📝 TasksPage.tsx - 事务管理
**功能：** 学生事务全生命周期管理
- 任务CRUD操作（创建、查看、编辑、删除）
- 任务类型：竞赛、作业、考试、学习、其他
- 优先级设置：低、中、高、紧急
- 状态管理：待办、进行中、已完成、已取消
- 截止时间提醒
- 任务筛选和搜索

#### 📅 SchedulePage.tsx - 时间表
**功能：** 智能学习时间规划
- 周视图展示学习计划
- 自动生成个性化时间表
- 根据任务优先级和截止时间智能安排
- 时间段可视化展示
- 支持手动调整

#### 📚 KnowledgePage.tsx - 知识收藏
**功能：** 知识点管理与复习系统
- 知识点收藏和整理
- 学科分类管理
- 复习次数记录
- 间隔重复算法提醒
- 知识点搜索和筛选
- 支持添加来源链接

#### 🎥 VideoTerminalPage.tsx - 私人终端 ⭐ 新功能
**功能：** 个性化学术视频推荐系统
- 根据用户专业智能推荐 Bilibili 学术视频
- 视频添加、编辑、删除
- 视频收藏功能
- 标记已观看/未观看
- 观看历史记录
- 按专业标签筛选
- 视频搜索功能
- 观看进度追踪

#### 📈 StatisticsPage.tsx - 学习统计
**功能：** 学习数据可视化分析
- 总学习时长统计
- 本周学习时长趋势图
- 任务完成情况统计
- 任务类型分布图
- 知识点数量统计
- 数据图表展示（使用 Recharts）

#### ⚙️ SettingsPage.tsx - 设置 ⭐ 优化
**功能：** 系统个性化配置中心
- **时间表设置：**
  - 每日学习目标（小时）
  - 偏好学习时间段
  - 休息时长设置
  - 自动生成时间表开关
- **个人信息设置：** ⭐ 新增
  - 专业选择（30+专业标签）
  - 年级选择（大一到博士）
- **视频推荐偏好：** ⭐ 新增
  - 自动推荐开关
  - 每日推荐数量（3/5/10/15个）
- **其他设置：**
  - 任务提醒开关
  - 复习提醒开关
  - 学习统计开关

#### 👤 AdminPage.tsx - 管理员
**功能：** 用户管理和系统管理
- 用户列表查看
- 用户角色管理
- 系统数据统计
- 仅管理员可访问

#### 🔐 LoginPage.tsx - 登录
**功能：** 用户认证入口
- 用户名+密码登录
- 用户注册（自动添加 @miaoda.com 后缀）
- 首位注册用户自动成为管理员
- 表单验证
- 错误提示

### 2. 数据库模块 (src/db/)

#### api.ts - 数据库API封装
**功能：** 统一的数据访问层
- **用户相关：**
  - `getProfile()` - 获取用户信息
  - `updateProfile()` - 更新用户信息
  - `getAllProfiles()` - 获取所有用户（管理员）
- **任务相关：**
  - `getTasks()` - 获取任务列表
  - `getTask()` - 获取单个任务
  - `createTask()` - 创建任务
  - `updateTask()` - 更新任务
  - `deleteTask()` - 删除任务
  - `getUpcomingTasks()` - 获取即将到期的任务
- **知识点相关：**
  - `getKnowledgeItems()` - 获取知识点列表
  - `createKnowledgeItem()` - 创建知识点
  - `updateKnowledgeItem()` - 更新知识点
  - `deleteKnowledgeItem()` - 删除知识点
  - `getReviewDueItems()` - 获取待复习知识点
- **学习记录相关：**
  - `getStudySessions()` - 获取学习记录
  - `createStudySession()` - 创建学习记录
  - `updateStudySession()` - 更新学习记录
  - `deleteStudySession()` - 删除学习记录
- **时间表设置相关：**
  - `getScheduleSettings()` - 获取时间表设置
  - `updateScheduleSettings()` - 更新时间表设置
- **统计相关：**
  - `getStudyStats()` - 获取学习统计数据
- **专业标签相关：** ⭐ 新增
  - `getMajorTags()` - 获取所有专业标签
- **视频推荐相关：** ⭐ 新增
  - `getVideoRecommendations()` - 获取视频推荐列表
  - `getVideoRecommendation()` - 获取单个视频
  - `createVideoRecommendation()` - 创建视频推荐
  - `updateVideoRecommendation()` - 更新视频信息
  - `deleteVideoRecommendation()` - 删除视频
  - `toggleVideoFavorite()` - 切换收藏状态
  - `markVideoAsWatched()` - 标记为已观看
- **观看历史相关：** ⭐ 新增
  - `getVideoWatchHistory()` - 获取观看历史
  - `createVideoWatchHistory()` - 创建观看记录
  - `updateVideoWatchHistory()` - 更新观看记录
- **用户偏好相关：** ⭐ 新增
  - `getUserPreferences()` - 获取用户偏好
  - `updateUserPreferences()` - 更新用户偏好

#### supabase.ts - Supabase客户端
**功能：** Supabase连接配置
- 初始化 Supabase 客户端
- 配置环境变量
- 导出客户端实例

### 3. 组件模块 (src/components/)

#### common/ - 通用组件
- **RouteGuard.tsx** - 路由守卫，保护需要登录的页面
- **ThemeToggle.tsx** - 主题切换组件（亮色/暗色）
- **PageMeta.tsx** - 页面元信息管理

#### layouts/ - 布局组件
- **MainLayout.tsx** - 主布局组件
  - 左侧导航栏（Logo、菜单、用户信息）
  - 右侧内容区域
  - 响应式设计（桌面/移动端）
  - 移动端汉堡菜单

#### ui/ - UI基础组件
基于 shadcn/ui 的组件库，包含50+个高质量UI组件

### 4. 类型定义 (src/types/)

#### types.ts - 业务类型定义
```typescript
// 用户配置
export interface Profile {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  major: string | null;          // ⭐ 新增：专业
  grade: string | null;          // ⭐ 新增：年级
  interests: string[] | null;    // ⭐ 新增：兴趣标签
  created_at: string;
  updated_at: string;
}

// 学生事务
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

// 知识点
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

// 学习记录
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

// 时间表设置
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

// ⭐ 新增：专业标签
export interface MajorTag {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  created_at: string;
}

// ⭐ 新增：视频推荐
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

// ⭐ 新增：视频观看历史
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

// ⭐ 新增：用户偏好设置
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

### 5. 数据库结构 (supabase/migrations/)

#### 00001_create_initial_schema.sql - 初始数据库结构
**包含表：**
1. **profiles** - 用户配置表
2. **tasks** - 学生事务表
3. **knowledge_items** - 知识点收藏表
4. **study_sessions** - 学习时间记录表
5. **schedule_settings** - 时间表配置表

#### 00002_add_video_recommendation_features.sql - 视频推荐功能 ⭐
**包含表：**
1. **major_tags** - 专业标签表（预置30+专业）
2. **video_recommendations** - 视频推荐表
3. **video_watch_history** - 视频观看历史表
4. **user_preferences** - 用户偏好设置表

**扩展字段：**
- profiles 表新增：major, grade, interests

**安全策略：**
- 所有表启用 RLS（Row Level Security）
- 用户只能访问自己的数据
- 管理员可以管理专业标签

## 🎨 设计系统

### 配色方案
- **主色调：** 深蓝色 (#1E3A8A) + 绿色 (#10B981)
- **设计风格：** 现代扁平化设计
- **圆角：** 8px
- **主题：** 支持亮色/暗色模式切换

### 布局结构
- **桌面端：** 左侧导航栏 + 右侧内容区
- **移动端：** 汉堡菜单 + 全屏内容区
- **响应式断点：** 使用 Tailwind CSS 标准断点

## 🔧 技术栈

### 前端框架
- **React 18.3.1** - UI框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具

### UI组件库
- **shadcn/ui** - 高质量组件库
- **Tailwind CSS** - 样式框架
- **Lucide React** - 图标库

### 状态管理
- **React Context** - 全局状态（认证）
- **React Hooks** - 组件状态

### 数据可视化
- **Recharts** - 图表库

### 后端服务
- **Supabase** - BaaS平台
  - PostgreSQL 数据库
  - 认证服务
  - 实时订阅
  - 存储服务
  - Row Level Security

### 路由
- **React Router v6** - 客户端路由

### 日期处理
- **date-fns** - 日期格式化和计算

### 代码质量
- **ESLint** - 代码检查
- **Biome** - 代码格式化
- **TypeScript** - 类型检查

## 📦 依赖管理

### 包管理器
- **pnpm** - 快速、节省磁盘空间的包管理器

### 主要依赖
```json
{
  "@supabase/supabase-js": "^2.x",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.x",
  "date-fns": "^3.x",
  "recharts": "^2.x",
  "lucide-react": "^0.x",
  "sonner": "^1.x"
}
```

## 🚀 开发指南

### 环境变量
创建 `.env.local` 文件：
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_ID=your_app_id
VITE_API_ENV=production
```

### 开发命令
```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 代码检查
pnpm lint

# 类型检查
pnpm type-check
```

### 代码规范
- 使用 2 空格缩进
- 组件使用 PascalCase 命名
- 文件名使用 PascalCase（组件）或 kebab-case（工具）
- 导出优先使用 named export
- 使用 TypeScript 严格模式

## 📝 开发流程

### 1. 创建新页面
1. 在 `src/pages/` 创建页面组件
2. 在 `src/App.tsx` 添加路由
3. 在 `src/components/layouts/MainLayout.tsx` 添加导航链接

### 2. 添加数据库表
1. 在 `supabase/migrations/` 创建迁移文件
2. 在 `src/types/types.ts` 添加类型定义
3. 在 `src/db/api.ts` 添加API函数

### 3. 创建新组件
1. 在 `src/components/` 对应目录创建组件
2. 使用 shadcn/ui 组件作为基础
3. 遵循项目设计规范

## 🔒 安全说明

### 认证机制
- 使用 Supabase Auth
- 用户名+密码登录
- 自动添加 @miaoda.com 邮箱后缀
- 首位注册用户自动成为管理员

### 数据安全
- 启用 Row Level Security (RLS)
- 用户只能访问自己的数据
- 管理员有额外权限
- 所有API调用都经过认证

### 环境变量
- 敏感信息存储在环境变量中
- 不提交 `.env` 文件到版本控制
- 使用 Vite 的 `import.meta.env` 访问

## 📚 相关文档

- [README.md](./README.md) - 项目说明
- [TODO.md](./TODO.md) - 任务清单
- [docs/prd.md](./docs/prd.md) - 产品需求文档

## 🎯 核心功能模块

### 1. 学生事务管理
- 竞赛、作业、考试全方位管理
- 优先级和状态管理
- 截止时间提醒

### 2. 智能时间表
- 自动生成个性化学习计划
- 周视图展示
- 根据任务优先级智能安排

### 3. 知识收藏
- 知识点收藏和整理
- 间隔重复算法提醒复习
- 学科分类管理

### 4. 私人终端 ⭐ 新功能
- 根据专业智能推荐 Bilibili 学术视频
- 视频收藏和观看历史
- 多维度筛选和搜索

### 5. 学习统计
- 学习时长统计
- 任务完成情况分析
- 数据可视化展示

### 6. 系统设置
- 时间表偏好配置
- 个人信息设置
- 视频推荐偏好

## 🌟 项目亮点

1. **完整的学生事务管理系统** - 涵盖学习生活各个方面
2. **智能推荐系统** - 根据专业推送学术视频
3. **数据可视化** - 直观展示学习数据
4. **响应式设计** - 完美适配桌面和移动端
5. **主题切换** - 支持亮色/暗色模式
6. **类型安全** - 完整的 TypeScript 类型定义
7. **安全可靠** - RLS 保护用户数据
8. **现代化技术栈** - React + TypeScript + Supabase

---

**最后更新：** 2025-12-17  
**版本：** 1.0.0  
**维护者：** 智学秘伴开发团队
