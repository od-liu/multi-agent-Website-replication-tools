# 产品卡片 - UI 样式规范示例（Agent输出格式）

本文档展示 Agent 应该输出的 CSS 样式规范格式（简化版）。

> **📌 重要提示**：
> - 所有样式使用 `!important` 确保优先级
> - 所有尺寸精确到 px
> - 包含所有交互状态

---

## 1. 颜色体系

### 主题色
- **主题红色**: `#ff6b6b` - 用于价格显示和主按钮
- **主题红色（深）**: `#ff5252` - 用于按钮 hover 状态
- **辅助青色**: `#4ecdc4` - 用于评分星星

### 文本颜色
- **深灰色**: `#333333` - 商品名称
- **灰色**: `#999999` - 原价（划线）

### 背景和边框
- **白色**: `#ffffff` - 卡片背景
- **浅灰色边框**: `#eeeeee` - 卡片边框
- **禁用灰色**: `#cccccc` - 按钮禁用状态

---

## 2. 产品卡片容器 (ProductCard)

### 文件路径
- 组件: `src/components/ProductCard.tsx`
- 样式: `src/components/ProductCard.css`

### 组件位置说明

**整体结构**:
```
┌─────────────────────────┐
│  ProductImage (图片)    │
├─────────────────────────┤
│  ProductInfo (信息)     │
├─────────────────────────┤
│  AddToCartButton (按钮) │
└─────────────────────────┘
```

### 完整样式代码

```css
/* ========== 2.1 卡片容器 ========== */
.product-card {
  display: flex !important;
  flex-direction: column !important;
  width: 300px !important;
  background: #ffffff !important;
  border: 1px solid #eeeeee !important;
  border-radius: 8px !important;
  overflow: hidden !important;
  transition: box-shadow 0.3s ease !important;
}

.product-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}
```

---

## 3. 商品图片 (ProductImage)

### 组件位置说明

**在卡片中的位置**:
- 父容器: `.product-card`
- 位置: 第一个子元素，卡片顶部
- 尺寸: 100% × 300px

**在 JSX 中的结构**:
```tsx
<div className="product-card">
  <ProductImage />  {/* ← 第一个子元素 */}
  <ProductInfo />
</div>
```

### 完整样式代码

```css
/* ========== 3.1 图片样式 ========== */
.product-image {
  width: 100% !important;
  height: 300px !important;
  object-fit: cover !important;
  transition: transform 0.3s ease !important;
}

/* ========== 3.2 悬停效果 ========== */
.product-image:hover {
  transform: scale(1.05) !important;
}
```

**关键属性**:
- 尺寸: 100% × 300px
- 图片填充: `object-fit: cover`（保持比例，裁剪填充）
- hover 效果: 放大到 1.05 倍

---

## 4. 商品信息 (ProductInfo)

### 组件位置说明

**在卡片中的位置**:
- 父容器: `.product-card`
- 位置: 第二个子元素，图片下方
- 内边距: 20px（四周）

**内部结构（从上到下）**:
1. 商品标题 - `.product-title`
2. 价格和评分 - `.price-rating`（flex水平排列）

### 完整样式代码

```css
/* ========== 4.1 信息容器 ========== */
.product-info {
  padding: 20px !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 12px !important;
}

/* ========== 4.2 商品标题 ========== */
.product-title {
  font-size: 16px !important;
  font-weight: 600 !important;
  color: #333333 !important;
  line-height: 1.5 !important;
  /* 限制两行显示，超出显示省略号 */
  display: -webkit-box !important;
  -webkit-line-clamp: 2 !important;
  -webkit-box-orient: vertical !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

/* ========== 4.3 价格和评分容器 ========== */
.price-rating {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
}

/* ========== 4.4 价格样式 ========== */
.price {
  font-size: 20px !important;
  font-weight: 700 !important;
  color: #ff6b6b !important;
}

.original-price {
  font-size: 14px !important;
  color: #999999 !important;
  text-decoration: line-through !important;
  margin-left: 8px !important;
}

/* ========== 4.5 评分样式 ========== */
.rating {
  font-size: 14px !important;
  color: #4ecdc4 !important;
}
```

**关键属性**:
- 标题字体: 16px，加粗600，颜色#333333
- 标题行数: 最多2行，超出显示省略号
- 价格字体: 20px，加粗700，颜色#ff6b6b（红色）
- 原价: 14px，灰色，带删除线

---

## 5. 加入购物车按钮 (AddToCartButton)

### 组件位置说明

**在卡片中的位置**:
- 父容器: `.product-card`
- 位置: 第三个子元素，卡片底部
- 尺寸: 100% × 48px

### 完整样式代码

```css
/* ========== 5.1 按钮基础样式 ========== */
.add-to-cart-button {
  width: 100% !important;
  height: 48px !important;
  background: #ff6b6b !important;
  color: #ffffff !important;
  border: none !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
}

/* ========== 5.2 悬停状态 ========== */
.add-to-cart-button:hover:not(:disabled) {
  background: #ff5252 !important;
  box-shadow: 0 4px 8px rgba(255, 107, 107, 0.3) !important;
}

/* ========== 5.3 禁用状态 ========== */
.add-to-cart-button:disabled {
  background: #cccccc !important;
  color: #999999 !important;
  cursor: not-allowed !important;
}
```

**关键属性**:
- 尺寸: 100% × 48px
- 背景: #ff6b6b（红色）
- hover: 背景变为#ff5252，添加阴影
- disabled: 背景变为#cccccc（灰色）

---

## 6. 使用说明

### 6.1 在组件中使用

1. 创建对应的 CSS 文件
2. 复制上方样式代码
3. 在组件中导入：`import './ProductCard.css'`
4. 应用类名到 JSX 元素

### 6.2 验证清单

- [ ] 所有颜色值与颜色体系一致
- [ ] 所有尺寸精确到 px
- [ ] hover 状态正确实现
- [ ] disabled 状态正确实现
- [ ] 布局与设计稿一致

---

**示例结束** - 这展示了 Agent 应该输出的文档格式和内容结构。

