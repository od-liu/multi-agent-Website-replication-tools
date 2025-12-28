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
      'SELECT id, password_hash FROM users WHERE username = ? OR email = ? OR phone = ?',
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
      userId: user.id
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

