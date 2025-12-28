/**
 * BottomNavigation Component Tests
 * REQ-BOTTOM-NAV: 底部导航测试
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BottomNavigation from '../../src/components/BottomNavigation/BottomNavigation';

describe('UI-BOTTOM-NAV: BottomNavigation Component', () => {
  it('应该渲染底部导航容器', () => {
    render(<BottomNavigation />);
    
    const footer = document.querySelector('.bottom-navigation-footer');
    expect(footer).toBeInTheDocument();
  });

  it('应该显示"友情链接"标题', () => {
    render(<BottomNavigation />);
    
    const title = screen.getByText('友情链接');
    expect(title).toBeInTheDocument();
  });

  it('应该显示4个二维码标题', () => {
    render(<BottomNavigation />);
    
    expect(screen.getByText('中国铁路官方微信')).toBeInTheDocument();
    expect(screen.getByText('中国铁路官方微博')).toBeInTheDocument();
    expect(screen.getByText('12306 公众号')).toBeInTheDocument();
    expect(screen.getByText('铁路12306')).toBeInTheDocument();
  });

  it('应该显示版权信息', () => {
    render(<BottomNavigation />);
    
    expect(screen.getByText(/版权所有/)).toBeInTheDocument();
    expect(screen.getByText(/中国铁道科学研究院集团有限公司/)).toBeInTheDocument();
  });

  it('应该显示ICP备案信息', () => {
    render(<BottomNavigation />);
    
    expect(screen.getByText(/京ICP备05020493号-4/)).toBeInTheDocument();
  });

  it('应该有正确的ARIA标签', () => {
    render(<BottomNavigation />);
    
    const footer = screen.getByRole('complementary', { name: '底部' });
    expect(footer).toBeInTheDocument();
  });
});

