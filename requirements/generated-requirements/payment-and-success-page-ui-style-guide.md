# UI 样式规范 - 支付页和购票成功页

> 本文档由 UI Analyzer Agent 自动生成  
> 生成时间: 2026-01-17  
> 基于实际页面截图和 HTML 源码分析

---

## 1. 颜色体系

### 1.1 品牌主题色

```css
:root {
  /* 蓝色主题（导航栏、链接） */
  --primary-blue: rgb(59, 153, 252); /* #3B99FC */
  --primary-blue-dark: rgb(29, 130, 189); /* #1D82BD */
  --primary-blue-light: rgb(54, 152, 213); /* #3698D5 */
  
  /* 橙色高亮（订单号、主要按钮） */
  --primary-orange: rgb(255, 102, 0); /* #FF6600 */
  --primary-orange-light: rgb(255, 114, 0); /* #FF7200 */
  --primary-orange-hover: rgb(255, 136, 51); /* #FF8833 */
  
  /* 渐变（标题栏） */
  --gradient-blue: linear-gradient(rgb(54, 152, 213), rgb(29, 130, 189));
}
```

### 1.2 状态颜色

```css
:root {
  /* 成功状态 */
  --success-green: rgb(39, 163, 6); /* #27A306 */
  --success-bg: rgb(238, 255, 204); /* #EEFFCC */
  --success-border: rgb(50, 145, 208); /* #3291D0 */
  
  /* 警告/超时状态 */
  --warning-red: rgb(255, 0, 0); /* #FF0000 */
  --warning-bg: rgb(255, 243, 243); /* #FFF3F3 */
  --warning-border: rgb(255, 204, 204); /* #FFCCCC */
  
  /* 已支付状态 */
  --status-paid: rgb(255, 114, 0); /* #FF7200 或 #FB8530 */
}
```

### 1.3 文本颜色

```css
:root {
  /* 主要文本 */
  --text-primary: rgb(33, 53, 71); /* #213547 */
  --text-secondary: rgb(51, 51, 51); /* #333333 */
  --text-tertiary: rgb(102, 102, 102); /* #666666 */
  --text-light: rgb(153, 153, 153); /* #999999 */
  
  /* 特殊文本 */
  --text-white: rgb(255, 255, 255); /* #FFFFFF */
  --text-station-red: rgb(255, 0, 0); /* #FF0000 - 车站名称 */
  --text-link: rgb(33, 150, 243); /* #2196F3 */
}
```

### 1.4 背景和边框颜色

```css
:root {
  /* 背景颜色 */
  --bg-white: rgb(255, 255, 255); /* #FFFFFF */
  --bg-light-gray: rgb(245, 245, 245); /* #F5F5F5 */
  --bg-table-header: rgb(239, 241, 249); /* #EFF1F9 */
  --bg-tips-yellow: rgb(255, 251, 229); /* #FFFBE5 */
  
  /* 边框颜色 */
  --border-gray: rgb(208, 208, 208); /* #D0D0D0 */
  --border-light: rgb(224, 224, 224); /* #E0E0E0 */
  --border-blue: rgb(192, 215, 235); /* #C0D7EB */
}
```

---

## 2. 顶部导航栏

### 2.1 文件路径
- 组件: `frontend/src/components/Header/Header.tsx`
- 样式: `frontend/src/components/Header/Header.css`

### 2.2 组件位置说明
- 位置: 页面最顶部，固定或静态定位
- 包含: Logo区、搜索区、用户信息区、主导航栏
- 高度: 顶部区约90-100px + 导航栏50px

### 2.3 完整样式代码

```css
/* ========== 顶部Logo和搜索区 ========== */
/* 📸 参考截图: requirements/images/purchase-success/组件特写截图/顶部导航栏.png */

.header-top {
  background-color: #FFFFFF !important;
  padding: 15px 30px !important;
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  border-bottom: 1px solid #E0E0E0 !important;
}

/* Logo区域 */
.logo-section {
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
}

.train-list-logo-image {
  width: 60px !important;
  height: 60px !important;
  object-fit: contain !important;
}

.logo-text {
  display: flex !important;
  flex-direction: column !important;
  line-height: 1.3 !important;
}

.logo-text > div:first-child {
  font-size: 18px !important;
  font-weight: 700 !important;
  color: #213547 !important;
}

.logo-text > div:last-child {
  font-size: 12px !important;
  color: #666666 !important;
}

/* 搜索区域 */
.search-section {
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
}

.search-section input {
  width: 350px !important;
  height: 40px !important;
  padding: 0 15px !important;
  border: 1px solid #D0D0D0 !important;
  border-radius: 4px !important;
  font-size: 14px !important;
}

.search-section button {
  width: 40px !important;
  height: 40px !important;
  background-color: #3B99FC !important;
  border: none !important;
  border-radius: 4px !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.train-list-search-icon {
  width: 30px !important;
  height: 30px !important;
}

/* 用户信息区 */
.user-info {
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
  font-size: 14px !important;
  color: #213547 !important;
}

.user-info a {
  color: #3B99FC !important;
  text-decoration: none !important;
  cursor: pointer !important;
}

.user-info a:hover {
  text-decoration: underline !important;
}

.user-info .username {
  color: #FF6600 !important;
  font-weight: 600 !important;
  cursor: pointer !important;
}

.user-info button {
  background: none !important;
  border: none !important;
  color: #3B99FC !important;
  cursor: pointer !important;
  font-size: 14px !important;
}

/* ========== 主导航栏 ========== */
.main-navigation {
  background-color: rgb(59, 153, 252) !important; /* #3B99FC */
  height: 50px !important;
  display: flex !important;
  align-items: center !important;
  padding: 0 30px !important;
  gap: 40px !important;
}

.main-navigation a {
  color: #FFFFFF !important;
  font-size: 16px !important;
  text-decoration: none !important;
  cursor: pointer !important;
  transition: opacity 0.2s !important;
}

.main-navigation a:hover {
  opacity: 0.8 !important;
}
```

---

## 3. 成功提示区域（购票成功页）

### 3.1 文件路径
- 组件: `frontend/src/pages/PurchaseSuccess/components/SuccessBanner.tsx`
- 样式: `frontend/src/pages/PurchaseSuccess/components/SuccessBanner.css`

