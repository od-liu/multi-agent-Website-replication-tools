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

    // Query user (support username/email/phone)
    const user = await db.getAsync(
      'SELECT id, username, email, phone, password_hash FROM users WHERE username = ? OR email = ? OR phone = ?',
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
      email: user.email,
      phone: user.phone
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
    
    console.log(`✅ 用户注册成功: ${username} (ID: ${result.lastID})`);
    
    return {
      success: true,
      userId: result.lastID
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
    const existingUser = await db.getAsync(
      'SELECT id FROM users WHERE phone = ?',
      phoneNumber
    );
    
    if (existingUser) {
      return {
        success: false,
        message: '该手机号已被注册'
      };
    }
    
    // Generate 6-digit random code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration time (5 minutes from now)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    
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
    
    // Delete used verification code
    await db.runAsync('DELETE FROM verification_codes WHERE phone = ?', phoneNumber);
    
    console.log(`✅ 用户 ${userData.username} 注册完成 (ID: ${result.lastID})`);
    
    return {
      success: true,
      userId: result.lastID
    };
  } catch (error) {
    console.error('验证注册验证码失败:', error);
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
  try {
    console.log(`🔍 查询车票: ${fromCity} → ${toCity}, 日期: ${departureDate}, 学生票: ${isStudent}, 高铁/动车: ${isHighSpeed}`);
    
    // 骨架实现：返回模拟数据
    // 实际实现应查询 trains 表和 stations 表
    // SELECT t.* FROM trains t
    // JOIN stations s1 ON t.departure_station_id = s1.id
    // JOIN stations s2 ON t.arrival_station_id = s2.id
    // WHERE s1.city = ? AND s2.city = ? AND t.departure_date = ?
    // AND (? = false OR t.supports_student = true)
    // AND (? = false OR t.train_type IN ('G', 'D', 'C'))
    
    return {
      success: true,
      trains: [
        {
          trainNumber: 'G1',
          trainType: 'G',
          departureStation: fromCity,
          arrivalStation: toCity,
          departureTime: '08:00',
          arrivalTime: '13:00',
          duration: '5小时',
          secondClassPrice: '553.5',
          firstClassPrice: '888.5',
          businessClassPrice: '1748.5',
          supportsStudent: true
        },
        {
          trainNumber: 'G2',
          trainType: 'G',
          departureStation: fromCity,
          arrivalStation: toCity,
          departureTime: '10:00',
          arrivalTime: '15:00',
          duration: '5小时',
          secondClassPrice: '553.5',
          firstClassPrice: '888.5',
          businessClassPrice: '1748.5',
          supportsStudent: true
        }
      ]
    };
  } catch (error) {
    console.error('查询车票失败:', error);
    return {
      success: false,
      message: '查询失败，请稍后再试'
    };
  }
}

