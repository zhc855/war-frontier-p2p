/**
 * 主入口文件
 * 初始化游戏和事件监听
 */

// 游戏初始化
console.log('main.js 已加载');
console.log('等待 DOMContentLoaded 事件...');

// 添加全局错误捕获
window.addEventListener('error', (event) => {
    console.error('全局错误:', event.error);
    console.error('错误堆栈:', event.error.stack);
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded 事件已触发！');
    console.log('ui 实例:', typeof ui !== 'undefined' ? '已创建' : '未创建');
    console.log('deckBuilder 实例:', typeof deckBuilder !== 'undefined' ? '已创建' : '未创建');
    
    try {
        initMainMenu();
        initDeckBuilder();
        initDeckSelector();
        initGame();
        initEventListeners();
        initAchievements();
        initCardBack();
        console.log('所有初始化函数已调用');
    } catch (error) {
        console.error('初始化过程中发生错误:', error);
        console.error('错误堆栈:', error.stack);
    }
});

/**
 * 初始化主菜单
 */
function initMainMenu() {
    console.log('初始化主菜单...');
    
    const btnDeckBuilder = document.getElementById('btn-deckbuilder');
    const btnPlayLocal = document.getElementById('btn-play-local');
    const btnPlayOnline = document.getElementById('btn-play-online');
    const btnCards = document.getElementById('btn-cards');
    const btnAchievements = document.getElementById('btn-achievements');
    const btnSettings = document.getElementById('btn-settings');

    console.log('获取到的按钮元素:', {
        btnDeckBuilder,
        btnPlayLocal,
        btnPlayOnline,
        btnCards,
        btnAchievements,
        btnSettings
    });

    // 检查元素是否存在
    if (!btnDeckBuilder) {
        console.error('btn-deckbuilder 元素不存在');
    }
    if (!btnPlayLocal) {
        console.error('btn-play-local 元素不存在');
    }
    if (!btnPlayOnline) {
        console.error('btn-play-online 元素 元素不存在');
    }
    if (!btnCards) {
        console.error('btn-cards 元素不存在');
    }
    if (!btnAchievements) {
        console.error('btn-achievements 元素不存在');
    }
    if (!btnSettings) {
        console.error('btn-settings 元素不存在');
    }

    // 牌组构建器
    if (btnDeckBuilder) {
        btnDeckBuilder.addEventListener('click', () => {
            console.log('点击了构建牌组按钮');
            ui.renderDeckBuilder();
        });
    }

    // 本地对战
    if (btnPlayLocal) {
        btnPlayLocal.addEventListener('click', () => {
            console.log('点击了本地对战按钮');
            // 检查是否有可用的牌组
            const savedDecks = deckBuilder.loadAllDecks();
            if (savedDecks.length === 0) {
                ui.showMessage('请先构建一个牌组！', 'error');
                ui.renderDeckBuilder();
                return;
            }

            // 使用第一个保存的牌组开始游戏
            startGameWithDeck(savedDecks[0]);
        });
    }

    // 联机对战
    if (btnPlayOnline) {
        btnPlayOnline.addEventListener('click', () => {
            console.log('点击了联机对战按钮');
            ui.renderMultiplayer();
        });
    }

    // 卡牌图鉴
    if (btnCards) {
        btnCards.addEventListener('click', () => {
            console.log('点击了卡牌图鉴按钮');
            ui.renderCardGallery();
        });
    }

    // 成就系统
    if (btnAchievements) {
        btnAchievements.addEventListener('click', () => {
            console.log('点击了成就按钮');
            ui.renderAchievements();
        });
    }

    // 卡背定制
    const btnCardBack = document.getElementById('btn-cardback');
    if (btnCardBack) {
        btnCardBack.addEventListener('click', () => {
            console.log('点击了卡背定制按钮');
            ui.renderCardBack();
        });
    }

    // 设置
    if (btnSettings) {
        btnSettings.addEventListener('click', () => {
            console.log('点击了设置按钮');
            ui.renderSettings();
        });
    }

    console.log('主菜单事件监听器绑定完成');
}

/**
 * 初始化牌组构建器
 */
