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
  const getWeekdayCN = (dateStr: string) => {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return '周日';
    const map = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'] as const;
    return map[d.getDay()];
  };

  return (
    <div className="payment-order-info-container">
      {/* 标题栏 */}
      <div className="payment-order-info-header">订单信息</div>

      {/* 车次信息 */}
      <div className="paymentOrderInfo-trainInfo">
        <span className="paymentOrderInfo-trainDate">{orderInfo.date}（{getWeekdayCN(orderInfo.date)}）</span>
        <span className="paymentOrderInfo-trainNumber">{orderInfo.trainNumber}次</span>
        <span className="paymentOrderInfo-stationName">{orderInfo.fromStation}</span>站
        <span className="paymentOrderInfo-trainTimeStrong">（{orderInfo.departTime}开）</span>
        <span className="paymentOrderInfo-arrow">—</span>
        <span className="paymentOrderInfo-stationName">{orderInfo.toStation}</span>站
        <span className="paymentOrderInfo-trainTimeLight">（{orderInfo.arriveTime}到）</span>
      </div>

      {/* 乘客信息表格 */}
      <table className="paymentOrderInfo-passengerTable">
        <thead>
          <tr>
            <th><strong>序号</strong></th>
            <th><strong>姓名</strong></th>
            <th><strong>证件类型</strong></th>
            <th><strong>证件号码</strong></th>
            <th><strong>票种</strong></th>
            <th><strong>席别</strong></th>
            <th><strong>车厢</strong></th>
            <th><strong>席位号</strong></th>
            <th><strong>票价（元）</strong></th>
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
      <div className="paymentOrderInfo-insuranceAd">
        <img
          src="/images/支付页面-订单信息-保险广告.png"
          alt="铁路乘意险广告（包含标题、说明与添加保障按钮）"
          className="paymentOrderInfo-insuranceAdImage"
        />
      </div>

      {/* 总票价 */}
      <div className="paymentOrderInfo-totalPrice">
        <span className="paymentOrderInfo-totalLabel">总票价：</span>
        <span className="paymentOrderInfo-totalAmount">{orderInfo.totalPrice.toFixed(1)}元</span>
      </div>
    </div>
  );
};

export default PaymentOrderInfo;
