# UI 样式规范 - 车次列表页

> **文档说明**：本文档基于对 http://localhost:5173/trains 的 UI 分析生成，提供可直接使用的 CSS 代码和组件样式规范。

## 1. 颜色体系

### 1.1 主题色
```css
:root {
  /* 品牌色 */
  --primary-blue: rgb(59, 153, 252);      /* #3B99FC - 主导航背景色 */
  --primary-dark: rgb(33, 53, 71);        /* #213547 - 深色文本 */
  --secondary-blue: rgb(33, 150, 243);    /* #2196F3 - 链接色 */
  
  /* 文本颜色 */
  --text-primary: rgb(51, 51, 51);        /* #333333 - 主要文本 */
  --text-secondary: rgb(102, 102, 102);   /* #666666 - 次要文本 */
  --text-disabled: rgb(153, 153, 153);    /* #999999 - 禁用文本 */
  --text-placeholder: rgb(208, 208, 208); /* #D0D0D0 - 占位符 */
  
  /* 背景颜色 */
  --bg-white: rgb(255, 255, 255);         /* #FFFFFF - 白色背景 */
  --bg-light-gray: rgb(245, 245, 245);    /* #F5F5F5 - 浅灰背景 */
  --bg-light-blue: rgb(239, 241, 249);    /* #EFF1F9 - 淡蓝背景（查询栏） */
  
  /* 边框颜色 */
  --border-gray: rgb(224, 224, 224);      /* #E0E0E0 - 边框灰色 */
  --border-light: rgb(187, 187, 187);     /* #BBBBBB - 浅边框 */
  
  /* 状态颜色 */
  --success-green: rgb(82, 196, 26);      /* #52C41A - 成功/有票 */
  --error-red: rgb(211, 47, 47);          /* #D32F2F - 错误/无票 */
  --warning-orange: rgb(255, 102, 0);     /* #FF6600 - 警告/强调 */
}
```

### 1.2 颜色使用说明
- **主导航背景**：`var(--primary-blue)` 
- **按钮主色**：`var(--primary-blue)`
- **文本主色**：`var(--text-primary)`
- **灰色背景**：`var(--bg-light-gray)`（底部导航）
- **查询栏背景**：`var(--bg-light-blue)`
- **有票状态**：`var(--success-green)`
- **无票状态**：`var(--text-disabled)`

---

## 2. 页面布局

### 2.1 整体布局
```css
/* 页面容器 */
.train-list-page {
  width: 100%;
  min-height: 100vh;
  background-color: var(--bg-light-gray);
}

/* 内容居中容器 */
.page-content-container {
  max-width: 1512px; /* 实际测量宽度 */
  margin: 0 auto;
  padding: 0;
}
```

**布局结构**（从上到下）：
1. 顶部导航栏 (`.train-list-top-bar`) - 85px
2. 主导航菜单 (`.main-navigation`) - 46px
3. 查询条件栏 (`.train-search-bar`) - 82px
4. 筛选条件区域 (`.train-filter-panel`) - 283px
5. 车次列表 (`.train-list`) - 高度自适应
6. 底部导航 (`.bottom-navigation`) - 197px

---

## 3. 组件样式

### 3.1 顶部导航栏

#### 3.1.1 文件路径
- 组件: `frontend/src/components/TrainListTopBar/TrainListTopBar.tsx`
- 样式: `frontend/src/components/TrainListTopBar/TrainListTopBar.css`

#### 3.1.2 组件位置说明
- 位置: 页面最顶部
- 尺寸: 宽度100%（1512px），高度85px
- 布局: Flexbox 横向布局，居中对齐

