/**
 * 成就系统
 * 管理游戏成就、进度追踪和奖励
 */

// ==================== 成就类型 ====================
const ACHIEVEMENT_TYPES = {
    GAMES_PLAYED: 'games_played',           // 游戏次数
    GAMES_WON: 'games_won',                 // 胜利次数
    CARDS_PLAYED: 'cards_played',           // 使用卡牌次数
    UNITS_DESTROYED: 'units_destroyed',     // 摧毁单位次数
    DAMAGE_DEALT: 'damage_dealt',           // 造成伤害
    PERFECT_GAME: 'perfect_game',           // 完美游戏（无损胜利）
    FAST_WIN: 'fast_win',                   // 快速胜利
    COMBO_KILLS: 'combo_kills',             // 连续击杀
    SPECIAL_CARD: 'special_card'            // 特殊卡牌使用
};

// ==================== 成就定义 ====================
const ACHIEVEMENTS = [
    // === 游戏次数成就 ===
    {
        id: 'first_blood',
        name: '初次交锋',
        description: '完成1场游戏',
        type: ACHIEVEMENT_TYPES.GAMES_PLAYED,
        target: 1,
        reward: '解锁新手卡背',
        rarity: 'common',
        icon: '⚔️'
    },
    {
        id: 'veteran',
        name: '战场老兵',
        description: '完成10场游戏',
        type: ACHIEVEMENT_TYPES.GAMES_PLAYED,
        target: 10,
        reward: '解锁老兵卡背',
        rarity: 'rare',
        icon: '🎖️'
    },
    {
        id: 'warlord',
        name: '战争领主',
        description: '完成50场游戏',
        type: ACHIEVEMENT_TYPES.GAMES_PLAYED,
        target: 50,
        reward: '解锁领主卡背',
        rarity: 'epic',
        icon: '👑'
    },

    // === 胜利成就 ===
    {
        id: 'first_victory',
        name: '首战告捷',
        description: '获得1场胜利',
        type: ACHIEVEMENT_TYPES.GAMES_WON,
        target: 1,
        reward: '50金币',
        rarity: 'common',
        icon: '🏆'
    },
    {
        id: 'champion',
        name: '冠军之路',
        description: '获得10场胜利',
        type: ACHIEVEMENT_TYPES.GAMES_WON,
        target: 10,
        reward: '200金币',
        rarity: 'rare',
        icon: '🥇'
    },
    {
        id: 'legendary',
        name: '传说级指挥官',
        description: '获得100场胜利',
        type: ACHIEVEMENT_TYPES.GAMES_WON,
        target: 100,
        reward: '解锁传说卡背 + 1000金币',
        rarity: 'legendary',
        icon: '🌟'
    },

    // === 卡牌使用成就 ===
    {
        id: 'card_master',
        name: '卡牌大师',
        description: '使用100张卡牌',
        type: ACHIEVEMENT_TYPES.CARDS_PLAYED,
        target: 100,
        reward: '100金币',
        rarity: 'common',
        icon: '🃏'
    },
    {
        id: 'strategist',
        name: '战术大师',
        description: '使用500张卡牌',
        type: ACHIEVEMENT_TYPES.CARDS_PLAYED,
        target: 500,
        reward: '300金币',
        rarity: 'rare',
        icon: '📚'
    },

    // === 摧毁单位成就 ===
    {
        id: 'destroyer',
        name: '单位破坏者',
        description: '摧毁10个敌方单位',
        type: ACHIEVEMENT_TYPES.UNITS_DESTROYED,
        target: 10,
        reward: '50金币',
        rarity: 'common',
        icon: '💥'
    },
    {
        id: 'annihilator',
        name: '歼灭专家',
        description: '摧毁50个敌方单位',
        type: ACHIEVEMENT_TYPES.UNITS_DESTROYED,
        target: 50,
        reward: '200金币',
        rarity: 'rare',
        icon: '☠️'
    },

    // === 造成伤害成就 ===
    {
        id: 'damage_dealer',
        name: '伤害输出者',
        description: '累计造成100点伤害',
        type: ACHIEVEMENT_TYPES.DAMAGE_DEALT,
        target: 100,
        reward: '50金币',
        rarity: 'common',
        icon: '⚡'
    },
    {
        id: 'damage_lord',
        name: '伤害领主',
        description: '累计造成1000点伤害',
        type: ACHIEVEMENT_TYPES.DAMAGE_DEALT,
        target: 1000,
        reward: '300金币',
        rarity: 'rare',
        icon: '🔥'
    },

    // === 特殊成就 ===
    {
        id: 'perfect_game',
        name: '完美胜利',
        description: '在不损失任何单位的情况下获得胜利',
        type: ACHIEVEMENT_TYPES.PERFECT_GAME,
        target: 1,
        reward: '500金币',
        rarity: 'legendary',
        icon: '✨'
    },
    {
        id: 'speed_demon',
        name: '闪电战',
        description: '在5个回合内获得胜利',
        type: ACHIEVEMENT_TYPES.FAST_WIN,
        target: 1,
        reward: '300金币',
        rarity: 'epic',
        icon: '⚡'
    },
    {
        id: 'combo_master',
        name: '连击大师',
        description: '在一个回合内摧毁3个敌方单位',
        type: ACHIEVEMENT_TYPES.COMBO_KILLS,
        target: 1,
        reward: '200金币',
        rarity: 'rare',
        icon: '💀'
    },
    {
        id: 'legendary_user',
        name: '传说之力',
        description: '使用一张传说卡牌获得胜利',
        type: ACHIEVEMENT_TYPES.SPECIAL_CARD,
        target: 1,
        reward: '150金币',
        rarity: 'rare',
        icon: '🌟'
    }
];

