/**
 * 订单提交逻辑 V2 - 使用区间座位管理系统
 */

import { getDb } from './db.js';
import { 
  findAvailableSeats, 
  lockSeatSegment, 
  releaseSeatSegments 
} from './seat_management.js';

/**
 * 提交订单（使用新的区间座位管理）
 * @param {number} userId - 用户ID
 * @param {Object} orderData - 订单数据
 * @param {string} orderData.trainNumber - 车次号
 * @param {string} orderData.departureDate - 出发日期
 * @param {string} orderData.fromStation - 出发站
 * @param {string} orderData.toStation - 到达站
 * @param {Array} orderData.passengers - 乘客列表
 * @returns {Promise<Object>} 订单结果
 */
export async function submitOrderV2(userId, orderData) {
  const db = getDb();
  
  // 🔧 确保 userId 是整数类型
  const userIdInt = parseInt(userId, 10);
  
  console.log(`📝 [订单提交V2] 用户 ${userIdInt} 提交订单:`, {
    trainNumber: orderData.trainNumber,
    date: orderData.departureDate,
    from: orderData.fromStation,
    to: orderData.toStation,
    passengers: orderData.passengers.length
  });
  
  try {
    // ========== 验证输入 ==========
    if (!userIdInt || isNaN(userIdInt) || !orderData || !orderData.passengers || orderData.passengers.length === 0) {
      return { success: false, message: '订单信息不完整' };
    }
    
    // ========== 1. 查询车次和班次 ==========
    const train = await db.getAsync(
      'SELECT id FROM trains WHERE train_number = ?',
      orderData.trainNumber
    );
    
    if (!train) {
      return { success: false, message: `车次 ${orderData.trainNumber} 不存在` };
    }
    
    let schedule = await db.getAsync(
      'SELECT id FROM train_schedules WHERE train_id = ? AND departure_date = ?',
      train.id, orderData.departureDate
    );
    
    if (!schedule) {
      return { success: false, message: `班次不存在，请先生成 ${orderData.departureDate} 的班次数据` };
    }
    
    // ========== 2. 获取起止站点序号 ==========
    const fromStop = await db.getAsync(`
      SELECT ts.stop_sequence
      FROM train_stops ts
      JOIN stations s ON ts.station_id = s.id
      WHERE ts.train_id = ? AND s.station_name = ?
    `, train.id, orderData.fromStation);
    
    const toStop = await db.getAsync(`
      SELECT ts.stop_sequence
      FROM train_stops ts
      JOIN stations s ON ts.station_id = s.id
      WHERE ts.train_id = ? AND s.station_name = ?
    `, train.id, orderData.toStation);
    
    if (!fromStop || !toStop) {
      return { 
        success: false, 
        message: `站点信息不完整: ${orderData.fromStation} → ${orderData.toStation}` 
      };
    }
    
    const fromStopSeq = fromStop.stop_sequence;
    const toStopSeq = toStop.stop_sequence;
    
    console.log(`🛤️  [订单提交V2] 区间: [${fromStopSeq}, ${toStopSeq}) ${orderData.fromStation} → ${orderData.toStation}`);
    
    // ========== 3. 按席别分组乘客 ==========
    const passengersBySeatType = {};
    for (const p of orderData.passengers) {
      const seatType = p.seatClass;
      if (!passengersBySeatType[seatType]) {
        passengersBySeatType[seatType] = [];
      }
      passengersBySeatType[seatType].push(p);
    }
    
    // ========== 4. 查找并锁定座位 ==========
    const allocatedSeats = [];
    const seatAllocations = {};
    
    for (const [seatType, passengers] of Object.entries(passengersBySeatType)) {
      console.log(`🔍 [订单提交V2] 查找 ${seatType} 座位 ${passengers.length} 个`);
      
      // 查找可用座位
      const availableSeats = await findAvailableSeats(
        schedule.id,
        fromStopSeq,
        toStopSeq,
        seatType,
        passengers.length
      );
      
      if (availableSeats.length < passengers.length) {
        // 座位不足，回滚已分配的座位
        console.error(`❌ [订单提交V2] ${seatType} 余票不足: 需要 ${passengers.length}，可用 ${availableSeats.length}`);
        return {
          success: false,
          message: `${seatType}余票不足，请选择其他席别`
        };
      }
      
      // 记录分配结果
      for (let i = 0; i < passengers.length; i++) {
        allocatedSeats.push({
          passenger: passengers[i],
          seat: availableSeats[i]
        });
      }
      
      seatAllocations[seatType] = availableSeats;
    }
    
    console.log(`✅ [订单提交V2] 座位分配完成，共 ${allocatedSeats.length} 个座位`);
    
    // ========== 5. 创建订单记录 ==========
    const orderNumber = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const totalPrice = allocatedSeats.reduce((sum, item) => sum + item.seat.price, 0);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 20 * 60 * 1000); // 20分钟
    
    // 🔧 orders.id 是 TEXT 类型，需要显式指定
    const orderId = orderNumber; // 使用 orderNumber 作为订单 ID
    
    const orderResult = await db.runAsync(`
      INSERT INTO orders (
        id, order_number, user_id, schedule_id, 
        train_number, from_station, to_station,
        departure_date, departure_time, arrival_time,
        from_stop_seq, to_stop_seq,
        total_price, status, created_at, expires_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      orderId,     // id (TEXT 类型，使用 orderNumber)
      orderNumber, // order_number
      userIdInt,   // 🔧 使用转换后的整数
      schedule.id,
      orderData.trainNumber,       // train_number
      orderData.fromStation,       // from_station
      orderData.toStation,         // to_station
      orderData.departureDate,     // departure_date
      orderData.departureTime || '00:00',  // departure_time
      orderData.arrivalTime || '23:59',    // arrival_time
      fromStopSeq, 
      toStopSeq,
      totalPrice, 
      'unpaid', 
      now.toISOString(), 
      expiresAt.toISOString()
    );
    
    console.log(`📦 [订单提交V2] 订单创建成功: ${orderNumber} (ID=${orderId})`);
    
    // ========== 6. 创建乘客订单记录 & 锁定座位 ==========
    const seats = [];
    
    for (const allocation of allocatedSeats) {
      const { passenger, seat } = allocation;
      
      // 6.1 创建乘客订单记录
      await db.runAsync(`
        INSERT INTO order_passengers (
          order_id, name, id_type, id_number, ticket_type,
          seat_class, car_number, seat_number, price, seat_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        orderId,
        passenger.name,
        passenger.idType,
        passenger.idNumber,
        passenger.ticketType,
        seat.seat_type,
        seat.car_number,
        seat.seat_number,
        seat.price,
        seat.seat_id
      );
      
      // 6.2 锁定座位区间
      const lockSuccess = await lockSeatSegment(
        seat.seat_id,
        orderId,
        fromStopSeq,
        toStopSeq,
        'reserved'  // 未支付状态
      );
      
      if (!lockSuccess) {
        // 座位锁定失败（并发冲突），回滚整个订单
        await db.runAsync('DELETE FROM order_passengers WHERE order_id = ?', orderId);
        await db.runAsync('DELETE FROM orders WHERE id = ?', orderId);
        
        return {
          success: false,
          message: '座位已被占用，请重新选择'
        };
      }
      
      seats.push({
        passengerId: passenger.passengerId,
        carNumber: seat.car_number,
        seatNumber: seat.seat_number,
        seatType: seat.seat_type,
        price: seat.price
      });
    }
    
    console.log(`🔒 [订单提交V2] 座位锁定成功: ${seats.length} 个座位`);
    console.log('');
    
    return {
      success: true,
      orderId: String(orderId),
      orderNumber,
      message: '订单提交成功',
      seats
    };
    
  } catch (error) {
    console.error('❌ [订单提交V2] 失败:', error);
    return {
      success: false,
      message: '提交订单失败: ' + error.message
    };
  }
}

