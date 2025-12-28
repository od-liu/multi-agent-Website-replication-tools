/**
 * TopNavigation Component Tests
 * REQ-TOP-NAV: 顶部导航栏测试
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TopNavigation from '../../src/components/TopNavigation/TopNavigation';

describe('UI-TOP-NAV: TopNavigation Component', () => {
  it('应该渲染顶部导航容器', () => {
    render(<TopNavigation />);
    
    const header = document.querySelector('.top-navigation-header');
    expect(header).toBeInTheDocument();
  });

  it('应该显示Logo链接', () => {
    render(<TopNavigation />);
    
    const logoLink = screen.getByRole('banner').querySelector('a');
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', 'https://www.12306.cn/index/index.html');
  });

  it('Logo链接应该包含SEO文字"中国铁路12306"', () => {
    render(<TopNavigation />);
    
    const logoText = screen.getByText('中国铁路12306');
    expect(logoText).toBeInTheDocument();
  });

  it('应该显示欢迎文字"欢迎登录12306"', () => {
    render(<TopNavigation />);
    
    const welcomeText = screen.getByText('欢迎登录12306');
    expect(welcomeText).toBeInTheDocument();
  });

  it('应该有正确的ARIA标签', () => {
    render(<TopNavigation />);
    
    const header = screen.getByRole('complementary', { name: '头部' });
    expect(header).toBeInTheDocument();
    
    const logo = screen.getByRole('banner');
    expect(logo).toBeInTheDocument();
  });

  it('欢迎文字应该有正确的类名', () => {
    render(<TopNavigation />);
    
    const welcomeDiv = screen.getByText('欢迎登录12306');
    expect(welcomeDiv).toHaveClass('top-navigation-header-welcome');
  });
});

