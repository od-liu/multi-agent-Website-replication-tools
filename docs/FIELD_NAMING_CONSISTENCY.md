# 🔤 字段命名一致性问题

## 问题概述

项目中存在**字段命名不一致**的问题，导致数据传递时容易出错。

---

## 发现的不一致性

### 1. 车次站点字段

**Train 接口（车次列表）**：
```typescript
// frontend/src/components/TrainList/TrainList.tsx
interface Train {
  departureStation: string;  // ✅ 使用这个
  arrivalStation: string;    // ✅ 使用这个
}
```

**OrderInfo 接口（支付/成功页）**：
```typescript
// frontend/src/pages/PaymentPage.tsx
// frontend/src/pages/PurchaseSuccessPage.tsx
interface OrderInfo {
  fromStation: string;  // ⚠️ 不一致
  toStation: string;    // ⚠️ 不一致
}
```

**后端API返回**：
```javascript
// backend/src/database/operations.js
{
  departureStation: train.departure_station,  // 使用这个
  arrivalStation: train.arrival_station,      // 使用这个
}
```

---

## 已修复的Bug

### Bug #1: 预订按钮无法跳转

**文件**：`frontend/src/components/TrainList/TrainList.tsx`

**问题**：
```typescript
// ❌ 错误：访问不存在的字段
departureStation: train.fromStation,  // undefined
arrivalStation: train.toStation,      // undefined
```

**修复**：
```typescript
// ✅ 正确：使用接口定义的字段
departureStation: train.departureStation,
arrivalStation: train.arrivalStation,
```

**影响**：
- 点击"预订"按钮后无法跳转到订单页
- 或跳转后订单页缺少站点信息

---

## 潜在风险

### 🚨 需要检查的地方

1. **订单填写页 → 支付页**
   - OrderFillPage 传递数据时使用什么字段名？
   - PaymentPage 接收数据时期望什么字段名？

2. **支付页 → 成功页**
   - PaymentPage 传递数据时使用什么字段名？
   - PurchaseSuccessPage 接收数据时期望什么字段名？

3. **后端API响应**
   - 所有API返回的站点字段统一吗？
   - 前端是否正确解析？

---

## 建议的统一方案

### 方案A：统一使用 departureStation/arrivalStation

**优点**：
- 语义更清晰（departure = 出发，arrival = 到达）
- 与后端命名一致
- 更易理解

**需要修改**：
```typescript
// 修改所有使用 fromStation/toStation 的地方
interface OrderInfo {
  departureStation: string;  // 改为这个
  arrivalStation: string;    // 改为这个
}
```

---

### 方案B：统一使用 fromStation/toStation

**优点**：
- 更简洁
- 更口语化

**需要修改**：
```typescript
// 修改所有使用 departureStation/arrivalStation 的地方
interface Train {
  fromStation: string;  // 改为这个
  toStation: string;    // 改为这个
}
```

---

### 推荐方案：方案A（departureStation/arrivalStation）

**理由**：
1. 后端已经使用这个命名
2. 更加正式和规范
3. 避免歧义（from/to 可能表示城市而非站点）

---

## 修复清单

### ✅ 已修复
- [x] TrainList.tsx - handleBook 函数字段名

### ⏳ 待检查
- [ ] OrderFillPage.tsx - 检查传递给支付页的数据
- [ ] PaymentPage.tsx - 检查接收和传递的数据
- [ ] PurchaseSuccessPage.tsx - 检查接收的数据
- [ ] PaymentOrderInfo.tsx - 统一字段名
- [ ] SuccessOrderInfo.tsx - 统一字段名

### 🔍 验证方法

**完整流程测试**：
```
1. 车次列表页 → 点击预订
   ✓ 检查控制台日志中的 trainData

2. 订单填写页 → 点击提交
   ✓ 检查提交时传递的数据

3. 支付页 → 点击支付
   ✓ 检查页面显示的站点信息

4. 成功页
   ✓ 检查页面显示的站点信息
```

**断点调试**：
```javascript
// 在关键位置添加日志
console.log('📦 传递数据:', { departureStation, arrivalStation });

// 或使用 debugger
debugger;  // 浏览器会在此暂停
```

---

## 最佳实践

### 1. 使用 TypeScript 接口

```typescript
// ✅ 定义清晰的接口
interface StationInfo {
  departureStation: string;
  arrivalStation: string;
}

// ✅ 使用接口
const train: StationInfo = {
  departureStation: "北京南",
  arrivalStation: "上海虹桥"
};
```

### 2. 统一命名规范

**文件**：`docs/CODING_STANDARDS.md`

```markdown
## 字段命名规范

### 站点相关
- ✅ departureStation - 出发站
- ✅ arrivalStation - 到达站
- ❌ fromStation - 避免使用
- ❌ toStation - 避免使用

### 城市相关
- ✅ departureCity - 出发城市
- ✅ arrivalCity - 到达城市
- ❌ fromCity - 避免使用（除非已广泛使用）
- ❌ toCity - 避免使用（除非已广泛使用）
```

### 3. 代码审查

**检查清单**：
- [ ] 字段名是否与接口定义一致？
- [ ] 是否使用了正确的驼峰命名？
- [ ] 前后端字段名是否匹配？
- [ ] 是否有 TypeScript 类型检查？

---

## 工具辅助

### 查找所有字段使用

```bash
# 查找所有 fromStation/toStation
grep -rn "fromStation\|toStation" frontend/src

# 查找所有 departureStation/arrivalStation
grep -rn "departureStation\|arrivalStation" frontend/src

# 查找字段访问（不包括接口定义）
grep -rn "\.fromStation\|\.toStation" frontend/src
```

### ESLint 规则（可选）

```javascript
// .eslintrc.js
rules: {
  'no-restricted-syntax': [
    'error',
    {
      selector: 'MemberExpression[property.name="fromStation"]',
      message: '使用 departureStation 代替 fromStation'
    },
    {
      selector: 'MemberExpression[property.name="toStation"]',
      message: '使用 arrivalStation 代替 toStation'
    }
  ]
}
```

---

## 总结

**问题**：字段命名不一致导致数据传递错误

**影响**：
- 预订按钮无法跳转
- 页面显示信息缺失
- 维护困难

**解决方案**：
1. 统一使用 `departureStation` / `arrivalStation`
2. 更新所有相关接口和代码
3. 添加 TypeScript 类型检查
4. 添加代码审查清单

**优先级**：P0（高优先级）

---

**最后更新**：2026-01-19
**相关提交**：bfb6523
