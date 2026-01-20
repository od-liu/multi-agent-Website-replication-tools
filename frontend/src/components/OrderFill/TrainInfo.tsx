/**
 * @component UI-ORDER-TRAIN-INFO
 * @description 列车信息区域，显示用户选择的车次信息（只读展示）
 * @page order-fill
 * 
 * ============ 功能实现清单（必填）============
 * @scenarios_covered: 无独立scenarios（纯展示组件）
 * 
 * @features_implemented:
 * ✅ 显示车次号（如G103）
 * ✅ 显示出发车站和到达车站
 * ✅ 显示出发时间和到达时间
 * ✅ 显示日期（如2026-01-18（周日））
 * ✅ 显示席别价格和余票信息（二等座/一等座/商务座）
 * ✅ 显示价格说明链接
 * ✅ 信息清晰易读，不可修改
 * 
 * @implementation_status:
 * - Features Coverage: 7/7 (100%)
 * - UI Visual: 像素级精确
 * ================================================
 * 
 * @layout_position "页面主内容区域顶部，位于导航栏下方"
 * @dimensions "1100px × 169px"
 * @resources {
 *   images: []
 * }
 */

import React from 'react';
import './TrainInfo.css';

interface TrainInfoProps {
  date: string; // 如 "2026-01-18（周日）"
  trainNo: string; // 如 "G103" 或 "D10"
  departureStation: string; // 如 "北京南"
  departureTime: string; // 如 "06:20"
  arrivalStation: string; // 如 "上海虹桥"
  arrivalTime: string; // 如 "11:58"
  prices: {
    secondClass: { price: number; available: number }; // 二等座
    firstClass?: { price: number; available: number }; // 一等座（G/C车型）
    businessClass?: { price: number; available: number }; // 商务座（G/C车型）
    hardSleeper?: { price: number; available: number }; // 硬卧（D车型）
    softSleeper?: { price: number; available: number }; // 软卧（D车型）
  };
}

/**
 * 列车信息区域组件
 */
const TrainInfo: React.FC<TrainInfoProps> = ({
  date,
  trainNo,
  departureStation,
  departureTime,
  arrivalStation,
  arrivalTime,
  prices
}) => {
  // 根据车次号判断车型
  const trainType = trainNo.charAt(0);
  const isDTrainType = trainType === 'D';
  
  // ========== UI Render ==========
  return (
    <div className="train-info-section" id="ui-train-info-full">
      {/* 标题栏：蓝色背景 */}
      <div className="train-info-header">
        <div className="train-info-title">
          列车信息
          <span className="train-info-titleSmall">（以下余票信息仅供参考）</span>
        </div>
      </div>
      
      {/* 内容区：白色背景 */}
      <div className="train-info-content">
        {/* 基础信息：日期、车次、站点 */}
        <div className="train-basic-info">
          <span className="train-date">{date}</span>
          <span className="train-info-group">
            <span className="train-no">{trainNo}</span>
            <span className="train-text">次</span>
          </span>
          <span className="train-info-group">
            <span className="train-station">{departureStation}</span>
            <span className="train-text">站</span>
            <span className="train-bold-group">（{departureTime}开）—{arrivalStation}</span>
            <span className="train-text">站（{arrivalTime}到）</span>
          </span>
        </div>
        
        {/* 票价信息：根据车型显示不同席别 */}
        <div className="train-fare-info">
          {isDTrainType ? (
            // D 开头车型：显示软卧、硬卧、二等座
            <>
              <div className="fare-item">
                <span className="seat-type-label">软卧</span>
                <span className="seat-price-bracket">（</span>
                <span className="seat-price">¥{(prices.softSleeper?.price || 0).toFixed(1)}元</span>
                <span className="seat-price-bracket">）</span>
                <span className="seat-available"> {prices.softSleeper?.available || 0}张票</span>
              </div>
              <div className="fare-item">
                <span className="seat-type-label">硬卧</span>
                <span className="seat-price-bracket">（</span>
                <span className="seat-price">¥{(prices.hardSleeper?.price || 0).toFixed(1)}元</span>
                <span className="seat-price-bracket">）</span>
                <span className="seat-available"> {prices.hardSleeper?.available || 0}张票</span>
              </div>
              <div className="fare-item">
                <span className="seat-type-label">二等座</span>
                <span className="seat-price-bracket">（</span>
                <span className="seat-price">¥{prices.secondClass.price.toFixed(1)}元</span>
                <span className="seat-price-bracket">）</span>
                <span className="seat-available"> {prices.secondClass.available}张票</span>
              </div>
            </>
          ) : (
            // G/C 开头车型：显示商务座、一等座、二等座
            <>
              <div className="fare-item">
                <span className="seat-type-label">商务座</span>
                <span className="seat-price-bracket">（</span>
                <span className="seat-price">¥{(prices.businessClass?.price || 0).toFixed(1)}元</span>
                <span className="seat-price-bracket">）</span>
                <span className="seat-available"> {prices.businessClass?.available || 0}张票</span>
              </div>
              <div className="fare-item">
                <span className="seat-type-label">一等座</span>
                <span className="seat-price-bracket">（</span>
                <span className="seat-price">¥{(prices.firstClass?.price || 0).toFixed(1)}元</span>
                <span className="seat-price-bracket">）</span>
                <span className="seat-available"> {prices.firstClass?.available || 0}张票</span>
              </div>
              <div className="fare-item">
                <span className="seat-type-label">二等座</span>
                <span className="seat-price-bracket">（</span>
                <span className="seat-price">¥{prices.secondClass.price.toFixed(1)}元</span>
                <span className="seat-price-bracket">）</span>
                <span className="seat-available"> {prices.secondClass.available}张票</span>
              </div>
            </>
          )}
        </div>
        
        {/* 价格说明 */}
        <div className="train-info-notice">
          <p className="notice-text">
            *显示的价格均为实际活动折扣后票价，供您参考，查看
            <a href="#">公布票价</a>。
            具体票价以您确认支付时实际购买的铺别票价为准。
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrainInfo;
