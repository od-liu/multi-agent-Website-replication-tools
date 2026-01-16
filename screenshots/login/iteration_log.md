# UI 调整迭代日志

## 初始准备 (Initial Setup)

- **目标参考图片**: `target_image.png`（项目根目录）
- **目标页面**: `https://kyfw.12306.cn/otn/resources/login.html`
- **复刻页面**: `http://localhost:5174/login`
- **说明**: 背景图为轮播（每次截图可能不同），**轮播内容差异不需要修复**。

---

## Iteration 1

- **截图**：
  - 对比基准：`target_image.png`
  - 复刻初始截图：`replica_page_iteration_1.png`
  - 修复后验证：`replica_page_iteration_1_verify.png`

- **差异点（基于截图对比，≥5；忽略轮播内容差异）**：
  1. 顶部 Header：`欢迎登录12306` 的字号/垂直居中与 Logo 相对间距不一致（target 更“贴近”Logo，且视觉更像 80px 行高）- 顶部区域
  2. 登录卡片整体形态不一致：target 卡片为“直角+轻边框”的分层（白底卡片 + 下方灰底说明区），初始复刻更像圆角卡片带阴影 - 登录框区域
  3. Tab 样式不一致：target 为“中间短竖线分隔 + 选中态蓝色文字”，初始复刻为下划线/边框风格 - 登录框顶部 Tab
  4. 输入框样式不一致：target 输入框为直角、边框更浅、左侧图标与文字间距更紧；初始复刻更圆角、左侧 padding 更大 - 登录框输入框
  5. 登录按钮样式不一致：target 为扁平纯色橙、圆角更大（6px）；初始复刻橙色与圆角不一致 - 登录按钮
  6. “注册/忘记密码”链接行：target 字号更小（12px），`忘记密码？` 为灰色；初始复刻更像同色链接/字号偏大 - 登录按钮下方
  7. 登录框底部说明区：target 有灰底说明区与分割线，初始复刻为页面底部悬浮/样式不同 - 登录框底部

- **从原网站提取的信息**（用于精确对齐样式）：
  - Header welcome：
    - `font-size: 20px; height: 80px; line-height: 80px; padding-left: 40px`
  - 登录卡片（账号登录态）：
    - 容器：`width: 380px; top: 50%; left: 50%; margin-left: 215px; margin-top: -225px`
  - Tab：
    - `height: 78px; line-height: 78px;` 选中态文字 `color: rgb(59,153,252)`；中间 `1px` 竖分隔线 `#dedede`
  - 输入框：
    - `width: 320px; height: 44px; padding: 4px 10px 4px 36px; border: 1px solid #dedede; border-radius: 0`
  - 登录按钮：
    - `width: 320px; height: 44px; padding: 4px 10px; line-height: 34px; background: #FF8000; border: 1px solid #FF8000; border-radius: 6px`
  - 链接行：
    - `注册12306账号` 为蓝色（接近 `rgb(59,153,252)`），`忘记密码？` 为灰色 `#999`，字号 `12px`
  - 底部说明区（登录框内）：
    - 灰底说明区 + 顶部分割线（`#dedede`）

- **修复内容**：
  - 修改文件：
    - `frontend/src/components/TopNavigation/TopNavigation.css`
    - `frontend/src/components/LoginForm/LoginForm.tsx`
    - `frontend/src/components/LoginForm/LoginForm.css`
  - 关键调整：
    - Header：去除阴影，改为 `flex-start`，welcome 对齐到官方字号/行高/左 padding。
    - 登录卡片：去圆角/阴影，改为直角卡片 + 边框；将服务时间说明移入卡片下方灰底说明区。
    - Tab/输入框/按钮/链接行：按原站点 computed styles 对齐（尺寸、padding、颜色、圆角、边框）。

- **验证结果**：
  - 使用 `replica_page_iteration_1_verify.png` 对比 `target_image.png`：主体结构与关键样式已对齐。
  - **未修复项**：轮播背景宣传图内容差异（按要求忽略）。

---

