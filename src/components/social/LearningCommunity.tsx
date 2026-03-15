import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Share, 
  Bookmark, 
  TrendingUp,
  Award,
  Clock,
  Search
} from 'lucide-react';

interface CommunityPost {
  id: string;
  author: {
    name: string;
    avatar?: string;
    level: number;
  };
  content: string;
  subject: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: Date;
  tags: string[];
  isLiked: boolean;
  isBookmarked: boolean;
}

interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  description: string;
  members: number;
  maxMembers: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  meetingTime: string;
}

interface UserRanking {
  rank: number;
  name: string;
  avatar?: string;
  points: number;
  streak: number;
}

export function LearningCommunity() {
  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: '1',
      author: {
        name: '张小明',
        level: 5
      },
      content: '今天学习了高等数学的微积分部分，发现了一个很巧妙的应用题解法，分享给大家！',
      subject: '数学',
      likes: 24,
      comments: 8,
      shares: 3,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小时前
      tags: ['数学', '微积分', '解题技巧'],
      isLiked: false,
      isBookmarked: false
    },
    {
      id: '2',
      author: {
        name: '李华',
        level: 3
      },
      content: '有没有同学一起组队学习编程算法？想找几个小伙伴一起刷LeetCode！',
      subject: '计算机科学',
      likes: 15,
      comments: 12,
      shares: 5,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5小时前
      tags: ['编程', '算法', '学习小组'],
      isLiked: true,
      isBookmarked: true
    }
  ]);

  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([
    {
      id: '1',
      name: '数学精英小组',
      subject: '数学',
      description: '专注于高等数学和线性代数的深入学习',
      members: 8,
      maxMembers: 12,
      level: 'advanced',
      meetingTime: '每周三 19:00'
    },
    {
      id: '2',
      name: '编程新手营',
      subject: '计算机科学',
      description: '适合编程初学者，从基础语法开始学习',
      members: 15,
      maxMembers: 20,
      level: 'beginner',
      meetingTime: '每周一、三、五 20:00'
    }
  ]);

  const [userRankings, setUserRankings] = useState<UserRanking[]>([
    { rank: 1, name: '学霸张', points: 1250, streak: 15 },
    { rank: 2, name: '学习达人', points: 980, streak: 12 },
    { rank: 3, name: '知识探索者', points: 760, streak: 8 },
    { rank: 4, name: '勤奋小王', points: 650, streak: 10 },
    { rank: 5, name: '智慧之星', points: 520, streak: 6 }
  ]);

  const [newPost, setNewPost] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  // 点赞帖子
  const likePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked 
          }
        : post
    ));
  };

  // 收藏帖子
  const bookmarkPost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  // 发布新帖子
  const publishPost = () => {
    if (!newPost.trim()) return;

    const newPostObj: CommunityPost = {
      id: Date.now().toString(),
      author: {
        name: '当前用户',
        level: 4
      },
      content: newPost,
      subject: '通用',
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: new Date(),
      tags: [],
      isLiked: false,
      isBookmarked: false
    };

    setPosts(prev => [newPostObj, ...prev]);
    setNewPost('');
  };

  // 获取用户等级徽章颜色
  const getLevelColor = (level: number) => {
    if (level >= 8) return 'bg-purple-100 text-purple-800';
    if (level >= 5) return 'bg-blue-100 text-blue-800';
    if (level >= 3) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  // 获取难度颜色
  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 格式化时间显示
  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    
    if (diff < 60 * 1000) return '刚刚';
    if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))}分钟前`;
    if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))}小时前`;
    return `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 社区头部 */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Users className="w-8 h-8 text-blue-600" />
            学习社区
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 左侧边栏 */}
        <div className="lg:col-span-1 space-y-6">
          {/* 用户排名 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="w-5 h-5 text-yellow-600" />
                学习排行榜
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {userRankings.map((user, index) => (
                <div key={user.rank} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.rank}
                    </span>
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <div className="text-sm text-gray-500">{user.points}分</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 学习小组 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
                热门学习小组
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {studyGroups.map((group) => (
                <div key={group.id} className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">{group.name}</span>
                    <Badge variant="outline" className={getLevelBadgeColor(group.level)}>
                      {group.level === 'beginner' ? '初级' : 
                       group.level === 'intermediate' ? '中级' : '高级'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{group.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{group.members}/{group.maxMembers}人</span>
                    <span>{group.meetingTime}</span>
                  </div>
                  <Button size="sm" className="w-full mt-2">加入小组</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* 主要内容区域 */}
        <div className="lg:col-span-3 space-y-6">
          {/* 发布新帖子 */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback>我</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Input
                    placeholder="分享你的学习心得、问题或资源..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="mb-2"
                  />
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">添加标签</Button>
                      <Button variant="outline" size="sm">上传图片</Button>
                    </div>
                    <Button onClick={publishPost} disabled={!newPost.trim()}>
                      发布
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 帖子筛选 */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button 
              variant={selectedSubject === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSubject('all')}
            >
              全部
            </Button>
            {['数学', '英语', '编程', '物理', '化学', '历史'].map((subject) => (
              <Button
                key={subject}
                variant={selectedSubject === subject ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSubject(subject)}
              >
                {subject}
              </Button>
            ))}
          </div>

          {/* 帖子列表 */}
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    {/* 帖子头部 */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{post.author.name}</span>
                            <Badge variant="outline" className={getLevelColor(post.author.level)}>
                              Lv.{post.author.level}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {formatTime(post.timestamp)}
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary">{post.subject}</Badge>
                    </div>

                    {/* 帖子内容 */}
                    <p className="mb-3 text-gray-700">{post.content}</p>

                    {/* 标签 */}
                    {post.tags.length > 0 && (
                      <div className="flex gap-1 mb-3">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* 互动按钮 */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => likePost(post.id)}
                          className={`flex items-center gap-1 ${post.isLiked ? 'text-red-600' : ''}`}
                        >
                          <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {post.comments}
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <Share className="w-4 h-4" />
                          {post.shares}
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => bookmarkPost(post.id)}
                        className={post.isBookmarked ? 'text-yellow-600' : ''}
                      >
                        <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}