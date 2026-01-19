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
  getOrderPaymentInfo,
  confirmPayment,
  cancelOrder,
  getOrderSuccessInfo
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
      name: result.name
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
  // 从session、query参数或header中获取用户ID
  const userId = req.session?.userId || req.query.userId || req.headers['x-user-id'];
  
  // 如果没有用户ID，返回空列表（未登录状态）
  if (!userId) {
    return res.status(200).json({
      success: true,
      passengers: [],
      message: '未登录，请先登录后查看乘客列表'
    });
  }
  
  try {
    // 调用 FUNC-GET-PASSENGERS 从数据库获取
    const result = await getPassengers(userId);
    
    if (result.success) {
      console.log('✅ [乘客列表] 返回', result.passengers.length, '条记录');
      
      return res.status(200).json({
        success: true,
        passengers: result.passengers // 保持与前端一致的字段名
      });
    } else {
      return res.status(404).json({
        success: false,
        message: result.message || '获取乘客列表失败'
      });
    }
  } catch (error) {
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
  const { trainNumber, departureDate, fromStation, toStation, departureTime, arrivalTime, passengers } = req.body;
  
  // 参数验证
  if (!trainNumber || !departureDate || !fromStation || !toStation || !passengers || passengers.length === 0) {
    return res.status(400).json({
      success: false,
      message: '订单信息不完整'
    });
  }
  
  // 从session或token中获取用户ID (暂时使用固定ID，实际应从session获取)
  const userId = req.session?.userId || 1;
  
  try {
    // 调用 FUNC-SUBMIT-ORDER 处理订单
    const result = await submitOrder(userId, {
      trainNumber,
      departureDate,
      fromStation,
      toStation,
      departureTime,
      arrivalTime,
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
 * @api API-GET-ORDER-PAYMENT-INFO GET /api/payment/:orderId
 * @summary 获取订单支付信息
 * @param {string} orderId - 订单ID (URL参数)
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 是否成功
 * @returns {Object} response.order - 订单信息
 * @calls FUNC-GET-ORDER-PAYMENT-INFO
 */
router.get('/api/payment/:orderId', async (req, res) => {
  const { orderId } = req.params;
  
  if (!orderId) {
    return res.status(400).json({
      success: false,
      message: '订单ID不能为空'
    });
  }
  
  const result = await getOrderPaymentInfo(orderId);
  
  if (result.success) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json(result);
  }
});

/**
 * @api API-CONFIRM-PAYMENT POST /api/payment/:orderId/confirm
 * @summary 确认支付订单
 * @param {string} orderId - 订单ID (URL参数)
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 是否成功
 * @returns {string} response.message - 响应消息
 * @returns {boolean} response.timeout - 是否超时(可选)
 * @calls FUNC-CONFIRM-PAYMENT
 */
router.post('/api/payment/:orderId/confirm', async (req, res) => {
  const { orderId } = req.params;
  
  if (!orderId) {
    return res.status(400).json({
      success: false,
      message: '订单ID不能为空'
    });
  }
  
  const result = await confirmPayment(orderId);
  
  if (result.success) {
    return res.status(200).json(result);
  } else {
    if (result.timeout) {
      return res.status(400).json(result);
    }
    return res.status(500).json(result);
  }
});

/**
 * @api API-CANCEL-ORDER POST /api/payment/:orderId/cancel
 * @summary 取消订单
 * @param {string} orderId - 订单ID (URL参数)
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 是否成功
 * @returns {string} response.message - 响应消息
 * @calls FUNC-CANCEL-ORDER
 */
router.post('/api/payment/:orderId/cancel', async (req, res) => {
  const { orderId } = req.params;
  
  if (!orderId) {
    return res.status(400).json({
      success: false,
      message: '订单ID不能为空'
    });
  }
  
  // TODO: 从session获取userId
  // 临时方案：从请求体或query获取，实际应该从session中获取
  const userId = req.body.userId || req.query.userId || 1;
  
  const result = await cancelOrder(orderId, userId);
  
  if (result.success) {
    return res.status(200).json(result);
  } else {
    return res.status(500).json(result);
  }
});

/**
 * @api API-GET-ORDER-SUCCESS-INFO GET /api/orders/:orderId/success
 * @summary 获取订单成功信息
 * @param {string} orderId - 订单ID (URL参数)
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 是否成功
 * @returns {Object} response.order - 订单信息
 * @calls FUNC-GET-ORDER-SUCCESS-INFO
 */
router.get('/api/orders/:orderId/success', async (req, res) => {
  const { orderId } = req.params;
  
  if (!orderId) {
    return res.status(400).json({
      success: false,
      message: '订单ID不能为空'
    });
  }
  
  const result = await getOrderSuccessInfo(orderId);
  
  if (result.success) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json(result);
  }
});

/**
 * @api API-GET-PAYMENT-INFO GET /api/payment/:orderId
 * @summary 获取订单支付信息
 * @param {string} orderId - 订单ID（从URL参数获取）
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 是否成功
 * @returns {Object} response.order - 订单信息
 */
router.get('/api/payment/:orderId', async (req, res) => {
  const { orderId } = req.params;
  
  console.log(`💰 [支付页面] 获取订单信息, orderId: ${orderId}`);
  
  if (!orderId) {
    return res.status(400).json({
      success: false,
      message: '订单号不能为空'
    });
  }
  
  try {
    // Mock订单信息（后续需要从数据库获取）
    const mockOrderInfo = {
      orderId: orderId,
      trainNumber: 'G103',
      date: '2026-01-19（周日）',
      fromStation: '北京南',
      toStation: '上海虹桥',
      departTime: '06:20',
      arriveTime: '11:58',
      passengers: [
        {
          name: '嗷嗷',
          idType: '居民身份证',
          idNumber: '508401201009152655',
          ticketType: '成人票',
          seatClass: '二等座',
          carNumber: '01',
          seatNumber: '01A',
          price: 553.5
        }
      ],
      totalPrice: 553.5,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 20 * 60 * 1000).toISOString() // 20分钟后过期
    };
    
    console.log(`✅ [支付页面] 返回订单信息, 总价: ${mockOrderInfo.totalPrice}元`);
    
    return res.status(200).json({
      success: true,
      order: mockOrderInfo
    });
  } catch (error) {
    console.error('❌ [支付页面] 获取订单信息失败:', error);
    return res.status(500).json({
      success: false,
      message: '获取订单信息失败'
    });
  }
});

/**
 * @api API-CONFIRM-PAYMENT POST /api/payment/:orderId/confirm
 * @summary 确认支付订单
 * @param {string} orderId - 订单ID
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 是否成功
 */
router.post('/api/payment/:orderId/confirm', async (req, res) => {
  const { orderId } = req.params;
  
  console.log(`💳 [支付确认] 确认支付订单, orderId: ${orderId}`);
  
  try {
    // Mock支付成功
    console.log(`✅ [支付确认] 支付成功`);
    
    return res.status(200).json({
      success: true,
      message: '支付成功'
    });
  } catch (error) {
    console.error('❌ [支付确认] 支付失败:', error);
    return res.status(500).json({
      success: false,
      message: '支付失败'
    });
  }
});

/**
 * @api API-CANCEL-ORDER POST /api/payment/:orderId/cancel
 * @summary 取消订单
 * @param {string} orderId - 订单ID
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 是否成功
 */
router.post('/api/payment/:orderId/cancel', async (req, res) => {
  const { orderId } = req.params;
  
  console.log(`❌ [取消订单] 取消订单, orderId: ${orderId}`);
  
  try {
    // Mock取消成功
    console.log(`✅ [取消订单] 取消成功`);
    
    return res.status(200).json({
      success: true,
      message: '订单已取消'
    });
  } catch (error) {
    console.error('❌ [取消订单] 取消失败:', error);
    return res.status(500).json({
      success: false,
      message: '取消订单失败'
    });
  }
});

/**
 * @api API-GET-ORDER-SUCCESS GET /api/orders/:orderId/success
 * @summary 获取购票成功页订单信息
 * @param {string} orderId - 订单ID（从URL参数获取）
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 是否成功
 * @returns {Object} response.order - 订单详细信息
 */
router.get('/api/orders/:orderId/success', async (req, res) => {
  const { orderId } = req.params;
  
  console.log(`🎉 [购票成功] 获取订单详情, orderId: ${orderId}`);
  
  if (!orderId) {
    return res.status(400).json({
      success: false,
      message: '订单号不能为空'
    });
  }
  
  try {
    // Mock订单详细信息（包含座位信息）
    const mockOrderInfo = {
      orderId: orderId,
      trainNumber: 'G103',
      date: '2026-01-19（周日）',
      fromStation: '北京南',
      toStation: '上海虹桥',
      departTime: '06:20',
      arriveTime: '11:58',
      paymentMethod: '中国工商银行',
      paymentTime: new Date().toISOString(),
      totalPrice: 553.5,
      passengers: [
        {
          name: '嗷嗷',
          idType: '居民身份证',
          idNumber: '508401201009152655',
          ticketType: '成人票',
          seatClass: '二等座',
          carNumber: '01',
          seatNumber: '01A',
          price: 553.5
        }
      ]
    };
    
    console.log(`✅ [购票成功] 返回订单详情, 订单号: ${orderId}`);
    
    return res.status(200).json({
      success: true,
      order: mockOrderInfo
    });
  } catch (error) {
    console.error('❌ [购票成功] 获取订单详情失败:', error);
    return res.status(500).json({
      success: false,
      message: '获取订单详情失败'
    });
  }
});

export default router;