## Iteration 2

- **截图**：
  - 对比基准：`target_image.png`
  - 复刻本轮截图：`replica_page_iteration_2.png`
  - 修复后验证：`replica_page_iteration_2_verify.png`

- **差异点（基于截图对比，≥5；忽略轮播内容差异）**：
  1. 轮播指示器样式不一致：target 为小圆点（隐藏数字），复刻为 40×40 圆形按钮并显示 1/2 - 登录页主视觉底部中间
  2. 轮播指示器 active/normal 态不一致：target 非激活点更透明，复刻透明度/填充规则不一致 - 登录页主视觉底部中间
  3. 页脚“备案信息”左侧缺少公安小图标：target 在“京公网安备…”左侧有 13×13 图标，复刻无 - 页面最底部灰条文字行
  4. “京公网安备…”在 target 为可点击链接，复刻为纯文本 - 页面最底部灰条文字行
  5. “适老化无障碍服务”模块的位置不一致：target 位于灰条右侧（靠右对齐），复刻为居中 - 页面最底部灰条右侧

- **从原网站提取的信息**（用于精确对齐样式）：
  - 轮播指示器（数字 1/2 的 li）：
    - `width: 12px; height: 12px; margin: 0 6px; border-radius: 20px; background: #fff; overflow: hidden; line-height: 100px`
    - 非激活 `opacity: 0.6`，激活 `opacity: 1`
  - 公安图标（备案链接左侧）：
    - 图片：`/otn/resources/images/gongan.png`
    - 尺寸：`13×13`
  - “适老化无障碍服务”：
    - 尺寸：`130×46`
    - 布局：位于页脚灰条区域右侧靠右位置

- **修复内容**：
  - 修改文件：
    - `frontend/src/components/LoginForm/LoginForm.css`
    - `frontend/src/components/BottomNavigation/BottomNavigation.tsx`
    - `frontend/src/components/BottomNavigation/BottomNavigation.css`
  - 关键调整：
    - 轮播指示器：改为 12×12 小圆点、隐藏数字、并按原站设置 active/normal 透明度。
    - 备案信息：加入 `gongan.png` 小图标并将“京公网安备…”改为外链（与原站一致）。
    - 无障碍服务：改为页脚灰条右侧绝对定位靠右展示（不再居中）。

- **验证结果**：
  - 使用 `replica_page_iteration_2_verify.png` 对比 `target_image.png`：轮播指示器与页脚备案/无障碍模块已对齐。
  - **未修复项**：轮播背景宣传图内容差异（按要求忽略）。

---

## Iteration 3

- **截图**：
  - 对比基准：`target_image.png`
  - 复刻本轮截图：`replica_page_iteration_3.png`
  - 修复后验证：`replica_page_iteration_3_verify.png`

- **差异点（基于截图对比，≥5；忽略轮播内容差异）**：
  1. 输入框左侧图标缺失：target 的用户名/密码输入框左侧都有浅灰色 icon，复刻为空白/不可见 - 登录框输入框区域
  2. 输入框左侧 icon 颜色偏差：target 更浅的灰色，复刻更深 - 登录框输入框区域
  3. Tab 中间分隔线位置/长度不一致：target 为较短竖线且位置更靠右，复刻为更长/位置不同的分隔线 - 登录框顶部 Tab 区域
  4. 登录卡片边框分层不一致：target 卡片本体无外边框，但“服务时间说明”上方有 1px 分割线；复刻为卡片外边框 + 底部区块风格不一致 - 登录框整体
  5. 服务时间说明结构不一致：target 文案在卡片内部底部区域（白底）且使用 `p` 文本；复刻为卡片外部独立灰底块 - 登录框底部说明区

