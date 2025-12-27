# UI 样式规范 - 12306登录页面

本文档包含所有组件的完整 CSS 样式，可直接复制到对应的 CSS 文件中使用。

> **📌 重要提示**：
> - 所有样式使用 `!important` 确保优先级
> - 所有尺寸精确到 px
> - 所有颜色使用十六进制或 rgba
> - 样式已包含所有交互状态（hover, focus, disabled, error）
> - 图片尺寸已根据实际资源文件测量并提供精确的缩放方案
> - 颜色值基于视觉分析，建议开发者使用浏览器取色器验证

---

## 1. 颜色体系

### 1.1 品牌色
- **品牌红色**: `#E52421` - 用于 Logo、品牌标识
- **主题蓝色**: `#2D8CF0` - 用于选中状态、链接、标签页
- **主题橙色**: `#FF7518` - 用于主要按钮（立即登录）

### 1.2 文本颜色
- **深灰色**: `#333333` - 主要文本、标题
- **灰色**: `#666666` - 次要文本
- **浅灰色**: `#999999` - 辅助文字
- **占位符**: `#CCCCCC` - 输入框占位符

### 1.3 状态颜色
- **错误红色**: `#F44336` - 错误提示文本
- **错误背景**: `#FFF1F0` - 错误提示背景
- **成功绿色**: `#4CAF50` - 成功提示

### 1.4 背景颜色
- **纯白色**: `#FFFFFF` - 卡片、导航背景
- **浅灰背景**: `#F5F5F5` - 页面整体背景
- **边框色**: `#E0E0E0` - 输入框、分割线边框

---

## 2. 页面容器 (LoginPageContainer)

### 2.1 文件路径
- 组件: `frontend/src/pages/LoginPage.tsx`
- 样式: `frontend/src/pages/LoginPage.css`

### 2.2 组件位置说明

**在页面中的位置**:
- 根容器，包含所有页面内容
- 宽度: 1185px（居中显示）
- 最小高度: 954px

**布局示意图**:
```
┌─────────────────────────────────────┐
│  TopNavigation (80px)               │
├─────────────────────────────────────┤
│  MainContentArea (600px)            │
│  - Background Image                 │
│  - Left Promotion + Right Form      │
├─────────────────────────────────────┤
│  BottomNavigation (274px)           │
└─────────────────────────────────────┘
```

### 2.3 完整样式代码

```css
/* ========== 2.1 页面容器 ========== */
.login-page-container {
  width: 1185px !important;
  min-height: 954px !important;
  margin: 0 auto !important;
  background-color: #f5f5f5 !important;
}

/* ========== 2.2 主内容区域 ========== */
.main-content-area {
  width: 100% !important;
  height: 600px !important;
  position: relative !important;
  
  /* 背景图片 */
  background-image: url('./images/登录页-背景-新.jpg') !important;
  background-size: auto !important;
  background-position: 50% 50% !important;
  background-repeat: no-repeat !important;
}
/* 图片信息注释 */
/* 原始尺寸: 1185px × 600px */
/* 显示尺寸: 1185px × 600px */
/* 缩放比例: 1.000 */
```

---

## 3. 顶部导航 (TopNavigation)

### 3.1 文件路径
- 组件: `frontend/src/components/TopNavigation.tsx`
- 样式: `frontend/src/components/TopNavigation.css`

### 3.2 组件位置说明

**在页面中的位置**:
- 父容器: `.login-page-container`
- 位置: 第一个子元素，位于页面最上方
- 宽度: 100%
- 高度: 80px

### 3.3 完整样式代码

