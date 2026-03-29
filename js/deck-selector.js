/**
 * 牌组选择器
 * 用于在联机对战中选择牌组
 */

class DeckSelector {
    constructor() {
        this.selectedDeck = null;
        this.mode = 'normal'; // 'normal' or 'multiplayer'
    }

    /**
     * 设置模式
     * @param {string} mode - 模式
     */
    setMode(mode) {
        this.mode = mode;
    }

    /**
     * 获取模式
     * @returns {string} 模式
     */
    getMode() {
        return this.mode;
    }

    /**
     * 选择牌组
     * @param {Object} deck - 牌组对象
     */
    selectDeck(deck) {
        this.selectedDeck = deck;
    }

    /**
     * 获取选中的牌组
     * @returns {Object} 牌组对象
     */
    getSelectedDeck() {
        return this.selectedDeck;
    }

    /**
     * 清除选择
     */
    clearSelection() {
        this.selectedDeck = null;
        this.mode = 'normal';
    }
}

// 创建全局实例
const deckSelector = new DeckSelector();

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DeckSelector;
}