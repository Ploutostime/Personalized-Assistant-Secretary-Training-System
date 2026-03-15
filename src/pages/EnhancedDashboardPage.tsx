import React, { useState, lazy, Suspense } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  Brain, 
  Globe, 
  Users, 
  Zap,
  Star,
  Target,
  Clock
} from 'lucide-react'

// 延迟加载组件
const SmartLearningDashboard = lazy(() => import('@/components/Dashboard/SmartLearningDashboard').then(module => ({ default: module.SmartLearningDashboard })))
const Interactive3DCompanion = lazy(() => import('@/components/3DCompanion/Interactive3DCompanion').then(module => ({ default: module.Interactive3DCompanion })))
const SmartLearningAssistant = lazy(() => import('@/components/ai/SmartLearningAssistant').then(module => ({ default: module.SmartLearningAssistant })))
const LearningCommunity = lazy(() => import('@/components/social/LearningCommunity').then(module => ({ default: module.LearningCommunity })))

const EnhancedDashboardPage: React.FC = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-48 mb-2 bg-gray-200" />
            <Skeleton className="h-4 w-96 bg-gray-200" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24 bg-gray-200" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 bg-gray-200" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* 主标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-0">
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b">
          <div className="container mx-auto px-6">
            {/* 页面标题 */}
            <div className="py-4">
              <h1 className="text-3xl font-bold text-gray-900">智学秘伴 · 智能学习中心</h1>
              <p className="text-gray-600 mt-1">
                欢迎回来，{user?.username || '学习者'}！让我们一起开启高效学习之旅 🚀
              </p>
            </div>

            {/* 标签页导航 */}
            <TabsList className="grid w-full grid-cols-4 bg-transparent p-0">
              <TabsTrigger 
                value="dashboard" 
                className="flex items-center space-x-2 px-6 py-3 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-xl transition-all"
              >
                <TrendingUp className="w-4 h-4" />
                <span>智能仪表板</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="companion" 
                className="flex items-center space-x-2 px-6 py-3 data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-xl transition-all"
              >
                <Star className="w-4 h-4" />
                <span>3D学习伴侣</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="ai" 
                className="flex items-center space-x-2 px-6 py-3 data-[state=active]:bg-purple-500 data-[state=active]:text-white rounded-xl transition-all"
              >
                <Brain className="w-4 h-4" />
                <span>AI学习助手</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="community" 
                className="flex items-center space-x-2 px-6 py-3 data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-xl transition-all"
              >
                <Users className="w-4 h-4" />
                <span>学习社区</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* 标签页内容 */}
        <div className="container mx-auto px-6 py-6">
          {/* 智能仪表板标签页 */}
          <TabsContent value="dashboard" className="m-0 space-y-6">
            <Suspense fallback={
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">加载智能学习仪表板...</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            }>
              <SmartLearningDashboard />
            </Suspense>
          </TabsContent>

          {/* 3D学习伴侣标签页 */}
          <TabsContent value="companion" className="m-0">
            <Suspense fallback={
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">加载3D学习伴侣...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            }>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-6 h-6" />
                    <span>智能3D学习伴侣</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-96">
                    <Interactive3DCompanion />
                  </div>
                </CardContent>
              </div>
            </Suspense>
          </TabsContent>

          {/* AI学习助手标签页 */}
          <TabsContent value="ai" className="m-0">
            <Suspense fallback={
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">加载AI学习助手...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            }>
              <div className="bg-white rounded-2xl shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="w-6 h-6" />
                    <span>AI智能学习助手</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <SmartLearningAssistant />
                </CardContent>
              </div>
            </Suspense>
          </TabsContent>

          {/* 学习社区标签页 */}
          <TabsContent value="community" className="m-0">
            <Suspense fallback={
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">加载学习社区...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            }>
              <div className="bg-white rounded-2xl shadow-lg">
                <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-6 h-6" />
                    <span>智能学习社区</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <LearningCommunity />
                </CardContent>
              </div>
            </Suspense>
          </TabsContent>
        </div>
      </Tabs>

      {/* 快速操作浮动按钮 */}
      <div className="fixed bottom-6 right-6 space-y-3">
        <button className="w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all flex items-center justify-center">
          <Zap size={20} />
        </button>
        <button className="w-12 h-12 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all flex items-center justify-center">
          <Target size={20} />
        </button>
      </div>
    </div>
  )
}

export default EnhancedDashboardPage