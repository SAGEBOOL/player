#!/bin/bash
# 九界修真百科 - GitHub 部署脚本

echo "=========================================="
echo "  九界修真百科 - GitHub 部署脚本"
echo "=========================================="

# 1. 检查 GitHub CLI
echo ""
echo "📋 步骤 1: 检查 GitHub CLI..."
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI 未安装"
    echo "   安装方法: brew install gh"
    exit 1
fi
echo "✅ GitHub CLI 已安装"

# 2. GitHub 登录
echo ""
echo "📋 步骤 2: GitHub 登录..."
echo "   请在弹出的浏览器窗口中完成授权"
echo "   一次性代码: 0701-9ED5"
gh auth login -w -h github.com

# 3. 创建仓库
echo ""
echo "📋 步骤 3: 创建 GitHub 仓库..."
cd "$(dirname "$0")"
gh repo create 9jie --public --description "九界修真百科 - 探索修真世界的无限奥秘" --source=. --remote=origin --push

# 4. 完成
echo ""
echo "=========================================="
echo "  ✅ 部署完成!"
echo "=========================================="
echo ""
echo "🌐 访问您的仓库: https://github.com/YOUR_USERNAME/9jie"
echo ""
