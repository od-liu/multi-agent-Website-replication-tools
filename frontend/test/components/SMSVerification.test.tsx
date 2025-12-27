/**
 * @test UI-SMS-VERIFICATION 组件测试
 * @component SMSVerification
 * @description 测试短信验证组件的9个scenarios
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SMSVerification from '../../src/components/SMSVerification';

// Mock fetch
global.fetch = vi.fn();

describe('SMSVerification Component', () => {
  const mockUserId = '1';
  const mockOnSuccess = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该渲染短信验证模态框', () => {
    render(
      <SMSVerification
        userId={mockUserId}
        onSuccess={mockOnSuccess}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.getByText('短信验证')).toBeInTheDocument();
  });

  it('应该渲染输入框和按钮', () => {
    render(
      <SMSVerification
        userId={mockUserId}
        onSuccess={mockOnSuccess}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.getByPlaceholderText('证件号后4位')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('6位验证码')).toBeInTheDocument();
    expect(screen.getByText('获取验证码')).toBeInTheDocument();
    expect(screen.getByText('确定')).toBeInTheDocument();
  });

  /**
   * @scenario SCENARIO-001 "获取验证码-证件号错误"
   * @given 用户输入了错误的证件号后4位
   * @when 用户点击"获取验证码"
   * @then 显示错误提示"请输入正确的用户信息！"
   */
  it('SCENARIO-001: 应该显示错误 - 证件号错误', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        message: '请输入正确的用户信息！',
      }),
    });

    render(
      <SMSVerification
        userId={mockUserId}
        onSuccess={mockOnSuccess}
        onClose={mockOnClose}
      />
    );
    
    const idCardInput = screen.getByPlaceholderText('证件号后4位');
    const getCodeButton = screen.getByText('获取验证码');
    
    fireEvent.change(idCardInput, { target: { value: '9999' } });
    fireEvent.click(getCodeButton);
    
    await waitFor(() => {
      expect(screen.getByText('请输入正确的用户信息！')).toBeInTheDocument();
    });
  });

  /**
   * @scenario SCENARIO-002 "获取验证码-成功"
   * @given 用户输入了正确的证件号后4位
   * @when 用户点击"获取验证码"
   * @then 发送验证码，按钮进入倒计时状态
   */
  it('SCENARIO-002: 应该成功获取验证码', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        code: '123456',
        message: '验证码已发送，请注意查收。',
      }),
    });

    render(
      <SMSVerification
        userId={mockUserId}
        onSuccess={mockOnSuccess}
        onClose={mockOnClose}
      />
    );
    
    const idCardInput = screen.getByPlaceholderText('证件号后4位');
    const getCodeButton = screen.getByText('获取验证码');
    
    fireEvent.change(idCardInput, { target: { value: '1234' } });
    fireEvent.click(getCodeButton);
    
    await waitFor(() => {
      expect(screen.getByText(/秒后重试/)).toBeInTheDocument();
    });
  });

  /**
   * @scenario SCENARIO-003 "获取验证码-频率限制"
   * @given 用户在1分钟内已发送过验证码
   * @when 再次点击"获取验证码"
   * @then 显示错误提示"请求验证码过于频繁"
   */
  it('SCENARIO-003: 应该显示错误 - 频率限制', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        message: '请求验证码过于频繁，请稍后再试！',
      }),
    });

    render(
      <SMSVerification
        userId={mockUserId}
        onSuccess={mockOnSuccess}
        onClose={mockOnClose}
      />
    );
    
    const idCardInput = screen.getByPlaceholderText('证件号后4位');
    const getCodeButton = screen.getByText('获取验证码');
    
    fireEvent.change(idCardInput, { target: { value: '1234' } });
    fireEvent.click(getCodeButton);
    
    await waitFor(() => {
      expect(screen.getByText(/频繁/)).toBeInTheDocument();
    });
  });

  /**
   * @scenario SCENARIO-004 "验证-证件号为空"
   * @given 用户未输入证件号
   * @when 用户点击"确定"
   * @then 显示错误提示"请输入登录账号绑定的证件号后4位"
   */
  it('SCENARIO-004: 应该显示错误 - 证件号为空', async () => {
    render(
      <SMSVerification
        userId={mockUserId}
        onSuccess={mockOnSuccess}
        onClose={mockOnClose}
      />
    );
    
    const submitButton = screen.getByText('确定');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('请输入登录账号绑定的证件号后4位')).toBeInTheDocument();
    });
  });

  /**
   * @scenario SCENARIO-005 "验证-证件号长度不正确"
   * @given 用户输入的证件号不是4位
   * @when 用户点击"确定"
   * @then 显示错误提示
   */
  it('SCENARIO-005: 应该显示错误 - 证件号长度不正确', async () => {
    render(
      <SMSVerification
        userId={mockUserId}
        onSuccess={mockOnSuccess}
        onClose={mockOnClose}
      />
    );
    
    const idCardInput = screen.getByPlaceholderText('证件号后4位');
    const submitButton = screen.getByText('确定');
    
    fireEvent.change(idCardInput, { target: { value: '123' } }); // 只有3位
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('请输入登录账号绑定的证件号后4位')).toBeInTheDocument();
    });
  });

  /**
   * @scenario SCENARIO-006 "验证-验证码为空"
   * @given 用户输入了证件号但未输入验证码
   * @when 用户点击"确定"
   * @then 显示错误提示"请输入验证码"
   */
  it('SCENARIO-006: 应该显示错误 - 验证码为空', async () => {
    render(
      <SMSVerification
        userId={mockUserId}
        onSuccess={mockOnSuccess}
        onClose={mockOnClose}
      />
    );
    
    const idCardInput = screen.getByPlaceholderText('证件号后4位');
    const submitButton = screen.getByText('确定');
    
    fireEvent.change(idCardInput, { target: { value: '1234' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('请输入验证码')).toBeInTheDocument();
    });
  });

  /**
   * @scenario SCENARIO-007 "验证-验证码长度不正确"
   * @given 用户输入的验证码少于6位
   * @when 用户点击"确定"
   * @then 显示错误提示"请输入正确的验证码"
   */
  it('SCENARIO-007: 应该显示错误 - 验证码长度不正确', async () => {
    render(
      <SMSVerification
        userId={mockUserId}
        onSuccess={mockOnSuccess}
        onClose={mockOnClose}
      />
    );
    
    const idCardInput = screen.getByPlaceholderText('证件号后4位');
    const codeInput = screen.getByPlaceholderText('6位验证码');
    const submitButton = screen.getByText('确定');
    
    fireEvent.change(idCardInput, { target: { value: '1234' } });
    fireEvent.change(codeInput, { target: { value: '12345' } }); // 只有5位
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('请输入正确的验证码')).toBeInTheDocument();
    });
  });

  /**
   * @scenario SCENARIO-008 "验证-验证码错误"
   * @given 用户输入了错误的验证码
   * @when 用户点击"确定"
   * @then 显示错误提示"验证码有误"
   */
  it('SCENARIO-008: 应该显示错误 - 验证码错误', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        message: '很抱歉，您输入的短信验证码有误。',
      }),
    });

    render(
      <SMSVerification
        userId={mockUserId}
        onSuccess={mockOnSuccess}
        onClose={mockOnClose}
      />
    );
    
    const idCardInput = screen.getByPlaceholderText('证件号后4位');
    const codeInput = screen.getByPlaceholderText('6位验证码');
    const submitButton = screen.getByText('确定');
    
    fireEvent.change(idCardInput, { target: { value: '1234' } });
    fireEvent.change(codeInput, { target: { value: '000000' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('很抱歉，您输入的短信验证码有误。')).toBeInTheDocument();
    });
  });

  /**
   * @scenario SCENARIO-009 "验证-成功"
   * @given 用户输入了正确的证件号和验证码
   * @when 用户点击"确定"
   * @then 调用 onSuccess 回调
   */
  it('SCENARIO-009: 应该验证成功', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: '验证成功',
      }),
    });

    render(
      <SMSVerification
        userId={mockUserId}
        onSuccess={mockOnSuccess}
        onClose={mockOnClose}
      />
    );
    
    const idCardInput = screen.getByPlaceholderText('证件号后4位');
    const codeInput = screen.getByPlaceholderText('6位验证码');
    const submitButton = screen.getByText('确定');
    
    fireEvent.change(idCardInput, { target: { value: '1234' } });
    fireEvent.change(codeInput, { target: { value: '123456' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('应该点击遮罩层关闭模态框', () => {
    const { container } = render(
      <SMSVerification
        userId={mockUserId}
        onSuccess={mockOnSuccess}
        onClose={mockOnClose}
      />
    );
    
    const overlay = container.querySelector('.modal-overlay');
    fireEvent.click(overlay!);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('应该点击关闭按钮关闭模态框', () => {
    render(
      <SMSVerification
        userId={mockUserId}
        onSuccess={mockOnSuccess}
        onClose={mockOnClose}
      />
    );
    
    const closeButton = screen.getByLabelText('关闭');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });
});