### 3.2 组件位置说明
- 位置: 主导航栏下方，页面顶部醒目位置
- 尺寸: 1100px × 165px
- 外边距: margin: 10px 30px 20px

### 3.3 完整样式代码

```css
/* ========== 成功提示横幅 ========== */
/* 📸 参考截图: requirements/images/purchase-success/组件特写截图/成功提示区域.png */

.success-banner {
  background-color: rgb(238, 255, 204) !important; /* #EEFFCC - 浅黄绿色 */
  border: 1px solid rgb(50, 145, 208) !important; /* #3291D0 - 蓝色 */
  border-radius: 0px !important;
  padding: 20px 40px !important;
  margin: 10px 30px 20px !important;
  display: flex !important;
  align-items: flex-start !important;
  gap: 20px !important;
  width: 1100px !important;
  box-sizing: border-box !important;
}

/* 成功图标 */
.success-icon {
  flex-shrink: 0 !important;
}

.success-icon img {
  width: 40px !important;
  height: 40px !important;
  display: block !important;
}

/* 成功内容区 */
.success-content {
  flex: 1 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 10px !important;
}

/* 标题行 */
.success-title-row {
  display: flex !important;
  flex-direction: column !important;
  gap: 5px !important;
}

.success-title {
  color: rgb(39, 163, 6) !important; /* #27A306 - 绿色 */
  font-size: 20px !important;
  font-weight: 700 !important;
  line-height: 1.2 !important;
}

.success-thanks {
  color: rgb(0, 0, 0) !important; /* #000000 */
  font-size: 14px !important;
  font-weight: 400 !important;
}

.success-order-info {
  color: rgb(0, 0, 0) !important;
  font-size: 14px !important;
}

.order-number {
  color: rgb(255, 102, 0) !important; /* #FF6600 - 橙色 */
  font-size: 22px !important;
  font-weight: 600 !important;
}

/* 乘车人信息 */
.success-passenger-info {
  margin-top: 10px !important;
}

.passenger-name {
  color: rgb(0, 0, 0) !important;
  font-size: 14px !important;
  font-weight: 400 !important;
  line-height: 1.8 !important;
}

/* 通知说明 */
.success-notification-info {
  color: rgb(0, 0, 0) !important;
  font-size: 14px !important;
  font-weight: 700 !important;
  line-height: 1.6 !important;
  margin-top: 10px !important;
}
```

---

## 4. 订单详情区域（购票成功页）

### 4.1 文件路径
- 组件: `frontend/src/pages/PurchaseSuccess/components/OrderDetail.tsx`
- 样式: `frontend/src/pages/PurchaseSuccess/components/OrderDetail.css`

### 4.2 组件位置说明
- 位置: 成功提示横幅下方
- 尺寸: 1100px × 740px
- 外边距: margin: 20px 30px

### 4.3 完整样式代码

```css
/* ========== 订单详情容器 ========== */
/* 📸 参考截图: requirements/images/purchase-success/组件特写截图/订单详情区域.png */

.success-order-info-container {
  margin: 20px 30px !important;
  width: 1100px !important;
  box-sizing: border-box !important;
}

/* ========== 标题栏（渐变蓝色） ========== */
.success-order-info-header {
  background: linear-gradient(rgb(54, 152, 213), rgb(29, 130, 189)) !important;
  color: rgb(255, 255, 255) !important; /* 白色 */
  font-size: 16px !important;
  font-weight: 500 !important;
  padding: 5px 20px !important;
  border-radius: 10px 10px 0px 0px !important;
}

/* ========== 车次信息行 ========== */
.success-order-train-info {
  background-color: #FFFFFF !important;
  padding: 15px 20px !important;
  border-bottom: 1px solid #D0D0D0 !important;
  font-size: 20px !important;
  color: rgb(51, 51, 51) !important; /* #333333 */
  line-height: 1.5 !important;
}

.train-date {
  margin-right: 20px !important;
}

.train-number {
  font-weight: 700 !important;
  margin-right: 5px !important;
}

.station-name {
  color: rgb(255, 0, 0) !important; /* #FF0000 - 红色 */
  font-size: 26px !important;
  font-weight: 1000 !important; /* 超粗体 */
}

/* ========== 订单信息表格 ========== */
.success-order-table {
  width: 100% !important;
  border-collapse: collapse !important;
  background-color: #FFFFFF !important;
}

.success-order-table thead {
  background-color: rgb(239, 241, 249) !important; /* #EFF1F9 - 浅灰蓝色 */
}

.success-order-table th {
  padding: 10px 15px !important;
  text-align: center !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  color: rgb(51, 51, 51) !important;
  border: 1px solid rgb(208, 208, 208) !important; /* #D0D0D0 */
}

.success-order-table td {
  padding: 10px 15px !important;
  text-align: center !important;
  font-size: 14px !important;
  color: rgb(33, 53, 71) !important;
  border: 1px solid rgb(208, 208, 208) !important;
}

.order-status {
  color: rgb(255, 114, 0) !important; /* #FF7200 - 橙色"已支付" */
  font-weight: 700 !important;
}
```

---

## 5. 操作按钮区域（购票成功页）

### 5.1 文件路径
- 组件: `frontend/src/pages/PurchaseSuccess/components/ActionButtons.tsx`
- 样式: `frontend/src/pages/PurchaseSuccess/components/ActionButtons.css`

### 5.2 组件位置说明
- 位置: 订单信息表格下方
- 尺寸: 1058px × 85px
- 布局: Flex水平居中，3个按钮

### 5.3 完整样式代码