// ==================== 成就系统类 ====================
class AchievementSystem {
    constructor() {
        this.achievements = ACHIEVEMENTS;
        this.progress = this.loadProgress();
        this.unlockedAchievements = this.progress.unlocked || [];
        this.currentProgress = this.progress.current || {};
        this.gold = this.progress.gold || 0;
    }

    /**
     * 加载进度
     * @returns {Object} 进度数据
     */
    loadProgress() {
        try {
            const saved = localStorage.getItem('kards_achievements');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error('加载成就进度失败:', error);
        }
        return {
            unlocked: [],
            current: {},
            gold: 0
        };
    }

    /**
     * 保存进度
     */
    saveProgress() {
        try {
            const data = {
                unlocked: this.unlockedAchievements,
                current: this.currentProgress,
                gold: this.gold
            };
            localStorage.setItem('kards_achievements', JSON.stringify(data));
        } catch (error) {
            console.error('保存成就进度失败:', error);
        }
    }

    /**
     * 更新进度
     * @param {string} type - 成就类型
     * @param {number} amount - 增加量
     * @param {Object} context - 上下文信息
     */
    updateProgress(type, amount, context = {}) {
        const relevantAchievements = this.achievements.filter(a => a.type === type);
        
        relevantAchievements.forEach(achievement => {
            if (this.unlockedAchievements.includes(achievement.id)) {
                return; // 已解锁
            }

            // 初始化进度
            if (!this.currentProgress[achievement.id]) {
                this.currentProgress[achievement.id] = 0;
            }

            // 更新进度
            this.currentProgress[achievement.id] += amount;

            // 检查是否完成
            if (this.currentProgress[achievement.id] >= achievement.target) {
                this.unlockAchievement(achievement);
            }
        });

        this.saveProgress();
    }

    /**
     * 解锁成就
     * @param {Object} achievement - 成就对象
     */
    unlockAchievement(achievement) {
        if (this.unlockedAchievements.includes(achievement.id)) {
            return;
        }

        this.unlockedAchievements.push(achievement.id);

        // 处理奖励
        if (achievement.reward) {
            this.processReward(achievement.reward);
        }

        // 触发成就解锁事件
        this.onAchievementUnlocked(achievement);

        console.log(`🏆 成就解锁: ${achievement.name}`);
    }

    /**
     * 处理奖励
     * @param {string} reward - 奖励描述
     */
    processReward(reward) {
        if (reward.includes('金币')) {
            const amount = parseInt(reward.match(/\d+/)[0]);
            this.gold += amount;
        } else if (reward.includes('卡背')) {
            // 解锁卡背逻辑（可以后续实现）
            console.log('解锁新卡背:', reward);
        }
    }

