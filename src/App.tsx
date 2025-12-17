import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import SchedulePage from './pages/SchedulePage';
import KnowledgePage from './pages/KnowledgePage';
import StatisticsPage from './pages/StatisticsPage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';
import MainLayout from './components/layouts/MainLayout';

import { AuthProvider } from '@/contexts/AuthContext';
import { RouteGuard } from '@/components/common/RouteGuard';
import { Toaster } from '@/components/ui/sonner';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <RouteGuard>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<MainLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="schedule" element={<SchedulePage />} />
              <Route path="knowledge" element={<KnowledgePage />} />
              <Route path="statistics" element={<StatisticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="admin" element={<AdminPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </RouteGuard>
        <Toaster />
      </AuthProvider>
    </Router>
  );
};

export default App;