```css
/* ========== 操作按钮容器 ========== */
/* 📸 参考截图: requirements/images/purchase-success/组件特写截图/操作按钮区域.png */

.success-order-actions {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  gap: 30px !important;
  padding: 20px 0 !important;
  margin-top: 20px !important;
  width: 100% !important;
}

/* ========== 通用按钮样式 ========== */
.success-order-button {
  padding: 10px 40px !important;
  font-size: 15px !important;
  font-weight: 500 !important;
  border-radius: 5px !important;
  min-width: 140px !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  border: 1px solid transparent !important;
}

/* ========== 次要按钮（餐饮·特产、继续购票） ========== */
.food-button,
.continue-button {
  background-color: rgb(255, 255, 255) !important; /* #FFFFFF - 白色 */
  color: rgb(102, 102, 102) !important; /* #666666 - 灰色 */
  border: 1px solid rgb(208, 208, 208) !important; /* #D0D0D0 */
}

.food-button:hover,
.continue-button:hover {
  background-color: rgb(245, 245, 245) !important; /* #F5F5F5 - 浅灰 */
  border-color: rgb(153, 153, 153) !important; /* 边框变深 */
}

/* ========== 主要按钮（查询订单详情） ========== */
.view-details-button {
  background-color: rgb(255, 114, 0) !important; /* #FF7200 - 橙色 */
  color: rgb(255, 255, 255) !important; /* #FFFFFF - 白色 */
  border: 1px solid rgb(255, 114, 0) !important;
}

.view-details-button:hover {
  background-color: rgb(255, 136, 51) !important; /* #FF8833 - 浅橙色 */
  border-color: rgb(255, 136, 51) !important;
}

.view-details-button:active {
  background-color: rgb(255, 102, 0) !important; /* #FF6600 - 深橙色 */
}
```

---

## 6. 温馨提示区域（购票成功页）

### 6.1 文件路径
- 组件: `frontend/src/pages/PurchaseSuccess/components/WarmTips.tsx`
- 样式: `frontend/src/pages/PurchaseSuccess/components/WarmTips.css`

### 6.2 组件位置说明
- 位置: 操作按钮下方
- 布局: Flex布局，左侧文字列表，右侧二维码

### 6.3 完整样式代码

```css
/* ========== 温馨提示容器 ========== */
/* 📸 参考截图: requirements/images/purchase-success/组件特写截图/温馨提示区域.png */

.success-order-warm-tips-container {
  background-color: rgb(255, 251, 229) !important; /* #FFFBE5 - 浅黄色 */
  padding: 20px 30px !important;
  display: flex !important;
  justify-content: space-between !important;
  gap: 40px !important;
  margin: 20px 30px !important;
  width: 1100px !important;
  box-sizing: border-box !important;
}

/* ========== 文字列表区 ========== */
.warm-tips-main {
  flex: 1 !important;
}

.warm-tips-main h3 {
  font-size: 16px !important;
  font-weight: 700 !important;
  color: rgb(0, 0, 0) !important;
  margin-bottom: 10px !important;
}

.warm-tips-main ol {
  list-style-type: decimal !important;
  padding-left: 20px !important;
  margin: 0 !important;
}

.warm-tips-main li {
  font-size: 14px !important;
  color: rgb(0, 0, 0) !important;
  line-height: 1.8 !important;
  margin-bottom: 8px !important;
}

.warm-tips-main a {
  color: rgb(33, 150, 243) !important; /* #2196F3 - 蓝色链接 */
  text-decoration: none !important;
}

.warm-tips-main a:hover {
  text-decoration: underline !important;
}

/* ========== 二维码区域 ========== */
.qr-codes {
  display: flex !important;
  flex-direction: column !important;
  gap: 20px !important;
  flex-shrink: 0 !important;
}

.qr-code-item {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  gap: 10px !important;
}

.qr-code-item img {
  width: 150px !important;
  height: 150px !important;
  border: 1px solid #E0E0E0 !important;
  border-radius: 4px !important;
}

.qr-code-item p {
  font-size: 12px !important;
  color: rgb(102, 102, 102) !important;
  text-align: center !important;
  max-width: 150px !important;
  line-height: 1.5 !important;
  margin: 0 !important;
}

/* ========== 广告横幅 ========== */
.success-ad-banner {
  width: 1058px !important;
  height: 162px !important;
  margin: 20px 30px !important;
  object-fit: contain !important;
  display: block !important;
}
```

---

## 7. 底部导航区域

### 7.1 文件路径
- 组件: `frontend/src/components/Footer/Footer.tsx`
- 样式: `frontend/src/components/Footer/Footer.css`

### 7.2 组件位置说明
- 位置: 页面最底部
- 高度: 约180px
- 布局: Flex布局，左侧友情链接，中间官方二维码，右侧说明

### 7.3 完整样式代码

```css
/* ========== 底部导航容器 ========== */
/* 📸 参考截图: requirements/images/purchase-success/组件特写截图/底部导航.png */

.footer {
  background-color: rgb(245, 245, 245) !important; /* #F5F5F5 - 浅灰色 */
  padding: 30px !important;
  border-top: 1px solid rgb(224, 224, 224) !important;
}

.footer-content {
  display: flex !important;
  justify-content: space-around !important;
  align-items: flex-start !important;
  gap: 40px !important;
  margin-bottom: 20px !important;
}

/* ========== 友情链接区 ========== */
.footer-links-section h3 {
  font-size: 16px !important;
  font-weight: 700 !important;
  color: rgb(33, 53, 71) !important;
  margin-bottom: 15px !important;
}

.link-images {
  display: grid !important;
  grid-template-columns: repeat(2, 1fr) !important;
  grid-template-rows: repeat(2, 1fr) !important;
  gap: 20px !important;
}

.link-images img {
  width: 176px !important;
  height: 30px !important;
  object-fit: contain !important;
  cursor: pointer !important;
  transition: opacity 0.2s !important;
}

.link-images img:hover {
  opacity: 0.8 !important;
}

/* ========== 官方二维码区 ========== */
.footer-qr-section {
  display: flex !important;
  flex-direction: column !important;
  gap: 10px !important;
}

.qr-labels {
  display: flex !important;
  justify-content: space-between !important;
  gap: 20px !important;
}

.qr-labels span {
  font-size: 12px !important;
  color: rgb(102, 102, 102) !important;
  text-align: center !important;
  width: 80px !important;
}

.qr-images {
  display: flex !important;
  gap: 20px !important;
}

.qr-images img {
  width: 80px !important;
  height: 80px !important;
  border: 1px solid #E0E0E0 !important;
  border-radius: 4px !important;
}

/* ========== 底部说明文字 ========== */
.footer-notice {
  text-align: center !important;
  font-size: 12px !important;
  color: rgb(102, 102, 102) !important;
  line-height: 1.6 !important;
  margin-top: 20px !important;
}
```

---

## 8. 支付页面特有组件

### 8.1 支付倒计时横幅

