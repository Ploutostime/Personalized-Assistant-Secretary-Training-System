import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getTasks, createTask, updateTask, deleteTask } from '@/db/api';
import type { Task, TaskType, PriorityLevel, TaskStatus } from '@/types/types';
import { Plus, Clock, Edit, Trash2, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const taskTypeOptions: { value: TaskType; label: string }[] = [
  { value: 'competition', label: '竞赛' },
  { value: 'homework', label: '作业' },
  { value: 'exam', label: '考试' },
  { value: 'study', label: '学习' },
  { value: 'other', label: '其他' },
];

const priorityOptions: { value: PriorityLevel; label: string }[] = [
  { value: 'low', label: '低' },
  { value: 'medium', label: '中' },
  { value: 'high', label: '高' },
  { value: 'urgent', label: '紧急' },
];

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'pending', label: '待办' },
  { value: 'in_progress', label: '进行中' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' },
];

const priorityColors = {
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const statusColors = {
  pending: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export default function TasksPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [filterType, setFilterType] = useState<TaskType | 'all'>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    task_type: 'homework' as TaskType,
    priority: 'medium' as PriorityLevel,
    status: 'pending' as TaskStatus,
    deadline: '',
    estimated_hours: '',
  });

  useEffect(() => {
    if (!user) return;
    loadTasks();
  }, [user]);

  useEffect(() => {
    let filtered = tasks;
    if (filterStatus !== 'all') {
      filtered = filtered.filter(t => t.status === filterStatus);
    }
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.task_type === filterType);
    }
    setFilteredTasks(filtered);
  }, [tasks, filterStatus, filterType]);

  const loadTasks = async () => {
    if (!user) return;
    setLoading(true);
    const data = await getTasks(user.id);
    setTasks(data);
    setLoading(false);
  };

  const handleOpenDialog = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description || '',
        task_type: task.task_type,
        priority: task.priority,
        status: task.status,
        deadline: task.deadline ? format(new Date(task.deadline), "yyyy-MM-dd'T'HH:mm") : '',
        estimated_hours: task.estimated_hours?.toString() || '',
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        task_type: 'homework',
        priority: 'medium',
        status: 'pending',
        deadline: '',
        estimated_hours: '',
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.title.trim()) {
      toast.error('请输入任务标题');
      return;
    }

    const taskData = {
      user_id: user.id,
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      task_type: formData.task_type,
      priority: formData.priority,
      status: formData.status,
      deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
      estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : null,
      start_time: null,
      end_time: null,
      actual_hours: null,
      reminder_enabled: true,
      reminder_time: null,
    };

    if (editingTask) {
      const success = await updateTask(editingTask.id, taskData);
      if (success) {
        toast.success('任务更新成功');
        setDialogOpen(false);
        loadTasks();
      } else {
        toast.error('任务更新失败');
      }
    } else {
      const result = await createTask(taskData);
      if (result) {
        toast.success('任务创建成功');
        setDialogOpen(false);
        loadTasks();
      } else {
        toast.error('任务创建失败');
      }
    }
  };

  const handleDelete = async () => {
    if (!taskToDelete) return;
    const success = await deleteTask(taskToDelete);
    if (success) {
      toast.success('任务删除成功');
      loadTasks();
    } else {
      toast.error('任务删除失败');
    }
    setDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    const success = await updateTask(taskId, { status: newStatus });
    if (success) {
      toast.success('状态更新成功');
      loadTasks();
    } else {
      toast.error('状态更新失败');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 bg-muted" />
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">事务管理</h1>
          <p className="text-muted-foreground mt-1">管理你的学习任务和事务</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              新建任务
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTask ? '编辑任务' : '新建任务'}</DialogTitle>
              <DialogDescription>填写任务详细信息</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">任务标题 *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="输入任务标题"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">任务描述</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="输入任务描述"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="task_type">任务类型</Label>
                  <Select
                    value={formData.task_type}
                    onValueChange={(value: TaskType) => setFormData({ ...formData, task_type: value })}
                  >
                    <SelectTrigger id="task_type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {taskTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">优先级</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: PriorityLevel) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">状态</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: TaskStatus) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimated_hours">预计时长（小时）</Label>
                  <Input
                    id="estimated_hours"
                    type="number"
                    step="0.5"
                    min="0"
                    value={formData.estimated_hours}
                    onChange={(e) => setFormData({ ...formData, estimated_hours: e.target.value })}
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">截止时间</Label>
                <Input
                  id="deadline"
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  取消
                </Button>
                <Button type="submit">{editingTask ? '更新' : '创建'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* 筛选器 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="h-4 w-4" />
            筛选
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Label>状态：</Label>
            <Select value={filterStatus} onValueChange={(value: TaskStatus | 'all') => setFilterStatus(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label>类型：</Label>
            <Select value={filterType} onValueChange={(value: TaskType | 'all') => setFilterType(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                {taskTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 任务列表 */}
      {filteredTasks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>暂无任务，点击"新建任务"开始添加</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{task.title}</h3>
                      <Badge variant="outline">{taskTypeOptions.find(t => t.value === task.task_type)?.label}</Badge>
                      <Badge className={priorityColors[task.priority]}>
                        {priorityOptions.find(p => p.value === task.priority)?.label}
                      </Badge>
                    </div>

                    {task.description && (
                      <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      {task.deadline && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          截止：{format(new Date(task.deadline), 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                        </span>
                      )}
                      {task.estimated_hours && (
                        <span>预计：{task.estimated_hours} 小时</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Select
                      value={task.status}
                      onValueChange={(value: TaskStatus) => handleStatusChange(task.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button variant="outline" size="icon" onClick={() => handleOpenDialog(task)}>
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setTaskToDelete(task.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              此操作无法撤销。确定要删除这个任务吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
