/**
 * 卡背定制系统
 * 管理游戏卡背主题和自定义卡背
 */

// ==================== 卡背类型 ====================
const CARD_BACK_TYPES = {
    DEFAULT: 'default',
    ACHIEVEMENT: 'achievement',
    CUSTOM: 'custom',
    FACTION: 'faction'
};

// ==================== 预设卡背主题 ====================
const CARD_BACK_THEMES = [
    // === 默认卡背 ===
    {
        id: 'default',
        name: '经典卡背',
        type: CARD_BACK_TYPES.DEFAULT,
        rarity: 'common',
        description: '游戏默认卡背',
        backgroundColor: '#1a1a2e',
        borderColor: '#4169E1',
        pattern: 'default',
        icon: '🎴',
        unlocked: true
    },
    
    // === 成就解锁卡背 ===
    {
        id: 'newbie',
        name: '新手卡背',
        type: CARD_BACK_TYPES.ACHIEVEMENT,
        rarity: 'common',
        description: '完成"初次交锋"成就解锁',
        achievementId: 'first_blood',
        backgroundColor: '#2d5a27',
        borderColor: '#4CAF50',
        pattern: 'stripe',
        icon: '🌱',
        unlocked: false
    },
    {
        id: 'veteran',
        name: '老兵卡背',
        type: CARD_BACK_TYPES.ACHIEVEMENT,
        rarity: 'rare',
        description: '完成"战场老兵"成就解锁',
        achievementId: 'veteran',
        backgroundColor: '#5a4027',
        borderColor: '#8B4513',
        pattern: 'crosshatch',
        icon: '🎖️',
        unlocked: false
    },
    {
        id: 'warlord',
        name: '领主卡背',
        type: CARD_BACK_TYPES.ACHIEVEMENT,
        rarity: 'epic',
        description: '完成"战争领主"成就解锁',
        achievementId: 'warlord',
        backgroundColor: '#4a0e0e',
        borderColor: '#DC143C',
        pattern: 'diamond',
        icon: '👑',
        unlocked: false
    },
    {
        id: 'legendary',
        name: '传说卡背',
        type: CARD_BACK_TYPES.ACHIEVEMENT,
        rarity: 'legendary',
        description: '完成"传说级指挥官"成就解锁',
        achievementId: 'legendary',
        backgroundColor: '#1a1a4e',
        borderColor: '#FFD700',
        pattern: 'starfield',
        icon: '🌟',
        unlocked: false
    },
    
    // === 阵营卡背 ===
    {
        id: 'germany',
        name: '德国卡背',
        type: CARD_BACK_TYPES.FACTION,
        rarity: 'rare',
        description: '使用德国阵营解锁',
        faction: 'germany',
        backgroundColor: '#2a2a1a',
        borderColor: '#FFD700',
        pattern: 'iron_cross',
        icon: '🇩🇪',
        unlocked: true
    },
    {
        id: 'usa',
        name: '美国卡背',
        type: CARD_BACK_TYPES.FACTION,
        rarity: 'rare',
        description: '使用美国阵营解锁',
        faction: 'usa',
        backgroundColor: '#1a2a4a',
        borderColor: '#4169E1',
        pattern: 'stars',
        icon: '🇺🇸',
        unlocked: true
    },
    {
        id: 'britain',
        name: '英国卡背',
        type: CARD_BACK_TYPES.FACTION,
        rarity: 'rare',
        description: '使用英国阵营解锁',
        faction: 'britain',
        backgroundColor: '#2a1a1a',
        borderColor: '#DC143C',
        pattern: 'union_jack',
        icon: '🇬🇧',
        unlocked: true
    },
    {
        id: 'soviet',
        name: '苏联卡背',
        type: CARD_BACK_TYPES.FACTION,
        rarity: 'rare',
        description: '使用苏联阵营解锁',
        faction: 'soviet',
        backgroundColor: '#1a1a2a',
        borderColor: '#FF0000',
        pattern: 'hammer_sickle',
        icon: '🇷🇺',
        unlocked: true
    },
    {
        id: 'japan',
        name: '日本卡背',
        type: CARD_BACK_TYPES.FACTION,
        rarity: 'rare',
        description: '使用日本阵营解锁',
        faction: 'japan',
        backgroundColor: '#2a1a1a',
        borderColor: '#FF69B4',
        pattern: 'rising_sun',
        icon: '🇯🇵',
        unlocked: true
    },
    
    // === 特殊卡背 ===
    {
        id: 'perfect_victory',
        name: '完美胜利卡背',
        type: CARD_BACK_TYPES.ACHIEVEMENT,
        rarity: 'legendary',
        description: '完成"完美胜利"成就解锁',
        achievementId: 'perfect_game',
        backgroundColor: '#1a3a2a',
        borderColor: '#00FF00',
        pattern: 'medal',
        icon: '✨',
        unlocked: false
    },
    {
        id: 'speed_demon',
        name: '闪电战卡背',
        type: CARD_BACK_TYPES.ACHIEVEMENT,
        rarity: 'epic',
        description: '完成"闪电战"成就解锁',
        achievementId: 'speed_demon',
        backgroundColor: '#2a2a1a',
        borderColor: '#FF4500',
        pattern: 'lightning',
        icon: '⚡',
        unlocked: false
    }
];

