/**
 * UI 系统
 * 处理界面渲染和用户交互
 */

class UI {
    constructor() {
        this.currentScreen = 'main-menu';
        this.animationQueue = [];
        this.gameMode = 'local'; // 'local' 或 'online'
        this.onlineGameState = null;
    }

    /**
     * 显示屏幕
     * @param {string} screenId - 屏幕ID
     */
    showScreen(screenId) {
        // 隐藏所有屏幕
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });

        // 显示目标屏幕
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
            this.currentScreen = screenId;
        }
    }

    /**
     * 渲染主菜单
     */
    renderMainMenu() {
        this.showScreen('main-menu');
    }

    /**
     * 渲染牌组构建器
     */
    renderDeckBuilder() {
        this.showScreen('deckbuilder');
        this.renderDeckPreview();
        this.renderAvailableCards();
    }

    /**
     * 渲染牌组预览
     */
    renderDeckPreview() {
        const deckPreview = document.getElementById('deck-preview');
        const deck = deckBuilder.getCurrentDeck();

        document.getElementById('deck-count').textContent = deck.length;

        // 显示阵营信息
        const mainFaction = deckBuilder.getMainFaction();
        const secondaryFaction = deckBuilder.getSecondaryFaction();

        let factionText = '';
        if (mainFaction) {
            const mainFactionInfo = factionSystem.getFaction(mainFaction);
            factionText = `${mainFactionInfo.emoji} ${mainFactionInfo.name}`;
            if (secondaryFaction) {
                const secondaryFactionInfo = factionSystem.getFaction(secondaryFaction);
                factionText += ` + ${secondaryFactionInfo.emoji} ${secondaryFactionInfo.name}`;
            }
        } else {
            factionText = '未选择';
        }

        document.getElementById('deck-faction').textContent = factionText;

        deckPreview.innerHTML = '';
        deck.forEach((card, index) => {
            const cardEl = this.createCardElement(card, false, false);
            cardEl.onclick = () => {
                const result = deckBuilder.removeCardFromDeck(index);
                if (result.success) {
                    this.renderDeckPreview();
                    this.showMessage(result.message);
                }
            };
            deckPreview.appendChild(cardEl);
        });
    }

    /**
     * 渲染可用卡牌
     */
    renderAvailableCards() {
        const cardsGrid = document.getElementById('cards-grid');
        const cards = deckBuilder.getAvailableCards();

        console.log('渲染可用卡牌，数量:', cards.length);

        cardsGrid.innerHTML = '';

        if (cards.length === 0) {
            cardsGrid.innerHTML = '<p style="color: #aaa; text-align: center; padding: 20px;">请先选择阵营以查看卡牌</p>';
            return;
        }

        cards.forEach(card => {
            const cardEl = this.createCardElement(card, true, false);
            cardEl.onclick = () => {
                const result = deckBuilder.addCardToDeck(card);
                if (result.success) {
                    this.renderDeckPreview();
                    this.showMessage(result.message);
                } else {
                    this.showMessage(result.message, 'error');
                }
            };
            cardsGrid.appendChild(cardEl);
        });
    }

    /**
     * 渲染游戏界面
     */
    renderGame() {
        console.log('渲染游戏界面，模式:', this.gameMode);
        
        this.showScreen('game-screen');
        this.updatePlayerInfo();
        this.renderBattlefield();
        this.renderHand();
        this.updateControlButtons();
        this.renderGameLog();

        // 如果是联机模式，显示模式标识
        if (this.gameMode === 'online') {
            const modeIndicator = document.createElement('div');
            modeIndicator.className = 'game-mode-indicator';
            modeIndicator.innerHTML = '🌐 联机模式';
            modeIndicator.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                padding: 5px 10px;
                background: rgba(74, 144, 217, 0.8);
                color: white;
                border-radius: 5px;
                font-size: 0.9em;
                z-index: 1000;
            `;
            document.body.appendChild(modeIndicator);

            // 5秒后移除
            setTimeout(() => {
                if (modeIndicator.parentNode) {
                    document.body.removeChild(modeIndicator);
                }
            }, 5000);
        }
    }

    /**
     * 更新玩家信息
     */
    updatePlayerInfo() {
        const state = this.getCurrentGameState();
        if (!state) return;

        const player1 = state.players[1];
        const player2 = state.players[2];

        // 玩家1信息
        document.getElementById('player1-cp').textContent = player1.cp;
        document.getElementById('player1-hq').textContent = player1.hqHP;
        document.getElementById('player1-deck').textContent = player1.deck.length;
        const faction1 = factionSystem.getFaction(player1.faction);
        document.getElementById('player1-faction').textContent = `${faction1.emoji} ${faction1.name}`;

        // 玩家2信息
        document.getElementById('player2-cp').textContent = player2.cp;
        document.getElementById('player2-hq').textContent = player2.hqHP;
        document.getElementById('player2-deck').textContent = player2.deck.length;
        const faction2 = factionSystem.getFaction(player2.faction);
        document.getElementById('player2-faction').textContent = `${faction2.emoji} ${faction2.name}`;

        // 回合信息
        document.getElementById('current-turn').textContent = `玩家${state.currentPlayer} 的回合`;
        document.getElementById('turn-number').textContent = `回合: ${state.turn}`;
    }

    /**
     * 渲染战场
     */
    renderBattlefield() {
        const state = this.getCurrentGameState();
        if (!state) return;

        // 渲染玩家1支援战线
        this.renderPlayerSlots(1, 'support');

        // 渲染前线
        this.renderFrontline();

        // 渲染玩家2支援战线
        this.renderPlayerSlots(2, 'support');

        // 更新前线状态
        this.updateFrontlineStatus();
    }

    /**
     * 渲染玩家槽位
     * @param {number} playerNum - 玩家编号
     * @param {string} area - 区域
     */
    renderPlayerSlots(playerNum, area) {
        const slotsContainer = document.getElementById(`player${playerNum}-slots`);
        const player = game.getState().players[playerNum];
        const line = area === 'support' ? player.supportLine : player.frontline;

        slotsContainer.querySelectorAll('.slot').forEach((slot, index) => {
            slot.innerHTML = '';
            slot.className = 'slot';

            const unit = line[index];
            if (unit) {
                const unitEl = this.createUnitElement(unit, playerNum === game.getState().currentPlayer);
                slot.appendChild(unitEl);
            }

            slot.onclick = () => this.handleSlotClick(area, playerNum, index);
        });
    }

    /**
     * 渲染前线
     */
    renderFrontline() {
        const state = game.getState();
        const frontlineSlots = document.getElementById('frontline-slots');

        frontlineSlots.querySelectorAll('.slot').forEach((slot, index) => {
            slot.innerHTML = '';
            slot.className = 'slot';

            const unit1 = state.players[1].frontline[index];
            const unit2 = state.players[2].frontline[index];

            if (unit1) {
                const unitEl = this.createUnitElement(unit1, 1 === state.currentPlayer);
                slot.appendChild(unitEl);
            } else if (unit2) {
                const unitEl = this.createUnitElement(unit2, 2 === state.currentPlayer);
                slot.appendChild(unitEl);
            }

            slot.onclick = () => this.handleSlotClick('frontline', 0, index);
        });
    }

    /**
     * 创建单位元素
     * @param {Object} unit - 单位对象
     * @param {boolean} isOwner - 是否是拥有者
     * @returns {HTMLElement} 单位元素
     */
    createUnitElement(unit, isOwner) {
        const unitEl = document.createElement('div');
        unitEl.className = `unit ${unit.type}`;

        if (isOwner && !unit.hasWaited) {
            if (keywordSystem.canMove(unit)) unitEl.classList.add('can-move');
            if (keywordSystem.canAttack(unit)) unitEl.classList.add('can-attack');
        }

        // 添加关键字样式
        if (unit.keywords) {
            unit.keywords.forEach(keyword => {
                unitEl.classList.add(`keyword-${keyword}`);
            });
        }

        // 添加状态样式
        if (unit.statuses) {
            unit.statuses.forEach(status => {
                unitEl.classList.add(`status-${status.type}`);
            });
        }

        unitEl.innerHTML = `
            <div class="unit-icon">${unit.icon}</div>
            <div class="unit-name">${unit.name}</div>
            <div class="unit-stats">
                <span class="unit-stat unit-hp">❤️${unit.currentHP}</span>
                <span class="unit-stat unit-armor">🛡️${unit.armor || 0}</span>
                <span class="unit-stat unit-attack">⚔️${unit.attack}</span>
            </div>
        `;

        // 显示关键字
        if (unit.keywords && unit.keywords.length > 0) {
            const keywordsEl = document.createElement('div');
            keywordsEl.className = 'unit-keywords';
            keywordsEl.innerHTML = unit.keywords.map(k => this.getKeywordIcon(k)).join('');
            unitEl.appendChild(keywordsEl);
        }

        return unitEl;
    }

    /**
     * 获取关键字图标
     * @param {string} keyword - 关键字
     * @returns {string} 图标
     */
    getKeywordIcon(keyword) {
        const icons = {
            [KEYWORDS.BLITZ]: '⚡',
            [KEYWORDS.ANTI_TANK]: '🎯',
            [KEYWORDS.ANTI_AIR]: '✈️',
            [KEYWORDS.ARMOR]: '🛡️',
            [KEYWORDS.SUPPORT]: '🤝',
            [KEYWORDS.SMOKE]: '💨',
            [KEYWORDS.STEALTH]: '👻',
            [KEYWORDS.FIRST_STRIKE]: '⚔️',
            [KEYWORDS.BOMBARDMENT]: '💥',
            [KEYWORDS.RUSH]: '🏃',
            [KEYWORDS.HOLD]: '🧱',
            [KEYWORDS.RELAY]: '🔄',
            [KEYWORDS.MORALE]: '📢'
        };
        return `<span class="keyword-icon" title="${keyword}">${icons[keyword] || '❓'}</span>`;
    }

    /**

         * 渲染手牌

         */

        renderHand() {

            const state = this.getCurrentGameState();

    

            console.log('渲染手牌，游戏模式:', this.gameMode);

    

            if (!state) {

                console.warn('游戏状态为空，无法渲染手牌');

                return;

            }

    

            if (!state.players) {

                console.warn('玩家信息为空');

                return;

            }

    

            const player = state.players[state.currentPlayer];

    

            if (!player) {

                console.warn('当前玩家信息为空');

                return;

            }

    

            if (!player.hand) {

                console.warn('手牌为空');

                player.hand = [];

            }

    

            console.log('当前玩家:', state.currentPlayer, '手牌数量:', player.hand.length);

    

            const handDiv = document.getElementById('player-hand');

    

            handDiv.innerHTML = '';

    

            if (player.hand.length === 0) {

                handDiv.innerHTML = '<p style="color: #aaa; text-align: center; padding: 20px;">无手牌</p>';

                return;

            }

    

            player.hand.forEach((card, index) => {

                console.log('渲染卡牌:', card);

                const gameMode = this.getGameMode();

                const playable = player.cp >= card.cost;

                const selected = state.selectedCard === index;

                const cardEl = this.createCardElement(card, playable, selected);

    

                cardEl.onclick = () => {

                    if (gameMode === 'local') {

                        // 本地模式：直接调用游戏逻辑

                        const result = game.selectCardForDeploy(index);

                        if (result.success) {

                            this.showMessage(result.message);

                            this.renderGame();

                        } else {

                            this.showMessage(result.message, 'error');

                        }

                    } else {

                        // 联机模式：发送选择卡牌请求到服务器

                        networkClient.sendSelectCard(index);

                    }

                };

    

                handDiv.appendChild(cardEl);

            });

        }

    /**
     * 创建卡牌元素
     * @param {Object} card - 卡牌对象
     * @param {boolean} playable - 是否可使用
     * @param {boolean} selected - 是否选中
     * @returns {HTMLElement} 卡牌元素
     */
    createCardElement(card, playable, selected) {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';
        if (selected) cardEl.classList.add('selected');
        if (!playable) cardEl.style.opacity = '0.6';
        if (playable) cardEl.classList.add('card-playable');

        // 阵营颜色
        const faction = factionSystem.getFaction(card.faction);
        if (card.faction !== 'neutral') {
            cardEl.style.borderColor = faction.color;
        }

        cardEl.innerHTML = `
            <div class="card-cost">${card.cost}</div>
            <div class="card-icon">${card.icon}</div>
            <div class="card-name">${card.name}</div>
            <div class="card-type">${this.getCardTypeName(card.type)}</div>
            ${card.type === CARD_TYPES.UNIT ? `
                <div class="card-stats">
                    <span class="card-stat card-hp">❤️${card.hp}</span>
                    <span class="card-stat card-armor">🛡️${card.armor || 0}</span>
                    <span class="card-stat card-attack">⚔️${card.attack}</span>
                </div>
            ` : ''}
            <div class="card-ability">${card.ability || ''}</div>
            ${card.faction !== 'neutral' ? `<div class="card-faction">${faction.emoji}</div>` : ''}
        `;

        return cardEl;
    }

    /**
     * 获取卡牌类型名称
     * @param {string} type - 卡牌类型
     * @returns {string} 类型名称
     */
    getCardTypeName(type) {
        const names = {
            [CARD_TYPES.UNIT]: '单位',
            [CARD_TYPES.ORDER]: '指令',
            [CARD_TYPES.REINFORCEMENT]: '增援',
            [CARD_TYPES.SUPPRESSION]: '压制',
            [CARD_TYPES.SUPPORT]: '支援',
            [CARD_TYPES.COUNTER]: '反击'
        };
        return names[type] || type;
    }

    /**
     * 更新前线状态
     */
    updateFrontlineStatus() {
        const state = this.getCurrentGameState();
        if (!state) return;
        const statusEl = document.getElementById('frontline-status');
        const frontlineEl = document.getElementById('frontline');

        frontlineEl.className = 'frontline';

        if (state.frontlineController === 1) {
            statusEl.textContent = '玩家1 控制';
            frontlineEl.classList.add('player1-controlled');
        } else if (state.frontlineController === 2) {
            statusEl.textContent = '玩家2 控制';
            frontlineEl.classList.add('player2-controlled');
        } else {
            statusEl.textContent = '中立区域';
        }
    }

    /**
     * 更新控制按钮
     */
    updateControlButtons() {
        const state = this.getCurrentGameState();
        if (!state) return;
        const unit = state.selectedUnit;

        document.getElementById('deploy-btn').disabled = state.actionMode !== ACTION_MODES.DEPLOY;
        document.getElementById('move-btn').disabled = !unit || !keywordSystem.canMove(unit);
        document.getElementById('attack-btn').disabled = !unit || !keywordSystem.canAttack(unit);
        document.getElementById('wait-btn').disabled = !unit;
    }

    /**
     * 渲染游戏日志
     */
    renderGameLog() {
        const state = this.getCurrentGameState();
        if (!state) return;
        const logDiv = document.getElementById('game-log');

        logDiv.innerHTML = '';
        state.eventLog.slice(-10).reverse().forEach(log => {
            const p = document.createElement('p');
            p.textContent = `[${log.turn}] ${log.message}`;
            logDiv.appendChild(p);
        });
    }

    /**
     * 处理槽位点击
     * @param {string} area - 区域
     * @param {number} playerNum - 玩家编号
     * @param {number} index - 索引
     */
    handleSlotClick(area, playerNum, index) {
        const state = this.getCurrentGameState();
        if (!state) return;

        const gameMode = this.getGameMode();
        const current = state.currentPlayer;

        // 如果是联机模式且不是当前玩家的回合，不允许操作
        if (gameMode === 'online' && networkClient.playerId && networkClient.playerId !== current) {
            this.showMessage('等待对手回合', 'info');
            return;
        }

        // 部署单位
        if (state.actionMode === ACTION_MODES.DEPLOY && area === 'support' && playerNum === current) {
            if (gameMode === 'local') {
                // 本地模式：直接调用游戏逻辑
                const result = game.deployUnit(index);
                this.showMessage(result.message, result.success ? 'success' : 'error');
                this.renderGame();
            } else {
                // 联机模式：发送部署请求到服务器
                networkClient.sendDeployUnit(index);
            }
            return;
        }

        // 攻击目标
        if (state.actionMode === ACTION_MODES.ATTACK) {
            let isEnemy = false;

            if (area === 'support') {
                isEnemy = playerNum !== current;
            } else if (area === 'frontline') {
                const enemyNum = current === 1 ? 2 : 1;
                const enemyUnit = state.players[enemyNum].frontline[index];
                isEnemy = enemyUnit !== null;
            }

            if (isEnemy) {
                if (gameMode === 'local') {
                    // 本地模式：直接调用游戏逻辑
                    const result = game.attackTarget(area, index);
                    this.showMessage(result.message, result.success ? 'success' : 'error');
                    this.renderGame();
                } else {
                    // 联机模式：发送攻击请求到服务器
                    networkClient.sendAttack(area, index);
                }
                return;
            }
        }

        // 移动目标
        if (state.actionMode === ACTION_MODES.MOVE && area === 'frontline') {
            if (gameMode === 'local') {
                // 本地模式：直接调用游戏逻辑
                const result = game.moveUnit(index);
                this.showMessage(result.message, result.success ? 'success' : 'error');
                this.renderGame();
            } else {
                // 联机模式：发送移动请求到服务器
                networkClient.sendMove(index);
            }
            return;
        }

        // 选择单位
        if (state.selectedCard === null) {
            if (area === 'support' && playerNum === current) {
                if (gameMode === 'local') {
                    // 本地模式：直接调用游戏逻辑
                    const result = game.selectUnit(area, index);
                    this.showMessage(result.message, result.success ? 'success' : 'error');
                    this.renderGame();
                } else {
                    // 联机模式：发送选择请求到服务器
                    networkClient.sendSelectUnit(area, index);
                }
            } else if (area === 'frontline') {
                const playerUnit = state.players[current].frontline[index];
                if (playerUnit !== null) {
                    if (gameMode === 'local') {
                        // 本地模式：直接调用游戏逻辑
                        const result = game.selectUnit(area, index);
                        this.showMessage(result.message, result.success ? 'success' : 'error');
                        this.renderGame();
                    } else {
                        // 联机模式：发送选择请求到服务器
                        networkClient.sendSelectUnit(area, index);
                    }
                }
            }
        }
    }

    /**
     * 显示消息
     * @param {string} message - 消息内容
     * @param {string} type - 消息类型
     */
    showMessage(message, type = 'info') {
        // 创建消息元素
        const messageEl = document.createElement('div');
        messageEl.className = `game-message ${type}`;
        messageEl.textContent = message;

        // 添加到页面
        document.body.appendChild(messageEl);

        // 3秒后移除
        setTimeout(() => {
            messageEl.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(messageEl);
            }, 300);
        }, 3000);
    }

    /**
     * 显示卡牌详情
     * @param {Object} card - 卡牌对象
     */
    showCardDetail(card) {
        const modal = document.getElementById('card-detail-modal');
        const content = document.getElementById('card-detail-content');

        const faction = factionSystem.getFaction(card.faction);

        content.innerHTML = `
            <div class="card-detail">
                <div class="detail-header">
                    <span class="detail-faction">${faction.emoji} ${faction.name}</span>
                    <span class="detail-cost">${card.cost}</span>
                </div>
                <div class="detail-icon">${card.icon}</div>
                <div class="detail-name">${card.name}</div>
                <div class="detail-type">${this.getCardTypeName(card.type)}</div>
                <div class="detail-ability">${card.ability || '无特殊能力'}</div>
                ${card.type === CARD_TYPES.UNIT ? `
                    <div class="detail-stats">
                        <span>❤️ ${card.hp}</span>
                        <span>🛡️ ${card.armor || 0}</span>
                        <span>⚔️ ${card.attack}</span>
                    </div>
                ` : ''}
                ${card.keywords && card.keywords.length > 0 ? `
                    <div class="detail-keywords">
                        <strong>关键字:</strong>
                        ${card.keywords.map(k => this.getKeywordName(k)).join(', ')}
                    </div>
                ` : ''}
                ${card.effects && card.effects.length > 0 ? `
                    <div class="detail-effects">
                        <strong>效果:</strong>
                        <ul>
                            ${card.effects.map(e => `<li>${this.getEffectDescription(e)}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;

        modal.classList.remove('hidden');
    }

    /**
     * 获取关键字名称
     * @param {string} keyword - 关键字
     * @returns {string} 名称
     */
    getKeywordName(keyword) {
        const names = {
            [KEYWORDS.BLITZ]: '突击',
            [KEYWORDS.ANTI_TANK]: '反坦克',
            [KEYWORDS.ANTI_AIR]: '对空',
            [KEYWORDS.ARMOR]: '装甲',
            [KEYWORDS.SUPPORT]: '支援',
            [KEYWORDS.SMOKE]: '烟雾',
            [KEYWORDS.STEALTH]: '潜行',
            [KEYWORDS.FIRST_STRIKE]: '先攻',
            [KEYWORDS.BOMBARDMENT]: '轰炸',
            [KEYWORDS.RUSH]: '冲锋',
            [KEYWORDS.HOLD]: '坚守',
            [KEYWORDS.RELAY]: '接力',
            [KEYWORDS.MORALE]: '士气'
        };
        return names[keyword] || keyword;
    }

    /**
     * 获取效果描述
     * @param {Object} effect - 效果对象
     * @returns {string} 描述
     */
    getEffectDescription(effect) {
        // 简化版本，实际应该根据效果类型生成详细描述
        return effect.description || `${effect.type}`;
    }

    /**
     * 隐藏卡牌详情
     */
    hideCardDetail() {
        const modal = document.getElementById('card-detail-modal');
        modal.classList.add('hidden');
    }

    /**
     * 渲染牌组选择器
     */
    renderDeckSelector() {
        this.showScreen('deck-selector');
        this.renderSavedDecksList();
    }

    /**
     * 渲染卡牌图鉴
     */
    renderCardGallery() {
        this.showScreen('card-gallery');
        this.updateGalleryStats();
        this.filterGalleryCards();
    }

    /**
     * 更新图鉴统计信息
     */
    updateGalleryStats() {
        const allCards = getAllCards();
        document.getElementById('total-cards').textContent = allCards.length;
        document.getElementById('total-cards-stat').textContent = allCards.length;

        // 这里可以添加已解锁卡牌的逻辑
        // 目前假设所有卡牌都已解锁
        document.getElementById('unlocked-cards').textContent = allCards.length;
    }

    /**
     * 过滤图鉴卡牌
     */
    filterGalleryCards() {
        const factionFilter = document.getElementById('gallery-faction-filter').value;
        const typeFilter = document.getElementById('gallery-type-filter').value;
        const costFilter = document.getElementById('gallery-cost-filter').value;
        const rarityFilter = document.getElementById('gallery-rarity-filter').value;

        let cards = getAllCards();

        // 按阵营过滤
        if (factionFilter !== 'all') {
            cards = cards.filter(card => card.faction === factionFilter);
        }

        // 按类型过滤
        if (typeFilter !== 'all') {
            cards = cards.filter(card => card.type === typeFilter);
        }

        // 按费用过滤
        if (costFilter !== 'all') {
            if (costFilter === '8+') {
                cards = cards.filter(card => card.cost >= 8);
            } else {
                cards = cards.filter(card => card.cost === parseInt(costFilter));
            }
        }

        // 按稀有度过滤
        if (rarityFilter !== 'all') {
            cards = cards.filter(card => card.rarity === rarityFilter);
        }

        // 按阵营排序
        cards.sort((a, b) => {
            const factionOrder = ['germany', 'usa', 'britain', 'soviet', 'japan', 'neutral'];
            const factionA = factionOrder.indexOf(a.faction);
            const factionB = factionOrder.indexOf(b.faction);
            if (factionA !== factionB) return factionA - factionB;
            return a.cost - b.cost;
        });

        this.renderGalleryGrid(cards);
    }

    /**
     * 渲染图鉴网格
     * @param {Array} cards - 卡牌数组
     */
    renderGalleryGrid(cards) {
        const grid = document.getElementById('gallery-grid');
        grid.innerHTML = '';

        if (cards.length === 0) {
            grid.innerHTML = '<p style="color: #aaa; text-align: center; padding: 40px; grid-column: 1/-1;">没有找到符合条件的卡牌</p>';
            return;
        }

        cards.forEach(card => {
            const cardEl = this.createCardElement(card, true, false);
            cardEl.classList.add('gallery-card');

            // 添加稀有度样式
            if (card.rarity) {
                cardEl.classList.add(`rarity-${card.rarity}`);
            }

            cardEl.onclick = () => {
                this.showCardDetail(card);
            };

            grid.appendChild(cardEl);
        });
    }

    /**
     * 渲染设置界面
     */
    renderSettings() {
        this.showScreen('settings');
    }

    /**
     * 渲染联机对战界面
     */
    renderMultiplayer() {
        this.showScreen('multiplayer');
        this.updateConnectionStatus(networkClient.isConnected());
    }

    /**
     * 更新连接状态
     * @param {boolean} connected - 是否已连接
     */
    updateConnectionStatus(connected) {
        const statusDiv = document.getElementById('connection-status');
        const indicator = statusDiv.querySelector('.status-indicator');
        const text = statusDiv.querySelector('.status-text');
        const btnConnect = document.getElementById('btn-connect');

        if (connected) {
            indicator.className = 'status-indicator online';
            text.textContent = '已连接';
            btnConnect.style.display = 'none';
        } else {
            indicator.className = 'status-indicator offline';
            text.textContent = '未连接';
            btnConnect.style.display = 'inline-block';
        }
    }

    /**
     * 显示房间信息
     * @param {Object} data - 房间数据
     */
    showRoomInfo(data) {
        document.getElementById('multiplayer-options').style.display = 'none';
        document.getElementById('rooms-section').style.display = 'none';
        document.getElementById('room-info').style.display = 'block';
        document.getElementById('room-id-display').textContent = data.roomId;
        this.updateRoomInfo(data);
    }

    /**
     * 隐藏房间信息
     */
    hideRoomInfo() {
        document.getElementById('multiplayer-options').style.display = 'block';
        document.getElementById('rooms-section').style.display = networkClient.isConnected() ? 'block' : 'none';
        document.getElementById('room-info').style.display = 'none';
    }

    /**
     * 更新房间信息
     * @param {Object} data - 房间数据
     */
    updateRoomInfo(data) {
        const playersList = document.getElementById('room-players-list');
        playersList.innerHTML = '';

        if (data.players && data.players.length > 0) {
            data.players.forEach(player => {
                const playerDiv = document.createElement('div');
                playerDiv.className = 'player-item';
                playerDiv.innerHTML = `
                    <span class="player-name">${player.name}</span>
                    <span class="player-status ${player.ready ? 'ready' : 'not-ready'}">
                        ${player.ready ? '✓ 已准备' : '○ 未准备'}
                    </span>
                `;
                playersList.appendChild(playerDiv);
            });
        } else {
            playersList.innerHTML = '<p style="color: #aaa;">等待玩家加入...</p>';
        }

        // 检查是否可以准备
        const savedDecks = deckBuilder.loadAllDecks();
        const btnReady = document.getElementById('btn-ready');
        const canReady = savedDecks.length > 0 && networkClient.getPlayerNumber();
        btnReady.disabled = !canReady;
    }

    /**
     * 添加聊天消息
     * @param {Object} data - 聊天数据
     */
    addChatMessage(data) {
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message';

        const isMe = data.playerNumber === networkClient.getPlayerNumber();
        messageDiv.classList.add(isMe ? 'my-message' : 'other-message');

        messageDiv.innerHTML = `
            <span class="chat-player-name">${data.playerName}:</span>
            <span class="chat-message-text">${data.message}</span>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    /**
     * 设置游戏模式
     * @param {string} mode - 游戏模式 ('local' 或 'online')
     */
    setGameMode(mode) {
        this.gameMode = mode;
        console.log('游戏模式设置为:', mode);
    }

    /**
     * 获取游戏模式
     * @returns {string} 游戏模式
     */
    getGameMode() {
        return this.gameMode;
    }

    /**
     * 更新游戏状态（联机模式专用）
     * @param {Object} gameState - 服务器发送的游戏状态
     */
    updateGameState(gameState) {
        console.log('更新游戏状态:', gameState);
        if (this.gameMode !== 'online') {
            console.warn('非联机模式下不能更新游戏状态');
            return;
        }

        // 联机模式下，直接使用服务器发送的状态
        // 这里不需要修改game对象，只需要重新渲染界面
        // 但我们需要一个临时变量来存储服务器状态
        this.onlineGameState = gameState;

        // 重新渲染游戏界面
        this.renderGame();
    }

    /**
     * 渲染已保存的牌组列表
     */
    renderSavedDecksList() {
        const decksList = document.getElementById('saved-decks-list');
        if (!decksList) return;

        const savedDecks = deckBuilder.loadAllDecks();
        
        decksList.innerHTML = '';

        if (savedDecks.length === 0) {
            decksList.innerHTML = '<p style="color: #aaa; text-align: center; padding: 20px;">暂无保存的牌组</p>';
            return;
        }

        savedDecks.forEach((deck, index) => {
            const deckEl = document.createElement('div');
            deckEl.className = 'saved-deck-item';
            
            const faction = factionSystem.getFaction(deck.mainFaction || deck.faction);
            
            deckEl.innerHTML = `
                <div class="deck-info">
                    <div class="deck-name">${deck.name}</div>
                    <div class="deck-faction">${faction.emoji} ${faction.name}</div>
                    <div class="deck-stats">
                        <span>📊 ${deck.cardIds.length}张卡牌</span>
                        <span>💰 平均费用: ${(parseFloat(deck.stats?.averageCost) || 0).toFixed(1)}</span>
                    </div>
                </div>
                <div class="deck-actions">
                    <button class="deck-action-btn select-deck" data-index="${index}">✓ 选择</button>
                    <button class="deck-action-btn edit-deck" data-index="${index}">✎️ 编辑</button>
                    <button class="deck-action-btn delete-deck" data-index="${index}">🗑️ 删除</button>
                </div>
            `;

            decksList.appendChild(deckEl);
        });

        // 添加事件监听
        decksList.querySelectorAll('.select-deck').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                const deck = savedDecks[index];
                deckSelector.selectDeck(deck);
                
                if (deckSelector.getMode() === 'multiplayer') {
                    // 联机模式：返回房间界面
                    deckSelector.setMode('normal');
                    ui.renderMultiplayer();
                    ui.showMessage(`已选择牌组: ${deck.name}`, 'success');
                } else {
                    // 本地模式：返回主菜单
                    deckSelector.setMode('normal');
                    ui.renderMainMenu();
                }
            });
        });

        decksList.querySelectorAll('.edit-deck').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                const deck = savedDecks[index];
                deckBuilder.loadDeck(deck, getAllCards());
                ui.renderDeckBuilder();
            });
        });

        decksList.querySelectorAll('.delete-deck').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (confirm('确定要删除这个牌组吗？')) {
                    const index = parseInt(e.target.dataset.index);
                    const deck = savedDecks[index];
                    deckBuilder.deleteSavedDeck(deck.name);
                    this.renderSavedDecksList();
                    ui.showMessage('牌组已删除', 'info');
                }
            });
        });
    }

    /**
     * 渲染成就界面
     */
    renderAchievements() {
        this.showScreen('achievements');
        
        // 更新统计信息
        const allAchievements = achievementSystem.getAllAchievements();
        const unlocked = achievementSystem.getUnlockedAchievements();
        
        document.getElementById('total-achievements').textContent = allAchievements.length;
        document.getElementById('unlocked-count').textContent = unlocked.length;
        document.getElementById('unlock-rate').textContent = 
            ((unlocked.length / allAchievements.length) * 100).toFixed(1) + '%';
        document.getElementById('gold-amount').textContent = achievementSystem.getGold();
        
        // 更新游戏统计（从成就进度中获取）
        const gamesPlayed = achievementSystem.currentProgress['veteran'] || 
                             achievementSystem.currentProgress['first_blood'] || 0;
        const gamesWon = achievementSystem.currentProgress['champion'] || 
                        achievementSystem.currentProgress['first_victory'] || 0;
        
        document.getElementById('total-games').textContent = gamesPlayed;
        document.getElementById('total-wins').textContent = gamesWon;
        document.getElementById('win-rate').textContent = 
            gamesPlayed > 0 ? ((gamesWon / gamesPlayed) * 100).toFixed(1) + '%' : '0%';
        
        // 渲染成就列表
        this.renderAchievementsList('all');
    }

    /**
     * 渲染成就列表
     * @param {string} filter - 筛选条件
     */
    renderAchievementsList(filter) {
        const achievementsList = document.getElementById('achievements-list');
        achievementsList.innerHTML = '';
        
        let achievements = achievementSystem.getAllAchievements();
        
        // 应用筛选
        switch (filter) {
            case 'unlocked':
                achievements = achievements.filter(a => a.progress.isUnlocked);
                break;
            case 'locked':
                achievements = achievements.filter(a => !a.progress.isUnlocked);
                break;
            case 'common':
            case 'rare':
            case 'epic':
            case 'legendary':
                achievements = achievements.filter(a => a.rarity === filter);
                break;
        }
        
        achievements.forEach(achievement => {
            const progress = achievement.progress;
            const isUnlocked = progress.isUnlocked;
            
            const achievementEl = document.createElement('div');
            achievementEl.className = `achievement-item ${isUnlocked ? 'unlocked' : 'locked'} rarity-${achievement.rarity}`;
            
            achievementEl.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <h4 class="achievement-name">${achievement.name}</h4>
                    <p class="achievement-description">${achievement.description}</p>
                    <div class="achievement-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress.percentage}%"></div>
                        </div>
                        <span class="progress-text">${progress.current}/${progress.target}</span>
                    </div>
                    <p class="achievement-reward">奖励: ${achievement.reward}</p>
                </div>
            `;
            
            achievementsList.appendChild(achievementEl);
        });
    }

    /**
     * 显示成就解锁通知
     * @param {Object} achievement - 成就对象
     */
    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-popup">
                <div class="achievement-popup-icon">${achievement.icon}</div>
                <div class="achievement-popup-content">
                    <h4>🏆 成就解锁！</h4>
                    <p>${achievement.name}</p>
                    <p class="reward">${achievement.reward}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // 5秒后移除通知
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 5000);
    }

    /**
     * 渲染卡背定制界面
     */
    renderCardBack() {
        this.showScreen('cardback');
        this.renderCurrentBack();
        this.renderCardBackGrid();
    }

    /**
     * 渲染当前卡背
     */
    renderCurrentBack() {
        const currentBack = cardBackSystem.getCurrentBack();
        const display = document.getElementById('cardback-display');
        const info = document.getElementById('current-back-info');

        if (display) {
            display.style.cssText = cardBackSystem.getCardBackCSS(currentBack.id);
            display.innerHTML = `<div class="cardback-icon">${currentBack.icon}</div>`;
        }

        if (info) {
            info.innerHTML = `
                <h4>${currentBack.name}</h4>
                <p>${currentBack.description}</p>
                <p class="rarity ${currentBack.rarity}">${this.getRarityText(currentBack.rarity)}</p>
            `;
        }
    }

    /**
     * 渲染卡背网格
     */
    renderCardBackGrid(filter = 'all') {
        const grid = document.getElementById('cardback-grid');
        if (!grid) return;

        let themes = cardBackSystem.getAllThemes();

        // 筛选卡背
        if (filter !== 'all') {
            themes = themes.filter(theme => theme.type === filter);
        }

        grid.innerHTML = '';

        themes.forEach(theme => {
            const isUnlocked = cardBackSystem.isThemeUnlocked(theme.id);
            const isSelected = cardBackSystem.currentBack === theme.id;

            const cardbackEl = document.createElement('div');
            cardbackEl.className = `cardback-item ${isUnlocked ? '' : 'locked'} ${isSelected ? 'selected' : ''} ${theme.rarity}`;
            cardbackEl.dataset.themeId = theme.id;

            const preview = document.createElement('div');
            preview.className = 'cardback-preview-small';
            preview.style.cssText = cardBackSystem.getCardBackCSS(theme.id);
            preview.innerHTML = `<div class="cardback-icon-small">${theme.icon}</div>`;

            const info = document.createElement('div');
            info.className = 'cardback-info-small';
            info.innerHTML = `
                <h4>${theme.name}</h4>
                <p>${theme.description}</p>
                ${!isUnlocked ? '<p class="locked-text">🔒 未解锁</p>' : ''}
            `;

            cardbackEl.appendChild(preview);
            cardbackEl.appendChild(info);

            if (isUnlocked) {
                cardbackEl.addEventListener('click', () => {
                    cardBackSystem.setCurrentBack(theme.id);
                    this.renderCurrentBack();
                    this.renderCardBackGrid(filter);
                });
            }

            grid.appendChild(cardbackEl);
        });
    }

    /**
     * 获取稀有度文本
     * @param {string} rarity - 稀有度
     * @returns {string} 稀有度文本
     */
    getRarityText(rarity) {
        const rarityTexts = {
            'common': '普通',
            'rare': '稀有',
            'epic': '史诗',
            'legendary': '传说',
            'custom': '自定义'
        };
        return rarityTexts[rarity] || rarity;
    }

    /**
     * 获取当前游戏状态
     * @returns {Object} 游戏状态
     */
    getCurrentGameState() {
        console.log('获取游戏状态，模式:', this.gameMode);
        
        if (this.gameMode === 'local') {
            // 本地模式：使用本地游戏对象
            const state = game.getState();
            console.log('本地游戏状态:', state);
            return state;
        } else {
            // 联机模式：使用服务器发送的状态
            console.log('联机游戏状态:', this.onlineGameState);
            return this.onlineGameState;
        }
    }
}

// 创建全局实例
const ui = new UI();

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UI;
}