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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// CORS配置 - 允许前端跨域访问
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
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

// Initialize database and start server
async function startServer() {
  try {
    console.log('🔧 正在初始化数据库...');
    await initDatabase();
    console.log('✅ 数据库表创建完成');
    
    console.log('📦 正在插入演示数据...');
    await insertDemoData();
    console.log('✅ 演示数据插入完成');
    
    app.listen(PORT, () => {
      console.log(`✅ 服务器已启动，监听端口 ${PORT}`);
      console.log(`📍 健康检查: http://localhost:${PORT}/health`);
      console.log(`📊 数据库路径: ${process.cwd()}/database.db`);
      console.log(`🆕 已启用自动添加用户本人为常用乘客功能`);
    });
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    console.error('错误详情:', error.stack);
    process.exit(1);
  }
}

startServer();

export default app;

