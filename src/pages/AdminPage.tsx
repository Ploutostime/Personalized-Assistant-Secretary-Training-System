import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Users, 
  BarChart3, 
  Settings,
  UserCog,
  Database,
  Activity,
  TrendingUp
} from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { getAllUsers, getSystemStats, updateUserRole } from '@/db/api';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
}

interface SystemStats {
  userCount: number;
  taskCount: number;
  sessionCount: number;
  knowledgeCount: number;
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { isAdmin: isAdminUser, loading: adminLoading } = useAdmin();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<SystemStats>({
    userCount: 0,
    taskCount: 0,
    sessionCount: 0,
    knowledgeCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 如果不是管理员，重定向到首页
    if (!adminLoading && !isAdminUser) {
      toast({
        title: '权限不足',
        description: '您没有访问管理员页面的权限',
        variant: 'destructive',
      });
      navigate('/');
      return;
    }

    if (isAdminUser) {
      loadData();
    }
  }, [isAdminUser, adminLoading, navigate, toast]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, statsData] = await Promise.all([
        getAllUsers(),
        getSystemStats(),
      ]);
      setUsers(usersData);
      setStats(statsData);
    } catch (error) {
      console.error('加载数据失败:', error);
      toast({
        title: '加载失败',
        description: '无法加载管理员数据',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      const success = await updateUserRole(userId, newRole);
      if (success) {
        toast({
          title: '更新成功',
          description: `用户角色已更新为 ${newRole === 'admin' ? '管理员' : '普通用户'}`,
        });
        loadData(); // 重新加载数据
      } else {
        throw new Error('更新失败');
      }
    } catch (error) {
      console.error('更新用户角色失败:', error);
      toast({
        title: '更新失败',
        description: '无法更新用户角色',
        variant: 'destructive',
      });
    }
  };

  if (adminLoading || loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!isAdminUser) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            管理员控制台
          </h1>
          <p className="text-muted-foreground mt-2">
            系统管理与数据监控
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/')}>
          返回首页
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总用户数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.userCount}</div>
            <p className="text-xs text-muted-foreground">
              注册用户总数
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">任务总数</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.taskCount}</div>
            <p className="text-xs text-muted-foreground">
              创建的任务总数
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">学习会话</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sessionCount}</div>
            <p className="text-xs text-muted-foreground">
              学习会话总数
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">知识点</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.knowledgeCount}</div>
            <p className="text-xs text-muted-foreground">
              收藏的知识点总数
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 管理标签页 */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <UserCog className="w-4 h-4" />
            用户管理
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            数据统计
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            系统设置
          </TabsTrigger>
        </TabsList>

        {/* 用户管理标签页 */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>用户列表</CardTitle>
              <CardDescription>
                管理系统中的所有用户及其权限
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>邮箱</TableHead>
                    <TableHead>角色</TableHead>
                    <TableHead>注册时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.role === 'admin' 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {user.role === 'admin' ? '管理员' : '普通用户'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString('zh-CN')}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onValueChange={(value: 'user' | 'admin') => 
                            handleRoleChange(user.id, value)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">普通用户</SelectItem>
                            <SelectItem value="admin">管理员</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 数据统计标签页 */}
        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>系统数据统计</CardTitle>
              <CardDescription>
                查看系统的整体使用情况和数据分析
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">用户活跃度</p>
                    <p className="text-sm text-muted-foreground">
                      总用户数: {stats.userCount}
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {stats.userCount > 0 ? '100%' : '0%'}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">任务完成情况</p>
                    <p className="text-sm text-muted-foreground">
                      总任务数: {stats.taskCount}
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {stats.taskCount}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">学习时长统计</p>
                    <p className="text-sm text-muted-foreground">
                      总会话数: {stats.sessionCount}
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {stats.sessionCount}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">知识库规模</p>
                    <p className="text-sm text-muted-foreground">
                      总知识点: {stats.knowledgeCount}
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {stats.knowledgeCount}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 系统设置标签页 */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>系统设置</CardTitle>
              <CardDescription>
                配置系统参数和功能选项
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">秘书AI系统</p>
                    <p className="text-sm text-muted-foreground">
                      15个秘书形象，支持情感交互和记忆系统
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded text-sm">
                    已启用
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">情绪识别系统</p>
                    <p className="text-sm text-muted-foreground">
                      AI秘书可以识别和回应用户情绪
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded text-sm">
                    已启用
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">记忆系统</p>
                    <p className="text-sm text-muted-foreground">
                      AI秘书可以记住用户偏好和习惯
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded text-sm">
                    已启用
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">个性化对话</p>
                    <p className="text-sm text-muted-foreground">
                      每个秘书都有独特的性格和说话方式
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded text-sm">
                    已启用
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
