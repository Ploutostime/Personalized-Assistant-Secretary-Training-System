-- 添加用户偏好设置的INSERT策略
-- 允许用户创建自己的偏好设置

-- 删除旧的策略（如果存在）
DROP POLICY IF EXISTS "用户可以创建自己的偏好设置" ON user_preferences;

-- 创建新的INSERT策略
CREATE POLICY "用户可以创建自己的偏好设置"
ON user_preferences
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- 同时确保UPDATE策略正确
DROP POLICY IF EXISTS "用户可以更新自己的偏好设置" ON user_preferences;

CREATE POLICY "用户可以更新自己的偏好设置"
ON user_preferences
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());