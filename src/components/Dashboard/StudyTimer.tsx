import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Square, RotateCcw, Clock, Target, Zap } from 'lucide-react'

interface StudyTimerProps {
  onClose: () => void
}

const StudyTimer: React.FC<StudyTimerProps> = ({ onClose }) => {
  const [time, setTime] = useState(0) // 秒
  const [isRunning, setIsRunning] = useState(false)
  const [sessionType, setSessionType] = useState<'focus' | 'break'>('focus')
  const [targetTime, setTargetTime] = useState(25 * 60) // 25分钟

  const focusTime = 25 * 60 // 25分钟专注时间
  const breakTime = 5 * 60  // 5分钟休息时间

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => {
          if (prevTime >= targetTime - 1) {
            // 时间到，自动切换
            handleSessionComplete()
            return 0
          }
          return prevTime + 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, targetTime])

  const handleSessionComplete = () => {
    setIsRunning(false)
    
    if (sessionType === 'focus') {
      // 专注时间结束，切换到休息
      setSessionType('break')
      setTargetTime(breakTime)
      // 播放完成音效
      playCompletionSound()
    } else {
      // 休息时间结束，切换到专注
      setSessionType('focus')
      setTargetTime(focusTime)
    }
  }

  const playCompletionSound = () => {
    // 简单的音效播放（实际项目中可以使用Web Audio API）
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = 800
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 1)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = (time / targetTime) * 100

  const getSessionColor = () => {
    return sessionType === 'focus' ? 'from-blue-500 to-blue-600' : 'from-green-500 to-green-600'
  }

  const getSessionIcon = () => {
    return sessionType === 'focus' ? Target : Zap
  }

  const SessionIcon = getSessionIcon()

  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold mb-6 flex items-center justify-center">
        <Clock className="w-8 h-8 text-blue-500 mr-2" />
        学习计时器
      </h3>

      {/* 进度圆环 */}
      <div className="relative w-48 h-48 mx-auto mb-6">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* 背景圆环 */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          
          {/* 进度圆环 */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ strokeDashoffset: 283 }}
            animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
            transition={{ duration: 1 }}
            strokeDasharray="283"
            transform="rotate(-90 50 50)"
          />
          
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>

        {/* 中心内容 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-gray-900">
            {formatTime(time)}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            / {formatTime(targetTime)}
          </div>
          <div className="flex items-center space-x-1 mt-2">
            <SessionIcon size={16} className={sessionType === 'focus' ? 'text-blue-500' : 'text-green-500'} />
            <span className="text-xs font-medium">
              {sessionType === 'focus' ? '专注时间' : '休息时间'}
            </span>
          </div>
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex justify-center space-x-4 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsRunning(!isRunning)}
          className={`p-3 rounded-full ${
            isRunning 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-green-500 hover:bg-green-600'
          } text-white shadow-lg`}
        >
          {isRunning ? <Pause size={20} /> : <Play size={20} />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setTime(0)
            setIsRunning(false)
          }}
          className="p-3 bg-gray-500 rounded-full text-white hover:bg-gray-600 shadow-lg"
        >
          <Square size={20} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setTime(0)
            setIsRunning(false)
            setSessionType('focus')
            setTargetTime(focusTime)
          }}
          className="p-3 bg-blue-500 rounded-full text-white hover:bg-blue-600 shadow-lg"
        >
          <RotateCcw size={20} />
        </motion.button>
      </div>

      {/* 会话信息 */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-gray-900">专注时间</div>
            <div className="text-gray-600">25分钟</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900">休息时间</div>
            <div className="text-gray-600">5分钟</div>
          </div>
        </div>
      </div>

      {/* 关闭按钮 */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClose}
        className="w-full py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
      >
        关闭计时器
      </motion.button>

      {/* 提示信息 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-4 p-3 bg-blue-50 rounded-lg"
      >
        <p className="text-xs text-blue-700">
          💡 使用番茄工作法提高学习效率：25分钟专注 + 5分钟休息
        </p>
      </motion.div>
    </div>
  )
}

export default StudyTimer