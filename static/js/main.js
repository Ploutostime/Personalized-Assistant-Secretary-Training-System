// 现代化的WebSocket聊天客户端
class AgricultureChat {
    constructor() {
        this.ws = null;
        this.userId = this.generateUUID();
        this.connected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 3000;
        
        this.initChat();
    }

    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 |0;
            const v = c === 'x' ? r : (r & 0x3 |0x8);
            return v.toString(16);
        });
    }

    initChat() {
        this.createChatUI();
        this.connectWebSocket();
        this.setupEventListeners();
    }

    createChatUI() {
        // 现代化的聊天界面
        const chatPanel = document.createElement('div');
        chatPanel.className = 'chat-panel modern-chat';
        chatPanel.innerHTML = `
            <div class="chat-header">
                <div class="chat-title">
                    <i class="fas fa-robot"></i>
                    <span>农业AI助手</span>
                </div>
                <div class="chat-actions">
                    <button class="chat-minimize">
                        <i class="fas fa-minus"></i>
                    </button>
                    <button class="chat-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="chat-messages" id="chatMessages"></div>
            <div class="chat-input-area">
                <div class="input-wrapper">
                    <input type="text" 
                           id="chatInput" 
                           placeholder="输入农业相关问题..." 
                           class="chat-input">
                    <button id="sendMessage" class="send-button">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
                <div class="quick-replies">
                    <button class="quick-reply" data-question="如何防治水稻病虫害？">
                        病虫害防治
                    </button>
                    <button class="quick-reply" data-question="智能农业技术有哪些？">
                        智能农业
                    </button>
                    <button class="quick-reply" data-question="可持续农业实践">
                        可持续农业
                    </button>
                </div>
            </div>
            <div class="chat-status" id="chatStatus">
                <i class="fas fa-circle"></i>
                连接中...
            </div>
        `;

        document.body.appendChild(chatPanel);
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendMessage');
        this.chatStatus = document.getElementById('chatStatus');
    }

    connectWebSocket() {
        const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
        const wsUrl = `${protocol}${window.location.host}/ws/chat/${this.userId}`;

        try {
            this.ws = new WebSocket(wsUrl);
            
            this.ws.onopen = () => {
                this.connected = true;
                this.reconnectAttempts = 0;
                this.updateStatus('connected', '已连接');
                this.addSystemMessage('已连接到农业AI助手');
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.addAIMessage(data.answer ||data.message);
                } catch (error) {
                    this.addAIMessage(event.data);
                }
            };

            this.ws.onclose = () => {
                this.connected = false;
                this.updateStatus('disconnected', '连接断开');
                
                if (this.reconnectAttempts < this.maxReconnectAttempts) {
                    this.reconnectAttempts++;
                    const delay = this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts);
                    
                    setTimeout(() => {
                        this.connectWebSocket();
                    }, delay);
                }
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket错误:', error);
                this.updateStatus('error', '连接错误');
            };

        } catch (error) {
            console.error('WebSocket连接失败:', error);
        }
    }

    setupEventListeners() {
        // 发送消息
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // 快捷回复
        document.querySelectorAll('.quick-reply').forEach(button => {
            button.addEventListener('click', (e) => {
                const question = e.target.dataset.question;
                this.chatInput.value = question;
                this.sendMessage();
            });
        });

        // 聊天控制
        document.querySelector('.chat-minimize').addEventListener('click', () => {
            document.querySelector('.chat-panel').classList.toggle('minimized');
        });

        document.querySelector('.chat-close').addEventListener('click', () => {
            document.querySelector('.chat-panel').style.display = 'none';
        });
    }

    sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message ||!this.connected) return;

        this.addUserMessage(message);
        this.chatInput.value = '';

        // 发送到WebSocket
        const payload = {
            type: 'chat',
            message: message,
            userId: this.userId,
            timestamp: new Date().toISOString()
        };

        this.ws.send(JSON.stringify(payload));
    }

    addUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">
                <div class="message-text">${this.escapeHtml(message)}</div>
                <div class="message-time">${this.getCurrentTime()}</div>
            </div>
        `;
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addAIMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ai-message';
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="message-text">${this.escapeHtml(message)}</div>
                <div class="message-time">${this.getCurrentTime()}</div>
            </div>
        `;
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addSystemMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message system-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <i class="fas fa-info-circle"></i>
                ${message}
            </div>
        `;
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    updateStatus(status, message) {
        const icon = this.chatStatus.querySelector('i');
        
        switch(status) {
            case 'connected':
                icon.className = 'fas fa-circle';
                icon.style.color = '#4CAF50';
                break;
            case 'disconnected':
                icon.className = 'fas fa-circle';
                icon.style.color = '#F44336';
                break;
            case 'connecting':
                icon.className = 'fas fa-circle-notch fa-spin';
                icon.style.color = '#FF9800';
                break;
            case 'error':
                icon.className = 'fas fa-exclamation-circle';
                icon.style.color = '#F44336';
                break;
        }
        
        this.chatStatus.innerHTML = `${icon.outerHTML} ${message}`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

// 初始化聊天
document.addEventListener('DOMContentLoaded', () => {
    window.agricultureChat = new AgricultureChat();
});
