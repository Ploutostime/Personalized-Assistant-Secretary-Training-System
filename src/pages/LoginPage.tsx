import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { BookOpen, GraduationCap } from 'lucide-react';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string })?.from || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginUsername || !loginPassword) {
      toast.error('请输入用户名和密码');
      return;
    }

    // 验证用户名格式
    if (!/^[a-zA-Z0-9_]+$/.test(loginUsername)) {
      toast.error('用户名只能包含字母、数字和下划线');
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(loginUsername, loginPassword);
    setIsLoading(false);

    if (error) {
      toast.error('登录失败：' + error.message);
    } else {
      toast.success('登录成功！');
      navigate(from, { replace: true });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signupUsername || !signupPassword || !confirmPassword) {
      toast.error('请填写所有字段');
      return;
    }

    // 验证用户名格式
    if (!/^[a-zA-Z0-9_]+$/.test(signupUsername)) {
      toast.error('用户名只能包含字母、数字和下划线');
      return;
    }

    if (signupPassword !== confirmPassword) {
      toast.error('两次输入的密码不一致');
      return;
    }

    if (signupPassword.length < 6) {
      toast.error('密码长度至少为6位');
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(signupUsername, signupPassword);
    setIsLoading(false);

    if (error) {
      toast.error('注册失败：' + error.message);
    } else {
      toast.success('注册成功！正在登录...');
      // 注册成功后自动登录
      const { error: loginError } = await signIn(signupUsername, signupPassword);
      if (!loginError) {
        navigate(from, { replace: true });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-3 bg-primary rounded-2xl">
              <GraduationCap className="w-8 h-8 text-primary-foreground" />
            </div>
            <BookOpen className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">智学秘伴</h1>
          <p className="text-muted-foreground">高效管理学习事务，提升学习效率</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>欢迎使用</CardTitle>
            <CardDescription>登录或注册以开始使用</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">登录</TabsTrigger>
                <TabsTrigger value="signup">注册</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username">用户名</Label>
                    <Input
                      id="login-username"
                      type="text"
                      placeholder="请输入用户名"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      disabled={isLoading}
                      autoComplete="username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">密码</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="请输入密码"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      disabled={isLoading}
                      autoComplete="current-password"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? '登录中...' : '登录'}
                  </Button>
                  
                  {/* 测试账号提示 */}
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-muted">
                    <p className="text-xs text-muted-foreground text-center mb-2">
                      💡 测试账号信息
                    </p>
                    <div className="text-xs space-y-1">
                      <p className="text-center">
                        <span className="font-medium">用户名：</span>
                        <code className="bg-muted px-2 py-0.5 rounded">ploutos</code>
                      </p>
                      <p className="text-center">
                        <span className="font-medium">密码：</span>
                        <code className="bg-muted px-2 py-0.5 rounded">123456</code>
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => {
                        setLoginUsername('ploutos');
                        setLoginPassword('123456');
                      }}
                    >
                      快速填充测试账号
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-username">用户名</Label>
                    <Input
                      id="signup-username"
                      type="text"
                      placeholder="字母、数字或下划线"
                      value={signupUsername}
                      onChange={(e) => setSignupUsername(e.target.value)}
                      disabled={isLoading}
                      autoComplete="username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">密码</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="至少6位"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">确认密码</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="再次输入密码"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? '注册中...' : '注册'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-4">
          第一个注册的用户将自动成为管理员
        </p>
      </div>
    </div>
  );
}
