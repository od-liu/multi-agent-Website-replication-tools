/**
 * 完整的数据库初始化脚本
 * 用于第一次启动项目或重置数据库
 * 
 * 使用方法：
 *   node src/database/setup_database.js [days]
 * 
 * 参数：
 *   days - 生成未来N天的班次和座位（默认30天）
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { initDatabase, insertDemoData } from './init_db.js';
import { migrateSeatSystem } from './migrate_seat_system.js';
import { importTrainData } from './import_train_data.js';
import { generateSchedulesAndSeats } from './generate_seats.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 完整的数据库设置流程
 */
async function setupDatabase(days = 30) {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🚀 开始初始化 12306 数据库系统');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  
  try {
    // ========== 第1步：初始化基础表结构 ==========
    console.log('📋 [1/5] 初始化基础表结构...');
    await initDatabase();
    console.log('✅ 基础表结构创建成功');
    console.log('');
    
    // ========== 第2步：插入演示数据 ==========
    console.log('👤 [2/5] 插入演示用户数据...');
    await insertDemoData();
    console.log('✅ 演示数据插入成功');
    console.log('');
    
    // ========== 第3步：迁移座位管理系统 ==========
    console.log('🔄 [3/5] 迁移座位管理系统...');
    await migrateSeatSystem();
    console.log('✅ 座位管理系统迁移成功');
    console.log('');
    
    // ========== 第4步：导入车次数据 ==========
    console.log('🚄 [4/5] 导入车次数据...');
    const trainDataPath = join(__dirname, '../../../车次信息.json');
    
    if (!existsSync(trainDataPath)) {
      console.warn('⚠️  警告：车次信息.json 文件不存在，跳过车次导入');
      console.log('   请确保文件存在于项目根目录：车次信息.json');
      console.log('');
    } else {
      const importResult = await importTrainData(trainDataPath);
      console.log(`✅ 车次数据导入成功（导入 ${importResult.imported} 个，跳过 ${importResult.skipped} 个）`);
      console.log('');
    }
    
    // ========== 第5步：生成班次和座位 ==========
    console.log(`📅 [5/5] 生成未来 ${days} 天的班次和座位...`);
    const generateResult = await generateSchedulesAndSeats(days);
    console.log(`✅ 班次和座位生成成功`);
    console.log(`   - 生成班次: ${generateResult.schedules} 个`);
    console.log(`   - 生成座位: ${generateResult.seats} 个`);
    console.log('');
    
    // ========== 完成 ==========
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🎉 数据库初始化完成！');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    console.log('📝 初始化摘要：');
    console.log('  ✅ 数据库表结构已创建');
    console.log('  ✅ 演示用户已创建（用户名/密码：demo/demo123）');
    console.log('  ✅ 座位管理系统已迁移');
    console.log(`  ✅ 车次数据已导入`);
    console.log(`  ✅ ${days} 天的班次和座位已生成`);
    console.log('');
    console.log('🚀 现在可以启动服务器：');
    console.log('   cd backend && npm run dev');
    console.log('');
    
    return { success: true };
    
  } catch (error) {
    console.error('');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('❌ 数据库初始化失败');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('');
    console.error('错误信息：', error.message);
    console.error('');
    console.error('请检查：');
    console.error('  1. 数据库文件是否有写入权限');
    console.error('  2. 车次信息.json 文件是否存在且格式正确');
    console.error('  3. Node.js 版本是否符合要求（>= 18.0.0）');
    console.error('');
    
    throw error;
  }
}

/**
 * 命令行入口
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const days = parseInt(args[0]) || 30;
  
  console.log('');
  console.log('📌 提示：此脚本将清空并重新初始化数据库');
  console.log(`📌 将生成未来 ${days} 天的班次和座位数据`);
  console.log('');
  
  setupDatabase(days)
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('初始化失败:', error);
      process.exit(1);
    });
}

export { setupDatabase };
