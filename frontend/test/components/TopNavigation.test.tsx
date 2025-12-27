/**
 * @file TopNavigation Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TopNavigation } from '../../src/components/TopNavigation';

describe('UI-TOP-NAV', () => {
  it('should render top navigation with logo and welcome text', () => {
    render(<TopNavigation />);
    
    expect(screen.getByText('欢迎登录12306')).toBeInTheDocument();
    expect(screen.getByAltText('中国铁路12306')).toBeInTheDocument();
  });
});

