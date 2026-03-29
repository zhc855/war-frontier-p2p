/**
 * 效果系统
 * 处理所有特殊效果、事件触发、连锁反应等
 */

class EffectSystem {
    constructor() {
        this.effectQueue = [];
        this.eventListeners = new Map();
        this.chainReactionDepth = 0;
        this.MAX_CHAIN_DEPTH = 10; // 防止无限循环
    }

    /**
     * 注册事件监听器
     * @param {string} eventType - 事件类型
     * @param {Function} callback - 回调函数
     * @param {Object} context - 上下文对象
     */
    on(eventType, callback, context = null) {
        if (!this.eventListeners.has(eventType)) {
            this.eventListeners.set(eventType, []);
        }
        this.eventListeners.get(eventType).push({
            callback,
            context,
            once: false
        });
    }

    /**
     * 注册一次性事件监听器
     * @param {string} eventType - 事件类型
     * @param {Function} callback - 回调函数
     * @param {Object} context - 上下文对象
     */
    once(eventType, callback, context = null) {
        if (!this.eventListeners.has(eventType)) {
            this.eventListeners.set(eventType, []);
        }
        this.eventListeners.get(eventType).push({
            callback,
            context,
            once: true
        });
    }

    /**
     * 移除事件监听器
     * @param {string} eventType - 事件类型
     * @param {Function} callback - 回调函数
     */
    off(eventType, callback) {
        if (!this.eventListeners.has(eventType)) return;

        const listeners = this.eventListeners.get(eventType);
        const index = listeners.findIndex(l => l.callback === callback);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    }

    /**
     * 触发事件
     * @param {string} eventType - 事件类型
     * @param {Object} data - 事件数据
     * @param {Object} gameState - 游戏状态
     * @returns {Array} 事件结果数组
     */
    emit(eventType, data, gameState) {
        if (!this.eventListeners.has(eventType)) return [];

        const listeners = this.eventListeners.get(eventType);
        const results = [];

        // 创建监听器副本，防止在回调中修改原数组
        const listenersCopy = [...listeners];

        for (const listener of listenersCopy) {
            try {
                const result = listener.callback.call(listener.context, data, gameState);
                results.push(result);

                // 如果是一次性监听器，移除它
                if (listener.once) {
                    this.off(eventType, listener.callback);
                }
            } catch (error) {
                console.error(`Error in event listener for ${eventType}:`, error);
            }
        }

        return results;
    }

    /**
     * 执行效果
     * @param {Object} effect - 效果对象
     * @param {Object} target - 目标对象
     * @param {Object} gameState - 游戏状态
     * @returns {Object} 执行结果
     */
    executeEffect(effect, target, gameState) {
        const result = {
            success: false,
            changes: [],
            chainEffects: []
        };

        try {
            switch (effect.type) {
                case EFFECT_TYPES.MODIFY_ATTACK:
                    result.changes.push(this.modifyAttack(target, effect.value));
                    break;
                case EFFECT_TYPES.MODIFY_HP:
                    result.changes.push(this.modifyHP(target, effect.value));
                    break;
                case EFFECT_TYPES.MODIFY_ARMOR:
                    result.changes.push(this.modifyArmor(target, effect.value));
                    break;
                case EFFECT_TYPES.DEAL_DAMAGE:
                    result.changes.push(this.dealDamage(target, effect.value, gameState));
                    break;
                case EFFECT_TYPES.HEAL:
                    result.changes.push(this.heal(target, effect.value));
                    break;
                case EFFECT_TYPES.DESTROY:
                    result.changes.push(this.destroy(target, gameState));
                    break;
                case EFFECT_TYPES.ADD_KEYWORD:
                    result.changes.push(this.addKeyword(target, effect.keyword));
                    break;
                case EFFECT_TYPES.REMOVE_KEYWORD:
                    result.changes.push(this.removeKeyword(target, effect.keyword));
                    break;
                case EFFECT_TYPES.ADD_STATUS:
                    result.changes.push(this.addStatus(target, effect.status, effect.duration));
                    break;
                case EFFECT_TYPES.REMOVE_STATUS:
                    result.changes.push(this.removeStatus(target, effect.status));
                    break;
                case EFFECT_TYPES.DRAW_CARDS:
                    result.changes.push(this.drawCards(effect.count, gameState));
                    break;
                case EFFECT_TYPES.DISCARD_CARDS:
                    result.changes.push(this.discardCards(effect.count, gameState));
                    break;
                case EFFECT_TYPES.GAIN_CP:
                    result.changes.push(this.gainCP(effect.amount, gameState));
                    break;
                case EFFECT_TYPES.MOVE_UNIT:
                    result.changes.push(this.moveUnit(target, effect.targetPosition, gameState));
                    break;
                case EFFECT_TYPES.BOUNCE:
                    result.changes.push(this.bounce(target, gameState));
                    break;
                default:
                    console.warn(`Unknown effect type: ${effect.type}`);
            }

            result.success = true;

            // 触发连锁反应
            if (effect.chain && this.chainReactionDepth < this.MAX_CHAIN_DEPTH) {
                this.chainReactionDepth++;
                result.chainEffects = this.handleChainReaction(effect.chain, gameState);
                this.chainReactionDepth--;
            }

        } catch (error) {
            console.error('Error executing effect:', error);
            result.success = false;
            result.error = error.message;
        }

        return result;
    }

