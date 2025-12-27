# 12306登录系统 - 骨架代码

这是一个12306登录系统的骨架代码实现，包含完整的前后端架构和接口定义。

## 项目结构

```
├── backend/                    # 后端服务
│   ├── src/
│   │   ├── database/          # 数据库相关
│   │   │   ├── init_db.js     # 数据库初始化
│   │   │   ├── db.js          # 数据库连接
│   │   │   └── operations.js  # 数据库操作函数
│   │   ├── routes/
│   │   │   └── api.js         # API路由
│   │   ├── utils/
│   │   │   └── response.js    # 响应工具函数
│   │   └── index.js           # Express服务器入口
│   ├── database.db            # SQLite数据库文件（运行后生成）
│   └── package.json
│
├── frontend/                   # 前端应用
│   ├── public/
│   │   └── images/            # 静态图片资源（10张）
│   ├── src/
│   │   ├── api/
│   │   │   └── index.ts       # Axios API客户端
│   │   ├── components/
│   │   │   ├── TopNavigation.tsx/css      # 顶部导航组件
│   │   │   ├── LoginForm.tsx/css          # 登录表单组件
│   │   │   ├── BottomNavigation.tsx/css   # 底部导航组件
│   │   │   └── SMSVerification.tsx/css    # 短信验证组件
│   │   ├── pages/
│   │   │   └── LoginPage.tsx/css          # 登录页面
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
└── requirements/               # 需求文档和参考图片
    ├── ui-requirements.yaml
    ├── ui-style-guide.md
    └── images/                # 参考图片
```

## 技术栈

### 前端
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: 传统CSS（无预处理器）
- **HTTP客户端**: Axios
- **路由**: React Router DOM v6

### 后端
- **运行时**: Node.js (ES Modules)
- **框架**: Express.js
- **数据库**: SQLite3
- **工具**: Nodemon (开发), CORS, Body-parser

## 快速开始

### 1. 安装依赖

```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

### 2. 初始化数据库

```bash
cd backend
node src/database/init_db.js
```

这将创建以下数据表：
- **users**: 用户表（id, username, password, email, phone, id_card_last4）
- **verification_codes**: 验证码表（id, user_id, code, expires_at, is_used）

测试用户数据：
- 用户名: `testuser`, 密码: `password123`, 证件号后4位: `1234`
- 用户名: `admin`, 密码: `admin123456`, 证件号后4位: `5678`

### 3. 启动后端服务

```bash
cd backend
npm run dev    # 开发模式（使用nodemon）
# 或
npm start      # 生产模式
```

后端服务将在 `http://localhost:3001` 启动

### 4. 启动前端应用

```bash
cd frontend
npm run dev
```

前端应用将在 `http://localhost:5173` 启动

## 🔒 测试凭证配置（可选）

**⚠️ 重要说明**：此步骤仅在使用 UI Analyzer Agent 的**交互场景截图功能**时需要。如果你只是运行普通的登录功能测试，可以跳过此步骤。

### 为什么需要配置凭证？

UI Analyzer Agent 可以自动执行交互场景并截图（例如：登录后的短信验证弹窗）。这些交互需要真实的测试账户凭证，但**绝对不能**将真实用户名和密码提交到 Git 仓库。

### 快速配置步骤

1. **复制凭证模板文件**：
```bash
cp credentials.example.env credentials.env
```

2. **编辑 credentials.env 文件**：
```env
# 填入你的测试账户信息
LOGIN_USERNAME=your_test_username
LOGIN_PASSWORD=your_test_password
LOGIN_ID_CARD_LAST4=1234
```

3. **验证配置**（推荐）：
```bash
./check_credentials.sh
```

如果所有检查通过，你会看到：
```
🎉 所有检查通过！凭证配置正确。
```

### 📚 详细文档

完整的凭证配置指南请查看：[CREDENTIALS_SETUP.md](CREDENTIALS_SETUP.md)

### ✅ 安全保证

- ✅ `credentials.env` 已在 `.gitignore` 中，不会被提交到 Git
- ✅ 只有 `credentials.example.env`（模板）会被提交，不包含真实信息
- ✅ 建议使用专门的测试账户，不要使用个人主账户

## API接口文档

