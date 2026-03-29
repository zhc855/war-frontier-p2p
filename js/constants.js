/**
 * 游戏常量定义
 * 包含所有游戏规则和系统常量
 */

// ==================== 游戏规则常量 ====================
const GAME_RULES = {
    // 指挥点系统
    MAX_CP: 12,                    // 最大指挥点
    START_CP: 1,                   // 初始指挥点
    CP_GROWTH_PER_TURN: 1,         // 每回合指挥点增长量
    
    // 牌组系统
    DECK_SIZE: 40,                 // 牌组卡牌数量
    MAX_CARD_COPIES: 3,            // 每种卡牌最多3张
    HAND_SIZE: 10,                 // 手牌上限
    START_HAND_SIZE: 4,            // 起始手牌数量
    
    // 战场系统
    SUPPORT_LINE_SIZE: 4,          // 支援战线格子数
    FRONTLINE_SIZE: 4,             // 前线格子数
    HQ_START_HP: 20,               // 总部初始生命值
    
    // 回合系统
    MAX_TURNS: 99,                 // 最大回合数（防止无限游戏）
    
    // 抽牌系统
    CARDS_DRAWN_PER_TURN: 1,       // 每回合抽牌数量
    MAX_DECK_SIZE: 100             // 最大牌组大小
};

// ==================== 阵营系统 ====================
const FACTIONS = {
    GERMANY: {
        id: 'germany',
        name: '德国',
        emoji: '🇩🇪',
        color: '#FFD700',
        description: '强力坦克和装甲单位',
        keywords: ['blitzkrieg', 'armor'],
        bonus: '装甲单位+1护甲'
    },
    USA: {
        id: 'usa',
        name: '美国',
        emoji: '🇺🇸',
        color: '#4169E1',
        description: '均衡发展，强力空军',
        keywords: ['air superiority', 'logistics'],
        bonus: '空军单位+1攻击力'
    },
    BRITAIN: {
        id: 'britain',
        name: '英国',
        emoji: '🇬🇧',
        color: '#DC143C',
        description: '防守反击，皇家海军',
        keywords: ['naval', 'defensive'],
        bonus: '单位+1生命值'
    },
    SOVIET: {
        id: 'soviet',
        name: '苏联',
        emoji: '🇷🇺',
        color: '#FF0000',
        description: '人海战术，火炮支援',
        keywords: ['mass assault', 'artillery'],
        bonus: '步兵单位-1费用'
    },
    JAPAN: {
        id: 'japan',
        name: '日本',
        emoji: '🇯🇵',
        color: '#FFFFFF',
        description: '轻型机动，特殊战术',
        keywords: ['mobile', 'surprise'],
        bonus: '单位+1移动次数'
    },
    NEUTRAL: {
        id: 'neutral',
        name: '中立',
        emoji: '⚪',
        color: '#808080',
        description: '通用卡牌',
        keywords: [],
        bonus: '无'
    }
};

// ==================== 卡牌类型 ====================
const CARD_TYPES = {
    UNIT: 'unit',                  // 单位卡 - 部署到战场
    ORDER: 'order',                // 指令卡 - 立即生效
    REINFORCEMENT: 'reinforcement',// 增援卡 - 直接获得单位
    SUPPRESSION: 'suppression',    // 压制卡 - 降低敌方单位状态
    SUPPORT: 'support',            // 支援卡 - 增强己方单位
    COUNTER: 'counter'             // 反击卡 - 被动触发
};

// ==================== 单位类型 ====================
const UNIT_TYPES = {
    INFANTRY: 'infantry',          // 步兵
    TANK: 'tank',                  // 坦克
    ARTILLERY: 'artillery',        // 炮兵
    FIGHTER: 'fighter',            // 战斗机
    BOMBER: 'bomber',              // 轰炸机
    SHIP: 'ship',                  // 舰船
    FORTIFICATION: 'fortification',// 防御工事
    HQ: 'hq'                       // 总部
};

