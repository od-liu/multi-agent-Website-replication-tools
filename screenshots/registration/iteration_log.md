# UI 调整迭代日志

## Iteration 1
- **差异点**（从 `target_image.png` vs `replica_page_iteration_1_verify.png` 纯视觉对比）：
  1. **顶部右侧登录区**：目标为“您好，请 登录 注册”文字+链接；复刻页此前为两个按钮，已改为文字/链接样式，但字体/间距仍与目标略有差异（右上角区域）。
  2. **顶部 Logo 区域**：目标为单一 Logo（无额外中文/英文双行标题）；复刻页使用主页组件，仍包含“12306 CHINA RAILWAY”等附加文字（左上角区域）。
  3. **蓝色导航栏下拉箭头**：目标为小号下拉符号（chevron 形态）；复刻页使用 CSS 三角形模拟，形态/位置仍有细微差异（导航栏各菜单项右侧）。
  4. **表单卡片背景与白底覆盖**：目标卡片内部为纯白内容区，外层为蓝色描边与轻微纹理；复刻页已引入 `bg.png` 并用白底覆盖内容区，但边缘纹理露出/留白与目标仍略不同（表单卡片区域）。
  5. **字段排版细节**：目标标签文字有固定空格排版（如“用 户 名”“登 录 密 码”），提示语为橙色并对齐在输入框右侧；复刻页已调整主要标签与提示颜色，但局部对齐与行间距仍有差异（表单各行右侧提示区域）。
  6. **下拉选项内容**：目标“优惠（待）类型”包含“残疾军人”，手机区号下拉包含港/澳/台；复刻页此前缺失，已补齐（表单下半部分区域）。

- **从目标参考图/目标站点提取的信息（用于修复）**：
  - **注册卡片外框**：宽约 980px、蓝色边框、背景纹理 `bg.png`。
  - **“下一步”按钮**：122×30，白字，背景图 `bg_btn.png`（repeat-x）。
  - **“优惠（待）类型”选项**：成人 / 儿童 / 学生 / 残疾军人。
  - **手机号区号选项**：+86 中国 / +852 中国香港 / +853 中国澳门 / +886 中国台湾。

- **修复内容**：
  - **修改文件**：
    - `frontend/src/pages/RegistrationPage.tsx`
    - `frontend/src/pages/RegistrationPage.css`
    - `frontend/src/components/RegistrationForm/RegistrationForm.tsx`
    - `frontend/src/components/RegistrationForm/RegistrationForm.css`
    - `frontend/src/components/SecondaryNav/SecondaryNav.tsx`
    - `frontend/src/components/SecondaryNav/SecondaryNav.css`
    - `frontend/src/components/HomeTopBar/HomeTopBar.tsx`
    - `frontend/src/components/HomeTopBar/HomeTopBar.css`
  - **新增资源**：
    - `frontend/public/images/registration/bg.png`
    - `frontend/public/images/registration/bg_btn.png`
  - **修复的差异点**（本轮主要修复）：
    - 注册页顶部栏/导航栏替换为主页同款（结构对齐）。
    - 表单卡片引入目标站点背景纹理与蓝色描边，按钮换为目标背景图按钮。
    - 标签空格排版、提示语颜色/文本、下拉选项与手机号区号补齐。
    - 导航栏下拉箭头由“▼文本”替换为 CSS 三角形（更接近目标）。
    - 面包屑宽度与居中对齐调整。

- **验证结果**：部分修复（整体结构与表单风格已接近，仍存在顶部 Logo/间距、导航箭头细节、表单卡片留白的差异）
- **本轮截图**：
  - `replica_page_iteration_1.png`
  - `replica_page_iteration_1_verify.png`
  - `target_image.png`

## Iteration 2（注册页 /register）

- **截图**：
  - 对比基准：`target_image.png`
  - 复刻本轮截图：`replica_page_iteration_2.png`
  - 修复后验证：`replica_page_iteration_2_verify.png`

- **差异点**（从 `target_image.png` vs `replica_page_iteration_2.png` 纯视觉对比，≥5）：
  1. **登录密码 placeholder 文案**：目标为“6-20位字母、数字或符号”，复刻为“6-20位字母、数字或下划线”（表单第 2 行输入框）。
  2. **密码强度区域缺失/样式不一致**：目标在密码输入框右侧显示“密码强度”与 3 段条形指示器（首段红、其余灰），复刻无“密码强度”文字且条形高度/圆角/颜色不同（表单第 2 行右侧）。
  3. **提示语橙色不一致**：目标提示语为更“偏红”的橙色，复刻橙色偏黄（如用户名提示、姓名/证件提示、手机提示等，表单右侧提示区域）。
  4. **中间虚线分隔缺失**：目标在“优惠（待）类型”与“邮箱”之间有一条浅灰虚线，复刻缺失（表单中部区域）。
  5. **下拉框箭头形态不一致**：目标为浏览器原生下拉箭头样式，复刻为自绘黑色三角箭头（证件类型/优惠类型/区号下拉）。
  6. **输入框尺寸/密度不一致**：目标输入框视觉更“扁平紧凑”（内容区更矮），复刻输入框略高/略宽（用户名/密码/确认密码等输入框）。
  7. **勾选协议行字号/复选框尺寸不一致**：目标复选框更小（约 13×13）且文字为 12px 黑色，复刻复选框偏大且文字偏灰偏大（协议行）。