    /**
     * 获取成就进度
     * @param {string} achievementId - 成就ID
     * @returns {Object} 进度信息
     */
    getAchievementProgress(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (!achievement) return null;

        const current = this.currentProgress[achievementId] || 0;
        const isUnlocked = this.unlockedAchievements.includes(achievementId);

        return {
            current,
            target: achievement.target,
            percentage: Math.min(100, (current / achievement.target) * 100),
            isUnlocked
        };
    }

    /**
     * 获取所有成就状态
     * @returns {Array} 成就状态数组
     */
    getAllAchievements() {
        return this.achievements.map(achievement => ({
            ...achievement,
            progress: this.getAchievementProgress(achievement.id)
        }));
    }

    /**
     * 获取已解锁成就
     * @returns {Array} 已解锁成就数组
     */
    getUnlockedAchievements() {
        return this.achievements.filter(a => 
            this.unlockedAchievements.includes(a.id)
        ).map(achievement => ({
            ...achievement,
            progress: this.getAchievementProgress(achievement.id)
        }));
    }

    /**
     * 获取金币数量
     * @returns {number} 金币数量
     */
    getGold() {
        return this.gold;
    }

    /**
     * 花费金币
     * @param {number} amount - 金币数量
     * @returns {boolean} 是否成功
     */
    spendGold(amount) {
        if (this.gold >= amount) {
            this.gold -= amount;
            this.saveProgress();
            return true;
        }
        return false;
    }

    /**
     * 成就解锁回调
     * @param {Object} achievement - 成就对象
     */
    onAchievementUnlocked(achievement) {
        // 可以在这里添加UI通知
        if (typeof ui !== 'undefined' && ui.showAchievementNotification) {
            ui.showAchievementNotification(achievement);
        }
    }

    /**
     * 游戏事件处理
     * @param {string} event - 事件类型
     * @param {Object} data - 事件数据
     */
    handleGameEvent(event, data) {
        switch (event) {
            case 'game_started':
                // 游戏开始时不更新
                break;

            case 'game_ended':
                if (data.winner) {
                    this.updateProgress(ACHIEVEMENT_TYPES.GAMES_PLAYED, 1);
                    this.updateProgress(ACHIEVEMENT_TYPES.GAMES_WON, 1);
                    
                    // 检查特殊成就
                    if (data.perfectGame) {
                        this.unlockAchievement(
                            this.achievements.find(a => a.id === 'perfect_game')
                        );
                    }
                    if (data.fastWin) {
                        this.unlockAchievement(
                            this.achievements.find(a => a.id === 'speed_demon')
                        );
                    }
                } else {
                    this.updateProgress(ACHIEVEMENT_TYPES.GAMES_PLAYED, 1);
                }
                break;

            case 'card_played':
                this.updateProgress(ACHIEVEMENT_TYPES.CARDS_PLAYED, 1);
                
                // 检查传说卡牌使用
                if (data.card && data.card.rarity === RARITY.LEGENDARY) {
                    this.updateProgress(ACHIEVEMENT_TYPES.SPECIAL_CARD, 1);
                }
                break;

            case 'unit_destroyed':
                this.updateProgress(ACHIEVEMENT_TYPES.UNITS_DESTROYED, 1);
                break;

            case 'damage_dealt':
                this.updateProgress(ACHIEVEMENT_TYPES.DAMAGE_DEALT, data.amount);
                break;

            case 'combo_kill':
                if (data.count >= 3) {
                    this.unlockAchievement(
                        this.achievements.find(a => a.id === 'combo_master')
                    );
                }
                break;
        }
    }

    /**
     * 重置进度（用于测试）
     */
    resetProgress() {
        this.unlockedAchievements = [];
        this.currentProgress = {};
        this.gold = 0;
        this.saveProgress();
    }
}

// 创建全局实例
const achievementSystem = new AchievementSystem();

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AchievementSystem,
        ACHIEVEMENTS,
        ACHIEVEMENT_TYPES,
        achievementSystem
    };
}