#### 8.1.1 文件路径
- 组件: `frontend/src/pages/Payment/components/CountdownBanner.tsx`
- 样式: `frontend/src/pages/Payment/components/CountdownBanner.css`

#### 8.1.2 组件位置说明
- 位置: 主导航栏下方，页面顶部横幅（y: 151px）
- 尺寸: 1100px × 74px
- 外边距: margin: 0 30px 20px

#### 8.1.3 完整样式代码

```css
/* ========== 支付倒计时横幅 ========== */
/* 📸 参考截图: requirements/images/payment/组件特写截图/支付倒计时横幅.png */

.payment-countdown-timer {
  background-color: rgb(255, 255, 255) !important; /* #FFFFFF - 白色 */
  border: 1px solid rgb(105, 175, 221) !important; /* #69AFDD - 蓝色 */
  border-radius: 0px !important;
  padding: 16px 40px !important;
  margin: 0px 30px 20px !important;
  display: flex !important;
  align-items: center !important;
  gap: 20px !important;
  width: 1100px !important;
  box-sizing: border-box !important;
}

/* ========== 锁定图标 ========== */
.payment-countdown-icon {
  flex-shrink: 0 !important;
}

.payment-countdown-icon img {
  width: 40px !important;
  height: 40px !important;
  display: block !important;
}

/* ========== 倒计时文字 ========== */
.payment-countdown-text {
  font-size: 16px !important;
  color: rgb(33, 53, 71) !important; /* #213547 - 深灰色 */
  line-height: 1.5 !important;
  flex: 1 !important;
}

/* ========== 倒计时时间（正常状态） ========== */
.payment-countdown-time {
  font-size: 16px !important;
  font-weight: 800 !important; /* 超粗体 */
  color: rgb(255, 102, 0) !important; /* #FF6600 - 橙色 */
  margin: 0 !important;
}

/* ========== 倒计时警告状态（少于5分钟） ========== */
.payment-countdown-time.warning {
  color: rgb(255, 0, 0) !important; /* #FF0000 - 红色 */
  animation: pulse 1s infinite !important;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

/* ========== 倒计时超时状态 ========== */
.payment-countdown-timer.timeout {
  background-color: rgb(255, 243, 243) !important; /* #FFF3F3 - 浅红色 */
  border-color: rgb(255, 204, 204) !important; /* #FFCCCC - 浅红色 */
}

.payment-countdown-time.timeout {
  color: rgb(255, 0, 0) !important; /* #FF0000 - 红色 */
}
```

### 8.2 订单信息和支付按钮区域（支付页面）

#### 8.2.1 文件路径
- 组件: `frontend/src/pages/Payment/components/OrderInfo.tsx`
- 样式: `frontend/src/pages/Payment/components/OrderInfo.css`

#### 8.2.2 组件位置说明
- 位置: 倒计时横幅下方（y: 245px）
- 尺寸: 1100px × 869px
- 外边距: margin: 0 30px

#### 8.2.3 完整样式代码

```css
/* ========== 订单信息容器 ========== */
/* 📸 参考截图: requirements/images/payment/组件特写截图/订单信息区域.png */

.payment-order-info-container {
  margin: 0px 30px !important;
  width: 1100px !important;
  box-sizing: border-box !important;
}

/* ========== 标题栏（渐变蓝色） ========== */
.payment-order-info-header {
  background: linear-gradient(rgb(54, 152, 213), rgb(29, 130, 189)) !important;
  color: rgb(255, 255, 255) !important; /* 白色 */
  font-size: 16px !important;
  font-weight: 500 !important;
  padding: 5px 20px !important;
  border-radius: 10px 10px 0px 0px !important;
}

/* ========== 车次信息行 ========== */
.payment-order-train-info {
  background-color: #FFFFFF !important;
  padding: 15px 20px !important;
  border-bottom: 1px solid #D0D0D0 !important;
  font-size: 20px !important;
  color: rgb(51, 51, 51) !important; /* #333333 */
  line-height: 1.5 !important;
}

.train-number {
  font-weight: 700 !important;
}

.station-name {
  color: rgb(255, 0, 0) !important; /* #FF0000 - 红色 */
  font-size: 26px !important;
  font-weight: 1000 !important; /* 超粗体 */
}

/* ========== 订单信息表格 ========== */
.payment-order-table {
  width: 100% !important;
  border-collapse: collapse !important;
  background-color: #FFFFFF !important;
}

.payment-order-table thead {
  background-color: rgb(239, 241, 249) !important; /* #EFF1F9 - 浅灰蓝色 */
}

.payment-order-table th {
  padding: 10px 15px !important;
  text-align: center !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  color: rgb(51, 51, 51) !important;
  border: 1px solid rgb(208, 208, 208) !important; /* #D0D0D0 */
}

.payment-order-table td {
  padding: 10px 15px !important;
  text-align: center !important;
  font-size: 14px !important;
  color: rgb(33, 53, 71) !important;
  border: 1px solid rgb(208, 208, 208) !important;
}

/* ========== 保险广告图片 ========== */
.insurance-ad {
  width: 1058px !important;
  height: 227px !important;
  margin: 20px 0 !important;
  object-fit: contain !important;
  display: block !important;
}

/* ========== 总票价显示 ========== */
/* 📸 参考截图: requirements/images/payment/组件特写截图/订单信息区域.png */

.payment-total-price-row {
  padding: 12px 20px 15px 0px !important;
  margin-top: 5px !important;
  font-size: 16px !important;
  color: rgb(33, 53, 71) !important; /* #213547 */
  text-align: right !important;
}

.payment-total-price-amount {
  color: rgb(255, 102, 0) !important; /* #FF6600 - 橙色 */
  font-size: 24px !important;
  font-weight: 700 !important;
  margin-left: 10px !important;
}

/* ========== 支付按钮组 ========== */
/* 📸 参考截图: requirements/images/payment/组件特写截图/支付按钮区域.png */

.payment-actions {
  display: flex !important;
  justify-content: center !important;
  gap: 40px !important;
  padding: 0px !important;
  margin-top: 20px !important;
}

/* ========== 通用按钮样式 ========== */
.payment-button {
  padding: 10px 40px !important;
  font-size: 15px !important;
  font-weight: 500 !important;
  border-radius: 5px !important;
  min-width: 140px !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
}

/* ========== 取消订单按钮（次要） ========== */
.cancel-order-button {
  background-color: rgb(255, 255, 255) !important; /* #FFFFFF - 白色 */
  color: rgb(102, 102, 102) !important; /* #666666 - 灰色 */
  border: 1px solid rgb(208, 208, 208) !important; /* #D0D0D0 */
}

.cancel-order-button:hover {
  background-color: rgb(245, 245, 245) !important; /* #F5F5F5 - 浅灰 */
  border-color: rgb(153, 153, 153) !important;
}

/* ========== 网上支付按钮（主要） ========== */
.confirm-payment-button {
  background-color: rgb(255, 114, 0) !important; /* #FF7200 - 橙色 */
  color: rgb(255, 255, 255) !important; /* #FFFFFF - 白色 */
  border: 1px solid rgb(255, 114, 0) !important;
}

.confirm-payment-button:hover {
  background-color: rgb(255, 136, 51) !important; /* #FF8833 - 浅橙色 */
  border-color: rgb(255, 136, 51) !important;
}

/* 禁用状态（处理中） */
.confirm-payment-button:disabled {
  opacity: 0.6 !important;
  cursor: not-allowed !important;
  background-color: rgb(204, 204, 204) !important; /* #CCCCCC - 灰色 */
  border-color: rgb(204, 204, 204) !important;
  color: rgb(153, 153, 153) !important;
}

/* ========== 温馨提示区域（支付页面） ========== */
/* 📸 参考截图: requirements/images/payment/组件特写截图/温馨提示区域.png */

.payment-warm-tips-section {
  background-color: rgb(255, 251, 229) !important; /* #FFFBE5 - 浅黄色 */
  border: 1px solid rgb(245, 230, 168) !important; /* #F5E6A8 - 黄色边框 */
  border-radius: 0px !important;
  padding: 10px 15px !important;
  margin-top: 20px !important;
  width: 1058px !important;
}

.payment-tips-title {
  font-size: 16px !important;
  font-weight: 700 !important;
  color: rgb(0, 0, 0) !important;
  margin-bottom: 10px !important;
}

.payment-tips-list {
  list-style-type: decimal !important;
  padding-left: 20px !important;
  margin: 0 !important;
}

.payment-tip-item {
  font-size: 14px !important;
  color: rgb(17, 17, 17) !important; /* #111111 - 深灰色 */
  line-height: 1.8 !important;
  margin-bottom: 8px !important;
}

.payment-tip-item a {
  color: rgb(0, 115, 231) !important; /* #0073E7 - 蓝色链接 */
  text-decoration: none !important;
}

.payment-tip-item a:hover {
  text-decoration: underline !important;
}
```

