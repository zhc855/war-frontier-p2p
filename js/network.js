/**
 * 网络客户端
 * 处理与服务器的通信
 */

class NetworkClient {
    constructor() {
        this.socket = null;
        this.connected = false;
        this.roomId = null;
        this.playerNumber = null;
        this.playerName = `玩家${Math.floor(Math.random() * 10000)}`;
        this.eventListeners = new Map();
        this.gameState = null;
    }

    /**
     * 连接到服务器
     * @param {string} serverUrl - 服务器URL
     * @returns {Promise<void>}
     */
    async connect(serverUrl = 'http://localhost:3000') {
        return new Promise((resolve, reject) => {
            try {
                // 检查socket.io是否已加载
                if (typeof io === 'undefined') {
                    reject(new Error('Socket.io客户端未加载，请检查网络连接'));
                    return;
                }

                this.initializeSocket(serverUrl, resolve, reject);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 初始化Socket连接
     */
    initializeSocket(serverUrl, resolve, reject) {
        try {
            this.socket = io(serverUrl);

            this.socket.on('connect', () => {
                console.log('已连接到服务器');
                this.connected = true;
                this.emit('connected', { socketId: this.socket.id });
                resolve();
            });

            this.socket.on('disconnect', () => {
                console.log('与服务器断开连接');
                this.connected = false;
                this.emit('disconnected');
            });

            this.socket.on('error', (error) => {
                console.error('服务器错误:', error);
                this.emit('error', error);
            });

            // 房间事件
            this.socket.on('room_created', (data) => {
                console.log('房间创建成功:', data);
                this.roomId = data.roomId;
                this.playerNumber = data.playerNumber;
                this.emit('room_created', data);
            });

            this.socket.on('room_joined', (data) => {
                console.log('加入房间成功:', data);
                this.roomId = data.roomId;
                this.playerNumber = data.playerNumber;
                this.emit('room_joined', data);
            });

            this.socket.on('room_updated', (data) => {
                this.emit('room_updated', data);
            });

            this.socket.on('player_joined', (data) => {
                console.log('玩家加入:', data);
                this.emit('player_joined', data);
            });

            this.socket.on('player_left', (data) => {
                console.log('玩家离开:', data);
                this.emit('player_left', data);
            });

            this.socket.on('player_ready', (data) => {
                console.log('玩家准备:', data);
                this.emit('player_ready', data);
            });

            // 游戏事件
            this.socket.on('game_started', (data) => {
                console.log('游戏开始');
                this.emit('game_started', data);
            });

            this.socket.on('game_state_updated', (data) => {
                this.emit('game_state_updated', data);
            });

            this.socket.on('action_failed', (data) => {
                console.log('操作失败:', data);
                this.emit('action_failed', data);
            });

            this.socket.on('game_ended', (data) => {
                console.log('游戏结束:', data);
                this.emit('game_ended', data);
            });

            // 聊天事件
            this.socket.on('chat_message', (data) => {
                this.emit('chat_message', data);
            });

            // 房间列表更新
            this.socket.on('rooms_updated', (data) => {
                this.emit('rooms_updated', data);
            });

        } catch (error) {
            reject(error);
        }
    }

    /**
     * 断开连接
     */
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.connected = false;
            this.roomId = null;
            this.playerNumber = null;
        }
    }

    /**
     * 创建房间
     * @param {string} playerName - 玩家名称
     * @param {Object} settings - 房间设置
     */
    createRoom(playerName = null, settings = {}) {
        if (!this.connected) {
            console.error('未连接到服务器');
            return;
        }

        this.playerName = playerName || this.playerName;
        this.socket.emit('create_room', {
            playerName: this.playerName,
            settings: settings
        });
    }

    /**
     * 加入房间
     * @param {string} roomId - 房间ID
     * @param {string} playerName - 玩家名称
     */
    joinRoom(roomId, playerName = null) {
        if (!this.connected) {
            console.error('未连接到服务器');
            return;
        }

        this.playerName = playerName || this.playerName;
        this.socket.emit('join_room', {
            roomId: roomId,
            playerName: this.playerName
        });
    }

    /**
     * 离开房间
     */
    leaveRoom() {
        if (!this.connected) {
            console.error('未连接到服务器');
            return;
        }

        this.socket.emit('leave_room');
        this.roomId = null;
        this.playerNumber = null;
    }

    /**
     * 玩家准备
     * @param {string} faction - 阵营
     * @param {Array} deck - 牌组
     */
    playerReady(faction, deck) {
        if (!this.connected) {
            console.error('未连接到服务器');
            return;
        }

        this.socket.emit('player_ready', {
            faction: faction,
            deck: deck
        });
    }

    /**
     * 发送游戏操作
     * @param {string} action - 操作类型
     * @param {Object} params - 操作参数
     */
    sendGameAction(action, params = {}) {
        if (!this.connected) {
            console.error('未连接到服务器');
            return;
        }

        this.socket.emit('game_action', {
            action: action,
            params: params
        });
    }

    /**
     * 发送聊天消息
     * @param {string} message - 消息内容
     */
    sendChatMessage(message) {
        if (!this.connected) {
            console.error('未连接到服务器');
            return;
        }

        this.socket.emit('chat_message', {
            message: message
        });
    }

    /**
     * 注册事件监听器
     * @param {string} event - 事件名称
     * @param {Function} callback - 回调函数
     */
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    /**
     * 移除事件监听器
     * @param {string} event - 事件名称
     * @param {Function} callback - 回调函数
     */
    off(event, callback) {
        if (!this.eventListeners.has(event)) return;

        const listeners = this.eventListeners.get(event);
        const index = listeners.indexOf(callback);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    }

    /**
     * 触发事件
     * @param {string} event - 事件名称
     * @param {Object} data - 事件数据
     */
    emit(event, data = null) {
        if (!this.eventListeners.has(event)) return;

        const listeners = this.eventListeners.get(event);
        listeners.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`事件处理器错误 (${event}):`, error);
            }
        });
    }

    /**
     * 获取连接状态
     * @returns {boolean} 是否已连接
     */
    isConnected() {
        return this.connected;
    }

    /**
     * 获取房间ID
     * @returns {string|null} 房间ID
     */
    getRoomId() {
        return this.roomId;
    }

    /**
     * 获取玩家编号
     * @returns {number|null} 玩家编号
     */
    getPlayerNumber() {
        return this.playerNumber;
    }

    /**
     * 获取玩家名称
     * @returns {string} 玩家名称
     */
    getPlayerName() {
        return this.playerName;
    }

    /**
     * 获取Socket实例
     * @returns {Object|null} Socket实例
     */
    getSocket() {
        return this.socket;
    }

    /**
     * 发送选择卡牌
     * @param {number} cardIndex - 卡牌索引
     */
    sendSelectCard(cardIndex) {
        this.sendGameAction('select_card', { cardIndex: cardIndex });
    }

    /**
     * 发送部署单位
     * @param {number} slotIndex - 槽位索引
     */
    sendDeployUnit(slotIndex) {
        this.sendGameAction('deploy_unit', { slotIndex: slotIndex });
    }

    /**
     * 发送选择单位
     * @param {string} area - 区域
     * @param {number} index - 索引
     */
    sendSelectUnit(area, index) {
        this.sendGameAction('select_unit', { area: area, index: index });
    }

    /**
     * 发送移动单位
     * @param {number} targetIndex - 目标索引
     */
    sendMove(targetIndex) {
        this.sendGameAction('move_unit', { targetIndex: targetIndex });
    }

    /**
     * 发送攻击
     * @param {string} targetArea - 目标区域
     * @param {number} targetIndex - 目标索引
     */
    sendAttack(targetArea, targetIndex) {
        this.sendGameAction('attack', { targetArea: targetArea, targetIndex: targetIndex });
    }

    /**
     * 发送待命
     */
    sendWait() {
        this.sendGameAction('wait');
    }

    /**
     * 发送结束回合
     */
    sendEndTurn() {
        this.sendGameAction('end_turn');
    }

    /**
     * 发送清除行动模式
     */
    sendClearActionMode() {
        this.sendGameAction('clear_action_mode');
    }

    /**
     * 获取游戏状态
     * @returns {Object} 游戏状态
     */
    getGameState() {
        return this.gameState;
    }

    /**
     * 设置游戏状态
     * @param {Object} gameState - 游戏状态
     */
    setGameState(gameState) {
        this.gameState = gameState;
    }
}

// 创建全局实例
const networkClient = new NetworkClient();

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NetworkClient;
}