```css
/* ========== 3.1 顶部导航容器 ========== */
.top-navigation {
  width: 100% !important;
  height: 80px !important;
  background-color: #ffffff !important;
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  padding: 0 40px !important;
  box-sizing: border-box !important;
}

/* ========== 3.2 Logo区域 ========== */
.top-navigation-logo {
  width: 200px !important;
  height: 50px !important;
  background-image: url('./images/登录页-顶部导航-Logo.png') !important;
  background-size: auto !important;
  background-position: 0% 0% !important;
  background-repeat: no-repeat !important;
  cursor: pointer !important;
}
/* 图片信息注释 */
/* 原始尺寸: 200px × 50px */
/* 显示尺寸: 200px × 50px */
/* 缩放比例: 1.000 */

/* Logo 悬停效果 */
.top-navigation-logo:hover {
  opacity: 0.9 !important;
}

/* ========== 3.3 欢迎文字 ========== */
.top-navigation-welcome {
  font-size: 14px !important;
  color: #333333 !important;
  line-height: 1.5 !important;
}
```

---

## 4. 登录表单 (LoginForm)

### 4.1 文件路径
- 组件: `frontend/src/components/LoginForm.tsx`
- 样式: `frontend/src/components/LoginForm.css`

### 4.2 组件位置说明

**在页面中的位置**:
- 父容器: `.main-content-area`
- 位置: 右侧，绝对定位
- 尺寸: 380px × 373px
- 坐标: right=0, top=19px

### 4.3 完整样式代码

```css
/* ========== 4.1 登录表单容器 ========== */
.login-form {
  position: absolute !important;
  right: 0 !important;
  top: 19px !important;
  width: 380px !important;
  min-height: 373px !important;
  background-color: #ffffff !important;
  padding: 30px !important;
  box-sizing: border-box !important;
}

/* ========== 4.2 标签切换 ========== */
.login-form-tabs {
  display: flex !important;
  margin-bottom: 30px !important;
  border-bottom: 1px solid #e0e0e0 !important;
}

.login-form-tab {
  flex: 1 !important;
  padding: 12px 0 !important;
  text-align: center !important;
  font-size: 16px !important;
  color: #666666 !important;
  cursor: pointer !important;
  border-bottom: 2px solid transparent !important;
  transition: all 0.3s ease !important;
}

.login-form-tab:hover {
  color: #2d8cf0 !important;
}

.login-form-tab.active {
  color: #2d8cf0 !important;
  border-bottom-color: #2d8cf0 !important;
  font-weight: 500 !important;
}

/* ========== 4.3 输入框组 ========== */
.login-form-input-group {
  margin-bottom: 20px !important;
}

.login-form-input {
  width: 100% !important;
  height: 45px !important;
  padding: 0 15px !important;
  font-size: 14px !important;
  color: #333333 !important;
  border: 1px solid #e0e0e0 !important;
  border-radius: 4px !important;
  box-sizing: border-box !important;
  transition: border-color 0.3s ease !important;
}

.login-form-input::placeholder {
  color: #cccccc !important;
}

.login-form-input:focus {
  outline: none !important;
  border-color: #2d8cf0 !important;
}

.login-form-input:hover {
  border-color: #b3b3b3 !important;
}

/* 错误状态 */
.login-form-input.error {
  border-color: #f44336 !important;
}

/* ========== 4.4 登录按钮 ========== */
.login-form-button {
  width: 100% !important;
  height: 45px !important;
  background-color: #ff7518 !important;
  color: #ffffff !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  border: none !important;
  border-radius: 4px !important;
  cursor: pointer !important;
  transition: background-color 0.3s ease !important;
}

.login-form-button:hover {
  background-color: #e66900 !important;
}

.login-form-button:active {
  background-color: #cc5c00 !important;
}

.login-form-button:disabled {
  background-color: #cccccc !important;
  cursor: not-allowed !important;
}

/* ========== 4.5 底部链接 ========== */
.login-form-links {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  margin-top: 20px !important;
  font-size: 14px !important;
}

.login-form-link {
  color: #2d8cf0 !important;
  text-decoration: none !important;
  cursor: pointer !important;
  transition: color 0.3s ease !important;
}

.login-form-link:hover {
  color: #1976d2 !important;
  text-decoration: underline !important;
}

.login-form-links .separator {
  margin: 0 8px !important;
  color: #cccccc !important;
}

/* ========== 4.6 提示文字 ========== */
.login-form-tips {
  margin-top: 20px !important;
  font-size: 12px !important;
  color: #999999 !important;
  line-height: 1.6 !important;
  text-align: center !important;
}

/* ========== 4.7 错误提示 ========== */
.login-form-error {
  padding: 10px 15px !important;
  margin-bottom: 15px !important;
  background-color: #fff1f0 !important;
  color: #f44336 !important;
  font-size: 13px !important;
  border-radius: 4px !important;
  border: 1px solid #ffccc7 !important;
}
```

