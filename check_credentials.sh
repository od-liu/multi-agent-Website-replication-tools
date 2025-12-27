#!/bin/bash

# 凭证配置验证脚本
# 用于检查 credentials.env 配置是否正确

echo "🔍 开始检查凭证配置..."
echo ""

# 初始化检查结果
PASS_COUNT=0
FAIL_COUNT=0

# 检查1：凭证文件是否存在
echo "[1/5] 检查 credentials.env 文件是否存在..."
if [ -f "credentials.env" ]; then
    echo "   ✅ credentials.env 文件存在"
    PASS_COUNT=$((PASS_COUNT + 1))
else
    echo "   ❌ credentials.env 文件不存在"
    echo "   💡 解决方法：cp credentials.example.env credentials.env"
    FAIL_COUNT=$((FAIL_COUNT + 1))
fi
echo ""

# 检查2：.gitignore 是否包含 credentials.env
echo "[2/5] 检查 .gitignore 配置..."
if grep -q "credentials.env" .gitignore 2>/dev/null; then
    echo "   ✅ credentials.env 已在 .gitignore 中"
    PASS_COUNT=$((PASS_COUNT + 1))
else
    echo "   ❌ credentials.env 未在 .gitignore 中"
    echo "   💡 解决方法：echo 'credentials.env' >> .gitignore"
    FAIL_COUNT=$((FAIL_COUNT + 1))
fi
echo ""

# 检查3：凭证文件是否被 Git 跟踪
echo "[3/5] 检查凭证文件是否被 Git 跟踪..."
if git ls-files --error-unmatch credentials.env 2>/dev/null 1>&2; then
    echo "   ❌ credentials.env 被 Git 跟踪！这是安全风险！"
    echo "   💡 解决方法：git rm --cached credentials.env"
    FAIL_COUNT=$((FAIL_COUNT + 1))
else
    echo "   ✅ credentials.env 未被 Git 跟踪"
    PASS_COUNT=$((PASS_COUNT + 1))
fi
echo ""

# 检查4：凭证文件是否包含必需字段
echo "[4/5] 检查必需字段是否存在..."
if [ -f "credentials.env" ]; then
    MISSING_FIELDS=()
    
    if ! grep -q "^LOGIN_USERNAME=" credentials.env; then
        MISSING_FIELDS+=("LOGIN_USERNAME")
    fi
    
    if ! grep -q "^LOGIN_PASSWORD=" credentials.env; then
        MISSING_FIELDS+=("LOGIN_PASSWORD")
    fi
    
    if ! grep -q "^LOGIN_ID_CARD_LAST4=" credentials.env; then
        MISSING_FIELDS+=("LOGIN_ID_CARD_LAST4")
    fi
    
    if [ ${#MISSING_FIELDS[@]} -eq 0 ]; then
        echo "   ✅ 所有必需字段都存在"
        PASS_COUNT=$((PASS_COUNT + 1))
    else
        echo "   ❌ 缺少必需字段：${MISSING_FIELDS[*]}"
        echo "   💡 解决方法：编辑 credentials.env 添加缺失字段"
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
else
    echo "   ⏭️  跳过（文件不存在）"
fi
echo ""

# 检查5：凭证字段是否已填写（非示例值）
echo "[5/5] 检查凭证是否已填写..."
if [ -f "credentials.env" ]; then
    HAS_PLACEHOLDER=0
    
    if grep -q "your_test_username_here" credentials.env; then
        echo "   ⚠️  LOGIN_USERNAME 仍是占位符，未填写真实值"
        HAS_PLACEHOLDER=1
    fi
    
    if grep -q "your_test_password_here" credentials.env; then
        echo "   ⚠️  LOGIN_PASSWORD 仍是占位符，未填写真实值"
        HAS_PLACEHOLDER=1
    fi
    
    if [ $HAS_PLACEHOLDER -eq 0 ]; then
        echo "   ✅ 凭证字段已填写"
        PASS_COUNT=$((PASS_COUNT + 1))
    else
        echo "   ❌ 凭证字段未填写真实值"
        echo "   💡 解决方法：编辑 credentials.env 替换占位符"
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
else
    echo "   ⏭️  跳过（文件不存在）"
fi
echo ""

# 输出总结
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "检查完成！"
echo ""
echo "通过：$PASS_COUNT/5"
echo "失败：$FAIL_COUNT/5"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
    echo "🎉 所有检查通过！凭证配置正确。"
    echo ""
    echo "📋 下一步："
    echo "   你现在可以运行 UI Analyzer Agent 执行交互场景截图。"
    exit 0
else
    echo "⚠️  发现 $FAIL_COUNT 个问题，请根据上方提示修复。"
    echo ""
    echo "📚 详细文档："
    echo "   查看 CREDENTIALS_SETUP.md 了解完整配置指南"
    exit 1
fi