---

## 9. 模态弹窗样式

### 9.1 超时提示弹窗（TimeoutModal）

```css
/* ========== 超时提示弹窗 ========== */

.timeout-modal-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  background-color: rgba(0, 0, 0, 0.5) !important;
  z-index: 1000 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.timeout-modal {
  width: 90% !important;
  max-width: 400px !important;
  background-color: rgb(255, 255, 255) !important; /* #FFFFFF - 白色 */
  border-radius: 8px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
  overflow: hidden !important;
}

.timeout-modal-content {
  padding: 30px 20px !important;
  text-align: center !important;
}

.timeout-modal-content p {
  font-size: 16px !important;
  color: rgb(51, 51, 51) !important; /* #333 - 深灰色 */
  font-weight: 500 !important;
  line-height: 1.5 !important;
}

.timeout-modal-footer {
  padding: 15px 20px !important;
  border-top: 1px solid rgb(224, 224, 224) !important; /* #E0E0E0 */
  display: flex !important;
  justify-content: center !important;
}

.timeout-modal-footer button {
  padding: 10px 30px !important;
  background-color: rgb(255, 102, 0) !important; /* #FF6600 - 橙色 */
  color: rgb(255, 255, 255) !important;
  border: none !important;
  border-radius: 4px !important;
  font-size: 14px !important;
  font-weight: 700 !important;
  min-width: 100px !important;
  cursor: pointer !important;
}

.timeout-modal-footer button:hover {
  background-color: rgb(255, 136, 51) !important; /* #FF8833 */
}
```

### 9.2 取消订单确认弹窗（CancelOrderModal）

```css
/* ========== 取消订单确认弹窗 ========== */

.cancel-order-modal {
  width: 100% !important;
  max-width: 600px !important;
  background-color: rgb(255, 255, 255) !important;
  border: 1px solid rgb(192, 215, 235) !important; /* #C0D7EB - 浅蓝色 */
  border-radius: 10px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
  overflow: hidden !important;
}

/* 标题栏（渐变蓝色） */
.cancel-order-modal-header {
  background: linear-gradient(rgb(54, 152, 213), rgb(29, 130, 189)) !important;
  color: rgb(255, 255, 255) !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  padding: 5px 20px !important;
  border-radius: 10px 10px 0 0 !important;
  border-bottom: 2px solid rgb(143, 205, 236) !important; /* #8FCDEC */
  letter-spacing: 0.5px !important;
}

/* 内容区 */
.cancel-order-modal-content {
  padding: 30px 50px 10px 50px !important;
  background-color: rgb(255, 255, 255) !important;
  display: flex !important;
  gap: 20px !important;
  align-items: flex-start !important;
}

.question-icon {
  width: 80px !important;
  height: 80px !important;
  margin-top: 10px !important;
  flex-shrink: 0 !important;
}

.modal-text-content h3 {
  font-size: 20px !important;
  font-weight: 700 !important;
  color: rgb(0, 0, 0) !important; /* #000000 - 黑色 */
  margin-bottom: 5px !important;
  line-height: 1.4 !important;
}

.modal-text-content p {
  font-size: 13px !important;
  color: rgb(102, 102, 102) !important; /* #666666 - 灰色 */
  line-height: 1.8 !important;
}

/* 按钮区 */
.cancel-order-modal-footer {
  padding: 20px !important;
  background-color: rgb(255, 255, 255) !important;
  display: flex !important;
  justify-content: center !important;
  gap: 30px !important;
}

.cancel-order-modal-footer button {
  padding: 10px 40px !important;
  border-radius: 5px !important;
  font-size: 15px !important;
  font-weight: 500 !important;
  min-width: 120px !important;
  cursor: pointer !important;
  transition: all 0.3s !important;
}

/* 取消按钮 */
.modal-cancel-button {
  background-color: rgb(255, 255, 255) !important;
  color: rgb(102, 102, 102) !important;
  border: 1px solid rgb(208, 208, 208) !important;
}

.modal-cancel-button:hover {
  background-color: rgb(245, 245, 245) !important;
}

/* 确认按钮 */
.modal-confirm-button {
  background-color: rgb(255, 102, 0) !important; /* #FF6600 */
  color: rgb(255, 255, 255) !important;
  border: 1px solid rgb(255, 102, 0) !important;
}

.modal-confirm-button:hover {
  background-color: rgb(255, 136, 51) !important; /* #FF8833 */
}
```

