# UI 调整迭代日志

## Iteration 1
- **差异点（基于 `target_image.png` vs `replica_page_iteration_1.png` 的截图肉眼对比）**：
  1. **左侧侧边栏“个人中心”标题块宽度/字号不一致**（左侧菜单顶部区域）- 缺失/尺寸
  2. **乘车人表格区域出现横向溢出**（右侧表格面板区域）- 尺寸/布局
  3. **“请输入乘客姓名”输入框与“查询”按钮样式不一致**（右侧面板顶部搜索区域）- 样式
  4. **表格操作区“添加/批量删除”图标风格不一致**（表格标题下方浅蓝操作行）- 缺失/样式
  5. **表格行“核验状态/编辑/删除”图标不一致**（表格内容行右侧）- 缺失/样式
- **修复内容（迭代1阶段性）**：
  - 修改文件：`frontend/src/pages/PersonalInfoPage.css`、`frontend/src/components/SideMenu/SideMenu.css`、`frontend/src/components/PassengerManagePanel/PassengerManagePanel.tsx`、`frontend/src/components/PassengerManagePanel/PassengerManagePanel.css`
  - 结果：主内容区宽度调整为与目标一致的 1200px 体系；侧栏宽度调整为 160px；为后续 iconfont 接入做了结构铺垫
- **验证结果**：部分修复（仍需继续迭代）

## Iteration 2
- **差异点（基于 `target_image.png` vs `replica_page_iteration_2.png` 的截图肉眼对比）**：
  1. **左侧“个人中心”标题字号/高度不一致**（左侧菜单最上方）- 样式/尺寸
  2. **右侧搜索框旁“清空”按钮位置不一致，导致面板视觉上更“挤/超宽”**（搜索框右侧）- 位置/尺寸
  3. **表格操作行“添加/批量删除”图标不来自目标站点**（浅蓝操作行左侧）- 缺失/样式
  4. **表格行“核验状态/编辑/删除”图标不来自目标站点**（表格右侧两列）- 缺失/样式
  5. **核验状态徽章风格与目标（绿色实心圆+白色对勾）不一致**（表格“核验状态”列）- 样式
- **从目标网页提取的信息（`browser_evaluate`）**：
  - 侧栏标题 `.menu-tit`：`font-size: 14px; font-weight: 700; height: 30px; line-height: 30px; padding: 0 10px; width: 130px`
  - 搜索输入框：`width:160px; height:30px; padding:4px 10px; border:1px solid #dedede; border-radius:0; font-size:14px`
  - 查询按钮：`width:100px; height:30px; padding:4px 10px; border:1px solid #dedede; border-radius:6px; font-size:14px`
  - 图标来源：`https://kyfw.12306.cn/otn/fonts/iconfont.css`（font-family: `icon`）
- **修复内容**：
  - 修改文件：
    - `frontend/src/components/SideMenu/SideMenu.css`（将 `.menu-header` 调整为 14px/30px）
    - `frontend/public/assets/fonts/kyfw-iconfont.woff`（下载目标站 iconfont）
    - `frontend/src/styles/kyfw-iconfont.css`、`frontend/src/main.tsx`（全局引入 iconfont）
    - `frontend/src/components/PassengerManagePanel/PassengerManagePanel.tsx`、`frontend/src/components/PassengerManagePanel/PassengerManagePanel.css`
  - 修复点：
    - **搜索清空按钮**：移入输入框内部（避免 `scrollWidth` 撑大导致“超宽”）
    - **全套图标**：使用目标站点 iconfont（添加/批量删除/编辑/删除/核验）
    - **核验状态徽章**：改为绿色实心圆+白色 icon
- **验证结果**：已修复主要问题（未再出现横向溢出；图标来源已对齐目标站）
- **剩余问题**：如仍存在细微对齐/颜色差异，进入下一轮继续微调

## Iteration 3
- **差异点（基于 `target_page_iteration_3.png` vs `replica_page_iteration_3.png/4.png` 的截图肉眼对比，聚焦表格区域）**：
  1. **表头与表体列宽不一致，右侧“操作”列发生溢出/被裁切**（表格最右侧）- 尺寸/布局
  2. **表格分割线样式不一致**：目标仅在“序号”列有竖分割线，其余列主要靠横向分割线（表体行）- 样式
  3. **表头字体颜色/字重不一致**：目标为灰色(#666)且字重 400；本地偏深偏粗 - 样式
  4. **表体行高与 padding 不一致**：目标行高约 61px、padding 15px 6px - 尺寸
  5. **核验状态图标不一致**：目标不是字体图标，而是 20×20 的背景图 `user-verification-success.png` - 缺失/样式
- **从目标网页提取的信息（`browser_evaluate`）**：
  - 表头 `.order-panel-head`：宽 988px、背景 `rgb(248,248,248)`、`th` padding `0 10px`、`font-weight:400`、`color:#666`
  - 表体 `.order-item-table td`：`height:61px`、`padding:15px 6px`、`line-height:22px`、顶部分割线 `#dedede`；仅首列有 `border-right:1px solid #dedede`
  - 核验图标：`.verification-status-common.user-check-success` 使用 `background-image`：
    - `user-verification-success.png` (1x)
    - `user-verification-success@2x.png` (2x)
- **修复内容**：
  - 修改/新增文件：
    - `frontend/public/assets/images/center/user-verification-success.png`
    - `frontend/public/assets/images/center/user-verification-success@2x.png`
    - `frontend/src/components/PassengerManagePanel/PassengerManagePanel.tsx`
    - `frontend/src/components/PassengerManagePanel/PassengerManagePanel.css`
  - 修复点：
    - **修复“操作”列溢出**：去掉 `.passenger-manage-panelBorder` 额外 padding/border（避免把表格区域挤窄），并让 `.passenger-tablePanel` 实际宽度回到 988px；同时确保 `scrollWidth == clientWidth`
    - **列宽/分割线对齐**：按目标 col 宽度与分割线策略重设（首列竖线+横向分割线）
    - **核验图标**：改为 `span.passenger-statusIconSuccess` 使用 target 的 image-set 背景图
- **验证结果**：表格右侧不再溢出，表头/表体列宽对齐；核验状态图标与目标一致