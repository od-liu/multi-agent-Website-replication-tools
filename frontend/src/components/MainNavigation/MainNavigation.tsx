/**
 * @component UI-MAIN-NAV
 * @description 主导航菜单（蓝色横栏），显示主要导航项
 * @calls N/A - 纯导航组件，无API调用
 * @related_req_id REQ-TRAIN-LIST-PAGE (作为页面布局的一部分)
 * @page train-list
 * 
 * ============ 功能实现清单 ============
 * @scenarios_covered:
 *   N/A - 此为纯导航组件，无特定业务场景
 * 
 * @features_implemented:
 *   ✅ 显示主要导航菜单项（首页、车票、团购服务等8个菜单）
 *   ✅ 支持点击导航（跳转到对应页面）
 *   ✅ 显示下拉箭头（表示有子菜单）
 *   ✅ 悬停效果（文字下划线 + 透明度变化）
 *   ✅ 响应式布局（居中对齐，最大宽度1512px）
 * 
 * @implementation_status:
 *   - Scenarios: N/A (纯导航组件)
 *   - Features: 5/5 (100%)
 *   - UI Visual: 像素级精确
 * ==========================================
 * 
 * @layout_position:
 *   - 位置: 顶部导航栏下方，横向占据整个页面宽度
 *   - 尺寸: 100% × 46px
 *   - 背景: #3B99FC (主题蓝色)
 * 
 * @resources:
 *   - 无外部图片资源（纯文本导航）
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainNavigation.css';

interface MainNavigationProps {
  activeItem?: string; // 当前选中的菜单项，如 "首页", "车票" 等
}

const MainNavigation: React.FC<MainNavigationProps> = ({ activeItem }) => {
  const navigate = useNavigate();

  // ========== 导航菜单项配置 ==========
  const navItems = [
    { label: '首页', path: '/', hasDropdown: false },
    { label: '车票', path: '/tickets', hasDropdown: true },
    { label: '团购服务', path: '/group-purchase', hasDropdown: true },
    { label: '会员服务', path: '/member-services', hasDropdown: true },
    { label: '站车服务', path: '/station-services', hasDropdown: true },
    { label: '商旅服务', path: '/business-services', hasDropdown: true },
    { label: '出行指南', path: '/travel-guide', hasDropdown: true },
    { label: '信息查询', path: '/info-query', hasDropdown: true }
  ];

  // ========== Feature Implementations ==========

  /**
   * @feature "支持点击导航"
   * 点击菜单项跳转到对应页面
   */
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  // ========== UI Render ==========
  return (
    <div className="main-navigation">
      <div className="nav-container">
        {/* @feature "显示主要导航菜单项" - 8个菜单项 */}
        {navItems.map((item, index) => (
          <a
            key={index}
            href={item.path}
            className={item.label === activeItem ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              handleNavigate(item.path);
            }}
          >
            {item.label}
            {/* @feature "显示下拉箭头" - 表示有子菜单 */}
            {item.hasDropdown && (
              <span className="dropdown-arrow">▼</span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
};

export default MainNavigation;
