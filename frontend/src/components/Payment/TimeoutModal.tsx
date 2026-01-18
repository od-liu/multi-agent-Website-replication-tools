/**
 * @component UI-TIMEOUT-MODAL
 * @description 超时提示弹窗，提示用户订单已超时
 * @layout_position "居中模态弹窗"
 * @dimensions "最大宽度400px，宽度90%"
 * 
 * ============ 功能实现清单（必填）============
 * @scenarios_covered:
 * ✅ SCENARIO-001: 显示超时提示信息
 * ✅ SCENARIO-002: 用户点击"确认"跳转到车次列表页
 * 
 * @features_implemented:
 * ✅ 显示"支付超时，请重新购票"提示
 * ✅ 提供"确认"按钮
 * 
 * @implementation_status:
 * - Scenarios Coverage: 2/2 (100%)
 * - Features Coverage: 2/2 (100%)
 * - UI Visual: 像素级精确
 * ================================================
 */

import React from 'react';
import './TimeoutModal.css';

interface TimeoutModalProps {
  onConfirm: () => void;
}

const TimeoutModal: React.FC<TimeoutModalProps> = ({ onConfirm }) => {
  return (
    <div className="modal-overlay" onClick={onConfirm}>
      <div className="timeout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="timeout-modal-content">
          <div className="timeout-modal-message">支付超时，请重新购票</div>
        </div>
        <div className="timeout-modal-footer">
          <button className="timeout-modal-button" onClick={onConfirm}>
            确认
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeoutModal;
