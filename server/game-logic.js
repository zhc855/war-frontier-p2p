/**
 * 游戏逻辑服务器端
 * 处理游戏核心逻辑和状态管理
 */

// 导入常量
const GAME_RULES = {
    MAX_CP: 12,
    START_CP: 1,
    CP_GROWTH_PER_TURN: 1,
    DECK_SIZE: 40,
    MAX_CARD_COPIES: 3,
    HAND_SIZE: 10,
    START_HAND_SIZE: 4,
    SUPPORT_LINE_SIZE: 4,
    FRONTLINE_SIZE: 4,
    HQ_START_HP: 20,
    MAX_TURNS: 99,
    CARDS_DRAWN_PER_TURN: 1,
    MAX_DECK_SIZE: 100
};

const ACTION_MODES = {
    DEPLOY: 'deploy',
    MOVE: 'move',
    ATTACK: 'attack',
    WAIT: 'wait',
    IDLE: 'idle'
};

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
            phase: 'draw',
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
        console.log(`初始抽牌 - 玩家${playerNum}, 牌组剩余: ${player.deck.length}`);
        
        for (let i = 0; i < GAME_RULES.START_HAND_SIZE; i++) {
            if (player.deck.length > 0) {
                const card = player.deck.shift();
                player.hand.push(card);
                console.log(`玩家${playerNum} 抽到卡牌: ${card.name}`);
            }
        }
        
        console.log(`玩家${playerNum} 初始手牌: ${player.hand.length}张`);
    }

    /**
     * 开始回合
     */
    startTurn() {
        const current = this.state.currentPlayer;
        const player = this.state.players[current];

        // 增加指挥点
        if (current === 1) {
            this.state.turn++;
        }
        player.maxCP = Math.min(GAME_RULES.MAX_CP, this.state.turn);
        player.cp = player.maxCP;

        // 抽牌
        if (player.deck.length > 0 && player.hand.length < GAME_RULES.HAND_SIZE) {
            player.hand.push(player.deck.shift());
        }

        // 重置单位状态
        this.resetUnitStates(current);

        this.state.phase = 'deploy';
        this.logMessage(`回合 ${this.state.turn} - 玩家${current} 的回合`);
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
                unit.hasWaited = false;
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
            message: '',
            gameOver: false
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
        if (card.type === 'order') {
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
            message: '',
            gameOver: false
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
        if (card.type !== 'unit' && card.type !== 'reinforcement') {
            result.message = '只能部署单位卡';
            return result;
        }

        // 创建单位实例
        const unit = this.createUnitInstance(card);

        // 部署单位
        player.supportLine[slotIndex] = unit;
        player.cp -= card.cost;
        player.hand.splice(cardIndex, 1);

        // 冲锋关键字 - 可以立即行动
        if (!unit.keywords || !unit.keywords.includes('rush')) {
            unit.hasMoved = true;
            unit.hasAttacked = true;
        }

        this.clearActionMode();
        result.success = true;
        result.message = `${unit.name} 已部署到支援战线 ${slotIndex + 1} 号位置`;

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
            currentHP: card.hp,
            movesLeft: card.movesPerTurn || 1,
            attacksLeft: card.attacksPerTurn || 1,
            hasMoved: false,
            hasAttacked: false,
            hasWaited: false,
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
            message: '',
            gameOver: false
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
            message: '',
            gameOver: false
        };

        if (this.state.actionMode !== ACTION_MODES.MOVE) {
            result.message = '不在移动模式';
            return result;
        }

        const unit = this.state.selectedUnit;
        const currentPos = this.state.selectedUnitPosition;
        const player = this.state.players[this.state.currentPlayer];

        if (unit.movesLeft <= 0 || unit.hasMoved) {
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
            message: '',
            gameOver: false
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

        if (attacker.attacksLeft <= 0 || attacker.hasAttacked) {
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
            enemy.hqHP -= attacker.attack;
            attacker.attacksLeft--;
            attacker.hasAttacked = true;

            this.logMessage(`${attacker.name} 攻击敌方总部，造成 ${attacker.attack} 点伤害`);
            this.checkGameOver();
            this.clearActionMode();

            result.success = true;
            result.message = '攻击成功';
            result.gameOver = this.state.gameOver;
            result.winner = this.state.winner;
            return result;
        }

        // 攻击单位
        if (!target) {
            result.message = '无效目标！';
            return result;
        }

        // 计算伤害
        let damageToTarget = attacker.attack;
        let damageToAttacker = target.attack || 0;

        // 突击关键字 - 不受反击伤害
        if (attacker.keywords && attacker.keywords.includes('blitz')) {
            damageToAttacker = 0;
        }

        // 装甲关键字 - 减少受到的伤害
        if (target.keywords && target.keywords.includes('armor')) {
            damageToTarget = Math.max(1, damageToTarget - (target.armor || 0));
        }

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
        this.checkGameOver();
        result.gameOver = this.state.gameOver;
        result.winner = this.state.winner;

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

        if (area === 'support') {
            player.supportLine[index] = null;
        } else if (area === 'frontline') {
            player.frontline[index] = null;
        }
    }

    /**
     * 待命
     * @returns {Object} 待命结果
     */
    waitUnit() {
        const result = {
            success: false,
            message: '',
            gameOver: false
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
            message: '',
            gameOver: false
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

        // 执行效果（简化版本）
        result.success = true;
        result.message = `${card.name} 执行成功`;

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

module.exports = Game;