    /**
     * 修改攻击力
     * @param {Object} unit - 单位对象
     * @param {number} value - 修改值
     * @returns {Object} 修改结果
     */
    modifyAttack(unit, value) {
        const oldAttack = unit.attack || 0;
        unit.attack = Math.max(0, oldAttack + value);
        return {
            type: 'attack_modified',
            unit: unit.id,
            oldValue: oldAttack,
            newValue: unit.attack
        };
    }

    /**
     * 修改生命值
     * @param {Object} unit - 单位对象
     * @param {number} value - 修改值
     * @returns {Object} 修改结果
     */
    modifyHP(unit, value) {
        const oldHP = unit.hp || 0;
        unit.hp = Math.max(1, oldHP + value);
        unit.currentHP = Math.min(unit.currentHP, unit.hp);
        return {
            type: 'hp_modified',
            unit: unit.id,
            oldValue: oldHP,
            newValue: unit.hp
        };
    }

    /**
     * 修改护甲
     * @param {Object} unit - 单位对象
     * @param {number} value - 修改值
     * @returns {Object} 修改结果
     */
    modifyArmor(unit, value) {
        const oldArmor = unit.armor || 0;
        unit.armor = Math.max(0, oldArmor + value);
        return {
            type: 'armor_modified',
            unit: unit.id,
            oldValue: oldArmor,
            newValue: unit.armor
        };
    }

    /**
     * 造成伤害
     * @param {Object} target - 目标对象
     * @param {number} value - 伤害值
     * @param {Object} gameState - 游戏状态
     * @returns {Object} 伤害结果
     */
    dealDamage(target, value, gameState) {
        const oldHP = target.currentHP;
        target.currentHP -= value;

        // 触发受到伤害事件
        this.emit(EVENT_TYPES.ON_TAKE_DAMAGE, {
            target,
            damage: value,
            gameState
        }, gameState);

        // 检查是否被摧毁
        if (target.currentHP <= 0) {
            this.emit(EVENT_TYPES.ON_DESTROY, {
                unit: target,
                gameState
            }, gameState);
        }

        return {
            type: 'damage_dealt',
            target: target.id,
            damage: value,
            oldHP,
            newHP: target.currentHP,
            destroyed: target.currentHP <= 0
        };
    }

    /**
     * 治疗
     * @param {Object} target - 目标对象
     * @param {number} value - 治疗值
     * @returns {Object} 治疗结果
     */
    heal(target, value) {
        const oldHP = target.currentHP;
        target.currentHP = Math.min(target.hp, target.currentHP + value);
        return {
            type: 'healed',
            target: target.id,
            heal: value,
            oldHP,
            newHP: target.currentHP
        };
    }

    /**
     * 摧毁单位
     * @param {Object} unit - 单位对象
     * @param {Object} gameState - 游戏状态
     * @returns {Object} 摧毁结果
     */
    destroy(unit, gameState) {
        // 触发摧毁事件
        this.emit(EVENT_TYPES.ON_DESTROY, {
            unit,
            gameState
        }, gameState);

        // 从战场移除单位
        this.removeUnitFromBattlefield(unit, gameState);

        return {
            type: 'destroyed',
            unit: unit.id
        };
    }