// ==================== 关键字系统 ====================
const KEYWORDS = {
    // 战斗关键字
    BLITZ: 'blitz',                // 突击 - 攻击时不受到反击伤害
    ANTI_TANK: 'anti_tank',        // 反坦克 - 攻击坦克/装甲单位时伤害翻倍
    ANTI_AIR: 'anti_air',          // 对空 - 攻击飞行单位时伤害翻倍
    ARMOR: 'armor',                // 装甲 - 减少受到的伤害
    BOMBARDMENT: 'bombardment',    // 轰炸 - 可以从任意位置攻击
    FIRST_STRIKE: 'first_strike',  // 先攻 - 在敌人反击前造成伤害
    
    // 防御关键字
    SUPPORT: 'support',            // 支援 - 提供支援效果给相邻单位
    SMOKE: 'smoke',                // 烟雾 - 无法被直接攻击
    STEALTH: 'stealth',            // 潜行 - 攻击前无法被选中
    DEFENDER: 'defender',          // 防守者 - 被动时+1护甲
    RESISTANCE: 'resistance',      // 抵抗 - 对特定效果免疫
    
    // 状态关键字
    SUPPRESSED: 'suppressed',      // 压制 - 无法攻击或使用能力
    MORALE: 'morale',              // 士气 - 提升相邻单位的战斗力
    BUFFED: 'buffed',              // 强化 - 属性提升
    WEAKENED: 'weakened',          // 削弱 - 属性降低
    
    // 部署关键字
    DEPLOY: 'deploy',              // 部署 - 部署时触发效果
    RUSH: 'rush',                  // 冲锋 - 部署后可以立即行动
    HOLD: 'hold',                  // 坚守 - 前线单位死亡时移至前线
    RELAY: 'relay',                // 接力 - 死亡时让相邻单位行动
    
    // 特殊关键字
    UNIQUE: 'unique',              // 独特 - 牌组中只能放1张
    LIMITED: 'limited',            // 限制 - 特殊限制条件
    LEGENDARY: 'legendary',        // 传说 - 稀有卡牌
    ELITE: 'elite'                 // 精英 - 高级单位
};

// ==================== 效果类型 ====================
const EFFECT_TYPES = {
    // 属性效果
    MODIFY_ATTACK: 'modify_attack',       // 修改攻击力
    MODIFY_HP: 'modify_hp',               // 修改生命值
    MODIFY_ARMOR: 'modify_armor',         // 修改护甲
    MODIFY_COST: 'modify_cost',           // 修改费用
    
    // 战斗效果
    DEAL_DAMAGE: 'deal_damage',           // 造成伤害
    HEAL: 'heal',                         // 治疗
    DESTROY: 'destroy',                   // 摧毁
    BOUNCE: 'bounce',                     // 返回手牌
    
    // 状态效果
    ADD_KEYWORD: 'add_keyword',           // 添加关键字
    REMOVE_KEYWORD: 'remove_keyword',     // 移除关键字
    ADD_STATUS: 'add_status',             // 添加状态
    REMOVE_STATUS: 'remove_status',       // 移除状态
    
    // 移动效果
    MOVE_UNIT: 'move_unit',               // 移动单位
    SWAP_POSITIONS: 'swap_positions',     // 交换位置
    TELEPORT: 'teleport',                 // 传送
    
    // 抽牌效果
    DRAW_CARDS: 'draw_cards',             // 抽牌
    DISCARD_CARDS: 'discard_cards',       // 弃牌
    
    // 资源效果
    GAIN_CP: 'gain_cp',                   // 获得指挥点
    LOSE_CP: 'lose_cp',                   // 失去指挥点
    
    // 条件效果
    IF_CONDITION: 'if_condition',         // 条件判断
    CHOOSE_ONE: 'choose_one',             // 选择一个
    RANDOM_TARGET: 'random_target'        // 随机目标
};

