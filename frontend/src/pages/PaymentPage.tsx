/**
 * @component UI-PAYMENT-PAGE
 * @description 支付页面容器组件，整合顶部导航、支付倒计时、订单信息、支付按钮和底部导航
 * @calls API-GET-ORDER-INFO - 获取订单详情
 * @calls API-CONFIRM-PAYMENT - 确认支付
 * @calls API-CANCEL-ORDER - 取消订单
 * @children_slots REQ-PAYMENT-COUNTDOWN, REQ-PAYMENT-ORDER-INFO, REQ-PAYMENT-SUBMIT
 * 
 * ============ 功能实现清单（必填）============
 * @scenarios_covered:
 * ✅ SCENARIO-001: 从订单填写页跳转支付页
 * ✅ SCENARIO-002: 从未完成订单页跳转支付页
 * ✅ SCENARIO-003: 用户确认支付车票（订单未超时）
 * ✅ SCENARIO-004: 用户确认支付车票但订单已超时
 * ✅ SCENARIO-005: 用户点击取消订单按钮
 * ✅ SCENARIO-006: 用户在交易提示弹窗确认取消订单
 * ✅ SCENARIO-007: 用户在交易提示弹窗取消操作
 * ✅ SCENARIO-008: 用户在订单支付页超时
 * 
 * @features_implemented:
 * ✅ 显示订单摘要信息（订单号、车次、乘客、金额）
 * ✅ 显示支付倒计时（20分钟倒计时）
 * ✅ 提供"网上支付"和"取消订单"按钮
 * ✅ 支付超时自动切换UI状态
 * ✅ 支付成功跳转购票成功页
 * ✅ 取消订单确认弹窗
 * 
 * @implementation_status:
 * - Scenarios Coverage: 8/8 (100%)
 * - Features Coverage: 6/6 (100%)
 * - UI Visual: 像素级精确
 * ================================================
 * 
 * @layout_position "页面主容器，包含顶部导航、主内容区和底部导航"
 * @dimensions "宽度100%，最大宽度1512px，居中显示"
 * @resources {
 *   images: [
 *     "/images/支付和成功页-顶部导航-Logo.png",
 *     "/images/支付和成功页-顶部导航-搜索图标.svg",
 *     "/images/支付页面-倒计时-锁定图标.png",
 *     "/images/支付页面-订单信息-保险广告.png"
 *   ]
 * }
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HomeTopBar from '../components/HomeTopBar/HomeTopBar';
import MainNavigation from '../components/MainNavigation/MainNavigation';
import BottomNavigation from '../components/BottomNavigation/BottomNavigation';
import PaymentCountdown from '../components/Payment/PaymentCountdown';
import PaymentOrderInfo from '../components/Payment/PaymentOrderInfo';
import PaymentSubmit from '../components/Payment/PaymentSubmit';
import CancelOrderModal from '../components/Payment/CancelOrderModal';
import TimeoutModal from '../components/Payment/TimeoutModal';
import './PaymentPage.css';

interface OrderInfo {
  orderId: string;
  trainNumber: string;
  date: string;
  fromStation: string;
  toStation: string;
  departTime: string;
  arriveTime: string;
  passengers: Array<{
    name: string;
    idType: string;
    idNumber: string;
    ticketType: string;
    seatClass: string;
    carNumber: string;
    seatNumber: string;
    price: number;
  }>;
  totalPrice: number;
  createdAt: string;
  expiresAt: string;
}

const PaymentPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  // ========== State Management ==========
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [remainingSeconds, setRemainingSeconds] = useState(1200); // 20分钟 = 1200秒
  const [isTimeout, setIsTimeout] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // ========== Scenario Implementations ==========

  /**
   * @scenario SCENARIO-001 "从订单填写页跳转支付页"
   * @given 乘客在订单填写页的信息核对弹窗
   * @when 乘客点击"确认"按钮
   * @then 页面跳转到订单支付页，显示席位锁定时效倒计时区域，倒计时从20分钟开始
   * 
   * @scenario SCENARIO-002 "从未完成订单页跳转支付页"
   * @given 乘客在火车票订单的未完成订单子页面
   * @when 用户点击未完成车票下方的"去支付"按钮
   * @then 页面跳转到订单支付页，倒计时显示该订单的剩余有效时间
   */
  useEffect(() => {
    const fetchOrderInfo = async () => {
      if (!orderId) {
        navigate('/trains');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5175/api/payment/${orderId}`, {
          method: 'GET',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('订单信息获取失败');
        }

        const data = await response.json();
        
        if (data.success) {
          setOrderInfo(data.order);
          
          // 计算剩余时间
          const createdTime = new Date(data.order.createdAt).getTime();
          const expiresTime = new Date(data.order.expiresAt).getTime();
          const now = Date.now();
          const remaining = Math.max(0, Math.floor((expiresTime - now) / 1000));
          
          setRemainingSeconds(remaining);
          setIsTimeout(remaining === 0);
        } else {
          throw new Error(data.message || '订单信息获取失败');
        }
      } catch (error) {
        console.error('获取订单信息失败:', error);
        navigate('/trains');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderInfo();
  }, [orderId, navigate]);

  /**
   * @scenario SCENARIO-008 "用户在订单支付页超时"
   * @given 用户在订单支付页，用户在倒计时结束前未点击"网上支付"按钮
   * @when 倒计时结束，倒计时显示"00分00秒"
   * @then 页面保持不变，倒计时数值不再变化，固定为"00分00秒"，倒计时面板背景变为浅红色
   */
  useEffect(() => {
    if (isTimeout || remainingSeconds === 0) {
      return;
    }

    const timer = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          setIsTimeout(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSeconds, isTimeout]);

  /**
   * @scenario SCENARIO-003 "用户确认支付车票（订单未超时）"
   * @given 用户在订单支付页，订单未超时（倒计时未结束）
   * @when 用户点击"网上支付"按钮
   * @then 按钮显示"处理中..."，调用支付确认API，支付成功后跳转到购票成功页
   * @calls API-CONFIRM-PAYMENT
   * 
   * @scenario SCENARIO-004 "用户确认支付车票但订单已超时"
   * @given 用户在订单支付页，订单已超时
   * @when 用户点击"网上支付"按钮
   * @then 系统弹出超时提示弹窗
   */
  const handlePayment = async () => {
    if (isTimeout) {
      setShowTimeoutModal(true);
      return;
    }

    try {
      setIsProcessing(true);

      const response = await fetch(`http://localhost:5175/api/payment/${orderId}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        // 支付成功，跳转到购票成功页
        setTimeout(() => {
          navigate(`/success/${orderId}`);
        }, 100);
      } else {
        if (data.timeout) {
          setIsTimeout(true);
          setShowTimeoutModal(true);
        } else {
          alert(data.message || '支付失败，请稍后再试');
        }
      }
    } catch (error) {
      console.error('支付失败:', error);
      alert('网络请求失败，请稍后再试');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * @scenario SCENARIO-005 "用户点击取消订单按钮"
   * @given 用户在订单支付页
   * @when 用户点击"取消订单"按钮
   * @then 系统弹出交易提示弹窗
   */
  const handleCancelOrder = () => {
    if (isTimeout) {
      setShowTimeoutModal(true);
      return;
    }
    setShowCancelModal(true);
  };

  /**
   * @scenario SCENARIO-006 "用户在交易提示弹窗确认取消订单"
   * @given 用户在订单支付页的交易提示弹窗
   * @when 用户点击"确认"按钮
   * @then 系统调用取消订单API，页面跳转到车次列表页
   * @calls API-CANCEL-ORDER
   */
  const handleConfirmCancel = async () => {
    try {
      const response = await fetch(`http://localhost:5175/api/payment/${orderId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        // 取消成功，跳转到车次列表页
        setTimeout(() => {
          navigate('/trains');
        }, 100);
      } else {
        alert(data.message || '取消订单失败');
        setShowCancelModal(false);
      }
    } catch (error) {
      console.error('取消订单失败:', error);
      alert('网络请求失败，请稍后再试');
      setShowCancelModal(false);
    }
  };

  /**
   * @scenario SCENARIO-007 "用户在交易提示弹窗取消操作"
   * @given 用户在订单支付页的交易提示弹窗
   * @when 用户点击"取消"按钮
   * @then 弹窗消失，页面回到订单支付页，倒计时继续运行
   */
  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
  };

  /**
   * 处理超时提示弹窗确认
   * 点击跳转到车次列表页
   */
  const handleTimeoutConfirm = () => {
    navigate('/trains');
  };

  // ========== UI Render ==========

  if (loading) {
    return (
      <div className="payment-page">
        <HomeTopBar />
        <MainNavigation />
        <div className="payment-loading">加载中...</div>
      </div>
    );
  }

  if (!orderInfo) {
    return null;
  }

  return (
    <div className="payment-page">
      {/* 顶部导航 - 复用共享组件 */}
      <HomeTopBar />
      <MainNavigation />

      {/* 主内容区 */}
      <div className="payment-main-content">
        {/* 倒计时横幅 */}
        <PaymentCountdown
          remainingSeconds={remainingSeconds}
          isTimeout={isTimeout}
        />

        {/* 订单信息区域 */}
        <PaymentOrderInfo orderInfo={orderInfo} />

        {/* 支付按钮区域 */}
        <PaymentSubmit
          totalPrice={orderInfo.totalPrice}
          isTimeout={isTimeout}
          isProcessing={isProcessing}
          onPayment={handlePayment}
          onCancel={handleCancelOrder}
        />

        {/* 温馨提示 */}
        <div className="payment-warm-tips">
          <div className="tips-title">温馨提示：</div>
          <ol className="tips-list">
            <li>请在指定时间内完成网上支付。</li>
            <li>逾期未支付，系统将取消本次交易。</li>
            <li>在完成支付或取消本订单之前，您将无法购买其他车票。</li>
            <li>退票政策和收费：<a href="#" className="tips-link">详改说明</a></li>
            <li>购买铁路乘意险保障您的出行安全。</li>
            <li>请充分理解保险责任、责任免除、保险期间、合同解除等约定，详询保险条款，详见保险条款或保险单号登录查看。</li>
            <li>如因违力原因或其他不可控因素的出行变动，当前车型能会发生变动。</li>
            <li>跨境旅客暂行须知及旅客携带品直接由车站公告。</li>
            <li>未尽事宜详见《国铁集团旅客服务质量规范》等有关规定和车站公告。</li>
          </ol>
        </div>
      </div>

      {/* 底部导航 - 复用共享组件 */}
      <BottomNavigation />

      {/* 取消订单确认弹窗 */}
      {showCancelModal && (
        <CancelOrderModal
          onConfirm={handleConfirmCancel}
          onCancel={handleCloseCancelModal}
        />
      )}

      {/* 超时提示弹窗 */}
      {showTimeoutModal && (
        <TimeoutModal onConfirm={handleTimeoutConfirm} />
      )}
    </div>
  );
};

export default PaymentPage;
