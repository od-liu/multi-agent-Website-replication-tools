# Prompt 修复总结

## 🐛 问题描述

**症状**：前端页面无法加载图片资源（Logo、背景图、二维码等）

**根本原因**：`interface_designer_prompt.txt` 第 90-96 行包含错误假设，声称"MCP工具已自动将所有参考图片保存到 frontend/public/images/ 目录"，导致 Interface Designer Agent 跳过了图片复制步骤。

## ✅ 修复内容

### 修改文件
`interface_designer_prompt.txt`

### 修改位置
第 90-170 行

### 修改前（错误版本）
```txt
**重要提示：图片资源已自动处理** ⚡
- MCP工具已自动将所有参考图片保存到 `frontend/public/images/` 目录
- 你只需要使用路径 `/images/文件名.扩展名` 引用图片
- **不要**尝试手动保存图片文件
- **不要**使用base64内联图片（会导致文件过大）
```

**问题**：
- ❌ 错误假设MCP工具会自动复制图片
- ❌ 明确指示"不要尝试手动保存图片文件"
- ❌ 导致图片资源缺失

### 修改后（正确版本）
```txt
**🚨 重要流程：图片资源复制（必须执行）** ⚡

在生成任何骨架代码之前，**必须先**执行图片资源复制：

### 第一步：识别网页资源图片
1. 读取 ui-requirements.yaml
2. 查找所有标记为"网页资源"、"页面资源"、"组件资源"的图片
3. 排除参考截图（仅用于AI分析的截图）

### 第二步：检查目标目录
1. 使用 list_dir 检查 frontend/public/images/ 目录
2. 对比识别缺失的图片

### 第三步：执行复制操作（关键步骤）
使用 run_terminal_cmd 执行 cp 命令：
```bash
cp requirements/images/图片文件名 frontend/public/images/
```

### 第四步：验证复制结果
1. 再次使用 list_dir 检查目录
2. 确认所有网页资源图片已存在
3. 在响应中输出确认信息

### 第五步：在代码中引用图片
只有在图片复制完成后，才能在代码中引用
```

**改进**：
- ✅ 明确要求手动复制图片资源
- ✅ 提供详细的5步复制流程
- ✅ 区分"参考截图"和"网页资源图片"
- ✅ 包含验证步骤
- ✅ 提供具体的命令示例

## 📊 修改效果

### 修改前的执行流程
```
1. 读取 initial-requirements.yaml
2. 读取截图分析UI
3. 生成 ui-requirements.yaml 和 ui-style-guide.md
4. 直接生成骨架代码（假设图片已存在）❌
5. 注册接口
→ 结果：图片资源缺失，页面无法加载图片
```

### 修改后的执行流程
```
1. 读取 initial-requirements.yaml
2. 读取截图分析UI
3. 生成 ui-requirements.yaml 和 ui-style-guide.md
4. 📌 识别网页资源图片
5. 📌 执行 cp 命令复制图片到 frontend/public/images/
6. 📌 验证图片复制成功
7. 生成骨架代码（图片已就位）✅
8. 注册接口
→ 结果：图片资源完整，页面正常加载
```

## 🎯 预期行为

当 Interface Designer Agent 使用修改后的 prompt 时：

1. **第一阶段：图片资源准备**
   - 自动读取 ui-requirements.yaml 提取图片清单
   - 使用 cp 命令复制所有网页资源图片
   - 输出确认信息：
     ```
     ✅ 图片资源复制完成：
     - 登录页-背景-新.jpg (81KB)
     - 登录页-顶部导航区域-中国铁路Logo.png (8.3KB)
     - 友情链接.png (89KB)
     - 中国铁路官方微信二维码.png (29KB)
     - 中国铁路官方微博二维码.png (156KB)
     - 12306公众号二维码.png (31KB)
     - 铁路12306二维码.png (36KB)
     (共7个图片)
     ```

2. **第二阶段：代码生成**
   - 在代码中使用 `/images/文件名` 路径引用图片
   - 所有图片都能正常加载

## 🔍 关键改进点

| 方面 | 修改前 | 修改后 |
|------|--------|--------|
| **图片来源假设** | 错误假设MCP已复制 | 明确要求手动复制 |
| **操作指令** | "不要手动保存" | "必须执行复制" |
| **步骤详细度** | 无详细步骤 | 5步详细流程 |
| **验证机制** | 无验证步骤 | 要求验证并输出确认 |
| **图片分类** | 未区分 | 明确区分参考截图和网页资源 |
| **命令示例** | 无 | 提供具体 cp 命令示例 |
| **错误预防** | 无 | 明确列出禁止行为 |

## 📝 相关文件

- **修改的文件**：`interface_designer_prompt.txt`
- **影响的Agent**：Interface Designer Agent
- **相关文档**：
  - `ui-requirements.yaml` - 包含图片路径信息
  - `requirements/images/` - 源图片目录
  - `frontend/public/images/` - 目标图片目录

## ⚠️ 注意事项

1. **不影响其他Agent**：
   - TDD Developer Agent 不受此修改影响
   - UI Analyzer Agent 不受此修改影响

2. **兼容性**：
   - 此修改向后兼容
   - 不会破坏已有的项目结构

3. **测试建议**：
   - 创建新项目时，验证 Interface Designer Agent 是否正确复制图片
   - 检查 `frontend/public/images/` 目录包含所有网页资源图片
   - 确认不包含参考截图（整体页面截图/组件特写截图/交互状态截图）

## 🚀 下一步行动

1. ✅ **Prompt 已修复**：`interface_designer_prompt.txt` 已更新
2. ✅ **当前项目已修复**：图片已手动复制到 `frontend/public/images/`
3. 📋 **建议测试**：使用修改后的 prompt 创建新项目，验证图片自动复制功能

---

**修复日期**：2025-12-27  
**修复人员**：AI Assistant  
**问题发现者**：用户  
**验证状态**：✅ 已完成

