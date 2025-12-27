/**
 * Backend 测试环境设置
 * 配置测试数据库连接
 */

import { beforeAll, afterAll, beforeEach } from 'vitest';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 设置环境变量指向测试数据库
process.env.DB_PATH = path.join(__dirname, '../test_database.db');

beforeAll(() => {
  console.log('🧪 Test environment initialized');
  console.log('📁 Using test database:', process.env.DB_PATH);
});

afterAll(() => {
  console.log('✅ All tests completed');
});