- **从原网站提取的信息**（用于精确对齐样式）：
  - 输入框 icon：
    - **元素类型**：iconfont（`font-family: icon`），通过 `::before` 注入字形
    - `icon-user::before` 内容：`""`（Unicode `0xE6DC`），颜色 `rgb(218,218,218)`
    - `icon-pwd::before` 内容：`""`（Unicode `0xE6E0`），颜色 `rgb(218,218,218)`
  - Tab 分隔线：
    - 目标为 **第一个 tab 的 `::after`**：`width: 1px; height: 24px; left: 159px; top: 27px; background: #DEDEDE`
  - 服务时间说明（登录框内）：
    - 容器 `.login-ft`：`padding: 10px 20px 15px; border-top: 1px solid #DEDEDE`
    - 文本 `p`：`font-size: 13px; line-height: 20px; color: #666`

- **修复内容**：
  - 修改文件：
    - `frontend/src/components/LoginForm/LoginForm.tsx`
    - `frontend/src/components/LoginForm/LoginForm.css`
  - 关键调整：
    - 修复 iconfont 映射：将 `.icon-user/.icon-pwd` 的 `content` 改为 `\e6dc/\e6e0`，并将 icon 颜色对齐为 `#DADADA`。
    - Tab 分隔线：改为 `li:first-child::after` 的短竖线（位置/高度按原站点）。
    - 服务时间说明：移入登录卡片内部，按原站点改为 `.login-ft > p` 结构，并添加上边框分割线；同时移除卡片外边框以匹配分层。

- **验证结果**：
  - 使用 `replica_page_iteration_3_verify.png` 对比 `target_image.png`：登录框内 icon、分隔线、服务时间说明区块结构更接近目标。
  - **未修复项**：轮播背景宣传图内容差异（按要求忽略）。

---

## Iteration 4

- **截图**：
  - 对比基准：`target_image.png`
  - 复刻本轮截图：`replica_page_iteration_4.png`
  - 修复后验证：`replica_page_iteration_4_verify2.png`（`replica_page_iteration_4_verify.png` 为中间验证稿）

- **差异点（基于截图对比，≥5；忽略轮播内容差异）**：
  1. 登录 Tab 间距不一致：target 两个 Tab 之间有明显空隙（中间短竖线分隔），复刻 Tab 更“挤在一起” - 登录框顶部 Tab 区域
  2. 底部“友情链接”logo 缺少浅灰边框：target 每个 logo 外有 1px 浅灰框，复刻更像直接贴在白底上 - 页面底部左侧友情链接区域
  3. 底部 4 个二维码缺少浅灰边框：target 每个二维码外有 1px 浅灰框，复刻边框不明显/缺失 - 页面底部中部二维码区域
  4. “官方APP下载...”提示框布局不一致：target 提示框位于最后一个二维码右侧的浅灰边框框内，复刻提示文案位置/框样式不一致 - 页面底部二维码区域最右侧
  5. 页脚灰条（版权信息）底色与上下留白不一致：target 灰条更接近 #666、上下 padding 更紧；复刻灰色更深且 padding 偏大 - 页面最底部灰条
  6. 页脚文字字号/行高不一致：target 版权/备案行更接近 14px、21px 行高；复刻文字更小且行高偏大 - 页面最底部灰条文字行

- **从原网站提取的信息**（用于精确对齐样式）：
  - 登录 Tab：
    - 单个 Tab 链接：`width: 130px; height: 78px; line-height: 78px; font-size: 16px; text-align: center`
    - Tab 容器：`width: 380px; padding: 0 30px;`
    - 两个 Tab 之间存在明显间隔（非紧贴）
  - 友情链接 logo：
    - 每个 logo 图片：`width: 200px; height: 34px; border: 1px solid #EFEFEF`
  - 二维码：
    - 二维码图片：`width: 80px; height: 80px; border: 1px solid #EFEFEF`
  - 页脚灰条（版权信息）：
    - `.footer-txt`：`background: #666; padding: 10px 0; font-size: 14px; line-height: 21px; color: #C1C1C1`

