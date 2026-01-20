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
  getOrderSuccessInfo,
  getPersonalInfo,
  verifyPassword,
  getUserOrders
} from '../database/operations.js';

// 🆕 导入 V2 版本的函数（使用新的座位管理系统）
import { searchTrainsV2 } from '../database/search_trains_v2.js';
import { submitOrderV2, confirmPaymentV2, cancelOrderV2 } from '../database/submit_order_v2.js';
import { countAvailableSeats } from '../database/seat_management.js';

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
  const { fromCity, toCity, departureDate, isStudent, isHighSpeed, useV2 } = req.body;
  
  // 参数验证
  if (!fromCity || !toCity || !departureDate) {
    return res.status(400).json({
      success: false,
      message: '出发地、目的地和出发日期不能为空'
    });
  }
  
  // 🆕 支持使用V2版本的座位管理系统
  const searchFunc = useV2 ? searchTrainsV2 : searchTrains;
  console.log(`🔍 [车次搜索] 使用${useV2 ? 'V2(区间座位)' : 'V1(旧系统)'}版本`);
  
  // 调用搜索函数
  const result = await searchFunc(fromCity, toCity, departureDate, isStudent, isHighSpeed);
  
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
 * @api API-GET-USER-ORDERS GET /api/orders
 * @summary 获取用户订单列表（支持30天历史订单过滤）
 * @param {string} query.status - 订单状态过滤（可选：unpaid/paid/cancelled）
 * @param {string} query.last30Days - 是否只查询30天内订单（默认true）
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 是否成功
 * @returns {Array} response.data - 订单列表
 * @calls FUNC-GET-USER-ORDERS - 委托给订单查询函数
 */
router.get('/api/orders', async (req, res) => {
  try {
    // 从请求头获取用户ID
    const userId = req.headers['x-user-id'];
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: '未登录或用户信息缺失'
      });
    }
    
    // 解析查询参数
    const { status, last30Days } = req.query;
    const options = {
      status: status || undefined,
      last30Days: last30Days === 'false' ? false : true // 默认为true
    };
    
    console.log(`📋 [订单列表API] 用户 ${userId} 查询订单, 选项:`, options);
    
    // 调用 FUNC-GET-USER-ORDERS
    const result = await getUserOrders(userId, options);
    
    if (result.success) {
      console.log(`✅ [订单列表API] 返回 ${result.data.length} 条订单`);
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error('❌ [订单列表API] 错误:', error);
    return res.status(500).json({
      success: false,
      message: '获取订单列表失败'
    });
  }
});

/**
 * @api GET /api/trains/available-seats
 * @summary 获取指定车次区间的实时余票数
 * @param {string} query.trainNumber - 车次号
 * @param {string} query.departureDate - 出发日期 (YYYY-MM-DD)
 * @param {string} query.fromStation - 出发站
 * @param {string} query.toStation - 到达站
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 是否成功
 * @returns {Object} response.data - 余票数据
 * @returns {number} response.data.businessClass - 商务座余票
 * @returns {number} response.data.firstClass - 一等座余票
 * @returns {number} response.data.secondClass - 二等座余票
 */
