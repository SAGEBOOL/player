#!/usr/bin/env python3
# 为 player-gandalf.html 和 player-liulanglang.html 添加 data-src 属性

import re

# 音频文件列表（按章节顺序）
audio_files = [
    "assets/music/（九界归尘之-河一）开篇.mp3",
    "assets/music/第2章-墟界残响.mp3",
    "assets/music/第3章-另一种力量.mp3",
    "assets/music/第4章-散修的规矩.mp3",
    "assets/music/第5章-墟界遗址.mp3",
    "assets/music/第6章-归来者.mp3",
    "assets/music/第7章-始源追杀 .mp3",
    "assets/music/第8章-重回灵溪.mp3",
    "assets/music/第9章-月妖娆.mp3",
    "assets/music/第10章-初战.mp3",
    "assets/music/第十一章：暗流涌动.mp3",
    "assets/music/第十二章：清洗.mp3",
    "assets/music/第十三章：墟界密使.mp3",
    "assets/music/第十四章：残魂渡.mp3",
    "assets/music/第十五章：墟界深处.mp3",
    "assets/music/月下孤城.mp3",
]

def add_data_src(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 找到所有 episode-card div
    pattern = r'<div class="episode-card[^"]*" data-episode="(\d+)"(?!.*data-src)>'
    
    def replacer(match):
        full_match = match.group(0)
        episode_num = int(match.group(1))
        
        # 映射 episode 编号到音频文件（假设 episode 1-16 对应 16 个音频文件）
        # 如果 episode 编号 > 16，则循环使用
        audio_index = (episode_num - 1) % len(audio_files)
        audio_src = audio_files[audio_index]
        
        # 在 data-episode 后面插入 data-src
        new_tag = full_match.replace(
            f'data-episode="{episode_num}"',
            f'data-episode="{episode_num}" data-src="{audio_src}"'
        )
        return new_tag
    
    # 使用正则表达式替换
    # 注意：这个正则可能不完美，需要根据实际HTML调整
    # 让我用更简单的方法：逐行处理
    
    lines = content.split('\n')
    updated_lines = []
    episode_index = 0
    
    for line in lines:
        # 查找包含 episode-card 和 data-episode 但没有 data-src 的行
        if 'episode-card' in line and 'data-episode=' in line and 'data-src=' not in line:
            # 提取 data-episode 的值
            ep_match = re.search(r'data-episode="(\d+)"', line)
            if ep_match:
                ep_num = int(ep_match.group(1))
                audio_index = (ep_num - 1) % len(audio_files)
                audio_src = audio_files[audio_index]
                
                # 在 data-episode="X" 后面插入 data-src="..."
                line = line.replace(
                    f'data-episode="{ep_num}"',
                    f'data-episode="{ep_num}" data-src="{audio_src}"'
                )
        updated_lines.append(line)
    
    updated_content = '\n'.join(updated_lines)
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(updated_content)
    
    print(f'已更新 {filename}')

# 处理两个文件
import os

base_dir = '/Volumes/D/WorkBuddy/9界播客'
for filename in ['player-gandalf.html', 'player-liulanglang.html']:
    filepath = os.path.join(base_dir, filename)
    if os.path.exists(filepath):
        add_data_src(filepath)
    else:
        print(f'文件不存在: {filepath}')
