# UI 样式规范 - 个人信息页

> **文档说明**：本文档由 UI Analyzer Agent 自动生成，包含个人信息页的完整CSS样式规范。所有样式可直接复制使用。

**生成日期**：2026-01-19  
**目标页面**：http://localhost:5173/personal-info  
**参考截图**：requirements/images/personal-info-page/

---

## 1. 颜色体系

### 1.1 主题色

```css
:root {
  /* 主蓝色 - 主导航栏背景、选中菜单项、链接 */
  --primary-blue: rgb(59, 153, 252); /* #3B99FC */
  --primary-blue-hex: #3B99FC;
  
  /* 深蓝色 - 链接hover状态、主导航选中项 */
  --primary-blue-dark: rgb(38, 118, 227); /* #2676E3 */
  --primary-blue-dark-hex: #2676E3;
  
  /* 浅蓝色 - 边框颜色 */
  --primary-blue-light: rgb(42, 136, 235); /* #2A88EB */
  --primary-blue-light-hex: #2A88EB;
}
```

### 1.2 文本颜色

```css
:root {
  /* 主文本 - 深灰色，正文内容 */
  --text-primary: rgb(33, 53, 71); /* #213547 */
  --text-primary-hex: #213547;
  
  /* 标题文本 - 黑灰色 */
  --text-heading: rgb(51, 51, 51); /* #333333 */
  --text-heading-hex: #333333;
  
  /* 次要文本 - 中灰色 */
  --text-secondary: rgb(85, 85, 85); /* #555555 */
  --text-secondary-hex: #555555;
  
  /* 浅灰色文本 - 禁用状态 */
  --text-disabled: rgb(170, 170, 170); /* #AAAAAA */
  --text-disabled-hex: #AAAAAA;
}
```

### 1.3 状态颜色

```css
:root {
  /* 必填标记/错误 - 红色 */
  --color-error: rgb(230, 0, 0); /* #E60000 */
  --color-error-hex: #E60000;
  
  /* 核验状态/警告 - 橙色 */
  --color-warning: rgb(255, 152, 0); /* #FF9800 */
  --color-warning-hex: #FF9800;
  
  /* 成功 - 绿色（未在当前页面使用，但保留备用） */
  --color-success: rgb(82, 196, 26); /* #52C41A */
  --color-success-hex: #52C41A;
}
```

### 1.4 背景和边框

```css
:root {
  /* 白色背景 - 页面主背景、卡片背景 */
  --bg-white: rgb(255, 255, 255); /* #FFFFFF */
  --bg-white-hex: #FFFFFF;
  
  /* 浅灰色背景 - 底部导航、侧边栏背景 */
  --bg-gray-light: rgb(245, 245, 245); /* #F5F5F5 */
  --bg-gray-light-hex: #F5F5F5;
  
  /* 浅灰色边框 */
  --border-gray: rgb(224, 224, 224); /* #E0E0E0 */
  --border-gray-hex: #E0E0E0;
}
```

---

## 2. 顶部导航栏

### 2.1 文件路径

- 组件: `frontend/src/components/TopNavigation/TopNavigation.tsx`
- 样式: `frontend/src/components/TopNavigation/TopNavigation.css`

### 2.2 组件位置说明

- 位置: 页面最顶部，x: 106px, y: 0px
- 尺寸: 1300px × 84px
- 布局: Flexbox，三列分布（Logo区 | 搜索框 | 用户信息区）
- 对齐: justify-content: space-between, align-items: center

### 2.3 完整样式代码

📸 **参考截图**: `requirements/images/personal-info-page/组件特写截图/顶部导航栏.png`