// ==================== 事件类型 ====================
const EVENT_TYPES = {
    // 部署事件
    ON_DEPLOY: 'on_deploy',               // 部署时
    ON_ENTER: 'on_enter',                 // 进入战场时
    ON_LEAVE: 'on_leave',                 // 离开战场时
    
    // 战斗事件
    ON_ATTACK: 'on_attack',               // 攻击时
    ON_DEFEND: 'on_defend',               // 防御时
    ON_DEAL_DAMAGE: 'on_deal_damage',     // 造成伤害时
    ON_TAKE_DAMAGE: 'on_take_damage',     // 受到伤害时
    ON_DESTROY: 'on_destroy',             // 被摧毁时
    ON_KILL: 'on_kill',                   // 击杀单位时
    
    // 回合事件
    ON_TURN_START: 'on_turn_start',       // 回合开始时
    ON_TURN_END: 'on_turn_end',           // 回合结束时
    
    // 状态变化
    ON_HP_CHANGE: 'on_hp_change',         // 生命值变化时
    ON_POSITION_CHANGE: 'on_position_change', // 位置变化时
    
    // 特殊事件
    ON_COUNTER: 'on_counter',             // 反击时
    ON_OVERLOAD: 'on_overload'            // 超载时
};

// ==================== 状态类型 ====================
const STATUS_TYPES = {
    SUPPRESSED: 'suppressed',             // 压制 - 无法攻击
    STUNNED: 'stunned',                   // 眩晕 - 无法行动
    FROZEN: 'frozen',                     // 冻结 - 无法移动
    BURNING: 'burning',                   // 燃烧 - 每回合受到伤害
    POISONED: 'poisoned',                 // 中毒 - 每回合受到伤害
    SHIELDED: 'shielded',                 // 护盾 - 抵挡一次伤害
    ENRAGED: 'enraged',                   // 暴怒 - 攻击力提升
    INSPIRED: 'inspired',                 // 激励 - 可以额外行动
    DEMORALIZED: 'demoralized',           // 士气低落 - 攻击力降低
    CAMOUFLAGED: 'camouflaged'            // 伪装 - 无法被选中
};

// ==================== 稀有度 ====================
const RARITY = {
    COMMON: 'common',                     // 普通
    RARE: 'rare',                         // 稀有
    EPIC: 'epic',                         // 史诗
    LEGENDARY: 'legendary'                // 传说
};

// ==================== 游戏状态 ====================
const GAME_STATE = {
    MENU: 'menu',                         // 主菜单
    DECKBUILDER: 'deckbuilder',           // 牌组构建
    PLAYING: 'playing',                   // 游戏中
    PAUSED: 'paused',                     // 暂停
    GAME_OVER: 'game_over'                // 游戏结束
};

// ==================== 行动模式 ====================
const ACTION_MODES = {
    DEPLOY: 'deploy',                     // 部署模式
    MOVE: 'move',                         // 移动模式
    ATTACK: 'attack',                     // 攻击模式
    WAIT: 'wait',                         // 待命模式
    IDLE: 'idle'                          // 空闲
};

// ==================== 错误类型 ====================
const ERROR_TYPES = {
    INSUFFICIENT_CP: 'insufficient_cp',   // 指挥点不足
    INVALID_TARGET: 'invalid_target',     // 无效目标
    ALREADY_ATTACKED: 'already_attacked', // 已攻击
    ALREADY_MOVED: 'already_moved',       // 已移动
    POSITION_OCCUPIED: 'position_occupied', // 位置被占用
    NO_PATH: 'no_path',                   // 无路径
    INVALID_ACTION: 'invalid_action',     // 无效行动
    GAME_OVER: 'game_over'                // 游戏结束
};

// ==================== 导出 ====================
// 如果是在模块环境中，导出常量
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GAME_RULES,
        FACTIONS,
        CARD_TYPES,
        UNIT_TYPES,
        KEYWORDS,
        EFFECT_TYPES,
        EVENT_TYPES,
        STATUS_TYPES,
        RARITY,
        GAME_STATE,
        ACTION_MODES,
        ERROR_TYPES
    };
}