/**
 * 区间座位管理核心逻辑
 * 实现座位区间冲突检测、座位分配、余票计算
 */

import { getDb } from './db.js';

/**
 * 检查座位在指定区间是否可用
 * @param {number} seatId - 座位ID
 * @param {number} fromStopSeq - 起始站序号
 * @param {number} toStopSeq - 终点站序号
 * @returns {Promise<boolean>} 是否可用
 */
export async function isSeatAvailableInSegment(seatId, fromStopSeq, toStopSeq) {
  const db = getDb();
  
  // 区间冲突检测算法：
  // 如果存在已锁定区间 [locked_from, locked_to)，使得
  // locked_from < to_seq AND locked_to > from_seq
  // 则两个区间有交集，存在冲突
  
  const result = await db.getAsync(`
    SELECT COUNT(*) as conflicts
    FROM seat_segments ss
    WHERE ss.seat_id = ?
      AND ss.status IN ('reserved', 'confirmed')
      AND ss.from_stop_seq < ?
      AND ss.to_stop_seq > ?
  `, seatId, toStopSeq, fromStopSeq);
  
  return result.conflicts === 0;
}

/**
 * 查找可用座位
 * @param {number} scheduleId - 班次ID
 * @param {number} fromStopSeq - 起始站序号
 * @param {number} toStopSeq - 终点站序号
 * @param {string} seatType - 座位类型
 * @param {number} count - 需要的座位数量
 * @returns {Promise<Array>} 可用座位列表
 */
export async function findAvailableSeats(scheduleId, fromStopSeq, toStopSeq, seatType, count) {
  const db = getDb();
  
  console.log(`🔍 查找可用座位: 班次=${scheduleId}, 区间=[${fromStopSeq}, ${toStopSeq}), 类型=${seatType}, 数量=${count}`);
  
  // 🔧 先获取 train_id 以计算区间价格
  const schedule = await db.getAsync(`
    SELECT train_id FROM train_schedules WHERE id = ?
  `, scheduleId);
  
  if (!schedule) {
    console.error(`❌ 未找到班次: ${scheduleId}`);
    return [];
  }
  
  // 🔧 计算区间价格（累加分段价格）
  const priceResult = await db.getAsync(`
    SELECT SUM(price) as segment_price
    FROM train_segment_prices
    WHERE train_id = ? 
      AND seat_type = ?
      AND from_stop_seq >= ? 
      AND to_stop_seq <= ?
  `, schedule.train_id, seatType, fromStopSeq, toStopSeq);
  
  const segmentPrice = priceResult?.segment_price || 0;
  console.log(`💰 区间价格: ${seatType} = ${segmentPrice}元`);
  
  // 查询所有该类型的座位，排除在指定区间有冲突的座位
  const seats = await db.allAsync(`
    SELECT 
      ss.id as seat_id,
      ss.car_number,
      ss.seat_number,
      ss.seat_type,
      ss.price as full_price
    FROM schedule_seats ss
    WHERE ss.schedule_id = ?
      AND ss.seat_type = ?
      AND ss.status = 'available'
      AND NOT EXISTS (
        SELECT 1
        FROM seat_segments seg
        WHERE seg.seat_id = ss.id
          AND seg.status IN ('reserved', 'confirmed')
          AND seg.from_stop_seq < ?
          AND seg.to_stop_seq > ?
      )
    ORDER BY ss.car_number, ss.seat_number
    LIMIT ?
  `, scheduleId, seatType, toStopSeq, fromStopSeq, count);
  
  // 🔧 使用区间价格替换全程价格
  const seatsWithSegmentPrice = seats.map(seat => ({
    ...seat,
    price: segmentPrice > 0 ? segmentPrice : seat.full_price  // 如果没有分段价格，回退到全程价格
  }));
  
  console.log(`✅ 找到 ${seatsWithSegmentPrice.length} 个可用座位，区间价格: ${segmentPrice}元`);
  
  return seatsWithSegmentPrice;
}

/**
 * 计算余票数量
 * @param {number} scheduleId - 班次ID
 * @param {number} fromStopSeq - 起始站序号
 * @param {number} toStopSeq - 终点站序号
 * @param {string} seatType - 座位类型
 * @returns {Promise<number>} 余票数量
 */
