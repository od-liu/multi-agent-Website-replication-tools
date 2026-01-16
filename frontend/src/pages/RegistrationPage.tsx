/**
 * Registration Page Container
 * 注册页面容器组件，整合顶部导航、注册表单和底部导航
 */

import React from 'react';
import HomeTopBar from '../components/HomeTopBar/HomeTopBar';
import SecondaryNav from '../components/SecondaryNav/SecondaryNav';
import RegistrationForm from '../components/RegistrationForm/RegistrationForm';
import BottomNavigation from '../components/BottomNavigation/BottomNavigation';
import './RegistrationPage.css';

const RegistrationPage: React.FC = () => {
  return (
    <div className="registration-page">
      <HomeTopBar />
      <SecondaryNav />
      <main className="registration-main">
        <div className="breadcrumb">
          您现在的位置：<a href="/">客运首页</a> &gt; 注册
        </div>
        <RegistrationForm />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default RegistrationPage;
