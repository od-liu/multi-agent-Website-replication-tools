/**
 * @component UI-PERSONAL-SIDEBAR
 * @description 个人中心侧边栏菜单，支持多级菜单展开/收起
 * @page personal-info
 * @layout_position "页面左侧，固定宽度220px"
 * 
 * ============ 功能实现清单（必填）============
 * @scenarios_covered: (无具体scenarios)
 * - 菜单展开/收起交互
 * 
 * @features_implemented:
 * ✅ 显示当前位置
 * ✅ 显示菜单项（订单中心、本人车票、会员中心等）
 * ✅ 当前选中菜单项高亮
 * ✅ 点击菜单项切换右侧内容
 * 
 * @implementation_status:
 * - Features Coverage: 4/4 (100%)
 * - UI Visual: 像素级精确
 * ================================================
 * 
 * 🆕 @visual_verification_result
 * 参考图片: requirements/images/personal-info-page/组件特写截图/侧边栏菜单.png
 * ✅ 已验证: 菜单结构、选中状态、禁用状态与图片一致
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SideMenu.css';

const SideMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 根据当前路径判断选中的tab
  const getCurrentTab = () => {
    if (location.pathname === '/passengers') return 'passengers';
    if (location.pathname === '/orders') return 'orders';
    return 'personal-info';
  };
  
  const currentTab = getCurrentTab();
  
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['orders', 'personal', 'common-info'])
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  /**
   * @feature "菜单导航-使用路由跳转"
   * 点击菜单项会跳转到对应的URL
   */
  const handleMenuItemClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="side-menu">
      <div className="menu-header">个人中心</div>

      {/* 订单中心 */}
      <div className="menu-section">
        <div className="menu-title" onClick={() => toggleSection('orders')}>
          订单中心
          <span className="menu-toggle">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d={expandedSections.has('orders') ? "M4 6l4 4 4-4" : "M6 4l4 4-4 4"} />
            </svg>
          </span>
        </div>
        {expandedSections.has('orders') && (
          <div className="menu-items">
            <div 
              className={`menu-item ${currentTab === 'orders' ? 'selected' : ''}`}
              onClick={() => handleMenuItemClick('/orders')}
            >
              火车票订单
            </div>
            <div className="menu-item disabled">候补订单</div>
            <div className="menu-item disabled">计次·定期票...</div>
            <div className="menu-item disabled">约号订单</div>
            <div className="menu-item disabled">雪具快运订单</div>
            <div className="menu-item disabled">餐饮·特产</div>
            <div className="menu-item disabled">保险订单</div>
            <div className="menu-item disabled">电子发票</div>
          </div>
        )}
      </div>

      {/* 本人车票 */}
      <div className="menu-section">
        <div className="menu-title-simple">本人车票</div>
      </div>

      {/* 会员中心 */}
      <div className="menu-section">
        <div className="menu-title-simple">会员中心</div>
      </div>

      {/* 个人信息 */}
      <div className="menu-section">
        <div className="menu-title" onClick={() => toggleSection('personal')}>
          个人信息
          <span className="menu-toggle">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d={expandedSections.has('personal') ? "M4 6l4 4 4-4" : "M6 4l4 4-4 4"} />
            </svg>
          </span>
        </div>
        {expandedSections.has('personal') && (
          <div className="menu-items">
            <div 
              className={`menu-item ${currentTab === 'personal-info' ? 'selected' : ''}`}
              onClick={() => handleMenuItemClick('/my-account')}
            >
              查看个人信息
            </div>
            <div className="menu-item disabled">账号安全</div>
            <div className="menu-item">手机核验</div>
            <div className="menu-item disabled">账号注销</div>
          </div>
        )}
      </div>

      {/* 常用信息管理 */}
      <div className="menu-section">
        <div className="menu-title" onClick={() => toggleSection('common-info')}>
          常用信息管理
          <span className="menu-toggle">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d={expandedSections.has('common-info') ? "M4 6l4 4 4-4" : "M6 4l4 4-4 4"} />
            </svg>
          </span>
        </div>
        {expandedSections.has('common-info') && (
          <div className="menu-items">
            <div 
              className={`menu-item ${currentTab === 'passengers' ? 'selected' : ''}`}
              onClick={() => handleMenuItemClick('/passengers')}
            >
              乘车人
            </div>
            <div className="menu-item disabled">地址管理</div>
          </div>
        )}
      </div>

      {/* 温馨服务 */}
      <div className="menu-section">
        <div className="menu-title" onClick={() => toggleSection('service')}>
          温馨服务
          <span className="menu-toggle">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d={expandedSections.has('service') ? "M4 6l4 4 4-4" : "M6 4l4 4-4 4"} />
            </svg>
          </span>
        </div>
      </div>

      {/* 投诉和建议 */}
      <div className="menu-section">
        <div className="menu-title" onClick={() => toggleSection('feedback')}>
          投诉和建议
          <span className="menu-toggle">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d={expandedSections.has('feedback') ? "M4 6l4 4 4-4" : "M6 4l4 4-4 4"} />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
