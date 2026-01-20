/**
 * 完整的座位管理系统初始化脚本
 * 执行顺序：迁移 → 导入车次 → 生成座位
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { migrateSeatSystem } from './migrate_seat_system.js';
import { importTrainData } from './import_train_data.js';
import { generateSchedulesAndSeats } from './generate_seats.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 完整系统初始化
 */
async function setupCompleteSystem() {
  console.log('');
  console.log('🚀 ========================================');
  console.log('🚀  12306 座位管理系统完整初始化');
  console.log('🚀 ========================================');
  console.log('');
  
  try {
    // Step 1: 数据库迁移
    console.log('📌 Step 1/3: 数据库迁移');
    console.log('----------------------------------------');
    await migrateSeatSystem();
    console.log('');
    
    // Step 2: 导入车次数据
    console.log('📌 Step 2/3: 导入车次数据');
    console.log('----------------------------------------');
    const trainDataPath = join(dirname(dirname(dirname(__dirname))), '车次信息.json');
    console.log(`📄 数据文件路径: ${trainDataPath}`);
    
    const importResult = await importTrainData(trainDataPath);
    console.log(`✅ 导入结果: ${importResult.imported} 个车次成功，${importResult.skipped} 个跳过`);
    console.log('');
    
    // Step 3: 生成班次和座位
    console.log('📌 Step 3/3: 生成班次和座位');
    console.log('----------------------------------------');
    const generateResult = await generateSchedulesAndSeats(30); // 生成未来30天
    console.log(`✅ 生成结果: ${generateResult.schedules} 个班次，${generateResult.seats} 个座位`);
    console.log('');
    
    console.log('🎉 ========================================');
    console.log('🎉  系统初始化完成！');
    console.log('🎉 ========================================');
    console.log('');
    console.log('📊 统计信息:');
    console.log(`  - 导入车次: ${importResult.imported} 个`);
    console.log(`  - 生成班次: ${generateResult.schedules} 个`);
    console.log(`  - 生成座位: ${generateResult.seats} 个`);
    console.log('');
    console.log('✅ 现在可以开始测试购票流程了！');
    console.log('');
    
    return {
      success: true,
      trains: importResult.imported,
      schedules: generateResult.schedules,
      seats: generateResult.seats
    };
    
  } catch (error) {
    console.error('');
    console.error('❌ ========================================');
    console.error('❌  系统初始化失败！');
    console.error('❌ ========================================');
    console.error('');
    console.error('错误信息:', error);
    console.error('');
    
    throw error;
  }
}

// 如果直接执行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  setupCompleteSystem()
    .then(() => {
      console.log('✅ 初始化脚本执行成功');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 初始化脚本执行失败:', error);
      process.exit(1);
    });
}

export { setupCompleteSystem };
