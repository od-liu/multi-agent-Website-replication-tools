/**
 * @component UI-SUCCESS-ACTIONS
 * @description 操作按钮组，提供餐饮·特产、继续购票、查询订单详情功能
 * @layout_position "订单详情下方"
 * @dimensions "宽度100%，按钮高度50px"
 * 
 * ============ 功能实现清单（必填）============
 * @scenarios_covered:
 * ✅ SCENARIO-001: 用户点击"继续购票"
 * ✅ SCENARIO-002: 用户点击"查询订单详情"
 * ✅ SCENARIO-003: 用户点击"餐饮·特产"
 * 
 * @features_implemented:
 * ✅ 提供"餐饮·特产"按钮（白底灰字）
 * ✅ 提供"继续购票"按钮（白底灰字）
 * ✅ 提供"查询订单详情"按钮（橙色）
 * 
 * @implementation_status:
 * - Scenarios Coverage: 3/3 (100%)
 * - Features Coverage: 3/3 (100%)
 * - UI Visual: 像素级精确
 * ================================================
 */

import React from 'react';
import './SuccessActions.css';

interface SuccessActionsProps {
  onCatering: () => void;
  onContinuePurchase: () => void;
  onViewDetail: () => void;
}

const SuccessActions: React.FC<SuccessActionsProps> = ({
  onCatering,
  onContinuePurchase,
  onViewDetail
}) => {
  return (
    <div className="success-actions-container">
      <button className="success-action-button secondary-button" onClick={onCatering}>
        餐饮·特产
      </button>
      <button className="success-action-button secondary-button" onClick={onContinuePurchase}>
        继续购票
      </button>
      <button className="success-action-button primary-button" onClick={onViewDetail}>
        查询订单详情
      </button>
    </div>
  );
};

export default SuccessActions;
