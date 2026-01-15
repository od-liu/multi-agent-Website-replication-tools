# UI 调整迭代日志

## 初始准备 (Initial Setup)

- **目标参考图片**: `target_image.png`（项目根目录）
- **复刻页面 URL**: `http://localhost:5173/`
- **初始截图**: `replica_page_iteration_0.png`
- **特别说明**: 背景是滚动切换的，差异不需要调整

---

## Iteration 1
- **差异点（截图对比，≥5）**：
  1. Header“欢迎登录12306”位置不一致（复刻更靠右/后续又需微调）- 顶部
  2. 登录框 Tab 分隔样式不一致（缺少竖线/多了下划线）- 登录框顶部
  3. 登录框底部说明区缺失 - 登录框底部
  4. 页脚“官方APP下载…”说明块缺失/不常显 - 页脚右侧
  5. 底部灰条右侧无障碍按钮缺失 - 页面最底部右侧
- **从原网站提取的信息**（`https://kyfw.12306.cn/otn/resources/login.html`）：
  - Tab 竖分隔线：`li.login-hd-code.active::after`，`width:1px;height:24px;top:27px;left:159px;background:#dedede`
  - 登录框说明区：`.login-ft`，`padding: 10px 20px 15px; border-top:1px solid #dedede`
  - 登录框：`380×373`，`top:50%;left:50%;margin-left:215px;margin-top:-225px`
- **修复内容**：
  - 修改文件：`frontend/src/components/LoginForm/LoginForm.tsx`、`LoginForm.css`、`Header.css`、`Footer.tsx`、`Footer.css`
  - 新增资源：`frontend/public/images/footer-slh.jpg`
  - 已修复：Tab 竖分隔/无下划线、`login-ft` 说明区、页脚“官方APP下载…”常显说明框、底部无障碍图片按钮
- **验证结果**：部分修复
- **剩余问题**：
  - Header 欢迎文案位置仍需向右对齐到 target
  - 登录按钮需要改为更扁平的纯色橙（去渐变）
  - 输入框图标需更接近原站细线图标
  - Footer 标题换行需要消除（保持单行）

## Iteration 2
- **差异点（截图对比，≥5）**：
  1. Header 欢迎文案偏左/偏右不一致 - 顶部
  2. 登录按钮仍有渐变/圆角不匹配 - 登录框按钮
  3. Footer 标题换行 - 页脚二维码标题
  4. Footer 右侧说明框尺寸/排版差异 - 页脚右侧
  5. “忘记密码？”颜色/字号偏蓝偏大 - 登录框链接
- **从原网站提取的信息**：
  - 登录按钮：`bg #FF8000; border 1px solid #FF8000; border-radius 6px; height 44; padding 4px 10px; box-shadow none`
  - “忘记密码？”：`font-size 12px; color #999; margin 0 5px`
  - 二维码标题：`width 140px; height/line-height 54px; font-size 14px; text-align center`
- **修复内容**：
  - 修改文件：`frontend/src/components/Header/Header.css`、`LoginForm.css`、`Footer.css`
  - 结果：按钮改为纯色扁平、Footer 标题不再换行、右侧说明框排版恢复横向
- **验证结果**：部分修复（整体更接近）
- **剩余问题**：
  - Header 欢迎文案仍需微调到 target 的“更靠中”位置
  - 输入框图标细节仍不一致

## Iteration 3
- **差异点（截图对比，≥5）**：
  1. Header “欢迎登录12306”在复刻图中更靠右（离右侧边距更小），target 中更靠中一些 - 顶部右侧
  2. 登录框输入框左侧图标形态不一致：复刻更像“实心圆/方块”，target 为更细的线性人形/锁图标 - 登录框输入框左侧
  3. 输入框 placeholder 的灰度不一致：复刻略深，target 更浅 - 登录框输入框文字
  4. 登录卡片的边框/阴影观感略不同：复刻边框更显眼，target 更“轻” - 登录框外框
  5. 页脚右侧“官方APP下载…”说明框的排版（行距/左右留白）与 target 略有差异 - 页脚右侧说明框
- **从目标参考图片分析/复刻页样式快照**：
  - Header 欢迎文案：需要继续把整体视觉中心向左微调（基于对比图观感）
