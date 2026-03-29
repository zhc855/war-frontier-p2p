/**
 * 卡牌数据库
 * 包含所有阵营的卡牌数据
 */

// ==================== 卡牌数据库 ====================
const CARD_DATABASE = [
    // ==================== 德国阵营 ====================
    {
        id: 'de_001',
        name: '步兵师',
        faction: 'germany',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.INFANTRY,
        cost: 2,
        attack: 3,
        armor: 0,
        hp: 5,
        icon: '🚶',
        ability: '突击: 攻击时不受到反击伤害',
        keywords: [KEYWORDS.BLITZ],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.COMMON
    },
    {
        id: 'de_002',
        name: '虎式坦克',
        faction: 'germany',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.TANK,
        cost: 6,
        attack: 8,
        armor: 3,
        hp: 10,
        icon: '🚀',
        ability: '装甲: 减少受到的伤害 | 反坦克: 攻击坦克时伤害翻倍',
        keywords: [KEYWORDS.ARMOR, KEYWORDS.ANTI_TANK],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.LEGENDARY
    },
    {
        id: 'de_003',
        name: '梅塞施密特战斗机',
        faction: 'germany',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.FIGHTER,
        cost: 4,
        attack: 5,
        armor: 0,
        hp: 4,
        icon: '✈️',
        ability: '对空: 攻击飞行单位时伤害翻倍 | 轰炸: 可从任意位置攻击',
        keywords: [KEYWORDS.ANTI_AIR, KEYWORDS.BOMBARDMENT],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.EPIC
    },
    {
        id: 'de_004',
        name: '闪电战指令',
        faction: 'germany',
        type: CARD_TYPES.ORDER,
        cost: 2,
        icon: '⚡',
        ability: '使一个己方单位获得突击关键字',
        effects: [
            {
                type: EFFECT_TYPES.ADD_KEYWORD,
                keyword: KEYWORDS.BLITZ,
                description: '给单位添加突击关键字'
            }
        ],
        rarity: RARITY.RARE
    },
    {
        id: 'de_005',
        name: '装甲增援',
        faction: 'germany',
        type: CARD_TYPES.SUPPORT,
        cost: 3,
        icon: '🛡️',
        ability: '己方所有装甲单位+1护甲',
        effects: [
            {
                type: EFFECT_TYPES.MODIFY_ARMOR,
                value: 1,
                description: '装甲单位+1护甲',
                condition: {
                    type: 'has_keyword',
                    keyword: KEYWORDS.ARMOR
                }
            }
        ],
        rarity: RARITY.RARE
    },
    {
        id: 'de_012',
        name: '第342燧发枪兵营',
        faction: 'germany',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.INFANTRY,
        cost: 3,
        attack: 3,
        armor: 0,
        hp: 4,
        icon: '🚶',
        ability: '移至前线时，使前线所有单位获得+2攻击力',
        keywords: [],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.COMMON
    },
    {
        id: 'de_013',
        name: '第361非洲兵团',
        faction: 'germany',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.INFANTRY,
        cost: 3,
        attack: 3,
        armor: 0,
        hp: 4,
        icon: '🚶',
        ability: '移至前线时，对敌方总部造成3点伤害',
        keywords: [],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.COMMON
    },
    {
        id: 'de_014',
        name: '第4空降猎兵团',
        faction: 'germany',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.INFANTRY,
        cost: 3,
        attack: 4,
        armor: 0,
        hp: 2,
        icon: '🪂',
        ability: '闪击，奋战。部署：选择手牌中的1张花费不大于2的单位，使其花费为0',
        keywords: [KEYWORDS.RUSH],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.RARE
    },
    {
        id: 'de_015',
        name: '第980国民掷弹兵团',
        faction: 'germany',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.INFANTRY,
        cost: 3,
        attack: 3,
        armor: 0,
        hp: 6,
        icon: '🚶',
        ability: '标准步兵单位',
        keywords: [],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.COMMON
    },
    {
        id: 'de_016',
        name: '统帅堂装甲掷弹兵师',
        faction: 'germany',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.INFANTRY,
        cost: 3,
        attack: 4,
        armor: 0,
        hp: 4,
        icon: '🚶',
        ability: '一回合一次，友方部署其他攻击力不小于4的单位时，获得2个指挥点',
        keywords: [],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.RARE
    },
    {
        id: 'de_017',
        name: '第113步枪兵团',
        faction: 'germany',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.INFANTRY,
        cost: 4,
        attack: 4,
        armor: 0,
        hp: 4,
        icon: '🚶',
        ability: '部署：与1个敌方单位战斗',
        keywords: [],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.COMMON
    },
    {
        id: 'de_018',
        name: '第2海军步兵师',
        faction: 'germany',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.INFANTRY,
        cost: 4,
        attack: 3,
        armor: 0,
        hp: 6,
        icon: '🚶',
        ability: '一回合一次，友方使用海军牌时，对敌方总部造成3点伤害',
        keywords: [],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.RARE
    },
    {
        id: 'de_019',
        name: '第40装甲掷弹兵团',
        faction: 'germany',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.INFANTRY,
        cost: 4,
        attack: 3,
        armor: 0,
        hp: 3,
        icon: '🚶',
        ability: '闪击，协力。部署：将1个单位返回手牌。若是友方单位，抽1张牌',
        keywords: [KEYWORDS.RUSH],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.EPIC
    },

    // ==================== 美国阵营 ====================
    {
        id: 'us_001',
        name: '陆军步兵',
        faction: 'usa',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.INFANTRY,
        cost: 2,
        attack: 3,
        armor: 0,
        hp: 5,
        icon: '🚶',
        ability: '标准步兵单位',
        keywords: [],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.COMMON
    },
    {
        id: 'us_002',
        name: '谢尔曼坦克',
        faction: 'usa',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.TANK,
        cost: 5,
        attack: 6,
        armor: 2,
        hp: 8,
        icon: '🚀',
        ability: '装甲: 减少受到的伤害',
        keywords: [KEYWORDS.ARMOR],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.RARE
    },
    {
        id: 'us_003',
        name: 'P-51野马',
        faction: 'usa',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.FIGHTER,
        cost: 4,
        attack: 5,
        armor: 0,
        hp: 5,
        icon: '✈️',
        ability: '对空: 攻击飞行单位时伤害翻倍 | 轰炸: 可从任意位置攻击',
        keywords: [KEYWORDS.ANTI_AIR, KEYWORDS.BOMBARDMENT],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.EPIC
    },
    {
        id: 'us_004',
        name: '后勤支援',
        faction: 'usa',
        type: CARD_TYPES.ORDER,
        cost: 1,
        icon: '📦',
        ability: '获得2点指挥点',
        effects: [
            {
                type: EFFECT_TYPES.GAIN_CP,
                amount: 2,
                description: '获得2点指挥点'
            }
        ],
        rarity: RARITY.COMMON
    },
    {
        id: 'us_005',
        name: '空军优势',
        faction: 'usa',
        type: CARD_TYPES.SUPPORT,
        cost: 3,
        icon: '✈️',
        ability: '己方所有空军单位+2攻击力',
        effects: [
            {
                type: EFFECT_TYPES.MODIFY_ATTACK,
                value: 2,
                description: '空军单位+2攻击力',
                condition: {
                    type: 'unit_type',
                    unitType: UNIT_TYPES.FIGHTER
                }
            }
        ],
        rarity: RARITY.RARE
    },

    // ==================== 英国阵营 ====================
    {
        id: 'gb_001',
        name: '皇家步兵',
        faction: 'britain',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.INFANTRY,
        cost: 2,
        attack: 3,
        armor: 0,
        hp: 6,
        icon: '🚶',
        ability: '防守者: 被动时+1护甲',
        keywords: [KEYWORDS.DEFENDER],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.COMMON
    },
    {
        id: 'gb_002',
        name: '丘吉尔坦克',
        faction: 'britain',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.TANK,
        cost: 5,
        attack: 5,
        armor: 3,
        hp: 10,
        icon: '🚀',
        ability: '装甲: 减少受到的伤害 | 坚守: 前线单位死亡时移至前线',
        keywords: [KEYWORDS.ARMOR, KEYWORDS.HOLD],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.EPIC
    },
    {
        id: 'gb_003',
        name: '皇家海军',
        faction: 'britain',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.SHIP,
        cost: 4,
        attack: 6,
        armor: 2,
        hp: 8,
        icon: '🚢',
        ability: '轰炸: 可从任意位置攻击',
        keywords: [KEYWORDS.BOMBARDMENT],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.RARE
    },
    {
        id: 'gb_004',
        name: '防空警报',
        faction: 'britain',
        type: CARD_TYPES.SUPPRESSION,
        cost: 2,
        icon: '📢',
        ability: '压制敌方所有空军单位',
        effects: [
            {
                type: EFFECT_TYPES.ADD_STATUS,
                status: STATUS_TYPES.SUPPRESSED,
                duration: 1,
                description: '压制敌方空军单位',
                condition: {
                    type: 'unit_type',
                    unitType: UNIT_TYPES.FIGHTER
                }
            }
        ],
        rarity: RARITY.RARE
    },

    // ==================== 苏联阵营 ====================
    {
        id: 'su_001',
        name: '红军步兵',
        faction: 'soviet',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.INFANTRY,
        cost: 1,
        attack: 2,
        armor: 0,
        hp: 4,
        icon: '🚶',
        ability: '费用低廉，人海战术',
        keywords: [],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.COMMON
    },
    {
        id: 'su_002',
        name: 'T-34坦克',
        faction: 'soviet',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.TANK,
        cost: 4,
        attack: 5,
        armor: 1,
        hp: 7,
        icon: '🚀',
        ability: '装甲: 减少受到的伤害',
        keywords: [KEYWORDS.ARMOR],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.RARE
    },
    {
        id: 'su_003',
        name: '喀秋莎火箭炮',
        faction: 'soviet',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.ARTILLERY,
        cost: 5,
        attack: 6,
        armor: 0,
        hp: 4,
        icon: '💥',
        ability: '轰炸: 可从任意位置攻击',
        keywords: [KEYWORDS.BOMBARDMENT],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.EPIC
    },
    {
        id: 'su_004',
        name: '乌拉冲锋',
        faction: 'soviet',
        type: CARD_TYPES.REINFORCEMENT,
        cost: 4,
        icon: '🏃',
        ability: '部署2个1费步兵单位到支援战线',
        effects: [
            {
                type: EFFECT_TYPES.DRAW_CARDS,
                count: 0,
                description: ''
            }
        ],
        rarity: RARITY.RARE
    },
    {
        id: 'su_005',
        name: '斯大林格勒防御',
        faction: 'soviet',
        type: CARD_TYPES.ORDER,
        cost: 3,
        icon: '🛡️',
        ability: '己方所有单位+2生命值',
        effects: [
            {
                type: EFFECT_TYPES.MODIFY_HP,
                value: 2,
                description: '己方所有单位+2生命值'
            }
        ],
        rarity: RARITY.EPIC
    },

    // ==================== 日本阵营 ====================
    {
        id: 'jp_001',
        name: '帝国步兵',
        faction: 'japan',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.INFANTRY,
        cost: 2,
        attack: 3,
        armor: 0,
        hp: 4,
        icon: '🚶',
        ability: '冲锋: 部署后可以立即行动',
        keywords: [KEYWORDS.RUSH],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.COMMON
    },
    {
        id: 'jp_002',
        name: '零式战斗机',
        faction: 'japan',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.FIGHTER,
        cost: 3,
        attack: 4,
        armor: 0,
        hp: 4,
        icon: '✈️',
        ability: '对空: 攻击飞行单位时伤害翻倍 | 冲锋: 部署后可以立即行动',
        keywords: [KEYWORDS.ANTI_AIR, KEYWORDS.RUSH],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.RARE
    },
    {
        id: 'jp_003',
        name: '神风特攻',
        faction: 'japan',
        type: CARD_TYPES.ORDER,
        cost: 3,
        icon: '💥',
        ability: '摧毁一个己方空军单位，对所有敌方单位造成4点伤害',
        effects: [
            {
                type: EFFECT_TYPES.DEAL_DAMAGE,
                value: 4,
                description: '对所有敌方单位造成4点伤害',
                target: 'all_enemies'
            },
            {
                type: EFFECT_TYPES.DESTROY,
                description: '摧毁己方空军单位',
                target: 'self_air_unit'
            }
        ],
        rarity: RARITY.LEGENDARY
    },
    {
        id: 'jp_004',
        name: '突袭',
        faction: 'japan',
        type: CARD_TYPES.SUPPRESSION,
        cost: 2,
        icon: '👻',
        ability: '使一个己方单位获得潜行关键字',
        effects: [
            {
                type: EFFECT_TYPES.ADD_KEYWORD,
                keyword: KEYWORDS.STEALTH,
                description: '给单位添加潜行关键字'
            }
        ],
        rarity: RARITY.RARE
    },

    // ==================== 中立卡牌 ====================
    {
        id: 'ne_001',
        name: '补给卡车',
        faction: 'neutral',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.INFANTRY,
        cost: 1,
        attack: 0,
        armor: 0,
        hp: 3,
        icon: '🚚',
        ability: '支援: 相邻单位+1攻击力',
        keywords: [KEYWORDS.SUPPORT],
        movesPerTurn: 1,
        attacksPerTurn: 0,
        rarity: RARITY.COMMON
    },
    {
        id: 'ne_002',
        name: '野战炮',
        faction: 'neutral',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.ARTILLERY,
        cost: 3,
        attack: 4,
        armor: 0,
        hp: 3,
        icon: '💥',
        ability: '轰炸: 可从任意位置攻击',
        keywords: [KEYWORDS.BOMBARDMENT],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.COMMON
    },
    {
        id: 'ne_003',
        name: '烟雾弹',
        faction: 'neutral',
        type: CARD_TYPES.ORDER,
        cost: 1,
        icon: '💨',
        ability: '使一个己方单位获得烟雾关键字',
        effects: [
            {
                type: EFFECT_TYPES.ADD_KEYWORD,
                keyword: KEYWORDS.SMOKE,
                description: '给单位添加烟雾关键字'
            }
        ],
        rarity: RARITY.COMMON
    },
    {
        id: 'ne_004',
        name: '医疗补给',
        faction: 'neutral',
        type: CARD_TYPES.ORDER,
        cost: 2,
        icon: '🏥',
        ability: '治疗一个己方单位4点生命值',
        effects: [
            {
                type: EFFECT_TYPES.HEAL,
                value: 4,
                description: '治疗己方单位4点生命值'
            }
        ],
        rarity: RARITY.COMMON
    },
    {
        id: 'ne_005',
        name: '总部',
        faction: 'neutral',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.HQ,
        cost: 0,
        attack: 0,
        armor: 0,
        hp: 20,
        icon: '🏰',
        ability: '只能受击，无法还击',
        keywords: [],
        movesPerTurn: 0,
        attacksPerTurn: 0,
        rarity: RARITY.UNIQUE
    },
    {
        id: 'ne_006',
        name: '装甲车',
        faction: 'neutral',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.TANK,
        cost: 3,
        attack: 4,
        armor: 1,
        hp: 6,
        icon: '🚙',
        ability: '装甲: 减少受到的伤害',
        keywords: [KEYWORDS.ARMOR],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.COMMON
    },
    {
        id: 'ne_007',
        name: '狙击手',
        faction: 'neutral',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.INFANTRY,
        cost: 2,
        attack: 3,
        armor: 0,
        hp: 3,
        icon: '🎯',
        ability: '先攻: 在敌人反击前造成伤害',
        keywords: [KEYWORDS.FIRST_STRIKE],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.RARE
    },
    {
        id: 'ne_008',
        name: '迫击炮',
        faction: 'neutral',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.ARTILLERY,
        cost: 2,
        attack: 3,
        armor: 0,
        hp: 3,
        icon: '💣',
        ability: '轰炸: 可从任意位置攻击',
        keywords: [KEYWORDS.BOMBARDMENT],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.COMMON
    },
    {
        id: 'ne_009',
        name: '医疗兵',
        faction: 'neutral',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.INFANTRY,
        cost: 2,
        attack: 1,
        armor: 0,
        hp: 4,
        icon: '⚕️',
        ability: '回合开始时治疗相邻单位1点生命值',
        keywords: [KEYWORDS.SUPPORT],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.COMMON
    },
    {
        id: 'ne_010',
        name: '工兵',
        faction: 'neutral',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.INFANTRY,
        cost: 1,
        attack: 1,
        armor: 0,
        hp: 3,
        icon: '🔧',
        ability: '部署时修复相邻己方单位2点生命值',
        keywords: [],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.COMMON
    },
    {
        id: 'ne_011',
        name: '侦察兵',
        faction: 'neutral',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.INFANTRY,
        cost: 1,
        attack: 1,
        armor: 0,
        hp: 2,
        icon: '🔭',
        ability: '潜行: 攻击前无法被选中',
        keywords: [KEYWORDS.STEALTH],
        movesPerTurn: 2,
        attacksPerTurn: 1,
        rarity: RARITY.COMMON
    },
    {
        id: 'ne_012',
        name: '火力压制',
        faction: 'neutral',
        type: CARD_TYPES.ORDER,
        cost: 1,
        icon: '🔥',
        ability: '使一个敌方单位受到1点伤害',
        effects: [
            {
                type: EFFECT_TYPES.DEAL_DAMAGE,
                value: 1,
                description: '对目标造成1点伤害'
            }
        ],
        rarity: RARITY.COMMON
    },
    {
        id: 'ne_013',
        name: '战术撤退',
        faction: 'neutral',
        type: CARD_TYPES.ORDER,
        cost: 1,
        icon: '🏃',
        ability: '使一个己方单位返回手牌',
        effects: [
            {
                type: EFFECT_TYPES.BOUNCE,
                description: '单位返回手牌'
            }
        ],
        rarity: RARITY.COMMON
    },
    {
        id: 'ne_014',
        name: '重整旗鼓',
        faction: 'neutral',
        type: CARD_TYPES.ORDER,
        cost: 2,
        icon: '📢',
        ability: '抽2张牌',
        effects: [
            {
                type: EFFECT_TYPES.DRAW_CARDS,
                count: 2,
                description: '抽取2张卡牌'
            }
        ],
        rarity: RARITY.COMMON
    },
    {
        id: 'ne_015',
        name: '防御工事',
        faction: 'neutral',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.FORTIFICATION,
        cost: 3,
        attack: 0,
        armor: 2,
        hp: 6,
        icon: '🏗️',
        ability: '防守者: 被动时+1护甲 | 坚守: 前线单位死亡时移至前线',
        keywords: [KEYWORDS.DEFENDER, KEYWORDS.HOLD],
        movesPerTurn: 0,
        attacksPerTurn: 0,
        rarity: RARITY.RARE
    },
    {
        id: 'ne_016',
        name: '坦克杀手',
        faction: 'neutral',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.INFANTRY,
        cost: 3,
        attack: 4,
        armor: 0,
        hp: 4,
        icon: '💥',
        ability: '反坦克: 攻击坦克时伤害翻倍',
        keywords: [KEYWORDS.ANTI_TANK],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.RARE
    },
    {
        id: 'ne_017',
        name: '防空炮',
        faction: 'neutral',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.ARTILLERY,
        cost: 3,
        attack: 3,
        armor: 1,
        hp: 5,
        icon: '🎯',
        ability: '对空: 攻击飞行单位时伤害翻倍',
        keywords: [KEYWORDS.ANTI_AIR],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.RARE
    },
    {
        id: 'ne_018',
        name: '精英突击队',
        faction: 'neutral',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.INFANTRY,
        cost: 4,
        attack: 5,
        armor: 0,
        hp: 5,
        icon: '⚔️',
        ability: '突击: 攻击时不受到反击伤害',
        keywords: [KEYWORDS.BLITZ],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.EPIC
    },
    {
        id: 'ne_019',
        name: '重型火炮',
        faction: 'neutral',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.ARTILLERY,
        cost: 5,
        attack: 6,
        armor: 1,
        hp: 5,
        icon: '💣',
        ability: '轰炸: 可从任意位置攻击 | 装甲: 减少受到的伤害',
        keywords: [KEYWORDS.BOMBARDMENT, KEYWORDS.ARMOR],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.EPIC
    },
    {
        id: 'ne_020',
        name: '指挥官',
        faction: 'neutral',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.INFANTRY,
        cost: 5,
        attack: 4,
        armor: 0,
        hp: 6,
        icon: '🎖️',
        ability: '士气: 提升相邻单位的战斗力 | 接力: 死亡时让相邻单位行动',
        keywords: [KEYWORDS.MORALE, KEYWORDS.RELAY],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.LEGENDARY
    },

    // ==================== 补充德国阵营卡牌 ====================
    {
        id: 'de_006',
        name: '装甲掷弹兵',
        faction: 'germany',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.INFANTRY,
        cost: 3,
        attack: 4,
        armor: 1,
        hp: 5,
        icon: '🚶',
        ability: '装甲: 减少受到的伤害 | 突击: 攻击时不受到反击伤害',
        keywords: [KEYWORDS.ARMOR, KEYWORDS.BLITZ],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.EPIC
    },
    {
        id: 'de_007',
        name: '黑豹坦克',
        faction: 'germany',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.TANK,
        cost: 7,
        attack: 7,
        armor: 3,
        hp: 9,
        icon: '🚀',
        ability: '装甲: 减少受到的伤害 | 反坦克: 攻击坦克时伤害翻倍',
        keywords: [KEYWORDS.ARMOR, KEYWORDS.ANTI_TANK],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.LEGENDARY
    },
    {
        id: 'de_008',
        name: '突击炮',
        faction: 'germany',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.ARTILLERY,
        cost: 4,
        attack: 5,
        armor: 2,
        hp: 5,
        icon: '💥',
        ability: '轰炸: 可从任意位置攻击 | 装甲: 减少受到的伤害',
        keywords: [KEYWORDS.BOMBARDMENT, KEYWORDS.ARMOR],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.RARE
    },
    {
        id: 'de_009',
        name: '空军元帅',
        faction: 'germany',
        type: CARD_TYPES.ORDER,
        cost: 4,
        icon: '✈️',
        ability: '获得4点指挥点',
        effects: [
            {
                type: EFFECT_TYPES.GAIN_CP,
                amount: 4,
                description: '获得4点指挥点'
            }
        ],
        rarity: RARITY.EPIC
    },
    {
        id: 'de_010',
        name: 'U型潜艇',
        faction: 'germany',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.SHIP,
        cost: 5,
        attack: 6,
        armor: 1,
        hp: 6,
        icon: '🚢',
        ability: '潜行: 攻击前无法被选中 | 轰炸: 可从任意位置攻击',
        keywords: [KEYWORDS.STEALTH, KEYWORDS.BOMBARDMENT],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.LEGENDARY
    },
    {
        id: 'de_011',
        name: '装甲师突击',
        faction: 'germany',
        type: CARD_TYPES.REINFORCEMENT,
        cost: 5,
        icon: '🚀',
        ability: '部署2个装甲单位到支援战线',
        effects: [
            {
                type: EFFECT_TYPES.DRAW_CARDS,
                count: 1,
                description: '额外抽1张牌'
            }
        ],
        rarity: RARITY.EPIC
    },

    // ==================== 补充美国阵营卡牌 ====================
    {
        id: 'us_006',
        name: '游骑兵',
        faction: 'usa',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.INFANTRY,
        cost: 3,
        attack: 4,
        armor: 0,
        hp: 5,
        icon: '🚶',
        ability: '冲锋: 部署后可以立即行动',
        keywords: [KEYWORDS.RUSH],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.RARE
    },
    {
        id: 'us_007',
        name: '重型轰炸机',
        faction: 'usa',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.BOMBER,
        cost: 6,
        attack: 7,
        armor: 1,
        hp: 6,
        icon: '✈️',
        ability: '轰炸: 可从任意位置攻击 | 装甲: 减少受到的伤害',
        keywords: [KEYWORDS.BOMBARDMENT, KEYWORDS.ARMOR],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.LEGENDARY
    },
    {
        id: 'us_008',
        name: 'M4谢尔曼改进型',
        faction: 'usa',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.TANK,
        cost: 6,
        attack: 7,
        armor: 2,
        hp: 9,
        icon: '🚀',
        ability: '装甲: 减少受到的伤害',
        keywords: [KEYWORDS.ARMOR],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.EPIC
    },
    {
        id: 'us_009',
        name: '空降兵',
        faction: 'usa',
        type: CARD_TYPES.REINFORCEMENT,
        cost: 4,
        icon: '🪂',
        ability: '部署1个步兵单位到前线',
        effects: [
            {
                type: EFFECT_TYPES.DRAW_CARDS,
                count: 0,
                description: ''
            }
        ],
        rarity: RARITY.RARE
    },
    {
        id: 'us_010',
        name: '航空母舰',
        faction: 'usa',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.SHIP,
        cost: 7,
        attack: 5,
        armor: 3,
        hp: 10,
        icon: '🚢',
        ability: '轰炸: 可从任意位置攻击 | 装甲: 减少受到的伤害',
        keywords: [KEYWORDS.BOMBARDMENT, KEYWORDS.ARMOR],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.LEGENDARY
    },
    {
        id: 'us_011',
        name: '海军陆战队',
        faction: 'usa',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.INFANTRY,
        cost: 2,
        attack: 3,
        armor: 0,
        hp: 5,
        icon: '🚶',
        ability: '先攻: 在敌人反击前造成伤害',
        keywords: [KEYWORDS.FIRST_STRIKE],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.COMMON
    },

    // ==================== 补充英国阵营卡牌 ====================
    {
        id: 'gb_005',
        name: '斯图亚特坦克',
        faction: 'britain',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.TANK,
        cost: 4,
        attack: 4,
        armor: 1,
        hp: 6,
        icon: '🚀',
        ability: '装甲: 减少受到的伤害',
        keywords: [KEYWORDS.ARMOR],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.COMMON
    },
    {
        id: 'gb_006',
        name: '喷火战斗机',
        faction: 'britain',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.FIGHTER,
        cost: 4,
        attack: 5,
        armor: 0,
        hp: 5,
        icon: '✈️',
        ability: '对空: 攻击飞行单位时伤害翻倍 | 轰炸: 可从任意位置攻击',
        keywords: [KEYWORDS.ANTI_AIR, KEYWORDS.BOMBARDMENT],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.EPIC
    },
    {
        id: 'gb_007',
        name: '蒙哥马利',
        faction: 'britain',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.INFANTRY,
        cost: 6,
        attack: 5,
        armor: 0,
        hp: 7,
        icon: '🎖️',
        ability: '士气: 提升相邻单位的战斗力 | 坚守: 前线单位死亡时移至前线',
        keywords: [KEYWORDS.MORALE, KEYWORDS.HOLD],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.LEGENDARY
    },
    {
        id: 'gb_008',
        name: '皇家卫队',
        faction: 'britain',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.INFANTRY,
        cost: 3,
        attack: 3,
        armor: 1,
        hp: 7,
        icon: '🚶',
        ability: '防守者: 被动时+1护甲 | 装甲: 减少受到的伤害',
        keywords: [KEYWORDS.DEFENDER, KEYWORDS.ARMOR],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.RARE
    },
    {
        id: 'gb_009',
        name: '战列舰',
        faction: 'britain',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.SHIP,
        cost: 7,
        attack: 8,
        armor: 3,
        hp: 10,
        icon: '🚢',
        ability: '轰炸: 可从任意位置攻击 | 装甲: 减少受到的伤害',
        keywords: [KEYWORDS.BOMBARDMENT, KEYWORDS.ARMOR],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.LEGENDARY
    },
    {
        id: 'gb_010',
        name: '敦刻尔克大撤退',
        faction: 'britain',
        type: CARD_TYPES.ORDER,
        cost: 2,
        icon: '🚢',
        ability: '使2个己方单位返回手牌',
        effects: [
            {
                type: EFFECT_TYPES.BOUNCE,
                description: '2个单位返回手牌'
            }
        ],
        rarity: RARITY.RARE
    },
    {
        id: 'gb_011',
        name: '皇家空军',
        faction: 'britain',
        type: CARD_TYPES.REINFORCEMENT,
        cost: 4,
        icon: '✈️',
        ability: '部署2个空军单位到支援战线',
        effects: [
            {
                type: EFFECT_TYPES.DRAW_CARDS,
                count: 1,
                description: '额外抽1张牌'
            }
        ],
        rarity: RARITY.EPIC
    },

    // ==================== 补充苏联阵营卡牌 ====================
    {
        id: 'su_006',
        name: 'T-34/85',
        faction: 'soviet',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.TANK,
        cost: 5,
        attack: 6,
        armor: 2,
        hp: 8,
        icon: '🚀',
        ability: '装甲: 减少受到的伤害',
        keywords: [KEYWORDS.ARMOR],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.EPIC
    },
    {
        id: 'su_007',
        name: 'IS-2重型坦克',
        faction: 'soviet',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.TANK,
        cost: 7,
        attack: 8,
        armor: 3,
        hp: 10,
        icon: '🚀',
        ability: '装甲: 减少受到的伤害 | 反坦克: 攻击坦克时伤害翻倍',
        keywords: [KEYWORDS.ARMOR, KEYWORDS.ANTI_TANK],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.LEGENDARY
    },
    {
        id: 'su_008',
        name: '政委',
        faction: 'soviet',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.INFANTRY,
        cost: 3,
        attack: 3,
        armor: 0,
        hp: 5,
        icon: '🎖️',
        ability: '士气: 提升相邻单位的战斗力 | 接力: 死亡时让相邻单位行动',
        keywords: [KEYWORDS.MORALE, KEYWORDS.RELAY],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.EPIC
    },
    {
        id: 'su_009',
        name: '红军突击队',
        faction: 'soviet',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.INFANTRY,
        cost: 2,
        attack: 4,
        armor: 0,
        hp: 4,
        icon: '🚶',
        ability: '冲锋: 部署后可以立即行动',
        keywords: [KEYWORDS.RUSH],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.COMMON
    },
    {
        id: 'su_010',
        name: '冬季攻势',
        faction: 'soviet',
        type: CARD_TYPES.ORDER,
        cost: 3,
        icon: '❄️',
        ability: '使所有敌方单位受到2点伤害',
        effects: [
            {
                type: EFFECT_TYPES.DEAL_DAMAGE,
                value: 2,
                description: '所有敌方单位受到2点伤害',
                target: 'all_enemies'
            }
        ],
        rarity: RARITY.EPIC
    },
    {
        id: 'su_011',
        name: '人海战术',
        faction: 'soviet',
        type: CARD_TYPES.REINFORCEMENT,
        cost: 4,
        icon: '🚶',
        ability: '部署3个步兵单位到支援战线',
        effects: [
            {
                type: EFFECT_TYPES.DRAW_CARDS,
                count: 2,
                description: '额外抽2张牌'
            }
        ],
        rarity: RARITY.LEGENDARY
    },

    // ==================== 补充日本阵营卡牌 ====================
    {
        id: 'jp_005',
        name: '九七式中型坦克',
        faction: 'japan',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.TANK,
        cost: 4,
        attack: 5,
        armor: 1,
        hp: 6,
        icon: '🚀',
        ability: '装甲: 减少受到的伤害',
        keywords: [KEYWORDS.ARMOR],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.COMMON
    },
    {
        id: 'jp_006',
        name: '神风敢死队',
        faction: 'japan',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.FIGHTER,
        cost: 4,
        attack: 8,
        armor: 0,
        hp: 3,
        icon: '✈️',
        ability: '对空: 攻击飞行单位时伤害翻倍 | 冲锋: 部署后可以立即行动',
        keywords: [KEYWORDS.ANTI_AIR, KEYWORDS.RUSH],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.LEGENDARY
    },
    {
        id: 'jp_007',
        name: '武士道',
        faction: 'japan',
        type: CARD_TYPES.ORDER,
        cost: 2,
        icon: '⚔️',
        ability: '使一个己方单位获得+2攻击力和突击关键字',
        effects: [
            {
                type: EFFECT_TYPES.MODIFY_ATTACK,
                value: 2,
                description: '单位+2攻击力'
            },
            {
                type: EFFECT_TYPES.ADD_KEYWORD,
                keyword: KEYWORDS.BLITZ,
                description: '添加突击关键字'
            }
        ],
        rarity: RARITY.RARE
    },
    {
        id: 'jp_008',
        name: '夜袭',
        faction: 'japan',
        type: CARD_TYPES.SUPPRESSION,
        cost: 2,
        icon: '🌙',
        ability: '使一个敌方单位获得潜行和压制状态',
        effects: [
            {
                type: EFFECT_TYPES.ADD_KEYWORD,
                keyword: KEYWORDS.STEALTH,
                description: '添加潜行关键字'
            },
            {
                type: EFFECT_TYPES.ADD_STATUS,
                status: STATUS_TYPES.SUPPRESSED,
                duration: 1,
                description: '压制状态'
            }
        ],
        rarity: RARITY.EPIC
    },
    {
        id: 'jp_009',
        name: '大和号',
        faction: 'japan',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.SHIP,
        cost: 8,
        attack: 10,
        armor: 4,
        hp: 12,
        icon: '🚢',
        ability: '轰炸: 可从任意位置攻击 | 装甲: 减少受到的伤害',
        keywords: [KEYWORDS.BOMBARDMENT, KEYWORDS.ARMOR],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.LEGENDARY
    },
    {
        id: 'jp_010',
        name: '神风特攻队',
        faction: 'japan',
        type: CARD_TYPES.REINFORCEMENT,
        cost: 4,
        icon: '✈️',
        ability: '部署2个空军单位到支援战线',
        effects: [
            {
                type: EFFECT_TYPES.DRAW_CARDS,
                count: 1,
                description: '额外抽1张牌'
            }
        ],
        rarity: RARITY.EPIC
    },
    {
        id: 'jp_011',
        name: '忍者',
        faction: 'japan',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.INFANTRY,
        cost: 2,
        attack: 3,
        armor: 0,
        hp: 3,
        icon: '🥷',
        ability: '潜行: 攻击前无法被选中 | 突击: 攻击时不受到反击伤害',
        keywords: [KEYWORDS.STEALTH, KEYWORDS.BLITZ],
        movesPerTurn: 2,
        attacksPerTurn: 1,
        rarity: RARITY.LEGENDARY
    },
    {
        id: 'us_012',
        name: '巴顿将军',
        faction: 'usa',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.INFANTRY,
        cost: 8,
        attack: 7,
        armor: 2,
        hp: 10,
        icon: '⭐',
        ability: '士气: 相邻单位+2攻击力 | 装甲: 减少受到的伤害',
        keywords: [KEYWORDS.MORALE, KEYWORDS.ARMOR],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.LEGENDARY
    },
    {
        id: 'us_013',
        name: '工业生产',
        faction: 'usa',
        type: CARD_TYPES.ORDER,
        cost: 2,
        icon: '🏭',
        ability: '抽2张牌',
        effects: [
            {
                type: EFFECT_TYPES.DRAW_CARDS,
                count: 2,
                description: '抽2张牌'
            }
        ],
        rarity: RARITY.COMMON
    },
    {
        id: 'us_014',
        name: '诺曼底登陆',
        faction: 'usa',
        type: CARD_TYPES.ORDER,
        cost: 4,
        icon: '🏖️',
        ability: '部署2个步兵单位到前线',
        effects: [
            {
                type: EFFECT_TYPES.DRAW_CARDS,
                count: 1,
                description: '额外抽1张牌'
            }
        ],
        rarity: RARITY.EPIC
    },
    {
        id: 'us_015',
        name: '空中补给',
        faction: 'usa',
        type: CARD_TYPES.SUPPORT,
        cost: 3,
        icon: '✈️',
        ability: '己方所有空军单位+1生命值',
        effects: [
            {
                type: EFFECT_TYPES.MODIFY_HP,
                value: 1,
                description: '空军单位+1生命值',
                condition: {
                    type: 'unit_type',
                    unitType: UNIT_TYPES.FIGHTER
                }
            }
        ],
        rarity: RARITY.RARE
    },
    {
        id: 'us_016',
        name: '自由之翼',
        faction: 'usa',
        type: CARD_TYPES.ORDER,
        cost: 5,
        icon: '🦅',
        ability: '摧毁一个敌方空军单位',
        effects: [
            {
                type: EFFECT_TYPES.DESTROY,
                description: '摧毁敌方空军单位',
                target: 'enemy_air_unit'
            }
        ],
        rarity: RARITY.EPIC
    },
    {
        id: 'us_017',
        name: '第101空降师',
        faction: 'usa',
        type: CARD_TYPES.REINFORCEMENT,
        cost: 7,
        icon: '🪂',
        ability: '部署2个步兵单位到支援战线',
        effects: [
            {
                type: EFFECT_TYPES.DRAW_CARDS,
                count: 0,
                description: ''
            }
        ],
        rarity: RARITY.EPIC
    },
    {
        id: 'us_018',
        name: '原子弹',
        faction: 'usa',
        type: CARD_TYPES.ORDER,
        cost: 10,
        icon: '☢️',
        ability: '对所有敌方单位造成8点伤害',
        effects: [
            {
                type: EFFECT_TYPES.DEAL_DAMAGE,
                value: 8,
                description: '对所有敌方单位造成8点伤害',
                target: 'all_enemies'
            }
        ],
        rarity: RARITY.LEGENDARY
    },
    {
        id: 'us_019',
        name: '艾森豪威尔',
        faction: 'usa',
        type: CARD_TYPES.ORDER,
        cost: 4,
        icon: '⭐',
        ability: '己方所有单位+2攻击力',
        effects: [
            {
                type: EFFECT_TYPES.MODIFY_ATTACK,
                value: 2,
                description: '己方所有单位+2攻击力'
            }
        ],
        rarity: RARITY.LEGENDARY
    },
    {
        id: 'us_020',
        name: '战时生产',
        faction: 'usa',
        type: CARD_TYPES.ORDER,
        cost: 2,
        icon: '🔧',
        ability: '获得2点指挥点',
        effects: [
            {
                type: EFFECT_TYPES.GAIN_CP,
                amount: 2,
                description: '获得2点指挥点'
            }
        ],
        rarity: RARITY.RARE
    },
    {
        id: 'gb_005',
        name: '温斯顿·丘吉尔',
        faction: 'britain',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.INFANTRY,
        cost: 7,
        attack: 5,
        armor: 3,
        hp: 12,
        icon: '🎩',
        ability: '坚守: 前线单位死亡时移至前线 | 装甲: 减少受到的伤害 | 士气: 相邻单位+2攻击力',
        keywords: [KEYWORDS.HOLD, KEYWORDS.ARMOR, KEYWORDS.MORALE],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.LEGENDARY
    },
    {
        id: 'gb_006',
        name: '帝国防卫',
        faction: 'britain',
        type: CARD_TYPES.SUPPORT,
        cost: 3,
        icon: '🛡️',
        ability: '己方所有单位+1护甲',
        effects: [
            {
                type: EFFECT_TYPES.MODIFY_ARMOR,
                value: 1,
                description: '己方所有单位+1护甲'
            }
        ],
        rarity: RARITY.RARE
    },
    {
        id: 'gb_007',
        name: '皇家空军',
        faction: 'britain',
        type: CARD_TYPES.REINFORCEMENT,
        cost: 3,
        icon: '✈️',
        ability: '部署1个空军单位到支援战线',
        effects: [
            {
                type: EFFECT_TYPES.DRAW_CARDS,
                count: 1,
                description: '额外抽1张牌'
            }
        ],
        rarity: RARITY.RARE
    },
    {
        id: 'gb_008',
        name: '不列颠空战',
        faction: 'britain',
        type: CARD_TYPES.ORDER,
        cost: 4,
        icon: '✈️',
        ability: '压制敌方所有空军单位',
        effects: [
            {
                type: EFFECT_TYPES.ADD_STATUS,
                status: STATUS_TYPES.SUPPRESSED,
                duration: 1,
                description: '压制敌方空军单位',
                condition: {
                    type: 'unit_type',
                    unitType: UNIT_TYPES.FIGHTER
                }
            }
        ],
        rarity: RARITY.EPIC
    },
    {
        id: 'gb_009',
        name: '皇家方舟',
        faction: 'britain',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.SHIP,
        cost: 6,
        attack: 6,
        armor: 3,
        hp: 9,
        icon: '🚢',
        ability: '轰炸: 可从任意位置攻击 | 装甲: 减少受到的伤害',
        keywords: [KEYWORDS.BOMBARDMENT, KEYWORDS.ARMOR],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.EPIC
    },
    {
        id: 'gb_010',
        name: '敦刻尔克撤退',
        faction: 'britain',
        type: CARD_TYPES.ORDER,
        cost: 2,
        icon: '🚢',
        ability: '将所有己方单位移至支援战线',
        effects: [
            {
                type: EFFECT_TYPES.MOVE_UNIT,
                description: '将所有己方单位移至支援战线',
                target: 'all_friendly_units'
            }
        ],
        rarity: RARITY.RARE
    },
    {
        id: 'gb_011',
        name: '不屈精神',
        faction: 'britain',
        type: CARD_TYPES.ORDER,
        cost: 5,
        icon: '💪',
        ability: '己方所有单位+3生命值',
        effects: [
            {
                type: EFFECT_TYPES.MODIFY_HP,
                value: 3,
                description: '己方所有单位+3生命值'
            }
        ],
        rarity: RARITY.EPIC
    },
    {
        id: 'su_006',
        name: '约瑟夫·斯大林',
        faction: 'soviet',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.INFANTRY,
        cost: 8,
        attack: 6,
        armor: 2,
        hp: 14,
        icon: '⭐',
        ability: '士气: 相邻单位+3攻击力 | 装甲: 减少受到的伤害',
        keywords: [KEYWORDS.MORALE, KEYWORDS.ARMOR],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.LEGENDARY
    },
    {
        id: 'su_007',
        name: '人海战术',
        faction: 'soviet',
        type: CARD_TYPES.REINFORCEMENT,
        cost: 6,
        icon: '👥',
        ability: '部署3个1费步兵单位到支援战线',
        effects: [
            {
                type: EFFECT_TYPES.DRAW_CARDS,
                count: 1,
                description: '额外抽1张牌'
            }
        ],
        rarity: RARITY.LEGENDARY
    },
    {
        id: 'su_008',
        name: '冬季战争',
        faction: 'soviet',
        type: CARD_TYPES.ORDER,
        cost: 3,
        icon: '❄️',
        ability: '压制敌方所有步兵单位',
        effects: [
            {
                type: EFFECT_TYPES.ADD_STATUS,
                status: STATUS_TYPES.SUPPRESSED,
                duration: 1,
                description: '压制敌方步兵单位',
                condition: {
                    type: 'unit_type',
                    unitType: UNIT_TYPES.INFANTRY
                }
            }
        ],
        rarity: RARITY.RARE
    },
    {
        id: 'su_009',
        name: '斯大林格勒反击',
        faction: 'soviet',
        type: CARD_TYPES.ORDER,
        cost: 5,
        icon: '⚔️',
        ability: '己方所有单位+3攻击力',
        effects: [
            {
                type: EFFECT_TYPES.MODIFY_ATTACK,
                value: 3,
                description: '己方所有单位+3攻击力'
            }
        ],
        rarity: RARITY.EPIC
    },
    {
        id: 'su_010',
        name: 'IS-2坦克',
        faction: 'soviet',
        type: CARD_TYPES.UNIT,
        unitType: UNIT_TYPES.TANK,
        cost: 5,
        attack: 6,
        armor: 2,
        hp: 8,
        icon: '🚀',
        ability: '装甲: 减少受到的伤害 | 反坦克: 攻击坦克时伤害翻倍',
        keywords: [KEYWORDS.ARMOR, KEYWORDS.ANTI_TANK],
        movesPerTurn: 1,
        attacksPerTurn: 1,
        rarity: RARITY.EPIC
    },
    {
        id: 'su_011',
        name: '伏尔加河防线',
        faction: 'soviet',
        type: CARD_TYPES.SUPPORT,
        cost: 4,
        icon: '🛡️',
        ability: '己方所有单位+2护甲',
        effects: [
            {
                type: EFFECT_TYPES.MODIFY_ARMOR,
                value: 2,
                description: '己方所有单位+2护甲'
            }
        ],
        rarity: RARITY.RARE
    }
];