    /**
     * 添加关键字
     * @param {Object} unit - 单位对象
     * @param {string} keyword - 关键字
     * @returns {Object} 添加结果
     */
    addKeyword(unit, keyword) {
        if (!unit.keywords) {
            unit.keywords = [];
        }
        if (!unit.keywords.includes(keyword)) {
            unit.keywords.push(keyword);
        }
        return {
            type: 'keyword_added',
            unit: unit.id,
            keyword
        };
    }

    /**
     * 移除关键字
     * @param {Object} unit - 单位对象
     * @param {string} keyword - 关键字
     * @returns {Object} 移除结果
     */
    removeKeyword(unit, keyword) {
        if (unit.keywords) {
            const index = unit.keywords.indexOf(keyword);
            if (index > -1) {
                unit.keywords.splice(index, 1);
            }
        }
        return {
            type: 'keyword_removed',
            unit: unit.id,
            keyword
        };
    }

    /**
     * 添加状态
     * @param {Object} unit - 单位对象
     * @param {string} status - 状态类型
     * @param {number} duration - 持续回合数
     * @returns {Object} 添加结果
     */
    addStatus(unit, status, duration = 1) {
        if (!unit.statuses) {
            unit.statuses = [];
        }
        unit.statuses.push({
            type: status,
            duration,
            appliedTurn: gameState.turn
        });
        return {
            type: 'status_added',
            unit: unit.id,
            status,
            duration
        };
    }

    /**
     * 移除状态
     * @param {Object} unit - 单位对象
     * @param {string} status - 状态类型
     * @returns {Object} 移除结果
     */
    removeStatus(unit, status) {
        if (unit.statuses) {
            const index = unit.statuses.findIndex(s => s.type === status);
            if (index > -1) {
                unit.statuses.splice(index, 1);
            }
        }
        return {
            type: 'status_removed',
            unit: unit.id,
            status
        };
    }

    /**
     * 抽牌
     * @param {number} count - 抽牌数量
     * @param {Object} gameState - 游戏状态
     * @returns {Object} 抽牌结果
     */
    drawCards(count, gameState) {
        const player = gameState.players[gameState.currentPlayer];
        const drawnCards = [];

        for (let i = 0; i < count; i++) {
            if (player.deck.length > 0 && player.hand.length < GAME_RULES.HAND_SIZE) {
                const card = player.deck.shift();
                player.hand.push(card);
                drawnCards.push(card.id);
            }
        }

        return {
            type: 'cards_drawn',
            count: drawnCards.length,
            cards: drawnCards
        };
    }

    /**
     * 弃牌
     * @param {number} count - 弃牌数量
     * @param {Object} gameState - 游戏状态
     * @returns {Object} 弃牌结果
     */
    discardCards(count, gameState) {
        const player = gameState.players[gameState.currentPlayer];
        const discardedCards = [];

        for (let i = 0; i < count && player.hand.length > 0; i++) {
            const card = player.hand.pop();
            discardedCards.push(card.id);
        }

        return {
            type: 'cards_discarded',
            count: discardedCards.length,
            cards: discardedCards
        };
    }

    /**
     * 获得指挥点
     * @param {number} amount - 指挥点数量
     * @param {Object} gameState - 游戏状态
     * @returns {Object} 获得结果
     */
    gainCP(amount, gameState) {
        const player = gameState.players[gameState.currentPlayer];
        const oldCP = player.cp;
        player.cp = Math.min(GAME_RULES.MAX_CP, player.cp + amount);
        return {
            type: 'cp_gained',
            player: gameState.currentPlayer,
            oldCP,
            newCP: player.cp
        };
    }

    /**
     * 移动单位
     * @param {Object} unit - 单位对象
     * @param {Object} targetPosition - 目标位置
     * @param {Object} gameState - 游戏状态
     * @returns {Object} 移动结果
     */
    moveUnit(unit, targetPosition, gameState) {
        const player = gameState.players[gameState.currentPlayer];
        const oldPosition = gameState.selectedUnitPosition;

        // 从原位置移除
        if (oldPosition.area === 'support') {
            player.supportLine[oldPosition.index] = null;
        } else if (oldPosition.area === 'frontline') {
            player.frontline[oldPosition.index] = null;
        }

        // 添加到新位置
        if (targetPosition.area === 'support') {
            player.supportLine[targetPosition.index] = unit;
        } else if (targetPosition.area === 'frontline') {
            player.frontline[targetPosition.index] = unit;
        }

        return {
            type: 'unit_moved',
            unit: unit.id,
            oldPosition,
            newPosition: targetPosition
        };
    }

