-- 修复用户偏好设置的RLS策略，使用正确的auth.uid()函数

-- 删除所有旧策略
DROP POLICY IF EXISTS "用户可以查看自己的偏好设置" ON user_preferences;
DROP POLICY IF EXISTS "用户可以创建自己的偏好设置" ON user_preferences;
DROP POLICY IF EXISTS "用户可以更新自己的偏好设置" ON user_preferences;

-- 创建新的SELECT策略
CREATE POLICY "用户可以查看自己的偏好设置"
ON user_preferences
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 创建新的INSERT策略
CREATE POLICY "用户可以创建自己的偏好设置"
ON user_preferences
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- 创建新的UPDATE策略
CREATE POLICY "用户可以更新自己的偏好设置"
ON user_preferences
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());