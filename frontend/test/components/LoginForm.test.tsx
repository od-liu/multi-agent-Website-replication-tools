/**
 * LoginForm Component Tests
 * UI组件测试：前端表单验证和登录流程
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from '../../src/components/LoginForm/LoginForm';

describe('UI-LOGIN-FORM: LoginForm Component', () => {
  let mockOnLoginSuccess: any;

  beforeEach(() => {
    mockOnLoginSuccess = vi.fn();
    // Mock fetch
    global.fetch = vi.fn();
  });

  describe('场景1: 校验用户名为空', () => {
    it('应该在用户名为空时显示错误提示', async () => {
      render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);

      // Find and click login button
      const loginButton = screen.getByText('立即登录');
      fireEvent.click(loginButton);

      // Check for error message
      await waitFor(() => {
        expect(screen.getByText('请输入用户名！')).toBeInTheDocument();
      });
    });
  });

  describe('场景2: 校验密码为空', () => {
    it('应该在密码为空时显示错误提示', async () => {
      render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);

      // Input username
      const usernameInput = screen.getByPlaceholderText('用户名/邮箱/手机号');
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });

      // Click login button
      const loginButton = screen.getByText('立即登录');
      fireEvent.click(loginButton);

      // Check for error message
      await waitFor(() => {
        expect(screen.getByText('请输入密码！')).toBeInTheDocument();
      });
    });
  });

  describe('场景3: 校验密码长度', () => {
    it('应该在密码长度不足6位时显示错误提示', async () => {
      render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);

      // Input username and short password
      const usernameInput = screen.getByPlaceholderText('用户名/邮箱/手机号');
      const passwordInput = screen.getByPlaceholderText('密码');
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: '12345' } });

      // Click login button
      const loginButton = screen.getByText('立即登录');
      fireEvent.click(loginButton);

      // Check for error message
      await waitFor(() => {
        expect(screen.getByText('密码长度不能少于6位！')).toBeInTheDocument();
      });
    });
  });

  describe('场景4: 登录成功', () => {
    it('应该在输入正确的用户名和密码后调用登录接口', async () => {
      // Mock successful login response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          userId: 1
        })
      });

      render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);

      // Input credentials
      const usernameInput = screen.getByPlaceholderText('用户名/邮箱/手机号');
      const passwordInput = screen.getByPlaceholderText('密码');
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      // Click login button
      const loginButton = screen.getByText('立即登录');
      fireEvent.click(loginButton);

      // Wait for API call and callback
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/auth/login'),
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: 'testuser',
              password: 'password123'
            })
          })
        );
      });

      await waitFor(() => {
        expect(mockOnLoginSuccess).toHaveBeenCalledWith({
          success: true,
          userId: 1
        });
      });
    });

    it('应该在登录失败时显示错误消息', async () => {
      // Mock failed login response
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          success: false,
          message: '用户名或密码错误！'
        })
      });

      render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);

      // Input credentials
      const usernameInput = screen.getByPlaceholderText('用户名/邮箱/手机号');
      const passwordInput = screen.getByPlaceholderText('密码');
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

      // Click login button
      const loginButton = screen.getByText('立即登录');
      fireEvent.click(loginButton);

      // Check for error message
      await waitFor(() => {
        expect(screen.getByText('用户名或密码错误！')).toBeInTheDocument();
      });

      // Callback should not be called
      expect(mockOnLoginSuccess).not.toHaveBeenCalled();
    });
  });

  describe('UI 渲染测试', () => {
    it('应该渲染所有必要的UI元素', () => {
      render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);

      // Check for tabs
      expect(screen.getByText('账号登录')).toBeInTheDocument();
      expect(screen.getByText('扫码登录')).toBeInTheDocument();

      // Check for input fields
      expect(screen.getByPlaceholderText('用户名/邮箱/手机号')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('密码')).toBeInTheDocument();

      // Check for login button
      expect(screen.getByText('立即登录')).toBeInTheDocument();

      // Check for links
      expect(screen.getByText('注册12306账号')).toBeInTheDocument();
      expect(screen.getByText('忘记密码？')).toBeInTheDocument();

      // Check for service tips
      expect(screen.getByText(/铁路12306每日5:00至次日1:00/)).toBeInTheDocument();
    });
  });

  describe('轮播图测试', () => {
    it('应该有轮播图指示器', () => {
      render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);

      // Check carousel exists
      const loginPanel = document.querySelector('.login-panel');
      expect(loginPanel).toBeTruthy();
      
      // Check carousel indicators
      const indicators = document.querySelectorAll('.loginSlide .hd li');
      expect(indicators.length).toBeGreaterThanOrEqual(2);
    });
  });
});