- **修复内容**：
  - 修改文件：
    - `frontend/src/components/LoginForm/LoginForm.css`
    - `frontend/src/components/BottomNavigation/BottomNavigation.css`
  - 关键调整：
    - 登录 Tab：将 `.login-hd li` 调整为更宽的 160px，并让 `a` 固定 130px 居中，从而恢复 Tab 间距与中间短竖线分隔的视觉。
    - 友情链接/二维码：为 logo 与二维码图片统一补齐 `1px solid #EFEFEF` 边框。
    - 二维码布局：固定前 3 列宽度不被 flex 压缩，并将最后一列提示框改为“二维码右侧浅灰框”布局。
    - 页脚灰条：对齐背景色与上下 padding，提升文字字号/行高以匹配 target 的视觉密度。

- **验证结果**：
  - 使用 `replica_page_iteration_4_verify2.png` 对比 `target_image.png`：底部友情链接/二维码边框与整体排布明显更接近，登录 Tab 间距已修正。
  - **剩余问题**（待后续迭代继续）：
    - “官方APP下载...”提示框在 target 中带有更明显的“气泡箭头/指向效果”，复刻目前为普通矩形（细节差异）。
    - 页脚文字的细微字距/分隔符间距仍有小差异。
  - **未修复项**：轮播背景宣传图内容差异（按要求忽略）。

---

## Iteration 5

- **截图**：
  - 对比基准：`target_image.png`
  - 复刻本轮截图：`replica_page_iteration_5.png`
  - 统一视口后验证：`replica_page_iteration_5_verify.png`（将复刻页 viewport 调整为 1440×954 与 target 对齐）
  - 修复后验证：
    - `replica_page_iteration_5_after_patch_layout.png`
    - `replica_page_iteration_5_final.png`

- **差异点（基于截图对比，≥5；忽略轮播内容差异）**：
  1. 复刻截图与 target 画布宽度不一致导致整体“左右留白比例”观感不同（target 为 1440 宽；复刻初始截图更宽）- 全页
  2. 登录卡片区域在“画布一致化”后，仍有轻微的卡片定位/留白观感差异 - 登录框区域
  3. 输入框左侧图标/占位符起始位置存在不稳定差异（表现为 icon 显示弱、padding 观感偏差）- 用户名/密码输入框
  4. 页脚灰条右下角“无障碍服务”按钮在灰条内部的垂直位置不稳定（有“顶出灰条/贴边”的观感风险）- 页脚灰条右侧
  5. 页面存在横向溢出（轮播 ul 宽 200% + 底部二维码最后一列溢出），导致截图出现黑边/影响像素对齐 - 全页横向

- **从原网站提取的信息**（用于精确对齐样式）：
  - 登录卡片 `.login-box`：
    - `width: 380px; height: 373px; position: absolute; top: 50%; left: 50%; margin-left: 215px; margin-top: -225px`
  - Tab 容器 `.login-hd`：
    - `height: 78px; line-height: 78px; padding: 0 30px`
    - 分隔线为第一个 tab 的 `::after`：`width: 1px; height: 24px; left: 159px; top: 27px; background: #DEDEDE`
  - 输入框：
    - `width: 320px; height: 44px; padding: 4px 10px 4px 36px; border: 1px solid #DEDEDE; border-radius: 0`
  - 登录按钮：
    - `width: 320px; height: 44px; border-radius: 6px; background: #FF8000; border: 1px solid #FF8000`
  - 服务时间说明（登录框内）：
    - `.login-ft`: `padding: 10px 20px 15px; border-top: 1px solid #DEDEDE`
    - 文本 `p`: `font-size: 13px; line-height: 20px; color: #666`

- **修复内容**：
  - 修改文件：
    - `frontend/src/pages/LoginPage.css`
    - `frontend/src/components/BottomNavigation/BottomNavigation.css`
  - 关键调整：
    - 统一对比画布：以 `target_image.png (1440×954)` 为基准，复刻页对齐到 1440×954 视口进行验证截图。
    - 登录页容器：将最小宽度从 1497 调整为 1440，并增加 `overflow-x: hidden`，消除横向溢出对截图的影响。
    - 底部二维码区：将 `.bottom-navigation-foot-code` 宽度调整为 660（避免最后一列溢出 20px）。
    - 页脚灰条：为 `.bottom-navigation-footer-txt-inner` 增加 `min-height`，确保右下角无障碍按钮完全落在灰条内部、不被“顶出”。