function initDeckBuilder() {
    // 加载卡牌数据库到牌组构建器
    const allCards = getAllCards();
    deckBuilder.setAvailableCards(allCards);

    console.log('牌组构建器初始化完成，可用卡牌数:', allCards.length);

    const btnBackMenu = document.getElementById('btn-back-menu');
    const btnSaveDeck = document.getElementById('btn-save-deck');
    const btnClearDeck = document.getElementById('btn-clear-deck');

    // 返回主菜单
    btnBackMenu.addEventListener('click', () => {
        ui.renderMainMenu();
    });

    // 保存牌组
    btnSaveDeck.addEventListener('click', () => {
        const deckName = prompt('请输入牌组名称:');
        if (!deckName) return;

        const result = deckBuilder.saveDeck(deckName);
        if (result.success) {
            ui.showMessage(result.message, 'success');
        } else {
            ui.showMessage(result.message, 'error');
        }
    });

    // 清空牌组
    btnClearDeck.addEventListener('click', () => {
        if (confirm('确定要清空当前牌组吗？')) {
            deckBuilder.clearDeck();
            ui.renderDeckPreview();
            ui.showMessage('牌组已清空', 'info');
        }
    });

    // 阵营选择器
    const factionButtons = document.querySelectorAll('.faction-btn');
    factionButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const faction = e.target.dataset.faction;
            selectFaction(faction);
        });
    });

    // 卡牌过滤器
    const typeFilter = document.getElementById('card-type-filter');
    const costFilter = document.getElementById('card-cost-filter');

    typeFilter.addEventListener('change', filterCards);
    costFilter.addEventListener('change', filterCards);
}

/**
 * 选择阵营
 * @param {string} factionId - 阵营ID
 */
function selectFaction(factionId) {
    const mainFaction = deckBuilder.getMainFaction();
    const secondaryFaction = deckBuilder.getSecondaryFaction();

    console.log('选择阵营:', factionId, '主阵营:', mainFaction, '次阵营:', secondaryFaction);

    // 如果还没有选择主阵营，先选择主阵营
    if (!mainFaction) {
        // 设置主阵营
        deckBuilder.setFactions(factionId, null);

        // 更新按钮状态 - 主阵营显示为 active
        document.querySelectorAll('.faction-btn').forEach(btn => {
            btn.classList.remove('active', 'secondary');
            if (btn.dataset.faction === factionId) {
                btn.classList.add('active');
                btn.textContent = `${btn.textContent.replace(' (主)', '').replace(' (次)', '')} (主)`;
            }
        });

        // 显示提示信息
        ui.showMessage(`已选择主阵营：${factionSystem.getFaction(factionId).name}，请选择次阵营（可选）`, 'info');
    } else if (mainFaction === factionId) {
        // 点击已选择的主阵营，清除选择
        deckBuilder.clearFactions();

        // 更新按钮状态
        document.querySelectorAll('.faction-btn').forEach(btn => {
            btn.classList.remove('active', 'secondary');
            // 恢复原始文本
            const originalText = btn.textContent.replace(' (主)', '').replace(' (次)', '');
            btn.textContent = originalText;
        });

        ui.showMessage('已清除阵营选择', 'info');
    } else if (!secondaryFaction) {
        // 选择次阵营
        deckBuilder.setFactions(mainFaction, factionId);

        // 更新按钮状态 - 次阵营显示为 secondary
        document.querySelectorAll('.faction-btn').forEach(btn => {
            if (btn.dataset.faction === factionId) {
                btn.classList.add('secondary');
                btn.textContent = `${btn.textContent.replace(' (主)', '').replace(' (次)', '')} (次)`;
            }
        });

        ui.showMessage(`已选择次阵营：${factionSystem.getFaction(factionId).name}`, 'info');
    } else if (secondaryFaction === factionId) {
        // 点击已选择的次阵营，移除次阵营
        deckBuilder.setFactions(mainFaction, null);

        // 更新按钮状态
        document.querySelectorAll('.faction-btn').forEach(btn => {
            if (btn.dataset.faction === factionId) {
                btn.classList.remove('secondary');
                btn.textContent = btn.textContent.replace(' (次)', '');
            }
        });

        ui.showMessage('已移除次阵营', 'info');
    } else {
        // 已经有主阵营和次阵营，替换次阵营
        deckBuilder.setFactions(mainFaction, factionId);

        // 更新按钮状态
        document.querySelectorAll('.faction-btn').forEach(btn => {
            btn.classList.remove('secondary');
            if (btn.dataset.faction === secondaryFaction) {
                btn.textContent = btn.textContent.replace(' (次)', '');
            }
            if (btn.dataset.faction === factionId) {
                btn.classList.add('secondary');
                btn.textContent = `${btn.textContent.replace(' (主)', '').replace(' (次)', '')} (次)`;
            }
        });

        ui.showMessage(`已更换次阵营为：${factionSystem.getFaction(factionId).name}`, 'info');
    }

    // 重新渲染
    ui.renderDeckPreview();
    ui.renderAvailableCards();
}

