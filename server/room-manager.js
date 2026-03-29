/**
 * 房间管理器
 * 管理所有游戏房间的创建、删除和查询
 */

class RoomManager {
    constructor() {
        this.rooms = new Map();
    }

    /**
     * 创建房间
     * @param {string} roomId - 房间ID
     * @param {Object} options - 房间选项
     * @returns {Object} 房间对象
     */
    createRoom(roomId, options = {}) {
        const room = {
            id: roomId,
            status: 'waiting', // waiting, playing, finished
            host: options.host || null,
            hostName: options.hostName || '主机',
            settings: options.settings || {},
            players: {}, // {1: {id, name, faction, deck, ready}, 2: {...}}
            game: null,
            createdAt: new Date().toISOString(),
            lastActivity: new Date().toISOString()
        };

        this.rooms.set(roomId, room);
        console.log(`房间创建: ${roomId}`);
        return room;
    }

    /**
     * 获取房间
     * @param {string} roomId - 房间ID
     * @returns {Object|null} 房间对象
     */
    getRoom(roomId) {
        return this.rooms.get(roomId) || null;
    }

    /**
     * 删除房间
     * @param {string} roomId - 房间ID
     * @returns {boolean} 是否删除成功
     */
    deleteRoom(roomId) {
        const deleted = this.rooms.delete(roomId);
        if (deleted) {
            console.log(`房间删除: ${roomId}`);
        }
        return deleted;
    }

    /**
     * 获取所有房间
     * @returns {Array} 房间数组
     */
    getAllRooms() {
        return Array.from(this.rooms.values());
    }

    /**
     * 获取公共房间列表（不包含敏感信息）
     * @returns {Array} 房间列表
     */
    getPublicRoomsList() {
        return this.getAllRooms()
            .filter(room => room.status === 'waiting')
            .map(room => this.getPublicRoomInfo(room.id));
    }

    /**
     * 获取房间公共信息
     * @param {string} roomId - 房间ID
     * @returns {Object} 房间公共信息
     */
    getPublicRoomInfo(roomId) {
        const room = this.getRoom(roomId);
        if (!room) return null;

        return {
            id: room.id,
            status: room.status,
            hostName: room.hostName,
            playerCount: Object.keys(room.players).length,
            maxPlayers: 2,
            players: this.getPlayersInfo(room),
            settings: room.settings,
            createdAt: room.createdAt
        };
    }

    /**
     * 获取玩家信息（脱敏）
     * @param {Object} room - 房间对象
     * @returns {Array} 玩家信息数组
     */
    getPlayersInfo(room) {
        return Object.entries(room.players).map(([playerNum, player]) => ({
            playerNumber: parseInt(playerNum),
            name: player.name,
            faction: player.faction || null,
            ready: player.ready || false
        }));
    }

    /**
     * 更新房间活动时间
     * @param {string} roomId - 房间ID
     */
    updateActivity(roomId) {
        const room = this.getRoom(roomId);
        if (room) {
            room.lastActivity = new Date().toISOString();
        }
    }

    /**
     * 清理空闲房间
     * @param {number} maxIdleMinutes - 最大空闲时间（分钟）
     * @returns {number} 清理的房间数量
     */
    cleanupIdleRooms(maxIdleMinutes = 30) {
        const now = new Date();
        let cleaned = 0;

        this.rooms.forEach((room, roomId) => {
            const lastActivity = new Date(room.lastActivity);
            const idleMinutes = (now - lastActivity) / (1000 * 60);

            if (idleMinutes > maxIdleMinutes && room.status !== 'playing') {
                this.deleteRoom(roomId);
                cleaned++;
            }
        });

        if (cleaned > 0) {
            console.log(`清理了 ${cleaned} 个空闲房间`);
        }

        return cleaned;
    }

    /**
     * 获取房间统计信息
     * @returns {Object} 统计信息
     */
    getStats() {
        const rooms = this.getAllRooms();
        return {
            totalRooms: rooms.length,
            waitingRooms: rooms.filter(r => r.status === 'waiting').length,
            playingRooms: rooms.filter(r => r.status === 'playing').length,
            finishedRooms: rooms.filter(r => r.status === 'finished').length,
            totalPlayers: rooms.reduce((sum, room) => sum + Object.keys(room.players).length, 0)
        };
    }
}

module.exports = RoomManager;