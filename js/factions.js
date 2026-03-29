/**
 * 阵营系统
 * 管理5个国家阵营的特性和效果
 */

class FactionSystem {
    constructor() {
        this.factions = FACTIONS;
        this.playerFactions = {
            player1: null,
            player2: null
        };
    }

    /**
     * 获取阵营信息
     * @param {string} factionId - 阵营ID
     * @returns {Object} 阵营信息
     */
    getFaction(factionId) {
        return this.factions[factionId.toUpperCase()] || this.factions.NEUTRAL;
    }

    /**
     * 设置玩家阵营
     * @param {number} playerNum - 玩家编号 (1 或 2)
     * @param {string} factionId - 阵营ID
     */
    setPlayerFaction(playerNum, factionId) {
        const playerKey = `player${playerNum}`;
        this.playerFactions[playerKey] = this.getFaction(factionId);
    }

    /**
     * 获取玩家阵营
     * @param {number} playerNum - 玩家编号
     * @returns {Object} 阵营信息
     */
    getPlayerFaction(playerNum) {
        const playerKey = `player${playerNum}`;
        return this.playerFactions[playerKey] || this.factions.NEUTRAL;
    }

    /**
     * 检查阵营是否匹配
     * @param {string} cardFaction - 卡牌阵营
     * @param {string} playerFaction - 玩家阵营
     * @returns {boolean} 是否匹配
     */
    isFactionMatch(cardFaction, playerFaction) {
        return cardFaction === 'neutral' || cardFaction === playerFaction;
    }

    /**
     * 应用阵营加成
     * @param {Object} unit - 单位对象
     * @param {string} factionId - 阵营ID
     * @returns {Object} 加成后的单位
     */
    applyFactionBonus(unit, factionId) {
        const faction = this.getFaction(factionId);
        const bonusUnit = { ...unit };

        switch(factionId) {
            case 'germany':
                // 装甲单位+1护甲
                if (unit.keywords && unit.keywords.includes(KEYWORDS.ARMOR)) {
                    bonusUnit.armor = (bonusUnit.armor || 0) + 1;
                }
                break;
            case 'usa':
                // 空军单位+1攻击力
                if (unit.type === UNIT_TYPES.FIGHTER || unit.type === UNIT_TYPES.BOMBER) {
                    bonusUnit.attack = (bonusUnit.attack || 0) + 1;
                }
                break;
            case 'britain':
                // 单位+1生命值
                bonusUnit.hp = (bonusUnit.hp || 0) + 1;
                bonusUnit.currentHP = bonusUnit.hp;
                break;
            case 'soviet':
                // 步兵单位-1费用
                if (unit.type === UNIT_TYPES.INFANTRY) {
                    bonusUnit.cost = Math.max(1, (bonusUnit.cost || 0) - 1);
                }
                break;
            case 'japan':
                // 单位+1移动次数
                if (unit.movesPerTurn !== undefined) {
                    bonusUnit.movesPerTurn = (bonusUnit.movesPerTurn || 0) + 1;
                }
                break;
        }

        return bonusUnit;
    }

    /**
     * 获取阵营颜色
     * @param {string} factionId - 阵营ID
     * @returns {string} 颜色代码
     */
    getFactionColor(factionId) {
        const faction = this.getFaction(factionId);
        return faction ? faction.color : '#808080';
    }

    /**
     * 获取阵营图标
     * @param {string} factionId - 阵营ID
     * @returns {string} Emoji 图标
     */
    getFactionIcon(factionId) {
        const faction = this.getFaction(factionId);
        return faction ? faction.emoji : '⚪';
    }

    /**
     * 获取所有阵营列表
     * @returns {Array} 阵营列表
     */
    getAllFactions() {
        return Object.values(this.factions).filter(f => f.id !== 'neutral');
    }

    /**
     * 验证牌组阵营配置
     * @param {Array} deck - 牌组
     * @param {string} mainFaction - 主阵营
     * @returns {Object} 验证结果
     */
    validateDeckFaction(deck, mainFaction) {
        const errors = [];
        const warnings = [];

        // 检查每张卡的阵营
        deck.forEach(card => {
            if (!this.isFactionMatch(card.faction, mainFaction)) {
                errors.push(`${card.name} 不属于 ${mainFaction} 阵营`);
            }
        });

        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }
}

// 创建全局实例
const factionSystem = new FactionSystem();

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FactionSystem;
}