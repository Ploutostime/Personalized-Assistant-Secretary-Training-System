// 农业之声 - 现代化JavaScript
class AgricultureApp {
    constructor() {
        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.setupAnimations();
        this.setupTheme();
        this.setupServiceWorker();
        this.setupNotifications();
    }

    setupEventListeners() {
        // 平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // 表单交互增强
        document.querySelectorAll('.input-modern').forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });

        // 图片懒加载
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    setupAnimations() {
        // 滚动动画
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                }
            });
        }, observerOptions);

        // 观察需要动画的元素
        document.querySelectorAll('.feature-item, .glass-card, .animate-on-scroll').forEach(el => {
            observer.observe(el);
        });

        // 鼠标跟随效果
        document.addEventListener('mousemove', (e) => {
            const cursor = document.querySelector('.cursor-follower');
            if (cursor) {
                cursor.style.left = `${e.clientX}px`;
                cursor.style.top = `${e.clientY}px`;
            }
        });
    }

    setupTheme() {
        // 主题切换
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                
                // 更新按钮图标
                const icon = themeToggle.querySelector('i');
                if (icon) {
                    icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
                }
            });

            // 初始化主题
            const savedTheme = localStorage.getItem('theme') ||'light';
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    }

    setupServiceWorker() {
        // 注册Service Worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').then(registration => {
                    console.log('ServiceWorker注册成功:', registration.scope);
                }).catch(error => {
                    console.log('ServiceWorker注册失败:', error);
                });
            });
        }
    }

    setupNotifications() {
        // 请求通知权限
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    // API调用封装
    async callAPI(endpoint, data = null, method = 'GET') {
        try {
            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            };

            if (data) {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(`/api/${endpoint}`, options);
            
            if (!response.ok) {
                throw new Error(`API调用失败: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API错误:', error);
            this.showNotification('网络请求失败，请检查网络连接', 'error');
            throw error;
        }
    }

    // 显示通知
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;

        document.body.appendChild(notification);

        // 显示动画
        setTimeout(() => notification.classList.add('show'), 10);

        // 关闭按钮
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });

        // 自动关闭
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // 表单验证
    validateForm(formData, rules) {
        const errors = {};

        for (const [field, rule] of Object.entries(rules)) {
            const value = formData[field];
            
            if (rule.required && !value) {
                errors[field] = rule.message ||`${field}不能为空`;
                continue;
            }

            if (rule.pattern && value && !rule.pattern.test(value)) {
                errors[field] = rule.message ||`${field}格式不正确`;
                continue;
            }

            if (rule.minLength && value && value.length < rule.minLength) {
                errors[field] = rule.message ||`${field}至少需要${rule.minLength}个字符`;
                continue;
            }

            if (rule.maxLength && value && value.length > rule.maxLength) {
                errors[field] = rule.message ||`${field}不能超过${rule.maxLength}个字符`;
                continue;
            }

            if (rule.custom && !rule.custom(value)) {
                errors[field] = rule.message ||`${field}验证失败`;
            }
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    // 本地存储封装
    storage = {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (error) {
                console.error('存储失败:', error);
            }
        },

        get(key) {
            try {
                const value = localStorage.getItem(key);
                return value ? JSON.parse(value) : null;
            } catch (error) {
                console.error('读取失败:', error);
                return null;
            }
        },

        remove(key) {
            localStorage.removeItem(key);
        },

        clear() {
            localStorage.clear();
        }
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AgricultureApp();
    
    // 添加现代化光标
    if (!document.querySelector('.cursor-follower')) {
        const cursor = document.createElement('div');
        cursor.className = 'cursor-follower';
        document.body.appendChild(cursor);
    }

    // 添加现代化通知样式
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            color: #333;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 10000;
            transform: translateX(150%);
            transition: transform 0.3s ease;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-success {
            border-left: 4px solid #4CAF50;
        }
        
        .notification-error {
            border-left: 4px solid #F44336;
        }
        
        .notification-info {
            border-left: 4px solid #2196F3;
        }
        
        .notification i {
            font-size: 1.2rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
            margin-left: auto;
        }
        
        .cursor-follower {
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(76, 175, 80, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            transition: transform 0.1s;
            mix-blend-mode: difference;
        }
    `;
    document.head.appendChild(style);
});