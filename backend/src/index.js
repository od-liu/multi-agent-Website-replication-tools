/**
 * Backend Server Entry Point
 * Express.js server for 12306 login API
 */

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import apiRoutes from './routes/api.js';
import { initDatabase, insertDemoData } from './database/init_db.js';
import { cleanupOldOrders } from './database/operations.js';
import { migrateSeatSystem } from './database/migrate_seat_system.js';
import { cleanupExpiredSeatLocks } from './database/seat_management.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// CORS配置 - 允许前端跨域访问
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静态文件服务 - 提供前端 public 目录的访问
app.use('/images', express.static(join(__dirname, '../../frontend/public/images')));
app.use('/fonts', express.static(join(__dirname, '../../frontend/public/fonts')));

// Routes
app.use(apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// 🆕 定时清理任务：每天凌晨3点执行一次清理30天前的订单
function setupCleanupScheduler() {
  const runCleanup = async () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    // 每天凌晨3点执行清理
    if (hour === 3 && minute === 0) {
      console.log(`\n🧹 [定时任务] ${now.toISOString()} 开始执行订单清理任务`);
      const result = await cleanupOldOrders();
      
      if (result.success) {
        console.log(`✅ [定时任务] ${result.message}`);
      } else {
        console.error(`❌ [定时任务] ${result.message}`);
      }
    }
  };
  
  // 每分钟检查一次是否到了清理时间
  setInterval(runCleanup, 60 * 1000); // 60秒检查一次
  
  console.log('⏰ [定时任务] 订单清理任务已启动（每天凌晨3点执行）');
}

// 🆕 座位锁定清理任务：每分钟执行一次
function setupSeatLockCleanup() {
  const runCleanup = async () => {
    try {
      await cleanupExpiredSeatLocks();
    } catch (error) {
      console.error('❌ [座位清理] 执行失败:', error);
    }
  };
  
  // 每分钟执行一次
  setInterval(runCleanup, 60 * 1000);
  
  console.log('⏰ [定时任务] 座位锁定清理任务已启动（每分钟执行）');
}

// Initialize database and start server
(async () => {
  try {
    await initDatabase();
    await insertDemoData();
    console.log('✅ Database initialized successfully');
    
    // 🆕 运行座位管理系统迁移
    try {
      await migrateSeatSystem();
      console.log('✅ Seat management system migration completed');
    } catch (error) {
      console.error('⚠️  Seat system migration failed:', error.message);
      // 不中断服务器启动
    }
    
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    
    // 🆕 启动定时清理任务
    setupCleanupScheduler();
    setupSeatLockCleanup();
  });
})();

export default app;

