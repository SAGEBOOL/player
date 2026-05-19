#!/usr/bin/env python3
"""
超简单有效的分享功能修复脚本
直接重写分享相关的HTML和JavaScript代码
"""

import re

# 5个需要修复的文件
files = [
    '/Volumes/D/WorkBuddy/9界播客/index.html',
    '/Volumes/D/WorkBuddy/9界播客/vinyl-player.html',
    '/Volumes/D/WorkBuddy/9界播客/player-liulanglang.html',
    '/Volumes/D/WorkBuddy/9界播客/player-gandalf.html',
    '/Volumes/D/WorkBuddy/9界播客/player-heyi.html'
]

# 标准的分享下拉菜单HTML
SHARE_DROPDOWN_HTML = '''
                    <div id="share-dropdown" class="hidden absolute bottom-full mb-2 right-0 bg-darker border border-gray-800 rounded-lg shadow-lg p-4 w-64 z-50">
                        <h4 class="text-white font-medium mb-3">分享到</h4>
                        <div class="grid grid-cols-2 gap-3">
                            <a href="#" class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-800 transition-colors share-link">
                                <i class="fa fa-link text-primary"></i>
                                <span class="text-gray-300">复制链接</span>
                            </a>
                            <a href="#" class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-800 transition-colors share-email">
                                <i class="fa fa-envelope text-primary"></i>
                                <span class="text-gray-300">邮件</span>
                            </a>
                            <a href="#" class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-800 transition-colors share-wechat">
                                <i class="fa fa-wechat text-primary"></i>
                                <span class="text-gray-300">微信</span>
                            </a>
                            <a href="#" class="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-800 transition-colors share-weibo">
                                <i class="fa fa-weibo text-primary"></i>
                                <span class="text-gray-300">微博</span>
                            </a>
                        </div>
                    </div>
'''

# 标准的分享功能JavaScript代码
SHARE_JS_CODE = '''
            // ============ 分享功能 ============
            const shareButton = document.getElementById('share-button');
            const shareButtonMobile = document.getElementById('share-button-mobile');
            const shareDropdown = document.getElementById('share-dropdown');
            
            function toggleShareDropdown(e) {
                e.stopPropagation();
                if (shareDropdown) {
                    shareDropdown.classList.toggle('hidden');
                }
            }
            
            if (shareButton && shareDropdown) {
                shareButton.addEventListener('click', toggleShareDropdown);
            }
            
            if (shareButtonMobile && shareDropdown) {
                shareButtonMobile.addEventListener('click', toggleShareDropdown);
            }
            
            // 点击其他地方关闭下拉菜单
            document.addEventListener('click', function(event) {
                if (shareDropdown && !shareDropdown.contains(event.target) && 
                    (!shareButton || !shareButton.contains(event.target)) &&
                    (!shareButtonMobile || !shareButtonMobile.contains(event.target))) {
                    shareDropdown.classList.add('hidden');
                }
            });
            
            // 复制链接
            const shareLink = shareDropdown?.querySelector('.share-link');
            if (shareLink) {
                shareLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    const url = window.location.href;
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(url).then(() => {
                            alert('链接已复制到剪贴板');
                        });
                    } else {
                        const input = document.createElement('input');
                        input.value = url;
                        document.body.appendChild(input);
                        input.select();
                        document.execCommand('copy');
                        document.body.removeChild(input);
                        alert('链接已复制到剪贴板');
                    }
                    shareDropdown.classList.add('hidden');
                });
            }
            
            // 邮件分享
            const shareEmail = shareDropdown?.querySelector('.share-email');
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
            
            // 微信分享
            const shareWechat = shareDropdown?.querySelector('.share-wechat');
            if (shareWechat) {
                shareWechat.addEventListener('click', function(e) {
                    e.preventDefault();
                    alert('请截图或使用微信扫一扫分享');
                    shareDropdown.classList.add('hidden');
                });
            }
            
            // 微博分享
            const shareWeibo = shareDropdown?.querySelector('.share-weibo');
            if (shareWeibo) {
                shareWeibo.addEventListener('click', function(e) {
                    e.preventDefault();
                    const url = encodeURIComponent(window.location.href);
                    const title = encodeURIComponent(document.title);
                    window.open(`https://service.weibo.com/share/share.php?url=${url}&title=${title}`, '_blank');
                    shareDropdown.classList.add('hidden');
                });
            }
'''

def fix_file(file_path):
    """修复单个文件的分享功能"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    modified = False
    
    # 1. 修复分享下拉菜单的HTML
    # 查找并替换整个分享下拉菜单
    pattern = r'<div id="share-dropdown"[^>]*>.*?</div>\s*</div>'
    match = re.search(pattern, content, re.DOTALL)
    if match:
        content = content.replace(match.group(0), SHARE_DROPDOWN_HTML)
        modified = True
        print(f"  ✅ 已更新分享下拉菜单HTML")
    
    # 2. 添加z-50类到分享下拉菜单（如果还没有）
    if 'z-50' not in content and 'share-dropdown' in content:
        content = content.replace('id="share-dropdown" class="', 'id="share-dropdown" class="z-50 ')
        modified = True
        print(f"  ✅ 已添加z-50类")
    
    # 3. 修复JavaScript代码
    # 查找分享功能的JavaScript代码块并替换
    js_pattern = r'// 分享下拉菜单.*?// 元素动画'
    js_match = re.search(js_pattern, content, re.DOTALL)
    if js_match:
        # 在"// 元素动画"前插入新的分享功能代码
        content = content.replace(js_match.group(0), SHARE_JS_CODE + '\n            // 元素动画')
        modified = True
        print(f"  ✅ 已更新分享功能JavaScript代码")
    
    # 4. 确保移动端分享按钮有正确的ID
    if 'share-button-mobile' not in content:
        content = re.sub(
            r'(<button class="w-full px-4 py-2 bg-primary text-white rounded-full hover:bg-opacity-90 transition-colors")(>)',
            r'\1 id="share-button-mobile"\2',
            content
        )
        modified = True
        print(f"  ✅ 已添加移动端分享按钮ID")
    
    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ 已修复: {file_path.split('/')[-1]}")
        return True
    else:
        print(f"⚠️  无需修复或格式不同: {file_path.split('/')[-1]}")
        return False

if __name__ == '__main__':
    print("=" * 60)
    print("修复分享功能（超简单版本）")
    print("=" * 60)
    
    for file in files:
        print(f"\n处理: {file.split('/')[-1]}")
        print("-" * 60)
        try:
            fix_file(file)
        except Exception as e:
            print(f"❌ 错误: {e}")
    
    print("\n" + "=" * 60)
    print("完成！请测试分享功能。")
    print("=" * 60)
