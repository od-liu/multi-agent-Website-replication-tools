# 12306 铁路购票系统 - AI 自动化开发项目

> **🤖 本项目由 AI Agent 自动化搭建完成**  
> 采用多 Agent 接力开发模式，从需求分析到代码实现全流程自动化

---

## 📋 项目简介

这是一个高仿 12306 铁路购票系统的全栈 Web 应用，完全由 AI Agent 自动化开发完成。项目展示了如何通过精心设计的 Agent 提示词，实现从 UI 分析、接口设计到代码实现的端到端自动化开发流程。

### ✨ 核心特性

- **🎨 像素级 UI 还原**：基于真实 12306 网站截图，实现 1:1 复刻
- **🏗️ 完整的系统架构**：前后端分离，RESTful API 设计
- **🎯 V2 座位管理系统**：区间座位锁定，支持多车型（高铁/动车）
- **📱 响应式设计**：支持登录、注册、查询、订票、个人中心等完整流程
- **🔒 安全认证**：短信验证、会话管理、订单超时处理

---

## 🤖 AI Agent 开发流程

本项目采用**三阶段 Agent 接力开发模式**，每个 Agent 负责特定的开发阶段：

### 开发流程图

```
┌─────────────────────┐
│  Phase 1: UI 分析   │
│  ui-analyzer        │
│  ├─ 页面截图分析     │
│  ├─ 组件拆分         │
│  └─ 需求文档生成     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Phase 2: 接口设计  │
│  interface-designer │
│  ├─ UI 组件骨架     │
│  ├─ API 接口定义    │
│  └─ 数据库设计       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Phase 3: TDD 实现  │
│  tdd-developer      │
│  ├─ 测试用例编写     │
│  ├─ 功能逻辑实现     │
│  └─ 集成测试         │
└─────────────────────┘
```

---

## 📂 Agent 提示词配置

所有 Agent 的提示词配置文件位于 `agent-prompts/` 目录：

### 1️⃣ **UI Analyzer Agent**
**文件**: [`agent-prompts/ui-analyzer-prompt-simplified.txt`](./agent-prompts/ui-analyzer-prompt-simplified.txt)

**职责**：
- 📸 分析页面截图（整体页面、组件特写、交互状态）
- 🧩 识别并拆分 UI 组件层级结构
- 📝 生成结构化需求文档（YAML 格式）
- 🎨 提取样式规范（颜色、字体、布局）

**输出**：
- `requirements/ui-requirements.yaml` - UI 组件需求
- `requirements/ui-style-guide.md` - 样式规范文档
- `requirements/images/` - 参考截图和标注

---

### 2️⃣ **Interface Designer Agent**
**文件**: [`agent-prompts/interface_designer_prompt.txt`](./agent-prompts/interface_designer_prompt.txt)

**职责**：
- 🏗️ 设计系统架构（前后端分离）
- 📡 定义 RESTful API 接口契约
- 🎨 生成 React 组件骨架代码
- 🗄️ 设计数据库表结构
- 📊 建立接口调用关系图

**输出**：
- `frontend/src/components/` - React 组件骨架
- `backend/src/routes/api.js` - API 路由定义
- `backend/src/database/operations.js` - 数据库操作函数
- `artifacts/ui_interface.yaml` - UI 接口清单
- `artifacts/api_interface.yaml` - API 接口清单
- `artifacts/func_interface.yaml` - 函数接口清单

---

### 3️⃣ **TDD Developer Agent**
**文件**: [`agent-prompts/tdd_developer_prompt.txt`](./agent-prompts/tdd_developer_prompt.txt)

**职责**：
- ✅ 编写测试用例（单元测试、集成测试）
- 💻 实现业务逻辑（基于测试驱动开发）
- 🔧 修复 Bug 和优化性能
- 📦 集成前后端功能

**输出**：
- `frontend/test/` - 前端测试用例（Vitest + React Testing Library）
- `backend/test/` - 后端测试用例（Vitest + Supertest）
- 完整的功能实现和 Bug 修复

---

## 🛠️ 技术栈

### 前端
- **框架**: React 18 + TypeScript
- **路由**: React Router v6
- **样式**: CSS Modules
- **构建**: Vite
- **测试**: Vitest + React Testing Library

### 后端
- **框架**: Node.js + Express
- **数据库**: SQLite3
- **测试**: Vitest + Supertest
- **架构**: RESTful API

### 开发工具
- **AI 平台**: Claude (Anthropic)
- **版本控制**: Git + GitHub
- **包管理**: npm

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装步骤

#### 1. 克隆项目

```bash
git clone https://github.com/your-username/cs3604-12306-automation-mcp.git
cd cs3604-12306-automation-mcp
```

#### 2. 安装依赖

