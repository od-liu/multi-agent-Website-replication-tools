# UI 调整迭代日志

## Iteration 1（个人信息页 /my-account）
- **对比图片**：
  - `target_image.png`（参考）
  - `replica_page_iteration_1.png`（修复前复刻截图）
  - `replica_page_iteration_1_verify.png`（修复后验证截图）

- **差异点**（至少 5 处，按优先级排序：缺失/多余 > 位置和尺寸 > 颜色 > 其他）：
  1. **“联系方式”手机号行布局不一致**：参考图中“已通过核验”与手机号同一行、位于右侧；复刻图中为纵向堆叠/位置不对（右侧主卡片-联系方式区域）- **位置/尺寸**
  2. **字段标签列宽度与对齐不一致**：参考图标签列明显更宽、右对齐且为灰色；复刻图标签列偏窄且颜色更深（右侧主卡片-所有字段行）- **位置/尺寸**
  3. **Section 标题样式不一致**：参考图标题较小且无蓝色下划线；复刻图标题更大并带蓝色下划线（右侧主卡片-基本信息/联系方式/附加信息标题）- **其他样式**
  4. **Section 分割线样式不一致**：参考图使用点线/虚线分割；复刻图使用实线分割（右侧主卡片-各 section 之间）- **颜色/其他样式**
  5. **左侧菜单子项尺寸/内边距不一致**：参考图“查看个人信息”选中态为 30px 高、约 130px 宽、无圆角，左右内边距固定；复刻图选中态与未选中态的尺寸/圆角/缩进不一致（左侧菜单-个人信息分组）- **位置/尺寸**

- **从原网页提取的信息**（`https://kyfw.12306.cn/otn/view/information.html`，用于精确对齐）：
  - **右侧内容卡片容器**：`border: 1px solid #DEDEDE; padding: 20px; border-radius: 0`
  - **字段标签（示例：手机号标签）**：`width: 360px; padding: 5px 5px 5px 0; text-align: right; color: #666; font-size: 14px; line-height: 20px`
  - **“已通过核验”提示**：`color: #FF8000; font-size: 14px; margin-left: 5px`（与手机号同一行）
  - **编辑按钮**：`width: 80px; height: 30px; padding: 4px 10px; border: 1px solid #DEDEDE; border-radius: 6px; background: #FFF`
  - **左侧菜单选中项**：`width: 130px; height: 30px; padding: 0 10px 0 20px; background: #3B99FC; color: #FFF; border-radius: 0`

- **修复内容**：
  - **修改文件**：
    - `frontend/src/pages/PersonalInfoPage.css`
    - `frontend/src/components/PersonalInfoPanel/PersonalInfoPanel.css`
    - `frontend/src/components/SideMenu/SideMenu.css`
  - **修复的差异点**：
    - 调整右侧卡片边框颜色/圆角为参考一致
    - 将字段 label 列宽改为 360px 并匹配 padding/颜色/对齐
    - 将“手机号 + 已通过核验”布局改为同一行（`info-value-group` 改为 row）
    - Section 标题字号/字重对齐参考，移除蓝色下划线
    - Section 分割线改为 dotted
    - 左侧菜单子项尺寸/内边距/圆角对齐参考

- **验证结果**：已修复（基于 `replica_page_iteration_1_verify.png` 与 `target_image.png` 对比）

- **剩余问题**：
  - 顶部栏/底部栏按要求未调整；若后续需要进一步像素级细化，可继续从左侧菜单折叠图标、细微间距入手做 Iteration 2。

## Iteration 2（个人信息页 /my-account）
- **对比图片**：
  - `target_image.png`（参考）
  - `replica_page_iteration_2.png`（修复前复刻截图）
  - `replica_page_iteration_2_verify.png`（修复后验证截图）

- **差异点**（至少 5 处，按优先级排序：缺失/多余 > 位置和尺寸 > 颜色 > 其他）：
  1. **“已通过核验”位置偏移**：参考图中紧跟手机号内容，复刻图中被推到更靠右位置（右侧主卡片-联系方式-手机号行）- **位置/尺寸**
  2. **左侧菜单折叠箭头缺少“方框按钮”形态**：参考图为 16×16 的小方块内含下箭头；复刻图为裸箭头（左侧菜单-订单中心/个人信息/常用信息管理 等分组标题右侧）- **缺失元素/其他样式**
  3. **折叠箭头尺寸/对齐不一致**：参考图箭头垂直居中并贴近标题右边缘；复刻图箭头大小/位置偏差（左侧菜单-分组标题右侧）- **位置/尺寸**
  4. **手机号行不应换行**：参考图手机号与“已通过核验”同一行且不折行；复刻图存在潜在换行/挤压（右侧主卡片-联系方式-手机号行）- **位置/尺寸**
  5. **折叠箭头颜色不一致**：参考图为浅灰；复刻图颜色偏深/不统一（左侧菜单-分组标题右侧）- **颜色**

- **从原网页提取的信息**（`https://kyfw.12306.cn/otn/view/information.html`，用于精确对齐）：
  - **“已通过核验”提示**：`width: 70px; height: 21px; margin-left: 5px; color: #FF8000; font-size: 14px; line-height: 21px`
  - **折叠箭头（图标字体实现）**：
    - `i.icon-switch`：`width: 16px; height: 16px; position: absolute; top: 7px; right: 0; font-family: icon; font-size: 16px; line-height: 16px; color: #999`
    - `i.icon-switch::before`：`content: ""`

- **修复内容**：
  - **修改文件**：
    - `frontend/src/components/PersonalInfoPanel/PersonalInfoPanel.css`
    - `frontend/src/components/SideMenu/SideMenu.css`
  - **修复的差异点**：
    - 通过将 `.info-value-group .info-value` 设为 `flex: 0 0 auto`，避免手机号占满剩余宽度，确保“已通过核验”紧跟手机号
    - 禁止手机号行换行（`flex-wrap: nowrap`）并为核验提示加 `white-space: nowrap`
    - 左侧折叠箭头改为 16×16 方框按钮形态，并对齐到 `top: 7px; right: 0`，颜色统一为浅灰

- **验证结果**：已修复（基于 `replica_page_iteration_2_verify.png` 与 `target_image.png` 对比）

- **剩余问题**：
  - 若继续 Iteration 3，可进一步细抠左侧分组标题与其下方子项的垂直间距，以及分割线虚线的粗细/透明度。