import { User } from '../models/User'
import { LearningSession } from '../models/LearningSession'
import { Course } from '../models/Course'
import { Resource } from '../models/Resource'
import { logger } from '../utils/logger'
import { OpenAI } from 'openai'

interface LearningPattern {
  userId: string
  period: '7d' | '30d' | '90d' | 'all'
  patterns: {
    timeDistribution: TimeDistribution
    focusTrends: FocusTrend[]
    efficiencyMetrics: EfficiencyMetrics
    knowledgeGaps: KnowledgeGap[]
    learningVelocity: number
  }
  insights: LearningInsight[]
  recommendations: LearningRecommendation[]
  predictions: LearningPrediction[]
}

interface TimeDistribution {
  morning: number
  afternoon: number
  evening: number
  weekend: number
  peakHours: string[]
}

interface FocusTrend {
  date: string
  averageFocus: number
  sessionCount: number
  totalDuration: number
}

interface EfficiencyMetrics {
  averageEfficiency: number
  consistency: number
  improvementRate: number
  comparison: {
    peerAverage: number
    platformAverage: number
  }
}

interface KnowledgeGap {
  subject: string
  gapLevel: 'low' | 'medium' | 'high'
  relatedTopics: string[]
  recommendedResources: string[]
  estimatedTimeToClose: number // 小时
}

interface LearningInsight {
  type: 'strength' | 'weakness' | 'opportunity' | 'threat'
  title: string
  description: string
  confidence: number
  actionable: boolean
  priority: 'high' | 'medium' | 'low'
}

interface LearningRecommendation {
  type: 'course' | 'resource' | 'practice' | 'schedule'
  title: string
  description: string
  reason: string
  estimatedBenefit: number // 0-100
  timeRequired: number // 分钟
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  urgency: 'immediate' | 'soon' | 'long-term'
}

interface LearningPrediction {
  metric: 'completionTime' | 'skillLevel' | 'retentionRate'
  currentValue: number
  predictedValue: number
  confidence: number
  timeframe: '1week' | '1month' | '3months'
  factors: string[]
}

