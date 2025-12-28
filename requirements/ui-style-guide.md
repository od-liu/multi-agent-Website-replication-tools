# UI 样式规范 - 12306登录页面

## 1. 颜色体系

### 1.1 品牌色
```css
/* 主题色 - 蓝色 */
--primary-color: #0066CC;

/* 强调色 - 橙色 */
--accent-color: #FF7700;
```

### 1.2 文本颜色
```css
/* 主要文本 */
--text-primary: #333333;

/* 次要文本 */
--text-secondary: #666666;

/* 辅助文本 */
--text-tertiary: #999999;

/* 占位符 */
--text-placeholder: #CCCCCC;
```

### 1.3 状态颜色
```css
/* 错误提示 */
--color-error: #FF4D4F;

/* 成功提示 */
--color-success: #52C41A;

/* 警告提示 */
--color-warning: #FAAD14;
```

### 1.4 背景和边框
```css
/* 页面背景 */
--bg-page: #F5F5F5;

/* 白色背景 */
--bg-white: #FFFFFF;

/* 边框颜色 */
--border-color: #E5E5E5;

/* 分隔线颜色 */
--divider-color: #D9D9D9;
```

⚠️ **注意**: 以上颜色值基于视觉分析，建议开发者使用浏览器开发工具的取色器验证精确值。

---

## 2. 顶部导航

### 2.1 文件路径
- 组件: `frontend/src/components/TopNavigation/TopNavigation.tsx`
- 样式: `frontend/src/components/TopNavigation/TopNavigation.css`

### 2.2 组件位置说明
- 父容器: body
- 位置: 页面最上方，横向占据整个页面宽度
- 尺寸: 1497px × 80px (宽度可100%，高度固定)
- 布局: position: relative, z-index: 2000

### 2.3 完整样式代码

```css
/* ========== 顶部导航容器 ========== */
/* 📸 参考截图: requirements/images/组件特写截图/顶部导航.png */
.header {
  position: relative !important;
  display: block !important;
  width: 100% !important;
  height: 80px !important;
  background-color: #FFFFFF !important;
  z-index: 2000 !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05) !important;
}

.header .wrapper {
  max-width: 1200px !important;
  margin: 0 auto !important;
  padding: 0 20px !important;
}

.header-con {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  height: 80px !important;
}

/* ========== Logo区域 ========== */
/* 使用CSS背景图实现Logo */
.header .logo {
  margin: 0 !important;
  padding: 0 !important;
}

.header .logo a {
  display: block !important;
  width: 200px !important;
  height: 50px !important;
  background-image: url('../images/登录页面-顶部导航-Logo.png') !important;
  background-size: auto !important;
  background-position: 0% 0% !important;
  background-repeat: no-repeat !important;
  text-indent: -9999px !important; /* 隐藏文字，保留用于SEO */
  overflow: hidden !important;
}

/* ========== 欢迎文字 ========== */
.header-welcome {
  font-size: 18px !important;
  color: #333333 !important;
  font-weight: 400 !important;
  letter-spacing: 1px !important;
}
```

### 2.4 React组件示例

```tsx
import React from 'react';
import './TopNavigation.css';

const TopNavigation: React.FC = () => {
  return (
    <div className="header" role="complementary" aria-label="头部">
      <div className="wrapper">
        <div className="header-con">
          <h1 className="logo" role="banner">
            <a href="https://www.12306.cn/index/index.html">中国铁路12306</a>
          </h1>
          <div className="header-welcome">欢迎登录12306</div>
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;
```

### 2.5 验证清单
- [ ] Logo使用CSS背景图实现
- [ ] Logo链接文字被隐藏但保留在DOM中（用于SEO和无障碍）
- [ ] 欢迎文字显示正确
- [ ] 导航栏高度为80px
- [ ] z-index为2000确保在其他内容之上

---

## 3. 登录表单

### 3.1 文件路径
- 组件: `frontend/src/components/LoginForm/LoginForm.tsx`
- 样式: `frontend/src/components/LoginForm/LoginForm.css`

### 3.2 组件位置说明
- 父容器: body
- 位置: 页面主内容区域，包含轮播图背景和右侧浮动的登录卡片
- 尺寸: 1497px × 600px (宽度可100%，高度固定)
- 布局: position: relative

### 3.3 完整样式代码