/**
 * 过滤卡牌
 */
function filterCards() {
    const typeFilter = document.getElementById('card-type-filter').value;
    const costFilter = document.getElementById('card-cost-filter').value;

    // 按类型过滤
    let cards = deckBuilder.filterByType(typeFilter);

    // 按费用过滤
    cards = cards.filter(card => {
        if (costFilter === 'all') return true;
        if (costFilter === '6+') return card.cost >= 6;
        const [min, max] = costFilter.split('-').map(Number);
        return card.cost >= min && card.cost <= max;
    });

    // 渲染过滤后的卡牌
    const cardsGrid = document.getElementById('cards-grid');
    cardsGrid.innerHTML = '';
    cards.forEach(card => {
        const cardEl = ui.createCardElement(card, true, false);
        cardEl.onclick = () => {
            const result = deckBuilder.addCardToDeck(card);
            if (result.success) {
                ui.renderDeckPreview();
                ui.showMessage(result.message);
            } else {
                ui.showMessage(result.message, 'error');
            }
        };
        cardsGrid.appendChild(cardEl);
    });
}

/**
 * 使用牌组开始游戏
 * @param {Object} deckData - 牌组数据
 * @param {string} mode - 游戏模式 ('local' 或 'online')
 */
function startGameWithDeck(deckData, mode = 'local') {
    // 设置游戏模式
    ui.setGameMode(mode);

    // 加载卡牌数据库
    const allCards = getAllCards();

    // 加载玩家1的牌组
    deckBuilder.loadDeck(deckData, allCards);
    const player1Deck = {
        faction: deckData.mainFaction || deckData.faction,
        secondaryFaction: deckData.secondaryFaction,
        cards: deckBuilder.getCurrentDeck()
    };

    // 创建玩家2的牌组（简单版本：使用相同的牌组）
    deckBuilder.loadDeck(deckData, allCards);
    const player2Deck = {
        faction: deckData.mainFaction || deckData.faction,
        secondaryFaction: deckData.secondaryFaction,
        cards: deckBuilder.getCurrentDeck()
    };

    if (mode === 'local') {
        // 本地模式：使用本地游戏逻辑
        game.initGame(player1Deck, player2Deck);
        ui.renderGame();
    } else if (mode === 'online') {
        // 联机模式：使用服务器游戏逻辑
        // 游戏状态由服务器管理，客户端只负责显示
        ui.renderGame();
    }
}

/**
 * 初始化游戏
 */
function initGame() {
    const btnDeploy = document.getElementById('deploy-btn');
    const btnMove = document.getElementById('move-btn');
    const btnAttack = document.getElementById('attack-btn');
    const btnWait = document.getElementById('wait-btn');
    const btnEndTurn = document.getElementById('end-turn-btn');
    const btnRestart = document.getElementById('restart-btn');
    const btnQuit = document.getElementById('quit-btn');

    // 部署按钮
    btnDeploy.addEventListener('click', () => {
        const gameMode = ui.getGameMode();
        const state = gameMode === 'local' ? game.getState() : networkClient.getGameState();

        if (state && state.selectedCard !== null) {
            state.actionMode = ACTION_MODES.DEPLOY;
            ui.showMessage('选择部署位置', 'info');
            ui.renderGame();
        }
    });

    // 移动按钮
    btnMove.addEventListener('click', () => {
        const gameMode = ui.getGameMode();
        const state = gameMode === 'local' ? game.getState() : networkClient.getGameState();

        if (state && state.selectedUnit) {
            const unit = state.selectedUnit;
            if (keywordSystem.canMove(unit)) {
                state.actionMode = ACTION_MODES.MOVE;
                ui.showMessage('选择移动目标', 'info');
                ui.renderGame();
            }
        }
    });

    // 攻击按钮
    btnAttack.addEventListener('click', () => {
        const gameMode = ui.getGameMode();
        const state = gameMode === 'local' ? game.getState() : networkClient.getGameState();

        if (state && state.selectedUnit) {
            const unit = state.selectedUnit;
            if (keywordSystem.canAttack(unit)) {
                state.actionMode = ACTION_MODES.ATTACK;
                ui.showMessage('选择攻击目标', 'info');
                ui.renderGame();
            }
        }
    });

    // 待命按钮
    btnWait.addEventListener('click', () => {
        const gameMode = ui.getGameMode();

        if (gameMode === 'local') {
            const result = game.waitUnit();
            ui.showMessage(result.message, result.success ? 'success' : 'error');
            ui.renderGame();
        } else {
            networkClient.sendWait();
        }
    });

    // 结束回合
    btnEndTurn.addEventListener('click', () => {
        const gameMode = ui.getGameMode();

        if (gameMode === 'local') {
            const state = game.getState();
            if (!state.gameOver) {
                game.endTurn();
                ui.renderGame();
            }
        } else {
            networkClient.sendEndTurn();
        }
    });

    // 重新开始
    btnRestart.addEventListener('click', () => {
        if (confirm('确定要重新开始游戏吗？')) {
            const gameMode = ui.getGameMode();

            if (gameMode === 'local') {
                const savedDecks = deckBuilder.loadAllDecks();
                if (savedDecks.length > 0) {
                    startLocalGame(savedDecks[0]);
                } else {
                    ui.renderMainMenu();
                }
            } else {
                // 联机模式：离开房间
                networkClient.leaveRoom();
                ui.renderOnlineLobby();
            }
        }
    });

    // 退出游戏
    btnQuit.addEventListener('click', () => {
        const gameMode = ui.getGameMode();

        if (gameMode === 'online') {
            // 联机模式：离开房间
            networkClient.leaveRoom();
        }

        ui.renderMainMenu();
    });
}

