/**
 * @file LoginPage Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoginPage } from '../../src/pages/LoginPage';

describe('UI-LOGIN-PAGE', () => {
  it('should render complete login page with all components', () => {
    render(<LoginPage />);
    
    // Check top navigation
    expect(screen.getByText('欢迎登录12306')).toBeInTheDocument();
    
    // Check login form
    expect(screen.getByText('账号登录')).toBeInTheDocument();
    expect(screen.getByText('立即登录')).toBeInTheDocument();
    
    // Check bottom navigation
    expect(screen.getByText('友情链接')).toBeInTheDocument();
  });
});

