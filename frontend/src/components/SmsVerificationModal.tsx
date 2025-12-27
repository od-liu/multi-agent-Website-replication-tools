/**
 * @component UI-SMS-VERIFICATION
 * @description 短信验证弹窗，用于二次验证用户身份
 * @calls API-SEND-SMS, API-VERIFY-SMS
 * @children_slots 无
 * 
 * ============ 功能实现清单（必填）============
 * @scenarios_covered:
 *   ✅ SCENARIO-001: 获取验证码-证件号错误
 *   ✅ SCENARIO-002: 获取验证码-成功
 *   ✅ SCENARIO-003: 获取验证码-频率限制
 *   ✅ SCENARIO-004: 验证-证件号为空
 *   ✅ SCENARIO-005: 验证-证件号长度不正确
 *   ✅ SCENARIO-006: 验证-验证码为空
 *   ✅ SCENARIO-007: 验证-验证码长度不正确
 *   ✅ SCENARIO-008: 验证-验证码错误
 *   ✅ SCENARIO-009: 验证-验证码过期
 *   ✅ SCENARIO-010: 验证-成功
 * 
 * @features_implemented:
 *   ✅ 证件号输入框
 *   ✅ 验证码输入框 + 获取验证码按钮（倒计时功能）
 *   ✅ 错误/成功提示显示
 *   ✅ 遮罩层 + 居中弹窗
 *   ✅ 关闭按钮
 * 
 * @implementation_status:
 *   - Scenarios Coverage: 10/10 (100%)
 *   - Features Coverage: 5/5 (100%)
 *   - UI Visual: 像素级精确（参考ui-style-guide.md第6.3节）
 * 
 * @layout_position "视口居中（position: fixed），z-index高于页面内容"
 * @dimensions "宽度700px，高度auto"
 * ================================================
 */

import React, { useState, useEffect } from 'react';
import './SmsVerificationModal.css';

interface SmsVerificationModalProps {
  username: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const SmsVerificationModal: React.FC<SmsVerificationModalProps> = ({
  username,
  onClose,
  onSuccess
}) => {
  // ========== State Management ==========
  const [idNumber, setIdNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ========== Countdown Timer ==========
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // ========== Scenario Implementations ==========

  /**
   * @scenario SCENARIO-001 "获取验证码-证件号错误"
   * @scenario SCENARIO-002 "获取验证码-成功"
   * @scenario SCENARIO-003 "获取验证码-频率限制"
   * @given 用户输入证件号后4位
   * @when 用户点击"获取验证码"按钮
   * @then 调用 API-SEND-SMS，根据响应显示结果
   * @calls API-SEND-SMS
   */
  const handleGetCode = async () => {
    setMessage(null);

    if (countdown > 0) {
      return; // 倒计时期间不允许重复点击
    }

    try {
      // 调用 API-SEND-SMS
      const response = await fetch('/api/auth/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, idNumber })
      });

      const data = await response.json();

      if (data.success) {
        // SCENARIO-002: 成功
        setMessage({
          type: 'success',
          text: `验证码已发送！${data.code ? `(开发环境: ${data.code})` : ''}`
        });
        setCountdown(60); // 开始60秒倒计时
      } else {
        // SCENARIO-001 & SCENARIO-003: 证件号错误 或 频率限制
        setMessage({
          type: 'error',
          text: data.message
        });
        if (data.message.includes('频繁')) {
          setCountdown(60); // 频率限制时也显示倒计时
        } else {
          setCountdown(60); // 即使错误也开始倒计时
        }
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: '网络请求失败，请稍后再试。'
      });
    }
  };

  /**
   * @scenario SCENARIO-004 "验证-证件号为空"
   * @given 用户未输入证件号后4位
   * @when 用户点击"确定"按钮
   * @then 显示错误提示"请输入登录账号绑定的证件号后4位"
   */
  const validateIdNumber = (): boolean => {
    if (!idNumber) {
      setMessage({
        type: 'error',
        text: '请输入登录账号绑定的证件号后4位'
      });
      return false;
    }
    return true;
  };

  /**
   * @scenario SCENARIO-005 "验证-证件号长度不正确"
   * @given 用户输入的证件号后4位长度不为4位
   * @when 用户点击"确定"按钮
   * @then 显示错误提示"请输入登录账号绑定的证件号后4位"
   */
  const validateIdNumberLength = (): boolean => {
    if (idNumber.length !== 4) {
      setMessage({
        type: 'error',
        text: '请输入登录账号绑定的证件号后4位'
      });
      return false;
    }
    return true;
  };