```css
/* ========== 登录面板容器 ========== */
/* 📸 参考截图: requirements/images/组件特写截图/登录表单.png */
.login-panel {
  position: relative !important;
  width: 100% !important;
  height: 600px !important;
  overflow: hidden !important;
}

/* ========== 轮播图背景 ========== */
.loginSlide {
  position: relative !important;
  width: 100% !important;
  height: 600px !important;
}

.loginSlide .bd {
  position: relative !important;
  width: 100% !important;
  height: 600px !important;
  overflow: hidden !important;
}

.loginSlide .tempWrap {
  overflow: hidden !important;
  position: relative !important;
  width: 100% !important;
}

.loginSlide ul {
  list-style: none !important;
  margin: 0 !important;
  padding: 0 !important;
  position: relative !important;
  transition: left 0.3s ease !important;
}

.loginSlide li {
  float: left !important;
  width: 100% !important;
  height: 600px !important;
  background-position: center center !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;
}

/* 轮播图指示器 */
.loginSlide .hd {
  position: absolute !important;
  bottom: 20px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  z-index: 10 !important;
}

.loginSlide .hd ul {
  display: flex !important;
  gap: 10px !important;
}

.loginSlide .hd li {
  width: 40px !important;
  height: 40px !important;
  line-height: 40px !important;
  text-align: center !important;
  background-color: rgba(255, 255, 255, 0.6) !important;
  color: #333333 !important;
  font-size: 14px !important;
  cursor: pointer !important;
  border-radius: 50% !important;
  transition: all 0.3s ease !important;
}

.loginSlide .hd li.on {
  background-color: #FFFFFF !important;
  font-weight: bold !important;
}

/* ========== 登录卡片 ========== */
.login-box {
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  margin-left: 215px !important; /* 右侧偏移 */
  margin-top: -225px !important; /* 垂直居中 */
  width: 400px !important;
  background-color: #FFFFFF !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  padding: 30px !important;
  z-index: 100 !important;
}

/* ========== 登录方式Tab ========== */
.login-hd {
  display: flex !important;
  list-style: none !important;
  margin: 0 0 30px 0 !important;
  padding: 0 !important;
  border-bottom: 2px solid #E5E5E5 !important;
}

.login-hd li {
  flex: 1 !important;
  text-align: center !important;
}

.login-hd li a {
  display: block !important;
  padding: 15px 0 !important;
  font-size: 16px !important;
  color: #666666 !important;
  text-decoration: none !important;
  border-bottom: 2px solid transparent !important;
  margin-bottom: -2px !important;
  transition: all 0.3s ease !important;
}

.login-hd li.active a {
  color: #0066CC !important;
  border-bottom-color: #0066CC !important;
  font-weight: 500 !important;
}

.login-hd li a:hover {
  color: #0066CC !important;
}

/* ========== 输入框容器 ========== */
.login-item {
  position: relative !important;
  height: 44px !important;
  margin-bottom: 20px !important;
}

/* Icon标签 */
.item-label {
  position: absolute !important;
  left: 15px !important;
  top: 11px !important;
  z-index: 1 !important;
}

.item-label .icon {
  font-family: 'icon' !important;
  font-size: 20px !important;
  color: #999999 !important;
}

.icon-user::before {
  content: "\\e001" !important; /* 用户图标的Unicode */
}

.icon-pwd::before {
  content: "\\e002" !important; /* 密码图标的Unicode */
}

/* 输入框 */
.login-item .input {
  width: 100% !important;
  height: 44px !important;
  line-height: 44px !important;
  padding: 0 15px 0 45px !important; /* 左侧留空给图标 */
  border: 1px solid #D9D9D9 !important;
  border-radius: 4px !important;
  font-size: 14px !important;
  color: #333333 !important;
  outline: none !important;
  transition: border-color 0.3s ease !important;
}

.login-item .input::placeholder {
  color: #CCCCCC !important;
}

.login-item .input:focus {
  border-color: #0066CC !important;
}

/* 输入框错误状态 */
.login-item .input.error {
  border-color: #FF4D4F !important;
}

/* ========== 错误提示 ========== */
.login-error {
  display: none !important; /* 默认隐藏 */
  margin-bottom: 15px !important;
  padding: 10px 15px !important;
  background-color: #FFF1F0 !important;
  color: #FF4D4F !important;
  font-size: 14px !important;
  border-radius: 4px !important;
  border: 1px solid #FFCCC7 !important;
}

.login-error.show {
  display: block !important;
}

/* ========== 登录按钮 ========== */
.login-btn {
  display: block !important;
  width: 100% !important;
  height: 44px !important;
  line-height: 44px !important;
  text-align: center !important;
  background-color: #FF7700 !important;
  color: #FFFFFF !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  border-radius: 4px !important;
  text-decoration: none !important;
  cursor: pointer !important;
  transition: background-color 0.3s ease !important;
  margin-bottom: 20px !important;
}

.login-btn:hover {
  background-color: #FF8C1A !important;
}

.login-btn:active {
  background-color: #E66900 !important;
}

/* 登录按钮禁用状态 */
.login-btn:disabled,
.login-btn.disabled {
  background-color: #CCCCCC !important;
  cursor: not-allowed !important;
}

/* ========== 注册和找回密码链接 ========== */
.login-other {
  text-align: center !important;
  font-size: 14px !important;
  color: #666666 !important;
}

.login-other a {
  color: #0066CC !important;
  text-decoration: none !important;
  transition: color 0.3s ease !important;
}

.login-other a:hover {
  color: #0052A3 !important;
  text-decoration: underline !important;
}

/* ========== 服务时间说明 ========== */
.login-tips {
  position: absolute !important;
  bottom: 20px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  width: 80% !important;
  text-align: center !important;
  font-size: 12px !important;
  color: #999999 !important;
  line-height: 1.5 !important;
  z-index: 10 !important;
}
```

