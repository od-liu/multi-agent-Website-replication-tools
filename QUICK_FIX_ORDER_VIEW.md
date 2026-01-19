# 🔧 订单查看问题 - 快速修复指南

## 🎯 问题诊断

### **错误信息**
```
❌ 未登录，无法获取订单列表
```

**来源**：`OrderHistoryPanel.tsx:110`

---

## 🔍 根本原因

### **问题1：登录信息存储格式不一致**

**登录时（LoginPage）**：
```javascript
localStorage.setItem('userId', '1');
localStorage.setItem('username', '张三');
```

**查看订单时（OrderHistoryPanel）**：
```javascript
const userInfoStr = localStorage.getItem('user_info'); // ❌ 找不到！
const userInfo = JSON.parse(userInfoStr);
```

**结果**：
- LoginPage存储的是单独的key-value
- OrderHistoryPanel期望的是JSON格式的`user_info`
- 两者不匹配，导致无法获取userId

---

## ✅ 已修复

### **修改：LoginPage.tsx**

现在登录成功后，会同时存储两种格式：

```typescript
// 方式1：单独存储（TopNavigation使用）
localStorage.setItem('userId', String(currentUserId));
localStorage.setItem('username', displayName);

// 方式2：JSON格式存储（OrderHistoryPanel使用）
const userInfo = {
  userId: String(currentUserId),
  username: currentUsername,
  name: currentName,
  isLoggedIn: true
};
localStorage.setItem('user_info', JSON.stringify(userInfo));
```

---

## 🚀 立即解决（两种方法）

### **方法1：重新登录（推荐）**

1. **刷新浏览器**（Cmd+Shift+R）
2. **点击右上角"登录"**
3. **输入用户名和密码**：
   ```
   用户名：testuser
   密码：（你的密码）
   ```
4. **完成短信验证**
5. **登录成功后，localStorage会包含完整的user_info**
6. **再次进入个人中心 → 我的订单**

**现在应该能正常查看订单了！**

---

### **方法2：手动设置localStorage（临时方案）**

如果你不想重新登录，可以在浏览器控制台手动设置：

**Step 1：打开浏览器控制台（F12）**

**Step 2：在Console标签页运行以下代码：**

```javascript
// 设置用户信息（根据你的实际用户数据修改）
const userInfo = {
  userId: '1',           // 订单8的user_id
  username: 'testuser',  // 数据库中的username
  name: '张三',          // 数据库中的name
  isLoggedIn: true
};

localStorage.setItem('user_info', JSON.stringify(userInfo));
localStorage.setItem('userId', '1');
localStorage.setItem('username', '张三');

console.log('✅ 用户信息已设置:', userInfo);
```

**Step 3：刷新页面（F5）**

**Step 4：进入个人中心 → 我的订单**

**现在应该能看到订单8了！**

---

## 🔍 验证修复成功

### **检查localStorage**

在浏览器控制台运行：

```javascript
console.log('userId:', localStorage.getItem('userId'));
console.log('username:', localStorage.getItem('username'));
console.log('user_info:', localStorage.getItem('user_info'));
```

**预期输出**：
```
userId: "1"
username: "张三"
user_info: {"userId":"1","username":"testuser","name":"张三","isLoggedIn":true}
```

---

### **检查订单列表**

进入"个人中心"，点击"我的订单"标签：

**预期看到**：
- 订单8（最近的订单）
- 订单7
- 订单6
- ...

**控制台日志**：
```
📋 [订单历史] 获取订单列表, userId: 1, tab: 全部订单
✅ [订单历史] 获取到 X 个订单
```

---

## 📋 完整测试流程

### **测试1：重新登录流程**

1. 清空localStorage（可选）：
   ```javascript
   localStorage.clear();
   ```

2. 访问登录页：`http://localhost:5174/login`

3. 输入凭据：
   ```
   用户名：testuser
   密码：password123（示例，使用你的实际密码）
   ```

4. 完成短信验证

5. 检查localStorage：
   ```javascript
   console.log(localStorage.getItem('user_info'));
   ```

6. 进入个人中心 → 我的订单

7. 应该能看到所有订单

---

### **测试2：购票后查看订单**

1. 确保已登录（localStorage有user_info）

2. 搜索车次：北京 → 上海，日期：明天

3. 点击"预订"按钮

4. 填写乘客信息，提交订单

5. 支付成功

6. 点击"查看订单详情"

7. 应该能正常跳转到个人中心并显示新订单

---

## 🐛 如果还是无法查看订单

### **问题A：localStorage被清空**

**症状**：刚登录成功，但刷新后又显示"未登录"

**原因**：
- 浏览器隐私模式
- 浏览器设置禁用了localStorage
- 扩展程序清空了localStorage

**解决**：
1. 退出隐私模式
2. 检查浏览器设置
3. 禁用可能影响的扩展程序

---

### **问题B：订单API返回错误**

**症状**：localStorage有user_info，但订单列表还是空的

**检查后端日志**：

在终端查看：
```bash
tail -50 /Users/od/.cursor/projects/Users-od-Desktop-cs3604-12306-automation-mcp/terminals/1.txt
```

**查找**：
```
[订单查询] 用户ID: 1
```

**如果看到错误**，可能是后端API的问题。

---

### **问题C：user_id不匹配**

**症状**：能看到订单列表，但看不到自己的订单

**原因**：localStorage中的userId和实际订单的user_id不一致

**验证**：

```bash
# 检查订单8的user_id
cd /Users/od/Desktop/cs3604-12306-automation-mcp
sqlite3 backend/database.db "SELECT user_id FROM orders WHERE id = 8;"

# 应该返回：1
```

```javascript
// 检查localStorage中的userId
console.log(localStorage.getItem('userId'));

// 应该也是：'1'
```

**如果不一致**：
- 使用正确的用户账号重新登录
- 或者手动设置正确的userId

---

## 📊 数据库状态检查

```bash
cd /Users/od/Desktop/cs3604-12306-automation-mcp

# 检查用户表
sqlite3 backend/database.db "SELECT id, username, name FROM users;"

# 检查订单表
sqlite3 backend/database.db "
SELECT o.id, o.user_id, u.username, o.status, o.created_at
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
ORDER BY o.created_at DESC
LIMIT 10;
"
```

**预期看到**：
```
订单ID | 用户ID | 用户名    | 状态 | 创建时间
8      | 1      | testuser  | paid | 2026-01-19 18:09
7      | 1      | testuser  | paid | 2026-01-19 18:03
6      | 1      | testuser  | paid | 2026-01-19 16:06
```

---

## 🎉 成功标志

当一切正常时：

1. **登录页**：
   - 输入用户名密码
   - 完成短信验证
   - 跳转到首页

2. **localStorage**：
   - 包含`userId`、`username`、`user_info`三个key
   - `user_info`是有效的JSON字符串

3. **个人中心**：
   - 点击"我的订单"标签
   - 显示所有订单列表
   - 控制台无错误

4. **订单详情**：
   - 可以查看每个订单的详细信息
   - 可以取消订单
   - 可以查看支付状态

---

**最后更新**：2026-01-19
**相关文件**：
- `frontend/src/pages/LoginPage.tsx`（已修复）
- `frontend/src/components/OrderHistoryPanel/OrderHistoryPanel.tsx`
- `frontend/src/hooks/useAuth.ts`
