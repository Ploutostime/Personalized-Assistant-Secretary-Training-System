import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Target, Award, Clock } from 'lucide-react'

const LearningProgress: React.FC = () => {
  const progressData = [
    { subject: '数学', progress: 85, target: 100, color: 'bg-blue-500' },
    { subject: '编程', progress: 60, target: 100, color: 'bg-green-500' },
    { subject: '英语', progress: 45, target: 100, color: 'bg-purple-500' },
    { subject: '物理', progress: 30, target: 100, color: 'bg-orange-500' }
  ]

  const stats = [
    { icon: BookOpen, label: '已学课程', value: '12', color: 'text-blue-500' },
    { icon: Target, label: '完成目标', value: '8/10', color: 'text-green-500' },
    { icon: Award, label: '获得成就', value: '15', color: 'text-purple-500' },
    { icon: Clock, label: '学习时长', value: '36h', color: 'text-orange-500' }
  ]

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-6 flex items-center">
        <BookOpen className="w-6 h-6 text-blue-500 mr-2" />
        学习进度总览
      </h3>

      {/* 进度条区域 */}
      <div className="space-y-4 mb-6">
        {progressData.map((item, index) => (
          <motion.div
            key={item.subject}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">{item.subject}</span>
              <span className="text-sm text-gray-500">{item.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.progress}%` }}
                transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                className={`h-3 rounded-full ${item.color} shadow-sm`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.8 }}
            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
          >
            <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 学习建议 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
      >
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Target size={20} className="text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">学习建议</h4>
            <p className="text-sm text-blue-700">
              建议优先完成英语课程，当前进度相对较低，每日坚持学习30分钟可快速提升。
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default LearningProgress