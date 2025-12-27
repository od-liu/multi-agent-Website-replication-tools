/**
 * @test UI-BOTTOM-NAV 组件测试
 * @component BottomNavigation
 * @description 测试底部导航组件的渲染
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BottomNavigation from '../../src/components/BottomNavigation';

describe('BottomNavigation Component', () => {
  it('应该渲染底部导航容器', () => {
    const { container } = render(<BottomNavigation />);
    const navElement = container.querySelector('.bottom-navigation');
    expect(navElement).toBeInTheDocument();
  });

  it('应该渲染友情链接标题', () => {
    render(<BottomNavigation />);
    const title = screen.getByText('友情链接');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('bottom-navigation-title');
  });

  it('应该渲染4个友情链接图片', () => {
    const { container } = render(<BottomNavigation />);
    const partnershipLinks = container.querySelectorAll('.bottom-navigation-partnership-img');
    expect(partnershipLinks).toHaveLength(4);
    
    // 验证图片的 alt 属性
    expect(screen.getByAltText('中国国家铁路集团有限公司')).toBeInTheDocument();
    expect(screen.getByAltText('中国铁路财产保险自保有限公司')).toBeInTheDocument();
    expect(screen.getByAltText('中国铁路95306网')).toBeInTheDocument();
    expect(screen.getByAltText('中铁快运股份有限公司')).toBeInTheDocument();
  });

  it('应该渲染4个二维码', () => {
    const { container } = render(<BottomNavigation />);
    const qrCodes = container.querySelectorAll('.bottom-navigation-qrcode-img');
    expect(qrCodes).toHaveLength(4);
    
    // 验证二维码标题
    expect(screen.getByText('中国铁路官方微信')).toBeInTheDocument();
    expect(screen.getByText('中国铁路官方微博')).toBeInTheDocument();
    expect(screen.getByText('12306公众号')).toBeInTheDocument();
    expect(screen.getByText('铁路12306')).toBeInTheDocument();
  });

  it('应该渲染版权信息', () => {
    render(<BottomNavigation />);
    const copyright = screen.getByText(/中国铁路客户服务中心 版权所有/);
    expect(copyright).toBeInTheDocument();
  });

  it('应该渲染 ICP 备案信息', () => {
    render(<BottomNavigation />);
    const icp = screen.getByText('京ICP备11019953号');
    expect(icp).toBeInTheDocument();
  });

  it('友情链接图片应该有正确的 src 属性', () => {
    const { container } = render(<BottomNavigation />);
    const partnershipImgs = container.querySelectorAll('.bottom-navigation-partnership-img');
    
    expect(partnershipImgs[0]).toHaveAttribute('src', '/images/登录页-底部导航-中国国家铁路集团有限公司.png');
    expect(partnershipImgs[1]).toHaveAttribute('src', '/images/登录页-底部导航-中国铁路财产保险自保有限公司.png');
    expect(partnershipImgs[2]).toHaveAttribute('src', '/images/登录页-底部导航-中国铁路95306网.png');
    expect(partnershipImgs[3]).toHaveAttribute('src', '/images/登录页-底部导航-中铁快运股份有限公司.png');
  });

  it('二维码图片应该有正确的 src 属性', () => {
    const { container } = render(<BottomNavigation />);
    const qrImgs = container.querySelectorAll('.bottom-navigation-qrcode-img');
    
    expect(qrImgs[0]).toHaveAttribute('src', '/images/登录页-底部导航-中国铁路官方微信二维码.png');
    expect(qrImgs[1]).toHaveAttribute('src', '/images/登录页-底部导航-中国铁路官方微博二维码.png');
    expect(qrImgs[2]).toHaveAttribute('src', '/images/登录页-底部导航-12306公众号二维码.png');
    expect(qrImgs[3]).toHaveAttribute('src', '/images/登录页-底部导航-铁路12306二维码.png');
  });
});
