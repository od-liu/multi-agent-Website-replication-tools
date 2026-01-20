/**
 * @component UI-ORDER-FILL-PAGE
 * @description 订单填写页面容器组件，整合所有子组件
 * @page order-fill
 * @children_slots REQ-ORDER-TOP-NAV, REQ-ORDER-TRAIN-INFO, REQ-ORDER-PASSENGER-SELECT, REQ-ORDER-SUBMIT, REQ-ORDER-TIPS, REQ-ORDER-CONFIRM-MODAL
 * 
 * ============ 功能实现清单（必填）============
 * @scenarios_covered: 无独立scenarios（容器组件）
 * 
 * @features_implemented:
 * ✅ 整合顶部导航栏（复用首页）
 * ✅ 整合列车信息区域
 * ✅ 整合乘客信息选择区域
 * ✅ 整合提交订单区域
 * ✅ 整合温馨提示区域
 * ✅ 整合订单确认弹窗（条件渲染）
 * ✅ 整合底部导航（复用首页）
 * 
 * @implementation_status:
 * - Features Coverage: 7/7 (100%)
 * - UI Visual: 像素级精确
 * ================================================
 */

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HomeTopBar from '../components/HomeTopBar/HomeTopBar';
import SecondaryNav from '../components/SecondaryNav/SecondaryNav';
import BottomNavigation from '../components/BottomNavigation/BottomNavigation';
import TrainInfo from '../components/OrderFill/TrainInfo';
import PassengerInfo from '../components/OrderFill/PassengerInfo';
import SubmitSection from '../components/OrderFill/SubmitSection';
import WarmTips from '../components/OrderFill/WarmTips';
import OrderConfirmModal from '../components/OrderFill/OrderConfirmModal';
import ErrorModal from '../components/OrderFill/ErrorModal';
import './OrderFillPage.css';

/**
 * 订单填写页面容器组件
 * 
 * @layout_position "全屏页面，垂直布局"
 * @dimensions "宽度100vw，高度100vh"
 * @background_images []
 * @resources {
 *   images: [
 *     "/images/order-fill-保险广告.jpg"
 *   ]
 * }
 */