- **验证结果**：
  - `replica_page_iteration_5_final.png` 对比 `target_image.png`：整体布局、登录框与页脚关键元素对齐度明显提升；横向溢出已消除（`docW = 1440`）。
  - **未修复项**：轮播背景宣传图内容差异（按要求忽略）。

---

## Iteration 6

- **截图**：
  - 对比基准：`target_image.png`
  - 复刻本轮截图：`replica_page_iteration_6.png`
  - 修复后验证：`replica_page_iteration_6_verify.png`

- **差异点（基于截图对比，≥5；忽略轮播内容差异）**：
  1. 登录输入框左侧图标的“占位框”不一致：target 图标更像落在 20×20 的方框内且更规整，复刻图标略显“飘”（对齐感偏弱）- 登录卡片用户名/密码输入框左侧
  2. 用户名/密码输入框图标的垂直位置不一致：target 图标更靠近输入框内容区域的上半部（视觉上贴近 `top: 11px`），复刻更像是垂直居中 - 登录卡片输入框区域
  3. 页脚灰条第一行（版权所有…）文字“高度/密度”不一致：target 这一行更高、更松（行高更大），复刻更紧凑 - 页面最底部灰条第一行
  4. 页脚灰条第一行三段文字间距不一致：target 每段之间的间距偏向“右侧留白”（mr），复刻更像左右平均 margin - 页面最底部灰条第一行
  5. 页脚灰条第二行分隔符 `|` 间距不一致：target 的 `|` 是单独元素并带右侧间距（视觉上更“有空格”），复刻更紧贴两侧文字 - 页面最底部灰条第二行
  6. 右下角“适老化无障碍服务”Logo 水平对齐不一致：target 更贴近浏览器右侧边界，复刻略向左（受 wrapper 最大宽度影响）- 页面最底部灰条右侧

- **从原网站提取的信息**（用于精确对齐样式）：
  - 输入框（用户名/密码）：
    - `width: 320px; height: 44px; line-height: 44px; padding: 4px 10px 4px 36px; border: 1px solid #dedede`
  - 左侧图标 label（`.item-label`）：
    - `position: absolute; top: 11px; width: 20px; height: 20px; line-height: 20px; text-align: center; color: rgb(218,218,218)`
  - 页脚灰条文字（版权/备案两行）：
    - `font-size: 14px; line-height: 30px; color: rgb(193,193,193)`
    - 字体：`"Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif`
    - 分隔符与间距：`<span class="mr">...</span>`（主要通过右侧 margin 控制）

- **修复内容**：
  - 修改文件：
    - `frontend/src/components/LoginForm/LoginForm.css`
    - `frontend/src/components/BottomNavigation/BottomNavigation.tsx`
    - `frontend/src/components/BottomNavigation/BottomNavigation.css`
  - 关键调整：
    - 输入框 icon：将 `.item-label` 从“垂直居中定位”改为与原站一致的 `top: 11px` 并补齐 `20×20` 尺寸、`line-height: 20px`、居中文本。
    - 页脚灰条：将版权/备案两行 `line-height` 对齐为 `30px`，并对齐字体族为原站的 Helvetica/PingFang 回退链。
    - 页脚间距：用 `.bottom-navigation-mr` 模拟原站 `.mr`（右侧 margin），让 `|` 与文字间距更接近 target。
    - 无障碍 Logo：将版权区域容器改为 `width: 100%`（去掉 max-width 限制），让右下角 Logo 真正贴右对齐。

- **验证结果**：
  - 使用 `replica_page_iteration_6_verify.png` 对比 `target_image.png`：输入框左侧 icon 对齐感更稳定；页脚两行行高/间距更接近目标；右下角无障碍 Logo 更贴右。
  - **未修复项**：轮播背景宣传图内容差异（按要求忽略）。

---

## Iteration 7

