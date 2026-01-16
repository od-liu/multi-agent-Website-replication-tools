/**
 * Database Initialization
 * Create tables and insert demo data
 */

import { getDb } from './db.js';
import bcrypt from 'bcrypt';

// Create users table
const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    phone TEXT UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT,
    id_type TEXT DEFAULT '1',
    id_number TEXT,
    id_card_last4 TEXT NOT NULL,
    passenger_type TEXT DEFAULT '1',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

// Create verification_codes table
const createVerificationCodesTable = `
  CREATE TABLE IF NOT EXISTS verification_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    phone TEXT,
    code TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    user_data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`;

// Create sessions table
const createSessionsTable = `
  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`;

// Create cities table (for train search)
const createCitiesTable = `
  CREATE TABLE IF NOT EXISTS cities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    city_name TEXT UNIQUE NOT NULL,
    pinyin TEXT,
    short_code TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

// Create stations table
const createStationsTable = `
  CREATE TABLE IF NOT EXISTS stations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    station_name TEXT UNIQUE NOT NULL,
    city_id INTEGER,
    station_code TEXT UNIQUE,
    pinyin TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (city_id) REFERENCES cities(id)
  )
`;

// Create trains table
const createTrainsTable = `
  CREATE TABLE IF NOT EXISTS trains (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    train_number TEXT UNIQUE NOT NULL,
    train_type TEXT NOT NULL,
    departure_station_id INTEGER NOT NULL,
    arrival_station_id INTEGER NOT NULL,
    departure_time TEXT NOT NULL,
    arrival_time TEXT NOT NULL,
    duration TEXT NOT NULL,
    arrival_day INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (departure_station_id) REFERENCES stations(id),
    FOREIGN KEY (arrival_station_id) REFERENCES stations(id)
  )
`;

// Create train_seats table
const createTrainSeatsTable = `
  CREATE TABLE IF NOT EXISTS train_seats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    train_id INTEGER NOT NULL,
    seat_type TEXT NOT NULL,
    total_seats INTEGER NOT NULL,
    available_seats INTEGER NOT NULL,
    price REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (train_id) REFERENCES trains(id)
  )
