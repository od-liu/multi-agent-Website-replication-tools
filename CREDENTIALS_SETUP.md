# 🔒 登录凭证安全配置指南

本文档说明如何安全地配置测试账户凭证，用于 UI Analyzer Agent 的交互场景截图功能。

---

## ⚠️ 安全原则

1. **绝对禁止**将真实的用户名和密码提交到 Git 仓库
2. **必须**使用独立的测试账户，不要使用个人主账户
3. **必须**将 `credentials.env` 文件添加到 `.gitignore`
4. **建议**定期更换测试账户密码

---

## 📋 快速开始

### 步骤 1：复制凭证模板文件

```bash
cp credentials.example.env credentials.env
```

### 步骤 2：编辑 credentials.env 文件

使用文本编辑器打开 `credentials.env`，填入你的真实测试账户信息：

```env
# 12306 登录凭证
LOGIN_USERNAME=your_test_username_here
LOGIN_PASSWORD=your_test_password_here
LOGIN_ID_CARD_LAST4=1234
```

**替换规则**：
- `your_test_username_here` → 你的测试账户用户名/手机号/邮箱
- `your_test_password_here` → 你的测试账户密码
- `1234` → 你的测试账户绑定证件号后4位

### 步骤 3：验证 .gitignore 配置

确认 `.gitignore` 文件中包含以下内容（已自动添加）：

```gitignore
# 环境变量和凭证文件（⚠️ 切勿删除此部分）
credentials.env
.env
*.env
!.env.example
!credentials.example.env
```

### 步骤 4：验证凭证文件未被 Git 跟踪

```bash
# 检查 Git 状态
git status

# 确保输出中没有 credentials.env 文件
# 如果看到 credentials.env，立即运行：
git rm --cached credentials.env
```

---

## 🎯 如何使用

### UI Analyzer Agent 自动读取凭证

当 UI Analyzer Agent 执行 Phase 7（交互场景截图）时，会自动：

1. 检查 `credentials.env` 是否存在
2. 解析凭证文件并加载环境变量
3. 在交互步骤中替换 `${LOGIN_CREDENTIALS.xxx}` 变量

**示例**：

initial-requirements.yaml 中的交互场景：
```yaml
steps:
  - action: type
    target: "用户名输入框"
    value: "${LOGIN_CREDENTIALS.username}"  # ← 自动替换
  - action: type
    target: "密码输入框"
    value: "${LOGIN_CREDENTIALS.password}"  # ← 自动替换
```

Agent 执行时会自动替换为 credentials.env 中的真实值。

---

## 🔍 支持的凭证字段

| 字段名 | 说明 | 在 YAML 中的引用 |
|--------|------|------------------|
| `LOGIN_USERNAME` | 测试账户用户名/手机号/邮箱 | `${LOGIN_CREDENTIALS.username}` |
| `LOGIN_PASSWORD` | 测试账户密码 | `${LOGIN_CREDENTIALS.password}` |
| `LOGIN_ID_CARD_LAST4` | 证件号后4位 | `${LOGIN_CREDENTIALS.id_card_last4}` |

### 可选：添加多组测试账户

如果需要测试多个账户，可以在 `credentials.env` 中添加：

```env
# 主测试账户
LOGIN_USERNAME=user1@example.com
LOGIN_PASSWORD=password123
LOGIN_ID_CARD_LAST4=1234

# 第二个测试账户（可选）
LOGIN_USERNAME_2=user2@example.com
LOGIN_PASSWORD_2=password456
LOGIN_ID_CARD_LAST4_2=5678
```

---

## ❌ 常见错误

### 错误 1：凭证文件不存在

```
❌ 错误：未找到凭证文件 credentials.env
```

**解决方法**：
```bash
cp credentials.example.env credentials.env
# 然后编辑 credentials.env 填入真实凭证
```

---

### 错误 2：凭证文件缺少必需字段

```
❌ 错误：credentials.env 缺少必需字段：LOGIN_USERNAME, LOGIN_PASSWORD
```