#### 3.1.3 完整样式代码
```css
/* ========== 顶部导航栏容器 ========== */
/* 📸 参考截图: requirements/images/train-list/组件特写截图/顶部导航栏.png */
.train-list-top-bar {
  width: 100% !important;
  height: 85px !important;
  background-color: var(--bg-white) !important;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 3px 0px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 0 176px !important; /* 左右边距 */
}

/* Logo 区域 */
.train-list-top-bar .logo-section {
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
  cursor: pointer !important;
}

.train-list-top-bar .logo-section img {
  width: 60px !important;
  height: 60px !important;
  object-fit: contain !important;
}

.train-list-top-bar .logo-text {
  display: flex !important;
  flex-direction: column !important;
  gap: 4px !important;
}

.train-list-top-bar .logo-text-main {
  font-size: 20px !important;
  font-weight: 600 !important;
  color: var(--primary-dark) !important;
}

.train-list-top-bar .logo-text-sub {
  font-size: 12px !important;
  color: var(--text-secondary) !important;
  letter-spacing: 1px !important;
}

/* 搜索栏 */
.train-list-top-bar .search-bar {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
}

.train-list-top-bar .search-bar input {
  width: 240px !important;
  height: 36px !important;
  padding: 0 12px !important;
  border: 1px solid var(--border-gray) !important;
  border-radius: 4px !important;
  font-size: 14px !important;
  outline: none !important;
}

.train-list-top-bar .search-bar input:focus {
  border-color: var(--primary-blue) !important;
}

.train-list-top-bar .search-bar button {
  width: 36px !important;
  height: 36px !important;
  background-color: var(--primary-blue) !important;
  border: none !important;
  border-radius: 4px !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.train-list-top-bar .search-bar button:hover {
  background-color: rgb(33, 150, 243) !important;
}

.train-list-top-bar .search-bar button img {
  width: 30px !important;
  height: 30px !important;
}

/* 右侧功能区 */
.train-list-top-bar .action-links {
  display: flex !important;
  align-items: center !important;
  gap: 20px !important;
  font-size: 14px !important;
}

.train-list-top-bar .action-links a {
  color: var(--text-secondary) !important;
  text-decoration: none !important;
  transition: color 0.2s !important;
}

.train-list-top-bar .action-links a:hover {
  color: var(--primary-blue) !important;
}

.train-list-top-bar .user-info {
  color: var(--text-primary) !important;
}

.train-list-top-bar .user-info a {
  color: var(--primary-blue) !important;
  text-decoration: none !important;
}

.train-list-top-bar .user-info a:hover {
  text-decoration: underline !important;
}
```

---

### 3.2 主导航菜单

#### 3.2.1 文件路径
- 组件: `frontend/src/components/MainNavigation/MainNavigation.tsx`
- 样式: `frontend/src/components/MainNavigation/MainNavigation.css`

#### 3.2.2 组件位置说明
- 位置: 顶部导航栏下方
- 尺寸: 宽度100%（1512px），高度46px
- 布局: Flexbox 横向布局

#### 3.2.3 完整样式代码
```css
/* ========== 主导航菜单 ========== */
/* 📸 参考截图: requirements/images/train-list/组件特写截图/主导航菜单.png */
.main-navigation {
  width: 100% !important;
  height: 46px !important;
  background-color: var(--primary-blue) !important;
  display: flex !important;
  align-items: center !important;
}

.main-navigation .nav-container {
  max-width: 1512px !important;
  width: 100% !important;
  margin: 0 auto !important;
  padding: 0 176px !important;
  display: flex !important;
  align-items: center !important;
  gap: 32px !important;
}

.main-navigation a {
  color: white !important;
  text-decoration: none !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  padding: 0 4px !important;
  white-space: nowrap !important;
  transition: opacity 0.2s !important;
}

.main-navigation a:hover {
  opacity: 0.9 !important;
  text-decoration: underline !important;
}

/* 下拉箭头 */
.main-navigation .dropdown-arrow {
  font-size: 10px !important;
  margin-left: 4px !important;
}
```

---

### 3.3 查询条件栏

#### 3.3.1 文件路径
- 组件: `frontend/src/components/TrainSearchBar/TrainSearchBar.tsx`
- 样式: `frontend/src/components/TrainSearchBar/TrainSearchBar.css`

#### 3.3.2 组件位置说明
- 位置: 主导航菜单下方，页面内容区
- 尺寸: 宽度1160px（居中），高度82px
- 布局: Flexbox 横向布局，间距16px

