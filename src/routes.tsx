import { lazy } from 'react';
import type { ReactNode } from 'react';

// 立即加载的关键组件
import LoginPage from './pages/LoginPage';
import MainLayout from './components/layouts/MainLayout';

// 延迟加载的页面组件
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const TasksPage = lazy(() => import('./pages/TasksPage'));
const SchedulePage = lazy(() => import('./pages/SchedulePage'));
const KnowledgePage = lazy(() => import('./pages/KnowledgePage'));
const StatisticsPage = lazy(() => import('./pages/StatisticsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const FunLearningPage = lazy(() => import('./pages/FunLearningPage'));
const EntrepreneurshipPage = lazy(() => import('./pages/EntrepreneurshipPage'));
const SecretaryPage = lazy(() => import('./pages/SecretaryPage'));

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
    name: 'Secretary',
    path: '/secretary',
    element: <SecretaryPage />,
  },
  {
    name: 'FunLearning',
    path: '/fun-learning',
    element: <FunLearningPage />,
  },
  {
    name: 'Entrepreneurship',
    path: '/entrepreneurship',
    element: <EntrepreneurshipPage />,
  },
  {
    name: 'Admin',
    path: '/admin',
    element: <AdminPage />,
    visible: false,
  },
];

export default routes;
