/**
 * Database Operations
 * 数据库操作函数
 */

/**
 * @function FUNC-AUTH-LOGIN
 * @signature authenticateUser(username, password)
 * @input {string} username - 用户名/邮箱/手机号
 * @input {string} password - 密码
 * @output {Object} result
 * @output {boolean} result.success - 认证是否成功
 * @output {number} result.userId - 用户ID（成功时）
 * @output {string} result.message - 错误消息（失败时）
 * @db_ops SELECT on users WHERE (username=? OR email=? OR phone=?) AND password_hash=?
 */
export async function authenticateUser(username, password) {
  try {
    // Validate inputs
    if (!username || !password) {
      return {
        success: false,
        message: '用户名和密码不能为空'
      };
    }

    const { getDb } = await import('./db.js');
    const bcrypt = (await import('bcrypt')).default;
    const db = getDb();

    // Query user (support username/email/phone) - 包含 name 和 username
    const user = await db.getAsync(
      'SELECT id, username, name, password_hash FROM users WHERE username = ? OR email = ? OR phone = ?',
      username, username, username
    );

    if (!user) {
      return {
        success: false,
        message: '用户名或密码错误！'
      };
    }

    // Verify password
    const isValid = bcrypt.compareSync(password, user.password_hash);
    if (!isValid) {
      return {
        success: false,
        message: '用户名或密码错误！'
      };
    }

    return {
      success: true,
      userId: user.id,
      username: user.username,
      name: user.name
    };
  } catch (error) {
    console.error('认证失败:', error);
    return {
      success: false,
      message: '系统错误，请稍后再试'
    };
  }
}

/**
 * @function FUNC-GET-USER-BY-USERNAME
 * @signature getUserByUsername(username)
 * @input {string} username - 用户名/邮箱/手机号
 * @output {Object|null} user - 用户对象或null
 * @output {string} user.id - 用户ID
 * @output {string} user.username - 用户名
 * @output {string} user.email - 邮箱
 * @output {string} user.phone - 手机号
 * @output {string} user.idCardLast4 - 证件号后4位
 * @db_ops SELECT on users WHERE username=? OR email=? OR phone=?
 */
export async function getUserByUsername(username) {
  try {
    const { getDb } = await import('./db.js');
    const db = getDb();

    const user = await db.getAsync(
      'SELECT id, username, email, phone, id_card_last4 FROM users WHERE username = ? OR email = ? OR phone = ?',
      username, username, username
    );

    return user || null;
  } catch (error) {
    console.error('查询用户失败:', error);
    return null;
  }
}

/**
 * @function FUNC-GENERATE-VERIFICATION-CODE
 * @signature generateVerificationCode(userId, idCardLast4)
 * @input {number} userId - 用户ID
 * @input {string} idCardLast4 - 证件号后4位
 * @output {Object} result
 * @output {boolean} result.success - 是否生成成功
 * @output {string} result.code - 验证码（6位数字）
 * @output {string} result.message - 错误消息（失败时）
 * @db_ops 
 *   - SELECT on users WHERE id=? AND id_card_last4=?
 *   - INSERT into verification_codes (user_id, code, expires_at)
 */
export async function generateVerificationCode(userId, idCardLast4) {
  try {
    const { getDb } = await import('./db.js');
    const db = getDb();

    // Verify id_card_last4 matches
    const user = await db.getAsync(
      'SELECT id FROM users WHERE id = ? AND id_card_last4 = ?',
      userId, idCardLast4
    );

    if (!user) {
      return {
        success: false,
        message: '请输入正确的用户信息！'
      };
    }

    // Generate 6-digit random code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration time (5 minutes from now)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // Store in database
    await db.runAsync(
      'INSERT INTO verification_codes (user_id, code, expires_at) VALUES (?, ?, ?)',
      userId, code, expiresAt
    );

    // Simulate sending SMS (output to console)
    console.log(`📱 [SMS] 验证码已发送给用户 ${userId}: ${code} (5分钟内有效)`);

    return {
      success: true,
      code: code
    };
  } catch (error) {
    console.error('生成验证码失败:', error);
    return {
      success: false,
      message: '系统错误，请稍后再试'
    };
  }
}

/**
 * @function FUNC-VERIFY-CODE
 * @signature verifyCode(userId, code)
 * @input {number} userId - 用户ID
 * @input {string} code - 验证码
 * @output {Object} result
 * @output {boolean} result.success - 验证是否成功
 * @output {string} result.token - 登录令牌（成功时）
 * @output {string} result.message - 错误消息（失败时）
 * @db_ops 
 *   - SELECT on verification_codes WHERE user_id=? AND code=? AND expires_at > NOW()
 *   - DELETE from verification_codes WHERE user_id=?
 *   - INSERT into sessions (user_id, token, expires_at)
 */
export async function verifyCode(userId, code) {
  try {
    const { getDb } = await import('./db.js');
    const crypto = (await import('crypto')).default;
    const db = getDb();

    // Find valid verification code
    const verificationRecord = await db.getAsync(
      'SELECT * FROM verification_codes WHERE user_id = ? AND code = ? AND expires_at > datetime("now")',
      userId, code
    );

    if (!verificationRecord) {
      return {
        success: false,
        message: '验证码错误或已过期'
      };
    }

    // Delete used verification code
    await db.runAsync('DELETE FROM verification_codes WHERE user_id = ?', userId);

    // Generate session token (UUID)
    const token = crypto.randomUUID();

    // Session expires in 7 days
    const sessionExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    // Create session
    await db.runAsync(
      'INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)',
      userId, token, sessionExpiresAt
    );

    console.log(`✅ 用户 ${userId} 登录成功，会话令牌: ${token}`);

    return {
      success: true,
      token: token
    };
  } catch (error) {
    console.error('验证码验证失败:', error);
    return {
      success: false,
      message: '系统错误，请稍后再试'
    };
  }
}

/**
 * @function FUNC-REGISTER-USER
 * @signature registerUser(userData)
 * @input {Object} userData - 用户注册信息
 * @input {string} userData.username - 用户名
 * @input {string} userData.password - 密码
 * @input {string} userData.name - 真实姓名
 * @input {string} userData.idType - 证件类型
 * @input {string} userData.idNumber - 证件号码
 * @input {string} userData.phone - 手机号码
 * @input {string} userData.email - 邮箱
 * @input {string} userData.passengerType - 乘客类型
 * @output {Object} result
 * @output {boolean} result.success - 注册是否成功
 * @output {number} result.userId - 用户ID（成功时）
 * @output {string} result.message - 错误消息（失败时）
 * @db_ops 
 *   - SELECT on users WHERE username=? OR phone=? (检查重复)
 *   - INSERT into users (username, password_hash, name, id_type, id_number, phone, email, passenger_type)
 */