### 3.4 交互状态样式

> 📸 **参考截图**：以下样式基于实际交互场景截图提取，确保错误提示样式的准确性。

**错误提示交互状态**：

登录表单的错误提示样式已在上述CSS中定义（`.login-error`类）。该样式在以下交互场景中触发：

1. **用户名为空错误**
   - 📸 参考截图: `requirements/images/交互状态截图/登录表单-错误-用户名为空.png`
   - 触发条件: 用户名输入框为空时点击"立即登录"
   - 提示文字: "请输入用户名！"
   - 样式规格（从截图提取）:
     * 背景色: `#FFF1F0` (浅红色)
     * 文字颜色: `#FF4D4F` (红色)
     * 边框: `1px solid #FFCCC7`
     * 内边距: `10px 15px`
     * 圆角: `4px`
     * 字体大小: `14px`
     * 位置: 输入框下方，间距8px

2. **密码为空错误**
   - 📸 参考截图: `requirements/images/交互状态截图/登录表单-错误-密码为空.png`
   - 触发条件: 密码输入框为空时点击"立即登录"
   - 提示文字: "请输入密码！"
   - 样式规格: 与用户名错误提示一致

3. **密码长度不足错误**
   - 📸 参考截图: `requirements/images/交互状态截图/登录表单-错误-密码长度不足.png`
   - 触发条件: 密码长度少于6位时点击"立即登录"
   - 提示文字: "密码长度不能少于6位！"
   - 样式规格: 与上述错误提示一致，但文字更长

**React实现示例（错误提示）**：

```tsx
// 在handleLogin函数中
if (!username) {
  setError('请输入用户名！');
  return;
}
if (!password) {
  setError('请输入密码！');
  return;
}
if (password.length < 6) {
  setError('密码长度不能少于6位！');
  return;
}

// 在JSX中
{error && (
  <div className="login-error show">{error}</div>
)}
```

---

### 3.5 Icon字体引入

```css
/* ========== Icon字体 ========== */
/* 📁 字体文件位于: requirements/images/fonts/ */
@font-face {
  font-family: 'icon';
  src: url('../images/fonts/iconfont.woff2') format('woff2'),
       url('../images/fonts/iconfont.woff') format('woff'),
       url('../images/fonts/iconfont.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

### 3.6 React组件示例

```tsx
import React, { useState } from 'react';
import './LoginForm.css';

const LoginForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'account' | 'qrcode'>('account');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!username) {
      setError('请输入用户名！');
      return;
    }
    if (!password) {
      setError('请输入密码！');
      return;
    }
    if (password.length < 6) {
      setError('密码长度不能少于6位！');
      return;
    }
    // 登录逻辑...
  };

  return (
    <div className="login-panel">
      {/* 轮播图背景 */}
      <div className="loginSlide">
        <div className="bd">
          <div className="tempWrap">
            <ul>
              <li style={{ backgroundImage: "url('../images/登录页面-主内容-背景图1.jpg')" }} />
              <li style={{ backgroundImage: "url('../images/登录页面-主内容-背景图2.jpg')" }} />
            </ul>
          </div>
        </div>
        <div className="hd">
          <ul>
            <li className="on">1</li>
            <li>2</li>
          </ul>
        </div>
      </div>

      {/* 登录卡片 */}
      <div className="login-box">
        <ul className="login-hd">
          <li className={activeTab === 'account' ? 'active' : ''}>
            <a onClick={() => setActiveTab('account')}>账号登录</a>
          </li>
          <li className={activeTab === 'qrcode' ? 'active' : ''}>
            <a onClick={() => setActiveTab('qrcode')}>扫码登录</a>
          </li>
        </ul>

        <div className="login-bd">
          {activeTab === 'account' && (
            <div className="login-account">
              <div className="login-item">
                <label className="item-label">
                  <i className="icon icon-user"></i>
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="用户名/邮箱/手机号"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="login-item">
                <label className="item-label">
                  <i className="icon icon-pwd"></i>
                </label>
                <input
                  type="password"
                  className="input"
                  placeholder="密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <div className="login-error show">{error}</div>
              )}

              <a className="login-btn" onClick={handleLogin}>
                立即登录
              </a>

              <div className="login-other">
                <a href="https://kyfw.12306.cn/otn/regist/init">注册12306账号</a>
                {' | '}
                <a href="https://kyfw.12306.cn/otn/view/find_my_password.html">忘记密码？</a>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="login-tips">
        铁路12306每日5:00至次日1:00（周二为5:00至24:00）提供购票、改签、变更到站业务办理， 全天均可办理退票等其他服务。
      </p>
    </div>
  );
};

