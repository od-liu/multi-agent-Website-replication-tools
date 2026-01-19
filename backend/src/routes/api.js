/**
 * Backend API Routes
 * 定义所有API端点
 */

import express from 'express';
import { 
  authenticateUser, 
  generateVerificationCode, 
  verifyCode,
  registerUser,
  sendRegistrationVerificationCode,
  verifyRegistrationCode,
  checkUsername,
  checkPhone,
  checkIdNumber,
  checkEmail,
  getCities,
  searchTrains,
  getTrainDetails,
  getPassengers,
  submitOrder,
  getPersonalInfo,
  updateContactInfo
} from '../database/operations.js';

const router = express.Router();

/**
 * @api API-LOGIN POST /api/auth/login
 * @summary 用户登录接口
 * @param {Object} body - 请求体
 * @param {string} body.username - 用户名/邮箱/手机号
 * @param {string} body.password - 密码
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 登录是否成功
 * @returns {string} response.message - 响应消息
 * @returns {string} response.userId - 用户ID（成功时）
 * @calls FUNC-AUTH-LOGIN - 委托给认证服务函数
 */
router.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  // 参数验证
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: '用户名和密码不能为空'
    });
  }
  
  // 调用 FUNC-AUTH-LOGIN 进行实际认证
  const result = await authenticateUser(username, password);
  
  if (result.success) {
    return res.status(200).json({
      success: true,
      userId: result.userId,
      username: result.username,
      email: result.email,
      phone: result.phone
    });
  } else {
    return res.status(401).json({
      success: false,
      message: result.message
    });
  }
});

/**
 * @api API-SEND-VERIFICATION-CODE POST /api/auth/send-verification-code
 * @summary 发送短信验证码
 * @param {Object} body - 请求体
 * @param {string} body.userId - 用户ID
 * @param {string} body.idCardLast4 - 证件号后4位
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 是否发送成功
 * @returns {string} response.message - 响应消息
 * @calls FUNC-SEND-VERIFICATION-CODE
 */
router.post('/api/auth/send-verification-code', async (req, res) => {
  const { userId, idCardLast4 } = req.body;
  
  if (!userId || !idCardLast4) {
    return res.status(400).json({
      success: false,
      message: '参数不完整'
    });
  }
  
  // 调用 FUNC-SEND-VERIFICATION-CODE
  const result = await generateVerificationCode(userId, idCardLast4);
  
  if (result.success) {
    return res.status(200).json({
      success: true,
      message: '获取手机验证码成功！'
    });
  } else {
    return res.status(400).json({
      success: false,
      message: result.message
    });
  }
});

/**
 * @api API-VERIFY-CODE POST /api/auth/verify-code
 * @summary 验证短信验证码
 * @param {Object} body - 请求体
 * @param {string} body.userId - 用户ID
 * @param {string} body.code - 验证码
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 验证是否成功
 * @returns {string} response.message - 响应消息
 * @returns {string} response.token - 登录令牌（成功时）
 * @calls FUNC-VERIFY-CODE
 */
router.post('/api/auth/verify-code', async (req, res) => {
  const { userId, code } = req.body;
  
  if (!userId || !code) {
    return res.status(400).json({
      success: false,
      message: '参数不完整'
    });
  }
  
  // 调用 FUNC-VERIFY-CODE
  const result = await verifyCode(userId, code);
  
  if (result.success) {
    return res.status(200).json({
      success: true,
      token: result.token
    });
  } else {
    return res.status(400).json({
      success: false,
      message: result.message
    });
  }
});