#### 3.3.3 完整样式代码
```css
/* ========== 查询条件栏 ========== */
/* 📸 参考截图: requirements/images/train-list/组件特写截图/查询条件栏.png */
.train-search-bar {
  width: 1160px !important;
  margin: 0 auto !important;
  margin-top: 20px !important;
  padding: 16px !important;
  background-color: var(--bg-light-blue) !important;
  border-radius: 4px !important;
  display: flex !important;
  align-items: center !important;
  gap: 16px !important;
}

/* 单程/往返切换 */
.train-search-bar .trip-type-selector {
  display: flex !important;
  gap: 12px !important;
}

.train-search-bar .trip-type-option {
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
  cursor: pointer !important;
  font-size: 14px !important;
  color: var(--text-primary) !important;
}

.train-search-bar .trip-type-option input[type="radio"] {
  cursor: pointer !important;
}

/* 城市输入框 */
.train-search-bar .station-input {
  display: flex !important;
  flex-direction: column !important;
  gap: 4px !important;
}

.train-search-bar .station-input label {
  font-size: 12px !important;
  color: var(--text-secondary) !important;
}

.train-search-bar .station-input input {
  width: 140px !important;
  height: 36px !important;
  padding: 0 12px !important;
  border: 1px solid var(--border-gray) !important;
  border-radius: 4px !important;
  font-size: 14px !important;
  background-color: white !important;
  outline: none !important;
}

.train-search-bar .station-input input:focus {
  border-color: var(--primary-blue) !important;
}

/* 交换按钮 */
.train-search-bar .exchange-button {
  width: 32px !important;
  height: 32px !important;
  background-color: white !important;
  border: 1px solid var(--border-gray) !important;
  border-radius: 50% !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.2s !important;
}

.train-search-bar .exchange-button:hover {
  border-color: var(--primary-blue) !important;
  background-color: rgb(240, 248, 255) !important;
}

.train-search-bar .exchange-button img {
  width: 20px !important;
  height: 20px !important;
}

/* 日期选择器 */
.train-search-bar .date-input {
  display: flex !important;
  flex-direction: column !important;
  gap: 4px !important;
}

.train-search-bar .date-input label {
  font-size: 12px !important;
  color: var(--text-secondary) !important;
}

.train-search-bar .date-input input {
  width: 160px !important;
  height: 36px !important;
  padding: 0 12px !important;
  border: 1px solid var(--border-gray) !important;
  border-radius: 4px !important;
  font-size: 14px !important;
  background-color: white !important;
  cursor: pointer !important;
  outline: none !important;
}

.train-search-bar .date-input input:disabled {
  background-color: rgb(250, 250, 250) !important;
  color: var(--text-disabled) !important;
  cursor: not-allowed !important;
}

/* 普通/学生选择 */
.train-search-bar .passenger-type-selector {
  display: flex !important;
  gap: 12px !important;
}

.train-search-bar .passenger-type-option {
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
  cursor: pointer !important;
  font-size: 14px !important;
  color: var(--text-primary) !important;
}

/* 查询按钮 */
.train-search-bar .search-button {
  width: 100px !important;
  height: 40px !important;
  background-color: var(--primary-blue) !important;
  color: white !important;
  border: none !important;
  border-radius: 4px !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  cursor: pointer !important;
  transition: background-color 0.2s !important;
  margin-left: auto !important;
}

.train-search-bar .search-button:hover {
  background-color: rgb(33, 150, 243) !important;
}

.train-search-bar .search-button:active {
  background-color: rgb(25, 118, 210) !important;
}
```

---

### 3.4 筛选条件区域

#### 3.4.1 文件路径
- 组件: `frontend/src/components/TrainFilterPanel/TrainFilterPanel.tsx`
- 样式: `frontend/src/components/TrainFilterPanel/TrainFilterPanel.css`

#### 3.4.2 组件位置说明
- 位置: 查询条件栏下方
- 尺寸: 宽度1160px（居中），高度283px
- 布局: 多行布局，包含日期选择、车次类型、车站、席别筛选

