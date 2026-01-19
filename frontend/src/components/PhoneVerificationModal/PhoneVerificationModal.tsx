/**
 * @component PhoneVerificationModal
 * @description 手机核验弹窗，用于修改手机号并进行验证
 * 
 * ============ 功能实现清单 ============
 * @scenarios_covered:
 * ✅ SCENARIO-001: 手机号过短
 * ✅ SCENARIO-002: 手机号过长
 * ✅ SCENARIO-003: 手机号包含特殊字符
 * ✅ SCENARIO-004: 手机号符合规范
 * ✅ SCENARIO-005: 未输入登录密码
 * ✅ SCENARIO-006: 密码错误
 * ✅ SCENARIO-007: 密码正确-显示验证弹窗
 * 
 * @features_implemented:
 * ✅ 输入新手机号码（11位数字）
 * ✅ 输入登录密码
 * ✅ 进行身份验证
 * ✅ 验证成功后显示验证码输入
 * ✅ 发送验证码到新手机号
 * ✅ 输入验证码完成验证
 * 
 * @implementation_status:
 * - Scenarios Coverage: 7/7 (100%)
 * - Features Coverage: 6/6 (100%)
 * ================================================
 */

import React, { useState } from 'react';
import './PhoneVerificationModal.css';

interface PhoneVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newPhone: string) => void;
}

