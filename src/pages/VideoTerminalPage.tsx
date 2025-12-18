import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Video,
  Heart,
  Eye,
  Clock,
  Search,
  Plus,
  Star,
  Play,
  BookmarkPlus,
  Filter,
  TrendingUp,
  History,
} from 'lucide-react';
import {
  getVideoRecommendations,
  createVideoRecommendation,
  toggleVideoFavorite,
  markVideoAsWatched,
  getVideoWatchHistory,
  getMajorTags,
  getProfile,
  updateProfile,
} from '@/db/api';
import type { VideoRecommendation, VideoWatchHistory, MajorTag } from '@/types/types';

export default function VideoTerminalPage() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<VideoRecommendation[]>([]);
  const [watchHistory, setWatchHistory] = useState<VideoWatchHistory[]>([]);
  const [majorTags, setMajorTags] = useState<MajorTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'unwatched' | 'favorited'>('all');
  const [selectedMajor, setSelectedMajor] = useState<string>('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  // 新视频表单
  const [newVideo, setNewVideo] = useState({
    video_id: '',
    video_title: '',
    video_url: '',
    video_cover: '',
    author: '',
    duration: 0,
    tags: [] as string[],
    description: '',
    recommended_reason: '',
  });

  // 用户专业信息
  const [userMajor, setUserMajor] = useState('');
  const [userGrade, setUserGrade] = useState('');
  const [userInterests, setUserInterests] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      loadData();
      loadUserProfile();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [videosData, historyData, tagsData] = await Promise.all([
        getVideoRecommendations(user.id),
        getVideoWatchHistory(user.id),
        getMajorTags(),
      ]);
      setVideos(videosData);
      setWatchHistory(historyData);
      setMajorTags(tagsData);
    } catch (error) {
      console.error('加载数据失败:', error);
      toast.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async () => {
    if (!user) return;
    const profile = await getProfile(user.id);
    if (profile) {
      setUserMajor(profile.major || '');
      setUserGrade(profile.grade || '');
      setUserInterests(profile.interests || []);
      setSelectedMajor(profile.major || '');
    }
  };

  const handleAddVideo = async () => {
    if (!user || !newVideo.video_title || !newVideo.video_url) {
      toast.error('请填写必填字段');
      return;
    }

    const videoData = {
      user_id: user.id,
      ...newVideo,
      view_count: null,
      is_watched: false,
      is_favorited: false,
      watch_progress: 0,
      watched_at: null,
    };

    const result = await createVideoRecommendation(videoData);
    if (result) {
      toast.success('视频添加成功');
      setIsAddDialogOpen(false);
      setNewVideo({
        video_id: '',
        video_title: '',
        video_url: '',
        video_cover: '',
        author: '',
        duration: 0,
        tags: [],
        description: '',
        recommended_reason: '',
      });
      loadData();
    } else {
      toast.error('视频添加失败');
    }
  };

  const handleToggleFavorite = async (videoId: string, currentStatus: boolean) => {
    const success = await toggleVideoFavorite(videoId, !currentStatus);
    if (success) {
      toast.success(currentStatus ? '已取消收藏' : '已收藏');
      loadData();
    } else {
      toast.error('操作失败');
    }
  };

  const handleMarkAsWatched = async (videoId: string) => {
    const success = await markVideoAsWatched(videoId);
    if (success) {
      toast.success('已标记为已观看');
      loadData();
    } else {
      toast.error('操作失败');
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    const success = await updateProfile(user.id, {
      major: userMajor || null,
      grade: userGrade || null,
      interests: userInterests.length > 0 ? userInterests : null,
    });
    if (success) {
      toast.success('专业信息更新成功');
      setIsProfileDialogOpen(false);
      setSelectedMajor(userMajor);
    } else {
      toast.error('更新失败');
    }
  };

  const filteredVideos = videos.filter(video => {
    // 搜索过滤
    if (searchQuery && !video.video_title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // 专业过滤
    if (selectedMajor && selectedMajor !== 'all' && video.tags && !video.tags.includes(selectedMajor)) {
      return false;
    }

    // 状态过滤
    if (filterTab === 'unwatched' && video.is_watched) {
      return false;
    }
    if (filterTab === 'favorited' && !video.is_favorited) {
      return false;
    }

    return true;
  });

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}小时${minutes % 60}分钟`;
    }
    return `${minutes}分钟`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">私人终端</h1>
          <p className="text-muted-foreground mt-1">
            根据您的专业推送适配的 Bilibili 学术视频
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                设置专业
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>设置专业信息</DialogTitle>
                <DialogDescription>
                  设置您的专业信息，系统将为您推荐相关的学术视频
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>专业</Label>
                  <Select value={userMajor} onValueChange={setUserMajor}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择专业" />
                    </SelectTrigger>
                    <SelectContent>
                      {majorTags.map(tag => (
                        <SelectItem key={tag.id} value={tag.name}>
                          {tag.name} {tag.category && `(${tag.category})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>年级</Label>
                  <Select value={userGrade} onValueChange={setUserGrade}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择年级" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="大一">大一</SelectItem>
                      <SelectItem value="大二">大二</SelectItem>
                      <SelectItem value="大三">大三</SelectItem>
                      <SelectItem value="大四">大四</SelectItem>
                      <SelectItem value="研一">研一</SelectItem>
                      <SelectItem value="研二">研二</SelectItem>
                      <SelectItem value="研三">研三</SelectItem>
                      <SelectItem value="博士">博士</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsProfileDialogOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={handleUpdateProfile}>保存</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                添加视频
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>添加视频推荐</DialogTitle>
                <DialogDescription>
                  手动添加 Bilibili 学术视频到您的私人终端
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>视频标题 *</Label>
                  <Input
                    value={newVideo.video_title}
                    onChange={e => setNewVideo({ ...newVideo, video_title: e.target.value })}
                    placeholder="输入视频标题"
                  />
                </div>
                <div>
                  <Label>视频链接 *</Label>
                  <Input
                    value={newVideo.video_url}
                    onChange={e => setNewVideo({ ...newVideo, video_url: e.target.value })}
                    placeholder="https://www.bilibili.com/video/..."
                  />
                </div>
                <div>
                  <Label>封面图片链接</Label>
                  <Input
                    value={newVideo.video_cover}
                    onChange={e => setNewVideo({ ...newVideo, video_cover: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>作者</Label>
                    <Input
                      value={newVideo.author}
                      onChange={e => setNewVideo({ ...newVideo, author: e.target.value })}
                      placeholder="UP主名称"
                    />
                  </div>
                  <div>
                    <Label>时长（秒）</Label>
                    <Input
                      type="number"
                      value={newVideo.duration}
                      onChange={e => setNewVideo({ ...newVideo, duration: parseInt(e.target.value) || 0 })}
                      placeholder="600"
                    />
                  </div>
                </div>
                <div>
                  <Label>标签（用逗号分隔）</Label>
                  <Input
                    value={newVideo.tags.join(', ')}
                    onChange={e => setNewVideo({ ...newVideo, tags: e.target.value.split(',').map(t => t.trim()) })}
                    placeholder="计算机科学, 算法, 数据结构"
                  />
                </div>
                <div>
                  <Label>视频简介</Label>
                  <Textarea
                    value={newVideo.description}
                    onChange={e => setNewVideo({ ...newVideo, description: e.target.value })}
                    placeholder="视频内容简介"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>推荐理由</Label>
                  <Textarea
                    value={newVideo.recommended_reason}
                    onChange={e => setNewVideo({ ...newVideo, recommended_reason: e.target.value })}
                    placeholder="为什么推荐这个视频"
                    rows={2}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={handleAddVideo}>添加</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 专业信息提示 */}
      {!userMajor && (
        <Card className="border-primary bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold">设置您的专业信息</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  设置专业后，系统将为您推荐更精准的学术视频内容
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => setIsProfileDialogOpen(true)}
                >
                  立即设置
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 搜索和筛选 */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索视频标题..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedMajor} onValueChange={setSelectedMajor}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="筛选专业" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部专业</SelectItem>
            {majorTags.map(tag => (
              <SelectItem key={tag.id} value={tag.name}>
                {tag.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 标签页 */}
      <Tabs value={filterTab} onValueChange={(v) => setFilterTab(v as typeof filterTab)}>
        <TabsList>
          <TabsTrigger value="all">
            <Video className="mr-2 h-4 w-4" />
            全部视频 ({videos.length})
          </TabsTrigger>
          <TabsTrigger value="unwatched">
            <Eye className="mr-2 h-4 w-4" />
            未观看 ({videos.filter(v => !v.is_watched).length})
          </TabsTrigger>
          <TabsTrigger value="favorited">
            <Star className="mr-2 h-4 w-4" />
            已收藏 ({videos.filter(v => v.is_favorited).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filterTab} className="mt-6">
          {filteredVideos.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Video className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">暂无视频</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  添加第一个视频
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredVideos.map(video => (
                <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* 视频封面 */}
                  {video.video_cover && (
                    <div className="relative aspect-video bg-muted">
                      <img
                        src={video.video_cover}
                        alt={video.video_title}
                        className="w-full h-full object-cover"
                      />
                      {video.duration && (
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {formatDuration(video.duration)}
                        </div>
                      )}
                      {video.is_watched && (
                        <div className="absolute top-2 left-2 bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
                          已观看
                        </div>
                      )}
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg line-clamp-2">
                        {video.video_title}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        onClick={() => handleToggleFavorite(video.id, video.is_favorited)}
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            video.is_favorited ? 'fill-red-500 text-red-500' : ''
                          }`}
                        />
                      </Button>
                    </div>
                    {video.author && (
                      <CardDescription className="flex items-center gap-1">
                        <span>UP主: {video.author}</span>
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {video.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {video.description}
                      </p>
                    )}

                    {video.recommended_reason && (
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                        <p className="text-xs text-primary font-medium mb-1">推荐理由</p>
                        <p className="text-sm line-clamp-2">{video.recommended_reason}</p>
                      </div>
                    )}

                    {video.tags && video.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {video.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => window.open(video.video_url, '_blank')}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        观看视频
                      </Button>
                      {!video.is_watched && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleMarkAsWatched(video.id)}
                          title="标记为已观看"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* 观看历史 */}
      {watchHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              最近观看
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {watchHistory.slice(0, 5).map(history => (
                <div
                  key={history.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium">{history.video_title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(history.created_at).toLocaleString('zh-CN')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(history.video_url, '_blank')}
                  >
                    再次观看
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
