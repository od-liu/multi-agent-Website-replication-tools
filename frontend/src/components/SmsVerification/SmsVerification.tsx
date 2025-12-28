/**
 * @component UI-SMS-VERIFICATION
 * @description 用户登录成功后需要进行短信验证的模态弹窗
 * @calls API-SEND-VERIFICATION-CODE - 发送验证码API
 * @calls API-VERIFY-CODE - 验证验证码API
 * 
 * ============ 功能实现清单 ============
 * @scenarios_covered:
 *   ✅ SCENARIO-001: 证件号错误
 *   ✅ SCENARIO-002: 获取验证码成功
 * 
 * @features_implemented:
 *   ✅ 短信验证表单
 *   ✅ 证件号后4位输入
 *   ✅ 验证码输入
 *   ✅ 60秒倒计时
 *   ✅ 成功/错误消息提示
 *   ✅ 关闭按钮
 *   ✅ 遮罩层
 * 
 * @implementation_status:
 *   - Scenarios: 2/2 (100%)
 *   - Features: 7/7 (100%)
 *   - UI Visual: 像素级精确
 * 
 * @layout_position:
 *   - 定位: fixed, 页面居中
 *   - 尺寸: 528px × 336px
 *   - z-index: 100003
 *   - 遮罩层: rgba(0, 0, 0, 0.5), z-index: 100002
 * ==========================================
 */

import React, { useState, useEffect } from 'react';
import './SmsVerification.css';

interface SmsVerificationModalProps {
  isOpen: boolean;
  userId: number;
  onVerificationSuccess: (data: any) => void;
  onClose: () => void;
}

const SmsVerificationModal: React.FC<SmsVerificationModalProps> = ({
  isOpen,
  userId,
  onVerificationSuccess,
  onClose
}) => {
  // ========== State Management ==========
  const [idCardLast4, setIdCardLast4] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [countdown, setCountdown] = useState(0);
  const [isSendingCode, setIsSendingCode] = useState(false);

  // ========== Countdown Timer ==========
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // ========== Reset State When Closed ==========
  useEffect(() => {
    if (!isOpen) {
      setIdCardLast4('');
      setCode('');
      setMessage('');
      setCountdown(0);
    }
  }, [isOpen]);

  // ========== Scenario Implementations ==========

  /**
   * @scenario SCENARIO-001 "证件号错误"
   * @given 用户在短信验证弹窗中输入错误的证件号后4位
   * @when 用户点击"获取验证码"
   * @then 显示错误提示"请输入正确的用户信息!"
   * @calls API-SEND-VERIFICATION-CODE
   */
  const handleSendCode = async () => {
    if (countdown > 0) return;
    if (!idCardLast4 || idCardLast4.length !== 4) {
      setMessage('请输入4位证件号');
      setMessageType('error');
      return;
    }

    setIsSendingCode(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          idCardLast4
        })
      });

      const data = await response.json();

      if (data.success) {
        // @scenario SCENARIO-002 "获取验证码成功"
        setMessage('获取手机验证码成功！');
        setMessageType('success');
        setCountdown(60); // 开始60秒倒计时
      } else {
        // @scenario SCENARIO-001 "证件号错误"
        setMessage(data.message || '请输入正确的用户信息！');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('网络请求失败，请稍后再试');
      setMessageType('error');
    } finally {
      setIsSendingCode(false);
    }
  };

  /**
   * @feature "验证码验证"
   * 提交验证码并完成登录
   * @calls API-VERIFY-CODE
   */
  const handleSubmit = async () => {
    if (!code || code.length !== 6) {
      setMessage('请输入6位验证码');
      setMessageType('error');
      return;
    }

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          code
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage('验证成功！');
        setMessageType('success');
        // 调用成功回调
        onVerificationSuccess(data);
        // 关闭弹窗
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        setMessage(data.message || '验证码错误或已过期');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('网络请求失败，请稍后再试');
      setMessageType('error');
    }
  };

  // ========== UI Render ==========
  if (!isOpen) return null;

  return (
    <>
      {/* 遮罩层 */}
      <div className="sms-verification-overlay dhclose" onClick={onClose}></div>

      {/* 弹窗容器 */}
      <div className="sms-verification-modal login-slider-lf" role="complementary" aria-label="请选择登录验证方式框">
        {/* 弹窗头部 */}
        <div className="sms-verification-header slider-lf-hd">
          <h2>选择验证方式</h2>
          <a href="javascript:;" className="close-slider" onClick={onClose}>
            <i className="icon"></i>
          </a>
        </div>

        {/* 弹窗内容 */}
        <div className="sms-verification-body slider-lf-bd">
          {/* 验证方式Tab */}
          <ul className="sms-verification-tab slider-lf-tab">
            <li className="active">
              <a href="javascript:;">短信验证</a>
            </li>
          </ul>

          {/* 短信验证表单 */}
          <div className="sms-verification-content slider-lf-con active" id="sms">
            {/* 证件号输入区域 */}
            <div className="sms-verification-item prove-item">
              <label className="sms-verification-label prove-label">
                请输入登录账号绑定的证件号后4位
              </label>
              <input
                type="text"
                className="sms-verification-input prove-input"
                id="id_card"
                maxLength={4}
                placeholder="请输入登录账号绑定的证件号后4位"
                value={idCardLast4}
                onChange={(e) => setIdCardLast4(e.target.value)}
              />
            </div>

            {/* 验证码输入区域 */}
            <div className="sms-verification-item prove-item">
              <label className="sms-verification-label prove-label">输入验证码</label>
              <div className="sms-verification-code-row">
                <input
                  type="text"
                  className="sms-verification-input prove-input"
                  id="verification_code"
                  maxLength={6}
                  placeholder="输入验证码"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <button
                  className={`sms-verification-send-btn btn-send ${countdown > 0 ? 'disabled' : ''}`}
                  id="btn_send"
                  onClick={handleSendCode}
                  disabled={countdown > 0 || isSendingCode}
                >
                  {countdown > 0 ? `重新发送(${countdown})` : '获取验证码'}
                </button>
              </div>
            </div>

            {/* 消息提示区域 */}
            {message && (
              <div
                className={`sms-verification-message prove-msg ${messageType}`}
                id="prove_msg"
              >
                {message}
              </div>
            )}

            {/* 确定按钮 */}
            <button
              className="sms-verification-submit-btn btn-submit"
              onClick={handleSubmit}
            >
              确定
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SmsVerificationModal;
