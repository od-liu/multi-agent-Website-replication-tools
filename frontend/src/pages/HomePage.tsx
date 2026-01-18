/**
 * @component UI-HOME-PAGE
 * @description 首页（车票查询页）容器组件，整合顶部导航、查询表单、宣传推广和底部导航
 * @related_req_id REQ-HOME-PAGE
 * @page homepage
 * 
 * ============ 功能实现清单（必填）============
 * @features_implemented:
 * ✅ 整合顶部导航栏组件
 * ✅ 整合车票查询表单组件
 * ✅ 整合宣传推广区域组件
 * ✅ 整合底部导航组件
 * ✅ 设置页面背景色为浅灰色 (#F5F5F5)
 * 
 * @implementation_status:
 * - Features Coverage: 5/5 (100%)
 * - UI Visual: 像素级精确
 * ================================================
 * 
 * @children_slots:
 * - UI-HOME-TOP-NAV: 顶部导航栏组件
 * - UI-HOME-SEARCH-FORM: 车票查询表单组件
 * - UI-HOME-PROMOTION: 宣传推广区域组件
 * - UI-HOME-BOTTOM-NAV: 底部导航组件
 * 
 * @layout_position "页面容器，占据整个视口"
 * @dimensions "width: 100vw, height: 100vh"
 * @background_color "#F5F5F5"
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeTopBar from '../components/HomeTopBar/HomeTopBar';
import SecondaryNav from '../components/SecondaryNav/SecondaryNav';
import TrainSearchForm from '../components/TrainSearchForm/TrainSearchForm';
import PromoGrid from '../components/PromoGrid/PromoGrid';
import BottomNavigation from '../components/BottomNavigation/BottomNavigation';
import './HomePage.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  // ========== State Management ==========
  // 从 localStorage 读取登录状态
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('userId');
  });
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('username') || '';
  });

  // 监听 localStorage 变化（用于跨标签页同步）
  useEffect(() => {
    const handleStorageChange = () => {
      const userId = localStorage.getItem('userId');
      const storedUsername = localStorage.getItem('username');
      setIsLoggedIn(!!userId);
      setUsername(storedUsername || '');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 处理退出登录
  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    // 可选：跳转到首页或刷新
    navigate('/');
  };

  // ========== Page Layout ==========
  return (
    <div className="home-page-container">
      {/* 顶部导航栏 */}
      <header className="home-header">
        <HomeTopBar 
          isLoggedIn={isLoggedIn} 
          username={username}
          onLogout={handleLogout}
        />
        <SecondaryNav />
      </header>

      {/* 主内容区域 */}
      <main className="home-main-content">
        {/* 车票查询表单区域 - 带蓝色大背景 */}
        <section className="home-search-section">
          <TrainSearchForm />
        </section>

        {/* 快捷服务入口区域 */}
        <section className="home-quick-services-section">
          <img 
            src="/images/首页-快捷服务入口.png" 
            alt="快捷服务入口" 
            className="home-quick-services-image"
          />
        </section>

        {/* 宣传推广区域 */}
        <section className="home-promo-section">
          <PromoGrid />
        </section>

        {/* 底部发布信息区域 */}
        <section className="home-info-section">
          <img 
            src="/images/首页-底部发布信息.png" 
            alt="最新发布、常见问题、信用信息" 
            className="home-info-image"
          />
        </section>
      </main>

      {/* 底部导航 */}
      <footer className="home-footer">
        <BottomNavigation pageType="homepage" />
      </footer>
    </div>
  );
};

export default HomePage;