  /**
   * @scenario SCENARIO-006 "验证-验证码为空"
   * @given 用户输入了正确的证件号后4位但未输入验证码
   * @when 用户点击"确定"按钮
   * @then 显示错误提示"请输入验证码"
   */
  const validateCode = (): boolean => {
    if (!verificationCode) {
      setMessage({
        type: 'error',
        text: '请输入验证码'
      });
      return false;
    }
    return true;
  };

  /**
   * @scenario SCENARIO-007 "验证-验证码长度不正确"
   * @given 用户输入了正确的证件号后4位但验证码少于6位
   * @when 用户点击"确定"按钮
   * @then 显示错误提示"请输入正确的验证码"
   */
  const validateCodeLength = (): boolean => {
    if (verificationCode.length < 6) {
      setMessage({
        type: 'error',
        text: '请输入正确的验证码'
      });
      return false;
    }
    return true;
  };

  /**
   * @scenario SCENARIO-008 "验证-验证码错误"
   * @scenario SCENARIO-009 "验证-验证码过期"
   * @scenario SCENARIO-010 "验证-成功"
   * @given 用户输入了证件号后4位和验证码
   * @when 用户点击"确定"按钮
   * @then 调用 API-VERIFY-SMS，根据响应显示结果
   * @calls API-VERIFY-SMS
   */
  const handleVerify = async () => {
    setMessage(null);

    // 执行所有前端验证
    if (!validateIdNumber()) return;
    if (!validateIdNumberLength()) return;
    if (!validateCode()) return;
    if (!validateCodeLength()) return;

    setIsLoading(true);

    try {
      // 调用 API-VERIFY-SMS
      const response = await fetch('/api/auth/verify-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, idNumber, code: verificationCode })
      });

      const data = await response.json();

      if (data.success) {
        // SCENARIO-010: 验证成功
        setMessage({
          type: 'success',
          text: '验证成功！正在跳转...'
        });
        setTimeout(() => {
          onSuccess();
        }, 1000);
      } else {
        // SCENARIO-008 & SCENARIO-009: 验证码错误 或 过期
        setMessage({
          type: 'error',
          text: data.message
        });
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: '网络请求失败，请稍后再试。'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ========== UI Render ==========
  return (
    <>
      {/* 遮罩层 */}
      <div className="modal-overlay" onClick={onClose}></div>

      {/* 弹窗容器 */}
      <div className="sms-verification-modal">
        {/* 标题栏 */}
        <div className="modal-header">
          <div className="modal-title">选择验证方式</div>
          <button className="modal-close-button" onClick={onClose}>
            ×
          </button>
        </div>

        {/* 验证方式标题 */}
        <div className="modal-verification-title">短信验证</div>

        {/* 证件号输入框 */}
        <div className="modal-input-wrapper">
          <input
            type="text"
            className={`modal-input ${message?.type === 'error' && message.text.includes('证件号') ? 'error' : ''}`}
            placeholder="请输入登录账号绑定的证件号后4位"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value.slice(0, 4))}
            maxLength={4}
          />
        </div>

        {/* 验证码输入区域 */}
        <div className="modal-verification-input-group">
          <div className="modal-input-wrapper modal-verification-input">
            <input
              type="text"
              className={`modal-input ${message?.type === 'error' && message.text.includes('验证码') ? 'error' : ''}`}
              placeholder="输入验证码"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.slice(0, 6))}
              maxLength={6}
            />
          </div>
          <button
            className="modal-get-code-button"
            onClick={handleGetCode}
            disabled={countdown > 0}
          >
            {countdown > 0 ? `重新发送(${countdown})` : '获取验证码'}
          </button>
        </div>

        {/* 消息提示 */}
        {message && (
          <div className={`modal-message ${message.type}`}>
            <span>{message.type === 'error' ? '⚠️' : '✓'}</span>
            <span>{message.text}</span>
          </div>
        )}

        {/* 确定按钮 */}
        <button
          className="modal-confirm-button"
          onClick={handleVerify}
          disabled={isLoading}
        >
          {isLoading ? '验证中...' : '确定'}
        </button>
      </div>
    </>
  );
};

export default SmsVerificationModal;