// ==================== 卡背系统类 ====================
class CardBackSystem {
    constructor() {
        this.themes = CARD_BACK_THEMES;
        this.currentBack = this.loadCurrentBack();
        this.customBacks = this.loadCustomBacks();
        this.unlockedThemes = this.loadUnlockedThemes();
    }

    /**
     * 加载当前卡背
     * @returns {string} 卡背ID
     */
    loadCurrentBack() {
        try {
            const saved = localStorage.getItem('kards_cardback');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error('加载卡背失败:', error);
        }
        return 'default';
    }

    /**
     * 保存当前卡背
     * @param {string} backId - 卡背ID
     */
    saveCurrentBack(backId) {
        try {
            localStorage.setItem('kards_cardback', JSON.stringify(backId));
            this.currentBack = backId;
        } catch (error) {
            console.error('保存卡背失败:', error);
        }
    }

    /**
     * 加载已解锁的卡背
     * @returns {Array} 已解锁卡背ID数组
     */
    loadUnlockedThemes() {
        try {
            const saved = localStorage.getItem('kards_unlocked_backs');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error('加载已解锁卡背失败:', error);
        }
        
        // 默认解锁默认卡背和阵营卡背
        return ['default', 'germany', 'usa', 'britain', 'soviet', 'japan'];
    }

    /**
     * 保存已解锁的卡背
     */
    saveUnlockedThemes() {
        try {
            localStorage.setItem('kards_unlocked_backs', JSON.stringify(this.unlockedThemes));
        } catch (error) {
            console.error('保存已解锁卡背失败:', error);
        }
    }

    /**
     * 加载自定义卡背
     * @returns {Array} 自定义卡背数组
     */
    loadCustomBacks() {
        try {
            const saved = localStorage.getItem('kards_custom_backs');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error('加载自定义卡背失败:', error);
        }
        return [];
    }

    /**
     * 保存自定义卡背
     * @param {Array} customBacks - 自定义卡背数组
     */
    saveCustomBacks(customBacks) {
        try {
            localStorage.setItem('kards_custom_backs', JSON.stringify(customBacks));
            this.customBacks = customBacks;
        } catch (error) {
            console.error('保存自定义卡背失败:', error);
        }
    }

    /**
     * 获取当前卡背
     * @returns {Object} 卡背对象
     */
    getCurrentBack() {
        return this.getThemeById(this.currentBack);
    }

    /**
     * 获取卡背主题
     * @param {string} themeId - 主题ID
     * @returns {Object} 卡背主题对象
     */
    getThemeById(themeId) {
        // 先在预设主题中查找
        let theme = this.themes.find(t => t.id === themeId);
        
        // 如果没找到，在自定义卡背中查找
        if (!theme) {
            theme = this.customBacks.find(t => t.id === themeId);
        }
        
        return theme || this.themes[0];
    }

    /**
     * 获取所有可用卡背
     * @returns {Array} 卡背主题数组
     */
    getAllThemes() {
        return [...this.themes, ...this.customBacks];
    }

    /**
     * 获取已解锁的卡背
     * @returns {Array} 已解锁卡背数组
     */
    getUnlockedThemes() {
        const allThemes = this.getAllThemes();
        return allThemes.filter(theme => this.isThemeUnlocked(theme.id));
    }

    /**
     * 检查卡背是否已解锁
     * @param {string} themeId - 主题ID
     * @returns {boolean} 是否已解锁
     */
    isThemeUnlocked(themeId) {
        const theme = this.getThemeById(themeId);
        
        // 检查是否在已解锁列表中
        if (this.unlockedThemes.includes(themeId)) {
            return true;
        }
        
        // 检查是否是默认卡背
        if (theme.type === CARD_BACK_TYPES.DEFAULT) {
            return true;
        }
        
        // 检查是否是阵营卡背（总是解锁）
        if (theme.type === CARD_BACK_TYPES.FACTION) {
            return true;
        }
        
        // 检查是否需要成就解锁
        if (theme.type === CARD_BACK_TYPES.ACHIEVEMENT && theme.achievementId) {
            return achievementSystem.unlockedAchievements.includes(theme.achievementId);
        }
        
        return false;
    }