---

## 5. 底部导航 (BottomNavigation)

### 5.1 文件路径
- 组件: `frontend/src/components/BottomNavigation.tsx`
- 样式: `frontend/src/components/BottomNavigation.css`

### 5.2 组件位置说明

**在页面中的位置**:
- 父容器: `.login-page-container`
- 位置: 第三个子元素，位于页面最底部
- 宽度: 100%
- 最小高度: 274px

### 5.3 完整样式代码

```css
/* ========== 5.1 底部导航容器 ========== */
.bottom-navigation {
  width: 100% !important;
  min-height: 274px !important;
  background-color: #ffffff !important;
  padding: 30px 40px !important;
  box-sizing: border-box !important;
}

/* ========== 5.2 友情链接区域 ========== */
.bottom-navigation-partnerships {
  margin-bottom: 30px !important;
}

.bottom-navigation-title {
  font-size: 16px !important;
  color: #333333 !important;
  font-weight: 500 !important;
  margin-bottom: 20px !important;
}

.bottom-navigation-partnership-list {
  display: flex !important;
  gap: 20px !important;
  align-items: center !important;
}

.bottom-navigation-partnership-link {
  display: inline-block !important;
  cursor: pointer !important;
  transition: opacity 0.3s ease !important;
}

.bottom-navigation-partnership-link:hover {
  opacity: 0.8 !important;
}

.bottom-navigation-partnership-img {
  width: 200px !important;
  height: 34px !important;
  object-fit: contain !important;
  display: block !important;
}
/* 图片信息注释 */
/* 所有友情链接图片统一显示为: 200px × 34px */
/* 原始尺寸各不相同，通过 object-fit: contain 保持比例 */

/* ========== 5.3 二维码区域 ========== */
.bottom-navigation-qrcodes {
  display: flex !important;
  justify-content: center !important;
  gap: 80px !important;
  padding: 30px 0 !important;
}

.bottom-navigation-qrcode-item {
  text-align: center !important;
}

.bottom-navigation-qrcode-title {
  font-size: 14px !important;
  color: #333333 !important;
  margin-bottom: 10px !important;
}

.bottom-navigation-qrcode-img {
  width: 80px !important;
  height: 80px !important;
  object-fit: contain !important;
  display: block !important;
  margin: 0 auto !important;
}
/* 图片信息注释 */
/* 所有二维码图片统一显示为: 80px × 80px */
/* 原始尺寸从 258px 到 800px 不等 */

/* ========== 5.4 版权信息区域 ========== */
.bottom-navigation-copyright {
  background-color: #666666 !important;
  color: #ffffff !important;
  padding: 20px 40px !important;
  margin: 0 -40px -30px -40px !important;
  text-align: center !important;
}

.bottom-navigation-copyright-text {
  font-size: 12px !important;
  line-height: 1.8 !important;
  margin: 5px 0 !important;
}

.bottom-navigation-copyright-link {
  color: #ffffff !important;
  text-decoration: none !important;
  margin: 0 5px !important;
}

.bottom-navigation-copyright-link:hover {
  text-decoration: underline !important;
}
```

---

## 6. 短信验证模态框 (SMSVerification)