export async function registerUser(userData) {
  try {
    const { username, password, name, idType, idNumber, phone, email, passengerType } = userData;
    
    // Validate inputs
    if (!username || !password || !name || !idNumber || !phone) {
      return {
        success: false,
        message: '必填字段不能为空'
      };
    }
    
    // Validate username format
    if (username.length < 6 || username.length > 30) {
      return {
        success: false,
        message: '用户名长度应为6-30位'
      };
    }
    
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(username)) {
      return {
        success: false,
        message: '用户名必须以字母开头，只能包含字母、数字或下划线'
      };
    }
    
    // Validate password
    if (password.length < 6 || password.length > 20) {
      return {
        success: false,
        message: '密码长度应为6-20位'
      };
    }
    
    // Validate phone format
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return {
        success: false,
        message: '手机号码格式不正确'
      };
    }
    
    const { getDb } = await import('./db.js');
    const bcrypt = (await import('bcrypt')).default;
    const db = getDb();
    
    // Check if username or phone already exists
    const existingUser = await db.getAsync(
      'SELECT id FROM users WHERE username = ? OR phone = ?',
      username, phone
    );
    
    if (existingUser) {
      return {
        success: false,
        message: '用户名或手机号已被注册'
      };
    }
    
    // Hash password
    const saltRounds = 10;
    const passwordHash = bcrypt.hashSync(password, saltRounds);
    
    // Extract last 4 digits of ID number
    const idCardLast4 = idNumber.slice(-4);
    
    // Insert user
    const result = await db.runAsync(
      `INSERT INTO users (username, password_hash, name, id_type, id_number, id_card_last4, phone, email, passenger_type, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      username, passwordHash, name, idType, idNumber, idCardLast4, phone, email, passengerType
    );
    
    const userId = result.lastID;
    
    // 自动将注册人添加为乘客（本人）
    await db.runAsync(
      `INSERT INTO passengers (user_id, name, id_type, id_number, phone, passenger_type, created_at)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
      userId, name, idType, idNumber, phone, passengerType
    );
    
    console.log(`✅ 用户注册成功: ${username} (ID: ${userId})，已自动添加为乘客`);
    
    return {
      success: true,
      userId: userId
    };
  } catch (error) {
    console.error('注册失败:', error);
    return {
      success: false,
      message: '系统错误，请稍后再试'
    };
  }
}

/**
 * @function FUNC-SEND-REGISTRATION-CODE
 * @signature sendRegistrationVerificationCode(phoneNumber, userData)
 * @input {string} phoneNumber - 手机号码
 * @input {Object} userData - 用户注册信息（用于临时存储）
 * @output {Object} result
 * @output {boolean} result.success - 是否发送成功
 * @output {string} result.code - 验证码（6位数字）
 * @output {string} result.message - 错误消息（失败时）
 * @db_ops 
 *   - SELECT on users WHERE phone=? (检查手机号是否已注册)
 *   - INSERT into verification_codes (phone, code, expires_at, user_data)
 */
export async function sendRegistrationVerificationCode(phoneNumber, userData) {
  try {
    // Validate phone format
    if (!/^1[3-9]\d{9}$/.test(phoneNumber)) {
      return {
        success: false,
        message: '手机号码格式不正确'
      };
    }
    
    const { getDb } = await import('./db.js');
    const db = getDb();
    
    // Check if phone is already registered
    const existingPhone = await db.getAsync(
      'SELECT id FROM users WHERE phone = ?',
      phoneNumber
    );
    
    if (existingPhone) {
      return {
        success: false,
        message: '该手机号已被注册'
      };
    }
    
    // Check if username is already taken (防止用户名被占用)
    if (userData && userData.username) {
      const existingUsername = await db.getAsync(
        'SELECT id FROM users WHERE username = ?',
        userData.username
      );
      
      if (existingUsername) {
        return {
          success: false,
          message: '该用户名已被占用，请更换用户名'
        };
      }
    }
    
    // Check if ID number is already registered
    if (userData && userData.idNumber) {
      const existingIdNumber = await db.getAsync(
        'SELECT id FROM users WHERE id_number = ?',
        userData.idNumber
      );
      
      if (existingIdNumber) {
        return {
          success: false,
          message: '该证件号码已被注册'
        };
      }
    }
    
    // Generate 6-digit random code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration time (5 minutes from now)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    
    // Delete any existing verification codes for this phone (avoid duplicate codes)
    await db.runAsync('DELETE FROM verification_codes WHERE phone = ?', phoneNumber);
    
    // Store in database (with user_data for later registration completion)
    await db.runAsync(
      'INSERT INTO verification_codes (phone, code, expires_at, user_data) VALUES (?, ?, ?, ?)',
      phoneNumber, code, expiresAt, JSON.stringify(userData || {})
    );
    
    // Simulate sending SMS (output to console)
    console.log(`📱 [SMS] 注册验证码已发送至 ${phoneNumber}: ${code} (5分钟内有效)`);
    
    return {
      success: true,
      code: code
    };
  } catch (error) {
    console.error('发送注册验证码失败:', error);
    return {
      success: false,
      message: '系统错误，请稍后再试'
    };
  }
}

/**
 * @function FUNC-CHECK-USERNAME
 * @signature checkUsername(username)
 * @input {string} username - 用户名
 * @output {Object} result
 * @output {boolean} result.available - 用户名是否可用
 * @output {string} result.message - 错误消息（不可用时）
 * @db_ops SELECT on users WHERE username=?
 */
export async function checkUsername(username) {
  try {
    const { getDb } = await import('./db.js');
    const db = getDb();
    
    const existing = await db.getAsync(
      'SELECT id FROM users WHERE username = ?',
      username
    );
    
    if (existing) {
      return { available: false, message: '该用户名已经占用，请重新选择用户名！' };
    }
    
    return { available: true };
  } catch (error) {
    console.error('检查用户名失败:', error);
    return { available: false, message: '系统错误，请稍后再试' };
  }
}

/**
 * @function FUNC-CHECK-PHONE
 * @signature checkPhone(phone)
 * @input {string} phone - 手机号
 * @output {Object} result
 * @output {boolean} result.available - 手机号是否可用
 * @output {string} result.message - 错误消息（不可用时）
 * @db_ops SELECT on users WHERE phone=?
 */
export async function checkPhone(phone) {
  try {
    const { getDb } = await import('./db.js');
    const db = getDb();
    
    const existing = await db.getAsync(
      'SELECT id FROM users WHERE phone = ?',
      phone
    );
    
    if (existing) {
      return { available: false, message: '该手机号已被注册，请更换手机号码！' };
    }
    
    return { available: true };
  } catch (error) {
    console.error('检查手机号失败:', error);
    return { available: false, message: '系统错误，请稍后再试' };
  }
}

/**
 * @function FUNC-CHECK-ID-NUMBER
 * @signature checkIdNumber(idNumber, idType)
 * @input {string} idNumber - 证件号码
 * @input {string} idType - 证件类型
 * @output {Object} result
 * @output {boolean} result.available - 证件号码是否可用
 * @output {string} result.message - 错误消息（不可用时）
 * @db_ops SELECT on users WHERE id_number=? AND id_type=?
 */
export async function checkIdNumber(idNumber, idType) {
  try {
    const { getDb } = await import('./db.js');
    const db = getDb();
    
    const existing = await db.getAsync(
      'SELECT id FROM users WHERE id_number = ? AND id_type = ?',
      idNumber,
      idType
    );
    
    if (existing) {
      return { 
        available: false, 
        message: '该证件号码已经被注册过，请确认是否您本人注册，\'是\'请使用原账号登录，\'不是\'请通过铁路12306App办理抢注或持该证件到就近的办理客运业务的铁路车站办理被抢注处理，完成后即可继续注册，或致电12306客服咨询。' 
      };
    }
    
    return { available: true };
  } catch (error) {
    console.error('检查证件号码失败:', error);
    return { available: false, message: '系统错误，请稍后再试' };
  }
}