/**
 * 初始化事件监听
 */
function initEventListeners() {
    // 关闭卡牌详情弹窗
    const closeModal = document.getElementById('close-modal');
    const modal = document.getElementById('card-detail-modal');

    closeModal.addEventListener('click', () => {
        ui.hideCardDetail();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            ui.hideCardDetail();
        }
    });

    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
        const gameMode = ui.getGameMode();
        const state = gameMode === 'local' ? game.getState() : networkClient.getGameState();

        if (!state || state.gameOver) return;

        switch (e.key) {
            case 'Escape':
                // 取消当前行动
                if (gameMode === 'local') {
                    game.clearActionMode();
                } else {
                    networkClient.sendClearActionMode();
                }
                ui.renderGame();
                break;
            case 'e':
            case 'E':
                // 结束回合
                if (gameMode === 'local') {
                    game.endTurn();
                } else {
                    networkClient.sendEndTurn();
                }
                ui.renderGame();
                break;
            case 'w':
            case 'W':
                // 待命
                if (gameMode === 'local') {
                    game.waitUnit();
                } else {
                    networkClient.sendWait();
                }
                ui.renderGame();
                break;
        }
    });
}

/**
 * 获取所有卡牌
 * @returns {Array} 卡牌数组
 */
function getAllCards() {
    // 从 cards.js 导入的卡牌数据库
    try {
        if (typeof CARD_DATABASE !== 'undefined' && Array.isArray(CARD_DATABASE)) {
            console.log('加载卡牌数据库，共', CARD_DATABASE.length, '张卡牌');
            return [...CARD_DATABASE];
        }
    } catch (error) {
        console.error('加载卡牌数据库失败:', error);
    }

    console.warn('卡牌数据库未找到');
    return [];
}

/**
 * 初始化卡牌图鉴
 */
function initCardGallery() {
    const btnBack = document.getElementById('btn-gallery-back');
    const factionFilter = document.getElementById('gallery-faction-filter');
    const typeFilter = document.getElementById('gallery-type-filter');
    const costFilter = document.getElementById('gallery-cost-filter');
    const rarityFilter = document.getElementById('gallery-rarity-filter');
    const resetFiltersBtn = document.getElementById('gallery-reset-filters');

    // 返回按钮
    btnBack.addEventListener('click', () => {
        ui.renderMainMenu();
    });

    // 阵营过滤器
    factionFilter.addEventListener('change', () => {
        ui.filterGalleryCards();
    });

    // 类型过滤器
    typeFilter.addEventListener('change', () => {
        ui.filterGalleryCards();
    });

    // 费用过滤器
    costFilter.addEventListener('change', () => {
        ui.filterGalleryCards();
    });

    // 稀有度过滤器
    rarityFilter.addEventListener('change', () => {
        ui.filterGalleryCards();
    });

    // 重置过滤器
    resetFiltersBtn.addEventListener('click', () => {
        factionFilter.value = 'all';
        typeFilter.value = 'all';
        costFilter.value = 'all';
        rarityFilter.value = 'all';
        ui.filterGalleryCards();
    });
}

