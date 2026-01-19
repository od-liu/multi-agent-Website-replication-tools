/**
 * @hook useAuth
 * @description 获取用户登录状态和用户信息的自定义Hook
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserInfo {
  userId: string;
  username: string;
  isLoggedIn: boolean;
}

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  // 从 localStorage 加载用户信息
  useEffect(() => {
    const loadUserInfo = () => {
      const userInfoStr = localStorage.getItem('user_info');
      if (userInfoStr) {
        try {
          const userInfo: UserInfo = JSON.parse(userInfoStr);
          setIsLoggedIn(userInfo.isLoggedIn || false);
          setUsername(userInfo.username || '');
          setUserId(userInfo.userId || '');
        } catch (error) {
          console.error('Failed to parse user info:', error);
          setIsLoggedIn(false);
          setUsername('');
          setUserId('');
        }
      }
    };

    loadUserInfo();

    // 监听 storage 事件，当其他标签页修改了用户信息时同步更新
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user_info') {
        loadUserInfo();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 退出登录
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    setIsLoggedIn(false);
    setUsername('');
    setUserId('');
    navigate('/login');
  };

  return {
    isLoggedIn,
    username,
    userId,
    handleLogout
  };
};

/**
 * @function getUserInfo
 * @description 同步获取用户信息（不使用Hook）
 */
export const getUserInfo = (): UserInfo | null => {
  const userInfoStr = localStorage.getItem('user_info');
  if (userInfoStr) {
    try {
      return JSON.parse(userInfoStr);
    } catch (error) {
      console.error('Failed to parse user info:', error);
      return null;
    }
  }
  return null;
};