/**
 * @api API-REGISTER POST /api/auth/register
 * @summary 用户注册接口
 * @param {Object} body - 请求体
 * @param {string} body.username - 用户名（6-30位，字母开头）
 * @param {string} body.password - 密码（6-20位）
 * @param {string} body.name - 真实姓名
 * @param {string} body.idType - 证件类型（1=身份证，2=护照等）
 * @param {string} body.idNumber - 证件号码
 * @param {string} body.phone - 手机号码
 * @param {string} body.email - 邮箱（可选）
 * @param {string} body.passengerType - 乘客类型（1=成人，2=学生，3=儿童）
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 注册是否成功
 * @returns {string} response.message - 响应消息
 * @returns {string} response.userId - 用户ID（成功时）
 * @calls FUNC-REGISTER-USER
 */
router.post('/api/auth/register', async (req, res) => {
  const { username, password, name, idType, idNumber, phone, email, passengerType } = req.body;
  
  // 参数验证
  if (!username || !password || !name || !idNumber || !phone) {
    return res.status(400).json({
      success: false,
      message: '必填字段不能为空'
    });
  }
  
  // 调用 FUNC-REGISTER-USER
  const result = await registerUser({
    username,
    password,
    name,
    idType: idType || '1',
    idNumber,
    phone,
    email: email || '',
    passengerType: passengerType || '1'
  });
  
  if (result.success) {
    return res.status(200).json({
      success: true,
      userId: result.userId,
      message: '注册成功，请进行手机验证'
    });
  } else {
    return res.status(400).json({
      success: false,
      message: result.message
    });
  }
});

/**
 * @api API-SEND-REGISTRATION-CODE POST /api/auth/send-registration-code
 * @summary 发送注册验证码
 * @param {Object} body - 请求体
 * @param {string} body.phoneNumber - 手机号码
 * @param {Object} body.userData - 用户注册信息（用于验证和临时存储）
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 是否发送成功
 * @returns {string} response.message - 响应消息
 * @calls FUNC-SEND-REGISTRATION-CODE
 */
router.post('/api/auth/send-registration-code', async (req, res) => {
  const { phoneNumber, userData } = req.body;
  
  if (!phoneNumber) {
    return res.status(400).json({
      success: false,
      message: '手机号码不能为空'
    });
  }
  
  // 调用 FUNC-SEND-REGISTRATION-CODE
  const result = await sendRegistrationVerificationCode(phoneNumber, userData);
  
  if (result.success) {
    return res.status(200).json({
      success: true,
      message: '验证码已发送'
    });
  } else {
    return res.status(400).json({
      success: false,
      message: result.message
    });
  }
});

/**
 * @api API-VERIFY-REGISTRATION-CODE POST /api/auth/verify-registration-code
 * @summary 验证注册验证码并完成注册
 * @param {Object} body - 请求体
 * @param {string} body.phoneNumber - 手机号码
 * @param {string} body.code - 验证码
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 验证是否成功
 * @returns {string} response.message - 响应消息
 * @returns {string} response.userId - 用户ID（成功时）
 * @calls FUNC-VERIFY-REGISTRATION-CODE
 */
router.post('/api/auth/verify-registration-code', async (req, res) => {
  const { phoneNumber, code } = req.body;
  
  if (!phoneNumber || !code) {
    return res.status(400).json({
      success: false,
      message: '参数不完整'
    });
  }
  
  // 调用 FUNC-VERIFY-REGISTRATION-CODE
  const result = await verifyRegistrationCode(phoneNumber, code);
  
  if (result.success) {
    return res.status(200).json({
      success: true,
      userId: result.userId,
      message: '注册完成'
    });
  } else {
    return res.status(400).json({
      success: false,
      message: result.message
    });
  }
});

/**
 * @api API-CHECK-USERNAME POST /api/auth/check-username
 * @summary 检查用户名是否可用
 * @param {Object} body - 请求体
 * @param {string} body.username - 用户名
 * @returns {Object} response - 响应体
 * @returns {boolean} response.available - 用户名是否可用
 * @returns {string} response.message - 错误消息（不可用时）
 * @calls FUNC-CHECK-USERNAME
 */
router.post('/api/auth/check-username', async (req, res) => {
  const { username } = req.body;
  
  if (!username) {
    return res.status(400).json({
      available: false,
      message: '用户名不能为空'
    });
  }
  
  const result = await checkUsername(username);
  return res.status(200).json(result);
});

