# UI 样式规范 - 首页（车票查询页）

**生成时间**: 2026-01-15  
**页面URL**: http://localhost:5173/  
**由 UI Analyzer Agent 自动生成**

---

## 目录

1. [颜色体系](#1-颜色体系)
2. [顶部导航栏](#2-顶部导航栏)
3. [车票查询表单](#3-车票查询表单)
4. [宣传推广区域](#4-宣传推广区域)
5. [底部导航](#5-底部导航)
6. [使用说明](#6-使用说明)

---

## 1. 颜色体系

### 1.1 主题色

```css
/* 品牌蓝 - 主导航、链接、搜索按钮 */
--primary-blue: rgb(59, 153, 252); /* #3B99FC */

/* 强调橙 - 查询按钮、重要操作 */
--primary-orange: rgb(255, 119, 0); /* #FF7700 */
--primary-orange-alt: rgb(255, 128, 1); /* #FF8001 */

/* 白色 */
--color-white: rgb(255, 255, 255); /* #FFFFFF */
```

### 1.2 文本颜色

```css
/* 深色文本 - 主要文字 */
--text-primary: rgb(0, 0, 0); /* #000000 */

/* 中灰文本 - 次要文字、占位符 */
--text-secondary: rgb(153, 153, 153); /* #999999 */

/* 链接文字 */
--text-link: rgb(59, 153, 252); /* #3B99FC */

/* 白色文字 - 按钮、深色背景上的文字 */
--text-white: rgb(255, 255, 255); /* #FFFFFF */
```

### 1.3 背景颜色

```css
/* 页面背景 - 浅灰色 */
--bg-page: rgb(245, 245, 245); /* #F5F5F5 */

/* 白色背景 - 卡片、表单 */
--bg-white: rgb(255, 255, 255); /* #FFFFFF */
```

### 1.4 边框颜色

```css
/* 常规边框 - 输入框、分隔线 */
--border-default: rgb(208, 208, 208); /* #D0D0D0 */

/* 分隔线 */
--border-divider: rgb(208, 213, 232); /* #D0D5E8 */
```

### 1.5 状态颜色（根据需求文档）

```css
/* 错误状态 - 表单验证错误 */
--status-error-text: #d32f2f; /* 红色文字 */
--status-error-bg: #ffebee; /* 浅红色背景 */
```

---

## 2. 顶部导航栏

### 2.1 文件路径

- 组件: `frontend/src/components/HomeTopBar/HomeTopBar.tsx`
- 样式: `frontend/src/components/HomeTopBar/HomeTopBar.css`

### 2.2 组件位置说明

- 位置: 页面顶部，横向占据整个页面宽度
- 尺寸: 1400px宽（内容区域） × 84px高
- 布局: Flexbox 横向布局，三个主要区域（Logo、搜索框、链接/按钮）

### 2.3 完整样式代码

```css
/* ========== 顶部导航栏容器 ========== */
/* 📸 参考截图: requirements/images/homepage/组件特写截图/顶部导航栏.png */

.home-top-bar-container {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  padding: 12px 40px !important;
  background-color: transparent !important;
  width: 100% !important;
  height: 84px !important;
}

/* ========== Logo区域 ========== */
.home-logo-section {
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
}

.home-logo-image {
  width: 60px !important;
  height: 60px !important;
  object-fit: contain !important;
}

.home-logo-text {
  display: flex !important;
  flex-direction: column !important;
  gap: 2px !important;
}

.home-logo-chinese {
  font-size: 18px !important;
  font-weight: 600 !important;
  color: #000000 !important;
  line-height: 1.2 !important;
}

.home-logo-english {
  font-size: 12px !important;
  font-weight: 400 !important;
  color: #999999 !important;
  line-height: 1.2 !important;
}

/* ========== 搜索框区域 ========== */
.home-search-box {
  display: flex !important;
  align-items: center !important;
  background-color: #ffffff !important;
  border: 1px solid #d0d0d0 !important;
  border-radius: 4px !important;
  overflow: hidden !important;
  min-width: 400px !important;
}

.home-search-input {
  flex: 1 !important;
  border: none !important;
  outline: none !important;
  padding: 10px 16px !important;
  font-size: 14px !important;
  color: #000000 !important;
}

.home-search-input::placeholder {
  color: #999999 !important;
}

.home-search-button {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 8px 16px !important;
  background-color: #3B99FC !important;
  border: none !important;
  cursor: pointer !important;
  transition: background-color 0.2s !important;
}

.home-search-button:hover {
  background-color: #2b89ec !important;
}

.home-search-icon {
  width: 30px !important;
  height: 30px !important;
}

/* ========== 顶部链接区域 ========== */
.home-top-links {
  display: flex !important;
  align-items: center !important;
  gap: 24px !important;
}

.home-top-link {
  font-size: 14px !important;
  color: #3B99FC !important;
  text-decoration: none !important;
  transition: opacity 0.2s !important;
}

.home-top-link:hover {
  opacity: 0.8 !important;
}

/* ========== 登录/注册按钮 ========== */
.home-top-auth-link {
  padding: 8px 20px !important;
  font-size: 14px !important;
  border-radius: 4px !important;
  border: 1px solid #3B99FC !important;
  cursor: pointer !important;
  transition: all 0.2s !important;
}

.home-top-auth-link.login {
  background-color: transparent !important;
  color: #3B99FC !important;
}

.home-top-auth-link.login:hover {
  background-color: #3B99FC !important;
  color: #ffffff !important;
}

.home-top-auth-link.register {
  background-color: #3B99FC !important;
  color: #ffffff !important;
}

.home-top-auth-link.register:hover {
  background-color: #2b89ec !important;
}
```

### 2.4 React组件示例

```tsx
import React from 'react';
import './HomeTopBar.css';

const HomeTopBar: React.FC = () => {
  return (
    <div className="home-top-bar-container">
      {/* Logo区域 */}
      <div className="home-logo-section">
        <img 
          src="/images/logo.png" 
          alt="中国铁路12306" 
          className="home-logo-image" 
        />
        <div className="home-logo-text">
          <div className="home-logo-chinese">中国铁路12306</div>
          <div className="home-logo-english">12306 CHINA RAILWAY</div>
        </div>
      </div>

      {/* 搜索框 */}
      <div className="home-search-box">
        <input 
          type="text" 
          className="home-search-input" 
          placeholder="搜索车票、餐饮、常旅客、相关规章" 
        />
        <button className="home-search-button">
          <img 
            src="/images/search.svg" 
            alt="搜索" 
            className="home-search-icon" 
          />
        </button>
      </div>

      {/* 顶部链接 */}
      <div className="home-top-links">
        <a href="#" className="home-top-link">无障碍</a>
        <a href="#" className="home-top-link">敬老版</a>
        <a href="#" className="home-top-link">English</a>
        <a href="#" className="home-top-link">我的12306</a>
        <button className="home-top-auth-link login">登录</button>
        <button className="home-top-auth-link register">注册</button>
      </div>
    </div>
  );
};

export default HomeTopBar;
```

### 2.5 验证清单

- [ ] Logo图片尺寸为 60×60px
- [ ] 搜索图标尺寸为 30×30px
- [ ] 搜索框最小宽度为 400px
- [ ] 登录按钮为透明背景，蓝色边框和文字
- [ ] 注册按钮为蓝色背景，白色文字
- [ ] 所有元素间距与截图一致

---

## 3. 车票查询表单

### 3.1 文件路径

- 组件: `frontend/src/components/TrainSearchForm/TrainSearchForm.tsx`
- 样式: `frontend/src/components/TrainSearchForm/TrainSearchForm.css`

### 3.2 组件位置说明

- 位置: 页面中上部，垂直居中
- 尺寸: 1512px宽 × 425px高（包含背景区域）
- 布局: 左侧蓝色标签页 + 右侧白色表单卡片

### 3.3 完整样式代码

```css
/* ========== 查询表单容器 ========== */
/* 📸 参考截图: requirements/images/homepage/组件特写截图/车票查询表单.png */

.home-search-container {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  padding: 60px 0 !important;
  width: 100% !important;
}

.home-search-wrapper {
  display: flex !important;
  gap: 0 !important;
  max-width: 1220px !important;
  width: 100% !important;
}

/* ========== 左侧蓝色标签页 ========== */
.form-sidebar {
  display: flex !important;
  flex-direction: column !important;
  background-color: #3B99FC !important;
  border-radius: 8px 0 0 8px !important;
  overflow: hidden !important;
}

.sidebar-tab {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 20px 24px !important;
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: #ffffff !important;
  font-size: 16px !important;
  border: none !important;
  cursor: pointer !important;
  transition: background-color 0.2s !important;
  gap: 8px !important;
}

.sidebar-tab.active {
  background-color: #ffffff !important;
  color: #3B99FC !important;
}

.sidebar-tab:hover:not(.active) {
  background-color: rgba(255, 255, 255, 0.2) !important;
}

.sidebar-icon {
  display: inline-block !important;
  width: 24px !important;
  height: 24px !important;
  /* Icon样式通过class区分: sidebar-icon-train, sidebar-icon-query, sidebar-icon-meal */
}

/* ========== 表单主体（白色卡片） ========== */
.search-form-container {
  flex: 1 !important;
  background-color: #ffffff !important;
  border-radius: 0 8px 8px 0 !important;
  padding: 24px 32px !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08) !important;
}

/* ========== 顶部标签页（单程/往返等） ========== */
.form-tabs {
  display: flex !important;
  gap: 16px !important;
  margin-bottom: 24px !important;
  border-bottom: 1px solid #f0f0f0 !important;
  padding-bottom: 12px !important;
}

.form-tab-button {
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
  padding: 8px 16px !important;
  background-color: transparent !important;
  border: none !important;
  font-size: 16px !important;
  color: #666666 !important;
  cursor: pointer !important;
  transition: color 0.2s !important;
  position: relative !important;
}

.form-tab-button.active {
  color: #3B99FC !important;
  font-weight: 600 !important;
}

.form-tab-button.active::after {
  content: '' !important;
  position: absolute !important;
  bottom: -12px !important;
  left: 0 !important;
  right: 0 !important;
  height: 3px !important;
  background-color: #3B99FC !important;
}

.form-tab-icon {
  display: inline-block !important;
  width: 18px !important;
  height: 18px !important;
  /* Icon样式通过class区分 */
}

/* ========== 城市输入区域 ========== */
.stations-container {
  display: flex !important;
  align-items: center !important;
  gap: 16px !important;
  margin-bottom: 20px !important;
}

.train-search-row-horizontal {
  flex: 1 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 8px !important;
}

.field-label-left {
  font-size: 14px !important;
  color: #333333 !important;
  font-weight: 500 !important;
}

.input-with-icon {
  position: relative !important;
}

.station-input {
  width: 100% !important;
}

.station-input-field {
  width: 100% !important;
  padding: 12px 40px 12px 16px !important;
  font-size: 16px !important;
  border: 1px solid #d0d0d0 !important;
  border-radius: 4px !important;
  outline: none !important;
  transition: border-color 0.2s !important;
}

.station-input-field:focus {
  border-color: #3B99FC !important;
}

.station-input-field::placeholder {
  color: #999999 !important;
}

.location-icon {
  position: absolute !important;
  right: 12px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  width: 18px !important;
  height: 18px !important;
  pointer-events: none !important;
}

/* ========== 交换按钮 ========== */
.connector-wrapper {
  position: relative !important;
  width: 40px !important;
  height: 90px !important;
  margin-top: 24px !important;
}

.connector-line {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
}

.swap-button-center {
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  width: 36px !important;
  height: 36px !important;
  background-color: #ffffff !important;
  border: 2px solid #3B99FC !important;
  border-radius: 50% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer !important;
  transition: all 0.2s !important;
}

.swap-button-center:hover {
  background-color: #3B99FC !important;
}

.swap-icon {
  display: inline-block !important;
  width: 20px !important;
  height: 20px !important;
  /* 交换图标样式 */
}

/* ========== 日期选择器 ========== */
.date-row {
  margin-bottom: 20px !important;
}

.date-picker {
  position: relative !important;
}

.date-input {
  width: 100% !important;
  padding: 12px 40px 12px 16px !important;
  font-size: 16px !important;
  border: 1px solid #d0d0d0 !important;
  border-radius: 4px !important;
  outline: none !important;
  cursor: pointer !important;
  background-color: #ffffff !important;
}

.date-input:focus {
  border-color: #3B99FC !important;
}

.calendar-icon {
  position: absolute !important;
  right: 12px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  width: 16px !important;
  height: 16px !important;
  pointer-events: none !important;
  color: #999999 !important;
}

/* ========== 复选框选项（学生/高铁动车） ========== */
.train-search-options {
  display: flex !important;
  gap: 24px !important;
  margin-bottom: 24px !important;
}

.checkbox-label {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  font-size: 14px !important;
  color: #333333 !important;
  cursor: pointer !important;
}

.checkbox-label input[type="checkbox"] {
  width: 18px !important;
  height: 18px !important;
  cursor: pointer !important;
}

/* ========== 查询按钮 ========== */
.train-search-button {
  width: 100% !important;
  padding: 14px 0 !important;
  background-color: #FF7700 !important;
  color: #ffffff !important;
  font-size: 18px !important;
  font-weight: 600 !important;
  border: none !important;
  border-radius: 4px !important;
  cursor: pointer !important;
  transition: background-color 0.2s !important;
  letter-spacing: 4px !important;
}

.train-search-button:hover {
  background-color: #e66900 !important;
}

/* ========== 错误提示样式 ========== */
/* 📸 参考截图1: requirements/images/homepage/交互状态截图/车票查询表单-错误-出发地为空.png */
/* 📸 参考截图2: requirements/images/homepage/交互状态截图/车票查询表单-错误-目的地为空.png */
/* ⚠️ 以下样式基于实际 DOM 提取，与需求文档规范完全一致 */

.train-search-error-message {
  display: none !important; /* 默认隐藏 */
  padding: 10px 0px !important;
  margin: 5px 15px !important;
  background-color: rgb(255, 235, 238) !important; /* #ffebee */
  color: rgb(211, 47, 47) !important; /* #d32f2f */
  font-size: 13px !important;
  font-weight: 400 !important;
  text-align: center !important;
  border-radius: 0px !important;
}

.train-search-error-message.show {
  display: block !important;
}

/* ========== 日期选择器样式 ========== */
/* 📸 参考截图: requirements/images/homepage/交互状态截图/车票查询表单-日期选择器展开.png */

.date-picker-dropdown {
  position: absolute !important;
  top: 100% !important;
  left: 0 !important;
  z-index: 1000 !important;
  background-color: #ffffff !important;
  border: 1px solid #d0d0d0 !important;
  border-radius: 4px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  padding: 16px !important;
  margin-top: 4px !important;
}

.date-picker-header {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  margin-bottom: 12px !important;
}

.date-picker-month {
  font-size: 16px !important;
  font-weight: 600 !important;
  color: #333333 !important;
}

.date-picker-nav-button {
  width: 32px !important;
  height: 32px !important;
  border: none !important;
  background-color: transparent !important;
  color: #666666 !important;
  font-size: 18px !important;
  cursor: pointer !important;
  border-radius: 4px !important;
  transition: background-color 0.2s !important;
}

.date-picker-nav-button:hover {
  background-color: #f5f5f5 !important;
}

.date-picker-calendar {
  display: grid !important;
  grid-template-columns: repeat(7, 1fr) !important;
  gap: 4px !important;
}

.date-picker-weekday {
  text-align: center !important;
  font-size: 12px !important;
  color: #999999 !important;
  padding: 4px !important;
}

.date-picker-day {
  text-align: center !important;
  font-size: 14px !important;
  padding: 8px !important;
  cursor: pointer !important;
  border-radius: 4px !important;
  transition: background-color 0.2s !important;
}

.date-picker-day.today {
  color: #3B99FC !important;
  font-weight: 600 !important;
}

.date-picker-day.disabled {
  color: #cccccc !important;
  cursor: not-allowed !important;
}

.date-picker-day:not(.disabled):hover {
  background-color: #e3f2fd !important;
}

.date-picker-day.selected {
  background-color: #3B99FC !important;
  color: #ffffff !important;
}

.date-picker-today-button {
  width: 100% !important;
  padding: 8px !important;
  margin-top: 12px !important;
  background-color: transparent !important;
  border: 1px solid #3B99FC !important;
  color: #3B99FC !important;
  font-size: 14px !important;
  border-radius: 4px !important;
  cursor: pointer !important;
  transition: all 0.2s !important;
}

.date-picker-today-button:hover {
  background-color: #3B99FC !important;
  color: #ffffff !important;
}
```

### 3.4 验证清单

- [ ] 左侧蓝色标签页高度与表单主体一致
- [ ] 激活标签页为白色背景，蓝色文字
- [ ] 输入框边框为 #d0d0d0，焦点时为 #3B99FC
- [ ] 交换按钮为圆形，白色背景，蓝色边框
- [ ] 查询按钮为橙色背景（#FF7700），白色文字
- [ ] 查询按钮文字间距为 4px（"查 询"）

---

## 4. 宣传推广区域

### 4.1 文件路径

- 组件: `frontend/src/components/PromoGrid/PromoGrid.tsx`
- 样式: `frontend/src/components/PromoGrid/PromoGrid.css`

### 4.2 组件位置说明

- 位置: 查询表单下方
- 尺寸: 1220px宽 × 345px高
- 布局: CSS Grid 2行2列

### 4.3 完整样式代码

```css
/* ========== 宣传推广区域 ========== */
/* 📸 参考截图: requirements/images/homepage/组件特写截图/宣传推广区域.png */

.home-promo-grid {
  display: grid !important;
  grid-template-columns: repeat(2, 1fr) !important;
  gap: 20px !important;
  max-width: 1220px !important;
  margin: 40px auto !important;
}

.home-promo-card {
  position: relative !important;
  overflow: hidden !important;
  border-radius: 8px !important;
  cursor: pointer !important;
  transition: transform 0.2s, box-shadow 0.2s !important;
}

.home-promo-card:hover {
  transform: translateY(-4px) !important;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12) !important;
}

.home-promo-image {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  display: block !important;
}
```

### 4.4 React组件示例

```tsx
import React from 'react';
import './PromoGrid.css';

const PromoGrid: React.FC = () => {
  const promoCards = [
    { src: '/images/首页-会员服务-左上.jpg', alt: '会员服务' },
    { src: '/images/首页-餐饮特产-右上.jpg', alt: '餐饮特产' },
    { src: '/images/首页-铁路保险-左下.jpg', alt: '铁路保险' },
    { src: '/images/首页-计次定期票-右下.png', alt: '计次定期票' },
  ];

  return (
    <div className="home-promo-grid">
      {promoCards.map((card, index) => (
        <div key={index} className="home-promo-card">
          <img 
            src={card.src} 
            alt={card.alt} 
            className="home-promo-image" 
          />
        </div>
      ))}
    </div>
  );
};

export default PromoGrid;
```

### 4.5 验证清单

- [ ] Grid布局为 2行2列
- [ ] 卡片间距为 20px
- [ ] 卡片悬停时向上移动 4px
- [ ] 卡片悬停时显示阴影效果
- [ ] 所有图片使用 `object-fit: cover`

---

## 5. 底部导航

### 5.1 文件路径

- 组件: `frontend/src/components/BottomNav/BottomNav.tsx`
- 样式: `frontend/src/components/BottomNav/BottomNav.css`

### 5.2 组件位置说明

- 位置: 页面最底部
- 尺寸: 100%宽 × 197px高
- 布局: 左右并排（友情链接 + 二维码）

### 5.3 完整样式代码

```css
/* ========== 底部导航 ========== */
/* 📸 参考截图: requirements/images/homepage/组件特写截图/底部导航.png */

.bottom-navigation {
  background-color: #F5F5F5 !important;
  padding: 40px 0 !important;
  width: 100% !important;
}

.bottom-content {
  max-width: 1220px !important;
  margin: 0 auto !important;
  display: flex !important;
  justify-content: space-between !important;
  align-items: flex-start !important;
}

/* ========== 友情链接区域 ========== */
.friendship-links-section {
  flex: 0 0 auto !important;
}

.section-title {
  font-size: 18px !important;
  font-weight: 600 !important;
  color: #333333 !important;
  margin-bottom: 16px !important;
}

.friendship-links-grid {
  display: grid !important;
  grid-template-columns: repeat(2, 176px) !important;
  gap: 16px 24px !important;
}

.friendship-link-item img {
  width: 176px !important;
  height: 30px !important;
  object-fit: contain !important;
  display: block !important;
}

/* ========== 二维码区域 ========== */
.qr-codes-section {
  flex: 0 0 auto !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 16px !important;
}

.qr-codes-wrapper {
  display: flex !important;
  flex-direction: column !important;
  gap: 12px !important;
}

.qr-code-row {
  display: flex !important;
  gap: 16px !important;
}

.qr-label {
  font-size: 12px !important;
  color: #666666 !important;
  text-align: center !important;
  width: 80px !important;
}

.qr-code-item {
  width: 80px !important;
  height: 80px !important;
}

.qr-code-item img {
  width: 100% !important;
  height: 100% !important;
  display: block !important;
}

.qr-code-footer {
  margin-top: 12px !important;
}

.qr-code-footer p {
  font-size: 12px !important;
  color: #999999 !important;
  line-height: 1.6 !important;
  max-width: 400px !important;
}
```

### 5.4 验证清单

- [ ] 背景色为 #F5F5F5
- [ ] 友情链接Logo尺寸为 176×30px，2行2列
- [ ] 二维码尺寸为 80×80px，横向排列
- [ ] 二维码标签文字大小为 12px
- [ ] 底部提示文字大小为 12px，颜色为 #999999

---

## 6. 使用说明

### 6.1 集成步骤

1. **安装依赖**（如需要）
   ```bash
   npm install react react-dom
   ```

2. **复制样式文件**
   - 将本文档中的 CSS 代码复制到对应组件的 CSS 文件中
   - 确保所有 `!important` 标记保留，以确保样式优先级

3. **引入图片资源**
   - 将 `requirements/images/homepage/` 目录下的所有图片复制到项目的 `public/images/` 目录
   - 确保图片路径与代码中的路径一致

4. **创建React组件**
   - 参考本文档中的React组件示例代码
   - 根据实际需求调整组件逻辑

### 6.2 响应式设计建议

虽然本文档基于 1512px 宽度设计，但建议添加以下媒体查询以支持不同屏幕尺寸：

```css
/* 平板设备 */
@media (max-width: 1024px) {
  .home-search-wrapper {
    max-width: 90%;
  }
  
  .home-promo-grid {
    grid-template-columns: 1fr;
  }
}

/* 移动设备 */
@media (max-width: 768px) {
  .home-top-bar-container {
    flex-direction: column;
    height: auto;
    padding: 12px 16px;
  }
  
  .form-sidebar {
    flex-direction: row;
    border-radius: 8px 8px 0 0;
  }
  
  .search-form-container {
    border-radius: 0 0 8px 8px;
  }
}
```

### 6.3 交互状态实现

根据 Phase 7 的交互场景截图（将在 Phase 7 执行后更新），需要实现以下交互状态：

- 出发地为空错误提示
- 目的地为空错误提示
- 日期选择器展开状态

详细的交互状态样式将在 Phase 7 完成后添加到本文档。

### 6.4 验证清单

完成实现后，请逐项检查：

- [ ] 所有颜色值与本文档一致
- [ ] 所有尺寸与截图一致（误差在±2px以内）
- [ ] 所有图片路径正确且图片已加载
- [ ] 所有交互效果（hover、focus）正常工作
- [ ] 表单验证错误提示样式符合需求文档
- [ ] 响应式布局在不同设备上正常显示

---

**文档生成完成**  
如需更新，请参考 `requirements/images/homepage/` 目录下的截图和 `metadata.json` 文件。