/**
 * @function FUNC-CHECK-EMAIL
 * @signature checkEmail(email)
 * @input {string} email - 邮箱
 * @output {Object} result
 * @output {boolean} result.available - 邮箱是否可用
 * @output {string} result.message - 错误消息（不可用时）
 * @db_ops SELECT on users WHERE email=?
 */
export async function checkEmail(email) {
  try {
    const { getDb } = await import('./db.js');
    const db = getDb();
    
    const existing = await db.getAsync(
      'SELECT id FROM users WHERE email = ?',
      email
    );
    
    if (existing) {
      return { available: false, message: '该邮箱已被注册' };
    }
    
    return { available: true };
  } catch (error) {
    console.error('检查邮箱失败:', error);
    return { available: false, message: '系统错误，请稍后再试' };
  }
}

/**
 * @function FUNC-VERIFY-REGISTRATION-CODE
 * @signature verifyRegistrationCode(phoneNumber, code)
 * @input {string} phoneNumber - 手机号码
 * @input {string} code - 验证码
 * @output {Object} result
 * @output {boolean} result.success - 验证是否成功
 * @output {string} result.userId - 用户ID（成功时）
 * @output {string} result.message - 错误消息（失败时）
 * @db_ops 
 *   - SELECT on verification_codes WHERE phone=? AND code=? AND expires_at > NOW()
 *   - INSERT into users (使用存储的 user_data)
 *   - DELETE from verification_codes WHERE phone=?
 */
export async function verifyRegistrationCode(phoneNumber, code) {
  try {
    const { getDb } = await import('./db.js');
    const bcrypt = (await import('bcrypt')).default;
    const db = getDb();
    
    // Find valid verification code
    const verificationRecord = await db.getAsync(
      'SELECT * FROM verification_codes WHERE phone = ? AND code = ? AND expires_at > datetime("now")',
      phoneNumber, code
    );
    
    if (!verificationRecord) {
      // 检查是否有该手机号和验证码的过期记录
      const expiredRecord = await db.getAsync(
        'SELECT * FROM verification_codes WHERE phone = ? AND code = ? ORDER BY created_at DESC LIMIT 1',
        phoneNumber,
        code
      );
      
      if (expiredRecord) {
        return {
          success: false,
          message: '验证码已过期'
        };
      }
      
      return {
        success: false,
        message: '验证码错误'
      };
    }
    
    // Parse stored user data
    const userData = JSON.parse(verificationRecord.user_data || '{}');
    
    if (!userData.username || !userData.password) {
      return {
        success: false,
        message: '注册信息不完整，请重新注册'
      };
    }
    
    // 再次检查用户名是否已被占用（防止并发注册）
    const existingUsername = await db.getAsync(
      'SELECT id FROM users WHERE username = ?',
      userData.username
    );
    
    if (existingUsername) {
      // 删除验证码，让用户重新注册
      await db.runAsync('DELETE FROM verification_codes WHERE phone = ?', phoneNumber);
      return {
        success: false,
        message: '该用户名已被占用，请返回修改后重新注册'
      };
    }
    
    // 检查手机号是否已被注册
    const existingPhone = await db.getAsync(
      'SELECT id FROM users WHERE phone = ?',
      phoneNumber
    );
    
    if (existingPhone) {
      await db.runAsync('DELETE FROM verification_codes WHERE phone = ?', phoneNumber);
      return {
        success: false,
        message: '该手机号已被注册，请使用其他手机号'
      };
    }
    
    // 检查证件号是否已被使用
    if (userData.idNumber) {
      const existingIdNumber = await db.getAsync(
        'SELECT id FROM users WHERE id_number = ?',
        userData.idNumber
      );
      
      if (existingIdNumber) {
        await db.runAsync('DELETE FROM verification_codes WHERE phone = ?', phoneNumber);
        return {
          success: false,
          message: '该证件号码已被注册，请确认是否本人注册'
        };
      }
    }
    
    // Hash password
    const saltRounds = 10;
    const passwordHash = bcrypt.hashSync(userData.password, saltRounds);
    
    // Extract last 4 digits of ID number
    const idCardLast4 = userData.idNumber ? userData.idNumber.slice(-4) : '';
    
    // Insert user
    const result = await db.runAsync(
      `INSERT INTO users (username, password_hash, name, id_type, id_number, id_card_last4, phone, email, passenger_type, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      userData.username,
      passwordHash,
      userData.name,
      userData.idType || '1',
      userData.idNumber || '',
      idCardLast4,
      phoneNumber,
      userData.email || '',
      userData.passengerType || '1'
    );
    
    const userId = result.lastID;
    
    // 自动将注册人添加为乘客（本人）
    await db.runAsync(
      `INSERT INTO passengers (user_id, name, id_type, id_number, phone, passenger_type, created_at)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
      userId,
      userData.name,
      userData.idType || '1',
      userData.idNumber || '',
      phoneNumber,
      userData.passengerType || '1'
    );
    
    // Delete used verification code
    await db.runAsync('DELETE FROM verification_codes WHERE phone = ?', phoneNumber);
    
    console.log(`✅ 用户 ${userData.username} 注册完成 (ID: ${userId})，已自动添加为乘客`);
    
    return {
      success: true,
      userId: result.lastID
    };
  } catch (error) {
    console.error('验证注册验证码失败:', error);
    // 提供更详细的错误信息
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      if (error.message.includes('username')) {
        return { success: false, message: '该用户名已被占用' };
      }
      if (error.message.includes('phone')) {
        return { success: false, message: '该手机号已被注册' };
      }
      if (error.message.includes('id_number')) {
        return { success: false, message: '该证件号码已被注册' };
      }
      return { success: false, message: '注册信息与已有用户冲突，请检查后重试' };
    }
    return {
      success: false,
      message: '系统错误，请稍后再试'
    };
  }
}

/**
 * @function FUNC-SEARCH-TRAINS
 * @signature searchTrains(fromCity, toCity, departureDate, isStudent, isHighSpeed)
 * @input {string} fromCity - 出发城市
 * @input {string} toCity - 到达城市
 * @input {string} departureDate - 出发日期
 * @input {boolean} isStudent - 是否学生票
 * @input {boolean} isHighSpeed - 是否只查高铁/动车
 * @output {Object} result - 查询结果
 * @output {boolean} result.success - 查询是否成功
 * @output {string} result.message - 响应消息
 * @output {Array} result.trains - 车次列表
 * @db_ops SELECT on trains, stations
 */