/**
 * 取消订单（释放座位）
 */
export async function cancelOrderV2(orderId, userId) {
  const db = getDb();
  
  // 🔧 确保 userId 是整数类型
  const userIdInt = parseInt(userId, 10);
  
  console.log(`❌ [取消订单V2] orderId: ${orderId}, userId: ${userIdInt}`);
  
  try {
    await db.runAsync('BEGIN TRANSACTION');
    
    // 1. 验证订单归属
    const order = await db.getAsync(`
      SELECT id, status FROM orders
      WHERE id = ? AND user_id = ?
    `, orderId, userIdInt);
    
    if (!order) {
      await db.runAsync('ROLLBACK');
      return { success: false, message: '订单不存在或无权操作' };
    }
    
    if (order.status !== 'unpaid') {
      await db.runAsync('ROLLBACK');
      return { success: false, message: '订单状态不允许取消' };
    }
    
    // 2. 释放座位锁定
    await releaseSeatSegments(orderId);
    
    // 3. 删除乘客订单记录
    await db.runAsync('DELETE FROM order_passengers WHERE order_id = ?', orderId);
    
    // 4. 更新订单状态
    await db.runAsync(`
      UPDATE orders
      SET status = 'cancelled'
      WHERE id = ?
    `, orderId);
    
    // 5. 增加用户当天取消次数
    const today = new Date().toISOString().split('T')[0];
    const existingCount = await db.getAsync(`
      SELECT cancel_count FROM user_daily_cancel_count 
      WHERE user_id = ? AND date = ?
    `, userIdInt, today);
    
    if (existingCount) {
      await db.runAsync(`
        UPDATE user_daily_cancel_count 
        SET cancel_count = cancel_count + 1 
        WHERE user_id = ? AND date = ?
      `, userIdInt, today);
    } else {
      await db.runAsync(`
        INSERT INTO user_daily_cancel_count (user_id, date, cancel_count)
        VALUES (?, ?, 1)
      `, userIdInt, today);
    }
    
    await db.runAsync('COMMIT');
    
    console.log(`✅ [取消订单V2] 订单已取消`);
    
    return { success: true, message: '订单已取消' };
    
  } catch (error) {
    await db.runAsync('ROLLBACK');
    console.error('❌ [取消订单V2] 失败:', error);
    return { success: false, message: '取消订单失败' };
  }
}