/**
 * 初始化联机对战
 */
function initMultiplayer() {
    const btnBack = document.getElementById('btn-multiplayer-back');
    const btnConnect = document.getElementById('btn-connect');
    const btnCreateRoom = document.getElementById('btn-create-room');
    const btnJoinRoom = document.getElementById('btn-join-room');
    const btnLeaveRoom = document.getElementById('btn-leave-room');
    const btnSelectDeck = document.getElementById('btn-select-deck');
    const btnReady = document.getElementById('btn-ready');
    const btnSendChat = document.getElementById('btn-send-chat');
    const chatInput = document.getElementById('chat-input');
    const serverUrlInput = document.getElementById('server-url-input');
    const btnDetectLan = document.getElementById('btn-detect-lan');
    const btnRefreshRooms = document.getElementById('btn-refresh-rooms');

    // 加载保存的服务器地址
    loadServerConfig();

    // 返回按钮
    btnBack.addEventListener('click', () => {
        ui.renderMainMenu();
    });

    // 服务器地址输入框
    serverUrlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            btnConnect.click();
        }
    });

    // 预设服务器按钮
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (e.target.id === 'btn-detect-lan') {
                // 自动检测局域网服务器
                detectLanServer();
            } else {
                // 使用预设地址
                serverUrlInput.value = e.target.dataset.url;
            }
        });
    });

    // 连接服务器
    btnConnect.addEventListener('click', async () => {
        const serverUrl = serverUrlInput.value.trim();
        
        if (!serverUrl) {
            ui.showMessage('请输入服务器地址', 'error');
            return;
        }

        try {
            btnConnect.disabled = true;
            btnConnect.textContent = '连接中...';

            await networkClient.connect(serverUrl);
            
            // 保存成功连接的服务器地址
            configManager.setServerUrl(serverUrl);
            
            ui.updateConnectionStatus(true);
            ui.showMessage('已连接到服务器', 'success');

            // 显示房间列表
            document.getElementById('rooms-section').style.display = 'block';

        } catch (error) {
            console.error('连接失败:', error);
            ui.showMessage('连接服务器失败: ' + error.message, 'error');
            ui.updateConnectionStatus(false);
        } finally {
            btnConnect.disabled = false;
            btnConnect.textContent = '连接服务器';
        }
    });

    // 创建房间
    btnCreateRoom.addEventListener('click', () => {
        const playerName = document.getElementById('player-name-input').value.trim() || `玩家${Math.floor(Math.random() * 10000)}`;
        networkClient.createRoom(playerName);
    });

    // 加入房间
    btnJoinRoom.addEventListener('click', () => {
        const roomId = document.getElementById('room-id-input').value.trim().toUpperCase();
        const playerName = document.getElementById('player-name-input').value.trim() || `玩家${Math.floor(Math.random() * 10000)}`;

        if (roomId.length !== 6) {
            ui.showMessage('房间ID必须是6位字符', 'error');
            return;
        }

        networkClient.joinRoom(roomId, playerName);
    });

    // 离开房间
    btnLeaveRoom.addEventListener('click', () => {
        networkClient.leaveRoom();
        ui.hideRoomInfo();
    });

    // 选择牌组
    btnSelectDeck.addEventListener('click', () => {
        deckSelector.setMode('multiplayer');
        ui.renderDeckSelector();
    });

    // 准备
    btnReady.addEventListener('click', () => {
        const savedDecks = deckBuilder.loadAllDecks();
        if (savedDecks.length === 0) {
            ui.showMessage('请先构建一个牌组！', 'error');
            ui.renderDeckBuilder();
            return;
        }

        // 获取选中的牌组
        const selectedDeck = deckSelector.getSelectedDeck();
        const deck = selectedDeck || savedDecks[0];
        
        console.log('准备使用的牌组:', deck);
        
        const allCards = getAllCards();
        deckBuilder.loadDeck(deck, allCards);

        const playerDeck = {
            faction: deck.mainFaction || deck.faction,
            cards: deckBuilder.getCurrentDeck()
        };

        console.log('发送player_ready:', playerDeck);
        networkClient.playerReady(playerDeck.faction, playerDeck.cards);
        btnReady.disabled = true;
        btnReady.textContent = '已准备';
    });

    // 发送聊天消息
    btnSendChat.addEventListener('click', () => {
        const message = chatInput.value.trim();
        if (message) {
            networkClient.sendChatMessage(message);
            chatInput.value = '';
        }
    });

    // 聊天输入回车发送
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            btnSendChat.click();
        }
    });

    // 注册网络事件监听器
    networkClient.on('room_created', (data) => {
        ui.showRoomInfo(data);
        ui.showMessage(`房间创建成功: ${data.roomId}`, 'success');
    });

    networkClient.on('room_joined', (data) => {
        ui.showRoomInfo(data);
        ui.showMessage(`成功加入房间: ${data.roomId}`, 'success');
    });

    networkClient.on('room_updated', (data) => {
        ui.updateRoomInfo(data);
    });

    networkClient.on('player_joined', (data) => {
        ui.showMessage(`${data.playerName} 加入了房间`, 'info');
    });

    networkClient.on('player_left', (data) => {
        ui.showMessage(`玩家${data.playerNumber} 离开了房间`, 'info');
    });

    networkClient.on('player_ready', (data) => {
        ui.showMessage(`玩家${data.playerNumber} 已准备`, 'info');
    });

    networkClient.on('game_started', (data) => {
        console.log('接收到game_started事件:', data);
        
        if (!data.gameState) {
            console.error('游戏状态为空');
            ui.showMessage('游戏开始失败：无游戏状态', 'error');
            return;
        }
    
        console.log('游戏状态详情:', data.gameState);
        ui.showMessage('游戏开始！', 'success');
        
        // 设置游戏模式为联机
        ui.setGameMode('online');
        
        // 设置在线游戏状态（这会自动渲染界面）
        ui.updateGameState(data.gameState);
        
        // 隐藏房间信息
        ui.hideRoomInfo();
    });
    networkClient.on('game_state_updated', (data) => {
        console.log('游戏状态更新:', data);
        ui.updateGameState(data.gameState);
        ui.renderGame();
    });

    networkClient.on('action_failed', (data) => {
        ui.showMessage(data.message, 'error');
    });

    networkClient.on('game_ended', (data) => {
        if (data.disconnected) {
            ui.showMessage('对方断开连接', 'warning');
        }
        ui.showMessage(`游戏结束！玩家${data.winner} 获胜！`, data.winner === networkClient.getPlayerNumber() ? 'success' : 'info');
    });

    networkClient.on('chat_message', (data) => {
        ui.addChatMessage(data);
    });

    networkClient.on('disconnected', () => {
        ui.updateConnectionStatus(false);
        ui.showMessage('与服务器断开连接', 'error');
    });

    // 刷新房间列表
    if (btnRefreshRooms) {
        btnRefreshRooms.addEventListener('click', () => {
            // 请求服务器更新房间列表
            networkClient.getSocket().emit('get_rooms');
        });
    }
}