```css
/* ========== 顶部导航栏容器 ========== */
.train-list-top-container {
  display: flex !important;
  flex-direction: row !important;
  justify-content: space-between !important;
  align-items: center !important;
  padding: 12px 40px !important;
  margin: 0px 106px !important;
  height: 84px !important;
  background-color: transparent !important;
}

/* ========== Logo区域 ========== */
.train-list-logo-section {
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
  cursor: pointer !important;
}

.train-list-logo-image {
  width: 60px !important;
  height: 60px !important;
  object-fit: contain !important;
}

.train-list-logo-text {
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
}

.train-list-logo-chinese {
  font-size: 18px !important;
  font-weight: 600 !important;
  color: var(--text-primary) !important;
  line-height: 1.2 !important;
}

.train-list-logo-english {
  font-size: 10px !important;
  color: var(--text-secondary) !important;
  letter-spacing: 0.5px !important;
  margin-top: 2px !important;
}

/* ========== 搜索框区域 ========== */
.train-list-search-box {
  display: flex !important;
  align-items: center !important;
  flex: 1 !important;
  max-width: 600px !important;
  margin: 0 40px !important;
}

.train-list-search-input {
  flex: 1 !important;
  height: 40px !important;
  padding: 0 15px !important;
  border: 1px solid var(--border-gray) !important;
  border-right: none !important;
  border-radius: 4px 0 0 4px !important;
  font-size: 14px !important;
  color: var(--text-primary) !important;
  outline: none !important;
  transition: border-color 0.3s !important;
}

.train-list-search-input:focus {
  border-color: var(--primary-blue) !important;
}

.train-list-search-input::placeholder {
  color: var(--text-disabled) !important;
  font-size: 14px !important;
}

.train-list-search-button {
  width: 50px !important;
  height: 40px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background-color: var(--primary-blue) !important;
  border: none !important;
  border-radius: 0 4px 4px 0 !important;
  cursor: pointer !important;
  transition: background-color 0.3s !important;
}

.train-list-search-button:hover {
  background-color: var(--primary-blue-dark) !important;
}

.train-list-search-icon {
  width: 30px !important;
  height: 30px !important;
  filter: brightness(0) invert(1) !important; /* 转为白色 */
}

/* ========== 右侧链接区域 ========== */
.train-list-top-links {
  display: flex !important;
  align-items: center !important;
  gap: 15px !important;
  white-space: nowrap !important;
}

.train-list-top-link {
  font-size: 14px !important;
  color: var(--primary-blue) !important;
  text-decoration: none !important;
  transition: color 0.3s !important;
  cursor: pointer !important;
}

.train-list-top-link:hover {
  color: var(--primary-blue-dark) !important;
  text-decoration: underline !important;
}

.train-list-welcome-text {
  font-size: 14px !important;
  color: var(--text-primary) !important;
}

.train-list-username {
  font-size: 14px !important;
  font-weight: 500 !important;
  color: var(--text-primary) !important;
  cursor: pointer !important;
}

.train-list-username:hover {
  color: var(--primary-blue) !important;
}

.train-list-divider {
  color: var(--text-secondary) !important;
  margin: 0 5px !important;
}

.train-list-logout-button {
  font-size: 14px !important;
  color: var(--primary-blue) !important;
  background: none !important;
  border: none !important;
  cursor: pointer !important;
  padding: 0 !important;
  transition: color 0.3s !important;
}

.train-list-logout-button:hover {
  color: var(--primary-blue-dark) !important;
  text-decoration: underline !important;
}
```

---

## 3. 主导航栏

### 3.1 文件路径

- 组件: `frontend/src/components/MainNavigation/MainNavigation.tsx`
- 样式: `frontend/src/components/MainNavigation/MainNavigation.css`

### 3.2 组件位置说明

- 位置: 顶部导航栏下方，x: 0px, y: 85px
- 尺寸: 1512px × 46px（全宽）
- 布局: 横向flex布局，居中对齐

### 3.3 完整样式代码

```css
/* ========== 主导航栏容器 ========== */
.main-navigation {
  width: 100% !important;
  height: 46px !important;
  background-color: var(--primary-blue) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.nav-container {
  display: flex !important;
  align-items: center !important;
  gap: 40px !important;
  padding: 0 40px !important;
}

.nav-item {
  position: relative !important;
  color: white !important;
  font-size: 16px !important;
  text-decoration: none !important;
  padding: 12px 20px !important;
  display: flex !important;
  align-items: center !important;
  gap: 5px !important;
  transition: background-color 0.3s !important;
  cursor: pointer !important;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.nav-item.active {
  background-color: var(--primary-blue-dark) !important;
}

.nav-arrow {
  font-size: 12px !important;
  margin-left: 2px !important;
}
```

---

## 4. 侧边栏菜单

### 4.1 文件路径

- 组件: `frontend/src/components/SideMenu/SideMenu.tsx`
- 样式: `frontend/src/components/SideMenu/SideMenu.css`

### 4.2 组件位置说明

- 位置: 页面左侧，x: 156px, y: 175px
- 尺寸: 220px × 777px（固定宽度）
- 布局: 垂直布局，块级元素

📸 **参考截图**: `requirements/images/personal-info-page/组件特写截图/侧边栏菜单.png`

### 4.3 完整样式代码

