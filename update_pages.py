#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量更新9界播客页面：
1. 统一所有二级页面的"联系我们"信息与首页相同
2. 为所有页面的"分享"按钮添加分享功能（微信、链接、微博、email）
3. 修改首页文案
"""

import re

# 首页的联系我们信息（作为标准）
contact_us_html = '''                <div>
                    <h3 class="text-lg font-bold mb-6 text-white">联系我们</h3>
                    <ul class="space-y-3">
                        <li class="flex items-start">
                            <i class="fa fa-envelope text-primary mt-1 mr-3"></i>
                            <span class="text-gray-400">9JIE@9JIE-podcast.com</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fa fa-phone text-primary mt-1 mr-3"></i>
                            <span class="text-gray-400">+……(^_^)v 23 5767 80910</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fa fa-map-marker text-primary mt-1 mr-3"></i>
                            <span class="text-gray-400">Surface Fixed Address (Olympus Mons 奥林帕斯山)<br>18.65°N, 226.20°E, Mars Planet, Solar System</span>
                        </li>
                    </ul>
                </div>'''

# 分享下拉菜单HTML（用于顶部导航栏的分享按钮）
share_dropdown_html = '''                    <div id="share-dropdown" class="hidden absolute bottom-full mb-2 right-0 bg-darker border border-gray-800 rounded-lg shadow-lg p-4 w-64">
                        <h4 class="text-white font-medium mb-3">分享到</h4>
                        <div class="grid grid-cols-2 gap-3">
                            <a href="#" class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-800 transition-colors share-wechat">
                                <i class="fa fa-wechat text-primary"></i>
                                <span class="text-gray-300">微信</span>
                            </a>
                            <a href="#" class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-800 transition-colors share-link">
                                <i class="fa fa-link text-primary"></i>
                                <span class="text-gray-300">复制链接</span>
                            </a>
                            <a href="#" class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-800 transition-colors share-weibo">
                                <i class="fa fa-weibo text-primary"></i>
                                <span class="text-gray-300">微博</span>
                            </a>
                            <a href="#" class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-800 transition-colors share-email">
                                <i class="fa fa-envelope text-primary"></i>
                                <span class="text-gray-300">邮件</span>
                            </a>
                        </div>
                    </div>'''

# 分享功能的JavaScript代码
share_js_code = '''
            // 分享下拉菜单
            const shareButton = document.getElementById('share-button');
            const shareDropdown = document.getElementById('share-dropdown');
            
            if (shareButton && shareDropdown) {
                shareButton.addEventListener('click', function(e) {
                    e.stopPropagation();
                    shareDropdown.classList.toggle('hidden');
                });
                
                // 点击其他地方关闭下拉菜单
                document.addEventListener('click', function(event) {
                    if (!shareButton.contains(event.target) && !shareDropdown.contains(event.target)) {
                        shareDropdown.classList.add('hidden');
                    }
                });
                
                // 微信分享
                const shareWechat = shareDropdown.querySelector('.share-wechat');
                if (shareWechat) {
                    shareWechat.addEventListener('click', function(e) {
                        e.preventDefault();
                        showToast('请截图或使用微信扫一扫分享');
                        shareDropdown.classList.add('hidden');
                    });
                }
                
                // 复制链接
                const shareLink = shareDropdown.querySelector('.share-link');
                if (shareLink) {
                    shareLink.addEventListener('click', function(e) {
                        e.preventDefault();
                        const url = window.location.href;
                        if (navigator.clipboard) {
                            navigator.clipboard.writeText(url).then(() => {
                                showToast('链接已复制到剪贴板');
                            });
                        } else {
                            // Fallback
                            const input = document.createElement('input');
                            input.value = url;
                            document.body.appendChild(input);
                            input.select();
                            document.execCommand('copy');
                            document.body.removeChild(input);
                            showToast('链接已复制到剪贴板');
                        }
                        shareDropdown.classList.add('hidden');
                    });
                }
                
                // 微博分享
                const shareWeibo = shareDropdown.querySelector('.share-weibo');
                if (shareWeibo) {
                    shareWeibo.addEventListener('click', function(e) {
                        e.preventDefault();
                        const url = encodeURIComponent(window.location.href);
                        const title = encodeURIComponent(document.title);
                        window.open(`https://service.weibo.com/share/share.php?url=${url}&title=${title}`, '_blank');
                        shareDropdown.classList.add('hidden');
                    });
                }
                
                // 邮件分享
                const shareEmail = shareDropdown.querySelector('.share-email');
                if (shareEmail) {
                    shareEmail.addEventListener('click', function(e) {
                        e.preventDefault();
                        const url = window.location.href;
                        const title = document.title;
                        const mailtoUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent('推荐你收听：' + title + ' ' + url)}`;
                        window.location.href = mailtoUrl;
                        shareDropdown.classList.add('hidden');
                    });
                }
            }'''

def update_vinyl_player():
    """更新 vinvl-player.html"""
    filepath = '/Volumes/D/WorkBuddy/9界播客/vinyl-player.html'
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. 更新联系我们信息
    # 找到联系我们的div并替换
    contact_pattern = r'<div>\s*<h3 class="text-lg font-bold mb-6 text-white">联系我们</h3>.*?</div>\s*</div>\s*</div>'
    contact_match = re.search(contact_pattern, content, re.DOTALL)
    if contact_match:
        # 找到完整联系我们区块的结束位置
        contact_start = contact_match.start()
        contact_end = contact_match.end()
        
        # 向前找到<div>开始标签
        div_start = content.rfind('<div>', 0, contact_start)
        if div_start == -1:
            div_start = content.rfind('<div>\n', 0, contact_start)
        
        if div_start != -1:
            # 替换联系我们部分
            content = content[:div_start] + contact_us_html + '\n' + content[contact_end:]
    
    # 2. 为顶部导航栏的分享按钮添加下拉菜单
    # 找到分享按钮
    share_button_pattern = r'<button class="hidden md:block px-4 py-2 bg-primary text-white rounded-full hover:bg-opacity-90 transition-colors">\s*分享\s*</button>'
    share_button_match = re.search(share_button_pattern, content)
    
    if share_button_match:
        # 在分享按钮后添加下拉菜单
        insert_pos = share_button_match.end()
        content = content[:insert_pos] + '\n' + share_dropdown_html + content[insert_pos:]
    
    # 3. 添加分享功能的JavaScript
    # 在</script>前添加分享功能代码
    script_end = content.rfind('</script>')
    if script_end != -1:
        # 在最后一个</script>前插入分享功能代码
        content = content[:script_end] + share_js_code + '\n' + content[script_end:]
    
    # 4. 为分享按钮添加id
    content = content.replace(
        'class="hidden md:block px-4 py-2 bg-primary text-white rounded-full hover:bg-opacity-90 transition-colors">\n                    分享',
        'class="hidden md:block px-4 py-2 bg-primary text-white rounded-full hover:bg-opacity-90 transition-colors" id="share-button">\n                    分享'
    )
    
    # 同样处理移动端菜单中的分享按钮
    content = content.replace(
        'class="w-full px-4 py-2 bg-primary text-white rounded-full hover:bg-opacity-90 transition-colors">\n                    分享',
        'class="w-full px-4 py-2 bg-primary text-white rounded-full hover:bg-opacity-90 transition-colors" id="share-button-mobile">\n                    分享'
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ 已更新 {filepath}")

def update_player_liulanglang():
    """更新 player-liulanglang.html"""
    filepath = '/Volumes/D/WorkBuddy/9界播客/player-liulanglang.html'
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. 更新联系我们信息
    contact_pattern = r'<div>\s*<h3 class="text-lg font-bold mb-6 text-white">联系我们</h3>.*?</div>\s*</div>\s*</div>'
    contact_match = re.search(contact_pattern, content, re.DOTALL)
    if contact_match:
        contact_start = contact_match.start()
        contact_end = contact_match.end()
        
        div_start = content.rfind('<div>', 0, contact_start)
        if div_start == -1:
            div_start = content.rfind('<div>\n', 0, contact_start)
        
        if div_start != -1:
            content = content[:div_start] + contact_us_html + '\n' + content[contact_end:]
    
    # 2. 为顶部导航栏的分享按钮添加下拉菜单
    share_button_pattern = r'<button class="hidden md:block px-4 py-2 bg-primary text-white rounded-full hover:bg-opacity-90 transition-colors">\s*分享\s*</button>'
    share_button_match = re.search(share_button_pattern, content)
    
    if share_button_match:
        insert_pos = share_button_match.end()
        content = content[:insert_pos] + '\n' + share_dropdown_html + content[insert_pos:]
    
    # 3. 添加分享功能的JavaScript
    script_end = content.rfind('</script>')
    if script_end != -1:
        content = content[:script_end] + share_js_code + '\n' + content[script_end:]
    
    # 4. 为分享按钮添加id
    content = content.replace(
        'class="hidden md:block px-4 py-2 bg-primary text-white rounded-full hover:bg-opacity-90 transition-colors">\n                    分享',
        'class="hidden md:block px-4 py-2 bg-primary text-white rounded-full hover:bg-opacity-90 transition-colors" id="share-button">\n                    分享'
    )
    
    content = content.replace(
        'class="w-full px-4 py-2 bg-primary text-white rounded-full hover:bg-opacity-90 transition-colors">\n                    分享',
        'class="w-full px-4 py-2 bg-primary text-white rounded-full hover:bg-opacity-90 transition-colors" id="share-button-mobile">\n                    分享'
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ 已更新 {filepath}")

def update_player_gandalf():
    """更新 player-gandalf.html"""
    filepath = '/Volumes/D/WorkBuddy/9界播客/player-gandalf.html'
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. 更新联系我们信息
    contact_pattern = r'<div>\s*<h3 class="text-lg font-bold mb-6 text-white">联系我们</h3>.*?</div>\s*</div>\s*</div>'
    contact_match = re.search(contact_pattern, content, re.DOTALL)
    if contact_match:
        contact_start = contact_match.start()
        contact_end = contact_match.end()
        
        div_start = content.rfind('<div>', 0, contact_start)
        if div_start == -1:
            div_start = content.rfind('<div>\n', 0, contact_start)
        
        if div_start != -1:
            content = content[:div_start] + contact_us_html + '\n' + content[contact_end:]
    
    # 2. 为顶部导航栏的分享按钮添加下拉菜单
    share_button_pattern = r'<button class="hidden md:block px-4 py-2 bg-primary text-white rounded-full hover:bg-opacity-90 transition-colors">\s*分享\s*</button>'
    share_button_match = re.search(share_button_pattern, content)
    
    if share_button_match:
        insert_pos = share_button_match.end()
        content = content[:insert_pos] + '\n' + share_dropdown_html + content[insert_pos:]
    
    # 3. 添加分享功能的JavaScript
    script_end = content.rfind('</script>')
    if script_end != -1:
        content = content[:script_end] + share_js_code + '\n' + content[script_end:]
    
    # 4. 为分享按钮添加id
    content = content.replace(
        'class="hidden md:block px-4 py-2 bg-primary text-white rounded-full hover:bg-opacity-90 transition-colors">\n                    分享',
        'class="hidden md:block px-4 py-2 bg-primary text-white rounded-full hover:bg-opacity-90 transition-colors" id="share-button">\n                    分享'
    )
    
    content = content.replace(
        'class="w-full px-4 py-2 bg-primary text-white rounded-full hover:bg-opacity-90 transition-colors">\n                    分享',
        'class="w-full px-4 py-2 bg-primary text-white rounded-full hover:bg-opacity-90 transition-colors" id="share-button-mobile">\n                    分享'
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ 已更新 {filepath}")

def update_player_heyi():
    """更新 player-heyi.html"""
    filepath = '/Volumes/D/WorkBuddy/9界播客/player-heyi.html'
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. 更新联系我们信息
    contact_pattern = r'<div>\s*<h3 class="text-lg font-bold mb-6 text-white">联系我们</h3>.*?</div>\s*</div>\s*</div>'
    contact_match = re.search(contact_pattern, content, re.DOTALL)
    if contact_match:
        contact_start = contact_match.start()
        contact_end = contact_match.end()
        
        div_start = content.rfind('<div>', 0, contact_start)
        if div_start == -1:
            div_start = content.rfind('<div>\n', 0, contact_start)
        
        if div_start != -1:
            content = content[:div_start] + contact_us_html + '\n' + content[contact_end:]
    
    # 2. 为顶部导航栏的分享按钮添加下拉菜单
    share_button_pattern = r'<button class="hidden md:block px-4 py-2 bg-primary text-white rounded-full hover:bg-opacity-90 transition-colors">\s*分享\s*</button>'
    share_button_match = re.search(share_button_pattern, content)
    
    if share_button_match:
        insert_pos = share_button_match.end()
        content = content[:insert_pos] + '\n' + share_dropdown_html + content[insert_pos:]
    
    # 3. 添加分享功能的JavaScript
    script_end = content.rfind('</script>')
    if script_end != -1:
        content = content[:script_end] + share_js_code + '\n' + content[script_end:]
    
    # 4. 为分享按钮添加id
    content = content.replace(
        'class="hidden md:block px-4 py-2 bg-primary text-white rounded-full hover:bg-opacity-90 transition-colors">\n                    分享',
        'class="hidden md:block px-4 py-2 bg-primary text-white rounded-full hover:bg-opacity-90 transition-colors" id="share-button">\n                    分享'
    )
    
    content = content.replace(
        'class="w-full px-4 py-2 bg-primary text-white rounded-full hover:bg-opacity-90 transition-colors">\n                    分享',
        'class="w-full px-4 py-2 bg-primary text-white rounded-full hover:bg-opacity-90 transition-colors" id="share-button-mobile">\n                    分享'
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ 已更新 {filepath}")

def update_index_html():
    """更新 index.html"""
    filepath = '/Volumes/D/WorkBuddy/9界播客/index.html'
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. 修改首页文案
    old_text = '发现平行时间里的我们，与志故事里的角色一起，开启奇妙旅程。'
    new_text = '平行时间里的你，将与故事里的角色一起，开启奇妙旅程。'
    content = content.replace(old_text, new_text)
    
    # 2. 确保首页的分享按钮有下拉菜单（应该已经有了，但确保一下）
    # 检查是否已有分享下拉菜单
    if 'id="share-dropdown"' not in content:
        # 添加分享下拉菜单
        share_button_pattern = r'(<button id="share-button" class="hidden md:block px-4 py-2 bg-primary text-white rounded-full hover:bg-opacity-90 transition-colors">\s*分享\s*</button>)'
        share_button_match = re.search(share_button_pattern, content)
        
        if share_button_match:
            insert_pos = share_button_match.end(1)
            content = content[:insert_pos] + '\n                    ' + share_dropdown_html + content[insert_pos:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ 已更新 {filepath}")

if __name__ == '__main__':
    print("开始更新页面...")
    
    # 更新首页
    print("\n1. 更新首页 index.html")
    update_index_html()
    
    # 更新二级页面
    print("\n2. 更新 vinvl-player.html")
    update_vinyl_player()
    
    print("\n3. 更新 player-liulanglang.html")
    update_player_liulanglang()
    
    print("\n4. 更新 player-gandalf.html")
    update_player_gandalf()
    
    print("\n5. 更新 player-heyi.html")
    update_player_heyi()
    
    print("\n✅ 所有页面更新完成！")