`;

/**
 * Initialize database tables
 */
export async function initDatabase() {
  try {
    const db = getDb();
    
    // Create tables using exec (wrapped in promise for better error handling)
    await new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run(createUsersTable, (err) => {
          if (err) reject(err);
          else console.log('✓ Users table created or already exists');
        });
        
        db.run(createVerificationCodesTable, (err) => {
          if (err) reject(err);
          else console.log('✓ Verification codes table created or already exists');
        });
        
        db.run(createSessionsTable, (err) => {
          if (err) reject(err);
          else console.log('✓ Sessions table created or already exists');
        });
        
        db.run(createCitiesTable, (err) => {
          if (err) reject(err);
          else console.log('✓ Cities table created or already exists');
        });
        
        db.run(createStationsTable, (err) => {
          if (err) reject(err);
          else console.log('✓ Stations table created or already exists');
        });
        
        db.run(createTrainsTable, (err) => {
          if (err) reject(err);
          else console.log('✓ Trains table created or already exists');
        });
        
        db.run(createTrainSeatsTable, (err) => {
          if (err) reject(err);
          else {
            console.log('✓ Train seats table created or already exists');
            resolve();
          }
        });
      });
    });
    
    return true;
  } catch (err) {
    console.error('Error initializing database:', err.message);
    throw err;
  }
}

/**
 * Insert demo data for testing
 */
export async function insertDemoData() {
  try {
    const db = getDb();
    
    // Check if demo user already exists
    const existingUser = await db.getAsync('SELECT id FROM users WHERE username = ?', 'testuser');
    
    if (existingUser) {
      console.log('✓ Demo user already exists, skipping user insertion');
    } else {
      // Hash password for demo user
      const passwordHash = bcrypt.hashSync('password123', 10);
      const passwordHash2 = bcrypt.hashSync('admin123', 10);
      
      // Insert demo users (use INSERT OR IGNORE to avoid conflicts in parallel tests)
      await db.runAsync(`
        INSERT OR IGNORE INTO users (username, email, phone, password_hash, name, id_type, id_number, id_card_last4, passenger_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, 'testuser', 'test@12306.cn', '13800138000', passwordHash, '张三', '1', '110101199001011234', '1234', '1');
      console.log('✓ Demo user inserted: testuser / password123 / 证件号后4位: 1234');
      
      await db.runAsync(`
        INSERT OR IGNORE INTO users (username, email, phone, password_hash, name, id_type, id_number, id_card_last4, passenger_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, 'admin', 'admin@12306.cn', '13900139000', passwordHash2, '李四', '1', '110101199002025678', '5678', '1');
      console.log('✓ Demo user inserted: admin / admin123 / 证件号后4位: 5678');
    }
    
    // Check if demo cities already exist
    const existingCity = await db.getAsync('SELECT id FROM cities WHERE city_name = ?', '北京');
    
    if (existingCity) {
      console.log('✓ Demo cities already exist, skipping city/train insertion');
      return;
    }
    
    // Insert demo cities
    const cities = [
      ['北京', 'Beijing', 'BJ'],
      ['上海', 'Shanghai', 'SH'],
      ['广州', 'Guangzhou', 'GZ'],
      ['深圳', 'Shenzhen', 'SZ'],
      ['杭州', 'Hangzhou', 'HZ'],
      ['南京', 'Nanjing', 'NJ'],
      ['武汉', 'Wuhan', 'WH'],
      ['成都', 'Chengdu', 'CD'],
      ['重庆', 'Chongqing', 'CQ'],
      ['西安', 'Xian', 'XA'],
      ['天津', 'Tianjin', 'TJ'],
      ['苏州', 'Suzhou', 'SZ'],
      ['郑州', 'Zhengzhou', 'ZZ'],
      ['长沙', 'Changsha', 'CS'],
      ['沈阳', 'Shenyang', 'SY'],
      ['青岛', 'Qingdao', 'QD']
    ];
    
    for (const [name, pinyin, code] of cities) {
      await db.runAsync(`
        INSERT OR IGNORE INTO cities (city_name, pinyin, short_code)
        VALUES (?, ?, ?)
      `, name, pinyin, code);
    }
    console.log(`✓ Inserted ${cities.length} demo cities`);
    
    // Insert demo stations
    const stations = [
      ['北京南', 1, 'VNP'],
      ['北京', 1, 'BJP'],
      ['北京西', 1, 'BXP'],
      ['北京北', 1, 'VAP'],
      ['上海虹桥', 2, 'AOH'],
      ['上海', 2, 'SHH'],
      ['上海南', 2, 'SNH'],
      ['广州南', 3, 'IZQ'],
      ['深圳北', 4, 'IOQ'],
      ['杭州东', 5, 'HGH'],
      ['南京南', 6, 'NKH'],
      ['武汉', 7, 'WHN'],
      ['成都东', 8, 'ICW'],
      ['重庆北', 9, 'CQW'],
      ['西安北', 10, 'EAY'],
      ['天津西', 11, 'TXP']
    ];
    
    for (const [name, cityId, code] of stations) {
      await db.runAsync(`
        INSERT OR IGNORE INTO stations (station_name, city_id, station_code)
        VALUES (?, ?, ?)
      `, name, cityId, code);
    }
    console.log(`✓ Inserted ${stations.length} demo stations`);
    
    // Insert demo trains (北京 -> 上海 line)
    const trains = [
      ['G12', 'GC', 1, 5, '14:10', '18:41', '04:31', 0],
      ['D9', 'D', 1, 7, '19:36', '12:24', '16:48', 1],
      ['D8', 'D', 2, 6, '20:10', '08:10', '12:00', 1],
      ['G1', 'GC', 1, 5, '08:00', '12:30', '04:30', 0],
      ['G3', 'GC', 1, 5, '09:00', '13:28', '04:28', 0],
      ['G5', 'GC', 1, 5, '10:00', '14:35', '04:35', 0]
    ];
    
    for (const [number, type, depId, arrId, depTime, arrTime, duration, arrDay] of trains) {
      const result = await db.runAsync(`
        INSERT OR IGNORE INTO trains (train_number, train_type, departure_station_id, arrival_station_id, departure_time, arrival_time, duration, arrival_day)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, number, type, depId, arrId, depTime, arrTime, duration, arrDay);
    }
    console.log(`✓ Inserted ${trains.length} demo trains`);
    
    // Insert demo train seats
    const seatTypes = [
      ['商务座', 20, 18, 1748.5],
      ['一等座', 48, 42, 933.0],
      ['二等座', 120, 98, 553.5],
      ['软卧', 0, 0, null],
      ['硬卧', 0, 0, null],
      ['硬座', 0, 0, null],
      ['无座', 30, 15, 553.5]
    ];
    
    // Get all train IDs
    const allTrains = await db.allAsync('SELECT id, train_number FROM trains');
    
    for (const train of allTrains) {
      for (const [seatType, total, available, price] of seatTypes) {
        // For G trains, only add 商务座, 一等座, 二等座, 无座
        if (train.train_number.startsWith('G') && ['软卧', '硬卧', '硬座'].includes(seatType)) {
          continue;
        }
        
        // For D trains, add all seat types but with different availability
        let actualTotal = total;
        let actualAvailable = available;
        if (train.train_number.startsWith('D')) {
          if (seatType === '商务座') {
            actualTotal = 0;
            actualAvailable = 0;
          } else if (seatType === '软卧' || seatType === '硬卧' || seatType === '硬座') {
            actualTotal = 60;
            actualAvailable = 35;
          }
        }
        
        await db.runAsync(`
          INSERT OR IGNORE INTO train_seats (train_id, seat_type, total_seats, available_seats, price)
          VALUES (?, ?, ?, ?, ?)
        `, train.id, seatType, actualTotal, actualAvailable, price);
      }
    }
    console.log(`✓ Inserted demo train seats for ${allTrains.length} trains`);
    
  } catch (err) {
    // Ignore UNIQUE constraint errors (happens in parallel tests)
    if (err.code === 'SQLITE_CONSTRAINT' && err.message.includes('UNIQUE')) {
      console.log('✓ Demo data already exists (parallel test detected)');
      return;
    }
    console.error('Error inserting demo data:', err.message);
    throw err;
  }
}

/**
 * Clear all data from tables (for testing)
 */
export async function clearDatabase() {
  try {
    const db = getDb();
    await db.runAsync('DELETE FROM train_seats');
    await db.runAsync('DELETE FROM trains');
    await db.runAsync('DELETE FROM stations');
    await db.runAsync('DELETE FROM cities');
    await db.runAsync('DELETE FROM sessions');
    await db.runAsync('DELETE FROM verification_codes');
    await db.runAsync('DELETE FROM users');
    console.log('✓ Database cleared');
  } catch (err) {
    console.error('Error clearing database:', err.message);
    throw err;
  }
}

// Run initialization if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    try {
      console.log('=== Initializing Database ===');
      await initDatabase();
      await insertDemoData();
      console.log('=== Database initialization completed ===');
      process.exit(0);
    } catch (err) {
      console.error('Database initialization failed:', err);
      process.exit(1);
    }
  })();
}

