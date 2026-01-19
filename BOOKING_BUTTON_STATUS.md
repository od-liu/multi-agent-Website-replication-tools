# ✅ 预订按钮问题 - 已解决

## 🎯 根本原因

### **问题1：使用了错误的座位系统**

**数据库状态**：
```
trains: 26 ✅
train_stops: 135 ✅  
train_cars: 416 ✅
train_seats: 0 ❌（旧座位表，空的！）
schedule_seats: 108,276 ✅（新座位表，有数据！）
```

**旧代码**：
- 前端调用 `/api/trains/search` 不带 `useV2` 参数
- 后端使用 `searchTrains` 函数查询 `train_seats` 表（空表！）
- 所有车次座位显示为 `"--"` 或 `"无"`
- `hasAvailableSeats(train)` 返回 `false`
- 点击预订按钮立即返回，不跳转

---

## 🔧 已修复

### **修改1：前端启用V2系统**

在3个地方添加了 `useV2: true`：

1. **TrainListPage.tsx** (第156行)
```typescript
body: JSON.stringify({
  fromCity: params.fromCity,
  toCity: params.toCity,
  departureDate: params.departureDate,
  isStudent: params.passengerType === 'student',
  isHighSpeed: false,
  useV2: true  // 🆕 使用新的座位管理系统
})
```

2. **TrainListPage.tsx** (第286行 - 切换日期)
```typescript
body: JSON.stringify({
  fromCity: searchParams.fromCity,
  toCity: searchParams.toCity,
  departureDate: newDate,
  isStudent: false,
  isHighSpeed: false,
  useV2: true  // 🆕 使用新的座位管理系统
})
```

3. **TrainSearchBar.tsx** (第349行)
```typescript
body: JSON.stringify({
  fromCity,
  toCity,
  departureDate,
  isStudent: passengerType === 'student',
  isHighSpeed: false,
  useV2: true  // 🆕 使用新的座位管理系统
})
```

---

### **效果**

**后端日志**：
```
🔍 [车次搜索] 使用V2(区间座位)版本
🔍 [车次搜索V2] 北京 → 上海, 日期: 2026-01-19
📊 [车次搜索V2] 找到 1 个车次
✅ [车次搜索V2] 返回 1 个车次（含余票信息）
```

**现在**：
- 后端使用 `searchTrainsV2` 查询 `schedule_seats` 表（有10万+数据）
- 车次座位会显示具体数字（如 "150", "60"）或"有"/"无"
- `hasAvailableSeats(train)` 正确返回 `true`/`false`
- 点击预订按钮能够跳转

---

## ⚠️ 新问题：查询今天的车次返回很少

**当前状态（2026-01-19 晚上）**：

查询北京→上海，日期 2026-01-19：
- 后端返回：`📭 [车次搜索V2] 未找到符合条件的车次` 或 `📊 找到 1 个车次`

**原因**：
```
北京→上海的所有车次：
- G103: 06:20 ❌ 已发车
- G5:   07:00 ❌ 已发车
- G1:   09:00 ❌ 已发车
- G126: 09:58 ❌ 已发车
- G12:  14:10 ❌ 已发车
- D9:   19:36 ❌ 已发车
- D8:   20:10 ❌ 已发车
```

**V2系统逻辑**：
```typescript
const currentTime = '21:00';  // 当前时间
const isToday = departureDate === currentDate;

if (isToday) {
  query += ` AND t.departure_time > ?`;  // 只返回还未发车的车次
  params.push(currentTime);
}
```

所以查询今天（2026-01-19）的车次时，所有早于 21:00 的车次都被过滤掉了。

---

## ✅ 解决方案

### **方案1：查询明天的车次（推荐）**

**在首页搜索表单中**：
```
出发地：北京
目的地：上海
出发日期：选择 2026-01-20（明天）
```

**效果**：
- 会返回所有 7 个车次
- 所有车次都有座位数据
- 预订按钮可以正常点击和跳转

---

### **方案2：修改发车时间过滤逻辑**

如果希望查询今天的车次时，不过滤已发车的：

**修改 `backend/src/database/search_trains_v2.js`**：
```javascript
// 注释掉或删除这段代码
if (isToday) {
  query += ` AND t.departure_time > ?`;
  params.push(currentTime);
}
```

**影响**：
- 用户可能会看到已经发车的车次
- 需要在前端显示"已发车"或"已停售"状态

---

## 📋 测试清单

### ✅ 前端修改（已完成）
- [x] TrainListPage.tsx: 添加 useV2: true
- [x] TrainSearchBar.tsx: 添加 useV2: true
- [x] 代码已提交并推送到 ui-refinement-stage1

### ✅ 后端验证（已完成）
- [x] V2系统正在工作
- [x] schedule_seats 表有 108,276 条数据
- [x] train_schedules 表有班次数据
- [x] 后端日志显示"使用V2(区间座位)版本"

### 📝 用户操作（请执行）
1. **刷新浏览器**（Cmd+Shift+R）
2. **选择明天的日期**：2026-01-20
3. **搜索车次**：北京 → 上海
4. **观察结果**：
   - 应该显示 7 个车次
   - 座位列显示具体数字（如"150"、"60"）或"有"/"无"
   - **不再**全是 `"--"`
5. **点击预订按钮**：
   - 应该能够跳转到订单填写页
   - 控制台显示完整日志

---

## 🐛 如果还是无法跳转

### 检查控制台日志

**预期看到**：
```javascript
🎫 车次 G103 是否有票: true 座位信息: { 二等座: "150", 一等座: "60", ... }
🔘 预订按钮被点击，车次: G103
✅ 车次有可用座位，准备跳转
🎫 准备跳转到订单页，车次数据: { trainNo: "G103", ... }
✅ navigate 函数已调用
```

**如果看到**：
```javascript
🎫 车次 G103 是否有票: false
❌ 该车次无可用座位
```

**原因**：
- 座位数据还是空的
- 或者前端还在使用旧代码

**解决**：
1. 强制刷新浏览器（清除缓存）
2. 检查后端日志是否显示"使用V2版本"
3. 如果后端还在用V1，检查前端代码是否正确添加了 `useV2: true`

---

## 📊 数据库健康检查

```bash
cd /Users/od/Desktop/cs3604-12306-automation-mcp

# 检查所有表
sqlite3 backend/database.db "
SELECT 
  (SELECT COUNT(*) FROM trains) as trains,
  (SELECT COUNT(*) FROM train_schedules) as schedules,
  (SELECT COUNT(*) FROM schedule_seats) as seats;
"

# 应该看到：
# trains | schedules | seats
# 26     | 780       | 108276
```

**如果 `schedules` 或 `seats` 是 0**：
```bash
cd /Users/od/Desktop/cs3604-12306-automation-mcp/backend/src/database
node setup_complete_system.js
```

---

## 🎉 成功标志

当一切正常时，你应该看到：

1. **车次列表页**：
   - 显示多个车次（如果查询明天的日期）
   - 座位列显示数字（"150", "60"）或"有"/"无"
   - 预订按钮是蓝色可点击的

2. **点击预订按钮**：
   - 页面跳转到 `/order`
   - URL 变化
   - 控制台显示完整的调试日志

3. **订单填写页**：
   - 显示车次信息（车次号、出发站、到达站）
   - 可以选择乘客
   - 可以提交订单

---

**最后更新**：2026-01-19
**相关提交**：f51cf5b
