import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { getScheduleSettings, updateScheduleSettings } from '@/db/api';
import type { ScheduleSettings } from '@/types/types';
import { Settings as SettingsIcon, Clock, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<ScheduleSettings | null>(null);

  const [formData, setFormData] = useState({
    daily_study_goal_hours: '8',
    preferred_start_time: '08:00',
    preferred_end_time: '22:00',
    break_duration_minutes: '15',
    auto_schedule_enabled: true,
  });

  useEffect(() => {
    if (!user) return;
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;
    setLoading(true);
    const data = await getScheduleSettings(user.id);
    if (data) {
      setSettings(data);
      setFormData({
        daily_study_goal_hours: data.daily_study_goal_hours.toString(),
        preferred_start_time: data.preferred_start_time,
        preferred_end_time: data.preferred_end_time,
        break_duration_minutes: data.break_duration_minutes.toString(),
        auto_schedule_enabled: data.auto_schedule_enabled,
      });
    }
    setLoading(false);
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
