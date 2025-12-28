/**
 * @component UI-TOP-NAV
 * @description 页面顶部导航栏，包含品牌Logo和欢迎文字
 * @calls N/A - 纯展示组件，无API调用
 * 
 * ============ 功能实现清单 ============
 * @scenarios_covered:
 *   N/A - 此为纯展示组件，无交互scenarios
 * 
 * @features_implemented:
 *   ✅ 显示12306品牌Logo（使用CSS背景图）
 *   ✅ 显示欢迎文字"欢迎登录12306"
 *   ✅ Logo点击可跳转到首页
 *   ✅ Logo文字隐藏但保留在DOM中（SEO和无障碍）
 * 
 * @implementation_status:
 *   - Scenarios: N/A (纯展示组件)
 *   - Features: 4/4 (100%)
 *   - UI Visual: 像素级精确
 * 
 * @layout_position:
 *   - 位置: 页面最上方，横向占据整个页面宽度
 *   - 尺寸: 100% × 80px
 *   - 布局: position: relative, z-index: 2000
 * 
 * @resources:
 *   images: ["/images/登录页面-顶部导航-Logo.png"]
 * ==========================================
 */

import React from 'react';
import './TopNavigation.css';

const TopNavigation: React.FC = () => {
  return (
    <div className="top-navigation-header" role="complementary" aria-label="头部">
      <div className="top-navigation-wrapper">
        <div className="top-navigation-header-con">
          {/* Logo区域 - 使用CSS背景图实现 */}
          <h1 className="top-navigation-logo" role="banner">
            <a href="https://www.12306.cn/index/index.html">中国铁路12306</a>
          </h1>
          
          {/* 欢迎文字 */}
          <div className="top-navigation-header-welcome">欢迎登录12306</div>
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;

