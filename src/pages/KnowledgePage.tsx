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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  getKnowledgeItems,
  createKnowledgeItem,
  updateKnowledgeItem,
  deleteKnowledgeItem,
} from '@/db/api';
import type { KnowledgeItem } from '@/types/types';
import { Plus, BookMarked, Edit, Trash2, RefreshCw, ExternalLink } from 'lucide-react';
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

export default function KnowledgePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KnowledgeItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    subject: '',
    tags: '',
    source_url: '',
  });

  useEffect(() => {
    if (!user) return;
    loadItems();
  }, [user]);

  const loadItems = async () => {
    if (!user) return;
    setLoading(true);
    const data = await getKnowledgeItems(user.id);
    setItems(data);
    setLoading(false);
  };

  const handleOpenDialog = (item?: KnowledgeItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        content: item.content || '',
        subject: item.subject || '',
        tags: item.tags?.join(', ') || '',
        source_url: item.source_url || '',
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        content: '',
        subject: '',
        tags: '',
        source_url: '',
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.title.trim()) {
      toast.error('请输入知识点标题');
      return;
    }

    const tagsArray = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const itemData = {
      user_id: user.id,
      title: formData.title.trim(),
      content: formData.content.trim() || null,
      subject: formData.subject.trim() || null,
      tags: tagsArray.length > 0 ? tagsArray : null,
      source_url: formData.source_url.trim() || null,
      review_count: 0,
      last_reviewed_at: null,
      next_review_at: null,
    };

    if (editingItem) {
      const success = await updateKnowledgeItem(editingItem.id, itemData);
      if (success) {
        toast.success('知识点更新成功');
        setDialogOpen(false);
        loadItems();
      } else {
        toast.error('知识点更新失败');
      }
    } else {
      const result = await createKnowledgeItem(itemData);
      if (result) {
        toast.success('知识点创建成功');
        setDialogOpen(false);
        loadItems();
      } else {
        toast.error('知识点创建失败');
      }
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    const success = await deleteKnowledgeItem(itemToDelete);
    if (success) {
      toast.success('知识点删除成功');
      loadItems();
    } else {
      toast.error('知识点删除失败');
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleReview = async (item: KnowledgeItem) => {
    const now = new Date();
    const nextReview = new Date();
    // 简单的间隔重复算法：1天、3天、7天、14天、30天
    const intervals = [1, 3, 7, 14, 30];
    const nextInterval = intervals[Math.min(item.review_count, intervals.length - 1)];
    nextReview.setDate(nextReview.getDate() + nextInterval);

    const success = await updateKnowledgeItem(item.id, {
      review_count: item.review_count + 1,
      last_reviewed_at: now.toISOString(),
      next_review_at: nextReview.toISOString(),
    });

    if (success) {
      toast.success(`复习完成！下次复习时间：${format(nextReview, 'yyyy-MM-dd', { locale: zhCN })}`);
      loadItems();
    } else {
      toast.error('更新复习记录失败');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 bg-muted" />
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">知识收藏</h1>
          <p className="text-muted-foreground mt-1">收藏和管理你的学习知识点</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              新建知识点
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? '编辑知识点' : '新建知识点'}</DialogTitle>
              <DialogDescription>记录重要的学习知识点</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">标题 *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="输入知识点标题"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">学科</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="例如：数学、英语、编程"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">内容</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="输入知识点详细内容"
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">标签</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="用逗号分隔，例如：重点, 难点, 公式"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="source_url">来源链接</Label>
                <Input
                  id="source_url"
                  type="url"
                  value={formData.source_url}
                  onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  取消
                </Button>
                <Button type="submit">{editingItem ? '更新' : '创建'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <BookMarked className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>暂无知识点收藏，点击"新建知识点"开始添加</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {item.subject && (
                        <Badge variant="secondary">{item.subject}</Badge>
                      )}
                      {item.tags?.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setItemToDelete(item.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {item.content && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {item.content}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    <div>已复习 {item.review_count} 次</div>
                    {item.last_reviewed_at && (
                      <div>
                        上次复习：{format(new Date(item.last_reviewed_at), 'yyyy-MM-dd', { locale: zhCN })}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {item.source_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={item.source_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          来源
                        </a>
                      </Button>
                    )}
                    <Button variant="default" size="sm" onClick={() => handleReview(item)}>
                      <RefreshCw className="h-4 w-4 mr-1" />
                      复习
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
              此操作无法撤销。确定要删除这个知识点吗？
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
