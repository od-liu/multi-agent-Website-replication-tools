/**
 * @component UI-TOP-NAV
 * @description 顶部导航栏，包含品牌Logo和欢迎文字
 * @calls 无 - 纯展示组件
 * @children_slots 无
 * 
 * ============ 功能实现清单（必填）============
 * @scenarios_covered: 无scenarios（纯展示组件）
 * 
 * @features_implemented:
 *   ✅ 显示中国铁路12306品牌Logo
 *   ✅ 显示"欢迎登录12306"文字
 *   ✅ 固定高度80px，左对齐布局
 * 
 * @implementation_status:
 *   - Scenarios Coverage: N/A (纯展示组件)
 *   - Features Coverage: 3/3 (100%)
 *   - UI Visual: 像素级精确（参考ui-style-guide.md第3.3节）
 * 
 * @layout_position "页面最上方，作为login-page-container的第一个子元素"
 * @dimensions "宽度100%，高度80px"
 * ================================================
 */

import React from 'react';
import './TopNavigation.css';

export const TopNavigation: React.FC = () => {
  return (
    <div className="top-navigation">
      {/* Logo区域 - 左侧 */}
      <div className="top-navigation-logo">
        <img 
          src="/images/登录页-顶部导航区域-中国铁路Logo.png" 
          alt="中国铁路12306"
        />
      </div>
      
      {/* 欢迎文字 - Logo右侧 */}
      <div className="top-navigation-welcome">
        欢迎登录12306
      </div>
    </div>
  );
};

export default TopNavigation;

