/**
 * 从 车次信息.json 导入车次数据
 */

import { readFileSync } from 'fs';
import { getDb } from './db.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 座位布局配置
 */
const SEAT_LAYOUTS = {
  '商务座': {
    seatsPerRow: 3,
    columns: ['A', 'C', 'F'],  // 2+1布局
    defaultRowsPerCar: 10
  },
  '一等座': {
    seatsPerRow: 4,
    columns: ['A', 'C', 'D', 'F'],  // 2+2布局
    defaultRowsPerCar: 16
  },
  '二等座': {
    seatsPerRow: 5,
    columns: ['A', 'B', 'C', 'D', 'F'],  // 2+3布局
    defaultRowsPerCar: 20
  }
};

/**
 * 导入车次数据
 */
export async function importTrainData(jsonFilePath) {
  const db = getDb();
  
  console.log('📥 开始导入车次数据...');
  console.log(`📄 数据文件: ${jsonFilePath}`);
  
  try {
    // 读取JSON文件
    const jsonData = readFileSync(jsonFilePath, 'utf-8');
    const trains = JSON.parse(jsonData);
    
    console.log(`📊 共有 ${trains.length} 个车次需要导入`);
    console.log('');
    
    let successCount = 0;
    let skipCount = 0;
    
    for (const trainData of trains) {
      try {
        await importSingleTrain(db, trainData);
        successCount++;
        console.log(`✅ [${successCount}/${trains.length}] ${trainData.train_no} 导入成功`);
      } catch (error) {
        if (error.message.includes('UNIQUE constraint')) {
          skipCount++;
          console.log(`⏭️  [${successCount + skipCount}/${trains.length}] ${trainData.train_no} 已存在，跳过`);
        } else {
          console.error(`❌ ${trainData.train_no} 导入失败:`, error.message);
          throw error;
        }
      }
    }
    
    console.log('');
    console.log('🎉 车次数据导入完成！');
    console.log(`  ✅ 成功导入: ${successCount} 个`);
    console.log(`  ⏭️  跳过已存在: ${skipCount} 个`);
    console.log('');
    
    return { success: true, imported: successCount, skipped: skipCount };
    
  } catch (error) {
    console.error('❌ 导入失败:', error);
    throw error;
  }
}

/**
 * 导入单个车次
 */
async function importSingleTrain(db, trainData) {
  // 1. 确保起点和终点站点存在
  const originStation = await ensureStation(db, trainData.route.origin);
  const destStation = await ensureStation(db, trainData.route.destination);
  
  // 2. 插入车次基本信息
  const trainType = mapTrainType(trainData.train_type);
  const result = await db.runAsync(`
    INSERT INTO trains (
      train_number, train_type, 
      departure_station_id, arrival_station_id,
      departure_time, arrival_time,
      duration, arrival_day, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
  `, 
    trainData.train_no,
    trainType,
    originStation.id,
    destStation.id,
    trainData.route.departure_time,
    trainData.route.arrival_time,
    formatDuration(trainData.route.planned_duration_min),
    trainData.route.arrival_day || 0
  );
  
  const trainId = result.lastID;
  
  // 3. 插入停靠站信息
  await importTrainStops(db, trainId, trainData.stops);
  
  // 4. 插入车厢配置
  await importTrainCars(db, trainId, trainData.cars);
  
  // 5. 插入票价信息（分段票价，如果有）
  if (trainData.fares && trainData.fares.segments) {
    await importSegmentPrices(db, trainId, trainData.fares.segments);
  }
  
  return trainId;
}

/**
 * 确保站点存在
 */
async function ensureStation(db, stationName) {
  let station = await db.getAsync(
    'SELECT id FROM stations WHERE station_name = ?',
    stationName
  );
  
  if (!station) {
    // 提取城市名（去掉站点后缀：南/西/东/北）
    const cityName = stationName.replace(/(南|西|东|北|站)$/g, '');
    
    // 确保城市存在
    let city = await db.getAsync(
      'SELECT id FROM cities WHERE city_name = ?',
      cityName
    );
    
    if (!city) {
      const cityResult = await db.runAsync(
        'INSERT INTO cities (city_name) VALUES (?)',
        cityName
      );
      city = { id: cityResult.lastID };
    }
    
    // 插入站点
    const stationResult = await db.runAsync(
      'INSERT INTO stations (station_name, city_id) VALUES (?, ?)',
      stationName, city.id
    );
    
    station = { id: stationResult.lastID };
  }
  
  return station;
}

/**
 * 导入停靠站信息
 */
async function importTrainStops(db, trainId, stops) {
  for (const stop of stops) {
    const station = await ensureStation(db, stop.station);
    
    await db.runAsync(`
      INSERT INTO train_stops (
        train_id, station_id, stop_sequence,
        arrival_time, departure_time, stop_duration_min
      ) VALUES (?, ?, ?, ?, ?, ?)
    `,
      trainId,
      station.id,
      stop.seq,
      stop.arrive,
      stop.depart,
      stop.stop_min || 0
    );
  }
}

/**
 * 导入车厢配置
 */
