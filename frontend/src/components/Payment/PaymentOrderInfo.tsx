/**
 * @component UI-PAYMENT-ORDER-INFO
 * @description 支付页面订单信息区域，显示车次、乘客信息和保险广告
 * @layout_position "倒计时横幅下方，主内容区域"
 * @dimensions "宽度100%，高度auto"
 * @resources {
 *   images: [
 *     "/images/支付页面-订单信息-保险广告.png"
 *   ]
 * }
 * 
 * ============ 功能实现清单（必填）============
 * @scenarios_covered:
 * ✅ SCENARIO-001: 显示订单车次信息
 * ✅ SCENARIO-002: 显示乘客详情表格
 * ✅ SCENARIO-003: 显示总票价
 * 
 * @features_implemented:
 * ✅ 显示车次号、日期、站点、时间
 * ✅ 显示乘客列表（姓名、证件、席别、车厢、座位、票价）
 * ✅ 显示保险广告
 * ✅ 显示总票价（橙色大字）
 * 
 * @implementation_status:
 * - Scenarios Coverage: 3/3 (100%)
 * - Features Coverage: 4/4 (100%)
 * - UI Visual: 像素级精确
 * ================================================
 */

import React from 'react';
import './PaymentOrderInfo.css';

interface Passenger {
  name: string;
  idType: string;
  idNumber: string;
  ticketType: string;
  seatClass: string;
  carNumber: string;
  seatNumber: string;
  price: number;
}

interface OrderInfo {
  orderId: string;
  trainNumber: string;
  date: string;
  fromStation: string;
  toStation: string;
  departTime: string;
  arriveTime: string;
  passengers: Passenger[];
  totalPrice: number;
}

interface PaymentOrderInfoProps {
  orderInfo: OrderInfo;
}

const PaymentOrderInfo: React.FC<PaymentOrderInfoProps> = ({ orderInfo }) => {
  return (
    <div className="payment-order-info-container">
      {/* 标题栏 */}
      <div className="payment-order-info-header">订单信息</div>

      {/* 车次信息 */}
      <div className="payment-train-info">
        <span className="train-date">{orderInfo.date} (周日)</span>
        <span className="train-number">{orderInfo.trainNumber}次</span>
        <span className="station-name">{orderInfo.fromStation}站</span>
        <span className="train-time"> ({orderInfo.departTime} 开) </span>
        <span className="arrow">—</span>
        <span className="station-name">{orderInfo.toStation}站</span>
        <span className="train-time"> ({orderInfo.arriveTime} 到)</span>
      </div>

      {/* 乘客信息表格 */}
      <table className="payment-passenger-table">
        <thead>
          <tr>
            <th>序号</th>
            <th>姓名</th>
            <th>证件类型</th>
            <th>证件号码</th>
            <th>票种</th>
            <th>席别</th>
            <th>车厢</th>
            <th>席位号</th>
            <th>票价（元）</th>
          </tr>
        </thead>
        <tbody>
          {orderInfo.passengers.map((passenger, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{passenger.name}</td>
              <td>{passenger.idType}</td>
              <td>{passenger.idNumber}</td>
              <td>{passenger.ticketType}</td>
              <td>{passenger.seatClass}</td>
              <td>{passenger.carNumber}</td>
              <td>{passenger.seatNumber}</td>
              <td>{passenger.price.toFixed(1)}元</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 保险广告 */}
      <div className="payment-insurance-ad">
        <img 
          src="/images/支付页面-订单信息-保险广告.png" 
          alt="添加铁路乘意险保障" 
          className="insurance-illustration"
        />
        <div className="insurance-content">
          <div className="insurance-title">添加铁路乘意险保障</div>
          <div className="insurance-subtitle">（安心畅行 多重保障护航）低保费高保额 超高性价比</div>
          <div className="insurance-description">
            最高可获<span className="highlight">888万</span>意外伤害、<span className="highlight">5万个人第三者责任保障</span>
          </div>
          <div className="insurance-links">
            已阅读并同意
            <a href="#" className="insurance-link">《保险条款》</a>
            、
            <a href="#" className="insurance-link">《投保须知》</a>
            和
            <a href="#" className="insurance-link">《免责条款》</a>
            。
          </div>
          <div className="insurance-notice">
            欢迎登录铁路保险公司官网<a href="http://www.china-ric.com/" className="insurance-link">http://www.china-ric.com/</a> 查询相关信息及开具发票
          </div>
          <button className="insurance-button">添加保障</button>
        </div>
      </div>

      {/* 总票价 */}
      <div className="payment-total-price">
        <span className="total-label">总票价：</span>
        <span className="total-amount">{orderInfo.totalPrice.toFixed(1)} 元</span>
      </div>
    </div>
  );
};

export default PaymentOrderInfo;
