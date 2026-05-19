#!/usr/bin/env python3
"""
修复所有HTML文件的分享功能
问题：分享选项的<a>标签缺少CSS类名，导致JavaScript无法绑定事件
"""

import re
import sys

# 需要修复的文件列表
files = [
    '/Volumes/D/WorkBuddy/9界播客/index.html',
    '/Volumes/D/WorkBuddy/9界播客/vinyl-player.html',
    '/Volumes/D/WorkBuddy/9界播客/player-liulanglang.html',
    '/Volumes/D/WorkBuddy/9界播客/player-gandalf.html',
    '/Volumes/D/WorkBuddy/9界播客/player-heyi.html'
]

def fix_share_html(file_path):
    """修复分享下拉菜单的HTML，添加缺失的CSS类名"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # 1. 修复分享下拉菜单中的<a>标签，添加CSS类名
    # 复制链接
    content = re.sub(
        r'(<a href="#" class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-800 transition-colors")(>\s*<i class="fa fa-link)',
        r'\1 share-link\2',
        content
    )
    
    # 邮件
    content = re.sub(
        r'(<a href="#" class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-800 transition-colors")(>\s*<i class="fa fa-envelope)',
        r'\1 share-email\2',
        content
    )
    
    # 微信
    content = re.sub(
        r'(<a href="#" class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-800 transition-colors")(>\s*<i class="fa fa-wechat)',
        r'\1 share-wechat\2',
        content
    )
    
    # 微博
    content = re.sub(
        r'(<a href="#" class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-800 transition-colors")(>\s*<i class="fa fa-weibo)',
        r'\1 share-weibo\2',
        content
    )
    
    # 2. 修复移动端分享按钮，添加id
    content = re.sub(
        r'(<button class="w-full px-4 py-2 bg-primary text-white rounded-full hover:bg-opacity-90 transition-colors")(>\s*分享)',
        r'\1 id="share-button-mobile"\2',
        content
    )
    
    # 3. 确保桌面端分享按钮有正确的id（应该在HTML中已有）
    # 这部分通常已经在HTML中了，不需要修改
    
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ 已修复: {file_path}")
        return True
    else:
        print(f"⚠️  无需修复或格式不同: {file_path}")
        return False

def check_javascript(file_path):
    """检查JavaScript代码是否完整"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 检查关键JavaScript代码是否存在
    checks = [
        ('share-button', '桌面端分享按钮ID'),
        ('share-dropdown', '分享下拉菜单ID'),
        ('share-wechat', '微信分享类名'),
        ('share-link', '复制链接类名'),
        ('share-weibo', '微博分享类名'),
        ('share-email', '邮件分享类名'),
        ('navigator.clipboard', '复制链接功能'),
        ('mailto:', '邮件分享功能'),
        ('weibo.com/share', '微博分享功能')
    ]
    
    print(f"\n检查 {file_path}:")
    all_ok = True
    for keyword, desc in checks:
        if keyword in content:
            print(f"  ✅ {desc}")
        else:
            print(f"  ❌ 缺失: {desc}")
            all_ok = False
    
    return all_ok

if __name__ == '__main__':
    print("=" * 60)
    print("修复分享功能")
    print("=" * 60)
    
    # 1. 修复HTML
    print("\n【第一步】修复HTML中的CSS类名")
    print("-" * 60)
    for file in files:
        try:
            fix_share_html(file)
        except Exception as e:
            print(f"❌ 错误: {file} - {e}")
    
    # 2. 检查JavaScript
    print("\n【第二步】检查JavaScript代码")
    print("-" * 60)
    for file in files:
        try:
            check_javascript(file)
        except Exception as e:
            print(f"❌ 错误: {file} - {e}")
    
    print("\n" + "=" * 60)
    print("完成！请测试分享功能。")
    print("=" * 60)
