/**
 * 牌组构建系统
 * 允许玩家构建和管理牌组
 */

class DeckBuilder {
    constructor() {
        this.currentDeck = [];
        this.mainFaction = null;
        this.secondaryFaction = null;
        this.availableCards = [];
        this.maxDeckSize = GAME_RULES.DECK_SIZE;
        this.maxCopiesPerCard = GAME_RULES.MAX_CARD_COPIES;
    }

    /**
     * 设置阵营（主阵营 + 次阵营）
     * @param {string} mainFactionId - 主阵营ID
     * @param {string} secondaryFactionId - 次阵营ID（可为null）
     */
    setFactions(mainFactionId, secondaryFactionId = null) {
        this.mainFaction = mainFactionId;
        this.secondaryFaction = secondaryFactionId;
        this.filterAvailableCards();
    }

    /**
     * 获取主阵营
     * @returns {string} 主阵营ID
     */
    getMainFaction() {
        return this.mainFaction;
    }

    /**
     * 获取次阵营
     * @returns {string|null} 次阵营ID
     */
    getSecondaryFaction() {
        return this.secondaryFaction;
    }

    /**
     * 添加卡牌到牌组
     * @param {Object} card - 卡牌对象
     * @returns {Object} 添加结果
     */
    addCardToDeck(card) {
        const result = {
            success: false,
            message: ''
        };

        // 检查牌组是否已满
        if (this.currentDeck.length >= this.maxDeckSize) {
            result.message = '牌组已满';
            return result;
        }

        // 检查卡牌数量限制
        const cardCount = this.currentDeck.filter(c => c.id === card.id).length;
        if (cardCount >= this.maxCopiesPerCard) {
            result.message = '该卡牌已达最大数量限制';
            return result;
        }

        // 检查阵营限制
        if (!this.isCardAllowed(card)) {
            result.message = '该卡牌不属于当前阵营';
            return result;
        }

        // 添加到牌组
        this.currentDeck.push(card);
        result.success = true;
        result.message = `${card.name} 已添加到牌组`;

        return result;
    }

    /**
     * 从牌组移除卡牌
     * @param {number} index - 卡牌索引
     * @returns {Object} 移除结果
     */
    removeCardFromDeck(index) {
        const result = {
            success: false,
            message: ''
        };

        if (index < 0 || index >= this.currentDeck.length) {
            result.message = '无效的索引';
            return result;
        }

        const card = this.currentDeck.splice(index, 1)[0];
        result.success = true;
        result.message = `${card.name} 已从牌组移除`;

        return result;
    }

    /**
     * 清空牌组
     */
    clearDeck() {
        this.currentDeck = [];
    }

    /**
     * 获取当前牌组
     * @returns {Array} 当前牌组
     */
    getCurrentDeck() {
        return this.currentDeck;
    }

    /**
     * 获取牌组统计信息
     * @returns {Object} 统计信息
     */
    getDeckStats() {
        const stats = {
            totalCards: this.currentDeck.length,
            byType: {},
            byCost: {},
            byFaction: {},
            averageCost: 0,
            totalCost: 0
        };

        this.currentDeck.forEach(card => {
            // 按类型统计
            if (!stats.byType[card.type]) {
                stats.byType[card.type] = 0;
            }
            stats.byType[card.type]++;

            // 按费用统计
            if (!stats.byCost[card.cost]) {
                stats.byCost[card.cost] = 0;
            }
            stats.byCost[card.cost]++;

            // 按阵营统计
            if (!stats.byFaction[card.faction]) {
                stats.byFaction[card.faction] = 0;
            }
            stats.byFaction[card.faction]++;

            // 计算总费用
            stats.totalCost += card.cost;
        });

        // 计算平均费用
        if (this.currentDeck.length > 0) {
            stats.averageCost = stats.totalCost / this.currentDeck.length;
        }

        return stats;
    }

    /**
     * 验证牌组
     * @returns {Object} 验证结果
     */
    validateDeck() {
        const validation = {
            valid: true,
            errors: [],
            warnings: []
        };

        // 检查牌组大小
        if (this.currentDeck.length !== this.maxDeckSize) {
            validation.valid = false;
            validation.errors.push(`牌组必须是 ${this.maxDeckSize} 张卡牌`);
        }

        // 检查主阵营
        if (!this.mainFaction) {
            validation.valid = false;
            validation.errors.push('必须选择主阵营');
        }

        // 检查每张卡牌
        const cardCounts = {};
        this.currentDeck.forEach(card => {
            if (!cardCounts[card.id]) {
                cardCounts[card.id] = 0;
            }
            cardCounts[card.id]++;

            // 检查卡牌数量限制
            if (cardCounts[card.id] > this.maxCopiesPerCard) {
                validation.valid = false;
                validation.errors.push(`${card.name} 超过最大数量限制`);
            }

            // 检查阵营限制
            if (!this.isCardAllowed(card)) {
                validation.valid = false;
                validation.errors.push(`${card.name} 不属于 ${this.mainFaction} 阵营`);
            }
        });

        // 检查费用曲线
        const stats = this.getDeckStats();
        const highCostCards = Object.entries(stats.byCost)
            .filter(([cost]) => parseInt(cost) >= 6)
            .reduce((sum, [_, count]) => sum + count, 0);

        if (highCostCards > 10) {
            validation.warnings.push('高费用卡牌过多，可能导致前期卡手');
        }

        return validation;
    }

    /**
     * 检查卡牌是否允许加入牌组
     * @param {Object} card - 卡牌对象
     * @returns {boolean} 是否允许
     */
    isCardAllowed(card) {
        // 中立卡牌总是允许
        if (card.faction === 'neutral') {
            return true;
        }

        // 必须匹配主阵营或次阵营
        if (card.faction === this.mainFaction) {
            return true;
        }

        if (this.secondaryFaction && card.faction === this.secondaryFaction) {
            return true;
        }

        return false;
    }