**解决方法**：
编辑 `credentials.env`，确保包含所有必需字段：
```env
LOGIN_USERNAME=your_username
LOGIN_PASSWORD=your_password
LOGIN_ID_CARD_LAST4=1234
```

---

### 错误 3：凭证文件被 Git 跟踪

```
On branch main
Changes to be committed:
  new file:   credentials.env  # ← 这是错误的！
```

**解决方法**：
```bash
# 从 Git 暂存区移除
git rm --cached credentials.env

# 确认 .gitignore 包含 credentials.env
grep "credentials.env" .gitignore

# 如果没有，手动添加：
echo "credentials.env" >> .gitignore
```

---

## 🔐 安全最佳实践

### 1. 使用专门的测试账户

- ✅ **推荐**：创建专门用于开发测试的 12306 账户
- ❌ **不推荐**：使用个人主账户（如果泄露会影响实际使用）

### 2. 限制凭证文件权限（Unix/Linux/macOS）

```bash
# 设置为仅所有者可读写
chmod 600 credentials.env

# 验证权限
ls -la credentials.env
# 应显示：-rw------- 1 user group ... credentials.env
```

### 3. 定期更换密码

建议每 3-6 个月更换一次测试账户密码。

### 4. 团队协作

**方式 1：安全共享（推荐）**
- 使用加密的密码管理工具（如 1Password、LastPass）共享凭证
- 每个团队成员维护自己的 `credentials.env` 文件

**方式 2：CI/CD 环境**
- 在 CI/CD 系统中配置环境变量
- 使用 GitHub Secrets、GitLab CI Variables 等

---

## 📝 文件清单

| 文件 | 状态 | 说明 |
|------|------|------|
| `credentials.example.env` | ✅ 已提交到 Git | 凭证模板文件，不包含真实信息 |
| `credentials.env` | ❌ **不提交** | 真实凭证文件，必须在 .gitignore 中 |
| `.gitignore` | ✅ 已提交到 Git | 包含 `credentials.env` 忽略规则 |

---

## 🆘 问题排查

### 如何验证配置是否正确？

运行以下检查命令：

```bash
# 1. 检查凭证文件是否存在
test -f credentials.env && echo "✅ credentials.env 存在" || echo "❌ credentials.env 不存在"

# 2. 检查凭证文件是否在 .gitignore 中
grep -q "credentials.env" .gitignore && echo "✅ 已在 .gitignore 中" || echo "❌ 未在 .gitignore 中"

# 3. 检查凭证文件是否被 Git 跟踪
git ls-files | grep -q "credentials.env" && echo "❌ 文件被 Git 跟踪！需要移除" || echo "✅ 文件未被 Git 跟踪"

# 4. 检查必需字段是否存在
grep -q "LOGIN_USERNAME=" credentials.env && \
grep -q "LOGIN_PASSWORD=" credentials.env && \
grep -q "LOGIN_ID_CARD_LAST4=" credentials.env && \
echo "✅ 所有必需字段都存在" || echo "❌ 缺少必需字段"
```

### 如何清理已泄露的凭证？

如果不小心将 `credentials.env` 提交到了 Git：

```bash
# 1. 从 Git 历史中完全删除（需要 git-filter-repo 工具）
# 安装: pip install git-filter-repo

git filter-repo --path credentials.env --invert-paths

# 2. 强制推送（⚠️ 会改写历史，需要团队成员重新克隆）
git push origin --force --all

# 3. 立即更换测试账户密码！
```

---

## 📚 相关文档

- [README.md](README.md) - 项目总览
- [ui-analyzer-with-browser-prompt.txt](ui-analyzer-with-browser-prompt.txt) - UI Analyzer Agent 完整提示词
- [initial-requirements.yaml](requirements/initial-requirements.yaml) - 初始需求文档示例

---

## 💬 反馈

如果你在配置凭证时遇到问题，请：
1. 查看上方的"常见错误"和"问题排查"章节
2. 运行验证检查命令确认配置
3. 在项目 Issues 中提问（但**不要**包含真实凭证信息）

