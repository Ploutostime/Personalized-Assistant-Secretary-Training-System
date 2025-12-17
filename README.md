# 智学秘伴 - 学生事务管理系统

## 介绍

智学秘伴是一个智能化的学生事务管理与学习效率提升系统，帮助学生高效收纳和整理各类学习事务，生成个性化时间表，并通过智能提醒引导学生快速进入学习状态。

## 核心功能

### 1. 学生事务管理
- 竞赛日程记录与提醒
- 作业安排整理与截止时间管理
- 时间管控功能，设置学习时长目标
- 时间协调，自动安排学习计划
- 考研考级相关信息管理
- 日程规划与任务优先级设定

### 2. 时间表生成
- 自动生成个性化时间表
- 周视图展示学习计划
- 实时更新和同步

### 3. 智能提醒功能
- 任务截止时间提醒
- 知识点复习提醒
- 学习状态智能识别

### 4. 效率提升工具
- 学习时间统计和分析
- 学习习惯养成提醒
- 知识点收藏和复习提醒
- 数据可视化图表展示

### 5. 管理员功能
- 用户管理
- 角色权限管理
- 系统数据统计

## 设计特色

- **配色方案**：采用深蓝色(#1E3A8A)与绿色(#10B981)搭配，营造专业而富有活力的学习氛围
- **视觉风格**：现代扁平化设计，8px圆角处理，柔和阴影效果增强层次感
- **布局设计**：左侧导航栏+主内容区域的经典布局，响应式设计支持移动端访问

## 使用说明

### 首次使用

1. 访问系统后，点击"注册"创建账号
2. 第一个注册的用户将自动成为管理员
3. 使用用户名和密码登录系统

### 事务管理

1. 在"事务管理"页面点击"新建任务"
2. 填写任务信息：标题、描述、类型、优先级、截止时间等
3. 系统会根据截止时间和优先级自动安排到时间表中
4. 可以随时更新任务状态或编辑任务信息

### 知识收藏

1. 在"知识收藏"页面点击"新建知识点"
2. 记录重要的学习知识点，可添加标签和来源链接
3. 点击"复习"按钮记录复习次数
4. 系统会根据间隔重复算法提醒复习时间

### 学习统计

- 查看总学习时长、完成任务数等统计数据
- 查看本周学习时长趋势图
- 查看任务类型分布图
- 获取个性化学习建议

### 时间表设置

1. 在"设置"页面配置学习偏好
2. 设置每日学习目标时长
3. 设置偏好的学习时间段
4. 配置休息时长和提醒选项

## 技术栈

- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite
- **UI组件库**：shadcn/ui + Tailwind CSS
- **路由管理**：React Router
- **数据可视化**：Recharts
- **后端服务**：Supabase (数据库 + 认证)
- **日期处理**：date-fns

## 本地开发

### 环境要求

```
Node.js ≥ 20
npm ≥ 10
例如：
node -v   # v20.18.3
npm -v    # 10.8.2
```

### 安装步骤

```bash
# Step 1: 下载代码包
# Step 2: 解压代码包
# Step 3: 用IDE打开代码包，进入代码目录

# Step 4: 安装依赖
npm install

# Step 5: 启动开发服务器
npm run dev -- --host 127.0.0.1
```

### 数据库配置

本项目使用 Supabase 作为后端服务，数据库已自动配置。如需了解更多：

- 数据库表结构定义在 `supabase/migrations` 目录
- 数据库API封装在 `src/db/api.ts`
- 认证配置在 `src/contexts/AuthContext.tsx`

## 数据库结构

### 主要数据表

1. **profiles** - 用户配置表
   - 存储用户基本信息和角色权限
   
2. **tasks** - 学生事务表
   - 存储竞赛、作业、考试等各类学习任务
   
3. **knowledge_items** - 知识点收藏表
   - 存储学习知识点和复习记录
   
4. **study_sessions** - 学习时间记录表
   - 记录学习时长和学习内容
   
5. **schedule_settings** - 时间表配置表
   - 存储用户的学习偏好设置

## 安全说明

- 使用 Supabase Row Level Security (RLS) 保护数据安全
- 用户只能访问和修改自己的数据
- 管理员拥有额外的用户管理权限
- 密码使用 Supabase Auth 加密存储

## 目录结构

```
├── README.md                   # 说明文档
├── components.json             # 组件库配置
├── index.html                  # 入口文件
├── package.json                # 包管理
├── postcss.config.js           # postcss 配置
├── public                      # 静态资源目录
│   ├── favicon.png            # 图标
│   └── images                 # 图片资源
├── src                         # 源码目录
│   ├── App.tsx                # 应用入口
│   ├── components             # 组件目录
│   │   ├── common            # 通用组件
│   │   ├── layouts           # 布局组件
│   │   └── ui                # UI组件库
│   ├── contexts               # 上下文目录
│   │   └── AuthContext.tsx   # 认证上下文
│   ├── db                     # 数据库配置目录
│   │   ├── api.ts            # 数据库API封装
│   │   └── supabase.ts       # Supabase客户端
│   ├── hooks                  # 通用钩子函数目录
│   ├── index.css              # 全局样式
│   ├── lib                    # 工具库目录
│   ├── main.tsx               # 入口文件
│   ├── routes.tsx             # 路由配置
│   ├── pages                  # 页面目录
│   │   ├── DashboardPage.tsx # 仪表盘
│   │   ├── TasksPage.tsx     # 事务管理
│   │   ├── SchedulePage.tsx  # 时间表
│   │   ├── KnowledgePage.tsx # 知识收藏
│   │   ├── StatisticsPage.tsx# 学习统计
│   │   ├── SettingsPage.tsx  # 设置
│   │   ├── AdminPage.tsx     # 管理员面板
│   │   └── LoginPage.tsx     # 登录页面
│   └── types                  # 类型定义目录
│       └── types.ts          # TypeScript类型定义
├── supabase                   # Supabase配置目录
│   └── migrations            # 数据库迁移文件
├── tsconfig.app.json          # ts 前端配置文件
├── tsconfig.json              # ts 配置文件
├── tsconfig.node.json         # ts node端配置文件
└── vite.config.ts             # vite 配置文件
```

## 了解更多

您也可以查看帮助文档：[源码导出](https://cloud.baidu.com/doc/MIAODA/s/Xmewgmsq7)，了解更多详细内容。

## 版权信息

© 2025 智学秘伴
