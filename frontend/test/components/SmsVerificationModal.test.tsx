/**
 * @file SmsVerificationModal Component Tests
 * @description Simplified tests for UI-SMS-VERIFICATION component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SmsVerificationModal } from '../../src/components/SmsVerificationModal';

describe('UI-SMS-VERIFICATION', () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  it('should render SMS verification modal', () => {
    render(
      <SmsVerificationModal 
        username="testuser" 
        onClose={mockOnClose} 
        onSuccess={mockOnSuccess} 
      />
    );
    
    expect(screen.getByText('选择验证方式')).toBeInTheDocument();
    expect(screen.getByText('短信验证')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('请输入登录账号绑定的证件号后4位')).toBeInTheDocument();
  });

  it('should validate empty ID number', async () => {
    render(
      <SmsVerificationModal 
        username="testuser" 
        onClose={mockOnClose} 
        onSuccess={mockOnSuccess} 
      />
    );
    
    const confirmButton = screen.getByText('确定');
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(screen.getByText(/请输入登录账号绑定的证件号后4位/)).toBeInTheDocument();
    });
  });

  it('should call API to send verification code', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({ success: true, message: '验证码已发送', code: '123456' })
    });

    render(
      <SmsVerificationModal 
        username="testuser" 
        onClose={mockOnClose} 
        onSuccess={mockOnSuccess} 
      />
    );
    
    const idInput = screen.getByPlaceholderText('请输入登录账号绑定的证件号后4位');
    const getCodeButton = screen.getByText('获取验证码');
    
    fireEvent.change(idInput, { target: { value: '1234' } });
    fireEvent.click(getCodeButton);
    
    await waitFor(() => {
      expect(screen.getByText(/验证码已发送/)).toBeInTheDocument();
    });
  });
});

