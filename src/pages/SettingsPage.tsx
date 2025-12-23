import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  getScheduleSettings, 
  updateScheduleSettings, 
  getProfile, 
  updateProfile, 
  getMajorTags, 
  getUserPreferences, 
  updateUserPreferences,
  getSecretaryAvatars,
  getSecretaryPersonalities,
  getSecretaryOutfits,
  getUserSecretaryConfig,
  updateSecretaryConfig,
} from '@/db/api';
import type { ScheduleSettings, MajorTag, UserPreferences, SecretaryAvatar, SecretaryPersonality, SecretaryOutfit, SecretaryConfig } from '@/types/types';
import { Settings as SettingsIcon, Clock, Save, User, Video, GraduationCap, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { SecretaryCard } from '@/components/SecretaryCard';

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<ScheduleSettings | null>(null);
  const [majorTags, setMajorTags] = useState<MajorTag[]>([]);

  // 秘书定制相关状态
  const [avatars, setAvatars] = useState<SecretaryAvatar[]>([]);
  const [personalities, setPersonalities] = useState<SecretaryPersonality[]>([]);
  const [outfits, setOutfits] = useState<SecretaryOutfit[]>([]);
  const [secretaryConfig, setSecretaryConfig] = useState<SecretaryConfig | null>(null);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('');
  const [selectedPersonalityId, setSelectedPersonalityId] = useState<string>('');
  const [selectedOutfitId, setSelectedOutfitId] = useState<string>('');
  const [secretaryName, setSecretaryName] = useState('小秘');
  const [secretaryEnabled, setSecretaryEnabled] = useState(true);

  const [formData, setFormData] = useState({
    daily_study_goal_hours: '8',
    preferred_start_time: '08:00',
    preferred_end_time: '22:00',
    break_duration_minutes: '15',
    auto_schedule_enabled: true,
  });

  const [profileData, setProfileData] = useState({
    major: '',
    grade: '',
  });

  const [videoPreferences, setVideoPreferences] = useState({
    auto_recommend: true,
    daily_recommendation_count: 5,
    preferred_duration_min: null as number | null,
    preferred_duration_max: null as number | null,
  });

  useEffect(() => {
    if (!user) return;
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [scheduleData, profileInfo, tags, preferences, avatarList, personalityList, outfitList, config] = await Promise.all([
        getScheduleSettings(user.id),
        getProfile(user.id),
        getMajorTags(),
        getUserPreferences(user.id),
        getSecretaryAvatars(),
        getSecretaryPersonalities(),
        getSecretaryOutfits(),
        getUserSecretaryConfig(user.id),
      ]);

      if (scheduleData) {
        setSettings(scheduleData);
        setFormData({
          daily_study_goal_hours: scheduleData.daily_study_goal_hours.toString(),
          preferred_start_time: scheduleData.preferred_start_time,
          preferred_end_time: scheduleData.preferred_end_time,
          break_duration_minutes: scheduleData.break_duration_minutes.toString(),
          auto_schedule_enabled: scheduleData.auto_schedule_enabled,
        });
      }

      if (profileInfo) {
        setProfileData({
          major: profileInfo.major || '',
          grade: profileInfo.grade || '',
        });
      }

      setMajorTags(tags);

      if (preferences) {
        setVideoPreferences({
          auto_recommend: preferences.auto_recommend,
          daily_recommendation_count: preferences.daily_recommendation_count,
          preferred_duration_min: preferences.preferred_duration_min,
          preferred_duration_max: preferences.preferred_duration_max,
        });
      }

      // 设置秘书数据
      setAvatars(avatarList);
      setPersonalities(personalityList);
      setOutfits(outfitList);
      
      if (config) {
        setSecretaryConfig(config);
        setSelectedAvatarId(config.avatar?.id || '');
        setSelectedPersonalityId(config.personality?.id || '');
        setSelectedOutfitId(config.outfit?.id || '');
        setSecretaryName(config.name);
        setSecretaryEnabled(config.enabled);
      }
    } catch (error) {
      console.error('加载设置失败:', error);
      toast.error('加载设置失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const dailyGoal = parseFloat(formData.daily_study_goal_hours);
    const breakDuration = parseInt(formData.break_duration_minutes);

    if (isNaN(dailyGoal) || dailyGoal <= 0 || dailyGoal > 24) {
      toast.error('每日学习目标应在 0-24 小时之间');
      return;
    }

    if (isNaN(breakDuration) || breakDuration < 0 || breakDuration > 120) {
      toast.error('休息时长应在 0-120 分钟之间');
      return;
    }

    setSaving(true);
    const success = await updateScheduleSettings(user.id, {
      daily_study_goal_hours: dailyGoal,
      preferred_start_time: formData.preferred_start_time,
      preferred_end_time: formData.preferred_end_time,
      break_duration_minutes: breakDuration,
      auto_schedule_enabled: formData.auto_schedule_enabled,
    });

    setSaving(false);

    if (success) {
      toast.success('设置保存成功');
      loadSettings();
    } else {
      toast.error('设置保存失败');
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    const success = await updateProfile(user.id, {
      major: profileData.major || null,
      grade: profileData.grade || null,
    });

    setSaving(false);

    if (success) {
      toast.success('个人信息保存成功');
      loadSettings();
    } else {
      toast.error('个人信息保存失败');
    }
  };

  const handleVideoPreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    const success = await updateUserPreferences(user.id, {
      auto_recommend: videoPreferences.auto_recommend,
      daily_recommendation_count: videoPreferences.daily_recommendation_count,
      preferred_duration_min: videoPreferences.preferred_duration_min,
      preferred_duration_max: videoPreferences.preferred_duration_max,
    });

    setSaving(false);

    if (success) {
      toast.success('视频偏好保存成功');
      loadSettings();
    } else {
      toast.error('视频偏好保存失败');
    }
  };

  const handleSecretaryConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    const success = await updateSecretaryConfig(user.id, {
      avatarId: selectedAvatarId,
      personalityId: selectedPersonalityId,
      outfitId: selectedOutfitId,
      name: secretaryName,
      enabled: secretaryEnabled,
    });

    setSaving(false);

    if (success) {
      toast.success('秘书形象保存成功');
      loadSettings();
    } else {
      toast.error('秘书形象保存失败');
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
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-primary">设置</h1>
        <p className="text-muted-foreground mt-1">配置你的学习偏好和时间表</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            时间表设置
          </CardTitle>
          <CardDescription>设置你的学习时间偏好和目标</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="daily_goal">每日学习目标（小时）</Label>
              <Input
                id="daily_goal"
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={formData.daily_study_goal_hours}
                onChange={(e) =>
                  setFormData({ ...formData, daily_study_goal_hours: e.target.value })
                }
              />
              <p className="text-sm text-muted-foreground">
                设置你每天希望达到的学习时长目标
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_time">偏好开始时间</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={formData.preferred_start_time}
                  onChange={(e) =>
                    setFormData({ ...formData, preferred_start_time: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_time">偏好结束时间</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={formData.preferred_end_time}
                  onChange={(e) =>
                    setFormData({ ...formData, preferred_end_time: e.target.value })
                  }
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              设置你通常的学习时间段，系统会在此时间段内安排任务
            </p>

            <div className="space-y-2">
              <Label htmlFor="break_duration">休息时长（分钟）</Label>
              <Input
                id="break_duration"
                type="number"
                min="0"
                max="120"
                value={formData.break_duration_minutes}
                onChange={(e) =>
                  setFormData({ ...formData, break_duration_minutes: e.target.value })
                }
              />
              <p className="text-sm text-muted-foreground">
                每个学习时段之间的休息时间
              </p>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-0.5">
                <Label htmlFor="auto_schedule">自动生成时间表</Label>
                <p className="text-sm text-muted-foreground">
                  根据任务优先级和截止时间自动安排学习计划
                </p>
              </div>
              <Switch
                id="auto_schedule"
                checked={formData.auto_schedule_enabled}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, auto_schedule_enabled: checked })
                }
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? '保存中...' : '保存设置'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 个人信息设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            个人信息
          </CardTitle>
          <CardDescription>设置您的专业和年级信息</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="major">专业</Label>
              <Select
                value={profileData.major}
                onValueChange={(value) => setProfileData({ ...profileData, major: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择专业" />
                </SelectTrigger>
                <SelectContent>
                  {majorTags.map((tag) => (
                    <SelectItem key={tag.id} value={tag.name}>
                      {tag.name} {tag.category && `(${tag.category})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                设置专业后可获得个性化视频推荐
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">年级</Label>
              <Select
                value={profileData.grade}
                onValueChange={(value) => setProfileData({ ...profileData, grade: value })}
              >
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

            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? '保存中...' : '保存信息'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 视频推荐偏好 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            视频推荐偏好
          </CardTitle>
          <CardDescription>自定义视频推荐设置</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVideoPreferencesSubmit} className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-0.5">
                <Label htmlFor="auto_recommend">自动推荐</Label>
                <p className="text-sm text-muted-foreground">
                  根据您的专业自动推荐相关视频
                </p>
              </div>
              <Switch
                id="auto_recommend"
                checked={videoPreferences.auto_recommend}
                onCheckedChange={(checked) =>
                  setVideoPreferences({ ...videoPreferences, auto_recommend: checked })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="daily_count">每日推荐数量</Label>
              <Select
                value={videoPreferences.daily_recommendation_count.toString()}
                onValueChange={(value) =>
                  setVideoPreferences({
                    ...videoPreferences,
                    daily_recommendation_count: parseInt(value),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 个</SelectItem>
                  <SelectItem value="5">5 个</SelectItem>
                  <SelectItem value="10">10 个</SelectItem>
                  <SelectItem value="15">15 个</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? '保存中...' : '保存偏好'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 秘书形象定制 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            专属学习秘书
          </CardTitle>
          <CardDescription>定制你的专属学习秘书形象、性格和服装</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSecretaryConfigSubmit} className="space-y-6">
            {/* 启用开关 */}
            <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
              <div className="space-y-0.5">
                <Label>启用学习秘书</Label>
                <p className="text-sm text-muted-foreground">
                  开启后，秘书将在仪表盘和浮窗中为你提供问候和提醒
                </p>
              </div>
              <Switch
                checked={secretaryEnabled}
                onCheckedChange={setSecretaryEnabled}
              />
            </div>

            {/* 秘书名称 */}
            <div className="space-y-2">
              <Label htmlFor="secretary_name">秘书名称</Label>
              <Input
                id="secretary_name"
                value={secretaryName}
                onChange={(e) => setSecretaryName(e.target.value)}
                placeholder="给你的秘书起个名字"
              />
            </div>

            <Separator />

            {/* 选择形象 */}
            <div className="space-y-3">
              <Label>选择形象</Label>
              <Tabs defaultValue="avatar" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="avatar">形象</TabsTrigger>
                  <TabsTrigger value="personality">性格</TabsTrigger>
                  <TabsTrigger value="outfit">服装</TabsTrigger>
                </TabsList>

                <TabsContent value="avatar" className="space-y-3 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {avatars.map((avatar) => (
                      <SecretaryCard
                        key={avatar.id}
                        item={avatar}
                        type="avatar"
                        selected={selectedAvatarId === avatar.id}
                        onClick={() => setSelectedAvatarId(avatar.id)}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="personality" className="space-y-3 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {personalities.map((personality) => (
                      <SecretaryCard
                        key={personality.id}
                        item={personality}
                        type="personality"
                        selected={selectedPersonalityId === personality.id}
                        onClick={() => setSelectedPersonalityId(personality.id)}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="outfit" className="space-y-3 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {outfits.map((outfit) => (
                      <SecretaryCard
                        key={outfit.id}
                        item={outfit}
                        type="outfit"
                        selected={selectedOutfitId === outfit.id}
                        onClick={() => setSelectedOutfitId(outfit.id)}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? '保存中...' : '保存配置'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-primary" />
            其他设置
          </CardTitle>
          <CardDescription>更多个性化配置选项</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-0.5">
                <Label>任务提醒</Label>
                <p className="text-sm text-muted-foreground">
                  在任务截止前发送提醒通知
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-0.5">
                <Label>复习提醒</Label>
                <p className="text-sm text-muted-foreground">
                  在知识点需要复习时发送提醒
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-0.5">
                <Label>学习统计</Label>
                <p className="text-sm text-muted-foreground">
                  记录和分析你的学习数据
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
