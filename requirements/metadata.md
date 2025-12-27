> 本文档是项目的唯一真理来源（Single Source of Truth）。所有的代码生成、接口设计和文件结构必须严格遵守本文档定义的规范。

## 1. Tech Stack & Dependencies (技术栈约束)

必须严格使用以下技术栈:

### Frontend (Client)

  * Framework: React 18+ (created via Vite)
  * Language: TypeScript (TSX for React components)
  * Styling: 传统CSS (不使用Tailwind CSS)
  * HTTP Client: Axios
  * Routing: React Router DOM (v6)
  * Testing: Vitest, React Testing Library (RTL)

### Backend (Server)

  * Runtime: Node.js (LTS)
  * Framework: Express.js
  * Database: SQLite3 (使用 `sqlite3` driver)
  * Testing: Vitest (Test Runner), Supertest (HTTP assertions)
  * Utilities: Nodemon (dev), Cors, Body-parser

-----

## 2. Project Directory Structure (目录结构规范)

在生成文件时，必须严格遵循此树状结构。

```text
/root
├── /backend
│   ├── /src
│   │   ├── /database
│   │   │   ├── init_db.js
│   │   │   ├── db.js
│   │   │   └── operations.js
│   │   ├── /routes
│   │   │   └── api.js
│   │   ├── /utils
│   │   │   └── response.js
│   │   └── index.js
│   ├── /test
│   │   └── ...                  # 结构与 src 镜像，命名遵循 *.test.*
│   ├── database.db
│   └── package.json
│
├── /frontend
│   ├── /src
│   │   ├── /api
│   │   │   └── index.js
│   │   ├── /components
│   │   ├── /pages
│   │   │   └── HomePage.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── /test
│   │   └── ...                  # 结构与 src 镜像，命名遵循 *.test.*
│   └── package.json
│
└── metadata.md
```

### Testing File Placement & Naming (测试文件放置与命名)

- 所有测试文件必须位于与 `src` 同级的 `test` 目录下，且目录结构与 `src` 镜像对应。
- 测试文件命名必须与被测文件名称相同，并在扩展名前添加 `.test`。
- 示例：
  - 被测文件：`frontend/src/pages/HomePage.tsx` → 测试文件：`frontend/test/pages/HomePage.test.tsx`
  - 被测文件：`backend/src/routes/api.js` → 测试文件：`backend/test/routes/api.test.js`

### Testing Runners (测试运行)

- Frontend：使用 `vitest` 与 `@testing-library/react`，命令：`npm run test`
- Backend：使用 `vitest` 与 `supertest`，命令：`npm run test`

-----

## 3. 静态资源规范 (Static Assets)

### 图片资源管理

**存放位置**:
- 需求参考图片: `requirements/images/`
- 前端静态资源: `frontend/public/images/`

**自动化处理**:
- MCP工具在设计阶段自动从需求文档提取图片
- 自动保存到 `frontend/public/images/` 目录
- Agent无需手动处理图片文件

**引用规范**:
```css
/* CSS中引用 */
background-image: url('/images/文件名.扩展名');
```

```tsx
/* React组件中引用 */
<img src="/images/文件名.扩展名" alt="描述" />
```

**注意事项**:
- 路径必须以 `/images/` 开头（相对于public目录）
- 不使用相对路径（`./` 或 `../`）
- 不使用base64内联（除非文件极小<2KB）
- Vite会自动处理public目录下的静态资源