const PhoneVerificationModal: React.FC<PhoneVerificationModalProps> = ({ 
  isOpen, 
  onClose,
  onSuccess 
}) => {
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [codeError, setCodeError] = useState('');

  if (!isOpen) return null;

  /**
   * @scenario SCENARIO-001 "手机号过短"
   * @scenario SCENARIO-003 "手机号包含特殊字符"
   * @scenario SCENARIO-004 "手机号符合规范"
   */
  const validatePhone = (value: string): boolean => {
    setPhoneError('');
    
    // 检查是否包含非数字字符
    if (!/^\d*$/.test(value)) {
      setPhoneError('您输入的手机号码不是有效的格式！');
      return false;
    }
    
    // 检查长度
    if (value.length > 0 && value.length < 11) {
      setPhoneError('您输入的手机号码不是有效的格式！');
      return false;
    }
    
    return value.length === 11;
  };

  /**
   * @scenario SCENARIO-002 "手机号过长"
   * 系统仅保留用户最初输入的11个字符手机号码
   */
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // 只保留前11位数字
    if (value.length <= 11) {
      setPhone(value);
      if (value.length === 11) {
        validatePhone(value);
      }
    }
  };

  /**
   * @scenario SCENARIO-005 "未输入登录密码"
   * @scenario SCENARIO-006 "密码错误"
   * @scenario SCENARIO-007 "密码正确-显示验证弹窗"
   */
  const handleConfirm = async () => {
    setPasswordError('');
    
    // 验证手机号
    if (!validatePhone(phone)) {
      return;
    }
    
    // 验证密码
    if (!password) {
      setPasswordError('输入登录密码！');
      return;
    }
    
    try {
      // 调用后端验证密码
      console.log('🔐 开始验证密码...');
      const response = await fetch('/api/auth/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      console.log('📡 密码验证响应状态:', response.status);
      
      if (!response.ok) {
        console.error('❌ 密码验证请求失败:', response.status, response.statusText);
        setPasswordError(`请求失败 (${response.status})，请稍后再试。`);
        return;
      }
      
      const result = await response.json();
      console.log('✅ 密码验证结果:', result);
      
      if (!result.success) {
        setPasswordError('登录密码错误！');
        return;
      }
      
      // 密码正确，发送验证码
      console.log(`📱 向 ${phone} 发送验证码...`);
      const smsResponse = await fetch('/api/auth/send-phone-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      
      console.log('📡 验证码发送响应状态:', smsResponse.status);
      
      if (!smsResponse.ok) {
        console.error('❌ 验证码发送失败:', smsResponse.status);
        setPasswordError(`验证码发送失败 (${smsResponse.status})，请稍后再试。`);
        return;
      }
      
      const smsResult = await smsResponse.json();
      console.log('✅ 验证码发送结果:', smsResult);
      
      if (smsResult.success) {
        console.log(`🎉 验证码已发送到 ${phone}: ${smsResult.code}`);
        setStep('verify');
      } else {
        setPasswordError(smsResult.message || '验证码发送失败');
      }
    } catch (error) {
      console.error('❌ 验证失败:', error);
      setPasswordError(`网络请求失败: ${error.message}`);
    }
  };

  const handleVerifyCode = async () => {
    setCodeError('');
    
    if (!verificationCode) {
      setCodeError('请输入验证码');
      return;
    }
    
    try {
      const response = await fetch('/api/auth/verify-phone-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: verificationCode })
      });
      
      const result = await response.json();
      
      if (result.success) {
        if (onSuccess) {
          onSuccess(phone);
        }
        handleClose();
      } else {
        setCodeError('验证码错误');
      }
    } catch (error) {
      console.error('验证码验证失败:', error);
      setCodeError('网络请求失败，请稍后再试。');
    }
  };

  const handleClose = () => {
    setStep('input');
    setPhone('');
    setPassword('');
    setVerificationCode('');
    setPhoneError('');
    setPasswordError('');
    setCodeError('');
    onClose();
  };

  const handleBack = () => {
    if (step === 'verify') {
      setStep('input');
      setVerificationCode('');
      setCodeError('');
    } else {
      handleClose();
    }
  };

  return (
    <div className="phone-verify-modal-overlay" onClick={handleClose}>
      <div className="phone-verify-modal" onClick={(e) => e.stopPropagation()}>
        {/* 标题栏 */}
        <div className="phone-verify-modal-header">
          <h3 className="phone-verify-modal-title">
            {step === 'input' ? '手机核验' : '验证码验证'}
          </h3>
          <button className="phone-verify-modal-close" onClick={handleClose}>
            ×
          </button>
        </div>

        {/* 内容区域 */}
        <div className="phone-verify-modal-content">
          {step === 'input' ? (
            <>
              <p className="phone-verify-modal-hint">
                请输入新的手机号码和登录密码进行验证
              </p>
              
              <div className="phone-verify-form-group">
                <label className="phone-verify-label">
                  <span className="required-mark">* </span>新手机号：
                </label>
                <input
                  type="text"
                  className={`phone-verify-input ${phoneError ? 'error' : ''}`}
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="请输入11位手机号"
                  maxLength={11}
                />
                {phoneError && (
                  <div className="phone-verify-error">{phoneError}</div>
                )}
              </div>

              <div className="phone-verify-form-group">
                <label className="phone-verify-label">
                  <span className="required-mark">* </span>登录密码：
                </label>
                <input
                  type="password"
                  className={`phone-verify-input ${passwordError ? 'error' : ''}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入登录密码"
                />
                {passwordError && (
                  <div className="phone-verify-error">{passwordError}</div>
                )}
              </div>
            </>
          ) : (
            <>
              <p className="phone-verify-modal-hint">
                验证码已发送至 {phone}，请输入验证码
              </p>
              
              <div className="phone-verify-code-group">
                <label className="phone-verify-label-inline">输入验证码：</label>
                <input
                  type="text"
                  className={`phone-verify-code-input ${codeError ? 'error' : ''}`}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="请输入6位验证码"
                  maxLength={6}
                />
              </div>
              {codeError && (
                <div className="phone-verify-error">{codeError}</div>
              )}
            </>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="phone-verify-modal-footer">
          <button className="phone-verify-btn-secondary" onClick={handleBack}>
            返回
          </button>
          <button 
            className="phone-verify-btn-primary" 
            onClick={step === 'input' ? handleConfirm : handleVerifyCode}
          >
            {step === 'input' ? '确认' : '完成'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhoneVerificationModal;