- **从原网站提取的信息**（用于精确对齐样式）：
  - **提示语颜色**：`rgb(255, 127, 0)`（约 `#ff7f00`）
  - **输入框**：`width: 195px; height: 18px; padding: 5px 0 5px 5px; border: 1px solid #cfcdb7; border-radius: 0`
  - **标签列宽**：约 `375px`，右对齐，`font: 12px Tahoma, 宋体; line-height: 30px`
  - **密码强度条（默认“弱”态）**：
    - 3 段：每段 `40×6`，段间距 `1px`
    - 颜色：首段 `#ff0000`，其余 `#999999`
  - **分隔线**：`height: 1px; border-top: 1px dashed #DEDEDE; margin: 15px 0`
  - **复选框尺寸**：`13×13`，右侧外边距约 `4px`

- **修复内容**：
  - **修改文件**：
    - `frontend/src/components/RegistrationForm/RegistrationForm.tsx`
    - `frontend/src/components/RegistrationForm/RegistrationForm.css`
  - **修复的差异点**：
    - 密码 placeholder 文案对齐为“符号”
    - 补齐“密码强度”文字与 40×6 三段强度条（默认显示首段红）
    - 提示语橙色对齐为 `#ff7f00`
    - 补齐中间虚线分隔线
    - 下拉框改为原生箭头样式（移除自绘三角）
    - 输入框与协议行字号/复选框尺寸按原站点对齐

- **验证结果**：已明显接近（`replica_page_iteration_2_verify.png` 中密码强度/虚线分隔/提示色/输入框密度与目标更一致；仍可继续微调表单整体留白与顶部区域细节）

# UI 调整迭代日志

## 初始准备 (Initial Setup)

- **目标参考图片**: `target_image.png`（项目根目录）
- **目标页面**: `https://kyfw.12306.cn/otn/resources/login.html`
- **复刻页面**: `http://localhost:5174/login`
- **说明**: 背景图为轮播（每次截图可能不同），**轮播内容差异不需要修复**。

---

## Iteration 3（注册页 /register）

- **截图**：
  - 对比基准：`target_image.png`
  - 复刻本轮截图：`replica_page_iteration_3.png`
  - 修复后验证：`replica_page_iteration_3_verify.png`

- **差异点（基于截图对比，≥5）**：
  1. 面包屑“您现在的位置…”区域：target 文字为黑色、垂直居中且紧贴注册面板上边缘；复刻在面包屑文字颜色偏灰、上方留白更大且与面板之间存在额外间距 - 页面中上部面包屑区域
  2. 注册面板标题条“账户信息”：target 标题字重偏常规、标题条视觉更贴近原站样式；复刻标题更“粗/重”观感 - 注册面板顶部标题条
  3. 表单行纵向间距：target 每行更紧凑；复刻每行之间间距偏大导致整体表单更“松” - 注册面板表单区域（从“用户名”到“手机号码”）
  4. “密码强度”提示：target 的“密码强度”文字与红/灰强度条的组合更紧凑；复刻该区域的内间距略不一致 - “登录密码”行右侧强度指示区域
  5. 多处橙色提示文本的垂直对齐：target 中橙色提示更贴近对应输入框垂直居中；复刻部分提示相对输入框有轻微上下偏移 - “姓名/证件号码/手机号码”行右侧提示区域

- **从原网站提取的信息**（用于精确对齐样式）：
  - 面包屑 `.crumbs`：`height: 32px; line-height: 32px; padding: 0; margin: 0; color: rgb(0,0,0); font-size: 12px`
  - 表单行（对应 `li`）：`margin-bottom: 5px; height: 30px`
  - 注册面板 `.layout.reg`：`width: 980px; border: 1px solid rgb(22, 120, 190); border-radius: 5px 5px 0 0; background-image: url(.../bg.png)`
  - “下一步”按钮：`width: 122px; height: 30px; background-repeat: repeat-x; background-image: url(.../bg_btn.png); border-radius: 4px; font-size: 12px`

- **修复内容**：
  - 修改文件：
    - `frontend/src/pages/RegistrationPage.css`
    - `frontend/src/components/RegistrationForm/RegistrationForm.css`
  - 关键调整：
    - 面包屑：改为 `height: 32px; line-height: 32px; padding: 0; color: #000; margin-bottom: 0`，消除与面板之间的额外空隙
    - 标题条：将“账户信息”字重调整为更接近原站的常规（`font-weight: 400`）
    - 表单行间距：将 `.form-row` 的 `margin-bottom` 从 `10px` 调整为 `5px`，匹配原站紧凑度

- **验证结果**：
  - 使用 `replica_page_iteration_3_verify.png` 对比 `target_image.png`：面包屑高度/颜色与面板贴合关系明显更接近目标；表单纵向紧凑度改善；仍有少量细节差异集中在橙色提示文本的轻微垂直对齐与“密码强度”区域的观感细节。