export async function searchTrains(fromCity, toCity, departureDate, isStudent = false, isHighSpeed = false) {
  const startTime = performance.now();
  try {
    console.log(`🔍 查询车票: ${fromCity} → ${toCity}, 日期: ${departureDate}, 学生票: ${isStudent}, 高铁/动车: ${isHighSpeed}`);
    
    const { getDb } = await import('./db.js');
    const db = getDb();
    const t1 = performance.now();
    console.log(`⏱️  [1] 获取DB连接: ${(t1 - startTime).toFixed(2)}ms`);
    
    // 获取当前日期和时间
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const currentTime = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM
    
    console.log(`📅 当前时间: ${currentDate} ${currentTime}, 查询日期: ${departureDate}`);
    
    // 判断是否查询今天的车次
    const isToday = departureDate === currentDate;
    
    // 🔧 修复：使用 train_stops 表查询区间票（支持途经站）
    // 查询所有经过出发城市和到达城市的车次
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
    
    // 🆕 需求：查询结果应该只包含当前时间之后发车的车次
    // 如果查询今天的车次，只返回还未发车的车次
    if (isToday) {
      query += ` AND ts1.departure_time > ?`;
      params.push(currentTime);
      console.log(`⏰ 查询今天的车次，过滤已发车的列车（发车时间 > ${currentTime}）`);
    }
    
    // 如果只查高铁/动车
    if (isHighSpeed) {
      query += ` AND (t.train_type = 'GC' OR t.train_type = 'D')`;
    }
    
    query += ` ORDER BY ts1.departure_time`;
    
    const t2 = performance.now();
    const trains = await db.allAsync(query, ...params);
    const t3 = performance.now();
    console.log(`⏱️  [2] 查询车次: ${(t3 - t2).toFixed(2)}ms`);
    
    console.log(`✅ 查询到 ${trains.length} 个车次`);
    if (isToday && trains.length > 0) {
      console.log(`🚄 最早车次: ${trains[0].train_number} ${trains[0].departure_time}`);
    }
    
    if (!trains || trains.length === 0) {
      return {
        success: true,
        trains: []
      };
    }
    
    // 🚀 性能优化：批量查询所有车次的座位信息（一次查询，而非循环查询）
    const t4 = performance.now();
    const trainIds = trains.map(t => t.train_id);
    const placeholders = trainIds.map(() => '?').join(',');
    
    const allSeats = await db.allAsync(`
      SELECT seat_type, total_seats, available_seats, price, train_id
      FROM train_seats
      WHERE train_id IN (${placeholders})
    `, ...trainIds);
    const t5 = performance.now();
    console.log(`⏱️  [3] 查询座位（批量）: ${(t5 - t4).toFixed(2)}ms`);
    
    // 按 train_id 分组座位信息
    const seatsByTrainId = {};
    allSeats.forEach(seat => {
      if (!seatsByTrainId[seat.train_id]) {
        seatsByTrainId[seat.train_id] = [];
      }
      seatsByTrainId[seat.train_id].push(seat);
    });
    
    // 构建返回结果
    const trainsWithSeats = trains.map(train => {
      const seats = seatsByTrainId[train.train_id] || [];
      
      // 将座位信息转换为对象格式
      const seatsObj = {};
      seats.forEach(seat => {
        const key = seat.seat_type;
        if (seat.available_seats === 0) {
          seatsObj[key] = '无';
        } else if (seat.available_seats >= 20) {
          seatsObj[key] = '有';
        } else if (seat.available_seats > 0) {
          seatsObj[key] = seat.available_seats.toString();
        } else {
          seatsObj[key] = '--';
        }
        
        // 保存价格信息
        if (seat.price) {
          seatsObj[`${key}_price`] = seat.price;
        }
      });
      
      return {
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
      };
    });
    
    const endTime = performance.now();
    const totalTime = (endTime - startTime).toFixed(2);
    console.log(`✅ 查询完成，总耗时: ${totalTime}ms`);
    
    return {
      success: true,
      trains: trainsWithSeats
    };
  } catch (error) {
    console.error('查询车票失败:', error);
    return {
      success: false,
      message: '查询失败，请稍后再试'
    };
  }
}

/**
 * @function FUNC-GET-CITIES
 * @signature getCities()
 * @output {Object} result
 * @output {boolean} result.success - 是否成功
 * @output {Array<string>} result.cities - 城市列表
 * @db_ops SELECT DISTINCT city_name FROM stations
 */
export async function getCities() {
  try {
    const { getDb } = await import('./db.js');
    const db = getDb();
    
    // 查询所有城市（从cities表获取）
    const cities = await db.allAsync(
      'SELECT city_name FROM cities ORDER BY city_name'
    );
    
    return {
      success: true,
      cities: cities.map(c => c.city_name)
    };
  } catch (error) {
    console.error('获取城市列表失败:', error);
    return {
      success: false,
      message: '获取城市列表失败'
    };
  }
}

/**
 * @function FUNC-GET-TRAIN-DETAILS
 * @signature getTrainDetails(trainNumber)
 * @input {string} trainNumber - 车次号
 * @output {Object} result
 * @output {boolean} result.success - 是否成功
 * @output {Object} result.trainDetails - 车次详情
 * @output {Array<Object>} result.trainDetails.stops - 停靠站列表
 * @db_ops SELECT * FROM trains WHERE train_number=?
 * @db_ops SELECT * FROM train_stops WHERE train_number=? ORDER BY stop_sequence
 * @db_ops JOIN stations ON train_stops.station_id = stations.id
 */
export async function getTrainDetails(trainNumber) {
  try {
    // 骨架实现：返回模拟数据
    // 实际应查询 trains 表和 train_stops 表
    // SELECT t.*, ts.station_id, ts.arrival_time, ts.departure_time, s.station_name
    // FROM trains t
    // JOIN train_stops ts ON t.train_number = ts.train_number
    // JOIN stations s ON ts.station_id = s.id
    // WHERE t.train_number = ?
    // ORDER BY ts.stop_sequence
    
    if (!trainNumber) {
      return {
        success: false,
        message: '车次号不能为空'
      };
    }

    const trainType = trainNumber.startsWith('G') ? '高铁' : 
                      trainNumber.startsWith('D') ? '动车' : '普通列车';

    return {
      success: true,
      trainDetails: {
        trainNumber,
        trainType,
        totalDistance: '1318公里',
        stops: [
          {
            stopSequence: 1,
            stationName: '北京南',
            arrivalTime: '始发站',
            departureTime: '14:10',
            stopDuration: '-',
            platform: '5',
            distance: '0公里'
          },
          {
            stopSequence: 2,
            stationName: '天津南',
            arrivalTime: '14:40',
            departureTime: '14:42',
            stopDuration: '2分钟',
            platform: '3',
            distance: '120公里'
          },
          {
            stopSequence: 3,
            stationName: '济南西',
            arrivalTime: '16:15',
            departureTime: '16:17',
            stopDuration: '2分钟',
            platform: '7',
            distance: '406公里'
          },
          {
            stopSequence: 4,
            stationName: '南京南',
            arrivalTime: '17:50',
            departureTime: '17:52',
            stopDuration: '2分钟',
            platform: '9',
            distance: '1023公里'
          },
          {
            stopSequence: 5,
            stationName: '上海虹桥',
            arrivalTime: '18:41',
            departureTime: '终点站',
            stopDuration: '-',
            platform: '12',
            distance: '1318公里'
          }
        ]
      }
    };
  } catch (error) {
    console.error('获取车次详情失败:', error);
    return {
      success: false,
      message: '获取车次详情失败'
    };
  }
}