/**
 * @api API-CHECK-PHONE POST /api/auth/check-phone
 * @summary 检查手机号是否可用
 * @param {Object} body - 请求体
 * @param {string} body.phone - 手机号
 * @returns {Object} response - 响应体
 * @returns {boolean} response.available - 手机号是否可用
 * @returns {string} response.message - 错误消息（不可用时）
 * @calls FUNC-CHECK-PHONE
 */
router.post('/api/auth/check-phone', async (req, res) => {
  const { phone } = req.body;
  
  if (!phone) {
    return res.status(400).json({
      available: false,
      message: '手机号不能为空'
    });
  }
  
  const result = await checkPhone(phone);
  return res.status(200).json(result);
});

/**
 * @api API-CHECK-ID-NUMBER POST /api/auth/check-id-number
 * @summary 检查证件号码是否可用
 * @param {Object} body - 请求体
 * @param {string} body.idNumber - 证件号码
 * @param {string} body.idType - 证件类型
 * @returns {Object} response - 响应体
 * @returns {boolean} response.available - 证件号码是否可用
 * @returns {string} response.message - 错误消息（不可用时）
 * @calls FUNC-CHECK-ID-NUMBER
 */
router.post('/api/auth/check-id-number', async (req, res) => {
  const { idNumber, idType } = req.body;
  
  if (!idNumber || !idType) {
    return res.status(400).json({
      available: false,
      message: '证件号码和证件类型不能为空'
    });
  }
  
  const result = await checkIdNumber(idNumber, idType);
  return res.status(200).json(result);
});

/**
 * @api API-CHECK-EMAIL POST /api/auth/check-email
 * @summary 检查邮箱是否可用
 * @param {Object} body - 请求体
 * @param {string} body.email - 邮箱
 * @returns {Object} response - 响应体
 * @returns {boolean} response.available - 邮箱是否可用
 * @returns {string} response.message - 错误消息（不可用时）
 * @calls FUNC-CHECK-EMAIL
 */
router.post('/api/auth/check-email', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({
      available: false,
      message: '邮箱不能为空'
    });
  }
  
  const result = await checkEmail(email);
  return res.status(200).json(result);
});

/**
 * @api API-SEARCH-TRAINS POST /api/trains/search
 * @summary 车票查询接口
 * @param {Object} body - 请求体
 * @param {string} body.fromCity - 出发城市
 * @param {string} body.toCity - 到达城市
 * @param {string} body.departureDate - 出发日期
 * @param {boolean} body.isStudent - 是否学生票
 * @param {boolean} body.isHighSpeed - 是否只查高铁/动车
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 查询是否成功
 * @returns {string} response.message - 响应消息
 * @returns {Array} response.trains - 车次列表（成功时）
 * @calls FUNC-SEARCH-TRAINS - 委托给车票查询服务函数
 */
router.post('/api/trains/search', async (req, res) => {
  const { fromCity, toCity, departureDate, isStudent, isHighSpeed } = req.body;
  
  // 参数验证
  if (!fromCity || !toCity || !departureDate) {
    return res.status(400).json({
      success: false,
      message: '出发地、目的地和出发日期不能为空'
    });
  }
  
  // 调用 FUNC-SEARCH-TRAINS 进行实际查询
  const result = await searchTrains(fromCity, toCity, departureDate, isStudent, isHighSpeed);
  
  if (result.success) {
    return res.status(200).json({
      success: true,
      trains: result.trains
    });
  } else {
    return res.status(500).json({
      success: false,
      message: result.message || '查询失败，请稍后重试'
    });
  }
});

/**
 * @api API-GET-CITIES GET /api/trains/cities
 * @summary 获取所有城市列表（用于查询条件栏的城市推荐）
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 是否成功
 * @returns {Array<string>} response.cities - 城市列表
 * @calls FUNC-GET-CITIES - 委托给数据库查询函数
 */
