/**
 * @component UI-CANCEL-ORDER-MODAL
 * @description 取消订单确认弹窗，警告用户取消订单的后果
 * @layout_position "居中模态弹窗"
 * @dimensions "最大宽度600px，宽度100%"
 * 
 * ============ 功能实现清单（必填）============
 * @scenarios_covered:
 * ✅ SCENARIO-001: 显示取消订单警告信息
 * ✅ SCENARIO-002: 用户点击"确认"取消订单
 * ✅ SCENARIO-003: 用户点击"取消"关闭弹窗
 * 
 * @features_implemented:
 * ✅ 显示问号图标
 * ✅ 显示警告文字
 * ✅ 提供"取消"和"确认"按钮
 * 
 * @implementation_status:
 * - Scenarios Coverage: 3/3 (100%)
 * - Features Coverage: 3/3 (100%)
 * - UI Visual: 像素级精确
 * ================================================
 */

import React from 'react';
import './CancelOrderModal.css';

interface CancelOrderModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="cancel-order-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cancel-modal-header">
          <div className="cancel-modal-title">交易提示</div>
        </div>
        <div className="cancel-modal-content">
          <div className="cancel-modal-icon-wrapper">
            {/* 使用SVG问号图标 */}
            <svg className="cancel-modal-question-icon" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="40" r="38" fill="#FFA500" stroke="#FF8C00" strokeWidth="2"/>
              <text x="40" y="58" fontSize="50" fill="white" fontWeight="700" textAnchor="middle">?</text>
            </svg>
          </div>
          <div className="cancel-modal-text-wrapper">
            <div className="cancel-modal-question">您确认取消订单吗？</div>
            <div className="cancel-modal-warning">
              一天内3次申请车票成功后取消订单（包含无座车票或不符合选铺需求车票时取消5次计为取消1次），当日将不能在12306继续购票。
            </div>
          </div>
        </div>
        <div className="cancel-modal-footer">
          <button className="cancel-modal-button cancel-button" onClick={onCancel}>
            取消
          </button>
          <button className="cancel-modal-button confirm-button" onClick={onConfirm}>
            确认
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;
