/**
 * 游戏主逻辑
 * 处理游戏核心流程和状态管理
 */

class Game {
    constructor() {
        this.state = null;
        this.initialized = false;
    }

    /**
     * 初始化游戏
     * @param {Object} player1Deck - 玩家1的牌组
     * @param {Object} player2Deck - 玩家2的牌组
     * @returns {Object} 初始游戏状态
     */
    initGame(player1Deck, player2Deck) {
        this.state = {
            currentPlayer: 1,
            turn: 1,
            phase: 'draw', // draw, deploy, action, end
            gameOver: false,
            winner: null,
            players: {
                1: {
                    faction: player1Deck.faction,
                    cp: GAME_RULES.START_CP,
                    maxCP: GAME_RULES.START_CP,
                    hqHP: GAME_RULES.HQ_START_HP,
                    deck: this.shuffleDeck(player1Deck.cards),
                    hand: [],
                    supportLine: [null, null, null, null],
                    frontline: [null, null, null, null]
                },
                2: {
                    faction: player2Deck.faction,
                    cp: GAME_RULES.START_CP,
                    maxCP: GAME_RULES.START_CP,
                    hqHP: GAME_RULES.HQ_START_HP,
                    deck: this.shuffleDeck(player2Deck.cards),
                    hand: [],
                    supportLine: [null, null, null, null],
                    frontline: [null, null, null, null]
                }
            },
            frontlineController: 0,
            selectedCard: null,
            selectedUnit: null,
            selectedUnitPosition: null,
            actionMode: ACTION_MODES.IDLE,
            eventLog: []
        };

        // 初始抽牌
        this.drawInitialCards(1);
        this.drawInitialCards(2);

        this.initialized = true;
        this.logMessage('游戏开始！玩家1先手');

        return this.state;
    }