```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

#### 3. 初始化数据库

⚠️ **重要**：首次运行必须先初始化数据库

```bash
cd backend
npm run setup-db  # 初始化数据库、导入车次数据、生成30天的班次和座位
```

**选项**：
- `npm run setup-db:7` - 生成未来 7 天的数据
- `npm run setup-db:30` - 生成未来 30 天的数据（推荐）

详细说明请查看：[数据库初始化指南](./DATABASE_SETUP.md)

#### 4. 启动开发服务器

**终端 1 - 后端服务**：
```bash
cd backend
npm run dev  # 启动后端服务（端口 3000）
```

**终端 2 - 前端服务**：
```bash
cd frontend
npm run dev  # 启动前端服务（端口 5174）
```

#### 5. 访问应用

打开浏览器访问：
- 前端：http://localhost:5174
- 后端 API：http://localhost:3000/api

**演示账号**：
- 用户名：`demo`
- 密码：`demo123`

---

## 📱 功能模块

### ✅ 已完成功能

- **🔐 用户认证**
  - 登录（账号密码 + 短信验证）
  - 注册（53 个验证场景）
  
- **🚄 车次查询**
  - 城市/车站搜索（自动补全）
  - 日期选择
  - 余票查询（实时区间计算）
  
- **🎫 订票流程**
  - 乘客选择/管理
  - 座位类型选择
  - 订单确认（实时余票显示）
  - 订单支付/取消
  
- **👤 个人中心**
  - 个人信息管理
  - 乘客信息管理
  - 历史订单查询
  - 订单状态追踪

---

## 🎯 项目亮点

### 1. **完全自动化开发**
- ✅ 零人工编码，全部由 AI Agent 生成
- ✅ 从需求到代码，端到端自动化
- ✅ 多 Agent 协作，分工明确

### 2. **像素级 UI 还原**
- ✅ 基于真实 12306 截图分析
- ✅ 1:1 复刻原版样式
- ✅ 支持多种车型（G/C/D）的不同座位类型显示

### 3. **V2 座位管理系统**
- ✅ 区间座位锁定机制
- ✅ 支持订单状态管理（未支付/已支付/已取消）
- ✅ 自动释放过期订单座位
- ✅ 并发订票冲突检测

### 4. **完整的测试覆盖**
- ✅ 单元测试（组件、函数）
- ✅ 集成测试（API、数据库）
- ✅ E2E 场景测试

---

## 📊 项目数据

| 指标 | 数量 |
|------|------|
| 📄 总需求场景 | 100+ |
| 🎨 UI 组件 | 50+ |
| 📡 API 接口 | 30+ |
| 🗄️ 数据库表 | 15+ |
| ✅ 测试用例 | 200+ |
| 📝 代码行数 | 10,000+ |
| 🚄 支持车次 | 示例数据包含完整车次信息 |

---

## 📁 项目结构

```
cs3604-12306-automation-mcp/
├── agent-prompts/              # AI Agent 提示词配置
│   ├── ui-analyzer-prompt-simplified.txt
│   ├── interface_designer_prompt.txt
│   └── tdd_developer_prompt.txt
├── requirements/               # AI 生成的需求文档
│   ├── ui-requirements.yaml
│   ├── ui-style-guide.md
│   └── images/                 # 参考截图
├── artifacts/                  # 接口清单
│   ├── ui_interface.yaml
│   ├── api_interface.yaml
│   └── func_interface.yaml
├── frontend/                   # 前端代码
│   ├── src/
│   │   ├── components/         # React 组件
│   │   ├── pages/              # 页面组件
│   │   └── api/                # API 客户端
│   └── test/                   # 前端测试
├── backend/                    # 后端代码
│   ├── src/
│   │   ├── routes/             # API 路由
│   │   ├── database/           # 数据库操作
│   │   └── utils/              # 工具函数
│   └── test/                   # 后端测试
└── 车次信息.json               # 车次数据（示例）
```

---

## 🔬 技术细节

### V2 座位管理系统

本项目实现了先进的区间座位管理系统：

```
区间座位锁定原理：
┌─────────────────────────────────────────┐
│  北京南 → 济南西 → 南京南 → 上海虹桥   │
│    1       2        3        4          │
└─────────────────────────────────────────┘

订单A: 北京南 → 南京南 (区间 1-3)
订单B: 济南西 → 上海虹桥 (区间 2-4) ✅ 可预订（不冲突）
订单C: 北京南 → 上海虹桥 (区间 1-4) ❌ 不可预订（冲突）
```

**核心特性**：
- 座位按区间锁定，提高座位利用率
- 支持不同车型的座位类型（高铁：商务座/一等座/二等座，动车：软卧/硬卧/二等座）
- 自动车厢分配（商务座1车，一等座2-3车，二等座4-8车等）
- 订单超时自动释放座位（20分钟）

---

## 🤝 贡献指南

本项目主要用于展示 AI Agent 自动化开发能力。如果您想贡献：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📄 许可证

本项目仅用于学习和研究目的。

---

## 🙏 致谢

- **Claude (Anthropic)**: 提供强大的 AI 能力
- **12306 官网**: UI 设计参考
- **开源社区**: 提供优秀的技术栈和工具

---

## 📧 联系方式

如有问题或建议，欢迎通过以下方式联系：

- 项目 Issues: [GitHub Issues](https://github.com/your-username/cs3604-12306-automation-mcp/issues)
- Email: 3279882704@qq.com

---

<div align="center">

**🤖 Powered by AI Agents**

*展示 AI 在软件工程中的无限可能*

</div>
