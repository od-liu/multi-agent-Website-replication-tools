/**
 * @component ConfirmModal
 * @description 通用确认弹窗，用于删除确认、操作成功提示等
 * 
 * 符合需求文档中的样式规范：
 * - 弹窗宽度90%，最大宽度400px
 * - 背景white，圆角8px
 * - 阴影0 4px 12px rgba(0, 0, 0, 0.3)
 */

import React from 'react';
import './ConfirmModal.css';

interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
  showCancel = true
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-modal-header">
          <h3 className="confirm-modal-title">提示</h3>
        </div>

        <div className="confirm-modal-content">
          <p className="confirm-modal-message">{message}</p>
        </div>

        <div className="confirm-modal-footer">
          {showCancel && onCancel && (
            <button className="confirm-modal-btn confirm-modal-btn-cancel" onClick={onCancel}>
              取消
            </button>
          )}
          <button className="confirm-modal-btn confirm-modal-btn-confirm" onClick={onConfirm}>
            确认
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
