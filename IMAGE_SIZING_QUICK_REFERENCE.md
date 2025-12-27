# 图片尺寸分析 - 快速参考卡片

## 🚀 快速命令

### 获取图片尺寸（macOS）

```bash
# 方法1: 使用 sips（推荐）
sips -g pixelWidth -g pixelHeight requirements/images/登录页-顶部导航区域-中国铁路Logo.png

# 输出示例：
# /Users/.../登录页-顶部导航区域-中国铁路Logo.png
#   pixelWidth: 220
#   pixelHeight: 60

# 方法2: 使用 file 命令
file requirements/images/登录页-顶部导航区域-中国铁路Logo.png

# 方法3: 批量获取所有图片尺寸
cd requirements/images
for img in *.png *.jpg *.jpeg; do
  echo "=== $img ==="
  sips -g pixelWidth -g pixelHeight "$img"
done
```

### 验证生成的文档

```bash
# 检查 ui-requirements.yaml 是否包含尺寸信息
grep -A 5 "原始尺寸" requirements/ui-requirements.yaml

# 检查 ui-style-guide.md 是否包含 object-fit
grep -B 2 -A 2 "object-fit" requirements/ui-style-guide.md

# 检查生成的 CSS 文件
grep -n "object-fit" frontend/src/components/*.css
```

---

## 📐 常见图片类型的标准处理

### 1. Logo / 品牌图标

**特征**：矩形，有固定宽高比，需要保持清晰

**推荐方案**：
```css
.logo img {
  height: 40px !important;       /* 固定高度 */
  width: auto !important;         /* 宽度自适应 */
  object-fit: contain !important; /* 保持完整 */
  display: block !important;
}
```

**实际案例**：中国铁路Logo
- 原始：220px × 60px (宽高比 11:3)
- 显示：高度40px → 宽度约147px

---

### 2. 二维码

**特征**：正方形，固定尺寸，必须完整显示

**推荐方案**：
```css
.qrcode {
  width: 90px !important;         /* 固定宽度 */
  height: 90px !important;        /* 固定高度 */
  object-fit: contain !important; /* 保持完整 */
}
```

**实际案例**：微信二维码
- 原始：300px × 300px
- 显示：90px × 90px (缩放至30%)

---

### 3. 背景图片

**特征**：大图，需要覆盖整个容器

**推荐方案**：
```css
.container {
  background-image: url('/images/背景图.jpg');
  background-size: cover !important;      /* 覆盖容器 */
  background-position: center !important; /* 居中 */
  background-repeat: no-repeat !important;
}
```

**实际案例**：登录页背景
- 原始：1920px × 1080px
- 显示：全屏覆盖

---

### 4. 装饰图 / 合作伙伴Logo集合

**特征**：矩形，需要适应容器宽度

**推荐方案**：
```css
.decorative-image {
  width: 100% !important;          /* 占满容器 */
  max-width: 400px !important;     /* 限制最大宽度 */
  height: auto !important;         /* 高度自适应 */
  object-fit: contain !important;
}
```

**实际案例**：友情链接图片
- 原始：480px × 160px (宽高比 3:1)
- 显示：宽度400px → 高度约133px

---

## 🎯 object-fit 属性快速参考

| 属性值 | 效果 | 适用场景 | 是否裁剪 | 是否变形 |
|--------|------|----------|---------|---------|
| **contain** | 完整显示图片 | Logo、二维码、重要图片 | ❌ 否 | ❌ 否 |
| **cover** | 覆盖容器 | 头像、缩略图 | ✅ 是 | ❌ 否 |
| **fill** | 填充容器 | 装饰图（不推荐） | ❌ 否 | ✅ 是 |
| **scale-down** | contain 和 none 中较小的 | 不确定图片大小时 | ❌ 否 | ❌ 否 |
| **none** | 原始尺寸 | 精确控制的场景 | ✅ 可能 | ❌ 否 |

**推荐**：
- ✅ 大多数情况使用 `contain`（保证完整、不变形）
- ✅ 背景图使用 `background-size: cover`
- ❌ 避免使用 `fill`（会变形）

---

## 📊 尺寸计算示例

### 示例1：Logo 图片

```
已知信息：
- 原始尺寸：220px × 60px
- 期望高度：40px（从参考截图测量）

计算过程：
1. 宽高比 = 220 / 60 = 11/3 ≈ 3.67
2. 缩放比例 = 40 / 60 = 0.67 = 67%
3. 显示宽度 = 220 × 0.67 = 147px（约）

CSS 代码：
height: 40px;
width: auto;  /* 自动计算为 147px */
object-fit: contain;
```

### 示例2：二维码

```
已知信息：
- 原始尺寸：300px × 300px
- 期望尺寸：90px × 90px（从参考截图测量）

计算过程：
1. 宽高比 = 1:1（正方形）
2. 缩放比例 = 90 / 300 = 0.3 = 30%

CSS 代码：
width: 90px;
height: 90px;
object-fit: contain;
```

