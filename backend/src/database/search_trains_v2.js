/**
 * 车次搜索 V2 - 使用新的区间座位管理系统
 */

import { getDb } from './db.js';
import { countAvailableSeats } from './seat_management.js';

/**
 * 搜索车次（使用区间座位管理）
 * @param {string} fromCity - 出发城市
 * @param {string} toCity - 到达城市
 * @param {string} departureDate - 出发日期
 * @param {boolean} isStudent - 是否学生票
 * @param {boolean} isHighSpeed - 是否只查高铁/动车
 * @returns {Promise<Object>} 搜索结果
 */
export async function searchTrainsV2(fromCity, toCity, departureDate, isStudent = false, isHighSpeed = false) {
  const db = getDb();
  
  console.log(`🔍 [车次搜索V2] ${fromCity} → ${toCity}, 日期: ${departureDate}`);
  
  try {
    // 1. 获取当前时间（过滤已发车车次）
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
    const isToday = departureDate === currentDate;
    
    // 2. 🔧 修复：使用 train_stops 表查询区间票（支持途经站）
    let query = `
      SELECT DISTINCT
        t.id as train_id,
        t.train_number,
        t.train_type,
        s1.station_name as departure_station,
        s2.station_name as arrival_station,
        c1.city_name as departure_city,
        c2.city_name as arrival_city,
        ts1.departure_time as departure_time,
        ts2.arrival_time as arrival_time,
        t.duration,
        t.arrival_day,
        ts1.stop_sequence as from_seq,
        ts2.stop_sequence as to_seq
      FROM trains t
      -- 出发站
      JOIN train_stops ts1 ON t.id = ts1.train_id
      JOIN stations s1 ON ts1.station_id = s1.id
      JOIN cities c1 ON s1.city_id = c1.id
      -- 到达站
      JOIN train_stops ts2 ON t.id = ts2.train_id
      JOIN stations s2 ON ts2.station_id = s2.id
      JOIN cities c2 ON s2.city_id = c2.id
      WHERE c1.city_name = ? AND c2.city_name = ? 
        AND t.is_active = 1
        AND ts1.stop_sequence < ts2.stop_sequence
    `;
    
    const params = [fromCity, toCity];
    
    if (isToday) {
      query += ` AND ts1.departure_time > ?`;
      params.push(currentTime);
    }
    
    if (isHighSpeed) {
      query += ` AND (t.train_type = 'GC' OR t.train_type = 'D')`;
    }
    
    query += ` ORDER BY ts1.departure_time`;
    
    const trains = await db.allAsync(query, ...params);
    
    if (!trains || trains.length === 0) {
      console.log(`📭 [车次搜索V2] 未找到符合条件的车次`);
      return { success: true, trains: [] };
    }
    
    console.log(`📊 [车次搜索V2] 找到 ${trains.length} 个车次`);
    
    // 3. 获取每个车次的班次和余票信息
    const trainsWithSeats = [];
    
    for (const train of trains) {
      // 获取班次
      const schedule = await db.getAsync(`
        SELECT id FROM train_schedules
        WHERE train_id = ? AND departure_date = ?
      `, train.train_id, departureDate);
      
      if (!schedule) {
        console.warn(`⚠️  车次 ${train.train_number} 在 ${departureDate} 没有班次`);
        continue;
      }
      
      // 🔧 优化：直接使用查询结果中的站点序号（不再需要额外查询）
      const fromStopSeq = train.from_seq;
      const toStopSeq = train.to_seq;
      
      // 🔧 根据车次类型查询不同的席别
      const trainType = train.train_number.charAt(0);
      const isDTrainType = trainType === 'D';
      
      let seatsObj = {};
      
      if (isDTrainType) {
        // D车次：查询软卧、硬卧、二等座
        const softSleeperCount = await countAvailableSeats(
          schedule.id,
          fromStopSeq,
          toStopSeq,
          '软卧'
        );
        
        const hardSleeperCount = await countAvailableSeats(
          schedule.id,
          fromStopSeq,
          toStopSeq,
          '硬卧'
        );
        
        const secondClassCount = await countAvailableSeats(
          schedule.id,
          fromStopSeq,
          toStopSeq,
          '二等座'
        );
        
        // 🔧 根据区间计算价格（累加所有经过站点的分段价格）
        const prices = await db.allAsync(`
          SELECT seat_type, SUM(price) as total_price
          FROM train_segment_prices
          WHERE train_id = ? 
            AND from_stop_seq >= ? 
            AND to_stop_seq <= ?
          GROUP BY seat_type
        `, train.train_id, fromStopSeq, toStopSeq);
        
        const priceMap = {};
        prices.forEach(p => {
          priceMap[p.seat_type] = p.total_price;
        });
        
        seatsObj = {
          '软卧': softSleeperCount === 0 ? '无' : (softSleeperCount >= 20 ? '有' : softSleeperCount.toString()),
          '硬卧': hardSleeperCount === 0 ? '无' : (hardSleeperCount >= 20 ? '有' : hardSleeperCount.toString()),
          '二等座': secondClassCount === 0 ? '无' : (secondClassCount >= 20 ? '有' : secondClassCount.toString()),
          '软卧_price': priceMap['软卧'] || 800,
          '硬卧_price': priceMap['硬卧'] || 500,
          '二等座_price': priceMap['二等座'] || 300
        };
      } else {
        // G/C车次：查询商务座、一等座、二等座
        const secondClassCount = await countAvailableSeats(
          schedule.id,
          fromStopSeq,
          toStopSeq,
          '二等座'
        );
        
        const firstClassCount = await countAvailableSeats(
          schedule.id,
          fromStopSeq,
          toStopSeq,
          '一等座'
        );
        
        const businessClassCount = await countAvailableSeats(
          schedule.id,
          fromStopSeq,
          toStopSeq,
          '商务座'
        );
        
        // 🔧 根据区间计算价格（累加所有经过站点的分段价格）
        const prices = await db.allAsync(`
          SELECT seat_type, SUM(price) as total_price
          FROM train_segment_prices
          WHERE train_id = ? 
            AND from_stop_seq >= ? 
            AND to_stop_seq <= ?
          GROUP BY seat_type
        `, train.train_id, fromStopSeq, toStopSeq);
        
        const priceMap = {};
        prices.forEach(p => {
          priceMap[p.seat_type] = p.total_price;
        });
        
        seatsObj = {
          '二等座': secondClassCount === 0 ? '无' : (secondClassCount >= 20 ? '有' : secondClassCount.toString()),
          '一等座': firstClassCount === 0 ? '无' : (firstClassCount >= 20 ? '有' : firstClassCount.toString()),
          '商务座': businessClassCount === 0 ? '无' : (businessClassCount >= 20 ? '有' : businessClassCount.toString()),
          '二等座_price': priceMap['二等座'] || 662,
          '一等座_price': priceMap['一等座'] || 1060,
          '商务座_price': priceMap['商务座'] || 2318
        };
      }
      
      trainsWithSeats.push({
        trainNumber: train.train_number,
        trainType: train.train_type,
        departureStation: train.departure_station,
        arrivalStation: train.arrival_station,
        departureCity: train.departure_city,
        arrivalCity: train.arrival_city,
        departureTime: train.departure_time,
        arrivalTime: train.arrival_time,
        duration: train.duration,
        arrivalDay: train.arrival_day === 0 ? '当日到达' : '次日到达',
        seats: seatsObj,
        supportsStudent: true
      });
    }
    
    console.log(`✅ [车次搜索V2] 返回 ${trainsWithSeats.length} 个车次（含余票信息）`);
    
    return {
      success: true,
      trains: trainsWithSeats
    };
    
  } catch (error) {
    console.error('❌ [车次搜索V2] 失败:', error);
    return {
      success: false,
      message: '查询失败，请稍后再试'
    };
  }
}
