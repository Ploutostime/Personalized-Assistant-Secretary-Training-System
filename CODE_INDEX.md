# 智学秘伴 - 代码索引

## 📊 项目统计

- **总代码行数：** 4,844 行
- **TypeScript/TSX 文件：** 72 个
- **页面组件：** 10 个
- **UI 组件：** 52 个
- **自定义 Hooks：** 5 个
- **数据库表：** 9 张

---

## 📂 文件清单

### 🎯 核心应用文件

| 文件路径 | 说明 | 关键功能 |
|---------|------|---------|
| `src/main.tsx` | 应用入口 | React 渲染根组件 |
| `src/App.tsx` | 根组件 | 路由配置、Provider 包装 |
| `src/routes.tsx` | 路由定义 | 路由表配置 |
| `src/index.css` | 全局样式 | Tailwind CSS、主题变量 |

### 📄 页面组件 (src/pages/)

| 文件名 | 路由 | 功能描述 | 代码行数 |
|--------|------|---------|---------|
| `LoginPage.tsx` | `/login` | 用户登录/注册 | ~200 |
| `DashboardPage.tsx` | `/` | 仪表盘首页 | ~350 |
| `TasksPage.tsx` | `/tasks` | 事务管理 | ~450 |
| `SchedulePage.tsx` | `/schedule` | 时间表 | ~300 |
| `KnowledgePage.tsx` | `/knowledge` | 知识收藏 | ~400 |
| `VideoTerminalPage.tsx` | `/video-terminal` | 私人终端 | ~500 |
| `StatisticsPage.tsx` | `/statistics` | 学习统计 | ~350 |
| `SettingsPage.tsx` | `/settings` | 系统设置 | ~480 |
| `AdminPage.tsx` | `/admin` | 管理员面板 | ~250 |
| `SamplePage.tsx` | - | 示例页面（未使用） | ~50 |

### 🧩 布局组件 (src/components/layouts/)

| 文件名 | 功能 | 包含元素 |
|--------|------|---------|
| `MainLayout.tsx` | 主布局 | 侧边栏、顶部导航、内容区 |

### 🔧 通用组件 (src/components/common/)

| 文件名 | 功能 | 使用场景 |
|--------|------|---------|
| `RouteGuard.tsx` | 路由守卫 | 保护需要登录的路由 |
| `ThemeToggle.tsx` | 主题切换 | 亮色/暗色模式切换 |
| `PageMeta.tsx` | 页面元信息 | SEO 优化 |

### 🎨 UI 基础组件 (src/components/ui/)

#### 表单组件
| 文件名 | 组件 | 用途 |
|--------|------|------|
| `button.tsx` | Button | 按钮 |
| `input.tsx` | Input | 输入框 |
| `textarea.tsx` | Textarea | 文本域 |
| `checkbox.tsx` | Checkbox | 复选框 |
| `radio-group.tsx` | RadioGroup | 单选按钮组 |
| `select.tsx` | Select | 下拉选择器 |
| `multi-select.tsx` | MultiSelect | 多选选择器 |
| `switch.tsx` | Switch | 开关 |
| `slider.tsx` | Slider | 滑块 |
| `form.tsx` | Form | 表单容器 |
| `label.tsx` | Label | 标签 |
| `input-otp.tsx` | InputOTP | OTP 输入 |

#### 数据展示组件
| 文件名 | 组件 | 用途 |
|--------|------|------|
| `card.tsx` | Card | 卡片容器 |
| `table.tsx` | Table | 表格 |
| `badge.tsx` | Badge | 徽章 |
| `avatar.tsx` | Avatar | 头像 |
| `progress.tsx` | Progress | 进度条 |
| `skeleton.tsx` | Skeleton | 骨架屏 |
| `chart.tsx` | Chart | 图表 |

#### 反馈组件
| 文件名 | 组件 | 用途 |
|--------|------|------|
| `alert.tsx` | Alert | 警告提示 |
| `alert-dialog.tsx` | AlertDialog | 警告对话框 |
| `dialog.tsx` | Dialog | 对话框 |
| `toast.tsx` | Toast | 轻提示 |
| `toaster.tsx` | Toaster | Toast 容器 |
| `sonner.tsx` | Sonner | Toast 库 |
| `tooltip.tsx` | Tooltip | 工具提示 |

