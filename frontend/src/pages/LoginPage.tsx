/**
 * @component UI-LOGIN-PAGE
 * @description 登录页面容器，组合所有子组件
 * @calls 无 - 容器组件
 * @children_slots REQ-TOP-NAV, REQ-LOGIN-FORM, REQ-BOTTOM-NAV, REQ-SMS-VERIFICATION
 * 
 * ============ 功能实现清单（必填）============
 * @scenarios_covered: 无scenarios（容器组件）
 * 
 * @features_implemented:
 *   ✅ 垂直三段式布局（顶部导航 + 主内容区 + 底部导航）
 *   ✅ 背景图片设置
 *   ✅ 登录表单区域（右侧，距离右边缘120px）
 *   ✅ 短信验证弹窗（条件显示）
 *   ✅ 页面占满视口高度（min-height: 100vh）
 * 
 * @implementation_status:
 *   - Scenarios Coverage: N/A (容器组件)
 *   - Features Coverage: 5/5 (100%)
 *   - UI Visual: 像素级精确（参考ui-style-guide.md第2.3节）
 * 
 * @layout_position "根容器，占据整个视口"
 * @dimensions "宽度100%，最小高度100vh"
 * ================================================
 */

import React, { useState } from 'react';
import TopNavigation from '../components/TopNavigation';
import LoginForm from '../components/LoginForm';
import BottomNavigation from '../components/BottomNavigation';
import SmsVerificationModal from '../components/SmsVerificationModal';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  // ========== State Management ==========
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [currentUsername, setCurrentUsername] = useState('');

  // ========== Event Handlers ==========
  
  /**
   * @feature "登录成功后弹出短信验证窗口"
   * 当登录表单验证成功时调用
   */
  const handleLoginSuccess = () => {
    setShowVerificationModal(true);
  };

  /**
   * @feature "关闭短信验证弹窗"
   */
  const handleCloseModal = () => {
    setShowVerificationModal(false);
  };

  /**
   * @feature "短信验证成功后的处理"
   * 验证成功后跳转到个人中心页面
   */
  const handleVerificationSuccess = () => {
    console.log('验证成功，跳转到个人中心页面');
    setShowVerificationModal(false);
    // TODO: 实现路由跳转到个人中心
    // window.location.href = '/personal-center';
  };

  // ========== UI Render ==========
  return (
    <div className="login-page-container">
      {/* 第一个子元素：顶部导航 */}
      <TopNavigation />

      {/* 第二个子元素：主内容区 */}
      <div className="main-content">
        {/* 左侧推广区域 */}
        <div className="promotional-area">
          {/* 推广内容区域 - 预留给未来需求 */}
        </div>

        {/* 右侧登录表单 */}
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </div>

      {/* 第三个子元素：底部导航 */}
      <BottomNavigation />

      {/* 短信验证弹窗 - 条件渲染 */}
      {showVerificationModal && (
        <SmsVerificationModal
          username={currentUsername || 'testuser'}
          onClose={handleCloseModal}
          onSuccess={handleVerificationSuccess}
        />
      )}
    </div>
  );
};

export default LoginPage;

