/**
 * Express服务器入口文件
 * 12306登录系统后端服务
 */

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import apiRoutes from './routes/api.js';
import { initializeDatabase } from './database/init_db.js';

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件配置
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 注册API路由
app.use('/api', apiRoutes);

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '12306 Login Backend is running' });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log('📦 Initializing database...');
  initializeDatabase();
});

export default app;