export async function countAvailableSeats(scheduleId, fromStopSeq, toStopSeq, seatType) {
  const db = getDb();
  
  const result = await db.getAsync(`
    SELECT COUNT(*) as count
    FROM schedule_seats ss
    WHERE ss.schedule_id = ?
      AND ss.seat_type = ?
      AND ss.status = 'available'
      AND NOT EXISTS (
        SELECT 1
        FROM seat_segments seg
        WHERE seg.seat_id = ss.id
          AND seg.status IN ('reserved', 'confirmed')
          AND seg.from_stop_seq < ?
          AND seg.to_stop_seq > ?
      )
  `, scheduleId, seatType, toStopSeq, fromStopSeq);
  
  return result.count;
}

/**
 * 锁定座位（创建区间锁定记录）
 * @param {number} seatId - 座位ID
 * @param {number} orderId - 订单ID
 * @param {number} fromStopSeq - 起始站序号
 * @param {number} toStopSeq - 终点站序号
 * @param {string} status - 锁定状态 (reserved/confirmed)
 * @returns {Promise<boolean>} 是否成功
 */
export async function lockSeatSegment(seatId, orderId, fromStopSeq, toStopSeq, status = 'reserved') {
  const db = getDb();
  
  try {
    await db.runAsync('BEGIN TRANSACTION');
    
    // 再次检查座位是否可用（防止并发冲突）
    const isAvailable = await isSeatAvailableInSegment(seatId, fromStopSeq, toStopSeq);
    
    if (!isAvailable) {
      await db.runAsync('ROLLBACK');
      console.error(`❌ 座位 ${seatId} 在区间 [${fromStopSeq}, ${toStopSeq}) 已被占用`);
      return false;
    }
    
    // 创建区间锁定记录
    await db.runAsync(`
      INSERT INTO seat_segments (
        seat_id, order_id, from_stop_seq, to_stop_seq, status
      ) VALUES (?, ?, ?, ?, ?)
    `, seatId, orderId, fromStopSeq, toStopSeq, status);
    
    await db.runAsync('COMMIT');
    
    console.log(`✅ 座位 ${seatId} 已锁定在区间 [${fromStopSeq}, ${toStopSeq}), 状态=${status}`);
    
    return true;
    
  } catch (error) {
    await db.runAsync('ROLLBACK');
    console.error(`❌ 锁定座位失败:`, error);
    return false;
  }
}

/**
 * 释放座位（取消区间锁定）
 * @param {number} orderId - 订单ID
 * @returns {Promise<void>}
 */
export async function releaseSeatSegments(orderId) {
  const db = getDb();
  
  console.log(`🔓 释放订单 ${orderId} 的座位锁定...`);
  
  // 将状态改为 cancelled
  const result = await db.runAsync(`
    UPDATE seat_segments
    SET status = 'cancelled'
    WHERE order_id = ? AND status IN ('reserved', 'confirmed')
  `, orderId);
  
  console.log(`✅ 已释放 ${result.changes} 个座位锁定`);
}

/**
 * 确认座位锁定（支付成功后）
 * @param {number} orderId - 订单ID
 * @returns {Promise<void>}
 */
export async function confirmSeatSegments(orderId) {
  const db = getDb();
  
  console.log(`✅ 确认订单 ${orderId} 的座位锁定...`);
  
  // 将 reserved 状态改为 confirmed
  const result = await db.runAsync(`
    UPDATE seat_segments
    SET status = 'confirmed'
    WHERE order_id = ? AND status = 'reserved'
  `, orderId);
  
  console.log(`✅ 已确认 ${result.changes} 个座位锁定`);
}

/**
 * 获取订单的座位信息
 * @param {number} orderId - 订单ID
 * @returns {Promise<Array>} 座位列表
 */
export async function getOrderSeats(orderId) {
  const db = getDb();
  
  const seats = await db.allAsync(`
    SELECT 
      os.id,
      os.passenger_name,
      os.passenger_id_number,
      os.seat_type,
      os.car_number,
      os.seat_number,
      os.price,
      ss.seat_id
    FROM order_passengers os
    LEFT JOIN schedule_seats ss ON os.seat_id = ss.id
    WHERE os.order_id = ?
  `, orderId);
  
  return seats;
}

