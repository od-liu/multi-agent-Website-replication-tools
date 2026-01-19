/**
 * @component EditPassengerForm
 * @description 编辑乘车人表单，基本信息只读，仅可编辑手机号和优惠类型
 */

import React, { useState } from 'react';
import './PassengerForm.css';

interface Passenger {
  id: number;
  name: string;
  idType: string;
  idNumber: string;
  phone: string;
  discountType: string;
  addedDate: string;
}

interface EditPassengerFormProps {
  passenger: Passenger;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditPassengerForm: React.FC<EditPassengerFormProps> = ({ passenger, onSuccess, onCancel }) => {
  const [phone, setPhone] = useState(passenger.phone);
  const [discountType, setDiscountType] = useState(passenger.discountType);
  const [phoneError, setPhoneError] = useState('');

  /**
   * @scenario "编辑乘客-手机号验证"
   */
  const validatePhone = (value: string): string => {
    if (!value) return '';
    
    if (!/^\d*$/.test(value)) {
      return '您输入的手机号码不是有效的格式！';
    }
    
    if (value.length > 0 && value.length !== 11) {
      return '您输入的手机号码不是有效的格式！';
    }
    
    return '';
  };

  const handlePhoneChange = (value: string) => {
    // 限制11位
    if (value.length > 11) return;
    
    setPhone(value);
    setPhoneError(validatePhone(value));
  };

  const handleSubmit = async () => {
    const error = validatePhone(phone);
    if (error) {
      setPhoneError(error);
      return;
    }
    
    try {
      const response = await fetch(`/api/passengers/${passenger.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, discountType })
      });
      
      const result = await response.json();
      
      if (result.success) {
        onSuccess();
      } else {
        alert(result.message || '修改失败');
      }
    } catch (error) {
      console.error('修改乘客失败:', error);
      alert('修改失败，请稍后再试');
    }
  };

  return (
    <div className="passenger-form-container">
      <h3 className="form-title">编辑乘车人</h3>
      
      {/* 基本信息（只读） */}
      <div className="edit-basic-info-section">
        <h4 className="section-subtitle">基本信息</h4>
        
        <div className="edit-info-row">
          <span className="edit-info-label">
            <span className="required-mark">* </span>姓名：
          </span>
          <span className="edit-info-value">{passenger.name}</span>
        </div>

        <div className="edit-info-row">
          <span className="edit-info-label">
            <span className="required-mark">* </span>证件类型：
          </span>
          <span className="edit-info-value">{passenger.idType}</span>
        </div>

        <div className="edit-info-row">
          <span className="edit-info-label">
            <span className="required-mark">* </span>证件号码：
          </span>
          <span className="edit-info-value">{passenger.idNumber}</span>
        </div>

        <div className="edit-info-row">
          <span className="edit-info-label">添加日期：</span>
          <span className="edit-info-value">{passenger.addedDate}</span>
        </div>
      </div>

      {/* 可编辑信息 */}
      <div className="form-content">
        <h4 className="section-subtitle">可编辑信息</h4>
        
        {/* 手机号 */}
        <div className="form-row">
          <label className="form-label">
            <span className="required-mark">* </span>手机号：
          </label>
          <div className="form-input-wrapper">
            <input
              type="text"
              className={`form-input ${phoneError ? 'error' : ''}`}
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="请输入手机号"
              maxLength={11}
            />
            {phoneError && <div className="form-error">{phoneError}</div>}
          </div>
        </div>

        {/* 优惠类型 */}
        <div className="form-row">
          <label className="form-label">
            <span className="required-mark">* </span>优惠(待)类型：
          </label>
          <div className="form-input-wrapper">
            <select
              className="form-select"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
            >
              <option value="成人">成人</option>
              <option value="学生">学生</option>
              <option value="儿童">儿童</option>
            </select>
          </div>
        </div>
      </div>

      {/* 按钮 */}
      <div className="form-actions">
        <button className="form-btn form-btn-cancel" onClick={onCancel}>
          取消
        </button>
        <button className="form-btn form-btn-submit" onClick={handleSubmit}>
          保存
        </button>
      </div>
    </div>
  );
};

export default EditPassengerForm;
