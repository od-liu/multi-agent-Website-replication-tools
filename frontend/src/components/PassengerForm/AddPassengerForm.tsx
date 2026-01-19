/**
 * @component AddPassengerForm
 * @description 添加乘车人表单，包含完整的表单验证
 * 
 * @scenarios_covered:
 * ✅ 证件类型默认选择（居民身份证）
 * ✅ 优惠等级默认选择（成人）
 * ✅ 姓名验证（长度3-30字符，仅中英文、点、空格）
 * ✅ 证件号验证（18位，仅数字和字母，通过校验）
 * ✅ 手机号验证（11位数字）
 * ✅ 乘客已存在提示
 * ✅ 添加成功
 */

import React, { useState } from 'react';
import './PassengerForm.css';

interface AddPassengerFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddPassengerForm: React.FC<AddPassengerFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    idType: '居民身份证',
    idNumber: '',
    phone: '',
    discountType: '成人'
  });

  const [errors, setErrors] = useState({
    name: '',
    idNumber: '',
    phone: ''
  });

  /**
   * @scenario "姓名验证"
   * - 长度：3-30个字符（汉字算2个字符）
   * - 格式：仅中英文字符、"."、单个空格" "
   */
  const validateName = (name: string): string => {
    if (!name) return '请输入姓名！';
    
    // 计算字符长度（汉字算2个字符）
    let length = 0;
    for (let i = 0; i < name.length; i++) {
      length += /[\u4e00-\u9fa5]/.test(name[i]) ? 2 : 1;
    }
    
    if (length < 3 || length > 30) {
      return '允许输入的字符串在3-30个字符之间！';
    }
    
    // 检查特殊字符（仅允许中英文、点、空格）
    if (!/^[a-zA-Z\u4e00-\u9fa5\.\s]+$/.test(name)) {
      return '请输入姓名！';
    }
    
    return '';
  };

  /**
   * @scenario "证件号验证"
   * - 长度：18位
   * - 格式：仅数字和字母
   * - 需要通过身份证校验算法
   */
  const validateIdNumber = (idNumber: string): string => {
    if (!idNumber) return '请输入证件号码！';
    
    if (idNumber.length !== 18) {
      return '请正确输入18位证件号码！';
    }
    
    // 检查是否包含特殊字符
    if (!/^[0-9a-zA-Z]+$/.test(idNumber)) {
      return '输入的证件编号中包含中文信息或特殊字符！';
    }
    
    // 身份证校验算法（简化版）
    if (!/^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dxX]$/.test(idNumber)) {
      return '请正确输入18位证件号码！';
    }
    
    return '';
  };

  /**
   * @scenario "手机号验证"
   * - 长度：11位
   * - 格式：仅数字
   */
  const validatePhone = (phone: string): string => {
    if (!phone) return '';
    
    // 检查是否包含非数字字符
    if (!/^\d*$/.test(phone)) {
      return '您输入的手机号码不是有效的格式！';
    }
    
    if (phone.length > 0 && phone.length !== 11) {
      return '您输入的手机号码不是有效的格式！';
    }
    
    return '';
  };

  const handleInputChange = (field: string, value: string) => {
    // 手机号限制11位
    if (field === 'phone' && value.length > 11) {
      return;
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 实时验证
    if (field === 'name') {
      setErrors(prev => ({ ...prev, name: validateName(value) }));
    } else if (field === 'idNumber') {
      setErrors(prev => ({ ...prev, idNumber: validateIdNumber(value) }));
    } else if (field === 'phone') {
      setErrors(prev => ({ ...prev, phone: validatePhone(value) }));
    }
  };

  const handleSubmit = async () => {
    // 验证所有字段
    const nameError = validateName(formData.name);
    const idNumberError = validateIdNumber(formData.idNumber);
    const phoneError = validatePhone(formData.phone);
    
    setErrors({
      name: nameError,
      idNumber: idNumberError,
      phone: phoneError
    });
    
    if (nameError || idNumberError || phoneError) {
      return;
    }
    
    try {
      const response = await fetch('/api/passengers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        onSuccess();
      } else {
        // 乘客已存在或其他错误
        alert(result.message || '添加失败');
      }
    } catch (error) {
      console.error('添加乘客失败:', error);
      alert('添加失败，请稍后再试');
    }
  };

  return (
    <div className="passenger-form-container">
      <h3 className="form-title">添加乘车人</h3>
      
      <div className="form-content">
        {/* 姓名 */}
        <div className="form-row">
          <label className="form-label">
            <span className="required-mark">* </span>姓名：
          </label>
          <div className="form-input-wrapper">
            <input
              type="text"
              className={`form-input ${errors.name ? 'error' : ''}`}
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="请输入姓名"
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>
        </div>

        {/* 证件类型 */}
        <div className="form-row">
          <label className="form-label">
            <span className="required-mark">* </span>证件类型：
          </label>
          <div className="form-input-wrapper">
            <select
              className="form-select"
              value={formData.idType}
              onChange={(e) => handleInputChange('idType', e.target.value)}
            >
              <option value="居民身份证">居民身份证</option>
              <option value="护照">护照</option>
              <option value="港澳通行证">港澳通行证</option>
              <option value="台湾通行证">台湾通行证</option>
            </select>
          </div>
        </div>

        {/* 证件号码 */}
        <div className="form-row">
          <label className="form-label">
            <span className="required-mark">* </span>证件号码：
          </label>
          <div className="form-input-wrapper">
            <input
              type="text"
              className={`form-input ${errors.idNumber ? 'error' : ''}`}
              value={formData.idNumber}
              onChange={(e) => handleInputChange('idNumber', e.target.value)}
              placeholder="请输入证件号码"
              maxLength={18}
            />
            {errors.idNumber && <div className="form-error">{errors.idNumber}</div>}
          </div>
        </div>

        {/* 手机号 */}
        <div className="form-row">
          <label className="form-label">
            <span className="required-mark">* </span>手机号：
          </label>
          <div className="form-input-wrapper">
            <input
              type="text"
              className={`form-input ${errors.phone ? 'error' : ''}`}
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="请输入手机号"
              maxLength={11}
            />
            {errors.phone && <div className="form-error">{errors.phone}</div>}
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
              value={formData.discountType}
              onChange={(e) => handleInputChange('discountType', e.target.value)}
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

export default AddPassengerForm;