#### 3.4.3 完整样式代码
```css
/* ========== 筛选条件区域 ========== */
/* 📸 参考截图: requirements/images/train-list/组件特写截图/筛选条件区域.png */
.train-filter-panel {
  width: 1160px !important;
  margin: 16px auto !important;
  background-color: white !important;
  border-radius: 4px !important;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 3px 0px !important;
  padding: 16px !important;
}

/* 日期快捷选择 */
.train-filter-panel .date-shortcuts {
  display: flex !important;
  gap: 8px !important;
  padding: 12px 0 !important;
  border-bottom: 1px solid var(--bg-light-gray) !important;
  flex-wrap: wrap !important;
}

.train-filter-panel .date-shortcuts button {
  padding: 6px 16px !important;
  border: 1px solid var(--border-gray) !important;
  border-radius: 4px !important;
  background-color: white !important;
  font-size: 14px !important;
  color: var(--text-primary) !important;
  cursor: pointer !important;
  transition: all 0.2s !important;
}

.train-filter-panel .date-shortcuts button:hover {
  border-color: var(--primary-blue) !important;
  color: var(--primary-blue) !important;
}

.train-filter-panel .date-shortcuts button.active {
  background-color: var(--primary-blue) !important;
  border-color: var(--primary-blue) !important;
  color: white !important;
}

/* 筛选条件行 */
.train-filter-panel .filter-row {
  display: flex !important;
  padding: 16px 0 !important;
  border-bottom: 1px solid var(--bg-light-gray) !important;
  gap: 16px !important;
}

.train-filter-panel .filter-row:last-child {
  border-bottom: none !important;
}

/* 筛选标签 */
.train-filter-panel .filter-label {
  font-size: 14px !important;
  color: var(--text-primary) !important;
  font-weight: 500 !important;
  white-space: nowrap !important;
  min-width: 100px !important;
}

/* 全部按钮 */
.train-filter-panel .all-button {
  padding: 6px 16px !important;
  border: 1px solid var(--border-gray) !important;
  border-radius: 4px !important;
  background-color: white !important;
  font-size: 14px !important;
  color: var(--text-primary) !important;
  cursor: pointer !important;
  transition: all 0.2s !important;
}

.train-filter-panel .all-button.active {
  background-color: var(--primary-blue) !important;
  border-color: var(--primary-blue) !important;
  color: white !important;
}

/* 筛选选项容器 */
.train-filter-panel .filter-options {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 12px !important;
  flex: 1 !important;
}

/* 筛选选项（复选框样式） */
.train-filter-panel .filter-option {
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
  cursor: pointer !important;
  font-size: 14px !important;
  color: var(--text-primary) !important;
}

.train-filter-panel .filter-option input[type="checkbox"] {
  cursor: pointer !important;
  width: 16px !important;
  height: 16px !important;
}

.train-filter-panel .filter-option label {
  cursor: pointer !important;
}

/* 发车时间下拉选择器 */
.train-filter-panel .time-selector {
  position: relative !important;
}

.train-filter-panel .time-selector select {
  width: 180px !important;
  height: 32px !important;
  padding: 0 30px 0 12px !important;
  border: 1px solid var(--border-gray) !important;
  border-radius: 4px !important;
  background-color: white !important;
  font-size: 14px !important;
  color: var(--text-primary) !important;
  cursor: pointer !important;
  outline: none !important;
  appearance: none !important;
}

.train-filter-panel .time-selector select:focus {
  border-color: var(--primary-blue) !important;
}

/* 筛选按钮 */
.train-filter-panel .filter-submit-button {
  width: 100px !important;
  height: 36px !important;
  background-color: var(--warning-orange) !important;
  color: white !important;
  border: none !important;
  border-radius: 4px !important;
  font-size: 14px !important;
  cursor: pointer !important;
  margin-left: auto !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 4px !important;
}

.train-filter-panel .filter-submit-button:hover {
  background-color: rgb(255, 133, 51) !important;
}
```

---

### 3.5 车次列表

#### 3.5.1 文件路径
- 组件: `frontend/src/components/TrainList/TrainList.tsx`
- 样式: `frontend/src/components/TrainList/TrainList.css`

#### 3.5.2 组件位置说明
- 位置: 筛选条件区域下方
- 尺寸: 宽度1160px（居中），高度自适应
- 布局: 表格布局，显示车次信息