export default LoginForm;
```

### 3.6 验证清单
- [ ] 轮播图背景正常显示
- [ ] 登录卡片浮动在右侧并垂直居中
- [ ] Icon字体正常显示用户名和密码图标
- [ ] 输入框获得焦点时边框变为蓝色
- [ ] 错误提示正确显示（红色背景，红色文字）
- [ ] 登录按钮为橙色(#FF7700)，hover时变浅
- [ ] 注册和找回密码链接为蓝色，hover时有下划线

---

## 4. 底部导航

### 4.1 文件路径
- 组件: `frontend/src/components/BottomFooter/BottomFooter.tsx`
- 样式: `frontend/src/components/BottomFooter/BottomFooter.css`

### 4.2 组件位置说明
- 父容器: body
- 位置: 页面最底部，横向占据整个页面宽度
- 尺寸: 1497px × 274px (宽度可100%，高度由内容决定)
- 布局: position: static

### 4.3 完整样式代码

```css
/* ========== 底部导航容器 ========== */
/* 📸 参考截图: requirements/images/组件特写截图/底部导航.png */
.footer {
  width: 100% !important;
  background-color: #FFFFFF !important;
  border-top: 1px solid #E5E5E5 !important;
}

.footer-con {
  display: flex !important;
  justify-content: space-between !important;
  max-width: 1200px !important;
  margin: 0 auto !important;
  padding: 40px 20px !important;
}

/* ========== 友情链接区域 ========== */
.foot-links {
  margin-right: 20px !important;
}

.foot-con-tit {
  font-size: 16px !important;
  color: #333333 !important;
  font-weight: 500 !important;
  margin: 0 0 20px 0 !important;
}

.foot-links-list {
  display: grid !important;
  grid-template-columns: repeat(2, 200px) !important;
  grid-template-rows: repeat(2, 34px) !important;
  gap: 15px !important;
  list-style: none !important;
  margin: 0 !important;
  padding: 0 !important;
}

.foot-links-list li a {
  display: block !important;
}

.foot-links-list img {
  width: 200px !important;
  height: 34px !important;
  object-fit: contain !important;
  transition: opacity 0.3s ease !important;
}

.foot-links-list li a:hover img {
  opacity: 0.8 !important;
}

/* ========== 二维码区域 ========== */
.foot-code {
  display: flex !important;
  gap: 20px !important;
  list-style: none !important;
  margin: 0 !important;
  padding: 0 !important;
}

.foot-code li {
  text-align: center !important;
}

.foot-code .code-pic {
  position: relative !important;
  width: 80px !important;
  height: 80px !important;
  margin: 10px auto 0 !important;
}

.foot-code .code-pic img {
  width: 80px !important;
  height: 80px !important;
  object-fit: contain !important;
}

.foot-code .code-tips {
  position: absolute !important;
  top: 100px !important;
  left: -30px !important;
  width: 140px !important;
  font-size: 12px !important;
  color: #999999 !important;
  line-height: 1.4 !important;
  text-align: left !important;
}

/* ========== 版权信息区域 ========== */
.footer-txt {
  background-color: #5A5A5A !important;
  padding: 20px 0 !important;
  text-align: center !important;
  position: relative !important;
}

.footer-txt p {
  margin: 8px 0 !important;
  font-size: 12px !important;
  color: #C1C1C1 !important;
  line-height: 1.6 !important;
}

.footer-txt span {
  margin: 0 8px !important;
}

.footer-txt a {
  color: #C1C1C1 !important;
  text-decoration: none !important;
  transition: color 0.3s ease !important;
}

.footer-txt a:hover {
  color: #FFFFFF !important;
  text-decoration: underline !important;
}

/* 无障碍服务Logo */
.footer-txt > img {
  position: absolute !important;
  right: 20px !important;
  bottom: 20px !important;
  width: 130px !important;
  height: 46px !important;
  object-fit: contain !important;
}
```

### 4.4 React组件示例

```tsx
import React from 'react';
import './BottomFooter.css';

