# 交互状态截图目录

本目录存放通过 Browser MCP 自动交互获取的各种页面状态截图。

## 截图类型

### 1. 错误状态截图
- 表单验证错误（前端验证）
- 后端返回的错误提示
- 示例：
  - `登录表单-错误-用户名为空.png`
  - `登录表单-错误-密码过短.png`
  - `短信验证-错误-证件号错误.png`

### 2. 弹窗/模态框截图
- 需要交互触发的组件
- 示例：
  - `短信验证-初始状态.png`
  - `确认对话框-删除警告.png`

### 3. 成功状态截图
- 操作成功后的提示
- 示例：
  - `短信验证-成功-验证码已发送.png`
  - `注册成功-欢迎页面.png`

### 4. 不同交互状态
- hover 状态
- focus 状态
- disabled 状态
- loading 状态

## 文件命名规范

格式：`{组件名}-{状态类型}-{具体描述}.png`

- **组件名**：如 `登录表单`、`短信验证`、`购票页面`
- **状态类型**：`错误`、`成功`、`初始状态`、`hover`、`loading` 等
- **具体描述**：简短说明，如 `用户名为空`、`密码过短`

## 如何获取这些截图

这些截图由 UI Analyzer Agent 根据 `initial-requirements.yaml` 中定义的 **交互场景截图** 自动生成。

### 在需求文档中定义交互场景：

```yaml
- id: REQ-EXAMPLE
  name: 示例组件
  description: |
    组件说明...
    
    **交互场景截图**:
      - name: "场景名称"
        description: "场景描述"
        steps:
          - action: type
            target: "输入框"
            target_hint: "input[type='text']"
            value: "测试内容"
          - action: click
            target: "提交按钮"
            target_hint: "button[type='submit']"
          - action: wait
            duration: 0.5
          - action: screenshot
            filename: "组件名-错误-具体描述.png"
```

### Agent 会自动：
1. 打开浏览器并导航到目标页面
2. 执行 steps 中定义的所有交互步骤
3. 在指定时刻截取屏幕截图
4. 保存到本目录

## 注意事项

⚠️ **需要登录凭证的场景**

如果交互场景需要先登录（如短信验证弹窗），需要在需求文档中提供测试账户：

```yaml
**登录凭证**:
  username: "test_user"
  password: "Test@123456"
  id_card_last4: "1234"
```

⚠️ **隐私安全**

- 不要在需求文档中提交真实用户的敏感信息
- 使用专门的测试账户
- 在版本控制中忽略包含敏感信息的文件

## 目录结构示例

```
交互状态截图/
├── README.md (本文件)
├── 登录表单-错误-用户名为空.png
├── 登录表单-错误-密码为空.png
├── 登录表单-错误-密码过短.png
├── 短信验证-初始状态.png
├── 短信验证-错误-证件号为空.png
├── 短信验证-错误-证件号错误.png
└── 短信验证-成功-验证码已发送.png
```

## 相关文档

- [UI Analyzer Prompt](../../../ui-analyzer-with-browser-prompt.txt) - Agent 提示词
- [初始需求文档](../../initial-requirements.yaml) - 交互场景定义示例
- [metadata.json](../metadata.json) - 包含所有截图的元数据

