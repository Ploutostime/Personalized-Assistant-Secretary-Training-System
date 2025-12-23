// @ts-nocheck
import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';

// 3D角色组件
function Character3D({ avatarType, istalking }: { avatarType: string; istalking: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hue, setHue] = useState(0);

  // 根据形象类型设置颜色
  const getColor = () => {
    const colors: Record<string, string> = {
      loli: '#FFB6C1',      // 粉色
      oneesan: '#DDA0DD',   // 紫色
      uncle: '#4682B4',     // 钢蓝色
      boss: '#2F4F4F',      // 深灰色
      senior_sister: '#87CEEB', // 天蓝色
      senior_brother: '#FFA500', // 橙色
    };
    return colors[avatarType] || colors.oneesan;
  };

  // 动画效果
  useFrame((state) => {
    if (meshRef.current) {
      // 呼吸动画
      const breathe = Math.sin(state.clock.elapsedTime * 2) * 0.02;
      meshRef.current.scale.y = 1 + breathe;
      
      // 说话时的动画
      if (istalking) {
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 5) * 0.1;
      } else {
        // 待机动画 - 轻微摇摆
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      }
    }
  });

  return (
    <group>
      {/* 身体 */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <capsuleGeometry args={[0.3, 1, 16, 32]} />
        <meshStandardMaterial color={getColor()} />
      </mesh>
      
      {/* 头部 */}
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color={getColor()} />
      </mesh>
      
      {/* 眼睛 */}
      <mesh position={[-0.12, 1.1, 0.3]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.12, 1.1, 0.3]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* 嘴巴 - 说话时会动 */}
      {istalking && (
        <mesh position={[0, 0.9, 0.32]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#FF6B6B" />
        </mesh>
      )}
      
      {/* 手臂 */}
      <mesh position={[-0.4, 0.3, 0]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.08, 0.6, 8, 16]} />
        <meshStandardMaterial color={getColor()} />
      </mesh>
      <mesh position={[0.4, 0.3, 0]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.08, 0.6, 8, 16]} />
        <meshStandardMaterial color={getColor()} />
      </mesh>
      
      {/* 腿 */}
      <mesh position={[-0.15, -0.8, 0]}>
        <capsuleGeometry args={[0.1, 0.8, 8, 16]} />
        <meshStandardMaterial color={getColor()} />
      </mesh>
      <mesh position={[0.15, -0.8, 0]}>
        <capsuleGeometry args={[0.1, 0.8, 8, 16]} />
        <meshStandardMaterial color={getColor()} />
      </mesh>
    </group>
  );
}

// 3D场景组件
export default function Secretary3DScene({ 
  avatarType = 'oneesan',
  isTalking = false,
  className = ''
}: { 
  avatarType?: string;
  isTalking?: boolean;
  className?: string;
}) {
  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0.5, 3]} />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
        />
        
        {/* 灯光 */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, 5, -5]} intensity={0.5} />
        
        {/* 3D角色 */}
        <Character3D avatarType={avatarType} istalking={isTalking} />
        
        {/* 环境 */}
        <Environment preset="sunset" />
        
        {/* 地面 */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>
      </Canvas>
    </div>
  );
}
