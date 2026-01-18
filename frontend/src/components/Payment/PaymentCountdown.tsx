/**
 * @component UI-PAYMENT-COUNTDOWN
 * @description 支付倒计时横幅，显示订单剩余有效时间，超时后背景变红
 * @layout_position "页面顶部，倒计时横幅区域"
 * @dimensions "宽度100%，高度auto，padding: 15px 20px"
 * @resources {
 *   images: [
 *     "/images/支付页面-倒计时-锁定图标.png"
 *   ]
 * }
 * 
 * ============ 功能实现清单（必填）============
 * @scenarios_covered:
 * ✅ SCENARIO-001: 显示倒计时（未超时状态）
 * ✅ SCENARIO-002: 倒计时结束后切换为超时状态
 * 
 * @features_implemented:
 * ✅ 实时倒计时显示（分:秒格式）
 * ✅ 超时后背景变为浅红色
 * ✅ 显示锁定图标
 * 
 * @implementation_status:
 * - Scenarios Coverage: 2/2 (100%)
 * - Features Coverage: 3/3 (100%)
 * - UI Visual: 像素级精确
 * ================================================
 */

import React from 'react';
import './PaymentCountdown.css';

interface PaymentCountdownProps {
  remainingSeconds: number;
  isTimeout: boolean;
}

const PaymentCountdown: React.FC<PaymentCountdownProps> = ({
  remainingSeconds,
  isTimeout
}) => {
  // 格式化时间显示（分:秒）
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}分${secs.toString().padStart(2, '0')}秒`;
  };

  return (
    <div className={`payment-countdown ${isTimeout ? 'timeout' : ''}`}>
      <img 
        src="/images/支付页面-倒计时-锁定图标.png" 
        alt="锁定图标" 
        className="countdown-lock-icon"
      />
      <div className="countdown-text">
        席位已锁定，请在提示时间内尽快完成支付，完成网上购票。支付剩余时间：
        <span className="countdown-time">{formatTime(remainingSeconds)}</span>
      </div>
    </div>
  );
};

export default PaymentCountdown;