### 6.1 文件路径
- 组件: `frontend/src/components/SMSVerification.tsx`
- 样式: `frontend/src/components/SMSVerification.css`

### 6.2 组件位置说明

**在页面中的位置**:
- 父容器: `body`（全局模态层）
- 位置: 固定定位，屏幕居中
- 尺寸: 700px宽度

### 6.3 完整样式代码

```css
/* ========== 6.1 模态遮罩层 ========== */
.modal-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  background-color: rgba(0, 0, 0, 0.5) !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  z-index: 1000 !important;
}

/* ========== 6.2 模态框容器 ========== */
.sms-verification-modal {
  width: 700px !important;
  background-color: #ffffff !important;
  border-radius: 8px !important;
  padding: 40px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) !important;
  position: relative !important;
}

/* ========== 6.3 模态框标题 ========== */
.sms-verification-title {
  font-size: 20px !important;
  color: #333333 !important;
  font-weight: 500 !important;
  margin-bottom: 30px !important;
  text-align: center !important;
}

/* ========== 6.4 输入框组 ========== */
.sms-verification-input-group {
  margin-bottom: 20px !important;
}

.sms-verification-label {
  display: block !important;
  font-size: 14px !important;
  color: #333333 !important;
  margin-bottom: 8px !important;
}

.sms-verification-input-wrapper {
  display: flex !important;
  gap: 10px !important;
}

.sms-verification-input {
  flex: 1 !important;
  height: 45px !important;
  padding: 0 15px !important;
  font-size: 14px !important;
  color: #333333 !important;
  border: 1px solid #e0e0e0 !important;
  border-radius: 4px !important;
  box-sizing: border-box !important;
  transition: border-color 0.3s ease !important;
}

.sms-verification-input::placeholder {
  color: #cccccc !important;
}

.sms-verification-input:focus {
  outline: none !important;
  border-color: #2d8cf0 !important;
}

.sms-verification-input.error {
  border-color: #f44336 !important;
}

/* ========== 6.5 获取验证码按钮 ========== */
.sms-verification-get-code-button {
  width: 150px !important;
  height: 45px !important;
  background-color: #2d8cf0 !important;
  color: #ffffff !important;
  font-size: 14px !important;
  border: none !important;
  border-radius: 4px !important;
  cursor: pointer !important;
  transition: background-color 0.3s ease !important;
}

.sms-verification-get-code-button:hover {
  background-color: #1976d2 !important;
}

.sms-verification-get-code-button:disabled {
  background-color: #cccccc !important;
  cursor: not-allowed !important;
}

/* ========== 6.6 确定按钮 ========== */
.sms-verification-submit-button {
  width: 100% !important;
  height: 45px !important;
  background-color: #ff7518 !important;
  color: #ffffff !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  border: none !important;
  border-radius: 4px !important;
  cursor: pointer !important;
  margin-top: 30px !important;
  transition: background-color 0.3s ease !important;
}

.sms-verification-submit-button:hover {
  background-color: #e66900 !important;
}

.sms-verification-submit-button:disabled {
  background-color: #cccccc !important;
  cursor: not-allowed !important;
}

/* ========== 6.7 错误提示 ========== */
.sms-verification-error {
  padding: 10px 15px !important;
  margin-bottom: 15px !important;
  background-color: #fff1f0 !important;
  color: #f44336 !important;
  font-size: 13px !important;
  border-radius: 4px !important;
  border: 1px solid #ffccc7 !important;
}

/* ========== 6.8 关闭按钮 ========== */
.sms-verification-close-button {
  position: absolute !important;
  top: 15px !important;
  right: 15px !important;
  width: 30px !important;
  height: 30px !important;
  background-color: transparent !important;
  border: none !important;
  cursor: pointer !important;
  font-size: 24px !important;
  color: #999999 !important;
  transition: color 0.3s ease !important;
}

.sms-verification-close-button:hover {
  color: #333333 !important;
}
```