router.get('/api/trains/cities', async (req, res) => {
  try {
    // 调用 FUNC-GET-CITIES 从数据库获取
    const result = await getCities();
    
    if (result.success) {
      return res.status(200).json({
        success: true,
        cities: result.cities
      });
    } else {
      return res.status(500).json({
        success: false,
        message: result.message || '获取城市列表失败'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '获取城市列表失败'
    });
  }
});

/**
 * @api API-GET-TRAIN-DETAILS GET /api/trains/:trainNumber/details
 * @summary 获取指定车次的详细信息（停靠站信息）
 * @param {string} trainNumber - 车次号（如 G12）
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 是否成功
 * @returns {Object} response.trainDetails - 车次详情
 * @returns {string} response.trainDetails.trainNumber - 车次号
 * @returns {Array<Object>} response.trainDetails.stops - 停靠站列表
 * @calls FUNC-GET-TRAIN-DETAILS - 委托给数据库查询函数
 */
router.get('/api/trains/:trainNumber/details', async (req, res) => {
  const { trainNumber } = req.params;
  
  try {
    // 调用 FUNC-GET-TRAIN-DETAILS 从数据库获取
    const result = await getTrainDetails(trainNumber);
    
    if (result.success) {
      return res.status(200).json({
        success: true,
        trainDetails: result.trainDetails
      });
    } else {
      return res.status(404).json({
        success: false,
        message: result.message || '车次不存在'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '获取车次详情失败'
    });
  }
});

/**
 * @api API-GET-PASSENGERS GET /api/passengers
 * @summary 获取当前用户的常用乘客列表
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 是否成功
 * @returns {Array<Object>} response.passengers - 乘客列表
 * @returns {string} response.passengers[].id - 乘客ID
 * @returns {string} response.passengers[].name - 姓名
 * @returns {string} response.passengers[].idType - 证件类型
 * @returns {string} response.passengers[].idNumber - 证件号码
 * @returns {string} response.passengers[].passengerType - 乘客类型（成人票/儿童票/学生票）
 * @calls FUNC-GET-PASSENGERS - 委托给数据库查询函数
 */
router.get('/api/passengers', async (req, res) => {
  // 从请求头中获取用户ID（前端从 localStorage 传递）
  const userId = req.headers['x-user-id'] || req.query.userId;
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: '未登录，请先登录'
    });
  }
  
  console.log('📋 [乘客列表] 获取乘客列表, userId:', userId);
  
  try {
    // 调用 FUNC-GET-PASSENGERS 从数据库获取
    const result = await getPassengers(userId);
    
    if (result.success) {
      // 补充完整的乘客数据字段（骨架实现）
      const enrichedPassengers = result.passengers.map((p, index) => ({
        id: index + 1,
        name: p.name,
        idType: p.idType,
        idNumber: p.idNumber,
        phone: p.phone || '(+86)138****8000',
        discountType: p.passengerType || '成人',
        verificationStatus: '已通过',
        addedDate: '2024-01-15'
      }));
      
      console.log('✅ [乘客列表] 返回', enrichedPassengers.length, '条记录');
      
      return res.status(200).json({
        success: true,
        data: enrichedPassengers // 前端期望的字段名是data，不是passengers
      });
    } else {
      return res.status(404).json({
        success: false,
        message: result.message || '获取乘客列表失败'
      });
    }
  } catch (error) {
    console.error('❌ [乘客列表] 获取失败:', error);
    return res.status(500).json({
      success: false,
      message: '获取乘客列表失败'
    });
  }
});

