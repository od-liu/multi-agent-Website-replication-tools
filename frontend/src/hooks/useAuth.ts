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
      // 优先从单独的键读取（与其他页面保持一致）
      const storedUserId = localStorage.getItem('userId');
      const storedUsername = localStorage.getItem('username');
      
      if (storedUserId) {
        setIsLoggedIn(true);
        setUsername(storedUsername || '');
        setUserId(storedUserId);
        return;
      }

      // 兼容旧的 user_info JSON 格式
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
      if (e.key === 'user_info' || e.key === 'userId' || e.key === 'username') {
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
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
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
  // 优先从单独的键读取（与其他页面保持一致）
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');
  
  if (userId) {
    return {
      userId,
      username: username || '',
      isLoggedIn: true
    };
  }

  // 兼容旧的 user_info JSON 格式
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