const OrderFillPage: React.FC = () => {
  // ========== State Management ==========
  const location = useLocation();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedPassengers, setSelectedPassengers] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // 订单提交中状态
  
  // 从 localStorage 读取登录状态
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('userId');
  });
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('username') || '';
  });
  
  // 从 localStorage 获取当前登录用户ID
  const userId = localStorage.getItem('userId');
  
  // 默认列车数据（用于直接访问 /order 页面时的展示）
  const defaultTrainData = {
    date: '2026-01-18（周日）',
    trainNo: 'G103',
    departureStation: '北京南',
    departureTime: '06:20',
    arrivalStation: '上海虹桥',
    arrivalTime: '11:58',
    prices: {
      secondClass: { price: 662.0, available: 960 },
      firstClass: { price: 1060.0, available: 805 },
      businessClass: { price: 2318.0, available: 105 }
    }
  };
  
  // 从路由state中获取车次信息，对每个属性进行回退
  const routeData = location.state?.trainData;
  const trainData = {
    date: routeData?.date || defaultTrainData.date,
    trainNo: routeData?.trainNo || defaultTrainData.trainNo,
    departureStation: routeData?.departureStation || defaultTrainData.departureStation,
    departureTime: routeData?.departureTime || defaultTrainData.departureTime,
    arrivalStation: routeData?.arrivalStation || defaultTrainData.arrivalStation,
    arrivalTime: routeData?.arrivalTime || defaultTrainData.arrivalTime,
    prices: {
      secondClass: {
        price: routeData?.prices?.secondClass?.price ?? defaultTrainData.prices.secondClass.price,
        available: routeData?.prices?.secondClass?.available ?? defaultTrainData.prices.secondClass.available
      },
      firstClass: {
        price: routeData?.prices?.firstClass?.price ?? defaultTrainData.prices.firstClass.price,
        available: routeData?.prices?.firstClass?.available ?? defaultTrainData.prices.firstClass.available
      },
      businessClass: {
        price: routeData?.prices?.businessClass?.price ?? defaultTrainData.prices.businessClass.price,
        available: routeData?.prices?.businessClass?.available ?? defaultTrainData.prices.businessClass.available
      },
      softSleeper: routeData?.prices?.softSleeper,
      hardSleeper: routeData?.prices?.hardSleeper
    }
  };

  // 🔧 根据车次类型动态生成可用席位列表
  const trainType = trainData.trainNo.charAt(0);
  const isDTrainType = trainType === 'D';
  
  const availableSeats = isDTrainType
    ? [
        // D车次：软卧、硬卧、二等座
        ...(trainData.prices.softSleeper ? [{ type: '软卧' as const, price: trainData.prices.softSleeper.price, available: trainData.prices.softSleeper.available }] : []),
        ...(trainData.prices.hardSleeper ? [{ type: '硬卧' as const, price: trainData.prices.hardSleeper.price, available: trainData.prices.hardSleeper.available }] : []),
        { type: '二等座' as const, price: trainData.prices.secondClass.price, available: trainData.prices.secondClass.available }
      ]
    : [
        // G/C车次：商务座、一等座、二等座
        { type: '商务座' as const, price: trainData.prices.businessClass.price, available: trainData.prices.businessClass.available },
        { type: '一等座' as const, price: trainData.prices.firstClass.price, available: trainData.prices.firstClass.available },
        { type: '二等座' as const, price: trainData.prices.secondClass.price, available: trainData.prices.secondClass.available }
      ];

  // ========== Lifecycle ==========
  // 监听 localStorage 变化（用于跨标签页同步登录状态）
  React.useEffect(() => {
    const handleStorageChange = () => {
      const userId = localStorage.getItem('userId');
      const storedUsername = localStorage.getItem('username');
      setIsLoggedIn(!!userId);
      setUsername(storedUsername || '');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // ========== Event Handlers ==========
  // 处理退出登录
  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    navigate('/');
  };
  const handleSubmitOrder = () => {
    // 验证是否选择了乘客
    if (selectedPassengers.length === 0) {
      setErrorMessage('请选择至少一位乘客！');
      setShowErrorModal(true);
      return;
    }
    
    // 显示确认弹窗
    setShowConfirmModal(true);
  };

  const handlePassengersChange = (passengers: any[]) => {
    setSelectedPassengers(passengers);
  };

  /**
   * 订单确认处理函数
   * 由 OrderConfirmModal 调用，接收订单ID并跳转到支付页面
   * 订单提交逻辑在 OrderConfirmModal 内部处理
   */
  const handleConfirmOrder = (orderId: string) => {
    console.log('🎫 [OrderFillPage] 收到订单确认，订单号:', orderId);
    console.log('🎫 [OrderFillPage] orderId 类型:', typeof orderId);
    console.log('🎫 [OrderFillPage] orderId 值:', JSON.stringify(orderId));
    
    if (!orderId) {
      console.error('❌ [OrderFillPage] 订单号为空，无法跳转！');
      return;
    }
    
    setShowConfirmModal(false);
    
    // 跳转到支付页面
    const paymentUrl = `/payment/${orderId}`;
    console.log('🎫 [OrderFillPage] 跳转到支付页面:', paymentUrl);
    navigate(paymentUrl);
  };

  const handleBack = () => {
    navigate(-1); // 返回上一页
  };

  const handleCloseModal = () => {
    // 提交过程中不允许关闭弹窗
    if (!isSubmitting) {
      setShowConfirmModal(false);
    }
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  // ========== UI Render ==========
  return (
    <div className="order-fill-page">
      {/* 顶部导航区域（白色背景） */}
      <header className="order-fill-header">
        <HomeTopBar 
          isLoggedIn={isLoggedIn} 
          username={username}
          onLogout={handleLogout}
        />
        <SecondaryNav activeItem="车票" />
      </header>
      
      {/* 主内容区域 */}
      <div className="order-fill-main-content">
        {/* REQ-ORDER-TRAIN-INFO: 列车信息区域 */}
        <TrainInfo
          date={trainData.date}
          trainNo={trainData.trainNo}
          departureStation={trainData.departureStation}
          departureTime={trainData.departureTime}
          arrivalStation={trainData.arrivalStation}
          arrivalTime={trainData.arrivalTime}
          prices={trainData.prices}
        />
        
        {/* REQ-ORDER-PASSENGER-SELECT: 乘客信息区域 */}
        <PassengerInfo
          trainNo={trainData.trainNo}
          availableSeats={availableSeats}
          onPassengersChange={handlePassengersChange}
          userId={userId || undefined}
        />
        
        {/* REQ-ORDER-SUBMIT: 提交订单区域 */}
        <SubmitSection
          onSubmit={handleSubmitOrder}
          onBack={handleBack}
        />
        
        {/* REQ-ORDER-TIPS: 温馨提示区域 */}
        <WarmTips />
      </div>
      
      {/* 底部导航（复用首页） */}
      <BottomNavigation />
      
      {/* REQ-ORDER-CONFIRM-MODAL: 订单确认弹窗（条件渲染） */}
      {showConfirmModal && (
        <OrderConfirmModal
          trainInfo={{
            date: trainData.date,
            trainNo: trainData.trainNo,
            departureStation: trainData.departureStation,
            departureTime: trainData.departureTime,
            arrivalStation: trainData.arrivalStation,
            arrivalTime: trainData.arrivalTime
          }}
          passengers={selectedPassengers.map(sp => ({
            id: sp.passenger.id,
            name: sp.passenger.name,
            idType: sp.passenger.idType,
            idNumber: sp.passenger.idNumber,
            seatType: sp.seatType,
            ticketType: sp.ticketType
          }))}
          seatAvailability={{
            businessClass: trainData.prices.businessClass.available,
            firstClass: trainData.prices.firstClass.available,
            secondClass: trainData.prices.secondClass.available
          }}
          onClose={handleCloseModal}
          onConfirm={handleConfirmOrder}
          isSubmitting={isSubmitting}
        />
      )}
      
      {/* REQ-ORDER-ERROR-MODAL: 错误提示弹窗 */}
      {showErrorModal && (
        <ErrorModal
          isOpen={showErrorModal}
          errorType="general"
          errorMessage={errorMessage}
          onClose={handleCloseErrorModal}
        />
      )}
    </div>
  );
};

export default OrderFillPage;
