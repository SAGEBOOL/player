/**
 * 3D卡片轮播组件 - JavaScript模块
 * 可从用户提供的播放器代码中提取复用
 * 
 * 使用方式：
 * 1. 引入此JS文件
 * 2. 调用 init3DCarousel(containerId, items, options)
 * 3. 或通过 data attributes 自动初始化
 */

class Carousel3D {
    constructor(containerId, items, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Carousel3D: Container #${containerId} not found`);
            return;
        }

        this.track = this.container.querySelector('.carousel-track');
        this.items = items || [];
        this.activeIndex = options.initialIndex || 0;
        this.onChange = options.onChange || null;
        
        // 拖拽状态
        this.startX = 0;
        this.isDragging = false;
        
        this.init();
    }

    init() {
        this.render();
        this.bindEvents();
        this.updateStyles();
    }

    render() {
        if (!this.track) return;
        
        this.track.innerHTML = '';
        
        this.items.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'album-card';
            card.dataset.index = index;
            
            card.innerHTML = `
                <div class="album-cover-wrapper">
                    <img src="${item.cover || ''}" alt="${item.title || ''}" class="album-cover" draggable="false" />
                    <div class="album-info-glass">
                        <p class="album-title">${item.title || ''}</p>
                        <p class="album-artist">${item.artist || ''}</p>
                    </div>
                </div>
            `;
            
            card.addEventListener('click', () => {
                if (index !== this.activeIndex) {
                    this.goTo(index);
                }
            });
            
            this.track.appendChild(card);
        });
    }

    bindEvents() {
        // 鼠标事件
        this.container.addEventListener('mousedown', (e) => this.handleStart(e.clientX));
        this.container.addEventListener('mousemove', (e) => this.handleMove(e.clientX));
        this.container.addEventListener('mouseup', () => this.handleEnd());
        this.container.addEventListener('mouseleave', () => this.handleEnd());
        
        // 触摸事件
        this.container.addEventListener('touchstart', (e) => this.handleStart(e.touches[0].clientX), { passive: true });
        this.container.addEventListener('touchmove', (e) => this.handleMove(e.touches[0].clientX), { passive: true });
        this.container.addEventListener('touchend', () => this.handleEnd());
    }

    handleStart(clientX) {
        this.startX = clientX;
        this.isDragging = true;
    }

    handleMove(clientX) {
        if (!this.isDragging) return;
        
        const diff = this.startX - clientX;
        
        if (Math.abs(diff) > 80) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
            this.isDragging = false;
        }
    }

    handleEnd() {
        this.isDragging = false;
    }

    updateStyles() {
        const cards = this.container.querySelectorAll('.album-card');
        
        cards.forEach((card, index) => {
            const style = this.getCardStyle(index);
            card.style.transform = `translate(-50%, -50%) translateX(${style.x}px) scale(${style.scale}) rotateY(${style.rotateY}deg) translateZ(${style.z}px)`;
            card.style.opacity = style.opacity;
            card.style.zIndex = style.zIndex;
        });
    }

    getCardStyle(index) {
        const diff = index - this.activeIndex;
        const absDistance = Math.abs(diff);

        const baseTranslateX = diff * 140;
        const baseScale = 1 - absDistance * 0.15;
        const baseZ = -absDistance * 120;
        const baseOpacity = Math.max(0.3, 1 - absDistance * 0.35);
        const baseRotateY = diff * -12;

        if (absDistance > 2) {
            return {
                x: diff > 0 ? 400 : -400,
                scale: 0.5,
                z: -300,
                opacity: 0,
                rotateY: diff * -20,
                zIndex: 0,
            };
        }

        return {
            x: baseTranslateX,
            scale: Math.max(0.6, baseScale),
            z: baseZ,
            opacity: baseOpacity,
            rotateY: baseRotateY,
            zIndex: 10 - absDistance,
        };
    }

    goTo(index) {
        if (index < 0) index = this.items.length - 1;
        if (index >= this.items.length) index = 0;
        
        this.activeIndex = index;
        this.updateStyles();
        
        // 触发回调
        if (this.onChange && typeof this.onChange === 'function') {
            this.onChange(this.activeIndex, this.items[this.activeIndex]);
        }
    }

    next() {
        this.goTo(this.activeIndex + 1);
    }

    prev() {
        this.goTo(this.activeIndex - 1);
    }

    getCurrentIndex() {
        return this.activeIndex;
    }

    getCurrentItem() {
        return this.items[this.activeIndex];
    }
}

// 全局初始化函数
function init3DCarousel(containerId, items, options) {
    return new Carousel3D(containerId, items, options);
}

// 如果使用 data attributes 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('[data-3d-carousel]');
    containers.forEach(container => {
        const containerId = container.id;
        const items = JSON.parse(container.dataset.items || '[]');
        const options = JSON.parse(container.dataset.options || '{}');
        new Carousel3D(containerId, items, options);
    });
});
