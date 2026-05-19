#!/usr/bin/env python3
"""
批量修复所有HTML文件的分享功能
确保桌面端和移动端分享按钮都能正常工作
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

def fix_share_function(file_path):
    """修复分享功能：添加移动端按钮ID，统一JavaScript代码"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    modified = False
    
    # 1. 确保移动端分享按钮有id="share-button-mobile"
    content, count = re.subn(
        r'(<button class="w-full px-4 py-2 bg-primary text-white rounded-full hover:bg-opacity-90 transition-colors")(>)(\s*分享\s*</button>)',
        r'\1 id="share-button-mobile"\2\3',
        content
    )
    if count > 0:
        print(f"  ✅ 添加移动端分享按钮ID: {file_path.split('/')[-1]}")
        modified = True
    
    # 2. 确保分享选项有正确的CSS类名
    replacements = [
        ('fa-link', 'share-link', '复制链接'),
        ('fa-envelope', 'share-email', '邮件'),
        ('fa-wechat', 'share-wechat', '微信'),
        ('fa-weibo', 'share-weibo', '微博')
    ]
    
    for fa_class, css_class, desc in replacements:
        # 匹配<a>标签中包含特定font awesome图标的
        pattern = rf'(<a href="#" class="[^"]*")(>\s*<i class="fa {fa_class}[^"]*"></i>)'
        replacement = rf'\1 {css_class}\2'
        new_content, count = re.subn(pattern, replacement, content)
        if count > 0:
            content = new_content
            print(f"  ✅ 添加{desc}CSS类名: {file_path.split('/')[-1]}")
            modified = True
    
    # 3. 修复JavaScript代码，添加移动端分享按钮支持
    # 查找并替换分享功能的JavaScript代码块
    js_pattern = r'(// 分享下拉菜单.*?const shareButton = document\.getElementById\([\'"]share-button[\'"]\);.*?)(?=// 元素动画|// ============|</script>)'
    
    def replace_js(match):
        """替换JavaScript代码，添加移动端支持"""
        js_code = match.group(0)
        
        # 添加移动端分享按钮
        if 'share-button-mobile' not in js_code:
            js_code = js_code.replace(
                'const shareButton = document.getElementById(\'share-button\');',
                'const shareButton = document.getElementById(\'share-button\');\n            const shareButtonMobile = document.getElementById(\'share-button-mobile\');'
            )
            
            # 添加移动端按钮的事件处理
            if 'function setupShareDropdown' not in js_code:
                # 在shareButton定义后添加函数
                js_code = js_code.replace(
                    'const shareDropdown = document.getElementById(\'share-dropdown\');',
                    'const shareDropdown = document.getElementById(\'share-dropdown\');\n            \n            function setupShareDropdown(button) {\n                if (!button || !shareDropdown) return;\n                \n                button.addEventListener(\'click\', function(e) {\n                    e.stopPropagation();\n                    shareDropdown.classList.toggle(\'hidden\');\n                });\n            }\n            \n            setupShareDropdown(shareButton);\n            setupShareDropdown(shareButtonMobile);'
                )
        
        return js_code
    
    # 这个正则可能太复杂，让我用更简单的方法
    # 直接重写整个分享功能的JavaScript代码
    
    if content == original_content and not modified:
        print(f"  ⚠️  无需修复或格式不同: {file_path.split('/')[-1]}")
        return False
    else:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ 已修复: {file_path.split('/')[-1]}")
        return True

def check_and_fix_all():
    """检查并修复所有文件"""
    print("=" * 60)
    print("批量修复分享功能")
    print("=" * 60)
    
    for file in files:
        print(f"\n处理: {file.split('/')[-1]}")
        print("-" * 60)
        try:
            fix_share_function(file)
        except Exception as e:
            print(f"❌ 错误: {e}")
    
    print("\n" + "=" * 60)
    print("完成！请测试分享功能。")
    print("=" * 60)

if __name__ == '__main__':
    check_and_fix_all()