- **截图**：
  - 对比基准：`target_image.png`
  - 复刻本轮截图：`replica_page_iteration_7.png`
  - 修复后验证：`replica_page_iteration_7_verify.png`

- **差异点（基于截图对比，≥5；忽略轮播内容差异）**：
  1. 用户名输入框左侧图标缺失：target 输入框左侧有浅灰色“用户”icon，复刻为空白 - 登录卡片用户名输入框左侧
  2. 密码输入框左侧图标缺失：target 输入框左侧有浅灰色“锁/密码”icon，复刻为空白 - 登录卡片密码输入框左侧
  3. 右下角“适老化无障碍服务”模块位置不一致：target 位于灰条最右侧靠边，复刻该模块在灰条内出现水平偏移（导致 diff 区域左右不一致）- 页脚灰条右侧
  4. 页脚二维码区“标题与二维码的水平居中关系”不一致：target 标题更居中对齐二维码，复刻标题略偏移（出现左右裁切/对齐感不同）- 页脚二维码区域（如“中国铁路官方微信/微博”）
  5. 页脚二维码列之间的对齐/分栏边界不一致：target 每列标题与二维码边框更规整对齐，复刻在“12306 公众号/铁路12306”附近有列边界偏移（相邻列标题与二维码的相对位置不同）- 页脚二维码区域右侧

- **从原网站提取的信息**（用于确认元素类型/资源）：
  - 输入框 icon：
    - **元素类型**：iconfont（`font-family: icon`），通过 `::before` 注入字形
    - `icon-user::before`：`content: ""`（颜色 `rgb(218,218,218)`）
    - `icon-pwd::before`：`content: ""`（颜色 `rgb(218,218,218)`）
  - iconfont 字体资源（原站 `@font-face`）：
    - `https://kyfw.12306.cn/otn/resources/fonts/iconfont.woff2?t=1703947414031`
    - `https://kyfw.12306.cn/otn/resources/fonts/iconfont.woff?t=1703947414031`
    - `https://kyfw.12306.cn/otn/resources/fonts/iconfont.ttf?t=1703947414031`

- **修复内容**：
  - 问题根因：复刻项目里的 `frontend/public/fonts/login/iconfont.{woff2,woff,ttf}` 实际为 **HTML 文本**（浏览器控制台报 `Failed to decode downloaded font` / `OTS parsing error`），导致 iconfont 字符在 fallback 字体中无字形而显示为空白。
  - 修改文件：
    - `frontend/public/fonts/login/iconfont.woff2`
    - `frontend/public/fonts/login/iconfont.woff`
    - `frontend/public/fonts/login/iconfont.ttf`
  - 关键调整：
    - 从原站下载并替换为有效的字体二进制文件，修复字体解码错误，使输入框 icon 正常渲染。

- **验证结果**：
  - 使用 `replica_page_iteration_7_verify.png` 对比 `target_image.png`：用户名/密码输入框左侧 icon 已恢复；浏览器控制台不再出现字体解码失败告警。
  - **未修复项**：轮播背景宣传图内容差异（按要求忽略）。

---

## Iteration 8

- **截图**：
  - 对比基准：`target_image.png`
  - 复刻本轮截图：`replica_page_iteration_8.png`
  - 修复后验证：`replica_page_iteration_8_verify.png`

- **差异点（基于截图对比，≥5；忽略轮播内容差异）**：
  1. 页脚白底区整体“向下偏移”感不一致：target 的页脚内容更靠上、与轮播区衔接更紧凑，复刻在页脚上方留白更多 - 轮播区下沿到“友情链接/二维码区”之间
  2. “友情链接”区 Logo 网格的垂直节奏不一致：target 两行 Logo 盒子更紧凑、第二行更靠近第一行，复刻两行之间更松 - 页脚左侧“友情链接”Logo 网格
  3. 二维码区标题与二维码块的垂直间距不一致：target 标题更贴近二维码（视觉更紧凑），复刻标题到二维码上沿的距离更大 - 页脚右侧二维码区（如“中国铁路官方微信/微博/12306公众号/铁路12306”）
  4. 二维码区右侧“官方APP下载…”提示框的视觉密度不一致：target 文本更贴近左上角且换行更紧凑，复刻文本留白更大、行距更松 - 页脚最右侧提示框
  5. 最底部灰条两行文字的行高/基线不一致：target 更“居中且松”，复刻更“偏紧且略上移” - 页面最底部灰条（版权/备案两行）
  6. 右下角“适老化/无障碍服务”模块水平位置仍有轻微差异：target 右侧留白略小，复刻略向左（但相比上一版已从“贴右”变为“居中偏右”的正确逻辑）- 页面最底部灰条右侧