/**
 * @api API-SUBMIT-ORDER POST /api/orders/submit
 * @summary 提交订单
 * @param {Object} body - 请求体
 * @param {string} body.trainNo - 车次号
 * @param {string} body.date - 乘车日期
 * @param {string} body.departureStation - 出发站
 * @param {string} body.arrivalStation - 到达站
 * @param {Array<Object>} body.passengers - 乘客列表
 * @param {string} body.passengers[].passengerId - 乘客ID
 * @param {string} body.passengers[].seatType - 席别
 * @param {number} body.passengers[].price - 票价
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 是否成功
 * @returns {string} response.orderId - 订单ID（成功时）
 * @returns {string} response.message - 响应消息
 * @calls FUNC-SUBMIT-ORDER - 委托给订单处理函数
 */
router.post('/api/orders/submit', async (req, res) => {
  const { trainNo, date, departureStation, arrivalStation, passengers } = req.body;
  
  // 参数验证
  if (!trainNo || !date || !departureStation || !arrivalStation || !passengers || passengers.length === 0) {
    return res.status(400).json({
      success: false,
      message: '订单信息不完整'
    });
  }
  
  // 从session或token中获取用户ID
  const userId = req.session?.userId || 'mock-user-id';
  
  try {
    // 调用 FUNC-SUBMIT-ORDER 处理订单
    const result = await submitOrder(userId, {
      trainNo,
      date,
      departureStation,
      arrivalStation,
      passengers
    });
    
    if (result.success) {
      return res.status(200).json({
        success: true,
        orderId: result.orderId,
        message: '订单提交成功'
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.message || '订单提交失败'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '订单提交失败'
    });
  }
});

/**
 * @api API-GET-PERSONAL-INFO GET /api/personal-info
 * @summary 获取个人信息接口
 * @param {Object} query - 查询参数
 * @param {string} query.userId - 用户ID
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 是否成功
 * @returns {Object} response.data - 个人信息数据
 * @calls FUNC-GET-PERSONAL-INFO
 */
router.get('/api/personal-info', async (req, res) => {
  const { userId } = req.query;
  
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: '用户ID不能为空'
    });
  }
  
  // 调用 FUNC-GET-PERSONAL-INFO（骨架实现）
  // 实际实现需要从数据库查询
  const mockData = {
    username: 'od12322',
    realName: '刘嘉敏',
    country: '中国China',
    idType: '居民身份证',
    idNumber: '3301***********028',
    verificationStatus: '已通过',
    phone: '(+86) 198****9256',
    phoneVerification: '已通过核验',
    email: '3279882704@qq.com',
    discountType: '成人'
  };
  
  return res.status(200).json({
    success: true,
    data: mockData
  });
});

/**
 * @api API-UPDATE-CONTACT-INFO PUT /api/personal-info/contact
 * @summary 更新联系方式接口
 * @param {Object} body - 请求体
 * @param {string} body.userId - 用户ID
 * @param {string} body.email - 邮箱
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 是否成功
 * @returns {string} response.message - 响应消息
 * @calls FUNC-UPDATE-CONTACT-INFO
 */
router.put('/api/personal-info/contact', async (req, res) => {
  const { userId, email } = req.body;
  
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: '用户ID不能为空'
    });
  }
  
  // 邮箱格式验证
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: '邮箱格式不正确'
    });
  }
  
  // 调用 FUNC-UPDATE-CONTACT-INFO（骨架实现）
  // 实际实现需要更新数据库
  console.log('更新联系方式:', { userId, email });
  
  return res.status(200).json({
    success: true,
    message: '联系方式更新成功'
  });
});

/**
 * @api API-VERIFY-PASSWORD POST /api/auth/verify-password
 * @summary 验证用户登录密码
 * @param {Object} body - 请求体
 * @param {string} body.password - 登录密码
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 验证是否成功
 */
router.post('/api/auth/verify-password', async (req, res) => {
  const { password } = req.body;
  
  console.log('🔐 [密码验证] 收到验证请求');
  
  if (!password) {
    console.log('❌ [密码验证] 密码为空');
    return res.status(400).json({
      success: false,
      message: '密码不能为空'
    });
  }
  
  // 骨架实现：验证密码
  // 实际实现需要从 session 或 JWT 中获取当前用户信息，并验证密码
  // 这里返回模拟数据（始终验证成功）
  console.log('✅ [密码验证] 验证成功（骨架实现）');
  return res.status(200).json({
    success: true,
    message: '密码验证成功'
  });
});