    /**
     * 设置可用卡牌
     * @param {Array} cards - 卡牌数组
     */
    setAvailableCards(cards) {
        this.availableCards = cards;
        this.filterAvailableCards();
    }

    /**
     * 根据阵营过滤可用卡牌
     */
    filterAvailableCards() {
        if (!this.mainFaction) {
            this.filteredCards = this.availableCards;
            return;
        }

        this.filteredCards = this.availableCards.filter(card =>
            card.faction === 'neutral' ||
            card.faction === this.mainFaction ||
            (this.secondaryFaction && card.faction === this.secondaryFaction)
        );
    }

    /**
     * 获取过滤后的可用卡牌
     * @returns {Array} 可用卡牌数组
     */
    getAvailableCards() {
        return this.filteredCards || this.availableCards;
    }

    /**
     * 按类型过滤卡牌
     * @param {string} type - 卡牌类型
     * @returns {Array} 过滤后的卡牌数组
     */
    filterByType(type) {
        const cards = this.getAvailableCards();
        if (type === 'all') {
            return cards;
        }
        return cards.filter(card => card.type === type);
    }

    /**
     * 按费用过滤卡牌
     * @param {string} costRange - 费用范围
     * @returns {Array} 过滤后的卡牌数组
     */
    filterByCost(costRange) {
        const cards = this.getAvailableCards();
        if (costRange === 'all') {
            return cards;
        }

        if (costRange === '6+') {
            return cards.filter(card => card.cost >= 6);
        }

        const [min, max] = costRange.split('-').map(Number);
        return cards.filter(card => card.cost >= min && card.cost <= max);
    }

    /**
     * 保存牌组
     * @param {string} deckName - 牌组名称
     * @returns {Object} 保存结果
     */
    saveDeck(deckName) {
        const result = {
            success: false,
            message: ''
        };

        const validation = this.validateDeck();
        if (!validation.valid) {
            result.message = '牌组无效，无法保存';
            return result;
        }

        // 创建牌组数据
        const deckData = {
            name: deckName,
            mainFaction: this.mainFaction,
            secondaryFaction: this.secondaryFaction,
            cardIds: this.currentDeck.map(card => card.id),
            created: new Date().toISOString(),
            stats: this.getDeckStats()
        };

        // 保存到本地存储
        try {
            const savedDecks = this.loadAllDecks();
            savedDecks.push(deckData);
            localStorage.setItem('kards_decks', JSON.stringify(savedDecks));

            result.success = true;
            result.message = '牌组保存成功';
        } catch (error) {
            result.message = '保存失败: ' + error.message;
        }

        return result;
    }

    /**
     * 加载牌组
     * @param {Object} deckData - 牌组数据
     * @param {Array} allCards - 所有卡牌
     * @returns {Object} 加载结果
     */
    loadDeck(deckData, allCards) {
        const result = {
            success: false,
            message: ''
        };

        try {
            this.mainFaction = deckData.mainFaction || deckData.faction;
            this.secondaryFaction = deckData.secondaryFaction || null;
            this.currentDeck = deckData.cardIds.map(cardId =>
                allCards.find(card => card.id === cardId)
            ).filter(card => card !== undefined);

            result.success = true;
            result.message = '牌组加载成功';
        } catch (error) {
            result.message = '加载失败: ' + error.message;
        }

        return result;
    }

    /**
     * 加载所有保存的牌组
     * @returns {Array} 牌组数组
     */
    loadAllDecks() {
        try {
            const decksJson = localStorage.getItem('kards_decks');
            return decksJson ? JSON.parse(decksJson) : [];
        } catch (error) {
            console.error('加载牌组失败:', error);
            return [];
        }
    }

    /**
     * 删除保存的牌组
     * @param {string} deckName - 牌组名称
     * @returns {boolean} 是否删除成功
     */
    deleteSavedDeck(deckName) {
        try {
            const savedDecks = this.loadAllDecks();
            const filteredDecks = savedDecks.filter(deck => deck.name !== deckName);
            localStorage.setItem('kards_decks', JSON.stringify(filteredDecks));
            return true;
        } catch (error) {
            console.error('删除牌组失败:', error);
            return false;
        }
    }

    /**
     * 自动填充牌组
     * @returns {Object} 填充结果
     */
    autoFillDeck() {
        const result = {
            success: false,
            message: ''
        };

        if (!this.mainFaction) {
            result.message = '请先选择主阵营';
            return result;
        }

        // 清空当前牌组
        this.clearDeck();

        // 获取可用卡牌
        const availableCards = this.getAvailableCards();

        // 按优先级排序（优先选择低费用卡牌）
        const sortedCards = [...availableCards].sort((a, b) => a.cost - b.cost);

        // 填充牌组
        while (this.currentDeck.length < this.maxDeckSize && sortedCards.length > 0) {
            for (const card of sortedCards) {
                if (this.currentDeck.length >= this.maxDeckSize) break;

                const addResult = this.addCardToDeck(card);
                if (!addResult.success) {
                    continue;
                }
            }
        }

        if (this.currentDeck.length === this.maxDeckSize) {
            result.success = true;
            result.message = '牌组自动填充完成';
        } else {
            result.message = '可用卡牌不足，无法完整填充牌组';
        }

        return result;
    }

    /**
     * 清除阵营选择
     */
    clearFactions() {
        this.mainFaction = null;
        this.secondaryFaction = null;
        this.clearDeck();
        this.filterAvailableCards();
    }
}

// 创建全局实例
const deckBuilder = new DeckBuilder();

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DeckBuilder;
}