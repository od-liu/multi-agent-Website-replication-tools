/**
 * @component UI-SECONDARY-NAV
 * @description 二级蓝色导航栏，包含主导航菜单（首页、车票、团购服务等）
 * @page homepage
 */

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SecondaryNav.css';

const SecondaryNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: '首页', path: '/', hasDropdown: false },
    { label: '车票', path: '/trains', hasDropdown: true },
    { label: '团购服务', path: '#', hasDropdown: true },
    { label: '会员服务', path: '#', hasDropdown: true },
    { label: '站车服务', path: '#', hasDropdown: true },
    { label: '商旅服务', path: '#', hasDropdown: true },
    { label: '出行指南', path: '#', hasDropdown: true },
    { label: '信息查询', path: '#', hasDropdown: true },
  ];

  const handleNavClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (path !== '#') {
      navigate(path);
    }
  };

  return (
    <nav className="secondary-nav">
      <div className="secondary-nav-container">
        {navItems.map((item, index) => {
          const isActive = item.path !== '#' && location.pathname === item.path;
          return (
            <a
              key={index}
              href={item.path}
              className={`secondary-nav-item${isActive ? ' active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
              onClick={(e) => handleNavClick(item.path, e)}
            >
              {item.label}
              {item.hasDropdown && <span className="dropdown-arrow" aria-hidden="true" />}
            </a>
          );
        })}
      </div>
    </nav>
  );
};

export default SecondaryNav;