/**
 * 加载服务器配置
 */
function loadServerConfig() {
    const serverUrlInput = document.getElementById('server-url-input');
    
    // 加载最近使用的服务器地址
    const recentServers = configManager.getRecentServers();
    const currentServer = configManager.getServerUrl();
    
    // 设置输入框的值
    if (serverUrlInput) {
        serverUrlInput.value = currentServer || 'http://localhost:3000';
    }
    
    // 显示最近使用的服务器列表
    const recentServersSection = document.getElementById('recent-servers');
    const recentServersList = document.getElementById('recent-servers-list');
    
    if (recentServers.length > 0 && recentServersSection && recentServersList) {
        recentServersSection.style.display = 'block';
        recentServersList.innerHTML = '';
        
        recentServers.forEach((server, index) => {
            const serverItem = document.createElement('div');
            serverItem.className = 'recent-server-item';
            serverItem.innerHTML = `
                <span class="server-name">${server}</span>
                <button class="use-server-btn" data-url="${server}">使用</button>
            `;
            
            // 点击使用按钮
            serverItem.querySelector('.use-server-btn').addEventListener('click', () => {
                serverUrlInput.value = server;
            });
            
            recentServersList.appendChild(serverItem);
        });
    }
}

/**
 * 自动检测局域网服务器
 */
