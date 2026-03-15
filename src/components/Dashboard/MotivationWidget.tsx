import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Star, Zap, Heart, Target, Clock } from 'lucide-react'

const MotivationWidget: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [dailyStreak, setDailyStreak] = useState(7)
  
  const motivationalQuotes = [
    "学习不是赛跑，而是持续不断的旅程。",
    "每一次努力都在为未来的自己铺路。",
    "知识就像肌肉，越用越强壮。",
    "今天的付出，明天的收获。",
    "学习是给自己最好的投资。"
  ]

  const achievements = [
    { icon: Trophy, label: '连续学习', value: `${dailyStreak}天`, color: 'text-yellow-500' },
    { icon: Star, label: '本周成就', value: '3个', color: 'text-blue-500' },
    { icon: Zap, label: '学习效率', value: '85%', color: 'text-green-500' },
    { icon: Heart, label: '学习热情', value: '92%', color: 'text-red-500' }
  ]

  const dailyGoals = [
    { task: '完成数学练习', completed: true },
    { task: '阅读编程教程', completed: true },
    { task: '英语听力练习', completed: false },
    { task: '复习上周内容', completed: false }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <Zap className="w-6 h-6 text-yellow-500 mr-2" />
        学习动力
      </h3>

      {/* 激励语录 */}
      <motion.div
        key={currentQuote}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Target size={20} className="text-blue-600" />
          </div>
          <p className="text-sm text-blue-800 font-medium">
            {motivationalQuotes[currentQuote]}
          </p>
        </div>
      </motion.div>

      {/* 成就统计 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
          >
            <div className={`p-2 rounded-lg ${achievement.color} bg-opacity-10`}>
              <achievement.icon size={20} className={achievement.color} />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{achievement.value}</div>
              <div className="text-xs text-gray-500">{achievement.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 每日目标 */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Clock size={16} className="text-gray-600 mr-2" />
          今日目标
        </h4>
        
        <div className="space-y-2">
          {dailyGoals.map((goal, index) => (
            <motion.div
              key={goal.task}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
              className="flex items-center justify-between p-2"
            >
              <span className={`text-sm ${goal.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                {goal.task}
              </span>
              
              <div className={`w-4 h-4 rounded-full border-2 ${
                goal.completed 
                  ? 'bg-green-500 border-green-500' 
                  : 'border-gray-300'
              }`}>
                {goal.completed && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* 进度指示器 */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>完成进度</span>
            <span>{dailyGoals.filter(g => g.completed).length}/{dailyGoals.length}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(dailyGoals.filter(g => g.completed).length / dailyGoals.length) * 100}%` }}
              transition={{ duration: 1, delay: 0.6 }}
              className="h-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 激励按钮 */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all"
      >
        继续学习 💪
      </motion.button>
    </div>
  )
}

export default MotivationWidget