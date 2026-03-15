import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Eye, Brain, Zap, Target } from 'lucide-react'

interface RealTimeMetricsProps {
  metrics?: any
}

const RealTimeMetrics: React.FC<RealTimeMetricsProps> = ({ metrics }) => {
  const [currentMetrics, setCurrentMetrics] = useState({
    focusLevel: 75,
    efficiency: 82,
    energy: 65,
    motivation: 88
  })

  useEffect(() => {
    // 模拟实时数据更新
    const interval = setInterval(() => {
      setCurrentMetrics(prev => ({
        focusLevel: Math.max(10, Math.min(100, prev.focusLevel + (Math.random() * 10 - 5))),
        efficiency: Math.max(10, Math.min(100, prev.efficiency + (Math.random() * 8 - 4))),
        energy: Math.max(10, Math.min(100, prev.energy + (Math.random() * 6 - 3))),
        motivation: Math.max(10, Math.min(100, prev.motivation + (Math.random() * 12 - 6)))
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const metricsData = [
    {
      icon: Eye,
      label: '专注度',
      value: Math.round(currentMetrics.focusLevel),
      color: 'text-blue-400',
      bgColor: 'bg-blue-500',
      description: '当前学习专注程度'
    },
    {
      icon: Brain,
      label: '效率',
      value: Math.round(currentMetrics.efficiency),
      color: 'text-green-400',
      bgColor: 'bg-green-500',
      description: '学习效率百分比'
    },
    {
      icon: Zap,
      label: '精力',
      value: Math.round(currentMetrics.energy),
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500',
      description: '当前精力水平'
    },
    {
      icon: Target,
      label: '动力',
      value: Math.round(currentMetrics.motivation),
      color: 'text-purple-400',
      bgColor: 'bg-purple-500',
      description: '学习动力指数'
    }
  ]

  const getStatusColor = (value: number) => {
    if (value >= 80) return 'text-green-400'
    if (value >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getStatusText = (value: number) => {
    if (value >= 80) return '优秀'
    if (value >= 60) return '良好'
    return '待提升'
  }

  return (
    <>
      {metricsData.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white/20 backdrop-blur-lg rounded-xl p-4 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-lg ${metric.bgColor}/30`}>
                <metric.icon size={16} className={metric.color} />
              </div>
              <span className="text-sm font-medium">{metric.label}</span>
            </div>
            
            <div className="text-right">
              <div className={`text-xl font-bold ${getStatusColor(metric.value)}`}>
                {metric.value}%
              </div>
              <div className="text-xs opacity-80">
                {getStatusText(metric.value)}
              </div>
            </div>
          </div>

          {/* 进度条 */}
          <div className="w-full bg-white/20 rounded-full h-1">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${metric.value}%` }}
              transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
              className={`h-1 rounded-full ${
                metric.value >= 80 ? 'bg-green-400' :
                metric.value >= 60 ? 'bg-yellow-400' : 'bg-red-400'
              }`}
            />
          </div>

          <div className="mt-1">
            <p className="text-xs opacity-80">{metric.description}</p>
          </div>
        </motion.div>
      ))}
    </>
  )
}

export default RealTimeMetrics