---

## 10. React 组件使用示例

### 10.1 支付页面组件

```tsx
import React, { useState, useEffect } from 'react';
import './Payment.css';

const PaymentPage = ({ orderId, initialSeconds = 1200 }) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isTimeout, setIsTimeout] = useState(false);
  
  // 倒计时逻辑
  useEffect(() => {
    if (seconds <= 0) {
      setIsTimeout(true);
      return;
    }
    
    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          setIsTimeout(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [seconds]);
  
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timeString = `${String(minutes).padStart(2, '0')}分${String(secs).padStart(2, '0')}秒`;
  const isWarning = seconds < 300; // 少于5分钟
  
  const handlePayment = () => {
    // 调用支付 API
    // POST /api/payment/${orderId}/confirm
  };
  
  const handleCancel = () => {
    // 显示取消订单确认弹窗
  };
  
  return (
    <div className="payment-page">
      {/* 顶部导航 */}
      <Header />
      
      {/* 倒计时横幅 */}
      <div className={`payment-countdown-timer ${isTimeout ? 'timeout' : ''}`}>
        <div className="payment-countdown-icon">
          <img src="/images/payment/支付页面-倒计时-锁定图标.png" alt="锁定" />
        </div>
        <span className="payment-countdown-text">
          席位已锁定，请在提示时间内尽快完成支付，完成网上购票。支付剩余时间：
          <span className={`payment-countdown-time ${isWarning ? 'warning' : ''} ${isTimeout ? 'timeout' : ''}`}>
            {timeString}
          </span>
        </span>
      </div>
      
      {/* 订单信息区域 */}
      <div className="payment-order-info-container">
        <div className="payment-order-info-header">订单信息</div>
        
        {/* 车次信息 */}
        <div className="payment-order-train-info">
          <span>2026-01-18 （周日）</span>
          <span className="train-number-box">
            <span className="train-number">G103</span>次
          </span>
          <span className="train-route">
            <span className="station-name">北京南</span>站（06:20 开）—
            <span className="station-name">上海虹桥</span>站（11:58 到）
          </span>
        </div>
        
        {/* 订单表格 */}
        <table className="payment-order-table">
          <thead>
            <tr>
              <th>序号</th><th>姓名</th><th>证件类型</th><th>证件号码</th>
              <th>票种</th><th>席别</th><th>车厢</th><th>席位号</th><th>票价（元）</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td><td>王三</td><td>居民身份证</td><td>3301***********222</td>
              <td>成人票</td><td>二等座</td><td>04</td><td>01D</td><td>662.0元</td>
            </tr>
          </tbody>
        </table>
        
        {/* 保险广告 */}
        <img 
          src="/images/payment/支付页面-订单信息-保险广告.png" 
          alt="添加铁路乘意险保障" 
          className="insurance-ad" 
        />
        
        {/* 总票价 */}
        <div className="payment-total-price-row">
          总票价：<span className="payment-total-price-amount">662.0 元</span>
        </div>
        
        {/* 支付按钮 */}
        <div className="payment-actions">
          <button className="payment-button cancel-order-button" onClick={handleCancel}>
            取消订单
          </button>
          <button 
            className="payment-button confirm-payment-button" 
            onClick={handlePayment}
            disabled={isTimeout}
          >
            网上支付
          </button>
        </div>
        
        {/* 温馨提示 */}
        <div className="payment-warm-tips-section">
          <h3 className="payment-tips-title">温馨提示：</h3>
          <ol className="payment-tips-list">
            <li className="payment-tip-item">请在指定时间内完成网上支付。</li>
            <li className="payment-tip-item">逾期未支付，系统将取消本次交易。</li>
            <li className="payment-tip-item">在完成支付或取消本订单之前，您将无法购买其他车票。</li>
            {/* 其他提示项... */}
          </ol>
        </div>
      </div>
      
      {/* 底部导航 */}
      <Footer />
    </div>
  );
};

export default PaymentPage;
```

### 10.2 购票成功页面组件