#### 3.5.3 完整样式代码
```css
/* ========== 车次列表 ========== */
/* 📸 参考截图: requirements/images/train-list/组件特写截图/车次列表.png */
.train-list {
  width: 1160px !important;
  margin: 0 auto 20px !important;
  background-color: white !important;
  border-radius: 4px !important;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 3px 0px !important;
}

/* 顶部信息栏 */
.train-list .list-header-info {
  padding: 16px !important;
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  border-bottom: 1px solid var(--bg-light-gray) !important;
}

.train-list .route-info {
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
  font-size: 16px !important;
  font-weight: 500 !important;
}

.train-list .train-count {
  color: var(--text-secondary) !important;
  font-size: 14px !important;
}

.train-list .transfer-tip {
  color: var(--text-secondary) !important;
  font-size: 12px !important;
}

.train-list .display-options {
  display: flex !important;
  gap: 16px !important;
  font-size: 14px !important;
}

.train-list .display-option {
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
  cursor: pointer !important;
  color: var(--text-secondary) !important;
}

/* 表头 */
.train-list .list-header {
  display: grid !important;
  grid-template-columns: 100px 180px 140px 120px repeat(11, 1fr) 80px !important;
  padding: 12px 16px !important;
  background-color: var(--bg-light-gray) !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  color: var(--text-secondary) !important;
  border-bottom: 1px solid var(--border-gray) !important;
}

.train-list .list-header-cell {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 4px !important;
  text-align: center !important;
  cursor: pointer !important;
}

.train-list .list-header-cell.sortable:hover {
  color: var(--primary-blue) !important;
}

.train-list .sort-arrow {
  font-size: 10px !important;
}

/* 车次行 */
.train-list .train-row {
  display: grid !important;
  grid-template-columns: 100px 180px 140px 120px repeat(11, 1fr) 80px !important;
  padding: 16px !important;
  border-bottom: 1px solid var(--bg-light-gray) !important;
  align-items: center !important;
  transition: background-color 0.2s !important;
}

.train-list .train-row:hover {
  background-color: rgb(250, 251, 252) !important;
}

/* 车次号 */
.train-list .train-number {
  font-size: 16px !important;
  font-weight: 600 !important;
  color: var(--primary-blue) !important;
  cursor: pointer !important;
}

.train-list .train-type-badge {
  display: inline-block !important;
  padding: 2px 6px !important;
  background-color: var(--bg-light-blue) !important;
  border-radius: 4px !important;
  font-size: 12px !important;
  color: var(--text-primary) !important;
  margin-top: 4px !important;
}

/* 车站信息 */
.train-list .station-info {
  display: flex !important;
  flex-direction: column !important;
  gap: 4px !important;
}

.train-list .station-label {
  font-size: 12px !important;
  color: var(--text-secondary) !important;
}

.train-list .station-name {
  font-size: 14px !important;
  color: var(--text-primary) !important;
  font-weight: 500 !important;
}

/* 时间信息 */
.train-list .time-info {
  display: flex !important;
  flex-direction: column !important;
  gap: 4px !important;
  text-align: center !important;
}

.train-list .departure-time,
.train-list .arrival-time {
  font-size: 18px !important;
  font-weight: 600 !important;
  color: var(--text-primary) !important;
}

/* 历时 */
.train-list .duration-info {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  gap: 4px !important;
}

.train-list .duration {
  font-size: 14px !important;
  color: var(--text-primary) !important;
}

.train-list .arrival-day {
  font-size: 12px !important;
  color: var(--text-secondary) !important;
}

/* 座位余票 */
.train-list .seat-availability {
  font-size: 13px !important;
  font-weight: 600 !important;
  text-align: center !important;
}

.train-list .seat-availability.has-tickets {
  color: var(--success-green) !important;
}

.train-list .seat-availability.no-tickets {
  color: var(--text-disabled) !important;
}

.train-list .seat-availability.not-available {
  color: var(--text-disabled) !important;
}

/* 预订按钮 */
.train-list .book-button {
  width: 60px !important;
  height: 32px !important;
  background-color: var(--warning-orange) !important;
  color: white !important;
  border: none !important;
  border-radius: 4px !important;
  font-size: 14px !important;
  cursor: pointer !important;
  transition: background-color 0.2s !important;
}

.train-list .book-button:hover {
  background-color: rgb(255, 133, 51) !important;
}

.train-list .book-button:disabled {
  background-color: var(--border-gray) !important;
  color: var(--text-disabled) !important;
  cursor: not-allowed !important;
}

/* 空状态 */
.train-list .empty-state {
  padding: 60px 20px !important;
  text-align: center !important;
  min-height: 400px !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
}

.train-list .empty-icon {
  font-size: 48px !important;
  color: var(--text-placeholder) !important;
  margin-bottom: 24px !important;
}

.train-list .empty-message {
  font-size: 18px !important;
  font-weight: 500 !important;
  color: var(--text-secondary) !important;
  margin-bottom: 12px !important;
}

.train-list .empty-tip {
  font-size: 14px !important;
  color: var(--text-disabled) !important;
}
```

