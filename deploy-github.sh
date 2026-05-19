#!/bin/bash
# 九界修真百科 - GitHub 部署脚本

echo "=========================================="
echo "  九界修真百科 - GitHub 部署"
echo "=========================================="
echo ""

# 获取 GitHub 用户名
echo "请输入您的 GitHub 用户名:"
read USERNAME

if [ -z "$USERNAME" ]; then
    echo "❌ 用户名不能为空"
    exit 1
fi

echo ""
echo "📋 正在配置远程仓库..."

# 删除旧的远程配置（如果存在）
git remote remove origin 2>/dev/null

# 添加新的远程仓库
git remote add origin "https://github.com/$USERNAME/9jie.git"

echo "✅ 远程仓库已配置"
echo ""
echo "📋 正在推送代码..."

# 推送代码
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "  ✅ 部署成功!"
    echo "=========================================="
    echo ""
    echo "🌐 仓库地址: https://github.com/$USERNAME/9jie"
    echo ""
else
    echo ""
    echo "❌ 推送失败"
    echo ""
    echo "可能的原因:"
    echo "1. GitHub 仓库不存在 - 请先访问 https://github.com/new 创建仓库"
    echo "2. 未登录 GitHub - 请先运行: gh auth login"
    echo "3. 网络问题 - 请检查网络连接"
    echo ""
fi
