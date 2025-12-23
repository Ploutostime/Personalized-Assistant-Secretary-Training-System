import { extend } from '@react-three/fiber';
import * as THREE from 'three';

// 扩展Three.js元素到JSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      sphereGeometry: any;
      capsuleGeometry: any;
      planeGeometry: any;
      meshStandardMaterial: any;
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
      hemisphereLight: any;
    }
  }
}

export {};
