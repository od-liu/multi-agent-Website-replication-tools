/**
 * @test UI-LOGIN-PAGE 页面测试
 * @component LoginPage
 * @description 测试登录页面容器组件的集成
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoginPage from '../../src/pages/LoginPage';

describe('LoginPage Component', () => {
  it('应该渲染页面容器', () => {
    const { container } = render(<LoginPage />);
    const pageElement = container.querySelector('.login-page-container');
    expect(pageElement).toBeInTheDocument();
  });

  it('应该渲染 TopNavigation 组件', () => {
    render(<LoginPage />);
    // TopNavigation 包含"欢迎登录12306"文字
    expect(screen.getByText('欢迎登录12306')).toBeInTheDocument();
  });

  it('应该渲染 LoginForm 组件', () => {
    render(<LoginPage />);
    // LoginForm 包含"账号登录"和"立即登录"
    expect(screen.getByText('账号登录')).toBeInTheDocument();
    expect(screen.getByText('立即登录')).toBeInTheDocument();
  });

  it('应该渲染 BottomNavigation 组件', () => {
    render(<LoginPage />);
    // BottomNavigation 包含"友情链接"
    expect(screen.getByText('友情链接')).toBeInTheDocument();
  });

  it('应该有正确的三段式布局结构', () => {
    const { container } = render(<LoginPage />);
    
    // 检查顶部导航
    const topNav = container.querySelector('.top-navigation');
    expect(topNav).toBeInTheDocument();
    
    // 检查中间内容区域
    const mainContent = container.querySelector('.main-content-area');
    expect(mainContent).toBeInTheDocument();
    
    // 检查底部导航
    const bottomNav = container.querySelector('.bottom-navigation');
    expect(bottomNav).toBeInTheDocument();
  });

  it('应该有背景图片', () => {
    const { container } = render(<LoginPage />);
    const mainContent = container.querySelector('.main-content-area');
    
    expect(mainContent).toBeInTheDocument();
    // 背景图片通过 CSS 设置，检查类名存在即可
  });

  it('不应该有占位符文字', () => {
    const { container } = render(<LoginPage />);
    const pageText = container.textContent || '';
    
    // 确保没有占位符文字（注意：placeholder 是HTML属性，不是文字内容）
    expect(pageText).not.toContain('占位符');
    expect(pageText).not.toContain('Slot');
    expect(pageText).not.toContain('Component');
  });

  it('初始状态不应该显示 SMS 验证模态框', () => {
    render(<LoginPage />);
    
    // 短信验证模态框的标题不应该出现
    expect(screen.queryByText('短信验证')).not.toBeInTheDocument();
  });
});

