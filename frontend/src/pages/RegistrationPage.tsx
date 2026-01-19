/**
 * Registration Page Container
 * 注册页面容器组件，整合顶部导航、注册表单和底部导航
 */

import React from 'react';
import { useAuth } from '../hooks/useAuth';
import HomeTopBar from '../components/HomeTopBar/HomeTopBar';
import SecondaryNav from '../components/SecondaryNav/SecondaryNav';
import RegistrationForm from '../components/RegistrationForm/RegistrationForm';
import BottomNavigation from '../components/BottomNavigation/BottomNavigation';
import './RegistrationPage.css';

const RegistrationPage: React.FC = () => {
  const { isLoggedIn, username, handleLogout } = useAuth();
  
  return (
    <div className="registration-page">
      <HomeTopBar isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />
      <SecondaryNav />
      <main className="registration-main">
        <div className="breadcrumb">
          您现在的位置：<a href="/">客运首页</a>&nbsp;&gt;&nbsp;<a href="/register">注册</a>
        </div>
        <RegistrationForm />
      </main>
      <BottomNavigation pageType="registration" />
    </div>
  );
};

export default RegistrationPage;
