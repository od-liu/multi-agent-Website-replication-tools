/**
 * @component UI-SUCCESS-ORDER-DETAIL
 * @description 订单详情区域，显示车次信息和乘客信息表格
 * @layout_position "成功提示横幅下方"
 * @dimensions "1100px × 740px，margin: 20px 0"
 * 
 * ============ 功能实现清单（必填）============
 * @scenarios_covered:
 * ✅ SCENARIO-001: 显示车次信息
 * ✅ SCENARIO-002: 显示乘客信息表格
 * 
 * @features_implemented:
 * ✅ 显示车次号、日期、站点、时间
 * ✅ 显示乘客列表（序号、姓名、证件、票种、席别、车厢、座位、票价、订单状态）
 * ✅ 证件号中间打码显示
 * ✅ 订单状态显示为"已支付"（橙色）
 * 
 * @implementation_status:
 * - Scenarios Coverage: 2/2 (100%)
 * - Features Coverage: 4/4 (100%)
 * - UI Visual: 像素级精确
 * ================================================
 */

import React from 'react';
import './SuccessOrderInfo.css';

interface Passenger {
  name: string;
  idType: string;
  idNumber: string;
  ticketType: string;
  seatClass: string;
  carNumber: string;
  seatNumber: string;
  price: number;
  status: string;
}

interface OrderSuccessInfo {
  trainNumber: string;
  date: string;
  fromStation: string;
  toStation: string;
  departTime: string;
  arriveTime: string;
  passengers: Passenger[];
}

interface SuccessOrderInfoProps {
  orderInfo: OrderSuccessInfo;
}

const SuccessOrderInfo: React.FC<SuccessOrderInfoProps> = ({ orderInfo }) => {
  // 证件号打码处理（前4位+****+后3位）
  const maskIdNumber = (idNumber: string) => {
    if (idNumber.length <= 7) return idNumber;
    return `${idNumber.slice(0, 4)}${'*'.repeat(idNumber.length - 7)}${idNumber.slice(-3)}`;
  };

  const weekdayMap = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'] as const;
  const weekday = (() => {
    const dateStr = (orderInfo.date || '').trim();
    // Safer parsing across browsers than `new Date('YYYY-MM-DD')`
    const d = new Date(dateStr.replace(/-/g, '/'));
    return Number.isNaN(d.getTime()) ? '周日' : weekdayMap[d.getDay()];
  })();

  const renderStation = (stationName: string, variant: 'from' | 'to') => {
    const trimmed = (stationName || '').trim();
    const hasSuffix = trimmed.endsWith('站');
    const nameCls =
      variant === 'from' ? 'successOrderInfo-stationNameFrom' : 'successOrderInfo-stationNameTo';
    return (
      <>
        <span className={nameCls}>{hasSuffix ? trimmed.slice(0, -1) : trimmed}</span>
        {!hasSuffix && <span className="successOrderInfo-stationSuffix">站</span>}
      </>
    );
  };

  return (
    <div className="success-order-info-container">
      {/* 标题栏 */}
      <div className="success-order-info-header">订单信息</div>

      {/* 车次信息行 */}
      <div className="success-order-train-info">
        <span className="successOrderInfo-dateText">
          {orderInfo.date} <span className="successOrderInfo-weekday">（{weekday}）</span>
        </span>
        <span className="successOrderInfo-trainText">{orderInfo.trainNumber}次</span>
        {renderStation(orderInfo.fromStation, 'from')}
        <span className="successOrderInfo-timeText">（{orderInfo.departTime} 开）</span>
        <span className="successOrderInfo-separator">—</span>
        {renderStation(orderInfo.toStation, 'to')}
        <span className="successOrderInfo-timeText">（{orderInfo.arriveTime} 到）</span>
      </div>

      {/* 乘客信息表格 */}
      <table className="success-order-table">
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
            <th>订单状态</th>
          </tr>
        </thead>
        <tbody>
          {orderInfo.passengers.map((passenger, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{passenger.name}</td>
              <td>{passenger.idType}</td>
              <td>{maskIdNumber(passenger.idNumber)}</td>
              <td>{passenger.ticketType}</td>
              <td>{passenger.seatClass}</td>
              <td>{passenger.carNumber}</td>
              <td>{passenger.seatNumber}</td>
              <td>{passenger.price.toFixed(1)}元</td>
              <td className="status-paid">{passenger.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SuccessOrderInfo;
