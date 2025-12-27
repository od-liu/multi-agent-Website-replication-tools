# 12306 登录页面 - 架构设计项目

本项目是12306登录页面的完整架构骨架代码，包含前端UI、后端API和数据库逻辑三层架构。

---

## 📋 项目概述

**技术栈**：
- 前端：React 18 + TypeScript + Vite + 传统CSS
- 后端：Node.js + Express + SQLite3
- 测试：Vitest + React Testing Library + Supertest

**核心功能**：
- ✅ 用户登录（账号/扫码双模式）
- ✅ 短信验证（二次安全验证）
- ✅ 表单验证（前端+后端双重验证）
- ✅ 错误处理（用户友好的提示）

---

## 📁 项目结构

```
/ui_analyzer_agent_requirements
├── backend/                    # 后端服务
│   ├── src/
│   │   ├── database/           # 数据库相关
│   │   │   ├── init_db.js     # 数据库初始化
│   │   │   ├── db.js           # 数据库连接
│   │   │   └── operations.js  # 业务逻辑函数
│   │   ├── routes/
│   │   │   └── api.js          # API路由
│   │   ├── utils/
│   │   │   └── response.js     # 响应工具函数
│   │   └── index.js            # 服务入口
│   └── package.json
│
├── frontend/                   # 前端应用
│   ├── src/
│   │   ├── components/         # UI组件
│   │   │   ├── TopNavigation.tsx         # 顶部导航
│   │   │   ├── LoginForm.tsx             # 登录表单
│   │   │   ├── BottomNavigation.tsx      # 底部导航
│   │   │   └── SmsVerificationModal.tsx  # 短信验证弹窗
│   │   ├── pages/
│   │   │   └── LoginPage.tsx   # 登录页面容器
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   │   └── images/             # 静态图片资源
│   └── package.json
│
├── requirements/               # 需求文档
│   ├── ui-requirements.yaml   # UI需求规范
│   ├── ui-style-guide.md      # UI样式规范
│   └── metadata.md            # 技术栈规范
│
├── INTERFACE_VERIFICATION.md  # 接口验证报告
└── README.md                  # 本文档
```

---

## 🚀 快速开始

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

**测试账号**（自动创建）：
- 用户名：`testuser`
- 密码：`password123`
- 邮箱：`test@example.com`
- 手机：`13800138000`
- 证件号后4位：`1234`

### 3. 启动服务

**启动后端**（端口3000）：
```bash
cd backend
npm run dev
```

**启动前端**（端口5173）：
```bash
cd frontend
npm run dev
```

### 4. 访问应用