#### 导航组件
| 文件名 | 组件 | 用途 |
|--------|------|------|
| `tabs.tsx` | Tabs | 标签页 |
| `breadcrumb.tsx` | Breadcrumb | 面包屑 |
| `navigation-menu.tsx` | NavigationMenu | 导航菜单 |
| `menubar.tsx` | Menubar | 菜单栏 |
| `dropdown-menu.tsx` | DropdownMenu | 下拉菜单 |
| `pagination.tsx` | Pagination | 分页 |

#### 布局组件
| 文件名 | 组件 | 用途 |
|--------|------|------|
| `sheet.tsx` | Sheet | 侧边抽屉 |
| `drawer.tsx` | Drawer | 抽屉 |
| `sidebar.tsx` | Sidebar | 侧边栏 |
| `separator.tsx` | Separator | 分隔线 |
| `scroll-area.tsx` | ScrollArea | 滚动区域 |
| `resizable.tsx` | Resizable | 可调整大小 |
| `aspect-ratio.tsx` | AspectRatio | 宽高比容器 |

#### 交互组件
| 文件名 | 组件 | 用途 |
|--------|------|------|
| `accordion.tsx` | Accordion | 手风琴 |
| `collapsible.tsx` | Collapsible | 折叠面板 |
| `popover.tsx` | Popover | 弹出框 |
| `toggle.tsx` | Toggle | 切换按钮 |
| `toggle-group.tsx` | ToggleGroup | 切换按钮组 |
| `carousel.tsx` | Carousel | 轮播图 |
| `calendar.tsx` | Calendar | 日历 |

#### 特殊组件
| 文件名 | 组件 | 用途 |
|--------|------|------|
| `video.tsx` | Video | 视频播放器 |
| `map.tsx` | Map | 地图组件 |
| `qrcodedataurl.tsx` | QRCode | 二维码生成 |

### 🔌 上下文 (src/contexts/)

| 文件名 | Context | 功能 |
|--------|---------|------|
| `AuthContext.tsx` | AuthContext | 用户认证状态管理 |

### 🗄️ 数据库层 (src/db/)

| 文件名 | 功能 | API 数量 |
|--------|------|---------|
| `supabase.ts` | Supabase 客户端配置 | - |
| `api.ts` | 数据库 API 封装 | 50+ 个函数 |

#### API 函数分类

**用户相关 (5个)**
- `getProfile()` - 获取用户信息
- `updateProfile()` - 更新用户信息
- `getAllProfiles()` - 获取所有用户
- `updateUserRole()` - 更新用户角色
- `deleteUser()` - 删除用户

**任务相关 (7个)**
- `getTasks()` - 获取任务列表
- `getTask()` - 获取单个任务
- `createTask()` - 创建任务
- `updateTask()` - 更新任务
- `deleteTask()` - 删除任务
- `getUpcomingTasks()` - 获取即将到期任务
- `getTasksByStatus()` - 按状态获取任务

**知识点相关 (7个)**
- `getKnowledgeItems()` - 获取知识点列表
- `getKnowledgeItem()` - 获取单个知识点
- `createKnowledgeItem()` - 创建知识点
- `updateKnowledgeItem()` - 更新知识点
- `deleteKnowledgeItem()` - 删除知识点
- `getReviewDueItems()` - 获取待复习知识点
- `incrementReviewCount()` - 增加复习次数

**学习记录相关 (5个)**
- `getStudySessions()` - 获取学习记录
- `createStudySession()` - 创建学习记录
- `updateStudySession()` - 更新学习记录
- `deleteStudySession()` - 删除学习记录
- `getStudySessionsByDateRange()` - 按日期范围获取

**时间表设置相关 (2个)**
- `getScheduleSettings()` - 获取时间表设置
- `updateScheduleSettings()` - 更新时间表设置

**统计相关 (1个)**
- `getStudyStats()` - 获取学习统计数据

**专业标签相关 (2个)**
- `getMajorTags()` - 获取所有专业标签
- `getMajorTagsByCategory()` - 按分类获取专业标签