/**
 * 确认支付（确认座位锁定）
 */
export async function confirmPaymentV2(orderId) {
  const db = getDb();
  
  console.log(`💳 [支付确认V2] orderId: ${orderId}`);
  
  try {
    await db.runAsync('BEGIN TRANSACTION');
    
    // 1. 获取订单信息
    const order = await db.getAsync(`
      SELECT id, expires_at, status
      FROM orders
      WHERE id = ?
    `, orderId);
    
    if (!order) {
      await db.runAsync('ROLLBACK');
      return { success: false, message: '订单不存在' };
    }
    
    // 2. 检查订单是否超时
    const now = new Date();
    const expiresAt = new Date(order.expires_at);
    
    if (now > expiresAt) {
      // 订单超时，取消座位锁定
      await releaseSeatSegments(orderId);
      
      await db.runAsync(`
        UPDATE orders 
        SET status = 'cancelled'
        WHERE id = ?
      `, orderId);
      
      await db.runAsync('COMMIT');
      
      return {
        success: false,
        timeout: true,
        message: '支付超时，请重新购票'
      };
    }
    
    // 3. 确认座位锁定（reserved → confirmed）
    await db.runAsync(`
      UPDATE seat_segments
      SET status = 'confirmed'
      WHERE order_id = ? AND status = 'reserved'
    `, orderId);
    
    // 4. 更新订单状态
    await db.runAsync(`
      UPDATE orders 
      SET status = 'paid', 
          payment_method = '网上支付', 
          payment_time = CURRENT_TIMESTAMP
      WHERE id = ?
    `, orderId);
    
    await db.runAsync('COMMIT');
    
    console.log(`✅ [支付确认V2] 支付成功`);
    
    return { success: true, message: '支付成功' };
    
  } catch (error) {
    await db.runAsync('ROLLBACK');
    console.error('❌ [支付确认V2] 失败:', error);
    return { success: false, message: '支付失败' };
  }
}
