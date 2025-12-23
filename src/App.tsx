import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import MainLayout from './components/layouts/MainLayout';
import LoadingFallback from './components/LoadingFallback';

import { AuthProvider } from '@/contexts/AuthContext';
import { RouteGuard } from '@/components/common/RouteGuard';
import { Toaster } from '@/components/ui/sonner';

// 延迟加载页面组件
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const TasksPage = lazy(() => import('./pages/TasksPage'));
const SchedulePage = lazy(() => import('./pages/SchedulePage'));
const KnowledgePage = lazy(() => import('./pages/KnowledgePage'));
const StatisticsPage = lazy(() => import('./pages/StatisticsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const VideoTerminalPage = lazy(() => import('./pages/VideoTerminalPage'));

// 延迟加载2D浮窗秘书
const SecretaryFloatingWidget = lazy(() => import('./components/SecretaryFloatingWidget').then(module => ({ default: module.SecretaryFloatingWidget })));

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <RouteGuard>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<MainLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="tasks" element={<TasksPage />} />
                <Route path="schedule" element={<SchedulePage />} />
                <Route path="knowledge" element={<KnowledgePage />} />
                <Route path="video-terminal" element={<VideoTerminalPage />} />
                <Route path="statistics" element={<StatisticsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="admin" element={<AdminPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </RouteGuard>
        <Toaster />
        <Suspense fallback={null}>
          <SecretaryFloatingWidget />
        </Suspense>
      </AuthProvider>
    </Router>
  );
};

export default App;
