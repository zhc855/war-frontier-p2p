/**
 * 关键字系统
 * 实现所有关键字的逻辑和效果
 */

class KeywordSystem {
    constructor() {
        this.keywords = KEYWORDS;
    }

    /**
     * 检查单位是否拥有关键字
     * @param {Object} unit - 单位对象
     * @param {string} keyword - 关键字
     * @returns {boolean} 是否拥有
     */
    hasKeyword(unit, keyword) {
        if (!unit || !unit.keywords) return false;
        return unit.keywords.includes(keyword);
    }

    /**
     * 添加关键字到单位
     * @param {Object} unit - 单位对象
     * @param {string} keyword - 要添加的关键字
     */
    addKeyword(unit, keyword) {
        if (!unit.keywords) {
            unit.keywords = [];
        }
        if (!unit.keywords.includes(keyword)) {
            unit.keywords.push(keyword);
        }
    }

    /**
     * 从单位移除关键字
     * @param {Object} unit - 单位对象
     * @param {string} keyword - 要移除的关键字
     */
    removeKeyword(unit, keyword) {
        if (!unit || !unit.keywords) return;
        const index = unit.keywords.indexOf(keyword);
        if (index > -1) {
            unit.keywords.splice(index, 1);
        }
    }

    /**
     * 计算攻击伤害（考虑关键字）
     * @param {Object} attacker - 攻击者
     * @param {Object} defender - 防御者
     * @param {Object} gameState - 游戏状态
     * @returns {number} 伤害值
     */
    calculateAttackDamage(attacker, defender, gameState) {
        let damage = attacker.attack || 0;

        // 反坦克关键字
        if (this.hasKeyword(attacker, KEYWORDS.ANTI_TANK)) {
            if (this.hasKeyword(defender, KEYWORDS.ARMOR) || defender.type === UNIT_TYPES.TANK) {
                damage *= 2;
            }
        }

        // 对空关键字
        if (this.hasKeyword(attacker, KEYWORDS.ANTI_AIR)) {
            if (defender.type === UNIT_TYPES.FIGHTER || defender.type === UNIT_TYPES.BOMBER) {
                damage *= 2;
            }
        }

        // 暴怒状态
        if (attacker.statuses && attacker.statuses.includes(STATUS_TYPES.ENRAGED)) {
            damage += 2;
        }

        // 士气低落状态
        if (attacker.statuses && attacker.statuses.includes(STATUS_TYPES.DEMORALIZED)) {
            damage = Math.max(1, damage - 2);
        }

        return damage;
    }

    /**
     * 计算防御伤害（考虑关键字）
     * @param {Object} defender - 防御者
     * @param {Object} attacker - 攻击者
     * @param {Object} gameState - 游戏状态
     * @returns {number} 反击伤害
     */
    calculateCounterDamage(defender, attacker, gameState) {
        // 突击关键字 - 攻击者不受反击伤害
        if (this.hasKeyword(attacker, KEYWORDS.BLITZ)) {
            return 0;
        }

        // 轰炸关键字 - 不受反击伤害
        if (this.hasKeyword(attacker, KEYWORDS.BOMBARDMENT)) {
            return 0;
        }

        // 防御者是否可以反击
        if (defender.hasAttacked || !this.hasKeyword(defender, KEYWORDS.FIRST_STRIKE)) {
            return defender.attack || 0;
        }

        return 0;
    }

    /**
     * 检查单位是否可以被攻击
     * @param {Object} unit - 目标单位
     * @param {Object} attacker - 攻击者
     * @returns {boolean} 是否可以被攻击
     */
    canBeAttacked(unit, attacker) {
        if (!unit) return false;

        // 烟雾关键字 - 无法被直接攻击
        if (this.hasKeyword(unit, KEYWORDS.SMOKE)) {
            return false;
        }

        // 潜行关键字 - 攻击前无法被选中
        if (this.hasKeyword(unit, KEYWORDS.STEALTH) && !unit.hasAttacked) {
            return false;
        }

        // 伪装状态 - 无法被选中
        if (unit.statuses && unit.statuses.includes(STATUS_TYPES.CAMOUFLAGED)) {
            return false;
        }

        return true;
    }