    /**
     * 洗牌
     * @param {Array} deck - 牌组
     * @returns {Array} 洗牌后的牌组
     */
    shuffleDeck(deck) {
        const shuffled = [...deck];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * 初始抽牌
     * @param {number} playerNum - 玩家编号
     */
    drawInitialCards(playerNum) {
        const player = this.state.players[playerNum];
        for (let i = 0; i < GAME_RULES.START_HAND_SIZE; i++) {
            if (player.deck.length > 0) {
                player.hand.push(player.deck.shift());
            }
        }
    }

    /**
     * 开始回合
     */
    startTurn() {
        const current = this.state.currentPlayer;
        const player = this.state.players[current];

        // 增加回合数（每次切换玩家时增加）
        this.state.turn++;
        
        // 增加指挥点
        player.maxCP = Math.min(GAME_RULES.MAX_CP, Math.ceil(this.state.turn / 2));
        player.cp = player.maxCP;

        // 抽牌
        if (player.deck.length > 0 && player.hand.length < GAME_RULES.HAND_SIZE) {
            player.hand.push(player.deck.shift());
        }

        // 重置单位状态
        this.resetUnitStates(current);

        // 处理状态效果
        effectSystem.processTurnEndEffects(this.state);

        this.state.phase = 'deploy';
        this.logMessage(`回合 ${this.state.turn} - 玩家${current} 的回合`);

        // 触发回合开始事件
        effectSystem.emit(EVENT_TYPES.ON_TURN_START, {
            player: current,
            gameState: this.state
        }, this.state);
    }

    /**
     * 重置单位状态
     * @param {number} playerNum - 玩家编号
     */
    resetUnitStates(playerNum) {
        const player = this.state.players[playerNum];

        [...player.supportLine, ...player.frontline].forEach(unit => {
            if (unit) {
                unit.movesLeft = unit.movesPerTurn || 1;
                unit.attacksLeft = unit.attacksPerTurn || 1;
                unit.hasMoved = false;
                unit.hasAttacked = false;

                // 激励状态 - 可以额外行动
                if (unit.statuses && unit.statuses.find(s => s.type === STATUS_TYPES.INSPIRED)) {
                    unit.movesLeft++;
                    unit.attacksLeft++;
                }
            }
        });
    }

    /**
     * 结束回合
     */
    endTurn() {
        const current = this.state.currentPlayer;
        const next = current === 1 ? 2 : 1;

        // 清除行动模式
        this.clearActionMode();

        // 切换玩家
        this.state.currentPlayer = next;

        // 开始新回合
        this.startTurn();
    }

    /**
     * 选择卡牌进行部署
     * @param {number} cardIndex - 卡牌索引
     * @returns {Object} 选择结果
     */
    selectCardForDeploy(cardIndex) {
        const result = {
            success: false,
            message: ''
        };

        if (this.state.gameOver) {
            result.message = '游戏已结束';
            return result;
        }

        const player = this.state.players[this.state.currentPlayer];
        const card = player.hand[cardIndex];

        if (!card) {
            result.message = '无效的卡牌';
            return result;
        }

        if (player.cp < card.cost) {
            result.message = `指挥点不足！需要 ${card.cost} 点`;
            return result;
        }

        // 指令卡牌立即执行
        if (card.type === CARD_TYPES.ORDER) {
            return this.executeOrderCard(card);
        }

        // 其他卡牌选择部署位置
        this.state.selectedCard = cardIndex;
        this.state.actionMode = ACTION_MODES.DEPLOY;
        this.state.selectedUnit = null;
        this.state.selectedUnitPosition = null;

        result.success = true;
        result.message = `选择位置部署 ${card.name}`;

        return result;
    }

    /**
     * 部署单位
     * @param {number} slotIndex - 槽位索引
     * @returns {Object} 部署结果
     */
    deployUnit(slotIndex) {
        const result = {
            success: false,
            message: ''
        };

        if (this.state.actionMode !== ACTION_MODES.DEPLOY) {
            result.message = '不在部署模式';
            return result;
        }

        const player = this.state.players[this.state.currentPlayer];
        const cardIndex = this.state.selectedCard;
        const card = player.hand[cardIndex];

        if (!card) {
            result.message = '未选择卡牌';
            return result;
        }

        // 检查槽位是否为空
        if (player.supportLine[slotIndex] !== null) {
            result.message = '该位置已有单位！';
            return result;
        }

        // 检查是否是单位卡
        if (card.type !== CARD_TYPES.UNIT && card.type !== CARD_TYPES.REINFORCEMENT) {
            result.message = '只能部署单位卡';
            return result;
        }

        // 检查阵营是否匹配（可选，因为牌组构建时已经验证过）
        if (card.faction !== 'neutral' && card.faction !== player.faction) {
            result.message = `该卡牌属于${card.faction}阵营，你的阵营是${player.faction}`;
            return result;
        }

        // 创建单位实例
        const unit = this.createUnitInstance(card);

        // 应用阵营加成
        const bonusUnit = factionSystem.applyFactionBonus(unit, player.faction);

        // 部署单位
        player.supportLine[slotIndex] = bonusUnit;
        player.cp -= card.cost;
        player.hand.splice(cardIndex, 1);

        // 触发部署事件
        effectSystem.emit(EVENT_TYPES.ON_DEPLOY, {
            unit: bonusUnit,
            position: { area: 'support', index: slotIndex },
            gameState: this.state
        }, this.state);

        // 冲锋关键字 - 可以立即行动
        if (keywordSystem.canActImmediately(bonusUnit)) {
            // 不重置行动状态，可以立即行动
        } else {
            bonusUnit.hasMoved = true;
            bonusUnit.hasAttacked = true;
        }

        this.clearActionMode();
        result.success = true;
        result.message = `${bonusUnit.name} 已部署到支援战线 ${slotIndex + 1} 号位置`;

        return result;
    }

    /**
     * 创建单位实例
     * @param {Object} card - 卡牌对象
     * @returns {Object} 单位实例
     */
    createUnitInstance(card) {
        return {
            ...card,
            currentHP: card.hp || 1,
            movesLeft: card.movesPerTurn || 1,
            attacksLeft: card.attacksPerTurn || 1,
            hasMoved: false,
            hasAttacked: false,
            hasWaited: false,
            statuses: [],
            keywords: card.keywords || []
        };
    }

    /**
     * 选择单位
     * @param {string} area - 区域 (support 或 frontline)
     * @param {number} index - 索引
     * @returns {Object} 选择结果
     */
    selectUnit(area, index) {
        const result = {
            success: false,
            message: ''
        };

        if (this.state.gameOver) {
            result.message = '游戏已结束';
            return result;
        }

        const player = this.state.players[this.state.currentPlayer];
        let unit = null;

        if (area === 'support') {
            unit = player.supportLine[index];
        } else if (area === 'frontline') {
            unit = player.frontline[index];
        }

        if (!unit) {
            result.message = '该位置没有单位';
            return result;
        }

        if (unit.hasWaited) {
            result.message = '该单位已待命，无法行动';
            return result;
        }

        // 检查是否可以行动
        if (!keywordSystem.canAttack(unit) && !keywordSystem.canMove(unit)) {
            result.message = '该单位无法行动';
            return result;
        }

        this.state.selectedUnit = unit;
        this.state.selectedUnitPosition = { area, index };
        this.state.selectedCard = null;

        result.success = true;
        result.message = `已选择 ${unit.name}`;

        return result;
    }

    /**
     * 移动单位
     * @param {number} targetIndex - 目标索引
     * @returns {Object} 移动结果
     */
    moveUnit(targetIndex) {
        const result = {
            success: false,
            message: ''
        };

        if (this.state.actionMode !== ACTION_MODES.MOVE) {
            result.message = '不在移动模式';
            return result;
        }

        const unit = this.state.selectedUnit;
        const currentPos = this.state.selectedUnitPosition;
        const player = this.state.players[this.state.currentPlayer];

        if (!keywordSystem.canMove(unit)) {
            result.message = `${unit.name} 无法移动`;
            return result;
        }

        // 检查目标位置
        if (currentPos.area === 'support') {
            // 从支援战线移到前线
            if (player.frontline[targetIndex] !== null) {
                result.message = '目标位置已有单位！';
                return result;
            }

            // 检查战线是否被对方占领
            const enemyNum = this.state.currentPlayer === 1 ? 2 : 1;
            if (this.state.frontlineController === enemyNum) {
                result.message = '前线已被敌方占领！必须先消灭所有敌方单位才能占领';
                return result;
            }

            // 移动单位
            player.supportLine[currentPos.index] = null;
            player.frontline[targetIndex] = unit;
        } else if (currentPos.area === 'frontline') {
            // 在前线内移动
            if (player.frontline[targetIndex] !== null) {
                result.message = '目标位置已有单位！';
                return result;
            }

            // 移动单位
            player.frontline[currentPos.index] = null;
            player.frontline[targetIndex] = unit;
        }

        // 更新单位状态
        unit.movesLeft--;
        unit.hasMoved = true;

        // 更新战线控制
        this.updateFrontlineControl();

        // 触发位置变化事件
        effectSystem.emit(EVENT_TYPES.ON_POSITION_CHANGE, {
            unit,
            oldPosition: currentPos,
            newPosition: { area: 'frontline', index: targetIndex },
            gameState: this.state
        }, this.state);

        this.clearActionMode();
        result.success = true;
        result.message = `${unit.name} 移动到前线 ${targetIndex + 1} 号位置`;

        return result;
    }

    /**
     * 攻击目标
     * @param {string} targetArea - 目标区域
     * @param {number} targetIndex - 目标索引
     * @returns {Object} 攻击结果
     */
    attackTarget(targetArea, targetIndex) {
        const result = {
            success: false,
            message: ''
        };

        if (this.state.actionMode !== ACTION_MODES.ATTACK) {
            result.message = '不在攻击模式';
            return result;
        }

        const attacker = this.state.selectedUnit;
        const currentPos = this.state.selectedUnitPosition;
        const player = this.state.players[this.state.currentPlayer];
        const enemyNum = this.state.currentPlayer === 1 ? 2 : 1;
        const enemy = this.state.players[enemyNum];

        if (!keywordSystem.canAttack(attacker)) {
            result.message = `${attacker.name} 无法攻击`;
            return result;
        }

        let target = null;
        let isHQ = false;

        // 确定攻击目标
        if (targetArea === 'hq') {
            isHQ = true;
        } else if (targetArea === 'support') {
            target = enemy.supportLine[targetIndex];
        } else if (targetArea === 'frontline') {
            target = enemy.frontline[targetIndex];
        }

        // 攻击总部
        if (isHQ) {
            // 计算对总部的伤害
            const damageToHQ = keywordSystem.calculateAttackDamage(attacker, { hp: enemy.hqHP, currentHP: enemy.hqHP, type: UNIT_TYPES.HQ }, this.state);
            enemy.hqHP -= damageToHQ;
            
            attacker.attacksLeft--;
            attacker.hasAttacked = true;

            this.logMessage(`${attacker.name} 攻击敌方总部，造成 ${damageToHQ} 点伤害`);
            this.checkGameOver();
            this.clearActionMode();

            result.success = true;
            result.message = `攻击成功，造成${damageToHQ}点伤害`;
            return result;
        }

        // 攻击单位
        if (!target) {
            result.message = '无效目标！';
            return result;
        }

        if (!keywordSystem.canBeAttacked(target, attacker)) {
            result.message = '该目标无法被攻击！';
            return result;
        }

        // 计算伤害
        const damageToTarget = keywordSystem.calculateAttackDamage(attacker, target, this.state);
        const damageToAttacker = keywordSystem.calculateCounterDamage(target, attacker, this.state);

        // 应用伤害
        target.currentHP -= damageToTarget;
        attacker.currentHP -= damageToAttacker;

        attacker.attacksLeft--;
        attacker.hasAttacked = true;

        this.logMessage(`${attacker.name} 攻击 ${target.name}，造成 ${damageToTarget} 点伤害`);
        if (damageToAttacker > 0) {
            this.logMessage(`${target.name} 反击，造成 ${damageToAttacker} 点伤害`);
        }

        // 处理死亡单位
        if (target.currentHP <= 0) {
            this.removeUnit(targetArea, targetIndex, enemyNum);
            this.logMessage(`${target.name} 被摧毁！`);
        }

        if (attacker.currentHP <= 0) {
            this.removeUnit(currentPos.area, currentPos.index, this.state.currentPlayer);
            this.logMessage(`${attacker.name} 被摧毁！`);
        }

        this.updateFrontlineControl();
        this.clearActionMode();

        result.success = true;
        result.message = '攻击成功';

        return result;
    }

    /**
     * 移除单位
     * @param {string} area - 区域
     * @param {number} index - 索引
     * @param {number} playerNum - 玩家编号
     */
    removeUnit(area, index, playerNum) {
        const player = this.state.players[playerNum];
        let unit = null;

        if (area === 'support') {
            unit = player.supportLine[index];
            player.supportLine[index] = null;
        } else if (area === 'frontline') {
            unit = player.frontline[index];
            player.frontline[index] = null;
        }

        if (unit) {
            // 触发摧毁事件
            effectSystem.emit(EVENT_TYPES.ON_DESTROY, {
                unit,
                gameState: this.state
            }, this.state);

            // 处理接力效果
            if (keywordSystem.hasKeyword(unit, KEYWORDS.RELAY)) {
                keywordSystem.handleRelay(unit, this.state);
            }
        }
    }

    /**
     * 待命
     * @returns {Object} 待命结果
     */
    waitUnit() {
        const result = {
            success: false,
            message: ''
        };

        if (!this.state.selectedUnit) {
            result.message = '未选择单位';
            return result;
        }

        const unit = this.state.selectedUnit;
        unit.hasWaited = true;
        unit.hasMoved = true;
        unit.hasAttacked = true;
        unit.movesLeft = 0;
        unit.attacksLeft = 0;

        this.logMessage(`${unit.name} 进入待命状态`);
        this.clearActionMode();

        result.success = true;
        result.message = '待命成功';

        return result;
    }

    /**
     * 更新战线控制
     */
    updateFrontlineControl() {
        const player1Units = this.state.players[1].frontline.filter(u => u !== null).length;
        const player2Units = this.state.players[2].frontline.filter(u => u !== null).length;

        if (player1Units > 0 && player2Units === 0) {
            this.state.frontlineController = 1;
        } else if (player2Units > 0 && player1Units === 0) {
            this.state.frontlineController = 2;
        } else {
            this.state.frontlineController = 0;
        }
    }

    /**
     * 执行指令卡牌
     * @param {Object} card - 卡牌对象
     * @returns {Object} 执行结果
     */
    executeOrderCard(card) {
        const result = {
            success: false,
            message: ''
        };

        if (!card.effects || card.effects.length === 0) {
            result.message = '该卡牌没有效果';
            return result;
        }

        const player = this.state.players[this.state.currentPlayer];

        // 检查指挥点
        if (player.cp < card.cost) {
            result.message = `指挥点不足！需要 ${card.cost} 点`;
            return result;
        }

        // 消耗指挥点
        player.cp -= card.cost;

        // 移除卡牌
        const cardIndex = player.hand.findIndex(c => c.id === card.id);
        if (cardIndex !== -1) {
            player.hand.splice(cardIndex, 1);
        }

        // 执行效果
        try {
            card.effects.forEach(effect => {
                // 这里需要根据效果类型处理目标选择
                // 简化版本：直接执行效果
                effectSystem.executeEffect(effect, null, this.state);
            });

            result.success = true;
            result.message = `${card.name} 执行成功`;
        } catch (error) {
            // 执行失败，退还指挥点和卡牌
            player.cp += card.cost;
            player.hand.push(card);
            result.message = `执行失败: ${error.message}`;
            console.error('指令卡执行错误:', error);
        }

        return result;
    }

    /**
     * 检查游戏结束
     */
    checkGameOver() {
        if (this.state.players[1].hqHP <= 0) {
            this.state.gameOver = true;
            this.state.winner = 2;
            this.logMessage('🎉 玩家2 获胜！');
        } else if (this.state.players[2].hqHP <= 0) {
            this.state.gameOver = true;
            this.state.winner = 1;
            this.logMessage('🎉 玩家1 获胜！');
        }

        // 检查回合数限制
        if (this.state.turn >= GAME_RULES.MAX_TURNS) {
            this.state.gameOver = true;
            // 比较总部生命值
            if (this.state.players[1].hqHP > this.state.players[2].hqHP) {
                this.state.winner = 1;
            } else if (this.state.players[2].hqHP > this.state.players[1].hqHP) {
                this.state.winner = 2;
            } else {
                this.state.winner = 0; // 平局
            }
            this.logMessage('🎮 回合数达到上限，游戏结束！');
        }
    }

    /**
     * 清除行动模式
     */
    clearActionMode() {
        this.state.actionMode = ACTION_MODES.IDLE;
        this.state.selectedCard = null;
        this.state.selectedUnit = null;
        this.state.selectedUnitPosition = null;
    }

    /**
     * 记录日志
     * @param {string} message - 日志消息
     */
    logMessage(message) {
        this.state.eventLog.push({
            message,
            turn: this.state.turn,
            player: this.state.currentPlayer,
            timestamp: new Date().toISOString()
        });

        // 保持日志数量限制
        if (this.state.eventLog.length > 100) {
            this.state.eventLog.shift();
        }
    }

    /**
     * 获取游戏状态
     * @returns {Object} 游戏状态
     */
    getState() {
        return this.state;
    }

    /**
     * 重新开始游戏
     * @param {Object} player1Deck - 玩家1的牌组
     * @param {Object} player2Deck - 玩家2的牌组
     */
    restart(player1Deck, player2Deck) {
        return this.initGame(player1Deck, player2Deck);
    }
}

// 创建全局实例
const game = new Game();

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Game;
}