```css
/* ========== 侧边栏容器 ========== */
.side-menu {
  width: 220px !important;
  background-color: var(--bg-white) !important;
  padding: 0 20px 0 0 !important;
  display: block !important;
}

/* ========== 菜单标题 ========== */
.menu-header {
  font-size: 20px !important;
  font-weight: 600 !important;
  color: var(--text-heading) !important;
  padding: 15px 0 !important;
  border-bottom: 1px solid var(--border-gray) !important;
  margin-bottom: 10px !important;
}

/* ========== 菜单分组 ========== */
.menu-section {
  margin-bottom: 10px !important;
}

/* ========== 可展开的菜单标题 ========== */
.menu-title {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 12px 15px !important;
  font-size: 15px !important;
  font-weight: 500 !important;
  color: var(--text-primary) !important;
  cursor: pointer !important;
  transition: background-color 0.3s, color 0.3s !important;
  border-radius: 4px !important;
}

.menu-title:hover {
  background-color: rgba(59, 153, 252, 0.1) !important;
  color: var(--primary-blue) !important;
}

/* ========== 简单菜单标题（不可展开） ========== */
.menu-title-simple {
  padding: 12px 15px !important;
  font-size: 15px !important;
  font-weight: 500 !important;
  color: var(--text-primary) !important;
  cursor: pointer !important;
  transition: background-color 0.3s, color 0.3s !important;
  border-radius: 4px !important;
}

.menu-title-simple:hover {
  background-color: rgba(59, 153, 252, 0.1) !important;
  color: var(--primary-blue) !important;
}

/* ========== 菜单展开图标 ========== */
.menu-toggle {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 20px !important;
  height: 20px !important;
}

.menu-toggle svg {
  width: 16px !important;
  height: 16px !important;
}

/* ========== 菜单项容器 ========== */
.menu-items {
  padding-left: 15px !important;
  margin-top: 5px !important;
}

/* ========== 菜单项 ========== */
.menu-item {
  padding: 10px 15px !important;
  font-size: 14px !important;
  color: var(--text-primary) !important;
  cursor: pointer !important;
  transition: background-color 0.3s, color 0.3s !important;
  border-radius: 4px !important;
  margin-bottom: 3px !important;
}

.menu-item:hover:not(.disabled) {
  background-color: rgba(59, 153, 252, 0.1) !important;
  color: var(--primary-blue) !important;
}

/* ========== 选中的菜单项 ========== */
.menu-item.selected {
  background-color: var(--primary-blue) !important;
  color: white !important;
  font-weight: 500 !important;
}

.menu-item.selected:hover {
  background-color: var(--primary-blue-dark) !important;
}

/* ========== 禁用的菜单项 ========== */
.menu-item.disabled {
  color: var(--text-disabled) !important;
  cursor: not-allowed !important;
  opacity: 0.6 !important;
}

.menu-item.disabled:hover {
  background-color: transparent !important;
  color: var(--text-disabled) !important;
}
```

---

## 5. 个人信息Tab

### 5.1 文件路径

- 组件: `frontend/src/components/PersonalInfoPanel/PersonalInfoPanel.tsx`
- 样式: `frontend/src/components/PersonalInfoPanel/PersonalInfoPanel.css`

### 5.2 组件位置说明

- 位置: 侧边栏右侧主内容区，x: 376px, y: 175px
- 尺寸: 980px × 777px
- 布局: Flex垂直布局，包含三个section

📸 **参考截图**: `requirements/images/personal-info-page/组件特写截图/个人信息Tab.png`

### 5.3 完整样式代码

