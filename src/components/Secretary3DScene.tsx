import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// 3D角色组件
function Character3D({ avatarType, isTalking }: { avatarType: string; isTalking: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);

  // 根据形象类型设置颜色和特征
  const getCharacterStyle = () => {
    const styles: Record<string, { color: string; accent: string; animation: string }> = {
      // 经典系列
      loli: { color: '#FFB6C1', accent: '#FF69B4', animation: 'bounce' },
      oneesan: { color: '#DDA0DD', accent: '#BA55D3', animation: 'elegant' },
      uncle: { color: '#4682B4', accent: '#1E90FF', animation: 'steady' },
      boss: { color: '#2F4F4F', accent: '#696969', animation: 'commanding' },
      senior_sister: { color: '#87CEEB', accent: '#4682B4', animation: 'friendly' },
      senior_brother: { color: '#FFA500', accent: '#FF8C00', animation: 'supportive' },
      
      // 奇幻系列
      elf_queen: { color: '#98FB98', accent: '#00FA9A', animation: 'floating' },
      imperial_knight: { color: '#C0C0C0', accent: '#FFD700', animation: 'vigilant' },
      slime_girl: { color: '#87CEEB', accent: '#00BFFF', animation: 'jiggle' },
      werewolf_girl: { color: '#8B4513', accent: '#D2691E', animation: 'alert' },
      
      // 古风系列
      imperial_consort: { color: '#FFE4E1', accent: '#FFB6C1', animation: 'graceful' },
      empress: { color: '#FFD700', accent: '#FFA500', animation: 'regal' },
      regent_prince: { color: '#2F4F4F', accent: '#4169E1', animation: 'strategic' },
      jiangnan_girl: { color: '#E0FFFF', accent: '#B0E0E6', animation: 'gentle' },
      
      // 现代系列
      neighbor_sister: { color: '#FFC0CB', accent: '#FF69B4', animation: 'casual' },
    };
    return styles[avatarType] || styles.oneesan;
  };

  const style = getCharacterStyle();

  // 动画效果 - 根据形象类型和状态
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (meshRef.current && headRef.current) {
      // 基础呼吸动画
      const breathe = Math.sin(time * 2) * 0.02;
      meshRef.current.scale.y = 1 + breathe;
      
      // 根据形象类型的特殊动画
      switch (style.animation) {
        case 'bounce': // 萝莉 - 活泼跳跃
          meshRef.current.position.y = Math.abs(Math.sin(time * 3)) * 0.1;
          break;
        case 'elegant': // 御姐 - 优雅摇摆
          meshRef.current.rotation.y = Math.sin(time * 0.5) * 0.03;
          break;
        case 'floating': // 精灵女王 - 漂浮
          meshRef.current.position.y = Math.sin(time * 1.5) * 0.15;
          headRef.current.rotation.z = Math.sin(time * 0.8) * 0.05;
          break;
        case 'jiggle': // 史莱姆娘 - Q弹抖动
          meshRef.current.scale.x = 1 + Math.sin(time * 4) * 0.05;
          meshRef.current.scale.z = 1 + Math.cos(time * 4) * 0.05;
          break;
        case 'alert': // 狼人少女 - 警觉
          headRef.current.rotation.y = Math.sin(time * 2) * 0.15;
          break;
        case 'graceful': // 贵妃 - 温婉
          meshRef.current.rotation.y = Math.sin(time * 0.6) * 0.04;
          headRef.current.rotation.x = Math.sin(time * 0.8) * 0.02;
          break;
        case 'regal': // 皇后 - 威严
          headRef.current.rotation.x = Math.sin(time * 0.3) * 0.01;
          break;
        case 'vigilant': // 骑士 - 警戒
          headRef.current.rotation.y = Math.sin(time * 1.5) * 0.1;
          break;
        default:
          // 默认待机动画
          meshRef.current.rotation.y = Math.sin(time * 0.5) * 0.05;
      }
      
      // 说话时的额外动画
      if (isTalking) {
        headRef.current.rotation.x = Math.sin(time * 8) * 0.05;
        meshRef.current.scale.y = 1 + Math.abs(Math.sin(time * 6)) * 0.03;
      }
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <capsuleGeometry args={[0.3, 1, 16, 32]} />
        <meshStandardMaterial 
          color={style.color} 
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>
      
      <mesh ref={headRef} position={[0, 1, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial 
          color={style.color}
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>
      
      <mesh position={[-0.12, 1.1, 0.3]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      <mesh position={[0.12, 1.1, 0.3]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {isTalking ? (
        <mesh position={[0, 0.9, 0.32]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#FF6B6B" />
        </mesh>
      ) : null}
      
      <mesh position={[-0.4, 0.3, 0]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.08, 0.6, 8, 16]} />
        <meshStandardMaterial color={style.accent} />
      </mesh>
      
      <mesh position={[0.4, 0.3, 0]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.08, 0.6, 8, 16]} />
        <meshStandardMaterial color={style.accent} />
      </mesh>
      
      <mesh position={[-0.15, -0.8, 0]}>
        <capsuleGeometry args={[0.1, 0.8, 8, 16]} />
        <meshStandardMaterial color={style.accent} />
      </mesh>
      
      <mesh position={[0.15, -0.8, 0]}>
        <capsuleGeometry args={[0.1, 0.8, 8, 16]} />
        <meshStandardMaterial color={style.accent} />
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
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
        <pointLight position={[-5, 5, -5]} intensity={0.8} />
        <hemisphereLight args={['#ffffff', '#60a5fa', 0.5]} />
        <Character3D avatarType={avatarType} isTalking={isTalking} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>
      </Canvas>
    </div>
  );
}