---

### 3.6 底部导航

#### 3.6.1 文件路径
- 组件: `frontend/src/components/BottomNavigation/BottomNavigation.tsx`
- 样式: `frontend/src/components/BottomNavigation/BottomNavigation.css`

#### 3.6.2 组件位置说明
- 位置: 页面底部
- 尺寸: 宽度100%（1512px），高度197px
- 布局: Flexbox，包含友情链接和二维码区域

#### 3.6.3 完整样式代码
```css
/* ========== 底部导航 ========== */
/* 📸 参考截图: requirements/images/train-list/组件特写截图/底部导航.png */
.bottom-navigation {
  width: 100% !important;
  background-color: var(--bg-light-gray) !important;
  padding: 40px 0 !important;
  margin-top: auto !important;
}

.bottom-navigation .footer-container {
  max-width: 1160px !important;
  margin: 0 auto !important;
  display: flex !important;
  justify-content: space-between !important;
  align-items: flex-start !important;
}

/* 友情链接区域 */
.bottom-navigation .friend-links-section {
  flex: 1 !important;
}

.bottom-navigation .friend-links-section h3 {
  font-size: 16px !important;
  font-weight: 500 !important;
  color: var(--text-primary) !important;
  margin-bottom: 16px !important;
}

.bottom-navigation .friend-links-grid {
  display: grid !important;
  grid-template-columns: repeat(2, 1fr) !important;
  gap: 16px !important;
}

.bottom-navigation .friend-link-item img {
  height: 30px !important;
  width: 176px !important;
  object-fit: contain !important;
}

/* 二维码区域 */
.bottom-navigation .qr-code-section {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  gap: 16px !important;
}

.bottom-navigation .qr-code-labels {
  display: flex !important;
  gap: 24px !important;
  font-size: 12px !important;
  color: var(--text-secondary) !important;
  text-align: center !important;
}

.bottom-navigation .qr-code-labels span {
  width: 80px !important;
}

.bottom-navigation .qr-code-grid {
  display: flex !important;
  gap: 12px !important;
}

.bottom-navigation .qr-code-item img {
  width: 80px !important;
  height: 80px !important;
  object-fit: cover !important;
  border-radius: 4px !important;
}

.bottom-navigation .disclaimer {
  max-width: 400px !important;
  font-size: 12px !important;
  color: var(--text-secondary) !important;
  text-align: center !important;
  margin-top: 12px !important;
  line-height: 1.5 !important;
}
```

---

## 4. 使用说明

### 4.1 CSS 变量使用
所有颜色值都通过 CSS 变量定义在 `:root` 中，方便统一管理和主题切换。使用时直接引用变量即可：

```css
.my-component {
  color: var(--text-primary);
  background-color: var(--bg-white);
  border-color: var(--border-gray);
}
```

### 4.2 响应式设计建议
当前样式基于 1512px 宽度设计，建议添加以下媒体查询：

```css
/* 大屏幕 (>1600px) */
@media (min-width: 1600px) {
  .page-content-container {
    max-width: 1600px;
  }
}

/* 中等屏幕 (1200px-1512px) */
@media (max-width: 1512px) {
  .train-list-top-bar,
  .train-search-bar,
  .train-filter-panel,
  .train-list {
    width: 96%;
    margin-left: auto;
    margin-right: auto;
  }
}

/* 小屏幕 (<1200px) */
@media (max-width: 1200px) {
  /* 调整布局为垂直排列 */
}
```

### 4.3 验证清单

使用本样式规范时，请确保：

- [ ] 已导入所有CSS变量（`:root` 部分）
- [ ] 所有组件类名与样式表匹配
- [ ] 图片资源路径正确（参考 `metadata.json`）
- [ ] 字体大小、颜色与设计一致
- [ ] 布局尺寸与参考截图匹配
- [ ] 交互状态（hover、active、disabled）已实现
- [ ] 响应式设计已添加（如需要）

---

**文档生成时间**: 2026-01-16  
**参考页面**: http://localhost:5173/trains  
**截图目录**: `requirements/images/train-list/`
