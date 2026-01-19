/**
 * Payment and Purchase Success API Tests
 * 支付页面和购票成功页面的API集成测试
 * 
 * 测试覆盖的Scenarios:
 * 1. 从订单填写页跳转支付页
 * 2. 从未完成订单页跳转支付页
 * 3. 用户确认支付车票(订单未超时)
 * 4. 用户确认支付车票但订单已超时
 * 5. 用户在交易提示弹窗确认取消订单
 * 6. 系统跳转至购票成功页
 */

import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest';
import { 
  getOrderPaymentInfo, 
  confirmPayment, 
  cancelOrder,
  getOrderSuccessInfo,
  submitOrder 
} from '../src/database/operations.js';
import { getDb } from '../src/database/db.js';

describe('Payment API Integration Tests', () => {
  let testDb;
  let testUserId;
  let testOrderId;

  beforeAll(async () => {
    // 获取测试数据库连接
    testDb = getDb();
    
    // 创建测试用户
    const existingUser = testDb.prepare('SELECT id FROM users WHERE username = ?').get('testpayuser');
    
    if (!existingUser) {
      testDb.prepare(`
        INSERT INTO users (username, password_hash, real_name, id_type, id_number, phone, email, id_card_last4)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run('testpayuser', 'hash123', '测试用户', '居民身份证', '330102199001011234', '13800138001', 'testpay@test.com', '1234');
      testUserId = testDb.prepare('SELECT id FROM users WHERE username = ?').get('testpayuser').id;
    } else {
      testUserId = existingUser.id;
    }
    
    // 创建测试乘客(如果不存在)
    const existingPassenger = testDb.prepare('SELECT id FROM passengers WHERE user_id = ? AND name = ?').get(testUserId, '王三');
    
    if (!existingPassenger) {
      testDb.prepare(`
        INSERT INTO passengers (user_id, name, id_type, id_number, phone, passenger_type)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(testUserId, '王三', '居民身份证', '330102199001011234', '13800138001', '成人');
    }
  });

  afterAll(() => {
    // 清理测试数据
    if (testDb) {
      testDb.close();
    }
  });

  describe('Scenario 1 & 2: 跳转到支付页', () => {
    beforeEach(async () => {
      // 清理旧订单
      testDb.prepare('DELETE FROM order_passengers').run();
      testDb.prepare('DELETE FROM orders').run();
      
      // 创建测试订单
      const passenger = testDb.prepare('SELECT id FROM passengers WHERE user_id = ? LIMIT 1').get(testUserId);
      
      const orderData = {
        trainNumber: 'G103',
        fromStation: '北京南',
        toStation: '上海虹桥',
        departureDate: '2026-01-18',
        departureTime: '06:20',
        arrivalTime: '11:58',
        seatClass: '二等座',
        passengers: [{
          passengerId: passenger.id,
          name: '王三',
          idType: '居民身份证',
          idNumber: '330102199001011234',
          ticketType: '成人票',
          seatClass: '二等座',
          price: 662.0
        }]
      };
      
      const result = await submitOrder(testUserId, orderData);
      testOrderId = result.orderId;
    });

    it('应该获取订单支付信息', async () => {
      const result = await getOrderPaymentInfo(testOrderId);
      
      expect(result.success).toBe(true);
      expect(result.order).toBeDefined();
      expect(result.order.orderId).toBe(testOrderId);
      expect(result.order.trainNumber).toBe('G103');
      expect(result.order.fromStation).toBe('北京南');
      expect(result.order.toStation).toBe('上海虹桥');
      expect(result.order.passengers).toBeDefined();
      expect(result.order.passengers.length).toBeGreaterThan(0);
      expect(result.order.totalPrice).toBeDefined();
      expect(result.order.createdAt).toBeDefined();
      expect(result.order.expiresAt).toBeDefined();
    });

    it('应该计算正确的剩余支付时间(20分钟)', async () => {
      const result = await getOrderPaymentInfo(testOrderId);
      
      const createdTime = new Date(result.order.createdAt).getTime();
      const expiresTime = new Date(result.order.expiresAt).getTime();
      const duration = (expiresTime - createdTime) / 1000 / 60; // 转换为分钟
      
      expect(Math.abs(duration - 20)).toBeLessThan(1);
    });
  });

  describe('Scenario 3: 用户确认支付车票(订单未超时)', () => {
    beforeEach(async () => {
      // 清理旧订单
      testDb.prepare('DELETE FROM order_passengers').run();
      testDb.prepare('DELETE FROM orders').run();
      
      // 创建新订单
      const passenger = testDb.prepare('SELECT id FROM passengers WHERE user_id = ? LIMIT 1').get(testUserId);
      
      const orderData = {
        trainNumber: 'G103',
        fromStation: '北京南',
        toStation: '上海虹桥',
        departureDate: '2026-01-18',
        departureTime: '06:20',
        arrivalTime: '11:58',
        seatClass: '二等座',
        passengers: [{
          passengerId: passenger.id,
          name: '王三',
          idType: '居民身份证',
          idNumber: '330102199001011234',
          ticketType: '成人票',
          seatClass: '二等座',
          price: 662.0
        }]
      };
      
      const result = await submitOrder(testUserId, orderData);
      testOrderId = result.orderId;
    });

    it('应该成功确认支付', async () => {
      const result = await confirmPayment(testOrderId);
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('支付成功');
      
      // 验证数据库中订单状态已更新
      const order = testDb.prepare('SELECT status FROM orders WHERE id = ?').get(testOrderId);
      expect(order.status).toBe('已支付');
    });

    it('支付后座位状态应该确认为已被预定', async () => {
      await confirmPayment(testOrderId);
      
      // 验证座位状态
      const seats = testDb.prepare(`
        SELECT seat_status FROM train_seats 
        WHERE order_id = ?
      `).all(testOrderId);
      
      expect(seats.length).toBeGreaterThan(0);
      seats.forEach(seat => {
        expect(seat.seat_status).toBe('已被预定');
      });
    });
  });

  describe('Scenario 4: 用户确认支付但订单已超时', () => {
    beforeEach(async () => {
      // 清理旧订单
      testDb.prepare('DELETE FROM order_passengers').run();
      testDb.prepare('DELETE FROM orders').run();
      
      // 创建一个已过期的订单
      const passenger = testDb.prepare('SELECT id FROM passengers WHERE user_id = ? LIMIT 1').get(testUserId);
      
      const orderData = {
        trainNumber: 'G103',
        fromStation: '北京南',
        toStation: '上海虹桥',
        departureDate: '2026-01-18',
        departureTime: '06:20',
        arrivalTime: '11:58',
        seatClass: '二等座',
        passengers: [{
          passengerId: passenger.id,
          name: '王三',
          idType: '居民身份证',
          idNumber: '330102199001011234',
          ticketType: '成人票',
          seatClass: '二等座',
          price: 662.0
        }]
      };
      
      const result = await submitOrder(testUserId, orderData);
      testOrderId = result.orderId;
      
      // 手动将订单过期时间设置为过去
      const pastTime = new Date(Date.now() - 1000).toISOString(); // 1秒前
      testDb.prepare('UPDATE orders SET expires_at = ? WHERE id = ?').run(pastTime, testOrderId);
    });

    it('应该拒绝超时订单的支付请求', async () => {
      const result = await confirmPayment(testOrderId);
      
      expect(result.success).toBe(false);
      expect(result.timeout).toBe(true);
      expect(result.message).toBe('支付超时，请重新购票');
    });

    it('超时订单的座位应该释放', async () => {
      await confirmPayment(testOrderId);
      
      // 验证座位状态已释放
      const seats = testDb.prepare(`
        SELECT seat_status FROM train_seats 
        WHERE order_id = ?
      `).all(testOrderId);
      
      seats.forEach(seat => {
        expect(seat.seat_status).toBe('空闲');
      });
    });
  });

  describe('Scenario 5: 用户确认取消订单', () => {
    beforeEach(async () => {
      // 清理旧订单
      testDb.prepare('DELETE FROM order_passengers').run();
      testDb.prepare('DELETE FROM orders').run();
      
      // 创建新订单
      const passenger = testDb.prepare('SELECT id FROM passengers WHERE user_id = ? LIMIT 1').get(testUserId);
      
      const orderData = {
        trainNumber: 'G103',
        fromStation: '北京南',
        toStation: '上海虹桥',
        departureDate: '2026-01-18',
        departureTime: '06:20',
        arrivalTime: '11:58',
        seatClass: '二等座',
        passengers: [{
          passengerId: passenger.id,
          name: '王三',
          idType: '居民身份证',
          idNumber: '330102199001011234',
          ticketType: '成人票',
          seatClass: '二等座',
          price: 662.0
        }]
      };
      
      const result = await submitOrder(testUserId, orderData);
      testOrderId = result.orderId;
    });

    it('应该成功取消订单', async () => {
      const result = await cancelOrder(testOrderId, testUserId);
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('订单已取消');
    });

    it('取消订单后订单信息应该被删除', async () => {
      await cancelOrder(testOrderId, testUserId);
      
      const order = testDb.prepare('SELECT * FROM orders WHERE id = ?').get(testOrderId);
      expect(order).toBeUndefined();
    });

    it('取消订单后座位应该释放', async () => {
      await cancelOrder(testOrderId, testUserId);
      
      const seats = testDb.prepare(`
        SELECT seat_status FROM train_seats 
        WHERE order_id = ?
      `).all(testOrderId);
      
      if (seats.length > 0) {
        seats.forEach(seat => {
          expect(seat.seat_status).toBe('空闲');
        });
      }
    });

    it('取消订单后应该增加用户当天取消次数', async () => {
      const beforeCount = testDb.prepare(`
        SELECT cancel_count FROM user_daily_cancel_count 
        WHERE user_id = ? AND date = date('now')
      `).get(testUserId);
      
      const beforeCancelCount = beforeCount ? beforeCount.cancel_count : 0;
      
      await cancelOrder(testOrderId, testUserId);
      
      const afterCount = testDb.prepare(`
        SELECT cancel_count FROM user_daily_cancel_count 
        WHERE user_id = ? AND date = date('now')
      `).get(testUserId);
      
      expect(afterCount.cancel_count).toBe(beforeCancelCount + 1);
    });
  });

  describe('Scenario 6: 系统跳转至购票成功页', () => {
    beforeEach(async () => {
      // 清理旧订单
      testDb.prepare('DELETE FROM order_passengers').run();
      testDb.prepare('DELETE FROM orders').run();
      
      // 创建并支付订单
      const passenger = testDb.prepare('SELECT id FROM passengers WHERE user_id = ? LIMIT 1').get(testUserId);
      
      const orderData = {
        trainNumber: 'G103',
        fromStation: '北京南',
        toStation: '上海虹桥',
        departureDate: '2026-01-18',
        departureTime: '06:20',
        arrivalTime: '11:58',
        seatClass: '二等座',
        passengers: [{
          passengerId: passenger.id,
          name: '王三',
          idType: '居民身份证',
          idNumber: '330102199001011234',
          ticketType: '成人票',
          seatClass: '二等座',
          price: 662.0
        }]
      };
      
      const result = await submitOrder(testUserId, orderData);
      testOrderId = result.orderId;
      
      // 确认支付
      await confirmPayment(testOrderId);
    });

    it('应该获取订单成功信息', async () => {
      const result = await getOrderSuccessInfo(testOrderId);
      
      expect(result.success).toBe(true);
      expect(result.order).toBeDefined();
      expect(result.order.orderId).toBe(testOrderId);
      expect(result.order.orderNumber).toBeDefined();
      expect(result.order.orderNumber.startsWith('EA')).toBe(true);
      expect(result.order.orderNumber.length).toBe(10);
      expect(result.order.trainNumber).toBe('G103');
      expect(result.order.passengers).toBeDefined();
      expect(result.order.passengers.length).toBeGreaterThan(0);
    });

    it('订单成功信息应该包含完整的乘客信息', async () => {
      const result = await getOrderSuccessInfo(testOrderId);
      
      const passenger = result.order.passengers[0];
      expect(passenger.name).toBe('王三');
      expect(passenger.idType).toBe('居民身份证');
      expect(passenger.idNumber).toContain('***');
      expect(passenger.ticketType).toBe('成人票');
      expect(passenger.seatClass).toBe('二等座');
      expect(passenger.carNumber).toBeDefined();
      expect(passenger.seatNumber).toBeDefined();
      expect(passenger.price).toBeDefined();
      expect(passenger.status).toBe('已支付');
    });

    it('证件号应该按照规则打码(前4位+****+后3位)', async () => {
      const result = await getOrderSuccessInfo(testOrderId);
      
      const passenger = result.order.passengers[0];
      const maskedId = passenger.idNumber;
      
      expect(maskedId).toMatch(/^\d{4}\*+\d{3}$/);
    });
  });
});