    /**
     * 检查单位是否可以攻击
     * @param {Object} unit - 单位对象
     * @returns {boolean} 是否可以攻击
     */
    canAttack(unit) {
        if (!unit) return false;

        // 检查是否已攻击
        if (unit.hasAttacked) return false;

        // 检查是否被压制
        if (unit.statuses && unit.statuses.includes(STATUS_TYPES.SUPPRESSED)) {
            return false;
        }

        // 检查是否眩晕
        if (unit.statuses && unit.statuses.includes(STATUS_TYPES.STUNNED)) {
            return false;
        }

        // 检查是否冻结
        if (unit.statuses && unit.statuses.includes(STATUS_TYPES.FROZEN)) {
            return false;
        }

        // 检查是否是总部
        if (unit.type === UNIT_TYPES.HQ) {
            return false;
        }

        return true;
    }

    /**
     * 检查单位是否可以移动
     * @param {Object} unit - 单位对象
     * @returns {boolean} 是否可以移动
     */
    canMove(unit) {
        if (!unit) return false;

        // 检查移动次数
        if (unit.movesLeft <= 0) return false;

        // 检查是否已移动
        if (unit.hasMoved) return false;

        // 检查是否被冻结
        if (unit.statuses && unit.statuses.includes(STATUS_TYPES.FROZEN)) {
            return false;
        }

        // 检查是否是总部
        if (unit.type === UNIT_TYPES.HQ) {
            return false;
        }

        // 检查是否是防御工事
        if (unit.type === UNIT_TYPES.FORTIFICATION) {
            return false;
        }

        return true;
    }

    /**
     * 处理先攻效果
     * @param {Object} attacker - 攻击者
     * @param {Object} defender - 防御者
     * @param {Object} gameState - 游戏状态
     * @returns {Object} 伤害结果
     */
    handleFirstStrike(attacker, defender, gameState) {
        const result = {
            damageToDefender: 0,
            damageToAttacker: 0,
            defenderDestroyed: false
        };

        // 攻击者有先攻
        if (this.hasKeyword(attacker, KEYWORDS.FIRST_STRIKE)) {
            result.damageToDefender = this.calculateAttackDamage(attacker, defender, gameState);
            defender.currentHP -= result.damageToDefender;

            if (defender.currentHP <= 0) {
                result.defenderDestroyed = true;
                return result; // 防御者被摧毁，无法反击
            }
        }

        // 防御者有先攻且未被摧毁
        if (!result.defenderDestroyed && this.hasKeyword(defender, KEYWORDS.FIRST_STRIKE)) {
            result.damageToAttacker = this.calculateCounterDamage(defender, attacker, gameState);
            attacker.currentHP -= result.damageToAttacker;
        }

        return result;
    }

    /**
     * 处理支援效果
     * @param {Object} unit - 拥有支援关键字的单位
     * @param {Object} target - 被支援的单位
     * @param {Object} gameState - 游戏状态
     */
    applySupportEffect(unit, target, gameState) {
        if (!this.hasKeyword(unit, KEYWORDS.SUPPORT)) {
            return;
        }

        // 相邻单位获得+1攻击力
        if (target) {
            target.attack = (target.attack || 0) + 1;
        }
    }

    /**
     * 处理坚守效果
     * @param {Object} unit - 拥有坚守关键字的单位
     * @param {Object} gameState - 游戏状态
     */
    handleHoldGround(unit, gameState) {
        if (!this.hasKeyword(unit, KEYWORDS.HOLD)) {
            return;
        }

        // 前线单位死亡时，坚守单位移至前线
        const player = gameState.players[gameState.currentPlayer];
        const frontlineSlotIndex = gameState.selectedUnitPosition?.index;

        if (frontlineSlotIndex !== undefined && player.frontline[frontlineSlotIndex] === null) {
            // 从支援战线移到前线
            const supportSlotIndex = player.supportLine.findIndex(u => u && u.id === unit.id);
            if (supportSlotIndex !== -1) {
                player.frontline[frontlineSlotIndex] = unit;
                player.supportLine[supportSlotIndex] = null;
            }
        }
    }