```css
/* ========== 个人信息面板容器 ========== */
.personal-info-panel {
  display: flex !important;
  flex-direction: column !important;
  background-color: var(--bg-white) !important;
  padding: 10px 20px !important;
  min-height: 777px !important;
}

/* ========== Section样式 ========== */
.basic-info-section,
.contact-info-section,
.additional-info-section {
  margin-bottom: 30px !important;
  padding-bottom: 20px !important;
  border-bottom: 1px solid var(--border-gray) !important;
}

.additional-info-section {
  border-bottom: none !important;
}

/* ========== Section标题 ========== */
.section-title {
  font-size: 18px !important;
  font-weight: 600 !important;
  color: var(--text-heading) !important;
  margin-bottom: 20px !important;
  padding-bottom: 10px !important;
  border-bottom: 2px solid var(--primary-blue) !important;
}

/* ========== Section头部（标题+编辑按钮） ========== */
.section-header {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  margin-bottom: 20px !important;
}

.section-header .section-title {
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
  border-bottom: none !important;
  flex: 1 !important;
}

/* ========== 编辑按钮 ========== */
.edit-button {
  padding: 6px 20px !important;
  font-size: 14px !important;
  color: var(--text-secondary) !important;
  background-color: transparent !important;
  border: 1px solid var(--border-gray) !important;
  border-radius: 4px !important;
  cursor: pointer !important;
  transition: all 0.3s !important;
}

.edit-button:hover {
  border-color: var(--primary-blue) !important;
  color: var(--primary-blue) !important;
  background-color: rgba(59, 153, 252, 0.05) !important;
}

/* ========== 信息内容容器 ========== */
.info-content {
  display: flex !important;
  flex-direction: column !important;
  gap: 12px !important;
}

/* ========== 信息行 ========== */
.info-row {
  display: flex !important;
  align-items: flex-start !important;
  min-height: 30px !important;
  padding: 8px 0 !important;
}

/* ========== 信息标签 ========== */
.info-label {
  flex-shrink: 0 !important;
  width: 150px !important;
  font-size: 14px !important;
  color: var(--text-primary) !important;
  text-align: right !important;
  padding-right: 20px !important;
  line-height: 1.8 !important;
}

/* ========== 必填标记 ========== */
.required-mark {
  color: var(--color-error) !important;
  font-weight: bold !important;
  margin-right: 2px !important;
}

/* ========== 信息值 ========== */
.info-value {
  flex: 1 !important;
  font-size: 14px !important;
  color: var(--text-primary) !important;
  line-height: 1.8 !important;
}

/* ========== 信息值组（包含多个信息） ========== */
.info-value-group {
  flex: 1 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 5px !important;
}

.info-value-group .info-value {
  margin-bottom: 5px !important;
}

/* ========== 核验状态 ========== */
.verification-status {
  color: var(--color-warning) !important;
  font-weight: 500 !important;
  font-size: 14px !important;
}
```

### 5.4 React组件示例

```tsx
import React from 'react';
import './PersonalInfoPanel.css';

interface PersonalInfoData {
  username: string;
  realName: string;
  country: string;
  idType: string;
  idNumber: string;
  verificationStatus: string;
  phone: string;
  phoneVerification: string;
  email: string;
  discountType: string;
}

const PersonalInfoPanel: React.FC<{ data: PersonalInfoData }> = ({ data }) => {
  return (
    <div className="personal-info-panel">
      {/* 基本信息部分 */}
      <div className="basic-info-section">
        <h3 className="section-title">基本信息</h3>
        <div className="info-content">
          <div className="info-row">
            <span className="info-label">
              <span className="required-mark">* </span>用户名：
            </span>
            <span className="info-value">{data.username}</span>
          </div>
          
          <div className="info-row">
            <span className="info-label">
              <span className="required-mark">* </span>姓名：
            </span>
            <span className="info-value">{data.realName}</span>
          </div>
          
          <div className="info-row">
            <span className="info-label">国家/地区：</span>
            <span className="info-value">{data.country}</span>
          </div>
          
          <div className="info-row">
            <span className="info-label">
              <span className="required-mark">* </span>证件类型：
            </span>
            <span className="info-value">{data.idType}</span>
          </div>
          
          <div className="info-row">
            <span className="info-label">
              <span className="required-mark">* </span>证件号码：
            </span>
            <span className="info-value">{data.idNumber}</span>
          </div>
          
          <div className="info-row">
            <span className="info-label">核验状态：</span>
            <span className="info-value verification-status">
              {data.verificationStatus}
            </span>
          </div>
        </div>
      </div>
      
      {/* 联系方式部分 */}
      <div className="contact-info-section">
        <div className="section-header">
          <h3 className="section-title">联系方式</h3>
          <button className="edit-button">编辑</button>
        </div>
        <div className="info-content">
          <div className="info-row">
            <span className="info-label">
              <span className="required-mark">* </span>手机号：
            </span>
            <div className="info-value-group">
              <span className="info-value">{data.phone}</span>
              <span className="verification-status">
                {data.phoneVerification}
              </span>
            </div>
          </div>
          
          <div className="info-row">
            <span className="info-label">邮箱：</span>
            <span className="info-value">{data.email}</span>
          </div>
        </div>
      </div>
      
      {/* 附加信息部分 */}
      <div className="additional-info-section">
        <div className="section-header">
          <h3 className="section-title">附加信息</h3>
          <button className="edit-button">编辑</button>
        </div>
        <div className="info-content">
          <div className="info-row">
            <span className="info-label">
              <span class Name="required-mark">* </span>优惠(待)类型：
            </span>
            <span className="info-value">{data.discountType}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoPanel;
```

