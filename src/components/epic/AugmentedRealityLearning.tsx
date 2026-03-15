import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Camera, 
  Video, 
  MapPin, 
  Compass, 
  Search, 
  Zap, 
  Star, 
  BookOpen,
  Target,
  Users,
  Share,
  Download,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface ARMarker {
  id: string;
  name: string;
  type: 'historical' | 'scientific' | 'mathematical' | 'literary' | 'artistic';
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  description: string;
  content: {
    type: '3d-model' | 'video' | 'image' | 'text' | 'quiz';
    url: string;
    title: string;
  };
  difficulty: number;
  discovered: boolean;
  rating: number;
}

interface ARSession {
  id: string;
  markers: ARMarker[];
  startTime: Date;
  endTime?: Date;
  discoveries: number;
  experienceGained: number;
}

export function AugmentedRealityLearning() {
  const [currentSession, setCurrentSession] = useState<ARSession | null>(null);
  const [nearbyMarkers, setNearbyMarkers] = useState<ARMarker[]>([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<ARMarker | null>(null);
  const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 模拟AR标记数据
  const allMarkers: ARMarker[] = [
    {
      id: '1',
      name: '古代建筑几何',
      type: 'mathematical',
      location: {
        latitude: 39.9042,
        longitude: 116.4074,
        address: '北京市中心'
      },
      description: '探索古代建筑中的几何原理',
      content: {
        type: '3d-model',
        url: '/ar/models/ancient-architecture.glb',
        title: '建筑几何分析'
      },
      difficulty: 3,
      discovered: false,
      rating: 4.8
    },
    {
      id: '2',
      name: '植物光合作用',
      type: 'scientific',
      location: {
        latitude: 39.9042,
        longitude: 116.4074,
        address: '城市公园'
      },
      description: '通过AR观察植物光合作用过程',
      content: {
        type: 'video',
        url: '/ar/videos/photosynthesis.mp4',
        title: '光合作用演示'
      },
      difficulty: 2,
      discovered: true,
      rating: 4.5
    },
    {
      id: '3',
      name: '历史事件重现',
      type: 'historical',
      location: {
        latitude: 39.9042,
        longitude: 116.4074,
        address: '历史博物馆'
      },
      description: '见证重要历史事件的AR重现',
      content: {
        type: '3d-model',
        url: '/ar/models/historical-event.glb',
        title: '历史场景重建'
      },
      difficulty: 4,
      discovered: false,
      rating: 4.9
    }
  ];

  // 初始化用户位置（模拟）
  useEffect(() => {
    // 模拟获取用户位置
    setUserLocation({
      latitude: 39.9042,
      longitude: 116.4074
    });

    // 计算附近的标记
    const nearby = allMarkers.filter(marker => 
      calculateDistance(
        userLocation?.latitude || 39.9042,
        userLocation?.longitude || 116.4074,
        marker.location.latitude,
        marker.location.longitude
      ) < 10 // 10公里范围内
    );
    
    setNearbyMarkers(nearby);
  }, [userLocation]);

  // 计算距离（简化版）
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    // 简化计算，实际应该使用Haversine公式
    return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2)) * 111; // 大致公里数
  };

  // 开始AR会话
  const startARSession = () => {
    const newSession: ARSession = {
      id: Date.now().toString(),
      markers: nearbyMarkers,
      startTime: new Date(),
      discoveries: 0,
      experienceGained: 0
    };
    
    setCurrentSession(newSession);
    setCameraActive(true);
    
    // 请求摄像头权限（模拟）
    if (videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error('摄像头访问失败:', err);
        });
    }
  };

  // 结束AR会话
  const endARSession = () => {
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        endTime: new Date()
      });
      setCameraActive(false);
      
      // 停止摄像头
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  // 发现标记
  const discoverMarker = (marker: ARMarker) => {
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        discoveries: currentSession.discoveries + 1,
        experienceGained: currentSession.experienceGained + marker.difficulty * 10
      });
      
      setSelectedMarker(marker);
      
      // 更新标记状态
      setNearbyMarkers(prev => prev.map(m => 
        m.id === marker.id ? { ...m, discovered: true } : m
      ));
    }
  };

  // 获取标记类型图标
  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'historical': return '🏛️';
      case 'scientific': return '🔬';
      case 'mathematical': return '📐';
      case 'literary': return '📖';
      case 'artistic': return '🎨';
      default: return '📍';
    }
  };

  // 获取难度颜色
  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-blue-100 text-blue-800';
      case 3: return 'bg-yellow-100 text-yellow-800';
      case 4: return 'bg-orange-100 text-orange-800';
      case 5: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* AR控制面板 */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">增强现实学习</h2>
              <p className="text-gray-600">将学习内容叠加到现实世界中，创造沉浸式学习体验</p>
            </div>
            
            <div className="flex gap-3">
              {!cameraActive ? (
                <Button onClick={startARSession} className="bg-gradient-to-r from-blue-600 to-cyan-600">
                  <Camera className="w-4 h-4 mr-2" />
                  开始AR探索
                </Button>
              ) : (
                <Button onClick={endARSession} variant="outline">
                  <Pause className="w-4 h-4 mr-2" />
                  结束会话
                </Button>
              )}
              
              <Button variant="outline">
                <Compass className="w-4 h-4 mr-2" />
                扫描附近
              </Button>
            </div>
          </div>
          
          {/* 会话状态 */}
          {currentSession && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">{currentSession.discoveries}</div>
                <div className="text-sm text-gray-600">已发现标记</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-green-600">{currentSession.experienceGained}</div>
                <div className="text-sm text-gray-600">经验值获得</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-purple-600">
                  {currentSession.startTime.toLocaleTimeString('zh-CN')}
                </div>
                <div className="text-sm text-gray-600">开始时间</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AR摄像头视图 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5 text-red-600" />
                AR摄像头视图
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative">
                {cameraActive ? (
                  <div className="aspect-video bg-black relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    
                    {/* AR叠加层 */}
                    <div className="absolute inset-0">
                      {/* 模拟AR标记 */}
                      {nearbyMarkers.map((marker, index) => (
                        <div
                          key={marker.id}
                          className="absolute cursor-pointer transform hover:scale-110 transition-transform"
                          style={{
                            top: `${20 + index * 25}%`,
                            left: `${30 + index * 10}%`
                          }}
                          onClick={() => discoverMarker(marker)}
                        >
                          <div className={`p-3 rounded-full ${
                            marker.discovered ? 'bg-green-500' : 'bg-yellow-500'
                          } text-white shadow-lg`}>
                            <span className="text-2xl">{getMarkerIcon(marker.type)}</span>
                          </div>
                          <div className="text-white text-sm font-bold mt-1 text-center bg-black bg-opacity-50 rounded px-2 py-1">
                            {marker.name}
                          </div>
                        </div>
                      ))}
                      
                      {/* 指南针和状态信息 */}
                      <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded">
                        <div className="flex items-center gap-2">
                          <Compass className="w-4 h-4" />
                          <span>附近有 {nearbyMarkers.length} 个学习标记</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">点击"开始AR探索"激活摄像头</p>
                      <p className="text-sm text-gray-500 mt-2">探索现实世界中的学习内容</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* 摄像头控制 */}
              <div className="p-4 border-t flex justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <RotateCcw className="w-4 h-4 mr-1" />
                    切换摄像头
                  </Button>
                  <Button variant="outline" size="sm">
                    <Zap className="w-4 h-4 mr-1" />
                    闪光灯
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Share className="w-4 h-4 mr-1" />
                    分享
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    截图
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 标记列表和详情 */}
        <div className="space-y-6">
          {/* 附近标记 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-600" />
                附近学习标记
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {nearbyMarkers.map((marker) => (
                    <Card 
                      key={marker.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        marker.discovered ? 'border-green-200 bg-green-50' : ''
                      }`}
                      onClick={() => setSelectedMarker(marker)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{getMarkerIcon(marker.type)}</span>
                            <span className="font-semibold">{marker.name}</span>
                          </div>
                          {marker.discovered && (
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              已发现
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{marker.description}</p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <Badge className={getDifficultyColor(marker.difficulty)}>
                            难度 {marker.difficulty}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span>{marker.rating}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* 标记详情 */}
          {selectedMarker && (
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{getMarkerIcon(selectedMarker.type)}</span>
                  {selectedMarker.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700">描述</h4>
                    <p className="text-sm text-gray-600">{selectedMarker.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700">位置</h4>
                    <p className="text-sm text-gray-600">{selectedMarker.location.address}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700">学习内容</h4>
                    <div className="p-2 bg-white rounded border">
                      <div className="flex items-center gap-2">
                        {selectedMarker.content.type === '3d-model' && '🗿'}
                        {selectedMarker.content.type === 'video' && '🎥'}
                        {selectedMarker.content.type === 'image' && '🖼️'}
                        {selectedMarker.content.type === 'text' && '📄'}
                        {selectedMarker.content.type === 'quiz' && '❓'}
                        <span className="font-medium">{selectedMarker.content.title}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    <Play className="w-4 h-4 mr-2" />
                    开始学习
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 快速操作 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-600" />
                快速操作
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4 mr-1" />
                  扫描新区域
                </Button>
                <Button variant="outline" size="sm">
                  <Users className="w-4 h-4 mr-1" />
                  组队探索
                </Button>
                <Button variant="outline" size="sm">
                  <BookOpen className="w-4 h-4 mr-1" />
                  学习记录
                </Button>
                <Button variant="outline" size="sm">
                  <Target className="w-4 h-4 mr-1" />
                  成就查看
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}