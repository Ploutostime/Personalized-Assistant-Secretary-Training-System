-- 添加性能优化索引

-- 为 tasks 表添加索引
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(deadline);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON tasks(user_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_user_deadline ON tasks(user_id, deadline);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);

-- 为 knowledge_items 表添加索引
CREATE INDEX IF NOT EXISTS idx_knowledge_user_id ON knowledge_items(user_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_subject ON knowledge_items(subject);
CREATE INDEX IF NOT EXISTS idx_knowledge_user_subject ON knowledge_items(user_id, subject);
CREATE INDEX IF NOT EXISTS idx_knowledge_created_at ON knowledge_items(created_at);
CREATE INDEX IF NOT EXISTS idx_knowledge_next_review ON knowledge_items(next_review_at);

-- 为 study_sessions 表添加索引
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_start_time ON study_sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_start ON study_sessions(user_id, start_time);
CREATE INDEX IF NOT EXISTS idx_study_sessions_created_at ON study_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_study_sessions_task_id ON study_sessions(task_id);

-- 为 secretary_outfit_images 表添加索引
CREATE INDEX IF NOT EXISTS idx_outfit_images_secretary ON secretary_outfit_images(secretary_avatar_id);
CREATE INDEX IF NOT EXISTS idx_outfit_images_outfit ON secretary_outfit_images(outfit_id);
CREATE INDEX IF NOT EXISTS idx_outfit_images_combo ON secretary_outfit_images(secretary_avatar_id, outfit_id);

-- 为 secretary_avatars 表添加索引
CREATE INDEX IF NOT EXISTS idx_secretary_type ON secretary_avatars(type);
CREATE INDEX IF NOT EXISTS idx_secretary_category ON secretary_avatars(category);

-- 为 secretary_outfits 表添加索引
CREATE INDEX IF NOT EXISTS idx_outfits_type ON secretary_outfits(type);

-- 为 secretary_chat_history 表添加索引
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON secretary_chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_role ON secretary_chat_history(role);
CREATE INDEX IF NOT EXISTS idx_chat_history_created_at ON secretary_chat_history(created_at);

-- 为 profiles 表添加索引
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- 为 user_preferences 表添加索引
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);