### 示例3：友情链接图片

```
已知信息：
- 原始尺寸：480px × 160px
- 期望宽度：400px（容器宽度）

计算过程：
1. 宽高比 = 480 / 160 = 3:1
2. 缩放比例 = 400 / 480 = 0.83 = 83%
3. 显示高度 = 160 × 0.83 = 133px（约）

CSS 代码：
width: 100%;
max-width: 400px;
height: auto;  /* 自动计算为 133px */
object-fit: contain;
```

---

## ✅ 验证检查清单

### UI Analyzer 输出质量检查

在生成 ui-requirements.yaml 和 ui-style-guide.md 后：

- [ ] **ui-requirements.yaml** 包含以下信息：
  - [ ] 图片路径
  - [ ] 原始尺寸（如"220px × 60px"）
  - [ ] 显示尺寸（如"高度40px，宽度auto"）
  - [ ] 缩放方式（如"height: 40px; width: auto"）
  - [ ] 宽高比（如"11:3"）

- [ ] **ui-style-guide.md** 包含：
  - [ ] 完整的 CSS 代码
  - [ ] `object-fit` 属性
  - [ ] 注释说明原始尺寸和缩放比例
  - [ ] 所有尺寸都有单位（px）

### Interface Designer 代码质量检查

在生成组件代码后：

- [ ] CSS 文件包含图片样式
- [ ] 包含 `object-fit` 属性
- [ ] 尺寸值与 ui-style-guide 一致
- [ ] 包含 `!important`（如果需要）

### 浏览器显示效果检查

启动前端服务后：

- [ ] Logo 尺寸准确（高度约40px）
- [ ] 二维码尺寸准确（约90px × 90px）
- [ ] 友情链接图片尺寸合适
- [ ] 背景图覆盖整个页面
- [ ] 所有图片无变形
- [ ] 所有图片无裁剪（除非故意）
- [ ] 图片清晰，无模糊

---

## 🐛 常见问题排查

### 问题1：图片变形

**症状**：图片被拉伸或压缩，宽高比错误

**可能原因**：
- ❌ 同时设置了固定的 width 和 height（对于非正方形图片）
- ❌ 没有使用 `object-fit: contain`
- ❌ 使用了 `object-fit: fill`

**解决方案**：
```css
/* 错误 ❌ */
img {
  width: 200px;
  height: 50px;  /* 强制高度，可能变形 */
}

/* 正确 ✅ */
img {
  width: 200px;
  height: auto;  /* 自动计算，保持宽高比 */
  object-fit: contain;
}
```

### 问题2：图片被裁剪

**症状**：图片只显示部分内容

**可能原因**：
- ❌ 使用了 `object-fit: cover`（对于需要完整显示的图片）
- ❌ 容器尺寸太小，图片被截断

**解决方案**：
```css
/* 如果需要完整显示 */
img {
  object-fit: contain !important;  /* 而不是 cover */
}

/* 或者调整容器尺寸 */
.container {
  width: auto;
  min-width: 200px;
}
```

### 问题3：图片过大或过小

**症状**：图片尺寸与设计稿不符

**可能原因**：
- ❌ CSS 中的尺寸值不准确（估算值）
- ❌ 没有从真实图片尺寸计算

**解决方案**：
1. 使用 `sips` 命令获取图片真实尺寸
2. 从参考截图测量期望显示尺寸
3. 精确计算缩放比例
4. 更新 CSS 代码

### 问题4：图片模糊

**症状**：图片显示不清晰

**可能原因**：
- ❌ 图片被放大超过原始尺寸
- ❌ 图片原始分辨率太低

**解决方案**：
- 避免放大图片（显示尺寸 ≤ 原始尺寸）
- 如果必须放大，使用更高分辨率的图片
- 对于 Retina 屏，考虑使用 2x 图片

---

## 📝 快速模板

### ui-requirements.yaml 模板

```yaml
网页资源（直接用于实现）:
- 图片名称: "/images/文件名.扩展名"
  * 原始尺寸: [宽度]px × [高度]px
  * 显示尺寸: [说明如何显示]
  * 缩放方式: [CSS 代码]
  * 宽高比: [比例]
```

### ui-style-guide.md 模板

```css
.component-image {
  /* [图片类型：Logo/二维码/装饰图] */
  width: [宽度] !important;         /* [说明] */
  height: [高度] !important;        /* [说明] */
  object-fit: [contain/cover] !important;
  display: block !important;
}
/* 原始尺寸: [宽度]px × [高度]px */
/* 缩放比例: [百分比] ([显示尺寸]/[原始尺寸]) */
/* 文件大小: [大小]KB */
```

---

**快速参考版本**：v1.0  
**最后更新**：2025-12-27  
**适用于**：UI Analyzer Agent Phase 3.5