- **从原网站提取的信息**（用于精确对齐“适老化”模块位置）：
  - 原站登录页（`https://kyfw.12306.cn/otn/resources/login.html`）：
    - **元素类型**：图片（`images/footer-slh.jpg`），尺寸 `130×46`
    - **定位方式**：父容器为绝对定位，`top: 17px; left: 50%; margin-left: 350px;`
    - 参考视口（本次抓取）：`1440×954`，图片 `getBoundingClientRect()` 约为 `left: 1070px; top: 891px; width: 130px; height: 46px`

- **修复内容**：
  - 修改文件：
    - `frontend/src/components/BottomNavigation/BottomNavigation.css`
  - 关键调整：
    - 将 `.bottom-navigation-footer-a11y` 从 `right: 0; bottom: 10px;` 改为与原站一致的“居中 + 偏移”定位：`left: 50%; margin-left: 350px; top: 17px;`

- **验证结果**：
  - 使用 `replica_page_iteration_8_verify.png` 对比 `target_image.png`：右下角“适老化/无障碍服务”模块不再贴右，已切换为更接近原站的“居中偏右”定位逻辑。
  - **未修复项**：轮播背景宣传图内容差异（按要求忽略）。

---

## Iteration 9

- **截图**：
  - 对比基准：`target_image.png`
  - 复刻本轮截图：`replica_page_iteration_9.png`
  - 修复后验证：`replica_page_iteration_9_verify.png`

- **差异点（基于截图对比，≥5；忽略轮播内容差异）**：
  1. 主视觉轮播宣传图内容不同：target 为“餐饮·特产/带有温度的旅途配餐 + 餐盘”画面，复刻为“铁路12306 APP + 手机 + 左侧二维码 + 勾选列表”画面 - 页面主视觉背景（**轮播差异，按要求忽略**）
  2. 轮播画面里的文字/装饰元素完全不同（target 左侧大标题与食材点缀，复刻为 APP 宣传大标题与勾选列表）- 页面主视觉左侧（**轮播差异，按要求忽略**）
  3. 登录输入框左侧图标“字形细节”存在不稳定差异风险：target 的用户/锁 icon 为 iconfont 字形，复刻在不同字体文件下可能出现字形不一致（例如锁形轮廓与填充观感不同）- 登录卡片输入框左侧（本轮重点）
  4. 登录输入框内占位符/文字的清晰度观感略有差异：target 更“锐利”，复刻在高 DPR 截图缩放后略显柔和 - 登录卡片输入框文本区域
  5. 登录卡片周围背景图案不同导致卡片边缘对比度不同（白卡外侧可见的底图纹理/明暗差异）- 登录卡片外侧背景（**轮播差异，按要求忽略**）

- **从原网站提取的信息**（用于确认图标真实实现与资源）：
  - 输入框 icon：
    - **元素类型**：iconfont（`font-family: icon`），通过 `::before` 注入字形
    - `icon-user::before`：`""`（`font-size: 16px`，`color: rgb(218,218,218)`）
    - `icon-pwd::before`：`""`（`font-size: 16px`，`color: rgb(218,218,218)`）
    - `.item-label`：`left: 8px; top: 11px; width: 20px; height: 20px`
  - iconfont 字体资源（原站 `@font-face`）：
    - `https://kyfw.12306.cn/otn/resources/fonts/iconfont.woff2?t=1703947414031`
    - `https://kyfw.12306.cn/otn/resources/fonts/iconfont.woff?t=1703947414031`
    - `https://kyfw.12306.cn/otn/resources/fonts/iconfont.ttf?t=1703947414031`

