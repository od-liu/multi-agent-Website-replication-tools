/**
 * @file BottomNavigation Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BottomNavigation } from '../../src/components/BottomNavigation';

describe('UI-BOTTOM-NAV', () => {
  it('should render bottom navigation with QR codes', () => {
    render(<BottomNavigation />);
    
    expect(screen.getByText('友情链接')).toBeInTheDocument();
    expect(screen.getByText('中国铁路官方微信')).toBeInTheDocument();
    expect(screen.getByText('中国铁路官方微博')).toBeInTheDocument();
    expect(screen.getByText('12306 公众号')).toBeInTheDocument();
    expect(screen.getByText('铁路12306')).toBeInTheDocument();
  });
});