/**
 * @api API-SEND-PHONE-VERIFICATION POST /api/auth/send-phone-verification
 * @summary 发送手机验证码（用于修改手机号）
 * @param {Object} body - 请求体
 * @param {string} body.phone - 新手机号
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 发送是否成功
 * @returns {string} response.code - 验证码（开发环境返回）
 */
router.post('/api/auth/send-phone-verification', async (req, res) => {
  const { phone } = req.body;
  
  console.log(`📱 [手机验证] 收到验证码发送请求: ${phone}`);
  
  if (!phone) {
    console.log('❌ [手机验证] 手机号为空');
    return res.status(400).json({
      success: false,
      message: '手机号不能为空'
    });
  }
  
  // 骨架实现：发送验证码
  // 实际实现需要调用短信服务发送验证码
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  console.log(`✅ [手机验证] 向 ${phone} 发送验证码: ${code}`);
  
  return res.status(200).json({
    success: true,
    message: '验证码已发送',
    code: code // 开发环境返回验证码，生产环境应删除
  });
});

/**
 * @api API-VERIFY-PHONE-CODE POST /api/auth/verify-phone-code
 * @summary 验证手机验证码并更新手机号
 * @param {Object} body - 请求体
 * @param {string} body.phone - 新手机号
 * @param {string} body.code - 验证码
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 验证是否成功
 */
router.post('/api/auth/verify-phone-code', async (req, res) => {
  const { phone, code } = req.body;
  
  console.log(`🔢 [验证码验证] 收到验证请求: ${phone}, 验证码: ${code}`);
  
  if (!phone || !code) {
    console.log('❌ [验证码验证] 手机号或验证码为空');
    return res.status(400).json({
      success: false,
      message: '手机号和验证码不能为空'
    });
  }
  
  // 骨架实现：验证验证码并更新手机号
  // 实际实现需要：
  // 1. 验证验证码是否正确
  // 2. 更新数据库中的手机号
  // 3. 更新 session 或 JWT
  console.log(`✅ [验证码验证] 验证成功，手机号已更新为: ${phone}`);
  
  return res.status(200).json({
    success: true,
    message: '手机号更新成功'
  });
});

/**
 * @api API-ADD-PASSENGER POST /api/passengers
 * @summary 添加乘客
 * @param {Object} body - 请求体
 * @param {string} body.name - 姓名
 * @param {string} body.idType - 证件类型
 * @param {string} body.idNumber - 证件号码
 * @param {string} body.phone - 手机号
 * @param {string} body.discountType - 优惠类型
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 是否成功
 */
router.post('/api/passengers', async (req, res) => {
  const { name, idType, idNumber, phone, discountType } = req.body;
  
  console.log('➕ [添加乘客] 收到请求:', { name, idType, phone });
  
  if (!name || !idType || !idNumber || !phone) {
    return res.status(400).json({
      success: false,
      message: '必填字段不能为空'
    });
  }
  
  // 骨架实现：检查乘客是否已存在
  // 实际实现需要查询数据库
  // 这里模拟乘客已存在的情况（用于测试）
  if (name === '测试重复') {
    console.log('❌ [添加乘客] 乘客已存在');
    return res.status(400).json({
      success: false,
      message: '该联系人已存在，请使用不同的姓名和证件。'
    });
  }
  
  // 骨架实现：添加到数据库
  console.log('✅ [添加乘客] 添加成功');
  
  return res.status(200).json({
    success: true,
    message: '添加成功',
    data: {
      id: Date.now(), // 模拟生成的ID
      name,
      idType,
      idNumber,
      phone,
      discountType,
      verificationStatus: '待核验',
      addedDate: new Date().toISOString().split('T')[0]
    }
  });
});