打开浏览器访问：[http://localhost:5173](http://localhost:5173)

---

## 🎯 功能清单

### 登录功能（6个场景）

| 场景ID | 描述 | 验证位置 |
|--------|------|----------|
| SCENARIO-001 | 校验用户名为空 | 前端验证 |
| SCENARIO-002 | 校验密码为空 | 前端验证 |
| SCENARIO-003 | 校验密码长度（<6位） | 前端验证 |
| SCENARIO-004 | 用户名未注册 | 后端验证 |
| SCENARIO-005 | 密码错误 | 后端验证 |
| SCENARIO-006 | 登录成功 | 后端验证 |

### 短信验证功能（10个场景）

#### 获取验证码（3个场景）

| 场景ID | 描述 | 验证位置 |
|--------|------|----------|
| SCENARIO-001 | 证件号错误 | 后端验证 |
| SCENARIO-002 | 获取成功 | 后端验证 |
| SCENARIO-003 | 频率限制（1分钟内） | 后端验证 |

#### 验证短信（7个场景）

| 场景ID | 描述 | 验证位置 |
|--------|------|----------|
| SCENARIO-004 | 证件号为空 | 前端验证 |
| SCENARIO-005 | 证件号长度不正确 | 前端验证 |
| SCENARIO-006 | 验证码为空 | 前端验证 |
| SCENARIO-007 | 验证码长度不正确 | 前端验证 |
| SCENARIO-008 | 验证码错误 | 后端验证 |
| SCENARIO-009 | 验证码过期（5分钟） | 后端验证 |
| SCENARIO-010 | 验证成功 | 后端验证 |

**总计**：16个业务场景，100%覆盖

---

## 🔗 接口调用链

### 1. 登录功能

```
UI-LOGIN-FORM (LoginForm.tsx)
  ↓ POST /api/auth/login
API-LOGIN (api.js)
  ↓ authenticateUser(username, password)
FUNC-AUTHENTICATE-USER (operations.js)
  ↓ SELECT FROM users
DATABASE (users表)
```

### 2. 发送验证码功能

```
UI-SMS-VERIFICATION (SmsVerificationModal.tsx)
  ↓ POST /api/auth/send-verification-code
API-SEND-SMS (api.js)
  ↓ sendVerificationCode(username, idNumber)
FUNC-SEND-VERIFICATION-CODE (operations.js)
  ↓ SELECT FROM users + INSERT INTO verification_codes
DATABASE (users表 + verification_codes表)
```

### 3. 验证短信功能

```
UI-SMS-VERIFICATION (SmsVerificationModal.tsx)
  ↓ POST /api/auth/verify-sms
API-VERIFY-SMS (api.js)
  ↓ verifySmsCode(username, idNumber, code)
FUNC-VERIFY-SMS-CODE (operations.js)
  ↓ SELECT FROM verification_codes + UPDATE
DATABASE (verification_codes表 + users表)
```

---

## 📊 组件注册统计

### UI组件（5个）

| 组件ID | 文件路径 | 需求ID |
|--------|----------|--------|
| UI-LOGIN-PAGE | frontend/src/pages/LoginPage.tsx | REQ-LOGIN-PAGE |
| UI-TOP-NAV | frontend/src/components/TopNavigation.tsx | REQ-TOP-NAV |
| UI-LOGIN-FORM | frontend/src/components/LoginForm.tsx | REQ-LOGIN-FORM |
| UI-BOTTOM-NAV | frontend/src/components/BottomNavigation.tsx | REQ-BOTTOM-NAV |
| UI-SMS-VERIFICATION | frontend/src/components/SmsVerificationModal.tsx | REQ-SMS-VERIFICATION |

### API接口（3个）

| 接口ID | 签名 | 需求ID |
|--------|------|--------|
| API-LOGIN | POST /api/auth/login | REQ-LOGIN-FORM |
| API-SEND-SMS | POST /api/auth/send-verification-code | REQ-SMS-VERIFICATION |
| API-VERIFY-SMS | POST /api/auth/verify-sms | REQ-SMS-VERIFICATION |

### 后端函数（3个）

| 函数ID | 签名 | 数据库表 |
|--------|------|----------|
| FUNC-AUTHENTICATE-USER | authenticateUser(username, password) | users |
| FUNC-SEND-VERIFICATION-CODE | sendVerificationCode(username, idNumber) | users, verification_codes |
| FUNC-VERIFY-SMS-CODE | verifySmsCode(username, idNumber, code) | verification_codes, users |

---

## 🗄️ 数据库表结构

### users表

| 字段 | 类型 | 描述 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| username | TEXT | 用户名，唯一 |
| password | TEXT | 密码 |
| email | TEXT | 邮箱 |
| phone | TEXT | 手机号 |
| id_number | TEXT | 证件号后4位 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

### verification_codes表

| 字段 | 类型 | 描述 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| user_id | INTEGER | 用户ID，外键 |
| code | TEXT | 验证码 |
| type | TEXT | 类型（sms） |
| expires_at | DATETIME | 过期时间（5分钟） |
| used | INTEGER | 是否已使用（0/1） |
| created_at | DATETIME | 创建时间 |

---

## 🧪 测试说明

### 前端测试

```bash
cd frontend
npm run test
```

### 后端测试

```bash
cd backend
npm run test
```

**注意**：测试文件应放在 `test/` 目录下，并遵循命名规范 `*.test.*`

---

## 🎨 UI样式规范

所有UI组件的CSS样式严格按照 [`requirements/ui-style-guide.md`](requirements/ui-style-guide.md) 实现：

- 颜色体系：主题蓝 #1890ff、主题橙 #ff8001、品牌红 #e60012
- 字体大小：标题20px、正文16px、辅助文字14px、说明文字12px
- 间距规范：容器内边距40px、组件间距20px、输入框高度48px/60px
- 圆角规范：卡片8px、按钮4px
- 阴影规范：卡片 `0 2px 8px rgba(0, 0, 0, 0.1)`

---

## 📝 测试流程

### 1. 登录功能测试

1. 打开 [http://localhost:5173](http://localhost:5173)
2. 不输入任何内容，点击"立即登录" → 应显示"请输入用户名！"
3. 输入用户名，不输入密码，点击"立即登录" → 应显示"请输入密码！"
4. 输入用户名和少于6位密码，点击"立即登录" → 应显示"密码长度不能少于6位！"
5. 输入 `testuser` 和 `password123`，点击"立即登录" → 应弹出短信验证窗口

### 2. 短信验证测试

1. 不输入证件号，点击"确定" → 应显示"请输入登录账号绑定的证件号后4位"
2. 输入错误的证件号（如 `9999`），点击"获取验证码" → 应显示"请输入正确的用户信息！"
3. 输入正确的证件号（`1234`），点击"获取验证码" → 应显示成功提示，查看浏览器控制台获取验证码
4. 输入验证码（从控制台复制），点击"确定" → 应显示"验证成功！正在跳转..."

---

## 📚 相关文档

- [接口验证报告](INTERFACE_VERIFICATION.md) - 完整的接口调用链验证
- [UI需求规范](requirements/ui-requirements.yaml) - 详细的UI功能需求
- [UI样式规范](requirements/ui-style-guide.md) - 完整的CSS样式代码
- [技术栈规范](requirements/metadata.md) - 技术选型和目录结构

---

## ✅ 验证清单

### 功能完整性
- [x] REQ-LOGIN-FORM：6个scenarios全部实现（100%）
- [x] REQ-SMS-VERIFICATION：10个scenarios全部实现（100%）
- [x] 所有组件标注 `@scenarios_covered` 和 `@features_implemented`

### UI视觉还原
- [x] 所有CSS从 `ui-style-guide.md` 复制
- [x] 图片路径格式：`/images/文件名.扩展名`
- [x] 布局位置与requirements一致（顶部导航→主内容→底部导航）

### 接口调用链
- [x] UI-LOGIN-FORM → API-LOGIN → FUNC-AUTHENTICATE-USER
- [x] UI-SMS-VERIFICATION → API-SEND-SMS → FUNC-SEND-VERIFICATION-CODE
- [x] UI-SMS-VERIFICATION → API-VERIFY-SMS → FUNC-VERIFY-SMS-CODE

### 代码质量
- [x] 所有代码可直接运行（不只是TODO注释）
- [x] State管理完整（useState定义）
- [x] 事件处理器完整（onClick、onChange）
- [x] 错误处理完整（try-catch、错误提示）

---

## 🎉 项目完成

**生成时间**：2025-12-27  
**架构师**：AI Architect  
**状态**：✅ 已完成

**统计数据**：
- 前端文件：18个
- 后端文件：7个
- 总文件数：25个
- UI组件：5个
- API接口：3个
- 后端函数：3个
- 业务场景：16个（100%覆盖）

---

## 📞 技术支持

如有问题，请查看：
1. [接口验证报告](INTERFACE_VERIFICATION.md) - 详细的验证过程
2. 浏览器控制台 - 查看前端错误
3. 后端控制台 - 查看API请求日志

**下一步建议**：
1. 添加单元测试（前端+后端）
2. 实现实际的短信发送服务
3. 添加用户注册和忘记密码功能
4. 实现个人中心页面
5. 添加响应式布局适配移动端

