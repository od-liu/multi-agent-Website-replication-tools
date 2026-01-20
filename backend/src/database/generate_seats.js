/**
 * 为班次生成具体座位
 */

import { getDb } from './db.js';

/**
 * 座位布局配置
 */
const SEAT_LAYOUTS = {
  '商务座': {
    seatsPerRow: 3,
    columns: ['A', 'C', 'F'],
    defaultRowsPerCar: 10
  },
  '一等座': {
    seatsPerRow: 4,
    columns: ['A', 'C', 'D', 'F'],
    defaultRowsPerCar: 16
  },
  '二等座': {
    seatsPerRow: 5,
    columns: ['A', 'B', 'C', 'D', 'F'],
    defaultRowsPerCar: 20
  },
  '软卧': {
    seatsPerRow: 4,  // 每包间4个铺位
    columns: ['A', 'B', 'C', 'D'],  // 使用字母代替中文
    defaultRowsPerCar: 9,  // 9个包间 = 36个铺位
    seatFormat: 'berth'  // 特殊格式
  },
  '硬卧': {
    seatsPerRow: 6,  // 每节3个铺位 × 2侧 = 6个铺位
    columns: ['A', 'B', 'C', 'D', 'E', 'F'],  // 使用字母代替中文
    defaultRowsPerCar: 10,  // 10节 = 60个铺位
    seatFormat: 'berth'
  },
  '硬座': {
    seatsPerRow: 5,
    columns: ['A', 'B', 'C', 'D', 'F'],
    defaultRowsPerCar: 20
  }
};

/**
 * 为指定班次生成所有座位
 */
export async function generateSeatsForSchedule(scheduleId) {
  const db = getDb();
  
  console.log(`🎫 开始为班次 ${scheduleId} 生成座位...`);
  
  try {
    // 1. 获取班次信息
    const schedule = await db.getAsync(`
      SELECT ts.*, t.train_number, t.train_type
      FROM train_schedules ts
      JOIN trains t ON ts.train_id = t.id
      WHERE ts.id = ?
    `, scheduleId);
    
    if (!schedule) {
      throw new Error(`班次 ${scheduleId} 不存在`);
    }
    
    console.log(`📅 班次: ${schedule.train_number} ${schedule.departure_date}`);
    
    // 2. 获取车厢配置
    const trainCars = await db.allAsync(`
      SELECT * FROM train_cars
      WHERE train_id = ?
      ORDER BY car_number
    `, schedule.train_id);
    
    if (trainCars.length === 0) {
      throw new Error(`车次 ${schedule.train_number} 没有车厢配置`);
    }
    
    console.log(`🚃 车厢数量: ${trainCars.length}`);
    
    // 3. 为每节车厢生成座位
    let totalSeats = 0;
    
    for (const car of trainCars) {
      if (car.car_type === '餐车') {
        console.log(`  ⏭️  ${car.car_number}号车厢 (餐车) - 跳过`);
        continue;
      }
      
      const seats = generateCarSeats(car);
      const price = await getPrice(db, schedule.train_id, car.car_type);
      
      for (const seat of seats) {
        await db.runAsync(`
          INSERT INTO schedule_seats (
            schedule_id, car_number, seat_row, seat_column,
            seat_number, seat_type, price, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, 'available')
        `,
          scheduleId,
          car.car_number,
          seat.row,
          seat.column,
          seat.number,
          car.car_type,
          price
        );
      }
      
      totalSeats += seats.length;
      console.log(`  ✅ ${car.car_number}号车厢 (${car.car_type}) - ${seats.length}个座位`);
    }
    
    console.log(`🎉 座位生成完成！共 ${totalSeats} 个座位`);
    console.log('');
    
    return { success: true, totalSeats };
    
  } catch (error) {
    console.error('❌ 座位生成失败:', error);
    throw error;
  }
}

/**
 * 为单节车厢生成座位
 */
function generateCarSeats(car) {
  const layout = SEAT_LAYOUTS[car.car_type];
  
  if (!layout) {
    console.warn(`⚠️  未知车厢类型: ${car.car_type}`);
    return [];
  }
  
  const seats = [];
  const rows = Math.ceil(car.total_seats / layout.seatsPerRow);
  
  // 卧铺车厢使用特殊编号（铺位号）
  if (layout.seatFormat === 'berth') {
    let berthNumber = 1;
    for (let row = 1; row <= rows; row++) {
      for (let i = 0; i < layout.columns.length; i++) {
        const column = layout.columns[i];
        const berthType = i % 2 === 0 ? '上' : '下'; // A/C/E=上铺, B/D/F=下铺
        
        seats.push({
          row,
          column,
          number: `${berthNumber.toString().padStart(3, '0')}${column}`  // 001A, 001B, 002A...
        });
        berthNumber++;
        
        if (seats.length >= car.total_seats) {
          return seats;
        }
      }
    }
  } else {
    // 座位车厢使用标准编号
    for (let row = 1; row <= rows; row++) {
      for (const column of layout.columns) {
        seats.push({
          row,
          column,
          number: `${row.toString().padStart(2, '0')}${column}`
        });
        
        if (seats.length >= car.total_seats) {
          return seats;
        }
      }
    }
  }
  
  return seats;
}

/**
 * 获取座位类型的价格
 */