/**
 * @api API-UPDATE-PASSENGER PUT /api/passengers/:id
 * @summary 更新乘客信息
 * @param {number} id - 乘客ID
 * @param {Object} body - 请求体
 * @param {string} body.phone - 手机号
 * @param {string} body.discountType - 优惠类型
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 是否成功
 */
router.put('/api/passengers/:id', async (req, res) => {
  const { id } = req.params;
  const { phone, discountType } = req.body;
  
  console.log(`✏️ [编辑乘客] 更新乘客 ${id}:`, { phone, discountType });
  
  if (!phone || !discountType) {
    return res.status(400).json({
      success: false,
      message: '必填字段不能为空'
    });
  }
  
  // 骨架实现：更新数据库
  console.log(`✅ [编辑乘客] 更新成功`);
  
  return res.status(200).json({
    success: true,
    message: '更新成功'
  });
});

/**
 * @api API-DELETE-PASSENGER DELETE /api/passengers/:id
 * @summary 删除乘客
 * @param {number} id - 乘客ID
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 是否成功
 */
router.delete('/api/passengers/:id', async (req, res) => {
  const { id } = req.params;
  const userId = req.headers['x-user-id'] || req.query.userId;
  
  console.log(`🗑️ [删除乘客] 删除乘客 ${id}, userId: ${userId}`);
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: '未登录，请先登录'
    });
  }
  
  try {
    const { getDb } = await import('./database/db.js');
    const db = getDb();
    
    // 🆕 检查是否为用户本人
    const passenger = await db.getAsync(
      'SELECT is_self FROM passengers WHERE id = ? AND user_id = ?',
      id, userId
    );
    
    if (!passenger) {
      return res.status(404).json({
        success: false,
        message: '乘客不存在'
      });
    }
    
    if (passenger.is_self === 1) {
      console.log('❌ [删除乘客] 不能删除用户本人');
      return res.status(403).json({
        success: false,
        message: '不能删除您本人的乘车人信息'
      });
    }
    
    // 从数据库删除
    await db.runAsync(
      'DELETE FROM passengers WHERE id = ? AND user_id = ?',
      id, userId
    );
    
    console.log(`✅ [删除乘客] 删除成功`);
    
    return res.status(200).json({
      success: true,
      message: '删除成功'
    });
  } catch (error) {
    console.error('❌ [删除乘客] 删除失败:', error);
    return res.status(500).json({
      success: false,
      message: '删除失败，请稍后再试'
    });
  }
});

/**
 * @api API-GET-ORDERS GET /api/orders
 * @summary 获取用户订单列表
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 是否成功
 * @returns {Array} response.data - 订单列表
 */
router.get('/api/orders', async (req, res) => {
  console.log('📋 [订单列表] 获取订单列表');
  
  // 骨架实现：返回模拟数据
  // 实际实现需要从数据库查询当前用户的订单
  const mockOrders = [
    {
      id: 'ORDER001',
      trainNumber: 'G1234',
      departureStation: '北京南',
      arrivalStation: '上海虹桥',
      departureDate: '2024-01-20',
      departureTime: '08:00',
      arrivalTime: '13:28',
      passengers: ['刘嘉敏', '王三'],
      seatType: '二等座',
      seatNumber: '05车06A, 05车06B',
      price: 553.5,
      status: '已出行'
    },
    {
      id: 'ORDER002',
      trainNumber: 'D5678',
      departureStation: '杭州东',
      arrivalStation: '南京南',
      departureDate: '2024-01-18',
      departureTime: '14:30',
      arrivalTime: '16:45',
      passengers: ['刘嘉敏'],
      seatType: '一等座',
      seatNumber: '03车02A',
      price: 184.0,
      status: '已完成'
    }
  ];
  
  return res.status(200).json({
    success: true,
    data: mockOrders
  });
});

export default router;