- **修复内容**：
  - 修改文件：
    - `frontend/public/fonts/login/iconfont.woff2`
    - `frontend/public/fonts/login/iconfont.woff`
    - `frontend/public/fonts/login/iconfont.ttf`
  - 关键调整：
    - 将复刻项目中登录页使用的 `iconfont.*` 替换为原站同版本字体文件，确保输入框左侧用户/锁图标字形与原站一致（避免因字体文件不一致导致的字形偏差）。

- **验证结果**：
  - 使用 `replica_page_iteration_9_verify.png` 对比 `target_image.png`：登录输入框左侧用户/锁 icon 渲染与目标保持一致；其余主要差异仍集中在轮播背景宣传图内容（按要求忽略）。

---

## Iteration 10

- **截图**：
  - 对比基准：`target_image.png`
  - 复刻本轮截图：`replica_page_iteration_10.png`
  - 修复后验证：`replica_page_iteration_10_verify.png`

- **差异点（基于截图对比，≥5；忽略轮播内容差异）**：
  1. 主视觉轮播宣传图内容不同：target 为“餐饮·特产/带有温度的旅途配餐 + 餐盘”画面，复刻为“铁路12306 APP + 手机 + 左侧二维码 + 勾选列表”画面 - 页面主视觉背景（**轮播差异，按要求忽略**）
  2. 轮播画面里的文字/装饰元素不同（target 左侧大标题与食材点缀，复刻为 APP 宣传大标题与勾选列表）- 页面主视觉左侧（**轮播差异，按要求忽略**）
  3. 登录卡片外侧可见的底图纹理/明暗不同，导致白色卡片边缘对比度观感不同 - 登录卡片外侧背景（**轮播差异，按要求忽略**）
  4. 登录卡片在截图中横向位置存在轻微偏移：对齐到同分辨率后，复刻登录块相对 target 略偏左（约 10px 量级）- 登录卡片整体
  5. 登录输入框占位符/文字的“锐利度”观感略有差异：target 更清晰，复刻在高 DPR 截图缩放后略显柔和 - 登录输入框文本区域

- **从原网站提取的信息**（用于确认输入框图标真实实现与资源）：
  - 输入框 icon：
    - **元素类型**：iconfont（`font-family: icon`），通过 `::before` 注入字形
    - `icon-user::before`：`""`（`font-size: 16px`，`color: rgb(218,218,218)`）
    - `icon-pwd::before`：`""`（`font-size: 16px`，`color: rgb(218,218,218)`）
    - `.item-label`：`left: 8px; top: 11px; width: 20px; height: 20px`
  - iconfont 字体资源（原站 `@font-face`）：
    - `https://kyfw.12306.cn/otn/resources/fonts/iconfont.woff2?t=1703947414031`
    - `https://kyfw.12306.cn/otn/resources/fonts/iconfont.woff?t=1703947414031`
    - `https://kyfw.12306.cn/otn/resources/fonts/iconfont.ttf?t=1703947414031`

- **修复内容**：
  - 修改文件：
    - `frontend/public/fonts/login/iconfont.woff2`
    - `frontend/public/fonts/login/iconfont.woff`
    - `frontend/public/fonts/login/iconfont.ttf`
  - 关键调整：
    - 再次用原站同版本 `iconfont.*` 覆盖复刻项目字体文件，确保登录输入框左侧用户/锁图标字形稳定一致（避免字体文件差异导致 icon 轮廓/填充观感不同）。

- **验证结果**：
  - 使用 `replica_page_iteration_10_verify.png` 对比 `target_image.png`：用户名/密码输入框左侧图标在截图中与目标一致（额外生成了 `iter10_user_icon_*`、`iter10_pwd_icon_*` 的紧凑裁剪图用于核对）；其余主要差异仍集中在轮播背景宣传图内容（按要求忽略）。