async function getPrice(db, trainId, seatType) {
  // 从 train_seats 表获取价格（旧表，向后兼容）
  const priceInfo = await db.getAsync(`
    SELECT price FROM train_seats
    WHERE train_id = ? AND seat_type = ?
  `, trainId, seatType);
  
  if (priceInfo && priceInfo.price) {
    return priceInfo.price;
  }
  
  // 默认价格
  const defaultPrices = {
    '商务座': 2318,
    '一等座': 1060,
    '二等座': 662,
    '软卧': 800,
    '硬卧': 500,
    '硬座': 300
  };
  
  return defaultPrices[seatType] || 0;
}

/**
 * 批量生成座位（为多个班次生成）
 */
export async function generateSeatsForAllSchedules() {
  const db = getDb();
  
  console.log('🔄 开始为所有班次生成座位...');
  console.log('');
  
  try {
    // 获取所有班次
    const schedules = await db.allAsync(`
      SELECT ts.id, ts.departure_date, t.train_number
      FROM train_schedules ts
      JOIN trains t ON ts.train_id = t.id
      ORDER BY ts.departure_date, t.train_number
    `);
    
    console.log(`📊 共有 ${schedules.length} 个班次`);
    console.log('');
    
    let successCount = 0;
    let skipCount = 0;
    
    for (const schedule of schedules) {
      try {
        // 检查是否已生成座位
        const existingSeats = await db.getAsync(`
          SELECT COUNT(*) as count
          FROM schedule_seats
          WHERE schedule_id = ?
        `, schedule.id);
        
        if (existingSeats.count > 0) {
          skipCount++;
          console.log(`⏭️  [${successCount + skipCount}/${schedules.length}] ${schedule.train_number} ${schedule.departure_date} - 已存在 ${existingSeats.count} 个座位，跳过`);
          continue;
        }
        
        await generateSeatsForSchedule(schedule.id);
        successCount++;
        
      } catch (error) {
        console.error(`❌ ${schedule.train_number} ${schedule.departure_date} 生成失败:`, error.message);
      }
    }
    
    console.log('');
    console.log('🎉 批量座位生成完成！');
    console.log(`  ✅ 成功生成: ${successCount} 个班次`);
    console.log(`  ⏭️  跳过已存在: ${skipCount} 个班次`);
    console.log('');
    
    return { success: true, generated: successCount, skipped: skipCount };
    
  } catch (error) {
    console.error('❌ 批量生成失败:', error);
    throw error;
  }
}

/**
 * 为未来N天的所有车次生成班次和座位
 */
export async function generateSchedulesAndSeats(days = 30) {
  const db = getDb();
  
  console.log(`📅 为未来 ${days} 天生成班次和座位...`);
  console.log('');
  
  try {
    // 获取所有车次
    const trains = await db.allAsync('SELECT * FROM trains WHERE is_active = 1');
    
    console.log(`🚄 活跃车次: ${trains.length} 个`);
    console.log('');
    
    const today = new Date();
    let totalSchedules = 0;
    let totalSeats = 0;
    
    for (let day = 0; day < days; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() + day);
      const dateStr = date.toISOString().split('T')[0];
      
      console.log(`📆 ${dateStr} (第 ${day + 1}/${days} 天)`);
      
      for (const train of trains) {
        try {
          // 检查班次是否已存在
          let schedule = await db.getAsync(`
            SELECT id FROM train_schedules
            WHERE train_id = ? AND departure_date = ?
          `, train.id, dateStr);
          
          if (!schedule) {
            // 创建班次
            const departureDateTime = `${dateStr}T${train.departure_time}:00`;
            const arrivalDateTime = `${dateStr}T${train.arrival_time}:00`;
            
            const result = await db.runAsync(`
              INSERT INTO train_schedules (
                train_id, departure_date, departure_datetime, arrival_datetime, status
              ) VALUES (?, ?, ?, ?, 'scheduled')
            `, train.id, dateStr, departureDateTime, arrivalDateTime);
            
            schedule = { id: result.lastID };
            totalSchedules++;
          }
          
          // 生成座位
          const seatResult = await generateSeatsForSchedule(schedule.id);
          totalSeats += seatResult.totalSeats;
          
        } catch (error) {
          if (!error.message.includes('UNIQUE constraint')) {
            console.error(`  ❌ ${train.train_number} 失败:`, error.message);
          }
        }
      }
      
      console.log('');
    }
    
    console.log('🎉 完成！');
    console.log(`  📅 生成班次: ${totalSchedules} 个`);
    console.log(`  🎫 生成座位: ${totalSeats} 个`);
    console.log('');
    
    return { success: true, schedules: totalSchedules, seats: totalSeats };
    
  } catch (error) {
    console.error('❌ 生成失败:', error);
    throw error;
  }
}

// 如果直接执行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (command === 'schedule') {
    const scheduleId = parseInt(args[1]);
    if (!scheduleId) {
      console.error('❌ 请提供班次ID: node generate_seats.js schedule <scheduleId>');
      process.exit(1);
    }
    
    generateSeatsForSchedule(scheduleId)
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
      
  } else if (command === 'all') {
    generateSeatsForAllSchedules()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
      
  } else if (command === 'future') {
    const days = parseInt(args[1]) || 30;
    generateSchedulesAndSeats(days)
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
      
  } else {
    console.log('用法:');
    console.log('  node generate_seats.js schedule <scheduleId>  - 为指定班次生成座位');
    console.log('  node generate_seats.js all                     - 为所有现有班次生成座位');
    console.log('  node generate_seats.js future [days]           - 生成未来N天的班次和座位（默认30天）');
    process.exit(1);
  }
}
