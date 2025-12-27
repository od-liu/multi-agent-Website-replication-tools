/**
 * @test UI-LOGIN-FORM 组件测试
 * @component LoginForm
 * @description 测试登录表单组件的6个scenarios
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../../src/components/LoginForm';

// Mock fetch
global.fetch = vi.fn();

describe('LoginForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该渲染登录表单', () => {
    const { container } = render(<LoginForm />);
    const formElement = container.querySelector('.login-form');
    expect(formElement).toBeInTheDocument();
  });

  it('应该渲染账号登录和扫码登录两个标签页', () => {
    render(<LoginForm />);
    expect(screen.getByText('账号登录')).toBeInTheDocument();
    expect(screen.getByText('扫码登录')).toBeInTheDocument();
  });

  /**
   * @scenario SCENARIO-001 "校验用户名为空"
   * @given 用户未输入用户名
   * @when 用户点击"立即登录"
   * @then 显示错误提示"请输入用户名！"
   */
  it('SCENARIO-001: 应该显示错误 - 用户名为空', async () => {
    render(<LoginForm />);
    
    const loginButton = screen.getByText('立即登录');
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText('请输入用户名！')).toBeInTheDocument();
    });
  });

  /**
   * @scenario SCENARIO-002 "校验密码为空"
   * @given 用户输入了用户名但未输入密码
   * @when 用户点击"立即登录"
   * @then 显示错误提示"请输入密码！"
   */
  it('SCENARIO-002: 应该显示错误 - 密码为空', async () => {
    render(<LoginForm />);
    
    const usernameInput = screen.getByPlaceholderText('用户名/邮箱/手机号');
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    
    const loginButton = screen.getByText('立即登录');
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText('请输入密码！')).toBeInTheDocument();
    });
  });

  /**
   * @scenario SCENARIO-003 "校验密码长度"
   * @given 用户输入了小于6位的密码
   * @when 用户点击"立即登录"
   * @then 显示错误提示"密码长度不能少于6位！"
   */
  it('SCENARIO-003: 应该显示错误 - 密码长度不足', async () => {
    render(<LoginForm />);
    
    const usernameInput = screen.getByPlaceholderText('用户名/邮箱/手机号');
    const passwordInput = screen.getByPlaceholderText('密码');
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: '12345' } }); // 只有5位
    
    const loginButton = screen.getByText('立即登录');
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText('密码长度不能少于6位！')).toBeInTheDocument();
    });
  });

  /**
   * @scenario SCENARIO-004 "用户名未注册"
   * @given 用户输入了未注册的用户名
   * @when 用户点击"立即登录"
   * @then 显示错误提示"用户名或密码错误！"，密码被清空
   */
  it('SCENARIO-004: 应该显示错误 - 用户名未注册', async () => {
    // Mock API 返回用户名未注册
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        message: '用户名或密码错误！',
      }),
    });

    render(<LoginForm />);
    
    const usernameInput = screen.getByPlaceholderText('用户名/邮箱/手机号');
    const passwordInput = screen.getByPlaceholderText('密码') as HTMLInputElement;
    
    fireEvent.change(usernameInput, { target: { value: 'nonexistent' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    const loginButton = screen.getByText('立即登录');
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText('用户名或密码错误！')).toBeInTheDocument();
      expect(passwordInput.value).toBe(''); // 密码被清空
    });
  });

  /**
   * @scenario SCENARIO-005 "密码错误"
   * @given 用户输入了正确的用户名但密码错误
   * @when 用户点击"立即登录"
   * @then 显示错误提示"用户名或密码错误！"，密码被清空
   */
  it('SCENARIO-005: 应该显示错误 - 密码错误', async () => {
    // Mock API 返回密码错误
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        message: '用户名或密码错误！',
      }),
    });

    render(<LoginForm />);
    
    const usernameInput = screen.getByPlaceholderText('用户名/邮箱/手机号');
    const passwordInput = screen.getByPlaceholderText('密码') as HTMLInputElement;
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    
    const loginButton = screen.getByText('立即登录');
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText('用户名或密码错误！')).toBeInTheDocument();
      expect(passwordInput.value).toBe('');
    });
  });

  /**
   * @scenario SCENARIO-006 "登录成功"
   * @given 用户输入了正确的用户名和密码
   * @when 用户点击"立即登录"
   * @then 调用 onLoginSuccess 回调
   */
  it('SCENARIO-006: 应该登录成功', async () => {
    // Mock API 返回登录成功
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        userId: 1,
        username: 'testuser',
      }),
    });

    const onLoginSuccess = vi.fn();
    render(<LoginForm onLoginSuccess={onLoginSuccess} />);
    
    const usernameInput = screen.getByPlaceholderText('用户名/邮箱/手机号');
    const passwordInput = screen.getByPlaceholderText('密码');
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'test123456' } });
    
    const loginButton = screen.getByText('立即登录');
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(onLoginSuccess).toHaveBeenCalledWith(1);
    });
  });

  it('应该切换到扫码登录模式', () => {
    render(<LoginForm />);
    
    const qrcodeTab = screen.getByText('扫码登录');
    fireEvent.click(qrcodeTab);
    
    expect(screen.getByText('请使用12306手机客户端扫码登录')).toBeInTheDocument();
  });

  it('应该显示注册和忘记密码链接', () => {
    render(<LoginForm />);
    
    expect(screen.getByText('注册12306账号')).toBeInTheDocument();
    expect(screen.getByText('忘记密码？')).toBeInTheDocument();
  });
});

