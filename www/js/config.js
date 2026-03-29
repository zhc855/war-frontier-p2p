/**
 * 配置管理器
 * 管理游戏的各种配置，包括服务器地址等
 */

class ConfigManager {
    constructor() {
        this.config = {
            // 服务器配置
            server: {
                // 默认服务器地址
                defaultUrl: 'http://localhost:3000',
                // 保存的服务器地址列表
                recentServers: [],
                // 服务器连接超时时间（毫秒）
                timeout: 10000
            },
            // 游戏配置
            game: {
                // 游戏模式：'local' 或 'online'
                mode: 'local',
                // 回合计时（秒），0 表示无限制
                timer: 60,
                // 是否启用自动结束回合
                autoEndTurn: false,
                // 是否启用操作确认
                confirmActions: true
            },
            // UI配置
            ui: {
                // 是否启用动画效果
                animations: true,
                // 是否显示卡牌详情
                cardDetails: true,
                // 是否显示关键字提示
                keywordTooltips: true
            },
            // 音频配置
            audio: {
                // 是否启用音效
                sound: true,
                // 音量（0-100）
                volume: 70,
                // 是否启用背景音乐
                music: true
            }
        };

        this.loadConfig();
    }

    /**
     * 加载配置
     */
    loadConfig() {
        try {
            const savedConfig = localStorage.getItem('warfront_config');
            if (savedConfig) {
                const parsed = JSON.parse(savedConfig);
                // 合并配置，保留默认值
                this.config = this.mergeConfig(this.config, parsed);
                console.log('配置已加载:', this.config);
            }
        } catch (error) {
            console.error('加载配置失败:', error);
        }
    }

    /**
     * 保存配置
     */
    saveConfig() {
        try {
            localStorage.setItem('warfront_config', JSON.stringify(this.config));
            console.log('配置已保存');
        } catch (error) {
            console.error('保存配置失败:', error);
        }
    }

    /**
     * 合并配置
     */
    mergeConfig(defaultConfig, userConfig) {
        const result = JSON.parse(JSON.stringify(defaultConfig));
        
        for (const key in userConfig) {
            if (typeof result[key] === 'object' && typeof userConfig[key] === 'object') {
                result[key] = this.mergeConfig(result[key], userConfig[key]);
            } else {
                result[key] = userConfig[key];
            }
        }
        
        return result;
    }

    /**
     * 获取服务器地址
     */
    getServerUrl() {
        // 如果有最近使用的服务器地址，优先使用
        if (this.config.server.recentServers.length > 0) {
            return this.config.server.recentServers[0];
        }
        return this.config.server.defaultUrl;
    }

    /**
     * 设置服务器地址
     */
    setServerUrl(url) {
        // 验证URL格式
        try {
            const parsedUrl = new URL(url);
            
            // 移除已存在的相同地址
            this.config.server.recentServers = this.config.server.recentServers.filter(
                server => server !== url
            );
            
            // 添加到开头
            this.config.server.recentServers.unshift(url);
            
            // 只保留最近5个地址
            if (this.config.server.recentServers.length > 5) {
                this.config.server.recentServers = this.config.server.recentServers.slice(0, 5);
            }
            
            this.saveConfig();
            console.log('服务器地址已更新:', url);
            return true;
        } catch (error) {
            console.error('无效的URL:', url);
            return false;
        }
    }

    /**
     * 获取最近使用的服务器地址列表
     */
    getRecentServers() {
        return this.config.server.recentServers;
    }

    /**
     * 清除服务器历史
     */
    clearServerHistory() {
        this.config.server.recentServers = [];
        this.saveConfig();
    }

    /**
     * 获取游戏模式
     */
    getGameMode() {
        return this.config.game.mode;
    }

    /**
     * 设置游戏模式
     */
    setGameMode(mode) {
        this.config.game.mode = mode;
        this.saveConfig();
    }

    /**
     * 获取配置项
     */
    get(path) {
        const keys = path.split('.');
        let value = this.config;
        
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return undefined;
            }
        }
        
        return value;
    }

    /**
     * 设置配置项
     */
    set(path, value) {
        const keys = path.split('.');
        let obj = this.config;
        
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!(key in obj) || typeof obj[key] !== 'object') {
                obj[key] = {};
            }
            obj = obj[key];
        }
        
        obj[keys[keys.length - 1]] = value;
        this.saveConfig();
    }

    /**
     * 重置配置
     */
    resetConfig() {
        localStorage.removeItem('warfront_config');
        localStorage.removeItem('warfront_settings');
        localStorage.removeItem('kards_settings');
        this.loadConfig();
        console.log('配置已重置');
    }

    /**
     * 导出配置
     */
    exportConfig() {
        return JSON.stringify(this.config, null, 2);
    }

    /**
     * 导入配置
     */
    importConfig(configString) {
        try {
            const importedConfig = JSON.parse(configString);
            this.config = this.mergeConfig(this.config, importedConfig);
            this.saveConfig();
            console.log('配置已导入');
            return true;
        } catch (error) {
            console.error('导入配置失败:', error);
            return false;
        }
    }

    /**
     * 检查是否在 Cordova 环境中运行
     */
    isCordova() {
        return typeof window.cordova !== 'undefined';
    }

    /**
     * 检查是否在移动设备上运行
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        ) || this.isCordova();
    }

    /**
     * 获取设备信息
     */
    getDeviceInfo() {
        const info = {
            platform: 'web',
            userAgent: navigator.userAgent,
            isCordova: this.isCordova(),
            isMobile: this.isMobile()
        };

        if (this.isCordova()) {
            try {
                info.platform = window.cordova.platformId;
                info.version = window.device.version;
                info.model = window.device.model;
                info.uuid = window.device.uuid;
            } catch (error) {
                console.error('获取设备信息失败:', error);
            }
        }

        return info;
    }
}

// 创建全局实例
const configManager = new ConfigManager();

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConfigManager;
}