/**
 * 获取所有卡牌
 * @returns {Array} 卡牌数组
 */
function getAllCards() {
    return [...CARD_DATABASE];
}

/**
 * 根据阵营获取卡牌
 * @param {string} factionId - 阵营ID
 * @returns {Array} 卡牌数组
 */
function getCardsByFaction(factionId) {
    return CARD_DATABASE.filter(card => card.faction === factionId);
}

/**
 * 根据类型获取卡牌
 * @param {string} cardType - 卡牌类型
 * @returns {Array} 卡牌数组
 */
function getCardsByType(cardType) {
    return CARD_DATABASE.filter(card => card.type === cardType);
}

/**
 * 根据稀有度获取卡牌
 * @param {string} rarity - 稀有度
 * @returns {Array} 卡牌数组
 */
function getCardsByRarity(rarity) {
    return CARD_DATABASE.filter(card => card.rarity === rarity);
}

/**
 * 根据ID获取卡牌
 * @param {string} cardId - 卡牌ID
 * @returns {Object|null} 卡牌对象
 */
function getCardById(cardId) {
    return CARD_DATABASE.find(card => card.id === cardId) || null;
}

/**
 * 搜索卡牌
 * @param {string} query - 搜索关键词
 * @returns {Array} 卡牌数组
 */
function searchCards(query) {
    const lowerQuery = query.toLowerCase();
    return CARD_DATABASE.filter(card =>
        card.name.toLowerCase().includes(lowerQuery) ||
        card.ability.toLowerCase().includes(lowerQuery)
    );
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CARD_DATABASE,
        getAllCards,
        getCardsByFaction,
        getCardsByType,
        getCardsByRarity,
        getCardById,
        searchCards
    };
}