- **修复内容**：收窄 `Header` 容器最大宽度（`1200px -> 1000px`），让欢迎文案整体向左回收。
- **修改文件**：`frontend/src/components/Header/Header.css`
- **验证结果**：部分修复（Header 留白更接近 target）
- **剩余问题**：输入框图标/placeholder 仍需像素级微调

## Iteration 4
- **差异点（截图对比，≥5）**：
  1. Header 右侧“欢迎登录12306”仍偏靠右 - 顶部右侧
  2. 用户名输入框左侧图标：复刻（修复前）为实心块，target 为细线用户 icon - 登录框输入框左侧
  3. 密码输入框左侧图标：复刻（修复前）为实心块，target 为细线锁 icon - 登录框输入框左侧
  4. placeholder 灰度略深 - 登录框输入框文字
  5. 页脚右侧提示框内文字留白/行距略紧 - 页脚右侧说明框
- **从原网站提取的信息**（`https://kyfw.12306.cn/otn/resources/login.html`）：
  - 输入框左侧图标为字体字形（快照中可见 `` / ``），非图片资源
- **修复内容**：
  - 修改文件：`frontend/src/components/LoginForm/LoginForm.css`
  - 结果：将 `.icon-user/.icon-pwd` 从实心色块替换为线性轮廓 SVG，并轻微调淡 placeholder
- **验证结果**：部分修复（验证截图：`replica_page_iteration_4_verify.png`）
- **剩余问题**：Header 欢迎文案位置仍需微调；卡片边框观感/页脚提示框留白仍有细节差异

## Iteration 5
- **差异点（截图对比，≥5）**：
  1. Header 欢迎文案在复刻图中偏右（与 Logo 分离过大）- 顶部
  2. 登录卡片边框观感偏重 - 登录框外框
  3. placeholder 灰度略深 - 登录框输入框文字
  4. 页脚右侧提示框留白/行距略紧 - 页脚右侧说明框
  5. 底部无障碍按钮白底框位置/内边距有细微差 - 底部右侧
- **从原网站提取的信息**（`https://kyfw.12306.cn/otn/resources/login.html`）：
  - 欢迎文案紧跟 Logo：Logo 宽约 200px，welcome 自身 `padding-left:40px`、`font-size:20px`、`height:80px`
- **修复内容**：
  - 修改文件：`frontend/src/components/Header/Header.css`
  - 结果：`.header-con` 改为 `flex-start`，`.header-welcome` 设置 `padding-left:40px`，欢迎文案回到 Logo 右侧
- **验证结果**：部分修复（验证截图：`replica_page_iteration_5_verify.png`）
- **剩余问题**：登录卡片边框/placeholder/页脚提示框留白仍需继续像素级微调

## Iteration 6
- **差异点（截图对比，≥5）**：
  1. 登录表单内层宽度偏大（复刻 340px，目标 320px）- 登录框
  2. 输入框 padding/圆角不一致（复刻更“圆”、左侧留白更大）- 登录框输入框
  3. 密码框到按钮的垂直间距偏大 - 登录框中部
  4. 按钮到注册链接的垂直间距偏大 - 登录框中部
  5. 底部灰条备案小图标缺失 - 页脚版权条
- **从原网站提取的信息**（`https://kyfw.12306.cn/otn/resources/login.html`）：
  - 输入框：`320×44`，`padding: 4px 10px 4px 36px`，`border: 1px solid #dedede`，`border-radius: 0`
  - 按钮：`320×44`，`padding: 4px 10px`，`line-height: 34px`，`border-radius: 6px`，`background: #FF8000`
  - 间距：密码框→按钮 `16px`；按钮→注册链接约 `12.5px`
  - 备案图标：`gongan.png`，`13×13`，icon→链接间距约 `4px`
- **修复内容**：
  - 修改文件：`frontend/src/components/LoginForm/LoginForm.css`、`frontend/src/components/Footer/Footer.tsx`、`Footer.css`
  - 新增资源：`frontend/public/images/gongan.png`
  - 验证截图：`replica_page_iteration_6_verify.png`
- **验证结果**：基本修复（表单尺寸/间距已对齐，页脚备案图标已补齐）
- **剩余问题**：Header 文案与少量整体留白仍有细微像素差异