const BottomFooter: React.FC = () => {
  const friendLinks = [
    { url: 'http://www.china-railway.com.cn/', name: '中国国家铁路集团有限公司', image: 'link05.png' },
    { url: 'http://www.china-ric.com/', name: '中国铁路财产保险自保有限公司', image: 'link02.png' },
    { url: 'http://www.95306.cn/', name: '中国铁路95306网', image: 'link03.png' },
    { url: 'http://www.95572.com/', name: '中铁快运股份有限公司', image: 'link04.png' }
  ];

  const qrCodes = [
    { title: '中国铁路官方微信', image: 'zgtlwb.png' },
    { title: '中国铁路官方微博', image: 'zgtlwx.png' },
    { title: '12306 公众号', image: 'public.png' },
    { title: '铁路12306', image: 'download.png', tip: '官方APP下载，目前铁路未授权其他网站或APP开展类似服务内容，敬请广大用户注意。' }
  ];

  return (
    <div className="footer" role="complementary" aria-label="底部">
      <div className="footer-con">
        <div className="foot-links">
          <h2 className="foot-con-tit">友情链接</h2>
          <ul className="foot-links-list">
            {friendLinks.map((link, index) => (
              <li key={index}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <img src={`../images/登录页面-底部导航-${link.name}Logo.png`} alt={link.name} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <ul className="foot-code">
          {qrCodes.map((qr, index) => (
            <li key={index}>
              <h2 className="foot-con-tit">{qr.title}</h2>
              <div className="code-pic">
                <img src={`../images/登录页面-底部导航-${qr.title}二维码.png`} alt={qr.title} />
                {qr.tip && <div className="code-tips">{qr.tip}</div>}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="footer-txt">
        <p>
          <span>版权所有©2008-2025</span>
          <span>中国铁道科学研究院集团有限公司</span>
          <span>技术支持：铁旅科技有限公司</span>
        </p>
        <p>
          <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010802038392" target="_blank">
            京公网安备 11010802038392号
          </a>
          <span>|</span>
          <span>京ICP备05020493号-4</span>
          <span>|</span>
          <span>ICP证：京B2-20202537</span>
        </p>
        <img src="../images/登录页面-底部导航-无障碍服务Logo.jpg" alt="无障碍服务" />
      </div>
    </div>
  );
};

export default BottomFooter;
```

### 4.5 验证清单
- [ ] 友情链接以2×2网格布局显示
- [ ] 友情链接Logo尺寸为200×34px
- [ ] 二维码横向排列，每个80×80px
- [ ] 铁路12306二维码下方有提示文字
- [ ] 版权信息区域背景为深灰色(#5A5A5A)
- [ ] 版权信息文字为浅灰色(#C1C1C1)
- [ ] 无障碍服务Logo显示在右下角

---

## 5. 使用说明

### 5.1 图片资源路径
所有图片资源位于 `requirements/images/` 目录下，按照以下结构组织：

```
requirements/images/
├── fonts/
│   ├── iconfont.woff2
│   ├── iconfont.woff
│   └── iconfont.ttf
├── 登录页面-顶部导航-Logo.png
├── 登录页面-主内容-背景图1.jpg
├── 登录页面-主内容-背景图2.jpg
├── 登录页面-底部导航-中国铁路官方微信二维码.png
├── 登录页面-底部导航-中国铁路官方微博二维码.png
├── 登录页面-底部导航-12306公众号二维码.png
├── 登录页面-底部导航-铁路12306二维码.png
├── 登录页面-底部导航-中国国家铁路集团Logo.png
├── 登录页面-底部导航-中国铁路财产保险Logo.png
├── 登录页面-底部导航-中国铁路95306网Logo.png
├── 登录页面-底部导航-中铁快运Logo.png
└── 登录页面-底部导航-无障碍服务Logo.jpg
```

### 5.2 CSS变量配置
建议在全局CSS中定义颜色变量，便于统一管理和主题切换：

```css
:root {
  /* 品牌色 */
  --primary-color: #0066CC;
  --accent-color: #FF7700;
  
  /* 文本颜色 */
  --text-primary: #333333;
  --text-secondary: #666666;
  --text-tertiary: #999999;
  --text-placeholder: #CCCCCC;
  
  /* 状态颜色 */
  --color-error: #FF4D4F;
  --color-success: #52C41A;
  --color-warning: #FAAD14;
  
  /* 背景和边框 */
  --bg-page: #F5F5F5;
  --bg-white: #FFFFFF;
  --border-color: #E5E5E5;
  --divider-color: #D9D9D9;
}
```

### 5.3 响应式设计建议
本文档基于1497px宽度设计，建议添加以下响应式断点：

```css
/* 平板 */
@media (max-width: 1024px) {
  .login-box {
    margin-left: 0 !important;
    left: 50% !important;
    transform: translateX(-50%) translateY(-50%) !important;
  }
}

/* 手机 */
@media (max-width: 768px) {
  .header-con {
    flex-direction: column !important;
  }
  
  .login-box {
    width: 90% !important;
    max-width: 400px !important;
  }
  
  .footer-con {
    flex-direction: column !important;
  }
  
  .foot-code {
    flex-wrap: wrap !important;
    justify-content: center !important;
  }
}
```

---

## 6. 最终验证清单

开发完成后，请使用以下清单验证实现质量：

### 6.1 视觉还原度
- [ ] 与参考截图对比，布局完全一致
- [ ] 颜色与参考截图匹配（允许±5%色差）
- [ ] 字体大小和间距符合设计
- [ ] 图片资源清晰，无失真

### 6.2 功能完整性
- [ ] 登录表单验证逻辑正确
- [ ] 错误提示正确显示和隐藏
- [ ] 按钮交互状态（hover, active, disabled）正常
- [ ] 链接跳转正确
- [ ] 轮播图自动切换和手动切换正常

### 6.3 无障碍性
- [ ] 所有图片有正确的alt属性
- [ ] 表单输入框有正确的label或aria-label
- [ ] 键盘可以访问所有交互元素
- [ ] Tab键顺序合理

### 6.4 性能优化
- [ ] 图片已压缩优化
- [ ] CSS已合并压缩
- [ ] Icon字体使用woff2格式优先加载
- [ ] 关键CSS内联，非关键CSS异步加载

---

## 7. 短信验证弹窗

### 7.1 文件路径
- 组件: `frontend/src/components/SmsVerificationModal/SmsVerificationModal.tsx`
- 样式: `frontend/src/components/SmsVerificationModal/SmsVerificationModal.css`

### 7.2 组件位置说明
- 类型: 模态弹窗 (Modal)
- 定位: fixed, 页面居中
- 尺寸: 528px × 336px (从实际DOM测量)
- z-index: 100003
- 遮罩层: 半透明黑色背景 rgba(0, 0, 0, 0.5), z-index: 100002

### 7.3 完整样式代码

```css
/* ========== 遮罩层 ========== */
/* 📸 参考截图: requirements/images/交互状态截图/短信验证-初始状态.png */
.dhclose {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  background-color: rgba(0, 0, 0, 0.5) !important;
  z-index: 100002 !important;
  display: none !important; /* 默认隐藏 */
}

.dhclose.show {
  display: block !important;
}

/* ========== 弹窗容器 ========== */
/* 📸 参考截图: requirements/images/交互状态截图/短信验证-初始状态.png */
.login-slider-lf {
  position: fixed !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  width: 528px !important;
  background-color: #FFFFFF !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  z-index: 100003 !important;
  display: none !important; /* 默认隐藏 */
}

.login-slider-lf.show {
  display: block !important;
}

/* ========== 弹窗头部 ========== */
.slider-lf-hd {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  height: 60px !important;
  padding: 0 30px !important;
  border-bottom: 1px solid #E5E5E5 !important;
}

.slider-lf-hd h2 {
  margin: 0 !important;
  font-size: 18px !important;
  font-weight: 500 !important;
  color: #333333 !important;
}

.close-slider {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 32px !important;
  height: 32px !important;
  cursor: pointer !important;
  text-decoration: none !important;
  transition: background-color 0.3s ease !important;
  border-radius: 4px !important;
}

.close-slider:hover {
  background-color: #F5F5F5 !important;
}

.close-slider .icon {
  font-family: 'icon' !important;
  font-size: 20px !important;
  color: #999999 !important;
}

/* ========== 弹窗内容 ========== */
.slider-lf-bd {
  padding: 30px !important;
}

/* ========== 验证方式Tab ========== */
.slider-lf-tab {
  display: flex !important;
  list-style: none !important;
  margin: 0 0 30px 0 !important;
  padding: 0 !important;
  border-bottom: 2px solid #E5E5E5 !important;
}

.slider-lf-tab li {
  flex: 1 !important;
  text-align: center !important;
}

.slider-lf-tab li a {
  display: block !important;
  padding: 15px 0 !important;
  font-size: 16px !important;
  color: #666666 !important;
  text-decoration: none !important;
  border-bottom: 2px solid transparent !important;
  margin-bottom: -2px !important;
  transition: all 0.3s ease !important;
}

.slider-lf-tab li.active a {
  color: #0066CC !important;
  border-bottom-color: #0066CC !important;
  font-weight: 500 !important;
}

/* ========== 短信验证表单 ========== */
.slider-lf-con {
  display: none !important;
}

.slider-lf-con.active {
  display: block !important;
}

/* ========== 输入项容器 ========== */
.prove-item {
  margin-bottom: 20px !important;
}

.prove-label {
  display: block !important;
  margin-bottom: 8px !important;
  font-size: 14px !important;
  color: #666666 !important;
}

.prove-input {
  width: 100% !important;
  height: 44px !important;
  line-height: 44px !important;
  padding: 0 15px !important;
  border: 1px solid #D9D9D9 !important;
  border-radius: 4px !important;
  font-size: 14px !important;
  color: #333333 !important;
  outline: none !important;
  transition: border-color 0.3s ease !important;
}

.prove-input::placeholder {
  color: #CCCCCC !important;
}

.prove-input:focus {
  border-color: #0066CC !important;
}

/* ========== 获取验证码按钮 ========== */
/* 📸 参考截图（初始状态）: requirements/images/交互状态截图/短信验证-初始状态.png */
/* 📸 参考截图（倒计时状态）: requirements/images/交互状态截图/短信验证-成功-获取验证码成功.png */
.btn-send {
  display: inline-block !important;
  padding: 0 20px !important;
  height: 36px !important;
  line-height: 36px !important;
  background-color: #0066CC !important;
  color: #FFFFFF !important;
  font-size: 14px !important;
  border-radius: 4px !important;
  text-decoration: none !important;
  cursor: pointer !important;
  transition: background-color 0.3s ease !important;
  margin-bottom: 10px !important;
}

.btn-send:hover {
  background-color: #0052A3 !important;
}

/* 倒计时状态（禁用） */
.btn-send.countdown,
.btn-send:disabled {
  background-color: #CCCCCC !important;
  color: #666666 !important;
  cursor: not-allowed !important;
}

/* ========== 消息提示区域 ========== */
/* 📸 参考截图（错误）: requirements/images/交互状态截图/短信验证-错误-证件号错误.png */
/* 📸 参考截图（成功）: requirements/images/交互状态截图/短信验证-成功-获取验证码成功.png */
.prove-msg {
  display: none !important; /* 默认隐藏 */
  margin-bottom: 15px !important;
  padding: 10px 15px !important;
  font-size: 14px !important;
  border-radius: 4px !important;
  border: 1px solid !important;
}

.prove-msg.show {
  display: block !important;
}

/* 错误消息样式 */
.prove-msg.error {
  background-color: #FFF1F0 !important;
  color: #FF4D4F !important;
  border-color: #FFCCC7 !important;
}

/* 成功消息样式 */
.prove-msg.success {
  background-color: #F6FFED !important;
  color: #52C41A !important;
  border-color: #B7EB8F !important;
}

/* ========== 确定按钮 ========== */
.btn-submit {
  display: block !important;
  width: 100% !important;
  height: 44px !important;
  line-height: 44px !important;
  text-align: center !important;
  background-color: #FF7700 !important;
  color: #FFFFFF !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  border-radius: 4px !important;
  text-decoration: none !important;
  cursor: pointer !important;
  transition: background-color 0.3s ease !important;
  margin-top: 20px !important;
}

.btn-submit:hover {
  background-color: #FF8C1A !important;
}

.btn-submit:active {
  background-color: #E66900 !important;
}

.btn-submit:disabled,
.btn-submit.disabled {
  background-color: #CCCCCC !important;
  cursor: not-allowed !important;
}
```

### 7.4 交互状态样式说明

> 📸 **参考截图**：以下样式基于实际交互场景截图提取，确保消息提示和倒计时按钮样式的准确性。

**1. 弹窗初始状态**
- 📸 参考截图: `requirements/images/交互状态截图/短信验证-初始状态.png`
- 触发条件: 登录成功后自动弹出
- 样式特点:
  * 弹窗居中显示，带半透明遮罩层
  * "短信验证"Tab激活（蓝色下划线）
  * 证件号和验证码输入框为空
  * "获取验证码"按钮为蓝色可点击状态
  * "确定"按钮为橙色

**2. 证件号错误提示**
- 📸 参考截图: `requirements/images/交互状态截图/短信验证-错误-证件号错误.png`
- 触发条件: 输入错误的证件号后4位，点击"获取验证码"
- 样式特点:
  * 错误消息区域（`.prove-msg.error`）显示
  * 错误文字: "请输入正确的用户信息!"
  * 背景色: `#FFF1F0` (浅红色)
  * 文字颜色: `#FF4D4F` (红色)
  * 边框: `1px solid #FFCCC7`
  * "获取验证码"按钮变为"重新发送(XX)"并开始倒计时

**3. 获取验证码成功状态**
- 📸 参考截图: `requirements/images/交互状态截图/短信验证-成功-获取验证码成功.png`
- 触发条件: 输入正确的证件号后4位，点击"获取验证码"
- 样式特点:
  * 成功消息区域（`.prove-msg.success`）显示
  * 成功文字: "获取手机验证码成功！"
  * 背景色: `#F6FFED` (浅绿色)
  * 文字颜色: `#52C41A` (绿色)
  * 边框: `1px solid #B7EB8F`
  * "获取验证码"按钮变为"重新发送(XX)"
  * 按钮背景变为灰色（`#CCCCCC`），不可点击
  * 倒计时从60秒递减到0秒

### 7.5 React组件示例

```tsx
import React, { useState, useEffect } from 'react';
import './SmsVerificationModal.css';

interface SmsVerificationModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
}

const SmsVerificationModal: React.FC<SmsVerificationModalProps> = ({
  visible,
  onClose,
  onSubmit
}) => {
  const [idCard, setIdCard] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [countdown, setCountdown] = useState(0);

  // 倒计时逻辑
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleGetCode = async () => {
    if (!idCard || idCard.length !== 4) {
      setMessage({ type: 'error', text: '请输入登录账号绑定的证件号后4位' });
      return;
    }

    try {
      // 调用API获取验证码
      const response = await fetch('/api/sms/send', {
        method: 'POST',
        body: JSON.stringify({ idCard }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '获取手机验证码成功！' });
        setCountdown(60); // 开始60秒倒计时
      } else {
        setMessage({ type: 'error', text: '请输入正确的用户信息!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '网络错误，请稍后重试' });
    }
  };

  const handleSubmit = () => {
    if (!verificationCode) {
      setMessage({ type: 'error', text: '请输入验证码' });
      return;
    }
    onSubmit(verificationCode);
  };

  if (!visible) return null;

  return (
    <>
      {/* 遮罩层 */}
      <div className="dhclose show" onClick={onClose} />
      
      {/* 弹窗容器 */}
      <div className="login-slider-lf show">
        {/* 弹窗头部 */}
        <div className="slider-lf-hd">
          <h2>选择验证方式</h2>
          <a href="javascript:;" className="close-slider" onClick={onClose}>
            <i className="icon"></i>
          </a>
        </div>
        
        {/* 弹窗内容 */}
        <div className="slider-lf-bd">
          {/* 验证方式Tab */}
          <ul className="slider-lf-tab">
            <li className="active">
              <a href="javascript:;">短信验证</a>
            </li>
          </ul>
          
          {/* 短信验证表单 */}
          <div className="slider-lf-con active" id="sms">
            {/* 证件号输入区域 */}
            <div className="prove-item">
              <label className="prove-label">
                请输入登录账号绑定的证件号后4位
              </label>
              <input
                type="text"
                className="prove-input"
                id="id_card"
                maxLength={4}
                placeholder="请输入登录账号绑定的证件号后4位"
                value={idCard}
                onChange={(e) => setIdCard(e.target.value)}
              />
            </div>
            
            {/* 验证码输入区域 */}
            <div className="prove-item">
              <a
                href="javascript:;"
                className={`btn-send ${countdown > 0 ? 'countdown' : ''}`}
                onClick={countdown > 0 ? undefined : handleGetCode}
              >
                {countdown > 0 ? `重新发送(${countdown})` : '获取验证码'}
              </a>
              <label className="prove-label">请输入验证码</label>
              <input
                type="text"
                className="prove-input"
                id="verification_code"
                maxLength={6}
                placeholder="输入验证码"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </div>
            
            {/* 消息提示区域 */}
            {message && (
              <div className={`prove-msg show ${message.type}`}>
                {message.text}
              </div>
            )}
            
            {/* 确定按钮 */}
            <a href="javascript:;" className="btn-submit" onClick={handleSubmit}>
              确定
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default SmsVerificationModal;
```

### 7.6 验证清单

- [ ] 弹窗使用固定定位，居中显示
- [ ] 遮罩层z-index为100002，弹窗z-index为100003
- [ ] 证件号输入框最大长度为4位
- [ ] 验证码输入框最大长度为6位
- [ ] "获取验证码"按钮初始为蓝色，倒计时时为灰色
- [ ] 倒计时从60秒递减到0秒
- [ ] 错误消息样式：红色文字 + 浅红色背景
- [ ] 成功消息样式：绿色文字 + 浅绿色背景
- [ ] 关闭按钮可以关闭弹窗
- [ ] 点击遮罩层可以关闭弹窗

---

**文档生成时间**: 2025-12-28  
**基于实际DOM分析**: ✅  
**颜色值来源**: 视觉分析（建议验证）  
**HTML结构来源**: 浏览器DOM  
**尺寸数据来源**: getBoundingClientRect()