/**
 * 获取座位的锁定状态（用于调试）
 * @param {number} seatId - 座位ID
 * @returns {Promise<Array>} 锁定记录列表
 */
export async function getSeatSegments(seatId) {
  const db = getDb();
  
  const segments = await db.allAsync(`
    SELECT 
      seg.*,
      o.order_number,
      o.status as order_status
    FROM seat_segments seg
    JOIN orders o ON seg.order_id = o.id
    WHERE seg.seat_id = ?
    ORDER BY seg.from_stop_seq
  `, seatId);
  
  return segments;
}

/**
 * 清理超时的座位锁定（定时任务）
 * @returns {Promise<number>} 清理的记录数
 */
export async function cleanupExpiredSeatLocks() {
  const db = getDb();
  
  console.log('🧹 [座位清理] 开始清理超时的座位锁定...');
  
  try {
    const now = new Date().toISOString();
    
    // 查找超时的订单
    const expiredOrders = await db.allAsync(`
      SELECT id FROM orders
      WHERE status = 'unpaid'
        AND expires_at < ?
    `, now);
    
    if (expiredOrders.length === 0) {
      console.log('✅ [座位清理] 没有超时的订单');
      return 0;
    }
    
    console.log(`📦 [座位清理] 找到 ${expiredOrders.length} 个超时订单`);
    
    // 释放座位锁定
    let totalReleased = 0;
    for (const order of expiredOrders) {
      const result = await db.runAsync(`
        UPDATE seat_segments
        SET status = 'cancelled'
        WHERE order_id = ? AND status = 'reserved'
      `, order.id);
      
      totalReleased += result.changes;
      
      // 更新订单状态
      await db.runAsync(`
        UPDATE orders
        SET status = 'cancelled'
        WHERE id = ?
      `, order.id);
    }
    
    console.log(`✅ [座位清理] 释放了 ${totalReleased} 个座位锁定`);
    
    return totalReleased;
    
  } catch (error) {
    console.error('❌ [座位清理] 清理失败:', error);
    return 0;
  }
}

/**
 * 获取指定区间的余票数量（兼容旧API）
 * @param {number} trainId - 车次ID
 * @param {string} fromStation - 出发站
 * @param {string} toStation - 到达站
 * @param {string} departureDate - 出发日期
 * @returns {Promise<Object>} 各席别的余票数量
 */
export async function getAvailableTickets(trainId, fromStation, toStation, departureDate) {
  const db = getDb();
  
  try {
    // 1. 获取班次ID
    const schedule = await db.getAsync(`
      SELECT id FROM train_schedules
      WHERE train_id = ? AND departure_date = ?
    `, trainId, departureDate);
    
    if (!schedule) {
      return { secondClass: 0, firstClass: 0, businessClass: 0 };
    }
    
    // 2. 获取起始站和终点站的序号
    const fromStop = await db.getAsync(`
      SELECT stop_sequence
      FROM train_stops ts
      JOIN stations s ON ts.station_id = s.id
      WHERE ts.train_id = ? AND s.station_name = ?
    `, trainId, fromStation);
    
    const toStop = await db.getAsync(`
      SELECT stop_sequence
      FROM train_stops ts
      JOIN stations s ON ts.station_id = s.id
      WHERE ts.train_id = ? AND s.station_name = ?
    `, trainId, toStation);
    
    if (!fromStop || !toStop) {
      return { secondClass: 0, firstClass: 0, businessClass: 0 };
    }
    
    // 3. 计算各席别余票
    const secondClass = await countAvailableSeats(
      schedule.id, fromStop.stop_sequence, toStop.stop_sequence, '二等座'
    );
    
    const firstClass = await countAvailableSeats(
      schedule.id, fromStop.stop_sequence, toStop.stop_sequence, '一等座'
    );
    
    const businessClass = await countAvailableSeats(
      schedule.id, fromStop.stop_sequence, toStop.stop_sequence, '商务座'
    );
    
    return {
      secondClass,
      firstClass,
      businessClass
    };
    
  } catch (error) {
    console.error('获取余票数量失败:', error);
    return { secondClass: 0, firstClass: 0, businessClass: 0 };
  }
}