### 5.5 验证清单

- [ ] 必填标记显示为红色星号
- [ ] 核验状态显示为橙色文字
- [ ] 编辑按钮hover时显示蓝色边框
- [ ] 信息标签右对齐，宽度150px
- [ ] Section之间有分隔线和间距
- [ ] 标题下方有蓝色下划线

---

## 6. 底部导航

### 6.1 文件路径

- 组件: `frontend/src/components/BottomNavigation/BottomNavigation.tsx`
- 样式: `frontend/src/components/BottomNavigation/BottomNavigation.css`

### 6.2 组件位置说明

- 位置: 页面最底部，x: 0px, y: 952px
- 尺寸: 1512px × 197px（全宽）
- 布局: 两列布局（友情链接 | 二维码）

📸 **参考截图**: `requirements/images/personal-info-page/组件特写截图/底部导航.png`

### 6.3 完整样式代码

```css
/* ========== 底部导航容器 ========== */
.bottom-navigation {
  width: 100% !important;
  background-color: var(--bg-gray-light) !important;
  padding: 40px 0 !important;
  margin-top: auto !important;
}

.bottom-content {
  max-width: 1200px !important;
  margin: 0 auto !important;
  padding: 0 40px !important;
  display: flex !important;
  justify-content: space-between !important;
  gap: 80px !important;
}

/* ========== 友情链接部分 ========== */
.friendship-links-section {
  flex: 1 !important;
}

.friendship-links-section .section-title {
  font-size: 16px !important;
  font-weight: 600 !important;
  color: var(--text-heading) !important;
  margin-bottom: 15px !important;
}

.friendship-links-grid {
  display: grid !important;
  grid-template-columns: repeat(2, 1fr) !important;
  gap: 15px 30px !important;
}

.friendship-link-item {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.friendship-link-item img {
  width: 176px !important;
  height: 30px !important;
  object-fit: contain !important;
  transition: opacity 0.3s !important;
  cursor: pointer !important;
}

.friendship-link-item img:hover {
  opacity: 0.8 !important;
}

/* ========== 二维码部分 ========== */
.qr-codes-section {
  flex: 1 !important;
  display: flex !important;
  flex-direction: column !important;
}

.qr-codes-wrapper {
  display: flex !important;
  flex-direction: column !important;
  gap: 15px !important;
}

.qr-code-row {
  display: flex !important;
  justify-content: space-around !important;
  gap: 20px !important;
}

.qr-label {
  flex: 1 !important;
  text-align: center !important;
  font-size: 12px !important;
  color: var(--text-primary) !important;
}

.qr-code-item {
  flex: 1 !important;
  display: flex !important;
  justify-content: center !important;
}

.qr-code-item img {
  width: 80px !important;
  height: 80px !important;
  object-fit: contain !important;
}

/* ========== 二维码底部说明 ========== */
.qr-code-footer {
  margin-top: 15px !important;
  text-align: center !important;
}

.qr-code-footer p {
  font-size: 12px !important;
  color: var(--text-secondary) !important;
  line-height: 1.6 !important;
  margin: 0 !important;
}
```

---

## 7. 通用组件样式

### 7.1 按钮样式

```css
/* ========== 主按钮 ========== */
.btn-primary {
  padding: 10px 30px !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  color: white !important;
  background-color: var(--primary-blue) !important;
  border: none !important;
  border-radius: 4px !important;
  cursor: pointer !important;
  transition: all 0.3s !important;
}

.btn-primary:hover {
  background-color: var(--primary-blue-dark) !important;
  box-shadow: 0 2px 8px rgba(59, 153, 252, 0.3) !important;
}

.btn-primary:active {
  transform: translateY(1px) !important;
}

.btn-primary:disabled {
  background-color: var(--text-disabled) !important;
  cursor: not-allowed !important;
  opacity: 0.6 !important;
}

/* ========== 次要按钮 ========== */
.btn-secondary {
  padding: 10px 30px !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  color: var(--text-primary) !important;
  background-color: var(--bg-white) !important;
  border: 1px solid var(--border-gray) !important;
  border-radius: 4px !important;
  cursor: pointer !important;
  transition: all 0.3s !important;
}

.btn-secondary:hover {
  border-color: var(--primary-blue) !important;
  color: var(--primary-blue) !important;
  background-color: rgba(59, 153, 252, 0.05) !important;
}
```