### 1. 用户登录
- **接口**: `POST /api/auth/login`
- **请求体**:
  ```json
  {
    "username": "testuser",
    "password": "password123"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "userId": 1,
    "username": "testuser",
    "message": "登录成功"
  }
  ```

### 2. 发送短信验证码
- **接口**: `POST /api/auth/send-sms`
- **请求体**:
  ```json
  {
    "userId": 1,
    "idCardLast4": "1234"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "code": "123456",
    "message": "验证码已发送，请注意查收。"
  }
  ```
- **注意**: 验证码会同时输出到浏览器控制台

### 3. 验证短信验证码
- **接口**: `POST /api/auth/verify-sms`
- **请求体**:
  ```json
  {
    "userId": 1,
    "idCardLast4": "1234",
    "code": "123456"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "验证成功"
  }
  ```

## 功能场景覆盖

### 登录表单（6个场景）
1. ✅ 校验用户名为空
2. ✅ 校验密码为空
3. ✅ 校验密码长度
4. ✅ 用户名未注册
5. ✅ 密码错误
6. ✅ 登录成功

### 短信验证（9个场景）
1. ✅ 获取验证码-证件号错误
2. ✅ 获取验证码-成功
3. ✅ 获取验证码-频率限制（1分钟）
4. ✅ 验证-证件号为空
5. ✅ 验证-证件号长度不正确
6. ✅ 验证-验证码为空
7. ✅ 验证-验证码长度不正确
8. ✅ 验证-验证码错误/过期
9. ✅ 验证-成功

## UI组件说明

### 1. LoginPage（登录页面容器）
- **位置**: `frontend/src/pages/LoginPage.tsx`
- **布局**: 上中下三段式（1185px × 954px）
- **子组件**: TopNavigation, LoginForm, BottomNavigation, SMSVerification

### 2. TopNavigation（顶部导航）
- **位置**: `frontend/src/components/TopNavigation.tsx`
- **功能**: 显示Logo和欢迎文字
- **尺寸**: 100% × 80px

### 3. LoginForm（登录表单）
- **位置**: `frontend/src/components/LoginForm.tsx`
- **功能**: 账号登录/扫码登录切换、用户名密码输入、验证
- **尺寸**: 380px × 373px（绝对定位右侧）

### 4. BottomNavigation（底部导航）
- **位置**: `frontend/src/components/BottomNavigation.tsx`
- **功能**: 友情链接（4个）、二维码（4个）、版权信息
- **尺寸**: 100% × 274px

### 5. SMSVerification（短信验证）
- **位置**: `frontend/src/components/SMSVerification.tsx`
- **功能**: 证件号验证、验证码发送和验证
- **尺寸**: 700px（固定定位居中）

## 接口调用链

```
UI-LOGIN-FORM 
  → API-LOGIN 
    → FUNC-AUTHENTICATE-USER 
      → users表查询

UI-SMS-VERIFICATION 
  → API-SEND-SMS 
    → FUNC-GENERATE-CODE 
      → users表查询 + verification_codes表插入

UI-SMS-VERIFICATION 
  → API-VERIFY-SMS 
    → FUNC-VERIFY-CODE 
      → users表查询 + verification_codes表查询/更新
```

## 注意事项

1. **图片资源**: 所有图片资源已复制到 `frontend/public/images/`，共10张
2. **密码加密**: 当前使用明文密码，生产环境应使用bcrypt等加密
3. **验证码**: 验证码会在控制台输出，实际项目应通过短信服务发送
4. **CORS**: 后端已配置CORS中间件，允许跨域请求
5. **代理**: Vite已配置API代理，前端请求会自动转发到后端

## 开发说明

这是一个骨架代码（Skeleton Code）项目，包含：
- ✅ 完整的接口定义和类型声明
- ✅ 所有场景的实现逻辑
- ✅ 像素级精确的UI还原
- ✅ 前后端完整的调用链
- ⚠️ 不包含单元测试（需要在TDD阶段添加）
- ⚠️ 不包含生产级的安全措施（如密码加密、HTTPS等）

## 下一步

1. **TDD Developer**: 为所有组件和函数编写测试
2. **安全加固**: 实现密码加密、JWT认证等
3. **错误处理**: 完善错误边界和全局错误处理
4. **性能优化**: 添加加载状态、防抖节流等
5. **部署**: 配置生产环境构建和部署

## 许可证

本项目仅用于学习和开发目的。