async function detectLanServer() {
    const serverUrlInput = document.getElementById('server-url-input');
    const btnDetectLan = document.getElementById('btn-detect-lan');
    
    try {
        btnDetectLan.disabled = true;
        btnDetectLan.textContent = '检测中...';
        
        // 常见的局域网IP地址范围
        const baseIPs = ['192.168.0', '192.168.1', '192.168.2', '10.0.0', '172.16.0'];
        const port = 3000;
        const detectedServers = [];
        
        ui.showMessage('正在扫描局域网服务器...', 'info');
        
        // 检查常见的IP地址
        for (const baseIP of baseIPs) {
            for (let i = 1; i <= 255; i++) {
                const serverUrl = `http://${baseIP}.${i}:${port}`;
                
                try {
                    // 尝试连接服务器
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 1000);
                    
                    const response = await fetch(`${serverUrl}/health`, {
                        method: 'GET',
                        signal: controller.signal
                    });
                    
                    clearTimeout(timeoutId);
                    
                    if (response.ok) {
                        detectedServers.push(serverUrl);
                        console.log('发现服务器:', serverUrl);
                    }
                } catch (error) {
                    // 忽略连接失败
                }
            }
        }
        
        if (detectedServers.length > 0) {
            // 使用第一个检测到的服务器
            serverUrlInput.value = detectedServers[0];
            ui.showMessage(`发现 ${detectedServers.length} 个服务器，已选择第一个`, 'success');
            
            // 如果发现多个服务器，可以显示列表供选择
            if (detectedServers.length > 1) {
                console.log('检测到的服务器:', detectedServers);
            }
        } else {
            ui.showMessage('未发现局域网服务器，请手动输入地址', 'warning');
        }
        
    } catch (error) {
        console.error('检测服务器失败:', error);
        ui.showMessage('服务器检测失败: ' + error.message, 'error');
    } finally {
        btnDetectLan.disabled = false;
        btnDetectLan.textContent = '自动检测';
    }
}

/**
 * 初始化牌组选择器
 */
function initDeckSelector() {
    const btnBack = document.getElementById('btn-selector-back');
    const btnCreateNew = document.getElementById('btn-create-new-deck');
    const decksList = document.getElementById('saved-decks-list');

    // 返回按钮
    if (btnBack) {
        btnBack.addEventListener('click', () => {
            if (deckSelector.getMode() === 'multiplayer') {
                ui.renderMultiplayer();
            } else {
                ui.renderMainMenu();
            }
        });
    }

    // 创建新牌组按钮
    if (btnCreateNew) {
        btnCreateNew.addEventListener('click', () => {
            ui.renderDeckBuilder();
        });
    }

    // 如果已经在牌组选择界面，加载牌组列表
    if (decksList) {
        ui.renderSavedDecksList();
    }
}

/**
 * 初始化设置
 */
function initSettings() {
    const btnBack = document.getElementById('btn-settings-back');
    const btnSave = document.getElementById('btn-save-settings');
    const btnClearDecks = document.getElementById('btn-clear-decks');
    const btnResetSettings = document.getElementById('btn-reset-settings');
    const btnClearAll = document.getElementById('btn-clear-all-data');
    const volumeSlider = document.getElementById('setting-volume');
    const volumeValue = document.getElementById('volume-value');

    // 返回按钮
    btnBack.addEventListener('click', () => {
        ui.renderMainMenu();
    });

    // 音量滑块
    volumeSlider.addEventListener('input', (e) => {
        volumeValue.textContent = e.target.value + '%';
    });

    // 保存设置
    btnSave.addEventListener('click', () => {
        const settings = {
            sound: document.getElementById('setting-sound').checked,
            volume: document.getElementById('setting-volume').value,
            music: document.getElementById('setting-music').checked,
            animations: document.getElementById('setting-animations').checked,
            cardDetails: document.getElementById('setting-card-details').checked,
            keywordTooltips: document.getElementById('setting-keyword-tooltips').checked,
            autoEndTurn: document.getElementById('setting-auto-end-turn').checked,
            confirmActions: document.getElementById('setting-confirm-actions').checked,
            timer: document.getElementById('setting-timer').value
        };

        localStorage.setItem('kards_settings', JSON.stringify(settings));
        ui.showMessage('设置已保存', 'success');
    });

    // 清除所有牌组
    btnClearDecks.addEventListener('click', () => {
        if (confirm('确定要清除所有保存的牌组吗？')) {
            localStorage.removeItem('kards_decks');
            ui.showMessage('所有牌组已清除', 'success');
        }
    });

    // 重置设置
    btnResetSettings.addEventListener('click', () => {
        if (confirm('确定要重置所有设置为默认值吗？')) {
            loadDefaultSettings();
            ui.showMessage('设置已重置', 'success');
        }
    });

    // 清除所有数据
    btnClearAll.addEventListener('click', () => {
        if (confirm('警告：这将清除所有数据（牌组、设置等），确定要继续吗？')) {
            localStorage.clear();
            loadDefaultSettings();
            ui.showMessage('所有数据已清除', 'success');
        }
    });

    // 加载已保存的设置
    loadSavedSettings();
}

