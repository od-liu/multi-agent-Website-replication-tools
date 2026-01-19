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
 * ✅ 设置页面背景色为白色 (#FFFFFF)
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
 * @background_color "#FFFFFF"
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

          {/* 右侧悬浮工具条（与原站一致的4个入口） */}
          <nav className="home-right-float-nav" aria-label="右侧悬浮工具条">
            <ul className="home-right-float-navList">
              <li className="home-right-float-navItem">
                <a className="home-right-float-navLink" href="#" aria-label="最新发布">
                  <span className="home-right-float-icon" aria-hidden="true">
                    {/* notice */}
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Zm6-6V11a6 6 0 1 0-12 0v5L4 18v1h16v-1l-2-2Z"/>
                    </svg>
                  </span>
                  <span className="home-right-float-text">最新发布</span>
                </a>
              </li>
              <li className="home-right-float-navItem">
                <a className="home-right-float-navLink" href="#" aria-label="联系客服">
                  <span className="home-right-float-icon" aria-hidden="true">
                    {/* phone */}
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.07 21 3 13.93 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.24 1.02l-2.21 2.2Z"/>
                    </svg>
                  </span>
                  <span className="home-right-float-text">联系客服</span>
                </a>
              </li>
              <li className="home-right-float-navItem">
                <a className="home-right-float-navLink" href="#" aria-label="APP下载">
                  <span className="home-right-float-icon" aria-hidden="true">
                    {/* qr */}
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M3 3h8v8H3V3Zm2 2v4h4V5H5Zm8-2h8v8h-8V3Zm2 2v4h4V5h-4ZM3 13h8v8H3v-8Zm2 2v4h4v-4H5Zm10 0h2v2h-2v-2Zm0 4h2v2h-2v-2Zm-2-2h2v2h-2v-2Zm6 0h2v4h-4v-2h2v-2Zm-2-2h4v2h-4v-2Z"/>
                    </svg>
                  </span>
                  <span className="home-right-float-text">APP下载</span>
                </a>
              </li>
              <li className="home-right-float-navItem home-right-float-navItem--close">
                <a className="home-right-float-navLink" href="#" aria-label="关闭">
                  <span className="home-right-float-icon" aria-hidden="true">
                    {/* close */}
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.29 19.71 2.88 18.29 9.17 12 2.88 5.71 4.29 4.29l6.3 6.3 6.29-6.3 1.42 1.42Z"/>
                    </svg>
                  </span>
                  <span className="home-right-float-text">关闭</span>
                </a>
              </li>
            </ul>
          </nav>
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
