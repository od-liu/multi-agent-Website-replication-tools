/**
 * @file LoginForm Component Tests
 * @description Tests for UI-LOGIN-FORM component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '../../src/components/LoginForm';

describe('UI-LOGIN-FORM', () => {
  const mockOnLoginSuccess = vi.fn();

  beforeEach(() => {
    mockOnLoginSuccess.mockClear();
    (global.fetch as any).mockClear();
  });

  it('should render login form with all elements', () => {
    render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);
    
    expect(screen.getByText('账号登录')).toBeInTheDocument();
    expect(screen.getByText('扫码登录')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('用户名/邮箱/手机号')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('密码')).toBeInTheDocument();
    expect(screen.getByText('立即登录')).toBeInTheDocument();
  });

  /**
   * @scenario SCENARIO-001: 校验用户名为空
   */
  it('should show error when username is empty', async () => {
    render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);
    
    const loginButton = screen.getByText('立即登录');
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText('请输入用户名！')).toBeInTheDocument();
    });
  });

  /**
   * @scenario SCENARIO-002: 校验密码为空
   */
  it('should show error when password is empty', async () => {
    render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);
    
    const usernameInput = screen.getByPlaceholderText('用户名/邮箱/手机号');
    const loginButton = screen.getByText('立即登录');
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText('请输入密码！')).toBeInTheDocument();
    });
  });

  /**
   * @scenario SCENARIO-003: 校验密码长度
   */
  it('should show error when password is less than 6 characters', async () => {
    render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);
    
    const usernameInput = screen.getByPlaceholderText('用户名/邮箱/手机号');
    const passwordInput = screen.getByPlaceholderText('密码');
    const loginButton = screen.getByText('立即登录');
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: '12345' } });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText('密码长度不能少于6位！')).toBeInTheDocument();
    });
  });

  /**
   * @scenario SCENARIO-004: 用户名未注册
   * @scenario SCENARIO-005: 密码错误
   */
  it('should show error for invalid credentials', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({ success: false, message: '用户名或密码错误！' })
    });

    render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);
    
    const usernameInput = screen.getByPlaceholderText('用户名/邮箱/手机号');
    const passwordInput = screen.getByPlaceholderText('密码');
    const loginButton = screen.getByText('立即登录');
    
    fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText('用户名或密码错误！')).toBeInTheDocument();
    });
  });

  /**
   * @scenario SCENARIO-006: 登录成功
   */
  it('should call onLoginSuccess when credentials are valid', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({ success: true, message: '登录成功', needVerification: true })
    });

    render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);
    
    const usernameInput = screen.getByPlaceholderText('用户名/邮箱/手机号');
    const passwordInput = screen.getByPlaceholderText('密码');
    const loginButton = screen.getByText('立即登录');
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(mockOnLoginSuccess).toHaveBeenCalled();
    });
  });

  it('should switch between account and QR code login modes', () => {
    render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);
    
    const qrcodeTab = screen.getByText('扫码登录');
    fireEvent.click(qrcodeTab);
    
    expect(screen.getByText('请使用12306手机客户端扫码登录')).toBeInTheDocument();
  });
});

