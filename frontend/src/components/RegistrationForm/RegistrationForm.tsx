/**
 * Registration Form Component
 * 注册表单组件，包含账户信息输入和前端验证
 */

import React, { useState } from 'react';
import RegistrationVerificationModal from '../RegistrationVerificationModal/RegistrationVerificationModal';
import './RegistrationForm.css';

interface FormData {
  username: string;
  password: string;
  confirmPassword: string;
  idType: string;
  name: string;
  idNumber: string;
  passengerType: string;
  email: string;
  phone: string;
  agreement: boolean;
}

interface FormErrors {
  username?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  idNumber?: string;
  email?: string;
  phone?: string;
}

const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    confirmPassword: '',
    idType: '1',
    name: '',
    idNumber: '',
    passengerType: '1',
    email: '',
    phone: '',
    agreement: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 验证用户名
  const validateUsername = (value: string): string | undefined => {
    if (!value) return '请输入用户名';
    if (value.length < 6) {
      return '用户名长度不能少于6个字符！';
    }
    if (value.length > 30) {
      return '用户名长度不能超过30个字符！';
    }
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(value)) {
      return '用户名只能由字母、数字和_组成，须以字母开头！';
    }
    return undefined;
  };
  
  // 检查用户名唯一性
  const checkUsernameAvailability = async (username: string) => {
    try {
      const response = await fetch('/api/auth/check-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('检查用户名失败:', error);
      return { available: false, message: '网络错误，请稍后再试' };
    }
  };

  // 验证密码
  const validatePassword = (value: string): string | undefined => {
    if (!value) return '请输入密码';
    if (value.length < 6) {
      return '密码长度不能少于6个字符！';
    }
    if (value.length > 20) {
      return '密码长度不能超过20个字符！';
    }
    
    // 检查是否包含至少两种字符类型（字母、数字、下划线）
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasUnderscore = /_/.test(value);
    const hasOtherChars = /[^a-zA-Z0-9_]/.test(value);
    
    if (hasOtherChars) {
      return '格式错误，必须且只能包含字母、数字和下划线中的两种或两种以上！';
    }
    
    const typeCount = (hasLetter ? 1 : 0) + (hasNumber ? 1 : 0) + (hasUnderscore ? 1 : 0);
    if (typeCount < 2) {
      return '格式错误，必须且只能包含字母、数字和下划线中的两种或两种以上！';
    }
    
    return undefined;
  };
  
  // 计算密码强度
  const calculatePasswordStrength = (value: string): number => {
    // 参考 12306：未输入时也显示“弱”(rank-a)的首段红条
    if (!value) return 1;
    
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasUnderscore = /_/.test(value);
    const typeCount = (hasLetter ? 1 : 0) + (hasNumber ? 1 : 0) + (hasUnderscore ? 1 : 0);
    
    if (value.length < 6) return 1; // 弱
    if (typeCount === 2) return 2; // 中
    if (typeCount === 3) return 3; // 强
    return 1;
  };

  // 验证确认密码
  const validateConfirmPassword = (value: string, password: string): string | undefined => {
    if (!value) return '请再次输入密码';
    if (value !== password) {
      return '确认密码与密码不一致！';
    }
    return undefined;
  };
  
  // 计算字符串长度（汉字算2个字符，其他算1个字符）
  const calculateNameLength = (str: string): number => {
    let length = 0;
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      // 汉字的 Unicode 范围：\u4e00-\u9fa5
      if (charCode >= 0x4e00 && charCode <= 0x9fa5) {
        length += 2;
      } else {
        length += 1;
      }
    }
    return length;
  };
  
  // 验证姓名
  const validateName = (value: string): string | undefined => {
    if (!value) return '请输入姓名';
    
    // 计算长度（汉字算2个字符）
    const length = calculateNameLength(value);
    if (length < 3 || length > 30) {
      return '允许输入的字符串在3-30个字符之间！';
    }
    
    // 检查特殊字符（只允许中英文字符、"."和单空格）
    const invalidChars = /[^\u4e00-\u9fa5a-zA-Z.\s]/;
    if (invalidChars.test(value)) {
      return '请输入姓名！';
    }
    
    // 检查是否有连续多个空格
    if (/\s{2,}/.test(value)) {
      return '请输入姓名！';
    }
    
    return undefined;
  };
  
  // 验证证件号码
  const validateIdNumber = (value: string, idType: string): string | undefined => {
    if (!value) return '请输入证件号码';
    
    // 检查长度
    if (value.length < 18) {
      return '请正确输入18位证件号码！';
    }
    
    // 检查特殊字符（只允许数字和字母）
    if (!/^[0-9A-Za-z]+$/.test(value)) {
      return '输入的证件编号中包含中文信息或特殊字符！';
    }
    
    // 如果是居民身份证，需要进行校验码验证
    if (idType === '1' && value.length === 18) {
      if (!validateIdCard(value)) {
        return '请正确输入18位证件号码！';
      }
    }
    
    return undefined;
  };
  
  // 身份证校验码验证
  const validateIdCard = (idCard: string): boolean => {
    // 18位身份证号码的正则表达式
    const regex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
    if (!regex.test(idCard)) return false;
    
    // 加权因子
    const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    // 校验码
    const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    
    let sum = 0;
    for (let i = 0; i < 17; i++) {
      sum += parseInt(idCard[i]) * weights[i];
    }
    
    const checkCode = checkCodes[sum % 11];
    return idCard[17].toUpperCase() === checkCode;
  };

  // 验证手机号
  const validatePhone = (value: string): string | undefined => {
    if (!value) return '请输入手机号码';
    if (!/^1[3-9]\d{9}$/.test(value)) {
      return '您输入的手机号码不是有效的格式！';
    }
    return undefined;
  };
  
  // 验证邮箱
  const validateEmail = (value: string): string | undefined => {
    if (!value) return undefined; // 邮箱是选填
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return '请输入有效的电子邮件地址！';
    }
    return undefined;
  };
  
  // 检查手机号唯一性
  const checkPhoneAvailability = async (phone: string) => {
    try {
      const response = await fetch('/api/auth/check-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone })
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('检查手机号失败:', error);
      return { available: false, message: '网络错误，请稍后再试' };
    }
  };
  
  // 检查证件号码唯一性
  const checkIdNumberAvailability = async (idNumber: string, idType: string) => {
    try {
      const response = await fetch('/api/auth/check-id-number', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idNumber, idType })
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('检查证件号码失败:', error);
      return { available: false, message: '网络错误，请稍后再试' };
    }
  };
  
  // 检查邮箱唯一性
  const checkEmailAvailability = async (email: string) => {
    try {
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('检查邮箱失败:', error);
      return { available: true }; // 邮箱检查失败时不阻止提交
    }
  };

  // 处理输入框失去焦点
  const handleBlur = async (field: keyof FormData) => {
    let error: string | undefined;

    switch (field) {
      case 'username':
        error = validateUsername(formData.username);
        // 如果格式验证通过，检查唯一性
        if (!error && formData.username) {
          const result = await checkUsernameAvailability(formData.username);
          if (!result.available) {
            error = result.message;
          }
        }
        break;
      case 'password':
        error = validatePassword(formData.password);
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(formData.confirmPassword, formData.password);
        break;
      case 'email':
        error = validateEmail(formData.email);
        break;
      case 'name':
        error = validateName(formData.name);
        break;
      case 'idNumber':
        error = validateIdNumber(formData.idNumber, formData.idType);
        // 如果格式验证通过，检查唯一性
        if (!error && formData.idNumber && formData.idType) {
          const result = await checkIdNumberAvailability(formData.idNumber, formData.idType);
          if (!result.available) {
            error = result.message;
          }
        }
        break;
      case 'phone':
        error = validatePhone(formData.phone);
        // 如果格式验证通过，检查唯一性
        if (!error && formData.phone) {
          const result = await checkPhoneAvailability(formData.phone);
          if (!result.available) {
            error = result.message;
          }
        }
        break;
    }

    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  // 处理输入变化
  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // 清除该字段的错误
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 检查是否勾选用户协议
    if (!formData.agreement) {
      setFormError('请确认服务条款！');
      return;
    }

    // 检查必填信息是否完整
    if (!formData.username || !formData.password || !formData.confirmPassword || 
        !formData.name || !formData.idNumber || !formData.phone) {
      setFormError('请填写完整信息！');
      return;
    }

    // 验证所有必填字段
    const newErrors: FormErrors = {
      username: validateUsername(formData.username),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword, formData.password),
      name: validateName(formData.name),
      idNumber: validateIdNumber(formData.idNumber, formData.idType),
      phone: validatePhone(formData.phone)
    };
    
    // 如果填写了邮箱，验证邮箱
    if (formData.email) {
      const emailError = validateEmail(formData.email);
      if (emailError) {
        newErrors.email = emailError;
      }
    }

    // 移除undefined的错误
    Object.keys(newErrors).forEach(key => {
      if (newErrors[key as keyof FormErrors] === undefined) {
        delete newErrors[key as keyof FormErrors];
      }
    });

    setErrors(newErrors);

    // 如果有错误，显示通用错误提示
    if (Object.keys(newErrors).length > 0) {
      setFormError('填写信息不符合规范，请检查红色错误提示！');
      return;
    }
    
    // 清除表单错误
    setFormError(null);

    // 最后一次检查唯一性（服务器端验证）
    setIsSubmitting(true);
    
    // 检查证件号唯一性
    const idCheckResult = await checkIdNumberAvailability(formData.idNumber, formData.idType);
    if (!idCheckResult.available) {
      setIsSubmitting(false);
      alert(idCheckResult.message);
      return;
    }
    
    // 检查手机号唯一性
    const phoneCheckResult = await checkPhoneAvailability(formData.phone);
    if (!phoneCheckResult.available) {
      setIsSubmitting(false);
      alert('您输入的手机号码已被其他注册用户使用，请确认是否本人注册。如果此手机号是本人注册，您可使用此手机号进行登录，或返回登录页点击忘记密码进行重置密码；如果手机号不是您注册的，您可更换手机号码或致电12306客服协助处理。');
      return;
    }
    
    // 如果填写了邮箱，检查邮箱唯一性
    if (formData.email) {
      const emailCheckResult = await checkEmailAvailability(formData.email);
      if (!emailCheckResult.available) {
        setIsSubmitting(false);
        alert('您输入的邮箱已被其他注册用户使用，请确认是否本人注册。如果此邮箱是本人注册，您可使用此邮箱进行登录，或返回登录页点击忘记密码进行重置密码；如果邮箱不是您注册的，您可更换邮箱或致电12306客服协助处理。');
        return;
      }
    }

    // 调用 API-SEND-REGISTRATION-CODE 发送验证码
    try {
      const response = await fetch('/api/auth/send-registration-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber: formData.phone,
          userData: {
            username: formData.username,
            password: formData.password,
            name: formData.name,
            idType: formData.idType,
            idNumber: formData.idNumber,
            email: formData.email,
            passengerType: formData.passengerType
          }
        })
      });

      const result = await response.json();

      if (result.success) {
        // 显示验证弹窗
        setShowModal(true);
      } else {
        alert(result.message || '发送验证码失败，请稍后再试');
      }
    } catch (error) {
      console.error('发送验证码失败:', error);
      alert('网络错误，请稍后再试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="registration-form-container">
        <div className="form-header">账户信息</div>
        
        <form className="registration-form" onSubmit={handleSubmit}>
          {/* 用户名 */}
          <div className="form-row">
            <label className="form-label required">用 户 名：</label>
            <div className="form-input-wrapper">
              <input
                type="text"
                className={`form-input ${errors.username ? 'error' : formData.username ? 'valid' : ''}`}
                placeholder="用户名设置成功后不可修改"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                onBlur={() => handleBlur('username')}
              />
              {formData.username && !errors.username && (
                <span className="validation-check">✓</span>
              )}
              <span className="form-hint hint-warning">6-30位字母、数字或“_”,字母开头</span>
              {errors.username && (
                <div className="error-message">{errors.username}</div>
              )}
            </div>
          </div>

          {/* 登录密码 */}
          <div className="form-row">
            <label className="form-label required">登 录 密 码：</label>
            <div className="form-input-wrapper">
              <input
                type="password"
                className={`form-input ${errors.password ? 'error' : formData.password ? 'valid' : ''}`}
                placeholder="6-20位字母、数字或符号"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
              />
              {formData.password && !errors.password && (
                <span className="validation-check">✓</span>
              )}
              <div className="password-strength" aria-label="密码强度">
                <div className="strength-bars" aria-hidden="true">
                  <span className={`strength-bar ${calculatePasswordStrength(formData.password) >= 1 ? 'active' : ''}`}></span>
                  <span className={`strength-bar ${calculatePasswordStrength(formData.password) >= 2 ? 'active' : ''}`}></span>
                  <span className={`strength-bar ${calculatePasswordStrength(formData.password) >= 3 ? 'active' : ''}`}></span>
                </div>
              </div>
              {errors.password && (
                <div className="error-message">{errors.password}</div>
              )}
            </div>
          </div>

          {/* 确认密码 */}
          <div className="form-row">
            <label className="form-label required">确 认 密 码：</label>
            <div className="form-input-wrapper">
              <input
                type="password"
                className={`form-input ${errors.confirmPassword ? 'error' : formData.confirmPassword && !errors.confirmPassword ? 'valid' : ''}`}
                placeholder="请再次输入您的登录密码"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
              />
              {formData.confirmPassword && !errors.confirmPassword && (
                <span className="validation-check">✓</span>
              )}
              {errors.confirmPassword && (
                <div className="error-message">{errors.confirmPassword}</div>
              )}
            </div>
          </div>

          {/* 证件类型 */}
          <div className="form-row">
            <label className="form-label required">证件类型：</label>
            <select
              className="form-select"
              value={formData.idType}
              onChange={(e) => handleChange('idType', e.target.value)}
            >
              <option value="1">居民身份证</option>
              <option value="2">护照</option>
              <option value="3">港澳通行证</option>
              <option value="4">台湾通行证</option>
            </select>
          </div>

          {/* 姓名 */}
          <div className="form-row">
            <label className="form-label required">姓 名：</label>
            <div className="form-input-wrapper">
              <input
                type="text"
                className={`form-input ${errors.name ? 'error' : formData.name && !errors.name ? 'valid' : ''}`}
                placeholder="请输入姓名"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
              />
              {formData.name && !errors.name && (
                <span className="validation-check">✓</span>
              )}
              <div className="form-hint hint-link">
                姓名填写规则（用于身份核验，请正确填写真实姓名）
              </div>
              {errors.name && (
                <div className="error-message">{errors.name}</div>
              )}
            </div>
          </div>

          {/* 证件号码 */}
          <div className="form-row">
            <label className="form-label required">证件号码：</label>
            <div className="form-input-wrapper">
              <input
                type="text"
                className={`form-input ${errors.idNumber ? 'error' : formData.idNumber && !errors.idNumber ? 'valid' : ''}`}
                placeholder="请输入您的证件号码"
                maxLength={18}
                value={formData.idNumber}
                onChange={(e) => handleChange('idNumber', e.target.value)}
                onBlur={() => handleBlur('idNumber')}
              />
              {formData.idNumber && !errors.idNumber && (
                <span className="validation-check">✓</span>
              )}
              <div className="form-hint hint-warning">
                （用于身份核验，请正确填写）
              </div>
              {errors.idNumber && (
                <div className="error-message">{errors.idNumber}</div>
              )}
            </div>
          </div>

          {/* 优惠类型 */}
          <div className="form-row">
            <label className="form-label">优惠（待）类型：</label>
            <select
              className="form-select"
              value={formData.passengerType}
              onChange={(e) => handleChange('passengerType', e.target.value)}
            >
              <option value="1">成人</option>
              <option value="3">儿童</option>
              <option value="2">学生</option>
              <option value="4">残疾军人</option>
            </select>
          </div>

          {/* 分隔线（对齐 12306 虚线） */}
          <div className="form-separator" aria-hidden="true" />

          {/* 邮箱 */}
          <div className="form-row">
            <label className="form-label">邮    箱：</label>
            <div className="form-input-wrapper">
              <input
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="请正确填写邮箱地址"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
              />
              {errors.email && (
                <div className="error-message">{errors.email}</div>
              )}
            </div>
          </div>

          {/* 手机号码 */}
          <div className="form-row">
            <label className="form-label required">手机号码：</label>
            <div className="form-input-wrapper">
              <div className="phone-input-group">
                <select className="country-code-select">
                  <option value="+86">+86 中国</option>
                  <option value="+852">+852 中国香港</option>
                  <option value="+853">+853 中国澳门</option>
                  <option value="+886">+886 中国台湾</option>
                </select>
                <input
                  type="tel"
                  className={`form-input phone-input ${errors.phone ? 'error' : formData.phone && !errors.phone ? 'valid' : ''}`}
                  placeholder="手机号码"
                  maxLength={11}
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                />
              </div>
              <div className="form-hint hint-warning">
                请正确填写手机号码，稍后将向该手机号发送短信验证码
              </div>
              {errors.phone && (
                <div className="error-message">{errors.phone}</div>
              )}
            </div>
          </div>

          {/* 用户协议 */}
          <div className="form-row agreement-row">
            <input
              type="checkbox"
              id="agreement"
              checked={formData.agreement}
              onChange={(e) => handleChange('agreement', e.target.checked)}
            />
            <label htmlFor="agreement">
              我已阅读并同意遵守
              <a href="/otn/regist/rule" target="_blank" rel="noreferrer">《中国铁路客户服务中心网站服务条款》</a>
              {' '}
              <a href="/otn/gonggao/privacyPolicy_web.html" target="_blank" rel="noreferrer">《隐私权政策》</a>
            </label>
          </div>

          {/* 表单级错误提示 */}
          {formError && (
            <div className="form-row form-error-row">
              <div className="form-error-message">{formError}</div>
            </div>
          )}

          {/* 提交按钮 */}
          <div className="form-row form-row-submit">
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? '发送验证码中...' : '下一步'}
            </button>
          </div>
        </form>
      </div>

      {/* 验证弹窗 */}
      {showModal && (
        <RegistrationVerificationModal
          phoneNumber={formData.phone}
          onClose={() => setShowModal(false)}
          onComplete={(code: string) => {
            console.log('验证码:', code);
            setShowModal(false);
          }}
          onBack={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default RegistrationForm;