    /**
     * 解锁卡背
     * @param {string} themeId - 主题ID
     */
    unlockTheme(themeId) {
        if (!this.unlockedThemes.includes(themeId)) {
            this.unlockedThemes.push(themeId);
            this.saveUnlockedThemes();
        }
    }

    /**
     * 设置当前卡背
     * @param {string} themeId - 主题ID
     * @returns {boolean} 是否成功
     */
    setCurrentBack(themeId) {
        if (!this.isThemeUnlocked(themeId)) {
            console.warn('卡背未解锁:', themeId);
            return false;
        }
        
        this.saveCurrentBack(themeId);
        return true;
    }

    /**
     * 创建自定义卡背
     * @param {Object} themeData - 卡背数据
     * @returns {Object} 创建的卡背主题
     */
    createCustomBack(themeData) {
        const customBack = {
            id: 'custom_' + Date.now(),
            type: CARD_BACK_TYPES.CUSTOM,
            rarity: 'custom',
            name: themeData.name || '自定义卡背',
            description: themeData.description || '玩家自定义卡背',
            backgroundColor: themeData.backgroundColor || '#1a1a2e',
            borderColor: themeData.borderColor || '#4169E1',
            pattern: themeData.pattern || 'default',
            icon: themeData.icon || '🎨',
            unlocked: true,
            createdAt: new Date().toISOString()
        };
        
        this.customBacks.push(customBack);
        this.saveCustomBacks(this.customBacks);
        
        return customBack;
    }

    /**
     * 删除自定义卡背
     * @param {string} themeId - 主题ID
     * @returns {boolean} 是否成功
     */
    deleteCustomBack(themeId) {
        const index = this.customBacks.findIndex(t => t.id === themeId);
        if (index !== -1) {
            this.customBacks.splice(index, 1);
            this.saveCustomBacks(this.customBacks);
            
            // 如果删除的是当前卡背，切换到默认卡背
            if (this.currentBack === themeId) {
                this.setCurrentBack('default');
            }
            
            return true;
        }
        return false;
    }

    /**
     * 更新卡背解锁状态
     * 检查所有成就解锁的卡背
     */
    updateUnlockStatus() {
        this.themes.forEach(theme => {
            if (theme.type === CARD_BACK_TYPES.ACHIEVEMENT && theme.achievementId) {
                if (achievementSystem.unlockedAchievements.includes(theme.achievementId)) {
                    this.unlockTheme(theme.id);
                }
            }
        });
    }

    /**
     * 生成卡背CSS样式
     * @param {string} themeId - 主题ID
     * @returns {string} CSS样式字符串
     */
    getCardBackCSS(themeId) {
        const theme = this.getThemeById(themeId);
        
        return `
            background: ${theme.backgroundColor};
            border: 3px solid ${theme.borderColor};
            background-image: ${this.getPatternCSS(theme.pattern)};
        `;
    }

    /**
     * 获取图案CSS
     * @param {string} pattern - 图案类型
     * @returns {string} CSS样式字符串
     */
    getPatternCSS(pattern) {
        const patterns = {
            'default': 'none',
            'stripe': 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent)',
            'crosshatch': 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)',
            'diamond': 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            'starfield': 'radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 3px)',
            'iron_cross': 'linear-gradient(45deg, transparent 45%, rgba(255,215,0,0.3) 45%, rgba(255,215,0,0.3) 55%, transparent 55%)',
            'stars': 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
            'union_jack': 'linear-gradient(90deg, rgba(255,0,0,0.2) 50%, rgba(0,0,255,0.2) 50%)',
            'hammer_sickle': 'linear-gradient(45deg, rgba(255,0,0,0.2) 50%, rgba(255,215,0,0.2) 50%)',
            'rising_sun': 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
            'medal': 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 50%)',
            'lightning': 'linear-gradient(135deg, rgba(255,69,0,0.3) 0%, transparent 100%)'
        };
        
        return patterns[pattern] || patterns['default'];
    }
}

// 创建全局实例
const cardBackSystem = new CardBackSystem();

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CardBackSystem,
        CARD_BACK_TYPES,
        CARD_BACK_THEMES,
        cardBackSystem
    };
}