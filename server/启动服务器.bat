@echo off
chcp 65001 >nul
title 战争前线 - 游戏服务器

echo ========================================
echo     战争前线 - KARDS风格卡牌对战
echo     游戏服务器启动器
echo ========================================
echo.

if not exist "node_modules" (
    echo [信息] 首次运行，正在安装依赖...
    echo.
    call npm install
    echo.
    echo [信息] 依赖安装完成！
    echo.
)

echo [信息] 正在启动游戏服务器...
echo.
echo 服务器地址: http://localhost:3000
echo 按 Ctrl+C 可以停止服务器
echo ========================================
echo.

call npm start

pause