    /**
     * 处理士气效果
     * @param {Object} unit - 拥有士气关键字的单位
     * @param {Array} adjacentUnits - 相邻单位数组
     */
    applyMoraleEffect(unit, adjacentUnits) {
        if (!this.hasKeyword(unit, KEYWORDS.MORALE)) {
            return;
        }

        // 相邻单位获得士气状态
        adjacentUnits.forEach(adjacent => {
            if (adjacent && !adjacent.statuses) {
                adjacent.statuses = [];
            }
            if (adjacent && !adjacent.statuses.includes(STATUS_TYPES.INSPIRED)) {
                adjacent.statuses.push(STATUS_TYPES.INSPIRED);
            }
        });
    }

    /**
     * 计算受到的伤害（考虑护甲和关键字）
     * @param {Object} defender - 防御者
     * @param {number} rawDamage - 原始伤害
     * @returns {number} 实际伤害
     */
    calculateDamageTaken(defender, rawDamage) {
        let damage = rawDamage;

        // 装甲关键字
        if (this.hasKeyword(defender, KEYWORDS.ARMOR)) {
            damage -= (defender.armor || 0);
        }

        // 防守者关键字（被动时+1护甲）
        if (this.hasKeyword(defender, KEYWORDS.DEFENDER)) {
            damage -= 1;
        }

        // 护盾状态 - 抵挡一次伤害
        if (defender.statuses && defender.statuses.includes(STATUS_TYPES.SHIELDED)) {
            damage = 0;
            const index = defender.statuses.indexOf(STATUS_TYPES.SHIELDED);
            defender.statuses.splice(index, 1);
        }

        // 至少造成1点伤害
        return Math.max(1, damage);
    }

    /**
     * 处理接力效果
     * @param {Object} unit - 死亡的单位
     * @param {Object} gameState - 游戏状态
     */
    handleRelay(unit, gameState) {
        if (!this.hasKeyword(unit, KEYWORDS.RELAY)) {
            return;
        }

        // 死亡时让相邻单位行动
        const player = gameState.players[gameState.currentPlayer];
        const position = gameState.selectedUnitPosition;

        if (position) {
            const adjacentUnits = this.getAdjacentUnits(position, player);
            adjacentUnits.forEach(adjacent => {
                if (adjacent && adjacent.hasAttacked) {
                    adjacent.hasAttacked = false;
                    adjacent.attacksLeft = (adjacent.attacksLeft || 0) + 1;
                }
            });
        }
    }

    /**
     * 获取相邻单位
     * @param {Object} position - 位置信息
     * @param {Object} player - 玩家对象
     * @returns {Array} 相邻单位数组
     */
    getAdjacentUnits(position, player) {
        const adjacent = [];
        const { area, index } = position;

        if (area === 'support') {
            // 支援战线的相邻单位
            if (index > 0) adjacent.push(player.supportLine[index - 1]);
            if (index < 3) adjacent.push(player.supportLine[index + 1]);
            adjacent.push(player.frontline[index]);
        } else if (area === 'frontline') {
            // 前线的相邻单位
            if (index > 0) adjacent.push(player.frontline[index - 1]);
            if (index < 3) adjacent.push(player.frontline[index + 1]);
            adjacent.push(player.supportLine[index]);
        }

        return adjacent.filter(u => u !== null);
    }

    /**
     * 检查单位是否拥有冲锋关键字
     * @param {Object} unit - 单位对象
     * @returns {boolean}
     */
    hasRush(unit) {
        return this.hasKeyword(unit, KEYWORDS.RUSH);
    }

    /**
     * 检查单位是否可以立即行动
     * @param {Object} unit - 单位对象
     * @returns {boolean}
     */
    canActImmediately(unit) {
        return this.hasRush(unit);
    }
}

// 创建全局实例
const keywordSystem = new KeywordSystem();

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KeywordSystem;
}