### 7.2 输入框样式

```css
/* ========== 文本输入框 ========== */
.input-text {
  width: 100% !important;
  height: 40px !important;
  padding: 0 12px !important;
  font-size: 14px !important;
  color: var(--text-primary) !important;
  background-color: var(--bg-white) !important;
  border: 1px solid var(--border-gray) !important;
  border-radius: 4px !important;
  outline: none !important;
  transition: border-color 0.3s !important;
}

.input-text:focus {
  border-color: var(--primary-blue) !important;
  box-shadow: 0 0 0 2px rgba(59, 153, 252, 0.1) !important;
}

.input-text:disabled {
  background-color: var(--bg-gray-light) !important;
  color: var(--text-disabled) !important;
  cursor: not-allowed !important;
}

.input-text::placeholder {
  color: var(--text-disabled) !important;
}

/* ========== 错误状态输入框 ========== */
.input-text.error {
  border-color: var(--color-error) !important;
}

.input-text.error:focus {
  box-shadow: 0 0 0 2px rgba(230, 0, 0, 0.1) !important;
}

/* ========== 输入框错误提示 ========== */
.input-error-message {
  font-size: 12px !important;
  color: var(--color-error) !important;
  margin-top: 5px !important;
  line-height: 1.4 !important;
}
```

### 7.3 表单样式

```css
/* ========== 表单行 ========== */
.form-row {
  margin-bottom: 20px !important;
}

/* ========== 表单标签 ========== */
.form-label {
  display: block !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  color: var(--text-primary) !important;
  margin-bottom: 8px !important;
}

.form-label .required {
  color: var(--color-error) !important;
  margin-right: 4px !important;
}

/* ========== 表单组（水平布局） ========== */
.form-group {
  display: flex !important;
  align-items: flex-start !important;
  gap: 20px !important;
  margin-bottom: 20px !important;
}

.form-group .form-label {
  flex-shrink: 0 !important;
  width: 150px !important;
  text-align: right !important;
  padding-top: 10px !important;
}

.form-group .form-input {
  flex: 1 !important;
}
```

---

## 8. 使用说明

### 8.1 颜色变量使用

在CSS文件开头引入颜色变量：

```css
@import url('path/to/colors.css');

/* 或直接在:root中定义 */
:root {
  --primary-blue: #3B99FC;
  --text-primary: #213547;
  /* ... 其他颜色变量 */
}
```

### 8.2 响应式设计建议

```css
/* 平板设备 (768px - 1024px) */
@media (max-width: 1024px) {
  .train-list-top-container {
    margin: 0 40px !important;
  }
  
  .side-menu {
    width: 180px !important;
  }
  
  .personal-info-panel {
    width: calc(100% - 200px) !important;
  }
}

/* 手机设备 (< 768px) */
@media (max-width: 768px) {
  .train-list-top-container {
    flex-direction: column !important;
    height: auto !important;
    padding: 15px !important;
  }
  
  .side-menu {
    width: 100% !important;
    border-right: none !important;
    border-bottom: 1px solid var(--border-gray) !important;
  }
  
  .personal-info-panel {
    width: 100% !important;
    padding: 15px !important;
  }
  
  .info-row {
    flex-direction: column !important;
  }
  
  .info-label {
    width: 100% !important;
    text-align: left !important;
    padding-right: 0 !important;
    margin-bottom: 5px !important;
  }
}
```

### 8.3 浏览器兼容性

本样式规范适用于以下浏览器：

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**注意事项**：
- 使用了 CSS Variables（IE 11不支持）
- 使用了 Flexbox 和 Grid 布局
- 使用了 `!important` 确保样式优先级，生产环境中可根据实际情况移除

---

## 9. 最终验证清单

- [ ] 所有颜色使用CSS变量定义
- [ ] 所有尺寸和间距精确匹配设计稿
- [ ] 所有hover/focus状态已定义
- [ ] 所有组件响应式适配已实现
- [ ] Logo和图片资源路径正确
- [ ] 字体大小和字重符合设计规范
- [ ] 边框、圆角、阴影样式准确
- [ ] 按钮和输入框交互状态完整
- [ ] 代码格式规范，注释清晰

---

**文档结束**

> 如有任何疑问或需要调整，请参考截图：`requirements/images/personal-info-page/`
