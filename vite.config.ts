import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

import { miaodaDevPlugin } from "miaoda-sc-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    svgr({
      svgrOptions: {
        icon: true, 
        exportType: 'named', 
        namedExport: 'ReactComponent', 
      }, 
    }), 
    miaodaDevPlugin()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // 代码分割优化
    rollupOptions: {
      output: {
        manualChunks: {
          // React 核心库
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI 组件库
          'ui-vendor': ['lucide-react', 'date-fns'],
          // 3D 渲染库（最大的依赖）
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          // Supabase
          'supabase-vendor': ['@supabase/supabase-js'],
        },
      },
    },
    // 提高 chunk 大小警告阈值（3D 库较大）
    chunkSizeWarningLimit: 1000,
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 压缩选项
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 生产环境移除 console
        drop_debugger: true,
      },
    },
  },
  // 开发服务器优化
  server: {
    // 预构建优化
    warmup: {
      clientFiles: [
        './src/App.tsx',
        './src/pages/LoginPage.tsx',
        './src/pages/DashboardPage.tsx',
      ],
    },
  },
  // 依赖优化
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      'lucide-react',
      'date-fns',
    ],
    // 排除 3D 库，按需加载
    exclude: ['three', '@react-three/fiber', '@react-three/drei'],
  },
});
