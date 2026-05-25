import re

files = [
    '/Volumes/D/WorkBuddy/9界播客/player-heyi.html',
    '/Volumes/D/WorkBuddy/9界播客/player-gandalf.html',
    '/Volumes/D/WorkBuddy/9界播客/player-liulanglang.html',
    '/Volumes/D/WorkBuddy/9界播客/vinyl-player.html',
]

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. HTML: 给 shuffle-btn 添加 badge
    old_shuffle_html = '''<button class="text-white hover:text-primary transition-colors relative" id="shuffle-btn" title="随机播放">
                                <i class="fa fa-random"></i>
                            </button>'''
    new_shuffle_html = '''<button class="text-white hover:text-primary transition-colors relative" id="shuffle-btn" title="播放模式">
                                <i class="fa fa-random"></i>
                                <span id="shuffle-badge" class="hidden absolute -top-2 -right-2 text-[8px] bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center"></span>
                            </button>'''
    content = content.replace(old_shuffle_html, new_shuffle_html)
    
    # 2. JS: 替换 shuffleBtn 点击事件（boolean → 三态）
    old_shuffle_js = '''            // 1. 随机播放
            const shuffleBtn = document.getElementById('shuffle-btn');
            let shuffleMode = false;
            if (shuffleBtn) {
                shuffleBtn.addEventListener('click', function() {
                    shuffleMode = !shuffleMode;
                    this.classList.toggle('control-active');
                    if (shuffleMode) {
                        showToast('随机播放已开启');
                    } else {
                        showToast('随机播放已关闭');
                    }
                });
            }'''
    new_shuffle_js = '''            // 1. 播放模式（顺序联播 / 随机播放）
            const shuffleBtn = document.getElementById('shuffle-btn');
            const shuffleBadge = document.getElementById('shuffle-badge');
            let shuffleMode = 0; // 0: 关闭, 1: 顺序联播, 2: 随机播放
            if (shuffleBtn) {
                shuffleBtn.addEventListener('click', function() {
                    shuffleMode = (shuffleMode + 1) % 3;
                    this.classList.toggle('control-active', shuffleMode > 0);
                    if (shuffleBadge) {
                        if (shuffleMode === 0) {
                            shuffleBadge.classList.add('hidden');
                        } else {
                            shuffleBadge.classList.remove('hidden');
                            shuffleBadge.textContent = shuffleMode === 1 ? '顺' : '随';
                        }
                    }
                    const messages = ['顺序播放已关闭', '顺序联播已开启', '随机播放已开启'];
                    showToast(messages[shuffleMode]);
                });
            }'''
    content = content.replace(old_shuffle_js, new_shuffle_js)
    
    # 3. JS: 替换 audio ended 事件中的 shuffle 逻辑
    old_ended_js = '''                    if (shuffleMode) {
                        // 随机播放下一首
                        const cards = Array.from(episodeCards);
                        const currentIndex = cards.findIndex(c => c.classList.contains('bg-primary'));
                        let nextIndex;
                        do {
                            nextIndex = Math.floor(Math.random() * cards.length);
                        } while (nextIndex === currentIndex && cards.length > 1);
                        if (cards[nextIndex]) cards[nextIndex].click();
                    } else if (loopMode === 1) {
                        // 循环全部
                        const cards = Array.from(episodeCards);
                        const currentIndex = cards.findIndex(c => c.classList.contains('bg-primary'));
                        const nextIndex = (currentIndex + 1) % cards.length;
                        if (cards[nextIndex]) cards[nextIndex].click();
                    }'''
    new_ended_js = '''                    if (shuffleMode === 2) {
                        // 随机播放下一首
                        const cards = Array.from(episodeCards);
                        const currentIndex = cards.findIndex(c => c.classList.contains('bg-primary'));
                        let nextIndex;
                        do {
                            nextIndex = Math.floor(Math.random() * cards.length);
                        } while (nextIndex === currentIndex && cards.length > 1);
                        if (cards[nextIndex]) cards[nextIndex].click();
                    } else if (shuffleMode === 1 || loopMode === 1) {
                        // 顺序联播 或 循环全部
                        const cards = Array.from(episodeCards);
                        const currentIndex = cards.findIndex(c => c.classList.contains('bg-primary'));
                        const nextIndex = currentIndex + 1;
                        if (cards[nextIndex]) {
                            cards[nextIndex].click();
                        } else if (loopMode === 1) {
                            // 循环全部：回到第一首
                            if (cards[0]) cards[0].click();
                        }
                    }'''
    content = content.replace(old_ended_js, new_ended_js)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f'Updated: {filepath}')

print('Done!')
