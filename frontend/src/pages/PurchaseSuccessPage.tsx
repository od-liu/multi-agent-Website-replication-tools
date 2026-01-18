/**
 * @component UI-SUCCESS-PAGE
 * @description 购票成功页面容器组件，显示成功提示、订单详情和温馨提示
 * @calls API-GET-ORDER-SUCCESS - 获取订单成功信息
 * @children_slots REQ-SUCCESS-MESSAGE, REQ-SUCCESS-ORDER-DETAIL, REQ-SUCCESS-ACTIONS, REQ-SUCCESS-TIPS
 * 
 * ============ 功能实现清单（必填）============
 * @scenarios_covered:
 * ✅ SCENARIO-001: 系统跳转至购票成功页
 * ✅ SCENARIO-002: 用户继续购票
 * ✅ SCENARIO-003: 用户查询订单详情
 * 
 * @features_implemented:
 * ✅ 显示成功图标和提示文字
 * ✅ 显示订单信息（订单号、车次、乘客等）
 * ✅ 提供查看订单详情按钮
 * ✅ 提供继续购票按钮
 * ✅ 显示温馨提示
 * 
 * @implementation_status:
 * - Scenarios Coverage: 3/3 (100%)
 * - Features Coverage: 5/5 (100%)
 * - UI Visual: 像素级精确
 * ================================================
 * 
 * @layout_position "页面主容器，包含顶部导航、主内容区和底部导航"
 * @dimensions "宽度100%，最大宽度1512px，居中显示"
 * @resources {
 *   images: [
 *     "/images/购票成功页-成功提示-成功图标.png",
 *     "/images/购票成功页-温馨提示-微信二维码.png",
 *     "/images/购票成功页-温馨提示-支付宝二维码.png",
 *     "/images/购票成功页-温馨提示-广告横幅.png"
 *   ]
 * }
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HomeTopBar from '../components/HomeTopBar/HomeTopBar';
import MainNavigation from '../components/MainNavigation/MainNavigation';
import BottomNavigation from '../components/BottomNavigation/BottomNavigation';
import SuccessBanner from '../components/PurchaseSuccess/SuccessBanner';
import SuccessOrderInfo from '../components/PurchaseSuccess/SuccessOrderInfo';
import SuccessActions from '../components/PurchaseSuccess/SuccessActions';
import SuccessTips from '../components/PurchaseSuccess/SuccessTips';
import './PurchaseSuccessPage.css';

interface OrderSuccessInfo {
  orderId: string;
  orderNumber: string;
  trainNumber: string;
  date: string;
  fromStation: string;
  toStation: string;
  departTime: string;
  arriveTime: string;
  passengers: Array<{
    name: string;
    gender: string;
    idType: string;
    idNumber: string;
    ticketType: string;
    seatClass: string;
    carNumber: string;
    seatNumber: string;
    price: number;
    status: string;
  }>;
}

const PurchaseSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  // ========== State Management ==========
  const [orderInfo, setOrderInfo] = useState<OrderSuccessInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // ========== Scenario Implementations ==========

  /**
   * @scenario SCENARIO-001 "系统跳转至购票成功页"
   * @given 用户在订单支付页点击"网上支付"按钮
   * @when 支付成功
   * @then 系统跳转至购票成功页，显示成功提示和订单详情
   */
  useEffect(() => {
    const fetchOrderSuccessInfo = async () => {
      if (!orderId) {
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5175/api/orders/${orderId}/success`, {
          method: 'GET',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('订单信息获取失败');
        }

        const data = await response.json();
        
        if (data.success) {
          setOrderInfo(data.order);
        } else {
          throw new Error(data.message || '订单信息获取失败');
        }
      } catch (error) {
        console.error('获取订单信息失败:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderSuccessInfo();
  }, [orderId, navigate]);

  /**
   * @scenario SCENARIO-002 "用户继续购票"
   * @given 用户在购票成功页
   * @when 用户点击"继续购票"按钮
   * @then 系统跳转至车次列表页
   */
  const handleContinuePurchase = () => {
    setTimeout(() => {
      navigate('/trains');
    }, 100);
  };

  /**
   * @scenario SCENARIO-003 "用户查询订单详情"
   * @given 用户在购票成功页
   * @when 用户点击"查询订单详情"按钮
   * @then 系统跳转至个人信息页的火车票订单页
   */
  const handleViewOrderDetail = () => {
    setTimeout(() => {
      navigate('/orders');
    }, 100);
  };

  /**
   * 处理"餐饮·特产"按钮点击
   */
  const handleCateringClick = () => {
    // TODO: 跳转至餐饮特产页面
    alert('餐饮·特产功能开发中');
  };

  // ========== UI Render ==========

  if (loading) {
    return (
      <div className="purchase-success-page">
        <HomeTopBar />
        <MainNavigation />
        <div className="success-loading">加载中...</div>
      </div>
    );
  }

  if (!orderInfo) {
    return null;
  }

  return (
    <div className="purchase-success-page">
      {/* 顶部导航 - 复用共享组件 */}
      <HomeTopBar />
      <MainNavigation />

      {/* 主内容区 */}
      <div className="success-main-content">
        {/* 成功提示横幅 */}
        <SuccessBanner
          orderNumber={orderInfo.orderNumber}
          passengers={orderInfo.passengers}
        />

        {/* 订单详情区域 */}
        <SuccessOrderInfo orderInfo={orderInfo} />

        {/* 操作按钮组 */}
        <SuccessActions
          onCatering={handleCateringClick}
          onContinuePurchase={handleContinuePurchase}
          onViewDetail={handleViewOrderDetail}
        />

        {/* 温馨提示区域 */}
        <SuccessTips />

        {/* 广告横幅 */}
        <div className="success-ad-banner">
          <img 
            src="/images/购票成功页-温馨提示-广告横幅.png" 
            alt="广告横幅" 
            className="ad-banner-image"
          />
        </div>
      </div>

      {/* 底部导航 - 复用共享组件 */}
      <BottomNavigation />
    </div>
  );
};

export default PurchaseSuccessPage;