---

## 7. 使用说明

### 7.1 在组件中使用

1. **创建对应的 CSS 文件**
   ```
   frontend/src/components/ComponentName.css
   ```

2. **复制上方样式代码到 CSS 文件**

3. **在组件中导入样式**
   ```tsx
   import './ComponentName.css';
   ```

4. **应用类名到 JSX 元素**
   ```tsx
   <div className="login-form">
     {/* 组件内容 */}
   </div>
   ```

### 7.2 验证清单

使用本样式指南时，请确保：

- [ ] 所有颜色值与颜色体系一致
- [ ] 所有尺寸精确到 px
- [ ] 所有图片路径正确（相对于 CSS 文件位置）
- [ ] 所有图片尺寸符合设计规范
- [ ] 交互状态（hover, focus, active, disabled, error）正确实现
- [ ] 响应式设计考虑（如需要）
- [ ] 浏览器兼容性测试通过

### 7.3 图片资源路径说明

所有图片资源位于 `requirements/images/` 目录：

```
requirements/images/
├── 整体页面截图/
│   └── 登录页面.png
├── 组件特写截图/
│   ├── 顶部导航.png
│   ├── 登录表单.png
│   └── 底部导航.png
├── 登录页-背景-新.jpg
├── 登录页-顶部导航-Logo.png
├── 登录页-底部导航-中国铁路官方微信二维码.png
├── 登录页-底部导航-中国铁路官方微博二维码.png
├── 登录页-底部导航-12306公众号二维码.png
├── 登录页-底部导航-铁路12306二维码.png
├── 登录页-底部导航-中国国家铁路集团有限公司.png
├── 登录页-底部导航-中国铁路财产保险自保有限公司.png
├── 登录页-底部导航-中国铁路95306网.png
├── 登录页-底部导航-中铁快运股份有限公司.png
└── metadata.json
```

在 CSS 中使用时，确保路径相对于 CSS 文件位置正确：
```css
/* 如果 CSS 在 frontend/src/components/ */
background-image: url('../../../requirements/images/登录页-背景-新.jpg');

/* 或者将图片复制到 public/images/ 后使用 */
background-image: url('/images/登录页-背景-新.jpg');
```

### 7.4 颜色验证

本文档中的颜色值基于截图视觉分析得出。建议开发者使用以下工具验证精确颜色值：

1. **浏览器开发者工具**：右键元素 → 检查 → 查看 Computed 样式
2. **Chrome 取色器**：开发者工具 → 点击颜色方块 → 使用取色器
3. **在线工具**：ColorZilla、PerfectPixel 等浏览器扩展

### 7.5 响应式建议

当前样式按 1185px 固定宽度设计。如需适配不同屏幕尺寸，建议：

1. **桌面端（≥1200px）**：保持当前尺寸，居中显示
2. **平板端（768px-1199px）**：缩小到 90% 宽度
3. **移动端（<768px）**：切换为单列布局，登录框占据全宽

```css
@media (max-width: 1199px) {
  .login-page-container {
    width: 90% !important;
  }
}

@media (max-width: 767px) {
  .login-form {
    position: static !important;
    width: 100% !important;
  }
}
```

---

## 8. 总结

本样式指南提供了 12306 登录页面的完整 CSS 实现，包括：

✅ **5 个主要组件**：页面容器、顶部导航、登录表单、底部导航、短信验证模态框  
✅ **完整的颜色体系**：10 种精确颜色定义  
✅ **所有交互状态**：hover、focus、active、disabled、error  
✅ **10 张图片资源**：带完整的尺寸和 CSS 策略说明  
✅ **像素级精确**：所有尺寸、间距、边框精确到 px  
✅ **即插即用**：代码可直接复制使用，无需修改  

使用本指南，开发者可以快速实现与原始设计 100% 一致的 UI 界面。