```tsx
import React from 'react';
import './PurchaseSuccess.css';

const PurchaseSuccessPage = () => {
  return (
    <div className="purchase-success-page">
      {/* 顶部导航 */}
      <Header />
      
      {/* 成功提示区域 */}
      <div className="success-banner">
        <div className="success-icon">
          <img src="/images/购票成功页-成功提示-成功图标.png" alt="成功" />
        </div>
        <div className="success-content">
          <div className="success-title-row">
            <span className="success-title">交易已成功！</span>
            <span className="success-thanks">感谢您选择铁路出行！</span>
            <span className="success-order-info">
              您的订单号：<span className="order-number">EA054507DF</span>
            </span>
          </div>
          <div className="success-passenger-info">
            <div className="passenger-name">
              王三 女士/先生可持购票时所使用的中国居民身份证原件于购票后、列车开车前到车站直接检票乘车。
            </div>
          </div>
          <div className="success-notification-info">
            消息通知方式进行相关调整，将通过"铁路12306"App客户端为您推送相关消息（需开启接收推送权限）。
            您也可以扫描关注下方"铁路12306"微信公众号或支付宝生活号二维码，选择通过微信或支付宝接收。
          </div>
        </div>
      </div>
      
      {/* 订单详情区域 */}
      <div className="success-order-info-container">
        <div className="success-order-info-header">订单信息</div>
        {/* 车次信息和表格 */}
        <div className="success-order-train-info">
          <span className="train-date">2026-01-18 （周日）</span>
          <span className="train-number-box">
            <span className="train-number">G103</span>次
          </span>
          <span className="train-route">
            <span className="station-name">北京南</span>站（06:20 开）—
            <span className="station-name">上海虹桥</span>站（11:58 到）
          </span>
        </div>
        {/* 表格省略 */}
        
        {/* 操作按钮 */}
        <div className="success-order-actions">
          <button className="success-order-button food-button">餐饮·特产</button>
          <button className="success-order-button continue-button">继续购票</button>
          <button className="success-order-button view-details-button">查询订单详情</button>
        </div>
        
        {/* 温馨提示 */}
        <div className="success-order-warm-tips-container">
          <div className="warm-tips-main">
            <h3>温馨提示：</h3>
            <ol>
              <li>如需换票，请尽早携带购票时使用的乘车人有效身份证件到车站、售票窗口、自动售（取）票机、铁路客票代售点办理。</li>
              {/* 其他提示项 */}
            </ol>
          </div>
          <div className="qr-codes">
            <div className="qr-code-item">
              <img src="/images/购票成功页-温馨提示-微信二维码.png" alt="微信二维码" />
              <p>使用微信扫一扫，可通过微信接收12306行程通知</p>
            </div>
            <div className="qr-code-item">
              <img src="/images/购票成功页-温馨提示-支付宝二维码.png" alt="支付宝二维码" />
              <p>使用支付宝扫一扫，可通过支付宝通知提醒接收12306行程通知</p>
            </div>
          </div>
        </div>
        
        {/* 广告横幅 */}
        <img src="/images/购票成功页-温馨提示-广告横幅.png" alt="广告" className="success-ad-banner" />
      </div>
      
      {/* 底部导航 */}
      <Footer />
    </div>
  );
};

export default PurchaseSuccessPage;
```

### 10.3 支付页面倒计时组件（独立版本）

```tsx
import React, { useState, useEffect } from 'react';

const PaymentCountdown = ({ initialSeconds }) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isTimeout, setIsTimeout] = useState(false);
  
  useEffect(() => {
    if (seconds <= 0) {
      setIsTimeout(true);
      return;
    }
    
    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          setIsTimeout(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [seconds]);
  
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timeString = `${String(minutes).padStart(2, '0')}分${String(secs).padStart(2, '0')}秒`;
  const isWarning = seconds < 300; // 少于5分钟
  
  return (
    <div className={`payment-countdown-banner ${isTimeout ? 'timeout' : ''}`}>
      <img src="/images/lock-icon.png" alt="锁定" className="lock-icon" />
      <div className="countdown-text">
        席位已锁定，请在提示时间内尽快完成支付，完成网上购票。
        支付剩余时间：
        <span className={`countdown-time ${isWarning ? 'warning' : ''} ${isTimeout ? 'timeout' : ''}`}>
          {timeString}
        </span>
      </div>
    </div>
  );
};

export default PaymentCountdown;
```

---

## 11. 验证清单

### 11.1 购票成功页面验证