**视频推荐相关 (8个)**
- `getVideoRecommendations()` - 获取视频推荐列表
- `getVideoRecommendation()` - 获取单个视频
- `createVideoRecommendation()` - 创建视频推荐
- `updateVideoRecommendation()` - 更新视频信息
- `deleteVideoRecommendation()` - 删除视频
- `toggleVideoFavorite()` - 切换收藏状态
- `markVideoAsWatched()` - 标记为已观看
- `searchVideos()` - 搜索视频

**观看历史相关 (4个)**
- `getVideoWatchHistory()` - 获取观看历史
- `createVideoWatchHistory()` - 创建观看记录
- `updateVideoWatchHistory()` - 更新观看记录
- `deleteVideoWatchHistory()` - 删除观看记录

**用户偏好相关 (2个)**
- `getUserPreferences()` - 获取用户偏好
- `updateUserPreferences()` - 更新用户偏好

### 🪝 自定义 Hooks (src/hooks/)

| 文件名 | Hook | 功能 |
|--------|------|------|
| `use-toast.tsx` | useToast | Toast 通知管理 |
| `use-mobile.ts` | useMobile | 移动端检测 |
| `use-debounce.ts` | useDebounce | 防抖处理 |
| `use-go-back.ts` | useGoBack | 返回导航 |
| `use-supabase-upload.ts` | useSupabaseUpload | 文件上传 |

### 📦 类型定义 (src/types/)

| 文件名 | 内容 | 类型数量 |
|--------|------|---------|
| `types.ts` | 业务类型定义 | 12 个接口 |
| `index.ts` | 类型导出 | - |

#### 类型列表
1. `Profile` - 用户配置
2. `Task` - 学生事务
3. `KnowledgeItem` - 知识点
4. `StudySession` - 学习记录
5. `ScheduleSettings` - 时间表设置
6. `MajorTag` - 专业标签
7. `VideoRecommendation` - 视频推荐
8. `VideoWatchHistory` - 观看历史
9. `UserPreferences` - 用户偏好
10. `TaskType` - 任务类型枚举
11. `PriorityLevel` - 优先级枚举
12. `TaskStatus` - 任务状态枚举

### 🛠️ 工具函数 (src/lib/)

| 文件名 | 功能 |
|--------|------|
| `utils.ts` | 通用工具函数（cn 等） |

### 🗃️ 数据库迁移 (supabase/migrations/)

| 文件名 | 说明 | 表数量 |
|--------|------|--------|
| `00001_create_initial_schema.sql` | 初始数据库结构 | 5 张表 |
| `00002_add_video_recommendation_features.sql` | 视频推荐功能 | 4 张表 |

#### 数据库表清单

**初始表（5张）**
1. `profiles` - 用户配置表
2. `tasks` - 学生事务表
3. `knowledge_items` - 知识点收藏表
4. `study_sessions` - 学习时间记录表
5. `schedule_settings` - 时间表配置表

**扩展表（4张）**
6. `major_tags` - 专业标签表
7. `video_recommendations` - 视频推荐表
8. `video_watch_history` - 视频观看历史表
9. `user_preferences` - 用户偏好设置表

---

## 🔍 快速查找指南

### 按功能查找

#### 用户认证
- **登录页面：** `src/pages/LoginPage.tsx`
- **认证上下文：** `src/contexts/AuthContext.tsx`
- **路由守卫：** `src/components/common/RouteGuard.tsx`
- **用户 API：** `src/db/api.ts` (getProfile, updateProfile)

#### 任务管理
- **任务页面：** `src/pages/TasksPage.tsx`
- **任务 API：** `src/db/api.ts` (getTasks, createTask, updateTask, deleteTask)
- **任务类型：** `src/types/types.ts` (Task, TaskType, TaskStatus)

#### 时间表
- **时间表页面：** `src/pages/SchedulePage.tsx`
- **时间表 API：** `src/db/api.ts` (getScheduleSettings, updateScheduleSettings)
- **时间表类型：** `src/types/types.ts` (ScheduleSettings)

#### 知识收藏
- **知识页面：** `src/pages/KnowledgePage.tsx`
- **知识 API：** `src/db/api.ts` (getKnowledgeItems, createKnowledgeItem)
- **知识类型：** `src/types/types.ts` (KnowledgeItem)

