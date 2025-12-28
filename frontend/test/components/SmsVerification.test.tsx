/**
 * SmsVerification Component Tests
 * UI组件测试：短信验证弹窗
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SmsVerificationModal from '../../src/components/SmsVerification/SmsVerification';

describe('UI-SMS-VERIFICATION: SmsVerification Modal', () => {
  let mockOnVerificationSuccess: any;
  let mockOnClose: any;

  beforeEach(() => {
    mockOnVerificationSuccess = vi.fn();
    mockOnClose = vi.fn();
    // Mock fetch
    global.fetch = vi.fn();
  });

  describe('场景1: 证件号错误', () => {
    it('应该在证件号错误时显示错误提示', async () => {
      // Mock error response
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          success: false,
          message: '请输入正确的用户信息！'
        })
      });

      render(
        <SmsVerificationModal
          isOpen={true}
          userId={1}
          onVerificationSuccess={mockOnVerificationSuccess}
          onClose={mockOnClose}
        />
      );

      // Input wrong id card
      const idCardInput = screen.getByPlaceholderText('请输入登录账号绑定的证件号后4位');
      fireEvent.change(idCardInput, { target: { value: '9999' } });

      // Click send code button
      const sendButton = screen.getByText('获取验证码');
      fireEvent.click(sendButton);

      // Check for error message
      await waitFor(() => {
        expect(screen.getByText('请输入正确的用户信息！')).toBeInTheDocument();
      });
    });
  });

  describe('场景2: 获取验证码成功', () => {
    it('应该在获取验证码成功时显示成功提示并开始倒计时', async () => {
      // Mock success response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: '获取手机验证码成功！'
        })
      });

      render(
        <SmsVerificationModal
          isOpen={true}
          userId={1}
          onVerificationSuccess={mockOnVerificationSuccess}
          onClose={mockOnClose}
        />
      );

      // Input correct id card
      const idCardInput = screen.getByPlaceholderText('请输入登录账号绑定的证件号后4位');
      fireEvent.change(idCardInput, { target: { value: '1234' } });

      // Click send code button
      const sendButton = screen.getByText('获取验证码');
      fireEvent.click(sendButton);

      // Check for success message
      await waitFor(() => {
        expect(screen.getByText('获取手机验证码成功！')).toBeInTheDocument();
      });

      // Check button shows countdown
      await waitFor(() => {
        const button = screen.getByText(/重新发送/);
        expect(button).toBeInTheDocument();
      });
    });
  });

  describe('验证码提交测试', () => {
    it('应该在验证码正确时调用成功回调', async () => {
      // Mock send code success
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: '获取手机验证码成功！'
        })
      });

      // Mock verify code success
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          token: 'test-token-123'
        })
      });

      render(
        <SmsVerificationModal
          isOpen={true}
          userId={1}
          onVerificationSuccess={mockOnVerificationSuccess}
          onClose={mockOnClose}
        />
      );

      // Input id card and get code
      const idCardInput = screen.getByPlaceholderText('请输入登录账号绑定的证件号后4位');
      fireEvent.change(idCardInput, { target: { value: '1234' } });

      const sendButton = screen.getByText('获取验证码');
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText('获取手机验证码成功！')).toBeInTheDocument();
      });

      // Input verification code
      const codeInput = screen.getByPlaceholderText('输入验证码');
      fireEvent.change(codeInput, { target: { value: '123456' } });

      // Click submit button
      const submitButton = screen.getByText('确定');
      fireEvent.click(submitButton);

      // Check callback was called
      await waitFor(() => {
        expect(mockOnVerificationSuccess).toHaveBeenCalledWith({
          success: true,
          token: 'test-token-123'
        });
      });
    });
  });

  describe('UI 渲染测试', () => {
    it('应该渲染所有必要的UI元素', () => {
      render(
        <SmsVerificationModal
          isOpen={true}
          userId={1}
          onVerificationSuccess={mockOnVerificationSuccess}
          onClose={mockOnClose}
        />
      );

      // Check for title
      expect(screen.getByText('选择验证方式')).toBeInTheDocument();

      // Check for tab
      expect(screen.getByText('短信验证')).toBeInTheDocument();

      // Check for input fields
      expect(screen.getByPlaceholderText('请输入登录账号绑定的证件号后4位')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('输入验证码')).toBeInTheDocument();

      // Check for buttons
      expect(screen.getByText('获取验证码')).toBeInTheDocument();
      expect(screen.getByText('确定')).toBeInTheDocument();
    });

    it('应该在isOpen为false时不渲染', () => {
      render(
        <SmsVerificationModal
          isOpen={false}
          userId={1}
          onVerificationSuccess={mockOnVerificationSuccess}
          onClose={mockOnClose}
        />
      );

      // Should not render title
      expect(screen.queryByText('选择验证方式')).not.toBeInTheDocument();
    });
  });

  describe('关闭弹窗测试', () => {
    it('应该在点击关闭按钮时调用onClose回调', () => {
      render(
        <SmsVerificationModal
          isOpen={true}
          userId={1}
          onVerificationSuccess={mockOnVerificationSuccess}
          onClose={mockOnClose}
        />
      );

      // Find and click close button (by its icon class or aria-label)
      const closeButtons = document.querySelectorAll('.close-slider, .icon');
      if (closeButtons.length > 0) {
        fireEvent.click(closeButtons[0]);
        expect(mockOnClose).toHaveBeenCalled();
      }
    });
  });
});