/**
 * 初始化卡背定制系统
 */
function initCardBack() {
    const btnBack = document.getElementById('btn-cardback-back');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const btnCreateCustomBack = document.getElementById('btn-create-custom-back');

    // 返回按钮
    if (btnBack) {
        btnBack.addEventListener('click', () => {
            ui.renderMainMenu();
        });
    }

    // 标签切换按钮
    tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // 移除所有active类
            tabButtons.forEach(b => b.classList.remove('active'));
            // 添加active类到当前按钮
            e.target.classList.add('active');
            // 渲染筛选后的卡背列表
            ui.renderCardBackGrid(e.target.dataset.tab);
        });
    });

    // 创建自定义卡背按钮
    if (btnCreateCustomBack) {
        btnCreateCustomBack.addEventListener('click', () => {
            const name = document.getElementById('custom-back-name').value.trim();
            const description = document.getElementById('custom-back-description').value.trim();
            const bgColor = document.getElementById('custom-back-bg-color').value;
            const borderColor = document.getElementById('custom-back-border-color').value;
            const pattern = document.getElementById('custom-back-pattern').value;
            const icon = document.getElementById('custom-back-icon').value;

            if (!name) {
                ui.showMessage('请输入卡背名称', 'error');
                return;
            }

            const customBack = cardBackSystem.createCustomBack({
                name,
                description: description || '玩家自定义卡背',
                backgroundColor: bgColor,
                borderColor: borderColor,
                pattern,
                icon
            });

            ui.showMessage('卡背创建成功！', 'success');
            ui.renderCardBackGrid('custom');

            // 清空表单
            document.getElementById('custom-back-name').value = '';
            document.getElementById('custom-back-description').value = '';
        });
    }
}

/**
 * 初始化成就系统
 */
function initAchievements() {
    const btnBack = document.getElementById('btn-achievements-back');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // 返回按钮
    if (btnBack) {
        btnBack.addEventListener('click', () => {
            ui.renderMainMenu();
        });
    }

    // 筛选按钮
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // 移除所有active类
            filterButtons.forEach(b => b.classList.remove('active'));
            // 添加active类到当前按钮
            e.target.classList.add('active');
            // 渲染筛选后的成就列表
            ui.renderAchievementsList(e.target.dataset.filter);
        });
    });
}

/**
 * 加载默认设置
 */
function loadDefaultSettings() {
    document.getElementById('setting-sound').checked = true;
    document.getElementById('setting-volume').value = 70;
    document.getElementById('volume-value').textContent = '70%';
    document.getElementById('setting-music').checked = true;
    document.getElementById('setting-animations').checked = true;
    document.getElementById('setting-card-details').checked = true;
    document.getElementById('setting-keyword-tooltips').checked = true;
    document.getElementById('setting-auto-end-turn').checked = false;
    document.getElementById('setting-confirm-actions').checked = true;
    document.getElementById('setting-timer').value = '60';
}

/**
 * 加载保存的设置
 */
function loadSavedSettings() {
    try {
        const savedSettings = localStorage.getItem('kards_settings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            document.getElementById('setting-sound').checked = settings.sound !== false;
            document.getElementById('setting-volume').value = settings.volume || 70;
            document.getElementById('volume-value').textContent = (settings.volume || 70) + '%';
            document.getElementById('setting-music').checked = settings.music !== false;
            document.getElementById('setting-animations').checked = settings.animations !== false;
            document.getElementById('setting-card-details').checked = settings.cardDetails !== false;
            document.getElementById('setting-keyword-tooltips').checked = settings.keywordTooltips !== false;
            document.getElementById('setting-auto-end-turn').checked = settings.autoEndTurn || false;
            document.getElementById('setting-confirm-actions').checked = settings.confirmActions !== false;
            document.getElementById('setting-timer').value = settings.timer || '60';
        } else {
            loadDefaultSettings();
        }
    } catch (error) {
        console.error('加载设置失败:', error);
        loadDefaultSettings();
    }
}

// 初始化卡牌图鉴
initCardGallery();

// 初始化设置
initSettings();

// 初始化联机对战
initMultiplayer();