#### 视频推荐
- **视频终端页面：** `src/pages/VideoTerminalPage.tsx`
- **视频 API：** `src/db/api.ts` (getVideoRecommendations, toggleVideoFavorite)
- **视频类型：** `src/types/types.ts` (VideoRecommendation, VideoWatchHistory)

#### 学习统计
- **统计页面：** `src/pages/StatisticsPage.tsx`
- **统计 API：** `src/db/api.ts` (getStudyStats, getStudySessions)
- **统计类型：** `src/types/types.ts` (StudySession)

#### 系统设置
- **设置页面：** `src/pages/SettingsPage.tsx`
- **设置 API：** `src/db/api.ts` (getScheduleSettings, getUserPreferences)
- **设置类型：** `src/types/types.ts` (ScheduleSettings, UserPreferences)

### 按技术栈查找

#### React 相关
- **根组件：** `src/App.tsx`
- **入口文件：** `src/main.tsx`
- **路由配置：** `src/routes.tsx`
- **上下文：** `src/contexts/AuthContext.tsx`

#### TypeScript 相关
- **类型定义：** `src/types/types.ts`
- **类型导出：** `src/types/index.ts`
- **全局类型：** `src/global.d.ts`, `src/vite-env.d.ts`, `src/svg.d.ts`

#### Supabase 相关
- **客户端配置：** `src/db/supabase.ts`
- **API 封装：** `src/db/api.ts`
- **数据库迁移：** `supabase/migrations/`

#### Tailwind CSS 相关
- **全局样式：** `src/index.css`
- **配置文件：** `tailwind.config.js`
- **工具函数：** `src/lib/utils.ts`

#### shadcn/ui 相关
- **UI 组件：** `src/components/ui/`
- **组件配置：** `components.json`

---

## 📈 代码复杂度分析

### 页面组件复杂度排名

1. **VideoTerminalPage.tsx** (~500 行) - 最复杂
   - 视频管理、筛选、搜索
   - 多个对话框和表单
   - 复杂的状态管理

2. **SettingsPage.tsx** (~480 行)
   - 多个设置模块
   - 表单验证和提交
   - 专业标签管理

3. **TasksPage.tsx** (~450 行)
   - 任务 CRUD 操作
   - 筛选和搜索
   - 状态管理

4. **KnowledgePage.tsx** (~400 行)
   - 知识点管理
   - 复习提醒
   - 标签系统

5. **DashboardPage.tsx** (~350 行)
   - 数据概览
   - 多个数据源
   - 视频推荐展示

### API 函数复杂度

- **简单查询：** 20 个函数
- **带筛选查询：** 15 个函数
- **复杂业务逻辑：** 10 个函数
- **批量操作：** 5 个函数

---

## 🎯 开发建议

### 新增功能时

1. **新增页面：**
   - 在 `src/pages/` 创建页面组件
   - 在 `src/App.tsx` 添加路由
   - 在 `src/components/layouts/MainLayout.tsx` 添加导航

2. **新增数据表：**
   - 在 `supabase/migrations/` 创建迁移文件
   - 在 `src/types/types.ts` 添加类型定义
   - 在 `src/db/api.ts` 添加 API 函数

3. **新增组件：**
   - 在 `src/components/` 对应目录创建
   - 优先使用 shadcn/ui 组件
   - 遵循项目命名规范

### 修改功能时

1. **查找相关文件：**
   - 使用本索引快速定位
   - 检查类型定义
   - 查看 API 函数

2. **测试影响范围：**
   - 检查组件引用
   - 测试相关页面
   - 运行 lint 检查

### 代码审查重点

1. **类型安全：** 确保所有函数有正确的类型定义
2. **错误处理：** 所有 API 调用都要有错误处理
3. **用户体验：** 加载状态、空状态、错误提示
4. **性能优化：** 避免不必要的重渲染
5. **代码规范：** 遵循 ESLint 和 Biome 规则

---

## 📚 相关文档

- [README.md](./README.md) - 项目说明
- [TODO.md](./TODO.md) - 任务清单
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - 项目结构
- [CODE_DOCUMENTATION.md](./CODE_DOCUMENTATION.md) - 完整代码文档

---

**文档版本：** 1.0.0  
**最后更新：** 2025-12-17  
**维护者：** 智学秘伴开发团队