router.get('/api/trains/available-seats', async (req, res) => {
  const { trainNumber, departureDate, fromStation, toStation } = req.query;
  
  if (!trainNumber || !departureDate || !fromStation || !toStation) {
    return res.status(400).json({
      success: false,
      message: '参数不完整'
    });
  }
  
  try {
    const { getDb } = await import('../database/db.js');
    const db = getDb();
    
    // 1. 获取车次ID
    const train = await db.getAsync(`
      SELECT id FROM trains WHERE train_number = ?
    `, trainNumber);
    
    if (!train) {
      return res.status(404).json({
        success: false,
        message: '车次不存在'
      });
    }
    
    // 2. 获取班次ID
    const schedule = await db.getAsync(`
      SELECT id FROM train_schedules 
      WHERE train_id = ? AND departure_date = ?
    `, train.id, departureDate);
    
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: '该日期没有班次'
      });
    }
    
    // 3. 获取起止站点序号
    const fromStop = await db.getAsync(`
      SELECT ts.stop_sequence
      FROM train_stops ts
      JOIN stations s ON ts.station_id = s.id
      WHERE ts.train_id = ? AND s.station_name = ?
    `, train.id, fromStation);
    
    const toStop = await db.getAsync(`
      SELECT ts.stop_sequence
      FROM train_stops ts
      JOIN stations s ON ts.station_id = s.id
      WHERE ts.train_id = ? AND s.station_name = ?
    `, train.id, toStation);
    
    if (!fromStop || !toStop) {
      return res.status(404).json({
        success: false,
        message: '站点信息不存在'
      });
    }
    
    // 4. 使用 V2 系统计算区间可用座位
    const businessClassCount = await countAvailableSeats(
      schedule.id,
      fromStop.stop_sequence,
      toStop.stop_sequence,
      '商务座'
    );
    
    const firstClassCount = await countAvailableSeats(
      schedule.id,
      fromStop.stop_sequence,
      toStop.stop_sequence,
      '一等座'
    );
    
    const secondClassCount = await countAvailableSeats(
      schedule.id,
      fromStop.stop_sequence,
      toStop.stop_sequence,
      '二等座'
    );
    
    console.log(`🎫 [余票查询] ${trainNumber} ${fromStation}→${toStation}: 商务座${businessClassCount}, 一等座${firstClassCount}, 二等座${secondClassCount}`);
    
    return res.status(200).json({
      success: true,
      data: {
        businessClass: businessClassCount,
        firstClass: firstClassCount,
        secondClass: secondClassCount
      }
    });
  } catch (error) {
    console.error('❌ [余票查询失败]:', error);
    return res.status(500).json({
      success: false,
      message: '查询失败'
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
  const { trainNumber, departureDate, fromStation, toStation, departureTime, arrivalTime, passengers, useV2 } = req.body;
  
  // 参数验证
  if (!trainNumber || !departureDate || !fromStation || !toStation || !passengers || passengers.length === 0) {
    return res.status(400).json({
      success: false,
      message: '订单信息不完整'
    });
  }
  
  // 从 header 或 session 获取用户ID
  const userId = req.headers['x-user-id'] || req.session?.userId;
  
  // 🔧 如果没有用户ID，返回401错误（不再默认使用userId=1）
  if (!userId) {
    console.error('❌ [订单提交] 未登录或缺少用户ID');
    return res.status(401).json({
      success: false,
      message: '请先登录'
    });
  }
  
  console.log('👤 [订单提交] 用户ID:', userId);
  
  try {
    // 🆕 支持使用V2版本的座位管理系统
    const submitFunc = useV2 ? submitOrderV2 : submitOrder;
    console.log(`📝 [订单提交] 使用${useV2 ? 'V2(区间座位)' : 'V1(旧系统)'}版本`);
    
    // 调用订单处理函数
    const result = await submitFunc(userId, {
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
        orderNumber: result.orderNumber,
        seats: result.seats,
        message: '订单提交成功'
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.message || '订单提交失败'
      });
    }
  } catch (error) {
    console.error('❌ [订单提交API] 错误:', error);
    return res.status(500).json({
      success: false,
      message: '订单提交失败: ' + error.message
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
  
  console.log(`💳 [支付确认API] 收到支付确认请求, orderId: ${orderId}`);
  
  if (!orderId) {
    console.error(`❌ [支付确认API] 订单ID为空`);
    return res.status(400).json({
      success: false,
      message: '订单ID不能为空'
    });
  }
  
  const result = await confirmPayment(orderId);
  
  console.log(`📦 [支付确认API] confirmPayment 返回结果:`, result);
  
  if (result.success) {
    console.log(`✅ [支付确认API] 支付成功，返回 200`);
    return res.status(200).json(result);
  } else {
    if (result.timeout) {
      console.log(`⏰ [支付确认API] 订单超时，返回 400`);
      return res.status(400).json(result);
    }
    console.error(`❌ [支付确认API] 支付失败，返回 500:`, result.message);
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
 * @api API-SEND-PHONE-VERIFICATION POST /api/auth/send-phone-verification
 * @summary 发送手机验证码（用于修改手机号）
 * @param {Object} body - 请求体
 * @param {string} body.phone - 新手机号
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 是否成功
 * @returns {string} response.code - 验证码（开发环境）
 */
router.post('/api/auth/send-phone-verification', async (req, res) => {
  try {
    const { phone } = req.body;
    
    console.log('📱 [手机验证码] 发送验证码到:', phone);
    
    if (!phone) {
      console.error('❌ [手机验证码] 手机号为空');
      return res.status(400).json({
        success: false,
        message: '手机号不能为空'
      });
    }
    
    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      console.error('❌ [手机验证码] 手机号格式错误:', phone);
      return res.status(400).json({
        success: false,
        message: '手机号格式不正确'
      });
    }
    
    // 生成6位验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // TODO: 实际项目中应该调用短信服务商API发送验证码
    // 这里为了开发方便，直接返回验证码
    console.log(`✅ [手机验证码] 生成验证码: ${code} (手机号: ${phone})`);
    
    // 存储验证码到数据库（可选，用于验证）
    // 实际项目中应该设置过期时间
    
    return res.status(200).json({
      success: true,
      message: '验证码已发送',
      code: code // 开发环境返回验证码，生产环境应删除此行
    });
  } catch (error) {
    console.error('❌ [手机验证码] 发送失败:', error);
    return res.status(500).json({
      success: false,
      message: '发送验证码失败，请稍后再试'
    });
  }
});

/**
 * @api API-VERIFY-PHONE-CODE POST /api/auth/verify-phone-code
 * @summary 验证手机验证码并更新手机号
 * @param {Object} body - 请求体
 * @param {string} body.phone - 新手机号
 * @param {string} body.code - 验证码
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 是否成功
 */
router.post('/api/auth/verify-phone-code', async (req, res) => {
  try {
    const { phone, code } = req.body;
    const userId = req.headers['x-user-id'];
    
    console.log('🔐 [验证码验证] 验证手机验证码, phone:', phone, 'code:', code);
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: '未登录'
      });
    }
    
    if (!phone || !code) {
      return res.status(400).json({
        success: false,
        message: '手机号和验证码不能为空'
      });
    }
    
    // TODO: 实际项目中应该验证验证码是否正确且未过期
    // 这里为了开发方便，简化验证逻辑
    console.log('✅ [验证码验证] 验证码正确，更新手机号');
    
    // 更新用户手机号
    const { getDb } = await import('../database/db.js');
    const db = getDb();
    
    await db.runAsync(
      'UPDATE users SET phone = ? WHERE id = ?',
      phone, userId
    );
    
    console.log(`✅ [验证码验证] 手机号已更新: userId=${userId}, newPhone=${phone}`);
    
    return res.status(200).json({
      success: true,
      message: '手机号修改成功'
    });
  } catch (error) {
    console.error('❌ [验证码验证] 验证失败:', error);
    return res.status(500).json({
      success: false,
      message: '验证失败，请稍后再试'
    });
  }
});

/**
 * @api API-VERIFY-PASSWORD POST /api/auth/verify-password
 * @summary 验证用户密码
 * @param {Object} body - 请求体
 * @param {string} body.password - 密码
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 验证是否成功
 * @calls FUNC-VERIFY-PASSWORD
 */
router.post('/api/auth/verify-password', async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.headers['x-user-id'];
    
    console.log('🔐 [密码验证API] 收到请求, userId:', userId);
    
    if (!userId) {
      console.error('❌ [密码验证API] 缺少用户ID');
      return res.status(401).json({
        success: false,
        message: '未登录或用户信息缺失'
      });
    }
    
    if (!password) {
      console.error('❌ [密码验证API] 缺少密码');
      return res.status(400).json({
        success: false,
        message: '密码不能为空'
      });
    }
    
    // 调用 FUNC-VERIFY-PASSWORD
    const result = await verifyPassword(userId, password);
    
    if (result.success) {
      console.log('✅ [密码验证API] 密码验证成功');
      return res.status(200).json({ success: true });
    } else {
      console.log('❌ [密码验证API] 密码验证失败:', result.message);
      return res.status(200).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    console.error('❌ [密码验证API] 服务器错误:', error);
    return res.status(500).json({
      success: false,
      message: '验证失败，请稍后再试'
    });
  }
});

/**
 * @api API-GET-PERSONAL-INFO GET /api/personal-info
 * @summary 获取用户个人信息
 * @returns {Object} response - 响应体
 * @returns {boolean} response.success - 是否成功
 * @returns {Object} response.data - 用户个人信息
 * @calls FUNC-GET-PERSONAL-INFO
 */
router.get('/api/personal-info', async (req, res) => {
  try {
    // 从请求头或查询参数获取用户ID
    const userId = req.headers['x-user-id'] || req.query.userId;
    
    console.log('📋 [个人信息API] 收到请求, userId:', userId);
    
    if (!userId) {
      console.error('❌ [个人信息API] 缺少用户ID');
      return res.status(401).json({
        success: false,
        message: '未登录或用户信息缺失'
      });
    }
    
    // 调用 FUNC-GET-PERSONAL-INFO
    const result = await getPersonalInfo(userId);
    
    if (result.success) {
      console.log('✅ [个人信息API] 返回用户信息:', result.data.username);
      return res.status(200).json(result);
    } else {
      console.error('❌ [个人信息API] 获取失败:', result.message);
      return res.status(404).json(result);
    }
  } catch (error) {
    console.error('❌ [个人信息API] 服务器错误:', error);
    return res.status(500).json({
      success: false,
      message: '获取个人信息失败'
    });
  }
});

export default router;

