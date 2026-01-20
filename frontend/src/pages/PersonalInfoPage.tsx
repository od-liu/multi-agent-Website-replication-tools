/**
 * @component UI-PERSONAL-INFO-PAGE
 * @description 个人信息页面容器组件，整合顶部导航、主导航、侧边栏菜单、个人信息内容和底部导航
 * @page personal-info
 * @layout_position "全屏页面，垂直布局"
 * @children_slots REQ-PERSONAL-SIDEBAR, REQ-PERSONAL-INFO-TAB
 * 
 * ============ 功能实现清单（必填）============
 * @scenarios_covered: (无具体scenarios)
 * - 页面布局和组件整合
 * 
 * @features_implemented:
 * ✅ 显示用户基本信息
 * ✅ 支持修改个人信息
 * ✅ 管理乘车人信息
 * ✅ 查看订单历史
 * 
 * @implementation_status:
 * - Features Coverage: 4/4 (100%)
 * - UI Visual: 像素级精确
 * ================================================
 */

import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import HomeTopBar from '../components/HomeTopBar/HomeTopBar';
import SecondaryNav from '../components/SecondaryNav/SecondaryNav';
import SideMenu from '../components/SideMenu/SideMenu';
import PersonalInfoPanel from '../components/PersonalInfoPanel/PersonalInfoPanel';
import PassengerManagePanel from '../components/PassengerManagePanel/PassengerManagePanel';
import OrderHistoryPanel from '../components/OrderHistoryPanel/OrderHistoryPanel';
import BottomNavigation from '../components/BottomNavigation/BottomNavigation';
import './PersonalInfoPage.css';

const PersonalInfoPage: React.FC = () => {
  const location = useLocation();
  const { isLoggedIn, username, handleLogout } = useAuth();
  
  // 根据URL路径判断当前显示哪个面板
  const getCurrentPanel = () => {
    if (location.pathname === '/passengers') return 'passengers';
    if (location.pathname === '/orders') return 'orders';
    return 'personal-info';
  };
  
  const currentPanel = getCurrentPanel();
  
  // 根据当前面板更新面包屑
  const getBreadcrumbText = () => {
    if (currentPanel === 'passengers') return '当前位置：个人中心 > 常用信息管理 > 乘车人';
    // 与目标页 train_order.html 保持一致：不显示“订单中心”层级，且不加空格
    if (currentPanel === 'orders') return '当前位置：个人中心>火车票订单';
    return '当前位置：个人中心 > 查看个人信息';
  };

  return (
    <div className="personal-info-page">
      {/* 顶部导航栏（统一样式） */}
      <header className="personal-info-header">
        <HomeTopBar isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />
        <SecondaryNav />
      </header>
      
      {/* 面包屑导航 */}
      <div className="breadcrumb-container">
        <span className="breadcrumb-text">{getBreadcrumbText()}</span>
      </div>
      
      {/* 主内容区域 */}
      <div className="personal-main-content">
        {/* 左侧菜单 */}
        <SideMenu />
        
        {/* 右侧内容区域 */}
        <div className="personal-content-area">
          {currentPanel === 'personal-info' && <PersonalInfoPanel />}
          {currentPanel === 'passengers' && <PassengerManagePanel />}
          {currentPanel === 'orders' && <OrderHistoryPanel />}
        </div>
      </div>
      
      {/* 底部导航（共享组件） */}
      <BottomNavigation pageType="personal-info" />
    </div>
  );
};

export default PersonalInfoPage;