/**
 * @function FUNC-GET-PASSENGERS
 * @signature getPassengers(userId)
 * @input {string} userId - 用户ID
 * @output {Object} result
 * @output {boolean} result.success - 是否成功
 * @output {Array<Object>} result.passengers - 乘客列表
 * @output {string} result.message - 错误消息（失败时）
 * @db_ops SELECT on passengers WHERE user_id=?
 */
export async function getPassengers(userId) {
  try {
    const { getDb } = await import('./db.js');
    const db = getDb();
    
    // 从数据库获取该用户的乘客列表（包含 is_self 和 phone 字段）
    const passengers = await db.allAsync(
      'SELECT id, name, id_type, id_number, phone, passenger_type, is_self FROM passengers WHERE user_id = ?',
      userId
    );
    
    // 证件类型映射
    const idTypeMap = {
      '1': '居民身份证',
      '2': '护照',
      '3': '港澳通行证',
      '4': '台湾通行证'
    };
    
    // 乘客类型映射（同时处理数字代码和中文名称）
    const passengerTypeMap = {
      '1': '成人票',
      '2': '学生票',
      '3': '儿童票',
      // 🔧 兼容中文名称（统一转换为带"票"的格式）
      '成人': '成人票',
      '学生': '学生票',
      '儿童': '儿童票'
    };

    // 转换数据格式并对证件号和手机号进行脱敏处理
    const formattedPassengers = passengers.map(p => {
      // 证件号脱敏：显示前4位和后3位，中间用*代替
      const idNumber = p.id_number || '';
      const maskedIdNumber = idNumber.length > 7 
        ? idNumber.substring(0, 4) + '*'.repeat(idNumber.length - 7) + idNumber.substring(idNumber.length - 3)
        : idNumber;
      
      // 手机号脱敏：(+86) + 前3位 + **** + 后4位
      const phone = p.phone || '';
      const maskedPhone = phone.length === 11 
        ? `(+86)${phone.substring(0, 3)}****${phone.substring(7)}`
        : phone ? `(+86)${phone}` : '';
      
      return {
        id: String(p.id),
        name: p.name,
        idType: idTypeMap[p.id_type] || p.id_type || '居民身份证',
        idNumber: maskedIdNumber,
        phone: maskedPhone,  // 🆕 添加脱敏后的手机号字段
        passengerType: passengerTypeMap[p.passenger_type] || p.passenger_type || '成人票',
        isSelf: p.is_self === 1  // 🆕 是否为用户本人
      };
    });
    
    return {
      success: true,
      passengers: formattedPassengers
    };
  } catch (error) {
    console.error('获取乘客列表失败:', error);
    return {
      success: false,
      message: '获取乘客列表失败'
    };
  }
}

/**
 * 添加乘客
 * @param {number} userId - 用户ID
 * @param {Object} passengerData - 乘客信息
 * @param {string} passengerData.name - 姓名
 * @param {string} passengerData.idType - 证件类型（中文）
 * @param {string} passengerData.idNumber - 证件号码
 * @param {string} passengerData.phone - 手机号
 * @param {string} passengerData.discountType - 优惠类型（中文）
 * @returns {Promise<Object>} 添加结果
 */
export async function addPassenger(userId, passengerData) {
  try {
    const { getDb } = await import('./db.js');
    const db = getDb();
    
    // 证件类型映射（中文 -> 数字代码）
    const idTypeMap = {
      '居民身份证': '1',
      '护照': '2',
      '港澳通行证': '3',
      '台湾通行证': '4'
    };
    
    // 乘客类型映射（中文 -> 数字代码）
    const passengerTypeMap = {
      '成人': '1',
      '学生': '2',
      '儿童': '3'
    };
    
    const idTypeCode = idTypeMap[passengerData.idType] || '1';
    const passengerTypeCode = passengerTypeMap[passengerData.discountType] || '1';
    
    console.log(`📝 [添加乘客] 用户${userId} 添加乘客: ${passengerData.name} (${passengerData.idType})`);
    
    // 检查是否已存在相同证件号的乘客
    const existing = await db.getAsync(
      'SELECT id FROM passengers WHERE user_id = ? AND id_number = ?',
      userId, passengerData.idNumber
    );
    
    if (existing) {
      console.warn(`⚠️ [添加乘客] 乘客已存在: ${passengerData.name} (${passengerData.idNumber})`);
      return {
        success: false,
        message: '该乘客已存在，请勿重复添加'
      };
    }
    
    // 插入新乘客
    const result = await db.runAsync(`
      INSERT INTO passengers (
        user_id, name, id_type, id_number, phone, passenger_type
      ) VALUES (?, ?, ?, ?, ?, ?)
    `,
      userId,
      passengerData.name,
      idTypeCode,
      passengerData.idNumber,
      passengerData.phone || null,
      passengerTypeCode
    );
    
    console.log(`✅ [添加乘客] 成功: ID=${result.lastID}, 姓名=${passengerData.name}`);
    
    return {
      success: true,
      passengerId: result.lastID,
      message: '添加成功'
    };
  } catch (error) {
    console.error('❌ [添加乘客失败]:', error);
    
    // 处理 UNIQUE 约束违反
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      return {
        success: false,
        message: '该乘客已存在，请勿重复添加'
      };
    }
    
    return {
      success: false,
      message: '添加失败，请稍后重试'
    };
  }
}

/**
 * 删除乘客
 * @param {number} userId - 用户ID
 * @param {number} passengerId - 乘客ID
 * @returns {Promise<Object>} 删除结果
 */
export async function deletePassenger(userId, passengerId) {
  try {
    const { getDb } = await import('./db.js');
    const db = getDb();
    
    console.log(`🗑️ [删除乘客] 用户${userId} 尝试删除乘客${passengerId}`);
    
    // 检查乘客是否存在且属于该用户
    const passenger = await db.getAsync(
      'SELECT id, name, is_self FROM passengers WHERE id = ? AND user_id = ?',
      passengerId, userId
    );
    
    if (!passenger) {
      console.warn(`⚠️ [删除乘客] 乘客不存在或不属于该用户`);
      return {
        success: false,
        message: '乘客不存在'
      };
    }
    
    // 🚫 禁止删除用户本人
    if (passenger.is_self === 1) {
      console.warn(`⚠️ [删除乘客] 禁止删除用户本人: ${passenger.name}`);
      return {
        success: false,
        message: '不能删除本人信息'
      };
    }
    
    // 删除乘客
    await db.runAsync(
      'DELETE FROM passengers WHERE id = ? AND user_id = ?',
      passengerId, userId
    );
    
    console.log(`✅ [删除乘客] 成功删除: ID=${passengerId}, 姓名=${passenger.name}`);
    
    return {
      success: true,
      message: '删除成功'
    };
  } catch (error) {
    console.error('❌ [删除乘客失败]:', error);
    return {
      success: false,
      message: '删除失败，请稍后重试'
    };
  }
}

/**
 * @function FUNC-SUBMIT-ORDER
 * @signature submitOrder(userId, orderData)
 * @input {string} userId - 用户ID
 * @input {Object} orderData - 订单数据
 * @input {string} orderData.trainNo - 车次号
 * @input {string} orderData.date - 乘车日期
 * @input {string} orderData.departureStation - 出发站
 * @input {string} orderData.arrivalStation - 到达站
 * @input {Array<Object>} orderData.passengers - 乘客列表
 * @output {Object} result
 * @output {boolean} result.success - 是否成功
 * @output {string} result.orderId - 订单ID（成功时）
 * @output {string} result.message - 响应消息
 * @db_ops INSERT into orders, INSERT into order_passengers, UPDATE train_seats
 */
