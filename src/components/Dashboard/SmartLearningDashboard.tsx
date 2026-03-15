import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Award,
  Brain,
  Zap,
  Calendar,
  Users,
  BookOpen,
  Star,
  Rocket,
  Lightbulb,
  Flag
} from 'lucide-react'
import { useQuery } from 'react-query'
import StatCard from './StatCard'
import LearningProgress from './LearningProgress'
import AIRecommendations from './AIRecommendations'
import MotivationWidget from './MotivationWidget'
import StudyTimer from './StudyTimer'
import RealTimeMetrics from './RealTimeMetrics'

// 模拟数据 - 实际项目中应该从API获取
const mockLearningStats = {
  overallProgress: 75,
  weeklyProgress: 12,
  totalStudyTime: 3600, // 分钟
  currentStreak: 7
}

const mockUser = {
  id: '1',
  username: '学习者',
  profile: {
    dailyGoal: 60,
    learningStyle: '视觉型',
    preferredSubjects: ['数学', '编程', '英语']
  },
  learningStats: {
    level: 3,
    experience: 1250,
    todayStudyTime: 45
  }
}

const SmartLearningDashboard: React.FC = () => {
  const [user] = useState(mockUser)
  const [learningStats] = useState(mockLearningStats)
  const [isLoading] = useState(false)
  const [activeView, setActiveView] = useState<'overview' | 'analytics' | 'goals' | 'community'>('overview')
  const [showStudyTimer, setShowStudyTimer] = useState(false)

  // 模拟API调用
  const getRecommendations = async () => {
    return [
      {
        id: '1',
        type: 'course',
        title: 'React高级教程',
        description: '深入学习React Hooks和状态管理',
        estimatedBenefit: 85,
        timeRequired: 120,
        difficulty: 'intermediate'
      },
      {
        id: '2',
        type: 'resource',
        title: '算法图解',
        description: '通过图解理解复杂算法',
        estimatedBenefit: 70,
        timeRequired: 60,
        difficulty: 'beginner'
      }
    ]
  }

  // 获取AI推荐
  const { data: aiRecommendations } = useQuery(
    ['recommendations', user?.id],
    getRecommendations,
    { enabled: !!user?.id }
  )

  // 增强统计卡片数据
  const enhancedStats = [
    {
      title: '学习进度',
      value: `${learningStats?.overallProgress || 0}%`,
      icon: TrendingUp,
      color: 'blue' as const,
      change: learningStats?.weeklyProgress || 0,
      description: '整体完成率',
      trend: 'up' as const
    },
    {
      title: '学习时间',
      value: `${Math.round((learningStats?.totalStudyTime || 0) / 60)}小时`,
      icon: Clock,
      color: 'green' as const,
      change: 15,
      description: '总学习时长',
      trend: 'up' as const
    },
    {
      title: '成就点数',
      value: `${user?.learningStats?.experience || 0}`,
      icon: Award,
      color: 'purple' as const,
      change: 8,
      description: '累计成就',
      trend: 'up' as const
    },
    {
      title: '连续学习',
      value: `${user?.learningStats?.currentStreak || 0}天`,
      icon: Calendar,
      color: 'orange' as const,
      change: user?.learningStats?.currentStreak || 0,
      description: '当前连续',
      trend: 'up' as const
    }
  ]

  // 视图配置
  const views = [
    { id: 'overview', label: '总览', icon: Target, color: 'blue' },
    { id: 'analytics', label: '分析', icon: Brain, color: 'green' },
    { id: 'goals', label: '目标', icon: Flag, color: 'purple' },
    { id: 'community', label: '社区', icon: Users, color: 'orange' }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-6"
    >
      {/* 欢迎头部 */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-bold mb-2"
            >
              欢迎回来，{user?.username}！
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-blue-100 text-lg"
            >
              🎯 今日目标：完成{user?.profile?.dailyGoal || 60}分钟学习
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-4"
          >
            <button 
              onClick={() => setShowStudyTimer(true)}
              className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold flex items-center space-x-2 hover:bg-blue-50 transition-all"
            >
              <Zap size={20} />
              <span>开始学习</span>
            </button>
          </motion.div>
        </div>

        {/* 实时指标 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
        >
          <RealTimeMetrics />
        </motion.div>
      </div>

      {/* 视图导航 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-2 shadow-lg"
      >
        <div className="flex space-x-1">
          {views.map((view) => (
            <motion.button
              key={view.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveView(view.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all flex-1 ${
                activeView === view.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'
              }`}
            >
              <view.icon size={18} />
              <span>{view.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* 主要内容区域 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {activeView === 'overview' && <OverviewView stats={enhancedStats} recommendations={aiRecommendations} />}
          {activeView === 'analytics' && <AnalyticsView learningStats={learningStats} />}
          {activeView === 'goals' && <GoalsView user={user} />}
          {activeView === 'community' && <CommunityView />}
        </motion.div>
      </AnimatePresence>

      {/* 学习计时器模态框 */}
      <AnimatePresence>
        {showStudyTimer && (
          <StudyTimerModal onClose={() => setShowStudyTimer(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// 总览视图组件
const OverviewView: React.FC<{ stats: any[]; recommendations: any }> = ({ stats, recommendations }) => (
  <div className="space-y-6">
    {/* 统计卡片网格 */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>

    {/* 主要内容网格 */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <LearningProgress />
      </div>
      <div className="space-y-6">
        <AIRecommendations recommendations={recommendations} />
        <MotivationWidget />
      </div>
    </div>
  </div>
)

// 分析视图组件
const AnalyticsView: React.FC<{ learningStats: any }> = ({ learningStats }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <Brain className="w-6 h-6 text-green-500 mr-2" />
        学习分析
      </h3>
      {/* 分析图表组件 */}
      <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">学习分析图表</span>
      </div>
    </div>
    
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <TrendingUp className="w-6 h-6 text-blue-500 mr-2" />
        进度趋势
      </h3>
      {/* 趋势图表组件 */}
      <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">进度趋势图表</span>
      </div>
    </div>
  </div>
)

// 目标视图组件
const GoalsView: React.FC<{ user: any }> = ({ user }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <Target className="w-6 h-6 text-purple-500 mr-2" />
        学习目标
      </h3>
      {/* 目标管理组件 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
          <div>
            <div className="font-semibold">每日学习目标</div>
            <div className="text-sm text-gray-600">{user?.profile?.dailyGoal || 60}分钟</div>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {Math.round((user?.learningStats?.todayStudyTime || 0) / 60)}/{user?.profile?.dailyGoal || 60}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="font-semibold text-blue-600">长期目标</div>
            <div className="text-sm text-gray-600 mt-1">掌握React高级特性</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="font-semibold text-green-600">本周目标</div>
            <div className="text-sm text-gray-600 mt-1">完成3个练习项目</div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

// 社区视图组件
const CommunityView: React.FC = () => (
  <div className="bg-white rounded-2xl p-6 shadow-lg">
    <h3 className="text-xl font-bold mb-4 flex items-center">
      <Users className="w-6 h-6 text-orange-500 mr-2" />
      学习社区
    </h3>
    {/* 社区活动组件 */}
    <div className="space-y-4">
      <div className="p-4 bg-orange-50 rounded-lg">
        <div className="font-semibold">热门讨论</div>
        <div className="text-sm text-gray-600 mt-1">React性能优化技巧分享</div>
      </div>
      <div className="p-4 bg-red-50 rounded-lg">
        <div className="font-semibold">学习小组</div>
        <div className="text-sm text-gray-600 mt-1">前端开发进阶小组 - 15人参与</div>
      </div>
    </div>
  </div>
)

// 学习计时器模态框组件
const StudyTimerModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="bg-white rounded-2xl p-6 w-full max-w-md"
      onClick={(e) => e.stopPropagation()}
    >
      <StudyTimer onClose={onClose} />
    </motion.div>
  </motion.div>
)

export default SmartLearningDashboard