async function importTrainCars(db, trainId, cars) {
  // 如果 cars 不存在或不是数组，使用默认配置
  if (!Array.isArray(cars) || cars.length === 0) {
    console.warn(`⚠️  车次 ${trainId} 缺少车厢配置，使用默认配置`);
    cars = [
      { "car_no": 1, "type": "商务座" },
      { "car_no": 2, "type": "一等座" },
      { "car_no": 3, "type": "一等座" },
      { "car_no": 4, "type": "二等座" },
      { "car_no": 5, "type": "二等座" },
      { "car_no": 6, "type": "二等座" },
      { "car_no": 7, "type": "二等座" },
      { "car_no": 8, "type": "二等座" }
    ];
  }
  
  for (const car of cars) {
    // 映射车厢类型到标准类型
    const carType = normalizeCarType(car.type);
    
    // 计算该车厢的座位数
    const layout = SEAT_LAYOUTS[carType];
    let totalSeats = 0;
    let seatLayout = '';
    
    if (layout) {
      totalSeats = layout.seatsPerRow * layout.defaultRowsPerCar;
      seatLayout = layout.columns.join('');
    } else if (carType === '餐车' || carType === '其他') {
      totalSeats = 0;
      seatLayout = 'N/A';
    } else {
      // 卧铺车厢
      totalSeats = carType === '软卧' ? 36 : 60; // 软卧36个铺位，硬卧60个铺位
      seatLayout = carType;
    }
    
    await db.runAsync(`
      INSERT INTO train_cars (
        train_id, car_number, car_type, total_seats, seat_layout
      ) VALUES (?, ?, ?, ?, ?)
    `,
      trainId,
      car.car_no,
      carType,
      totalSeats,
      seatLayout
    );
  }
}

/**
 * 规范化车厢类型名称
 */
function normalizeCarType(carType) {
  const typeMap = {
    '商务座': '商务座',
    '一等座': '一等座',
    '二等座': '二等座',
    '软卧': '软卧',
    '硬卧': '硬卧',
    '硬座': '硬座',
    '餐车': '餐车'
  };
  
  return typeMap[carType] || '其他';
}

/**
 * 导入分段票价
 */
async function importSegmentPrices(db, trainId, segments) {
  for (const segment of segments) {
    // 🔧 修正：segments 中使用的是站点名（from/to），需要转换为序号
    // 获取起始站序号
    const fromStop = await db.getAsync(`
      SELECT ts.stop_sequence
      FROM train_stops ts
      JOIN stations s ON ts.station_id = s.id
      WHERE ts.train_id = ? AND s.station_name = ?
    `, trainId, segment.from);
    
    const toStop = await db.getAsync(`
      SELECT ts.stop_sequence
      FROM train_stops ts
      JOIN stations s ON ts.station_id = s.id
      WHERE ts.train_id = ? AND s.station_name = ?
    `, trainId, segment.to);
    
    if (!fromStop || !toStop) {
      console.warn(`⚠️  分段票价警告: 站点 ${segment.from} → ${segment.to} 未找到序号，跳过`);
      continue;
    }
    
    const fromSeq = fromStop.stop_sequence;
    const toSeq = toStop.stop_sequence;
    
    if (segment.second_class) {
      await db.runAsync(`
        INSERT INTO train_segment_prices (
          train_id, from_stop_seq, to_stop_seq, seat_type, price, distance_km
        ) VALUES (?, ?, ?, '二等座', ?, ?)
      `, trainId, fromSeq, toSeq, segment.second_class, segment.distance_km);
    }
    
    if (segment.first_class) {
      await db.runAsync(`
        INSERT INTO train_segment_prices (
          train_id, from_stop_seq, to_stop_seq, seat_type, price, distance_km
        ) VALUES (?, ?, ?, '一等座', ?, ?)
      `, trainId, fromSeq, toSeq, segment.first_class, segment.distance_km);
    }
    
    if (segment.business) {
      await db.runAsync(`
        INSERT INTO train_segment_prices (
          train_id, from_stop_seq, to_stop_seq, seat_type, price, distance_km
        ) VALUES (?, ?, ?, '商务座', ?, ?)
      `, trainId, fromSeq, toSeq, segment.business, segment.distance_km);
    }
  }
}

/**
 * 映射车次类型
 */
function mapTrainType(trainType) {
  const typeMap = {
    '高速动车组': 'GC',
    '动车组': 'D',
    '直达特快': 'Z',
    '特快': 'T',
    '快速': 'K'
  };
  
  return typeMap[trainType] || 'GC';
}

/**
 * 格式化时长
 */
function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}小时${mins}分`;
}

// 如果直接执行此文件，则运行导入
if (import.meta.url === `file://${process.argv[1]}`) {
  // 注意：文件名前面有空格
  const trainDataPath = process.argv[2] || join(dirname(dirname(dirname(__dirname))), ' 车次信息.json');
  
  importTrainData(trainDataPath)
    .then(() => {
      console.log('✅ 导入脚本执行成功');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 导入脚本执行失败:', error);
      process.exit(1);
    });
}