export async function submitOrder(userId, orderData) {
  try {
    // Validate inputs
    if (!userId || !orderData || !orderData.passengers || orderData.passengers.length === 0) {
      return {
        success: false,
        message: '订单信息不完整'
      };
    }
    
    const { getDb } = await import('./db.js');
    const db = getDb();
    
    // 生成订单编号和ID
    const orderNumber = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // 计算订单总价
    const totalPrice = orderData.passengers.reduce((sum, p) => {
      return sum + (p.price || 662.0); // 默认二等座价格
    }, 0);
    
    // 设置订单过期时间为20分钟后
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 20 * 60 * 1000); // 20分钟
    
    // 1. 根据车次号查询 train_id
    const train = await db.getAsync(
      'SELECT id FROM trains WHERE train_number = ?',
      orderData.trainNumber
    );
    
    if (!train) {
      return {
        success: false,
        message: `车次 ${orderData.trainNumber} 不存在`
      };
    }
    
    // 2. 查询或创建 train_schedule
    let schedule = await db.getAsync(
      'SELECT id FROM train_schedules WHERE train_id = ? AND departure_date = ?',
      train.id, orderData.departureDate
    );
    
    if (!schedule) {
      // 创建新的班次记录
      const departureDateTime = `${orderData.departureDate}T${orderData.departureTime || '00:00:00'}`;
      const arrivalDateTime = `${orderData.departureDate}T${orderData.arrivalTime || '23:59:59'}`;
      
      const scheduleResult = await db.runAsync(`
        INSERT INTO train_schedules (
          train_id, departure_date, departure_datetime, arrival_datetime, status
        ) VALUES (?, ?, ?, ?, ?)
      `, train.id, orderData.departureDate, departureDateTime, arrivalDateTime, 'scheduled');
      
      schedule = { id: scheduleResult.lastID };
    }
    
    // 3. 创建订单记录（使用数据库实际的表结构，包含所有必需字段）
    const orderResult = await db.runAsync(`
      INSERT INTO orders (
        id, order_number, user_id, schedule_id, 
        train_number, from_station, to_station,
        departure_date, departure_time, arrival_time,
        total_price, status, created_at, expires_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      orderNumber, // id (使用订单号作为主键)
      orderNumber, // order_number
      userId, 
      schedule.id,
      orderData.trainNumber,  // train_number
      orderData.fromStation,  // from_station
      orderData.toStation,    // to_station
      orderData.departureDate, // departure_date
      orderData.departureTime || '00:00', // departure_time
      orderData.arrivalTime || '23:59',   // arrival_time
      totalPrice,
      'unpaid', 
      now.toISOString(), 
      expiresAt.toISOString()
    );
    
    const orderId = orderNumber; // 使用订单号作为 orderId
    
    // 4. 创建乘客订单记录并分配座位
    const seats = [];
    for (let idx = 0; idx < orderData.passengers.length; idx++) {
      const passenger = orderData.passengers[idx];
      const carNumber = String(idx + 1).padStart(2, '0');
      const seatNumber = `${carNumber}${String.fromCharCode(65 + (idx % 5))}`;
      
      await db.runAsync(`
        INSERT INTO order_passengers (
          order_id, name, id_type, id_number, ticket_type,
          seat_class, car_number, seat_number, price
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        orderId, passenger.name, passenger.idType, passenger.idNumber, passenger.ticketType,
        passenger.seatClass, carNumber, seatNumber, passenger.price || 662.0
      );
      
      seats.push({
        passengerId: passenger.passengerId,
        carNumber,
        seatNumber
      });
    }
    
    // 3. 标记座位为已被预定(简化实现,实际应该更新train_seats表)
    // 这里我们假设座位已经在train_seats表中存在
    
    return {
      success: true,
      orderId: String(orderId), // 返回数据库自动生成的ID
      orderNumber, // 返回订单编号
      message: '订单提交成功',
      seats
    };
  } catch (error) {
    console.error('提交订单失败:', error);
    return {
      success: false,
      message: '提交订单失败'
    };
  }
}

/**
 * @function FUNC-GET-ORDER-PAYMENT-INFO
 * @summary 获取订单支付信息
 * @param {string} orderId - 订单ID
 * @returns {Promise<Object>} result
 * @output {boolean} result.success - 是否成功
 * @output {Object} result.order - 订单信息
 * @scenario 从订单填写页跳转支付页
 * @scenario 从未完成订单页跳转支付页
 */
export async function getOrderPaymentInfo(orderId) {
  try {
    console.log(`💰 [获取订单支付信息] orderId: ${orderId}`);
    
    const { getDb } = await import('./db.js');
    const db = getDb();
    
    // 🔧 修正：通过 JOIN 获取订单完整信息
    // orders 表只存储 schedule_id，需要 JOIN train_schedules 和 trains 表
    // ⚠️ 注意：不能使用 'as' 作为表别名，因为它是 SQL 保留字
    const order = await db.getAsync(`
      SELECT 
        o.id as orderId,
        o.order_number as orderNumber,
        t.train_number as trainNumber,
        ts.departure_date as date,
        ds.station_name as fromStation,
        arr_s.station_name as toStation,
        t.departure_time as departTime,
        t.arrival_time as arriveTime,
        o.total_price as totalPrice,
        o.created_at as createdAt,
        o.expires_at as expiresAt,
        o.status
      FROM orders o
      JOIN train_schedules ts ON o.schedule_id = ts.id
      JOIN trains t ON ts.train_id = t.id
      JOIN stations ds ON t.departure_station_id = ds.id
      JOIN stations arr_s ON t.arrival_station_id = arr_s.id
      WHERE o.id = ? AND o.status = 'unpaid'
    `, orderId);
    
    console.log(`📦 [获取订单支付信息] 查询结果:`, order);
    
    if (!order) {
      console.log(`❌ [获取订单支付信息] 订单不存在或已失效`);
      return {
        success: false,
        message: '订单不存在或已失效'
      };
    }
    
    // 获取乘客信息
    const passengers = await db.allAsync(`
      SELECT 
        op.name,
        op.id_type as idType,
        op.id_number as idNumber,
        op.ticket_type as ticketType,
        op.seat_class as seatClass,
        op.car_number as carNumber,
        op.seat_number as seatNumber,
        op.price
      FROM order_passengers op
      WHERE op.order_id = ?
    `, orderId);
    
    console.log(`👥 [获取订单支付信息] 乘客信息:`, passengers);
    
    return {
      success: true,
      order: {
        ...order,
        passengers
      }
    };
  } catch (error) {
    console.error('❌ [获取订单支付信息失败]:', error);
    return {
      success: false,
      message: '获取订单信息失败'
    };
  }
}

/**
 * @function FUNC-CONFIRM-PAYMENT
 * @summary 确认支付订单
 * @param {string} orderId - 订单ID
 * @returns {Promise<Object>} result
 * @output {boolean} result.success - 是否成功
 * @output {string} result.message - 响应消息
 * @output {boolean} result.timeout - 是否超时(可选)
 * @scenario 用户确认支付车票(订单未超时)
 * @scenario 用户确认支付车票但订单已超时
 */
