import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard,
  ListTodo,
  Calendar,
  BookMarked,
  BarChart3,
  Settings,
  Menu,
  LogOut,
  Shield,
  GraduationCap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: '仪表盘', href: '/', icon: LayoutDashboard },
  { name: '事务管理', href: '/tasks', icon: ListTodo },
  { name: '时间表', href: '/schedule', icon: Calendar },
  { name: '知识收藏', href: '/knowledge', icon: BookMarked },
  { name: '学习统计', href: '/statistics', icon: BarChart3 },
  { name: '设置', href: '/settings', icon: Settings },
];

function Sidebar() {
  const location = useLocation();
  const { profile } = useAuth();

  return (
    <div className="flex flex-col h-full bg-sidebar-background text-sidebar-foreground">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sidebar-primary rounded-xl">
            <GraduationCap className="w-6 h-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold">智学秘伴</h2>
            <p className="text-xs text-sidebar-foreground/70">学习管理系统</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {profile?.role === 'admin' && (
        <div className="p-4 border-t border-sidebar-border">
          <Link
            to="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors"
          >
            <Shield className="w-5 h-5" />
            <span>管理员面板</span>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* 桌面端侧边栏 */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-sidebar-border">
        <Sidebar />
      </aside>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部导航栏 */}
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
            {/* 移动端菜单按钮 */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">打开菜单</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <Sidebar />
              </SheetContent>
            </Sheet>

            <div className="flex-1" />

            {/* 用户菜单 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {profile?.username?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline-block">{profile?.username || '用户'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{profile?.username || '用户'}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {profile?.role === 'admin' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        <Shield className="mr-2 h-4 w-4" />
                        管理员面板
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    设置
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