export class AdvancedLearningAnalytics {
  private openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!
    })
  }

  // 综合分析用户学习模式
  async analyzeLearningPatterns(userId: string, period: '7d' | '30d' | '90d' | 'all' = '30d'): Promise<LearningPattern> {
    try {
      const [user, sessions, courses, resources] = await Promise.all([
        User.findById(userId),
        this.getSessionsInPeriod(userId, period),
        this.getUserCourses(userId),
        this.getUserResources(userId)
      ])

      if (!user) {
        throw new Error('用户不存在')
      }

      // 多维度分析
      const patterns = await this.calculatePatterns(sessions, user)
      const insights = await this.generateInsights(patterns, user, sessions)
      const recommendations = await this.generateRecommendations(patterns, insights, user)
      const predictions = await this.generatePredictions(patterns, user)

      return {
        userId,
        period,
        patterns,
        insights,
        recommendations,
        predictions
      }
    } catch (error) {
      logger.error('学习模式分析失败:', error)
      throw new Error('分析服务暂时不可用')
    }
  }

  // 实时学习建议
  async getRealTimeSuggestions(userId: string, context: {
    currentTime: Date
    availableTime: number
    energyLevel: number
    currentActivity?: string
  }): Promise<LearningRecommendation[]> {
    const patterns = await this.analyzeLearningPatterns(userId, '7d')
    const user = await User.findById(userId)

    // 基于上下文过滤推荐
    const filtered = patterns.recommendations.filter(rec => 
      rec.timeRequired <= context.availableTime &&
      this.isSuitableForEnergyLevel(rec, context.energyLevel) &&
      this.isSuitableForTimeOfDay(rec, context.currentTime)
    )

    // 使用AI优化排序
    const optimized = await this.optimizeRecommendations(filtered, context, user)

    return optimized.slice(0, 5) // 返回前5个推荐
  }

  // 预测学习成果
  async predictLearningOutcomes(userId: string, target: {
    courseId?: string
    skill?: string
    timeframe: '1week' | '1month' | '3months'
  }): Promise<LearningPrediction[]> {
    const patterns = await this.analyzeLearningPatterns(userId, '30d')
    const user = await User.findById(userId)

    const predictions: LearningPrediction[] = []

    // 课程完成预测
    if (target.courseId) {
      const coursePrediction = await this.predictCourseCompletion(userId, target.courseId, target.timeframe)
      predictions.push(coursePrediction)
    }

    // 技能提升预测
    if (target.skill) {
      const skillPrediction = await this.predictSkillImprovement(userId, target.skill, target.timeframe)
      predictions.push(skillPrediction)
    }

    // 学习效率预测
    const efficiencyPrediction = await this.predictEfficiencyImprovement(patterns, target.timeframe)
    predictions.push(efficiencyPrediction)

    return predictions
  }

  // 生成个性化学习路径
  async generateLearningPath(userId: string, goals: {
    primaryGoal: string
    secondaryGoals?: string[]
    timeframe: '1month' | '3months' | '6months' | '1year'
    constraints?: {
      maxDailyTime?: number
      preferredSubjects?: string[]
      learningStyle?: string
    }
  }): Promise<LearningPath> {
    const patterns = await this.analyzeLearningPatterns(userId, '90d')
    const user = await User.findById(userId)

    // 使用AI生成学习路径
    const aiPath = await this.generateAILearningPath(patterns, goals, user)

    // 优化路径基于用户历史
    const optimizedPath = await this.optimizeLearningPath(aiPath, patterns, user)

    return optimizedPath
  }

  private async calculatePatterns(sessions: any[], user: any) {
    return {
      timeDistribution: this.analyzeTimeDistribution(sessions),
      focusTrends: this.analyzeFocusTrends(sessions),
      efficiencyMetrics: await this.calculateEfficiencyMetrics(sessions, user),
      knowledgeGaps: await this.identifyKnowledgeGaps(user._id, sessions),
      learningVelocity: this.calculateLearningVelocity(sessions)
    }
  }

  private analyzeTimeDistribution(sessions: any[]): TimeDistribution {
    const distribution = {
      morning: 0, afternoon: 0, evening: 0, weekend: 0,
      peakHours: [] as string[]
    }

    const hourCounts: { [key: number]: number } = {}
    
    sessions.forEach(session => {
      const hour = session.startTime.getHours()
      const day = session.startTime.getDay()
      
      // 时间段分布
      if (hour >= 6 && hour < 12) distribution.morning++
      else if (hour >= 12 && hour < 18) distribution.afternoon++
      else if (hour >= 18 && hour < 24) distribution.evening++
      
      // 周末分布
      if (day === 0 || day === 6) distribution.weekend++
      
      // 小时计数
      hourCounts[hour] = (hourCounts[hour] || 0) + 1
    })

    // 找出峰值小时
    distribution.peakHours = Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => `${hour}:00-${parseInt(hour)+1}:00`)

    return distribution
  }

  private analyzeFocusTrends(sessions: any[]): FocusTrend[] {
    const dailyData: { [key: string]: any } = {}
    
    sessions.forEach(session => {
      const date = session.startTime.toISOString().split('T')[0]
      if (!dailyData[date]) {
        dailyData[date] = {
          totalFocus: 0,
          sessionCount: 0,
          totalDuration: 0
        }
      }
      
      dailyData[date].totalFocus += session.metrics.focusLevel || 0
      dailyData[date].sessionCount++
      dailyData[date].totalDuration += session.duration || 0
    })

    return Object.entries(dailyData).map(([date, data]) => ({
      date,
      averageFocus: Math.round(data.totalFocus / data.sessionCount),
      sessionCount: data.sessionCount,
      totalDuration: data.totalDuration
    })).sort((a, b) => a.date.localeCompare(b.date))
  }

  private async calculateEfficiencyMetrics(sessions: any[], user: any): Promise<EfficiencyMetrics> {
    const efficiencies = sessions.map(s => s.metrics.efficiency || 0).filter(e => e > 0)
    const averageEfficiency = efficiencies.length ? 
      efficiencies.reduce((a, b) => a + b, 0) / efficiencies.length : 0

    // 计算一致性（标准差）
    const variance = efficiencies.reduce((acc, eff) => acc + Math.pow(eff - averageEfficiency, 2), 0) / efficiencies.length
    const consistency = Math.max(0, 100 - Math.sqrt(variance))

    // 获取对比数据
    const comparison = await this.getEfficiencyComparison(user._id)

    return {
      averageEfficiency: Math.round(averageEfficiency),
      consistency: Math.round(consistency),
      improvementRate: this.calculateImprovementRate(efficiencies),
      comparison
    }
  }

  private async generateInsights(patterns: any, user: any, sessions: any[]): Promise<LearningInsight[]> {
    const insights: LearningInsight[] = []

    // 基于时间分布的洞察
    if (patterns.timeDistribution.evening > patterns.timeDistribution.morning * 2) {
      insights.push({
        type: 'opportunity',
        title: '早晨学习机会',
        description: '您主要在晚上学习，研究表明早晨学习效率更高',
        confidence: 0.8,
        actionable: true,
        priority: 'medium'
      })
    }

    // 基于专注度的洞察
    if (patterns.focusTrends.slice(-3).some(trend => trend.averageFocus < 60)) {
      insights.push({
        type: 'weakness',
        title: '专注度下降',
        description: '最近专注度有所下降，建议优化学习环境',
        confidence: 0.7,
        actionable: true,
        priority: 'high'
      })
    }

    // 基于效率的洞察
    if (patterns.efficiencyMetrics.averageEfficiency < 70) {
      insights.push({
        type: 'weakness',
        title: '学习效率待提升',
        description: '当前学习效率低于平台平均水平',
        confidence: 0.9,
        actionable: true,
        priority: 'high'
      })
    }

    // 使用AI生成更多洞察
    const aiInsights = await this.generateAIInsights(patterns, user, sessions)
    insights.push(...aiInsights)

    return insights.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  private async generateAIInsights(patterns: any, user: any, sessions: any[]): Promise<LearningInsight[]> {
    try {
      const prompt = this.buildInsightPrompt(patterns, user, sessions)
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `你是一个专业的学习分析师，需要基于用户的学习数据生成有价值的洞察。
            请用中文回复，提供具体、可操作的洞察建议。`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })

      return this.parseAIInsights(response.choices[0].message.content)
    } catch (error) {
      logger.error('AI洞察生成失败:', error)
      return []
    }
  }

  // 更多工具方法...
  private buildInsightPrompt(patterns: any, user: any, sessions: any[]): string {
    return `
用户学习数据分析：

基本信息：
- 学习风格：${user.profile.learningStyle}
- 偏好学科：${user.profile.preferredSubjects.join(', ')}
- 当前等级：${user.learningStats.level}

学习模式：
- 时间分布：早晨${patterns.timeDistribution.morning}次，下午${patterns.timeDistribution.afternoon}次，晚上${patterns.timeDistribution.evening}次
- 平均专注度：${patterns.focusTrends.slice(-1)[0]?.averageFocus || 0}%
- 学习效率：${patterns.efficiencyMetrics.averageEfficiency}%
- 知识缺口：${patterns.knowledgeGaps.length}个

请基于以上数据生成3-5个有价值的洞察，包括：
1. 优势发现
2. 改进机会
3. 个性化建议

请用专业的语气，提供具体、可操作的洞察。
    `.trim()
  }

  private parseAIInsights(content: string): LearningInsight[] {
    // 解析AI返回的洞察
    const insights: LearningInsight[] = []
    const lines = content.split('\n').filter(line => line.trim())
    
    lines.forEach(line => {
      if (line.includes('优势') || line.includes('优点')) {
        insights.push({
          type: 'strength',
          title: '学习优势',
          description: line.replace(/^[*-]\s*/, '').trim(),
          confidence: 0.8,
          actionable: false,
          priority: 'medium'
        })
      } else if (line.includes('改进') || line.includes('建议')) {
        insights.push({
          type: 'opportunity',
          title: '改进机会',
          description: line.replace(/^[*-]\s*/, '').trim(),
          confidence: 0.7,
          actionable: true,
          priority: 'high'
        })
      }
    })

    return insights
  }

  private async getSessionsInPeriod(userId: string, period: string) {
    const dateRange = this.getDateRange(period)
    return LearningSession.find({
      userId,
      startTime: { $gte: dateRange },
      status: { $in: ['completed', 'active'] }
    }).sort({ startTime: 1 })
  }

  private getDateRange(period: string): Date {
    const now = new Date()
    switch (period) {
      case '7d': return new Date(now.setDate(now.getDate() - 7))
      case '30d': return new Date(now.setDate(now.getDate() - 30))
      case '90d': return new Date(now.setDate(now.getDate() - 90))
      default: return new Date(0)
    }
  }

  // 其他工具方法实现...
  private calculateImprovementRate(efficiencies: number[]): number {
    if (efficiencies.length < 2) return 0
    
    const recent = efficiencies.slice(-7) // 最近7次
    const previous = efficiencies.slice(-14, -7) // 前7次
    
    if (previous.length === 0) return 0
    
    const avgRecent = recent.reduce((a, b) => a + b, 0) / recent.length
    const avgPrevious = previous.reduce((a, b) => a + b, 0) / previous.length
    
    return Math.round(((avgRecent - avgPrevious) / avgPrevious) * 100)
  }

  private async getEfficiencyComparison(userId: string) {
    // 这里应该从数据库获取对比数据
    return {
      peerAverage: 75,
      platformAverage: 80
    }
  }

  private isSuitableForEnergyLevel(rec: LearningRecommendation, energyLevel: number): boolean {
    const energyThresholds = {
      beginner: 30,
      intermediate: 50,
      advanced: 70
    }
    
    return energyLevel >= energyThresholds[rec.difficulty]
  }

  private isSuitableForTimeOfDay(rec: LearningRecommendation, currentTime: Date): boolean {
    const hour = currentTime.getHours()
    
    // 早晨适合专注学习，晚上适合轻松内容
    if (hour >= 6 && hour < 12) {
      return rec.type !== 'practice' // 早晨避免高强度练习
    } else if (hour >= 18 && hour < 24) {
      return rec.difficulty !== 'advanced' // 晚上避免高难度内容
    }
    
    return true
  }

  private async optimizeRecommendations(recommendations: LearningRecommendation[], context: any, user: any): Promise<LearningRecommendation[]> {
    // 简单的优化逻辑，实际应该使用更复杂的算法
    return recommendations.sort((a, b) => {
      // 基于紧急性和收益排序
      const urgencyWeight = { immediate: 3, soon: 2, long-term: 1 }
      const aScore = urgencyWeight[a.urgency] * a.estimatedBenefit
      const bScore = urgencyWeight[b.urgency] * b.estimatedBenefit
      
      return bScore - aScore
    })
  }

  private async predictCourseCompletion(userId: string, courseId: string, timeframe: string): Promise<LearningPrediction> {
    // 简化的预测逻辑
    return {
      metric: 'completionTime',
      currentValue: 0,
      predictedValue: 85,
      confidence: 0.8,
      timeframe: timeframe as any,
      factors: ['学习频率', '专注度', '课程难度']
    }
  }

  private async predictSkillImprovement(userId: string, skill: string, timeframe: string): Promise<LearningPrediction> {
    return {
      metric: 'skillLevel',
      currentValue: 60,
      predictedValue: 85,
      confidence: 0.7,
      timeframe: timeframe as any,
      factors: ['练习频率', '学习资源', '个人天赋']
    }
  }

  private async predictEfficiencyImprovement(patterns: any, timeframe: string): Promise<LearningPrediction> {
    return {
      metric: 'retentionRate',
      currentValue: patterns.efficiencyMetrics.averageEfficiency,
      predictedValue: Math.min(patterns.efficiencyMetrics.averageEfficiency + 15, 100),
      confidence: 0.6,
      timeframe: timeframe as any,
      factors: ['学习方法', '时间管理', '学习环境']
    }
  }

  private calculateLearningVelocity(sessions: any[]): number {
    if (sessions.length < 2) return 0
    
    const durations = sessions.map(s => s.duration || 0)
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length
    
    // 简化的学习速度计算
    return Math.round(avgDuration / 60) // 转换为小时
  }

  private async identifyKnowledgeGaps(userId: string, sessions: any[]): Promise<KnowledgeGap[]> {
    // 简化的知识缺口识别
    return [
      {
        subject: '数学',
        gapLevel: 'medium',
        relatedTopics: ['代数', '几何'],
        recommendedResources: ['数学基础课程', '代数练习册'],
        estimatedTimeToClose: 10
      }
    ]
  }
}

// 类型定义
interface LearningPath {
  userId: string
  goals: any
  steps: LearningPathStep[]
  estimatedDuration: number
  confidence: number
}

interface LearningPathStep {
  order: number
  type: 'course' | 'resource' | 'practice' | 'assessment'
  title: string
  description: string
  duration: number
  prerequisites: string[]
  resources: string[]
}

export const advancedLearningAnalytics = new AdvancedLearningAnalytics()