export async function confirmPayment(orderId) {
  try {
    const { getDb } = await import('./db.js');
    const db = getDb();
    
    // 获取订单信息
    const order = await db.getAsync(`
      SELECT id, expires_at, status
      FROM orders
      WHERE id = ?
    `, orderId);
    
    if (!order) {
      return {
        success: false,
        message: '订单不存在'
      };
    }
    
    // 检查订单是否超时
    const now = new Date();
    const expiresAt = new Date(order.expires_at);
    
    if (now > expiresAt) {
      // 🔧 修正：订单已超时,更新订单状态为已取消（使用英文状态值）
      await db.runAsync(`
        UPDATE orders 
        SET status = 'cancelled'
        WHERE id = ?
      `, orderId);
      
      return {
        success: false,
        timeout: true,
        message: '支付超时，请重新购票'
      };
    }
    
    // 🔧 修正：更新订单状态为已支付（使用正确的字段名 payment_time）
    await db.runAsync(`
      UPDATE orders 
      SET status = 'paid', payment_method = '网上支付', payment_time = CURRENT_TIMESTAMP
      WHERE id = ?
    `, orderId);
    
    return {
      success: true,
      message: '支付成功'
    };
  } catch (error) {
    console.error('确认支付失败:', error);
    return {
      success: false,
      message: '支付失败'
    };
  }
}

/**
 * @function FUNC-CANCEL-ORDER
 * @summary 取消订单
 * @param {string} orderId - 订单ID
 * @param {number} userId - 用户ID
 * @returns {Promise<Object>} result
 * @output {boolean} result.success - 是否成功
 * @output {string} result.message - 响应消息
 * @scenario 用户在交易提示弹窗确认取消订单
 */
export async function cancelOrder(orderId, userId) {
  try {
    const { getDb } = await import('./db.js');
    const db = getDb();
    
    // 释放座位
    await db.runAsync(`
      UPDATE train_seats 
      SET seat_status = '空闲', order_id = NULL
      WHERE order_id = ?
    `, orderId);
    
    // 删除乘客订单记录
    await db.runAsync('DELETE FROM order_passengers WHERE order_id = ?', orderId);
    
    // 删除订单
    await db.runAsync('DELETE FROM orders WHERE id = ?', orderId);
    
    // 增加用户当天取消次数
    const today = new Date().toISOString().split('T')[0];
    const existingCount = await db.getAsync(`
      SELECT cancel_count FROM user_daily_cancel_count 
      WHERE user_id = ? AND date = ?
    `, userId, today);
    
    if (existingCount) {
      await db.runAsync(`
        UPDATE user_daily_cancel_count 
        SET cancel_count = cancel_count + 1 
        WHERE user_id = ? AND date = ?
      `, userId, today);
    } else {
      await db.runAsync(`
        INSERT INTO user_daily_cancel_count (user_id, date, cancel_count)
        VALUES (?, ?, 1)
      `, userId, today);
    }
    
    return {
      success: true,
      message: '订单已取消'
    };
  } catch (error) {
    console.error('取消订单失败:', error);
    return {
      success: false,
      message: '取消订单失败'
    };
  }
}

/**
 * @function FUNC-GET-ORDER-SUCCESS-INFO
 * @summary 获取订单成功信息
 * @param {string} orderId - 订单ID
 * @returns {Promise<Object>} result
 * @output {boolean} result.success - 是否成功
 * @output {Object} result.order - 订单信息
 * @scenario 系统跳转至购票成功页
 */
export async function getOrderSuccessInfo(orderId) {
  try {
    console.log(`🎉 [获取购票成功信息] orderId: ${orderId}`);
    
    const { getDb } = await import('./db.js');
    const db = getDb();
    
    // 🔧 修正：通过 JOIN 获取订单完整信息
    // ⚠️ 注意：不能使用 'as' 作为表别名，因为它是 SQL 保留字
    const order = await db.getAsync(`
      SELECT 
        o.id as orderId,
        o.order_number as orderNumber,
        t.train_number as trainNumber,
        ts.departure_date as date,
        ds.station_name as fromStation,
        arr_s.station_name as toStation,
        t.departure_time as departTime,
        t.arrival_time as arriveTime
      FROM orders o
      JOIN train_schedules ts ON o.schedule_id = ts.id
      JOIN trains t ON ts.train_id = t.id
      JOIN stations ds ON t.departure_station_id = ds.id
      JOIN stations arr_s ON t.arrival_station_id = arr_s.id
      WHERE o.id = ? AND o.status = 'paid'
    `, orderId);
    
    console.log(`📦 [获取购票成功信息] 查询结果:`, order);
    
    if (!order) {
      console.log(`❌ [获取购票成功信息] 订单不存在或未支付`);
      return {
        success: false,
        message: '订单不存在或未支付'
      };
    }
    
    // 获取乘客信息
    const passengers = await db.allAsync(`
      SELECT 
        op.name,
        op.id_type as idType,
        op.id_number as idNumber,
        op.ticket_type as ticketType,
        op.seat_class as seatClass,
        op.car_number as carNumber,
        op.seat_number as seatNumber,
        op.price,
        '已支付' as status
      FROM order_passengers op
      WHERE op.order_id = ?
    `, orderId);
    
    console.log(`👥 [获取购票成功信息] 乘客信息:`, passengers);
    
    // 对证件号打码: 前4位+***+后3位
    const maskedPassengers = passengers.map(p => ({
      ...p,
      gender: '先生', // 简化处理,实际应从用户信息获取
      idNumber: p.idNumber.substring(0, 4) + '***********' + p.idNumber.substring(p.idNumber.length - 3)
    }));
    
    return {
      success: true,
      order: {
        ...order,
        orderNumber: order.orderNumber, // 使用数据库中的 order_number
        passengers: maskedPassengers
      }
    };
  } catch (error) {
    console.error('❌ [获取订单成功信息失败]:', error);
    return {
      success: false,
      message: '获取订单信息失败'
    };
  }
}

/**
 * @function FUNC-GET-USER-ORDERS
 * @summary 获取用户订单列表（支持30天历史订单过滤）
 * @param {number} userId - 用户ID
 * @param {Object} options - 查询选项
 * @param {string} options.status - 订单状态过滤（unpaid/paid/cancelled）
 * @param {boolean} options.last30Days - 是否只查询30天内的订单（默认true）
 * @returns {Promise<Object>} result
 * @output {boolean} result.success - 是否成功
 * @output {Array} result.data - 订单列表
 * @db_ops SELECT FROM orders, train_schedules, trains, stations
 */
