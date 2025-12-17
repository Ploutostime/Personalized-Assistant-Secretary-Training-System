import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getAllProfiles, updateProfile } from '@/db/api';
import type { Profile, UserRole } from '@/types/types';
import { Shield, Users, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { toast } from 'sonner';

export default function AdminPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    if (!profile) return;
    
    if (profile.role !== 'admin') {
      toast.error('无权访问管理员页面');
      navigate('/');
      return;
    }

    loadProfiles();
  }, [profile, navigate]);

  const loadProfiles = async () => {
    setLoading(true);
    const data = await getAllProfiles();
    setProfiles(data);
    setLoading(false);
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    const success = await updateProfile(userId, { role: newRole });
    if (success) {
      toast.success('用户角色更新成功');
      loadProfiles();
    } else {
      toast.error('用户角色更新失败');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 bg-muted" />
        <Skeleton className="h-96 bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <Shield className="h-8 w-8" />
          管理员面板
        </h1>
        <p className="text-muted-foreground mt-1">管理系统用户和权限</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">总用户数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profiles.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">管理员</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profiles.filter(p => p.role === 'admin').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">普通用户</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profiles.filter(p => p.role === 'user').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 用户列表 */}
      <Card>
        <CardHeader>
          <CardTitle>用户管理</CardTitle>
          <CardDescription>查看和管理所有用户的角色权限</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>用户名</TableHead>
                  <TableHead>邮箱</TableHead>
                  <TableHead>角色</TableHead>
                  <TableHead>注册时间</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      暂无用户数据
                    </TableCell>
                  </TableRow>
                ) : (
                  profiles.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.role === 'admin' ? (
                          <Badge className="bg-primary">管理员</Badge>
                        ) : (
                          <Badge variant="secondary">普通用户</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {format(new Date(user.created_at), 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                      </TableCell>
                      <TableCell>
                        {user.id !== profile?.id ? (
                          <Select
                            value={user.role}
                            onValueChange={(value: UserRole) => handleRoleChange(user.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">普通用户</SelectItem>
                              <SelectItem value="admin">管理员</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="text-sm text-muted-foreground">当前用户</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 提示信息 */}
      <Card className="border-secondary/50 bg-secondary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-secondary mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-secondary mb-1">管理员权限说明</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 管理员可以查看所有用户信息</li>
                <li>• 管理员可以修改其他用户的角色权限</li>
                <li>• 第一个注册的用户自动成为管理员</li>
                <li>• 建议至少保留一个管理员账号</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
