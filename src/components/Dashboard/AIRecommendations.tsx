import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Video, FileText, Zap, Clock, Star } from 'lucide-react'

interface Recommendation {
  id: string
  type: 'course' | 'resource' | 'practice' | 'schedule'
  title: string
  description: string
  estimatedBenefit: number
  timeRequired: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

interface AIRecommendationsProps {
  recommendations?: Recommendation[]
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({ recommendations }) => {
  // 默认推荐数据
  const defaultRecommendations: Recommendation[] = [
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
    },
    {
      id: '3',
      type: 'practice',
      title: '编程练习',
      description: '巩固JavaScript基础语法',
      estimatedBenefit: 65,
      timeRequired: 45,
      difficulty: 'beginner'
    }
  ]

  const displayRecommendations = recommendations || defaultRecommendations

  const getIcon = (type: string) => {
    switch (type) {
      case 'course': return BookOpen
      case 'resource': return FileText
      case 'practice': return Zap
      case 'schedule': return Clock
      default: return Star
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-500 bg-green-50'
      case 'intermediate': return 'text-blue-500 bg-blue-50'
      case 'advanced': return 'text-purple-500 bg-purple-50'
      default: return 'text-gray-500 bg-gray-50'
    }
  }

  const getBenefitColor = (benefit: number) => {
    if (benefit >= 80) return 'text-green-500'
    if (benefit >= 60) return 'text-blue-500'
    return 'text-orange-500'
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <Star className="w-6 h-6 text-yellow-500 mr-2" />
        AI智能推荐
      </h3>
      
      <div className="space-y-4">
        {displayRecommendations.map((rec, index) => {
          const Icon = getIcon(rec.type)
          
          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Icon size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-lg font-bold ${getBenefitColor(rec.estimatedBenefit)}`}>
                    {rec.estimatedBenefit}%
                  </div>
                  <div className="text-xs text-gray-500">收益</div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{rec.timeRequired}分钟</span>
                  </div>
                  
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(rec.difficulty)}`}>
                    {rec.difficulty === 'beginner' ? '初级' : 
                     rec.difficulty === 'intermediate' ? '中级' : '高级'}
                  </span>
                </div>

                <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors">
                  开始学习
                </button>
              </div>

              {/* 收益进度条 */}
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${rec.estimatedBenefit}%` }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                    className={`h-1 rounded-full ${
                      rec.estimatedBenefit >= 80 ? 'bg-green-400' :
                      rec.estimatedBenefit >= 60 ? 'bg-blue-400' : 'bg-orange-400'
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* 推荐说明 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-4 p-3 bg-gray-50 rounded-lg"
      >
        <p className="text-xs text-gray-600">
          💡 基于您的学习历史和偏好，AI为您推荐最适合的学习内容
        </p>
      </motion.div>
    </div>
  )
}

export default AIRecommendations