export async function getUserOrders(userId, options = {}) {
  try {
    console.log(`📋 [获取用户订单列表] userId: ${userId}, options:`, options);
    
    const { getDb } = await import('./db.js');
    const db = getDb();
    
    // 解构选项
    const { status, last30Days = true } = options;
    
    // 构建基础查询
    // ⚠️ 注意：不能使用 'as' 作为表别名，因为它是 SQL 保留字
    let query = `
      SELECT 
        o.id as orderId,
        o.order_number as orderNumber,
        t.train_number as trainNumber,
        ts.departure_date as date,
        ds.station_name as fromStation,
        arr_s.station_name as toStation,
        t.departure_time as departTime,
        t.arrival_time as arriveTime,
        o.total_price as totalPrice,
        o.status,
        o.created_at as createdAt,
        o.expires_at as expiresAt,
        o.payment_time as paymentTime
      FROM orders o
      JOIN train_schedules ts ON o.schedule_id = ts.id
      JOIN trains t ON ts.train_id = t.id
      JOIN stations ds ON t.departure_station_id = ds.id
      JOIN stations arr_s ON t.arrival_station_id = arr_s.id
      WHERE o.user_id = ?
    `;
    
    const params = [userId];
    
    // 🆕 需求：个人账户需要存储用户30天内的历史订单
    // 添加30天过滤条件
    if (last30Days) {
      query += ` AND o.created_at >= datetime('now', '-30 days')`;
      console.log(`📅 [获取用户订单列表] 应用30天过滤`);
    }
    
    // 添加状态过滤
    if (status) {
      query += ` AND o.status = ?`;
      params.push(status);
      console.log(`🏷️ [获取用户订单列表] 过滤状态: ${status}`);
    }
    
    // 按创建时间降序排序（最新的在前）
    query += ` ORDER BY o.created_at DESC`;
    
    const orders = await db.allAsync(query, ...params);
    
    console.log(`✅ [获取用户订单列表] 查询到 ${orders.length} 条订单`);
    
    // 获取每个订单的乘客信息
    const ordersWithPassengers = await Promise.all(
      orders.map(async (order) => {
        const passengers = await db.allAsync(`
          SELECT 
            op.name,
            op.id_type as idType,
            op.id_number as idNumber,
            op.ticket_type as ticketType,
            op.seat_class as seatClass,
            op.car_number as carNumber,
            op.seat_number as seatNumber,
            op.price
          FROM order_passengers op
          WHERE op.order_id = ?
        `, order.orderId);
        
        return {
          ...order,
          passengers
        };
      })
    );
    
    return {
      success: true,
      data: ordersWithPassengers
    };
  } catch (error) {
    console.error('❌ [获取用户订单列表失败]:', error);
    return {
      success: false,
      message: '获取订单列表失败'
    };
  }
}

/**
 * @function FUNC-CLEANUP-OLD-ORDERS
 * @summary 定时清理30天前的订单（定时任务）
 * @returns {Promise<Object>} result
 * @output {boolean} result.success - 是否成功
 * @output {number} result.deletedCount - 删除的订单数量
 * @db_ops DELETE FROM orders, order_passengers
 */
export async function cleanupOldOrders() {
  try {
    console.log(`🧹 [定时清理] 开始清理30天前的订单`);
    
    const { getDb } = await import('./db.js');
    const db = getDb();
    
    // 查询30天前的订单ID
    const oldOrders = await db.allAsync(`
      SELECT id 
      FROM orders 
      WHERE created_at < datetime('now', '-30 days')
    `);
    
    if (oldOrders.length === 0) {
      console.log(`✅ [定时清理] 没有需要清理的订单`);
      return {
        success: true,
        deletedCount: 0,
        message: '没有需要清理的订单'
      };
    }
    
    console.log(`📦 [定时清理] 找到 ${oldOrders.length} 条需要清理的订单`);
    
    // 删除订单乘客记录
    for (const order of oldOrders) {
      await db.runAsync('DELETE FROM order_passengers WHERE order_id = ?', order.id);
    }
    
    // 删除订单
    const result = await db.runAsync(`
      DELETE FROM orders 
      WHERE created_at < datetime('now', '-30 days')
    `);
    
    console.log(`✅ [定时清理] 成功清理 ${oldOrders.length} 条订单`);
    
    return {
      success: true,
      deletedCount: oldOrders.length,
      message: `成功清理 ${oldOrders.length} 条30天前的订单`
    };
  } catch (error) {
    console.error('❌ [定时清理失败]:', error);
    return {
      success: false,
      message: '清理订单失败'
    };
  }
}

/**
 * @function FUNC-VERIFY-PASSWORD
 * @summary 验证用户密码
 * @param {number} userId - 用户ID
 * @param {string} password - 密码
 * @returns {Promise<Object>} result
 * @output {boolean} result.success - 验证是否成功
 */
export async function verifyPassword(userId, password) {
  try {
    const { getDb } = await import('./db.js');
    const bcrypt = (await import('bcrypt')).default;
    const db = getDb();
    
    console.log('🔐 [密码验证] 验证用户密码, userId:', userId);
    
    // 查询用户密码哈希
    const user = await db.getAsync(
      'SELECT password_hash FROM users WHERE id = ?',
      userId
    );
    
    if (!user) {
      console.error('❌ [密码验证] 用户不存在, userId:', userId);
      return {
        success: false,
        message: '用户不存在'
      };
    }
    
    // 验证密码
    const isValid = bcrypt.compareSync(password, user.password_hash);
    
    if (!isValid) {
      console.log('❌ [密码验证] 密码错误');
      return {
        success: false,
        message: '密码错误'
      };
    }
    
    console.log('✅ [密码验证] 密码正确');
    return {
      success: true
    };
  } catch (error) {
    console.error('❌ [密码验证] 验证失败:', error);
    return {
      success: false,
      message: '验证失败'
    };
  }
}

/**
 * @function FUNC-GET-PERSONAL-INFO
 * @summary 获取用户个人信息
 * @param {number} userId - 用户ID
 * @returns {Promise<Object>} result
 * @output {boolean} result.success - 是否成功
 * @output {Object} result.data - 用户个人信息
 */
export async function getPersonalInfo(userId) {
  try {
    const { getDb } = await import('./db.js');
    const db = getDb();
    
    console.log('📋 [个人信息] 获取用户信息, userId:', userId);
    
    // 查询用户信息
    const user = await db.getAsync(`
      SELECT 
        username,
        name as realName,
        id_type as idType,
        id_number as idNumber,
        phone,
        email,
        passenger_type as passengerType
      FROM users
      WHERE id = ?
    `, userId);
    
    if (!user) {
      console.error('❌ [个人信息] 用户不存在, userId:', userId);
      return {
        success: false,
        message: '用户不存在'
      };
    }
    
    console.log('✅ [个人信息] 查询到用户:', user.username);
    
    // 格式化返回数据
    const idTypeMap = {
      '1': '中华人民共和国居民身份证',
      '2': '港澳居民来往内地通行证',
      '3': '台湾居民来往大陆通行证',
      'C': '护照'
    };
    
    const personalInfo = {
      username: user.username,
      realName: user.realName || '',
      country: '中国', // 固定值
      idType: idTypeMap[user.idType] || '中华人民共和国居民身份证',
      idNumber: user.idNumber || '',
      verificationStatus: '已通过', // 简化处理，实际应查验证表
      phone: user.phone || '',
      phoneVerification: '已通过核验', // 简化处理
      email: user.email || '',
      discountType: user.passengerType === '1' ? '成人' : (user.passengerType === '2' ? '学生' : '其他')
    };
    
    return {
      success: true,
      data: personalInfo
    };
  } catch (error) {
    console.error('❌ [个人信息] 获取个人信息失败:', error);
    return {
      success: false,
      message: '获取个人信息失败'
    };
  }
}