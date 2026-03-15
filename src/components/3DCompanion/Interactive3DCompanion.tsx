import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { 
  Heart, 
  MessageCircle, 
  Zap, 
  Star,
  Volume2,
  VolumeX,
  Settings,
  Maximize2,
  Minimize2
} from 'lucide-react'

interface Companion3DState {
  model: THREE.Object3D | null
  animations: THREE.AnimationClip[]
  currentAnimation: string
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  scale: number
  outfit: string
  mood: 'happy' | 'neutral' | 'sad' | 'excited' | 'focused'
  energy: number
  bondLevel: number
}

interface InteractionHistory {
  type: string
  data?: any
  timestamp: Date
  mood: string
}

const Interactive3DCompanion: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [companionState, setCompanionState] = useState<Companion3DState>({
    model: null,
    animations: [],
    currentAnimation: 'idle',
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 1,
    outfit: 'default',
    mood: 'happy',
    energy: 100,
    bondLevel: 5
  })
  
  const [interactionHistory, setInteractionHistory] = useState<InteractionHistory[]>([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)

  // Three.js 场景初始化
  useEffect(() => {
    if (!canvasRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    })

    // 高级渲染设置
    renderer.setSize(600, 500)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0

    // 相机设置
    camera.position.set(0, 2, 5)
    camera.lookAt(0, 1, 0)

    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    // 方向光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
    directionalLight.position.set(5, 10, 5)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // 点光源（跟随伴侣）
    const pointLight = new THREE.PointLight(0x3498db, 0.8, 10)
    pointLight.position.set(0, 2, 0)
    scene.add(pointLight)

    // 后期处理
    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(600, 500),
      1.2, // 强度
      0.4, // 半径
      0.85 // 阈值
    )
    composer.addPass(bloomPass)

    // 控制器
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = true
    controls.enablePan = true
    controls.minDistance = 2
    controls.maxDistance = 10

    // 加载3D伴侣模型
    loadCompanionModel(scene)

    // 动画循环
    const clock = new THREE.Clock()
    const animate = () => {
      requestAnimationFrame(animate)
      
      const delta = clock.getDelta()
      controls.update()
      updateCompanionAnimation(scene, delta)
      updateLighting(scene, companionState.mood)
      
      composer.render()
    }
    animate()

    // 响应式处理
    const handleResize = () => {
      const container = canvasRef.current?.parentElement
      if (container) {
        const width = container.clientWidth
        const height = container.clientHeight
        renderer.setSize(width, height)
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        composer.setSize(width, height)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    // 点击交互
    const handleClick = (event: MouseEvent) => {
      const mouse = new THREE.Vector2()
      const rect = canvasRef.current?.getBoundingClientRect()
      
      if (rect) {
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

        const raycaster = new THREE.Raycaster()
        raycaster.setFromCamera(mouse, camera)

        const companionMesh = scene.children.find(child => 
          child.userData?.type === 'companion'
        )
        
        if (companionMesh) {
          const intersects = raycaster.intersectObject(companionMesh)
          if (intersects.length > 0) {
            handleCompanionInteraction('pet')
          }
        }
      }
    }

    canvasRef.current?.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('resize', handleResize)
      canvasRef.current?.removeEventListener('click', handleClick)
      renderer.dispose()
    }
  }, [])

  // 加载伴侣模型
  const loadCompanionModel = async (scene: THREE.Scene) => {
    const loader = new GLTFLoader()
    
    try {
      // 使用简单的几何体作为占位符（实际项目中应该加载真实模型）
      const geometry = new THREE.SphereGeometry(1, 32, 32)
      const material = new THREE.MeshStandardMaterial({ 
        color: 0x3498db,
        emissive: 0x1a5276,
        emissiveIntensity: 0.3
      })

      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(0, 1, 0)
      mesh.castShadow = true
      mesh.receiveShadow = true
      mesh.userData = { type: 'companion' }

      scene.add(mesh)
      
      setCompanionState(prev => ({ ...prev, model: mesh }))
    } catch (error) {
      console.error('加载伴侣模型失败:', error)
    }
  }

  // 更新伴侣动画
  const updateCompanionAnimation = (scene: THREE.Scene, delta: number) => {
    const companionMesh = scene.children.find(child => 
      child.userData?.type === 'companion'
    )
    
    if (companionMesh) {
      // 根据心情状态更新动画
      switch (companionState.mood) {
        case 'happy':
          companionMesh.rotation.y += delta * 0.5
          companionMesh.position.y = 1 + Math.sin(Date.now() * 0.002) * 0.1
          break
        case 'excited':
          companionMesh.rotation.y += delta * 2
          companionMesh.scale.setScalar(1 + Math.sin(Date.now() * 0.005) * 0.1)
          break
        case 'focused':
          companionMesh.rotation.y = 0
          companionMesh.position.y = 1
          break
        case 'sad':
          companionMesh.rotation.y += delta * 0.1
          companionMesh.position.y = 0.9
          break
        default:
          companionMesh.rotation.y += delta
          break
      }
    }
  }

  // 更新光照效果
  const updateLighting = (scene: THREE.Scene, mood: string) => {
    const pointLight = scene.children.find(child => 
      child instanceof THREE.PointLight
    ) as THREE.PointLight
    
    if (pointLight) {
      // 根据心情改变光照颜色
      switch (mood) {
        case 'happy':
          pointLight.color.set(0x2ecc71) // 绿色
          pointLight.intensity = 1.0
          break
        case 'excited':
          pointLight.color.set(0xf39c12) // 橙色
          pointLight.intensity = 1.5
          break
        case 'focused':
          pointLight.color.set(0x3498db) // 蓝色
          pointLight.intensity = 0.8
          break
        case 'sad':
          pointLight.color.set(0x95a5a6) // 灰色
          pointLight.intensity = 0.5
          break
        default:
          pointLight.color.set(0x3498db)
          pointLight.intensity = 0.8
          break
      }
    }
  }

  // 交互处理
  const handleInteraction = (type: string, data?: any) => {
    const interaction = {
      type,
      data,
      timestamp: new Date(),
      mood: companionState.mood
    }
    
    setInteractionHistory(prev => [...prev.slice(-9), interaction])
    
    // 根据交互类型更新状态
    switch (type) {
      case 'pet':
        setCompanionState(prev => ({ 
          ...prev, 
          mood: 'happy',
          bondLevel: Math.min(prev.bondLevel + 0.1, 10)
        }))
        break
      case 'speak':
        setIsSpeaking(true)
        setTimeout(() => setIsSpeaking(false), 3000)
        break
      case 'feed':
        setCompanionState(prev => ({ 
          ...prev, 
          energy: Math.min(prev.energy + 20, 100)
        }))
        break
    }
  }

  // 处理伴侣交互
  const handleCompanionInteraction = (type: string) => {
    handleInteraction(type)
    
    // 播放交互音效
    if (!isMuted) {
      // 这里可以添加音效播放逻辑
    }
  }

  // 语音合成
  const speak = (text: string) => {
    if ('speechSynthesis' in window && !isMuted) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'zh-CN'
      utterance.rate = 0.9
      utterance.pitch = 1.1
      utterance.volume = 0.8
      
      speechSynthesis.speak(utterance)
      setIsSpeaking(true)
      
      utterance.onend = () => setIsSpeaking(false)
    }
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-blue-900 rounded-2xl overflow-hidden">
      {/* 3D画布 */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full cursor-pointer"
      />
      
      {/* 控制面板 */}
      {showControls && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 right-4 bg-black/50 backdrop-blur-lg rounded-2xl p-4 space-y-4"
        >
          {/* 状态指示器 */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-white">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-sm">亲密度: {Math.round(companionState.bondLevel * 10)}%</span>
            </div>
            <div className="flex items-center space-x-2 text-white">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">能量: {companionState.energy}%</span>
            </div>
            <div className="flex items-center space-x-2 text-white">
              <Star className="w-4 h-4 text-blue-400" />
              <span className="text-sm">心情: {getMoodText(companionState.mood)}</span>
            </div>
          </div>

          {/* 交互按钮 */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleCompanionInteraction('pet')}
              className="p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 flex items-center justify-center"
            >
              <Heart size={16} />
            </button>
            <button
              onClick={() => {
                handleCompanionInteraction('speak')
                speak('你好！我是你的学习伴侣，让我们一起探索知识的海洋吧！')
              }}
              className="p-2 bg-green-600 rounded-lg text-white hover:bg-green-700 flex items-center justify-center"
            >
              <MessageCircle size={16} />
            </button>
          </div>

          {/* 控制按钮 */}
          <div className="flex space-x-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600"
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button
              onClick={() => setShowControls(false)}
              className="p-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600"
            >
              <Settings size={16} />
            </button>
          </div>
        </motion.div>
      )}

      {/* 交互历史 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-lg rounded-2xl p-4 max-w-xs"
      >
        <h4 className="text-white text-sm font-medium mb-2">最近互动</h4>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {interactionHistory.slice(-3).map((interaction, index) => (
            <div key={index} className="text-white/80 text-xs">
              {formatInteraction(interaction)}
            </div>
          ))}
        </div>
      </motion.div>

      {/* 语音指示器 */}
      <AnimatePresence>
        {isSpeaking && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <div className="animate-pulse bg-blue-500/20 rounded-full p-8">
              <MessageCircle className="w-16 h-16 text-blue-400" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 隐藏的控制按钮 */}
      {!showControls && (
        <button
          onClick={() => setShowControls(true)}
          className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-lg rounded-lg text-white"
        >
          <Settings size={16} />
        </button>
      )}
    </div>
  )
}

// 工具函数
const getMoodText = (mood: string): string => {
  switch (mood) {
    case 'happy': return '开心'
    case 'excited': return '兴奋'
    case 'focused': return '专注'
    case 'sad': return '低落'
    default: return '平静'
  }
}

const formatInteraction = (interaction: InteractionHistory): string => {
  const time = interaction.timestamp.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
  
  switch (interaction.type) {
    case 'pet': return `${time} 抚摸伴侣`
    case 'speak': return `${time} 对话交流`
    case 'feed': return `${time} 喂食互动`
    default: return `${time} 未知互动`
  }
}

export default Interactive3DCompanion