/**
 * @component UI-SUCCESS-MESSAGE
 * @description 成功提示横幅，显示成功图标、订单号和乘车人信息
 * @layout_position "主导航栏下方，页面顶部醒目位置"
 * @dimensions "1100px × 165px，margin: 10px 30px 20px"
 * @resources {
 *   images: [
 *     "/images/购票成功页-成功提示-成功图标.png"
 *   ]
 * }
 * 
 * ============ 功能实现清单（必填）============
 * @scenarios_covered:
 * ✅ SCENARIO-001: 显示成功提示信息
 * ✅ SCENARIO-002: 显示订单号
 * ✅ SCENARIO-003: 显示乘车人信息
 * 
 * @features_implemented:
 * ✅ 显示成功图标
 * ✅ 显示"交易已成功！"文字
 * ✅ 显示订单号（橙色高亮）
 * ✅ 显示乘车人信息和消息通知方式
 * 
 * @implementation_status:
 * - Scenarios Coverage: 3/3 (100%)
 * - Features Coverage: 4/4 (100%)
 * - UI Visual: 像素级精确
 * ================================================
 */

import React from 'react';
import './SuccessBanner.css';

interface Passenger {
  name: string;
  gender: string;
}

interface SuccessBannerProps {
  orderNumber: string;
  passengers: Passenger[];
}

const SuccessBanner: React.FC<SuccessBannerProps> = ({ orderNumber, passengers }) => {
  // 格式化乘车人信息
  const formatPassengerInfo = () => {
    return passengers.map(p => {
      const title = p.gender === '女' ? '女士' : '先生';
      return `${p.name} ${title}`;
    }).join('、');
  };

  return (
    <div className="success-banner">
      <img 
        src="/images/购票成功页-成功提示-成功图标.png" 
        alt="成功图标" 
        className="success-icon"
      />
      <div className="success-content">
        <div className="success-title-row">
          <div className="success-title">交易已成功！</div>
          <div className="success-thanks">感谢您选择铁路出行！</div>
        </div>
        <div className="success-order-info">
          您的订单号：<span className="order-number">{orderNumber}</span>
        </div>
        <div className="success-passenger-info">
          <div className="passenger-name">
            {formatPassengerInfo()}可持购票时所使用的中国居民身份证原件于购票后、列车开车前到车站直接检票乘车。
          </div>
        </div>
        <div className="success-notification-info">
          消息通知方式进行相关调整，将通过"铁路12306"App客户端为您推送相关消息（需开启接收推送权限）。您也可以扫描关注下方"铁路12306"微信公众号或支付宝生活号二维码，选择通过微信或支付宝接收。
        </div>
      </div>
    </div>
  );
};

export default SuccessBanner;