    /**
     * 返回手牌
     * @param {Object} unit - 单位对象
     * @param {Object} gameState - 游戏状态
     * @returns {Object} 返回结果
     */
    bounce(unit, gameState) {
        const player = gameState.players[gameState.currentPlayer];

        // 从战场移除
        this.removeUnitFromBattlefield(unit, gameState);

        // 添加到手牌
        if (player.hand.length < GAME_RULES.HAND_SIZE) {
            player.hand.push({
                ...unit,
                currentHP: unit.hp,
                hasMoved: false,
                hasAttacked: false
            });
        }

        return {
            type: 'unit_bounced',
            unit: unit.id
        };
    }

    /**
     * 从战场移除单位
     * @param {Object} unit - 单位对象
     * @param {Object} gameState - 游戏状态
     */
    removeUnitFromBattlefield(unit, gameState) {
        const player = gameState.players[gameState.currentPlayer];

        // 从支援战线移除
        const supportIndex = player.supportLine.findIndex(u => u && u.id === unit.id);
        if (supportIndex !== -1) {
            player.supportLine[supportIndex] = null;
        }

        // 从前线移除
        const frontlineIndex = player.frontline.findIndex(u => u && u.id === unit.id);
        if (frontlineIndex !== -1) {
            player.frontline[frontlineIndex] = null;
        }
    }

    /**
     * 处理连锁反应
     * @param {Array} chain - 连锁效果数组
     * @param {Object} gameState - 游戏状态
     * @returns {Array} 连锁效果结果
     */
    handleChainReaction(chain, gameState) {
        const results = [];

        for (const chainEffect of chain) {
            // 检查条件
            if (chainEffect.condition && !this.evaluateCondition(chainEffect.condition, gameState)) {
                continue;
            }

            // 执行效果
            const result = this.executeEffect(chainEffect.effect, chainEffect.target, gameState);
            results.push(result);

            // 如果效果失败，停止连锁
            if (!result.success) {
                break;
            }
        }

        return results;
    }

    /**
     * 评估条件
     * @param {Object} condition - 条件对象
     * @param {Object} gameState - 游戏状态
     * @returns {boolean} 是否满足条件
     */
    evaluateCondition(condition, gameState) {
        switch (condition.type) {
            case 'hp_below':
                return condition.target.currentHP < condition.value;
            case 'hp_above':
                return condition.target.currentHP > condition.value;
            case 'turn_equals':
                return gameState.turn === condition.value;
            case 'faction_match':
                return condition.unit.faction === condition.faction;
            case 'has_keyword':
                return condition.unit.keywords && condition.unit.keywords.includes(condition.keyword);
            case 'enemy_count':
                const enemy = gameState.players[gameState.currentPlayer === 1 ? 2 : 1];
                const count = enemy.frontline.filter(u => u !== null).length +
                             enemy.supportLine.filter(u => u !== null).length;
                return count >= condition.value;
            default:
                return true;
        }
    }

    /**
     * 处理回合结束时的状态效果
     * @param {Object} gameState - 游戏状态
     */
    processTurnEndEffects(gameState) {
        const player = gameState.players[gameState.currentPlayer];

        // 处理所有单位的状态效果
        [...player.supportLine, ...player.frontline].forEach(unit => {
            if (!unit || !unit.statuses) return;

            // 处理每个状态
            unit.statuses = unit.statuses.filter(status => {
                status.duration--;

                // 燃烧伤害
                if (status.type === STATUS_TYPES.BURNING) {
                    unit.currentHP -= 1;
                }

                // 中毒伤害
                if (status.type === STATUS_TYPES.POISONED) {
                    unit.currentHP -= 1;
                }

                // 持续时间结束则移除
                return status.duration > 0;
            });
        });
    }

    /**
     * 清除所有监听器
     */
    clearAllListeners() {
        this.eventListeners.clear();
    }

    /**
     * 清除效果队列
     */
    clearEffectQueue() {
        this.effectQueue = [];
        this.chainReactionDepth = 0;
    }
}

// 创建全局实例
const effectSystem = new EffectSystem();

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EffectSystem;
}