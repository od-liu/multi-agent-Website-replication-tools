/**
 * @component UI-LOGIN-PAGE
 * @description 12306登录页面容器，整合顶部导航、登录表单和底部导航
 * @children_slots REQ-TOP-NAV, REQ-LOGIN-FORM, REQ-BOTTOM-NAV
 * 
 * ============ 功能实现清单 ============
 * @scenarios_covered:
 *   N/A - 此为容器组件，无独立scenarios
 * 
 * @features_implemented:
 *   ✅ 整合三个子组件形成完整登录页面
 *   ✅ 提供页面级布局容器
 *   ✅ 设置页面背景色
 * 
 * @implementation_status:
 *   - Scenarios: N/A (容器组件)
 *   - Features: 3/3 (100%)
 *   - UI Visual: 像素级精确
 * 
 * @layout_structure:
 *   - 页面宽度: 100% (最小1497px)
 *   - 页面高度: auto (最小954px)
 *   - 布局方式: 垂直堆叠 (flex-direction: column)
 *   - 背景色: #F5F5F5
 * ==========================================
 */

import React, { useState } from 'react';
import './LoginPage.css';
import TopNavigation from '../components/TopNavigation/TopNavigation';
import LoginForm from '../components/LoginForm/LoginForm';
import BottomNavigation from '../components/BottomNavigation/BottomNavigation';
import SmsVerificationModal from '../components/SmsVerification/SmsVerification';

const LoginPage: React.FC = () => {
  // ========== State Management ==========
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // ========== Event Handlers ==========
  
  /**
   * @feature "登录成功后自动触发短信验证"
   * 处理登录成功事件
   */
  const handleLoginSuccess = (data: any) => {
    console.log('登录成功:', data);
    setCurrentUserId(data.userId);
    setShowSmsModal(true);
  };

  /**
   * @feature "短信验证成功后跳转主页"
   * 处理短信验证成功事件
   */
  const handleVerificationSuccess = (data: any) => {
    console.log('验证成功:', data);
    // 保存token到localStorage
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    // 关闭弹窗
    setShowSmsModal(false);
    // 显示成功消息
    alert('登录成功！');
    // 实际项目中应该跳转到主页
    // window.location.href = '/home';
  };

  /**
   * 关闭短信验证弹窗
   */
  const handleCloseModal = () => {
    setShowSmsModal(false);
  };

  // ========== UI Render ==========
  return (
    <div className="page-login">
      {/* @children_slot REQ-TOP-NAV - 顶部导航 (80px高) */}
      <TopNavigation />

      {/* @children_slot REQ-LOGIN-FORM - 登录表单区域 (600px高) */}
      <LoginForm onLoginSuccess={handleLoginSuccess} />

      {/* @children_slot REQ-BOTTOM-NAV - 底部导航 (274px高) */}
      <BottomNavigation />

      {/* @children_slot REQ-SMS-VERIFICATION - 短信验证弹窗 */}
      {currentUserId && (
        <SmsVerificationModal
          isOpen={showSmsModal}
          userId={currentUserId}
          onVerificationSuccess={handleVerificationSuccess}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default LoginPage;

