import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { isAdmin } from '@/db/api';

/**
 * 管理员权限检查Hook
 * 用于检查当前用户是否具有管理员权限
 */
export function useAdmin() {
  const { user } = useAuth();
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      if (!user) {
        setIsAdminUser(false);
        setLoading(false);
        return;
      }

      try {
        const adminStatus = await isAdmin(user.id);
        setIsAdminUser(adminStatus);
      } catch (error) {
        console.error('检查管理员权限失败:', error);
        setIsAdminUser(false);
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, [user]);

  return { isAdmin: isAdminUser, loading };
}
