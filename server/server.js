/**
 * 战争前线联机对战服务器
 * 使用 Socket.io 实现实时通信
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const RoomManager = require('./room-manager');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// 启用CORS
app.use(cors());
app.use(express.json());

// 静态文件服务
app.use(express.static(__dirname + '/../'));

// 房间管理器
const roomManager = new RoomManager();

// 游戏常量
const MAX_PLAYERS_PER_ROOM = 2;
const ROOM_ID_LENGTH = 6;

/**
 * 生成房间ID
 */
function generateRoomId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let roomId = '';
    for (let i = 0; i < ROOM_ID_LENGTH; i++) {
        roomId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return roomId;
}

/**
 * Socket.io 连接处理
 */
io.on('connection', (socket) => {
    console.log(`玩家连接: ${socket.id}`);

    // 玩家信息
    let playerInfo = {
        id: socket.id,
        name: `玩家${Math.floor(Math.random() * 10000)}`,
        roomId: null,
        playerNumber: null
    };

    // 创建房间
    socket.on('create_room', (data) => {
        console.log(`创建房间请求: ${socket.id}`, data);

        try {
            // 生成房间ID
            let roomId;
            do {
                roomId = generateRoomId();
            } while (roomManager.getRoom(roomId));

            // 创建房间
            const room = roomManager.createRoom(roomId, {
                host: playerInfo.id,
                hostName: data.playerName || playerInfo.name,
                settings: data.settings || {}
            });

            // 加入房间
            playerInfo.roomId = roomId;
            playerInfo.playerNumber = 1;
            playerInfo.name = data.playerName || playerInfo.name;

            socket.join(roomId);

            // 保存玩家信息
            room.players[1] = {
                id: socket.id,
                name: playerInfo.name,
                faction: null,
                deck: null,
                ready: false
            };

            console.log(`房间创建成功: ${roomId}, 玩家: ${playerInfo.name}`);

            // 发送房间信息
            socket.emit('room_created', {
                roomId: roomId,
                playerNumber: 1,
                room: roomManager.getPublicRoomInfo(roomId)
            });

            // 广播房间列表更新
            io.emit('rooms_updated', roomManager.getPublicRoomsList());

        } catch (error) {
            console.error('创建房间失败:', error);
            socket.emit('error', { message: '创建房间失败: ' + error.message });
        }
    });

    // 加入房间
    socket.on('join_room', (data) => {
        console.log(`加入房间请求: ${socket.id}, 房间: ${data.roomId}`);

        try {
            const roomId = data.roomId;

            // 检查房间是否存在
            const room = roomManager.getRoom(roomId);
            if (!room) {
                socket.emit('error', { message: '房间不存在' });
                return;
            }

            // 检查房间是否已满
            if (Object.keys(room.players).length >= MAX_PLAYERS_PER_ROOM) {
                socket.emit('error', { message: '房间已满' });
                return;
            }

            // 加入房间
            socket.join(roomId);
            playerInfo.roomId = roomId;
            playerInfo.playerNumber = 2;
            playerInfo.name = data.playerName || `玩家${Math.floor(Math.random() * 10000)}`;

            // 保存玩家信息
            room.players[2] = {
                id: socket.id,
                name: playerInfo.name,
                faction: null,
                deck: null,
                ready: false
            };

            console.log(`玩家加入房间: ${roomId}, 玩家: ${playerInfo.name}`);

            // 发送加入成功消息
            socket.emit('room_joined', {
                roomId: roomId,
                playerNumber: 2,
                room: roomManager.getPublicRoomInfo(roomId)
            });

            // 通知房间内其他玩家
            socket.to(roomId).emit('player_joined', {
                playerNumber: 2,
                playerName: playerInfo.name
            });

            // 更新房间状态
            io.to(roomId).emit('room_updated', roomManager.getPublicRoomInfo(roomId));

            // 广播房间列表更新
            io.emit('rooms_updated', roomManager.getPublicRoomsList());

        } catch (error) {
            console.error('加入房间失败:', error);
            socket.emit('error', { message: '加入房间失败: ' + error.message });
        }
    });

    // 准备游戏
    socket.on('player_ready', (data) => {
        console.log(`玩家准备: ${socket.id}`, data);

        try {
            const roomId = playerInfo.roomId;
            if (!roomId) {
                socket.emit('error', { message: '不在房间中' });
                return;
            }

            const room = roomManager.getRoom(roomId);
            if (!room) {
                socket.emit('error', { message: '房间不存在' });
                return;
            }

            const playerNum = playerInfo.playerNumber;
            if (!room.players[playerNum]) {
                socket.emit('error', { message: '玩家信息不存在' });
                return;
            }

            // 更新玩家准备状态
            room.players[playerNum].faction = data.faction;
            room.players[playerNum].deck = data.deck;
            room.players[playerNum].ready = true;

            console.log(`玩家 ${playerNum} 准备完成，阵营: ${data.faction}`);

            // 通知房间内其他玩家
            socket.to(roomId).emit('player_ready', {
                playerNumber: playerNum,
                faction: data.faction
            });

            // 检查是否可以开始游戏
            const allReady = Object.values(room.players).every(p => p && p.ready && p.faction && p.deck);

            if (allReady) {
                console.log(`房间 ${roomId} 所有玩家准备完毕，开始游戏`);
                startGame(io, roomId, room);
            }

            // 更新房间状态
            io.to(roomId).emit('room_updated', roomManager.getPublicRoomInfo(roomId));

        } catch (error) {
            console.error('准备失败:', error);
            socket.emit('error', { message: '准备失败: ' + error.message });
        }
    });

    // 游戏操作
    socket.on('game_action', (data) => {
        console.log(`游戏操作: ${socket.id}`, data);

        try {
            const roomId = playerInfo.roomId;
            if (!roomId) {
                socket.emit('error', { message: '不在房间中' });
                return;
            }

            const room = roomManager.getRoom(roomId);
            if (!room || !room.game) {
                socket.emit('error', { message: '游戏不存在或未开始' });
                return;
            }

            const playerNum = playerInfo.playerNumber;
            if (room.game.currentPlayer !== playerNum) {
                socket.emit('error', { message: '不是你的回合' });
                return;
            }

            // 处理游戏操作
            const result = handleGameAction(room.game, playerNum, data);

            if (result.success) {
                // 广播游戏状态更新
                io.to(roomId).emit('game_state_updated', {
                    gameState: room.game.getState(),
                    action: data.action,
                    result: result
                });

                // 检查游戏是否结束
                if (result.gameOver) {
                    endGame(io, roomId, room, result.winner);
                }
            } else {
                socket.emit('action_failed', {
                    action: data.action,
                    message: result.message
                });
            }

        } catch (error) {
            console.error('游戏操作失败:', error);
            socket.emit('error', { message: '操作失败: ' + error.message });
        }
    });

    // 聊天消息
    socket.on('chat_message', (data) => {
        console.log(`聊天消息: ${socket.id}`, data);

        try {
            const roomId = playerInfo.roomId;
            if (!roomId) return;

            const room = roomManager.getRoom(roomId);
            if (!room) return;

            const playerNum = playerInfo.playerNumber;
            const playerName = room.players[playerNum]?.name || '未知玩家';

            // 广播聊天消息
            io.to(roomId).emit('chat_message', {
                playerNumber: playerNum,
                playerName: playerName,
                message: data.message,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('发送聊天消息失败:', error);
        }
    });

    // 离开房间
    socket.on('leave_room', () => {
        console.log(`离开房间: ${socket.id}`);

        try {
            const roomId = playerInfo.roomId;
            if (!roomId) return;

            leaveRoom(socket, roomId, playerInfo);

        } catch (error) {
            console.error('离开房间失败:', error);
        }
    });

    // 断开连接
    socket.on('disconnect', () => {
        console.log(`玩家断开连接: ${socket.id}`);

        try {
            const roomId = playerInfo.roomId;
            if (roomId) {
                leaveRoom(socket, roomId, playerInfo);
            }
        } catch (error) {
            console.error('断开连接处理失败:', error);
        }
    });

    /**
     * 离开房间
     */
    function leaveRoom(socket, roomId, playerInfo) {
        const room = roomManager.getRoom(roomId);
        if (!room) return;

        const playerNum = playerInfo.playerNumber;

        // 移除玩家
        if (room.players[playerNum] && room.players[playerNum].id === socket.id) {
            delete room.players[playerNum];

            // 通知房间内其他玩家
            socket.to(roomId).emit('player_left', {
                playerNumber: playerNum
            });

            // 如果游戏正在进行，结束游戏
            if (room.game && !room.game.gameOver) {
                const winner = playerNum === 1 ? 2 : 1;
                endGame(io, roomId, room, winner, true);
            }

            // 如果房间为空，删除房间
            if (Object.keys(room.players).length === 0) {
                roomManager.deleteRoom(roomId);
                io.emit('rooms_updated', roomManager.getPublicRoomsList());
            } else {
                // 更新房间状态
                io.to(roomId).emit('room_updated', roomManager.getPublicRoomInfo(roomId));
                io.emit('rooms_updated', roomManager.getPublicRoomsList());
            }
        }

        socket.leave(roomId);
        playerInfo.roomId = null;
        playerInfo.playerNumber = null;
    }
});

/**
 * 开始游戏
 */
function startGame(io, roomId, room) {
    console.log(`开始游戏: ${roomId}`);
    console.log('房间玩家:', Object.keys(room.players));

    const Game = require('./game-logic');
    const game = new Game();

    // 确保玩家数据存在
    if (!room.players[1] || !room.players[2]) {
        console.error('缺少玩家数据');
        return;
    }

    console.log('玩家1阵营:', room.players[1].faction, '牌组:', room.players[1].deck);
    console.log('玩家2阵营:', room.players[2].faction, '牌组:', room.players[2].deck);

    // 初始化游戏
    game.initGame(
        {
            faction: room.players[1].faction,
            cards: room.players[1].deck
        },
        {
            faction: room.players[2].faction,
            cards: room.players[2].deck
        }
    );

    console.log('游戏初始化完成');
    console.log('游戏状态:', JSON.stringify(game.getState(), (key, value) => {
        if (typeof value === 'object' && value !== null) {
            return '[Object]';
        }
        return value;
    }, 2));

    // 保存游戏实例
    room.game = game;
    room.status = 'playing';

    // 通知所有玩家游戏开始
    console.log('发送game_started事件');
    io.to(roomId).emit('game_started', {
        gameState: game.getState()
    });

    // 更新房间状态
    io.emit('rooms_updated', roomManager.getPublicRoomsList());
}

/**
 * 结束游戏
 */
function endGame(io, roomId, room, winner, disconnected = false) {
    console.log(`游戏结束: ${roomId}, 获胜者: ${winner}`);

    if (!room.game) return;

    room.game.gameOver = true;
    room.game.winner = winner;

    // 通知所有玩家游戏结束
    io.to(roomId).emit('game_ended', {
        winner: winner,
        disconnected: disconnected,
        gameState: room.game.getState()
    });

    // 更新房间状态
    room.status = 'finished';
    io.emit('rooms_updated', roomManager.getPublicRoomsList());
}

/**
 * 处理游戏操作
 */
function handleGameAction(game, playerNum, data) {
    const action = data.action;
    const params = data.params || {};

    try {
        switch (action) {
            case 'select_card':
                return game.selectCardForDeploy(params.cardIndex);
            case 'deploy_unit':
                return game.deployUnit(params.slotIndex);
            case 'select_unit':
                return game.selectUnit(params.area, params.index);
            case 'move_unit':
                return game.moveUnit(params.targetIndex);
            case 'attack':
                return game.attackTarget(params.targetArea, params.targetIndex);
            case 'wait_unit':
                return game.waitUnit();
            case 'end_turn':
                game.endTurn();
                return { success: true, message: '回合结束' };
            default:
                return { success: false, message: '未知操作' };
        }
    } catch (error) {
        console.error('处理游戏操作失败:', error);
        return { success: false, message: error.message };
    }
}

// 获取房间列表
app.get('/api/rooms', (req, res) => {
    res.json(roomManager.getPublicRoomsList());
});

// 健康检查
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
const os = require('os');

// 获取本机IP地址
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

server.listen(PORT, () => {
    const localIP = getLocalIP();
    console.log(`=================================`);
    console.log(`战争前线服务器启动成功`);
    console.log(`=================================`);
    console.log(`本地访问: http://localhost:${PORT}`);
    console.log(`局域网访问: http://${localIP}:${PORT}`);
    console.log(`端口: ${PORT}`);
    console.log(`时间: ${new Date().toLocaleString()}`);
    console.log(`=================================`);
    console.log(`手机访问指南:`);
    console.log(`1. 确保手机和电脑在同一WiFi`);
    console.log(`2. 手机浏览器输入: http://${localIP}:${PORT}`);
    console.log(`=================================`);
});

// 优雅关闭
process.on('SIGTERM', () => {
    console.log('收到 SIGTERM 信号，正在关闭服务器...');
    server.close(() => {
        console.log('服务器已关闭');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n收到 SIGINT 信号，正在关闭服务器...');
    server.close(() => {
        console.log('服务器已关闭');
        process.exit(0);
    });
});