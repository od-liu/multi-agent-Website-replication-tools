/**
 * @test UI-TOP-NAV 组件测试
 * @component TopNavigation
 * @description 测试顶部导航组件的渲染
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TopNavigation from '../../src/components/TopNavigation';

describe('TopNavigation Component', () => {
  it('应该渲染顶部导航容器', () => {
    const { container } = render(<TopNavigation />);
    const navElement = container.querySelector('.top-navigation');
    expect(navElement).toBeInTheDocument();
  });

  it('应该渲染 Logo 区域', () => {
    const { container } = render(<TopNavigation />);
    const logoElement = container.querySelector('.top-navigation-logo');
    expect(logoElement).toBeInTheDocument();
    expect(logoElement).toHaveAttribute('title', '中国铁路12306');
  });

  it('应该渲染欢迎文字', () => {
    render(<TopNavigation />);
    const welcomeText = screen.getByText('欢迎登录12306');
    expect(welcomeText).toBeInTheDocument();
    expect(welcomeText).toHaveClass('top-navigation-welcome');
  });

  it('应该具有正确的布局结构（左右两端对齐）', () => {
    const { container } = render(<TopNavigation />);
    const navElement = container.querySelector('.top-navigation');
    expect(navElement).toBeInTheDocument();
    
    // 检查是否包含 Logo 和欢迎文字两个子元素
    const logo = container.querySelector('.top-navigation-logo');
    const welcome = container.querySelector('.top-navigation-welcome');
    expect(logo).toBeInTheDocument();
    expect(welcome).toBeInTheDocument();
  });
});
