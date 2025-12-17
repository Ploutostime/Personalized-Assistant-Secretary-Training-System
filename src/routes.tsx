import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import SchedulePage from './pages/SchedulePage';
import KnowledgePage from './pages/KnowledgePage';
import StatisticsPage from './pages/StatisticsPage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';
import MainLayout from './components/layouts/MainLayout';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Login',
    path: '/login',
    element: <LoginPage />,
    visible: false,
  },
  {
    name: 'Main',
    path: '/',
    element: <MainLayout />,
    visible: false,
  },
  {
    name: 'Dashboard',
    path: '/',
    element: <DashboardPage />,
  },
  {
    name: 'Tasks',
    path: '/tasks',
    element: <TasksPage />,
  },
  {
    name: 'Schedule',
    path: '/schedule',
    element: <SchedulePage />,
  },
  {
    name: 'Knowledge',
    path: '/knowledge',
    element: <KnowledgePage />,
  },
  {
    name: 'Statistics',
    path: '/statistics',
    element: <StatisticsPage />,
  },
  {
    name: 'Settings',
    path: '/settings',
    element: <SettingsPage />,
  },
  {
    name: 'Admin',
    path: '/admin',
    element: <AdminPage />,
    visible: false,
  },
];

export default routes;