- [ ] 成功提示区域背景色为浅黄绿色 (#EEFFCC)
- [ ] "交易已成功！"文字为绿色 (#27A306)，20px，加粗
- [ ] 订单号为橙色 (#FF6600)，22px，加粗
- [ ] 订单信息标题栏为渐变蓝色（从 #3698D5 到 #1D82BD）
- [ ] 车站名称为红色 (#FF0000)，26px，超粗体
- [ ] 订单状态"已支付"为橙色 (#FF7200)，加粗
- [ ] 操作按钮：次要按钮白底灰字，主要按钮橙底白字
- [ ] 温馨提示区域背景为浅黄色 (#FFFBE5)
- [ ] 二维码尺寸为 150px × 150px
- [ ] 广告横幅尺寸为 1058px × 162px

### 11.2 支付页面验证

- [ ] 倒计时横幅包含锁定图标和倒计时文字
- [ ] 倒计时时间正常为黑色或橙色
- [ ] 倒计时少于5分钟时变红色并有脉冲动画
- [ ] 倒计时超时后背景变浅红色 (#FFF3F3)
- [ ] 总票价为橙色，24px，加粗
- [ ] "网上支付"按钮为橙色背景，白色文字
- [ ] "取消订单"按钮为白色背景，灰色文字
- [ ] 按钮禁用状态透明度为0.6，cursor为not-allowed

### 11.3 模态弹窗验证

- [ ] 超时提示弹窗最大宽度400px，圆角8px
- [ ] 取消订单弹窗最大宽度600px，圆角10px
- [ ] 弹窗标题栏为渐变蓝色
- [ ] 问号图标尺寸80px × 80px
- [ ] 弹窗按钮样式与页面按钮一致

---

## 12. 图片资源使用说明

### 12.1 图片路径映射

| 组件位置 | 图片用途 | 文件路径 | 显示尺寸 |
|---------|---------|---------|---------|
| 顶部导航 | Logo | `/images/支付和成功页-顶部导航-Logo.png` | 60×60px |
| 顶部导航 | 搜索图标 | `/images/支付和成功页-顶部导航-搜索图标.svg` | 30×30px |
| 成功提示 | 成功图标 | `/images/购票成功页-成功提示-成功图标.png` | 40×40px |
| 温馨提示 | 微信二维码 | `/images/购票成功页-温馨提示-微信二维码.png` | 150×150px |
| 温馨提示 | 支付宝二维码 | `/images/购票成功页-温馨提示-支付宝二维码.png` | 150×150px |
| 温馨提示 | 广告横幅 | `/images/购票成功页-温馨提示-广告横幅.png` | 1058×162px |
| 底部导航 | 友情链接×4 | `/images/底部导航-友情链接-*.png` | 176×30px |
| 底部导航 | 官方二维码×4 | `/images/底部导航-二维码-*.png` | 80×80px |

### 12.2 图片优化建议

1. **使用 object-fit 控制图片显示**：
   ```css
   img {
     object-fit: contain; /* 保持宽高比，适合Logo、图标 */
   }
   ```

2. **二维码建议使用 border 和 border-radius**：
   ```css
   .qr-code img {
     border: 1px solid #E0E0E0;
     border-radius: 4px;
   }
   ```

3. **大图片使用 loading="lazy"**：
   ```html
   <img src="/images/广告.png" alt="广告" loading="lazy" />
   ```

---

## 13. 响应式设计建议

### 13.1 移动端适配

```css
@media (max-width: 768px) {
  /* 主内容区缩小宽度 */
  .success-banner,
  .success-order-info-container,
  .success-order-warm-tips-container {
    width: 100% !important;
    margin-left: 10px !important;
    margin-right: 10px !important;
    padding-left: 15px !important;
    padding-right: 15px !important;
  }
  
  /* 按钮区域改为垂直堆叠 */
  .success-order-actions {
    flex-direction: column !important;
    gap: 15px !important;
  }
  
  .success-order-button {
    width: 100% !important;
    max-width: 300px !important;
  }
  
  /* 温馨提示区域改为垂直布局 */
  .success-order-warm-tips-container {
    flex-direction: column !important;
  }
  
  .qr-codes {
    flex-direction: row !important;
    justify-content: center !important;
  }
  
  /* 二维码缩小 */
  .qr-code-item img {
    width: 120px !important;
    height: 120px !important;
  }
}
```

---

## 14. 交互状态样式

### 14.1 按钮交互状态

```css
/* 按钮 hover 状态 */
.success-order-button:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}

/* 按钮 active 状态 */
.success-order-button:active {
  transform: translateY(0) !important;
  box-shadow: none !important;
}

/* 按钮 focus 状态 */
.success-order-button:focus {
  outline: 2px solid rgb(59, 153, 252) !important;
  outline-offset: 2px !important;
}

/* 按钮 disabled 状态 */
.success-order-button:disabled {
  opacity: 0.6 !important;
  cursor: not-allowed !important;
  background-color: rgb(204, 204, 204) !important;
  color: rgb(153, 153, 153) !important;
  border-color: rgb(204, 204, 204) !important;
}
```

### 14.2 链接交互状态

```css
/* 链接 hover 状态 */
a:hover {
  text-decoration: underline !important;
  opacity: 0.8 !important;
}

/* 链接 active 状态 */
a:active {
  opacity: 0.6 !important;
}

/* 蓝色链接特殊样式 */
.link-blue {
  color: rgb(33, 150, 243) !important;
}

.link-blue:hover {
  color: rgb(30, 95, 168) !important; /* #1E5FA8 - 深蓝色 */
}
```

---

## 15. 使用说明

### 15.1 CSS 使用指南

1. **直接复制样式代码**：
   - 所有样式代码使用 `!important` 确保优先级
   - 可直接复制到项目中使用
   - 建议按模块拆分到对应组件的 CSS 文件

2. **颜色变量使用**：
   ```css
   /* 在根样式中定义颜色变量 */
   @import './colors.css';
   
   /* 在组件中使用变量 */
   .my-component {
     color: var(--text-primary);
     background-color: var(--bg-white);
   }
   ```

3. **图片路径配置**：
   - 图片统一放在 `public/images/` 目录
   - 或使用 CDN 路径
   - 确保图片路径与代码中的路径一致

### 15.2 开发验证步骤

1. **搭建基础页面结构**：
   - 创建页面组件和子组件
   - 引入对应的 CSS 文件
   - 设置路由

2. **应用样式代码**：
   - 复制颜色体系到 colors.css
   - 复制组件样式到对应 CSS 文件
   - 检查样式是否生效

3. **添加图片资源**：
   - 将 requirements/images/ 中的图片复制到 public/images/
   - 检查图片路径是否正确
   - 验证图片显示尺寸

4. **测试交互功能**：
   - 点击按钮验证跳转
   - 测试 hover 效果
   - 验证倒计时功能（支付页）

5. **对比原始截图**：
   - 使用浏览器取色器验证颜色准确性
   - 使用开发者工具测量尺寸
   - 截图对比布局和间距

### 15.3 常见问题

**Q1: 颜色不精确怎么办？**
- A: 本文档的颜色基于截图分析和实际 DOM 提取，已经非常准确。如果需要更精确，可以使用浏览器的取色工具在实际网站上验证。

**Q2: 图片尺寸和截图中不一致？**
- A: 确保使用 `object-fit: contain` 或 `object-fit: cover`，并设置明确的 width 和 height。

**Q3: 倒计时如何实现？**
- A: 参考章节 10.2 的 React 组件示例，使用 `setInterval` 每秒更新一次。

**Q4: 弹窗如何实现？**
- A: 使用 position: fixed，配合遮罩层（rgba(0,0,0,0.5)），居中显示。

---

## 16. 最终验证清单

在完成开发后，请逐项验证以下内容：

### 16.1 布局验证
- [ ] 页面主内容区宽度为 1100px，居中显示
- [ ] 成功提示横幅高度约 165px
- [ ] 订单详情区域高度约 740px
- [ ] 操作按钮区域高度约 85px
- [ ] 底部导航高度约 180px

### 16.2 颜色验证
- [ ] 成功提示背景为浅黄绿色 (#EEFFCC)
- [ ] "交易已成功！"为绿色 (#27A306)
- [ ] 订单号为橙色 (#FF6600)
- [ ] 车站名称为红色 (#FF0000)
- [ ] 主要按钮为橙色 (#FF7200)

### 16.3 尺寸验证
- [ ] Logo尺寸 60×60px
- [ ] 成功图标 40×40px
- [ ] 温馨提示二维码 150×150px
- [ ] 底部官方二维码 80×80px
- [ ] 友情链接图片 176×30px

### 16.4 交互验证
- [ ] 按钮 hover 效果正常
- [ ] 链接点击跳转正常
- [ ] 倒计时每秒更新（支付页）
- [ ] 倒计时警告效果（少于5分钟变红）
- [ ] 弹窗打开/关闭正常

### 16.5 文字内容验证
- [ ] 所有文字内容与需求文档一致
- [ ] 订单号格式为 "EA" + 8位UUID前缀
- [ ] 温馨提示文字完整且准确
- [ ] 乘车人提示格式正确

---

**📝 备注**：
- 本样式规范基于实际页面的 HTML 源码和 computedStyles 分析
- 所有class名称和样式属性都是从实际 DOM 中提取的
- 颜色值同时提供 RGB 和 HEX 格式，方便开发者使用
- 建议开发完成后与原始截图逐像素对比，确保还原度100%
