import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  icon: React.ComponentType<{ size?: number }>
  color: 'blue' | 'green' | 'purple' | 'orange'
  change: number
  description: string
  trend: 'up' | 'down'
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  change,
  description,
  trend
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600'
  }

  const iconColors = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    orange: 'text-orange-400'
  }

  const changeColors = {
    up: 'text-green-400',
    down: 'text-red-400'
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]} shadow-md`}>
          <Icon size={24} className="text-white" />
        </div>
        
        <div className="text-right">
          <div className="flex items-center space-x-1">
            {trend === 'up' ? (
              <TrendingUp size={16} className={changeColors[trend]} />
            ) : (
              <TrendingDown size={16} className={changeColors[trend]} />
            )}
            <span className={`text-sm font-medium ${changeColors[trend]}`}>
              {change > 0 ? '+' : ''}{change}%
            </span>
          </div>
          <span className="text-xs text-gray-500">较上周</span>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>

      {/* 进度条 */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(Math.abs(change), 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-2 rounded-full ${
              trend === 'up' ? 'bg-green-400' : 'bg-red-400'
            }`}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default StatCard