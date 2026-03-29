@echo off
title War Front - 简化构建脚本

echo.
echo ========================================
echo     War Front - 构建 APK
echo ========================================
echo.
echo 此脚本将构建 Android APK 文件
echo.

cd /d "%~dp0"

:: 检查环境
echo 检查构建环境...

where java >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到 Java JDK
    echo 请运行 setup_environment.bat 设置环境
    pause
    exit /b 1
)

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到 Node.js
    echo 请运行 setup_environment.bat 设置环境
    pause
    exit /b 1
)

if not exist "platforms\android" (
    echo 错误: Android 平台不存在
    echo 请运行 setup_environment.bat 设置环境
    pause
    exit /b 1
)

echo 环境检查通过
echo.

:: 构建选项
echo 请选择构建类型:
echo   1. Debug 版本 (快速构建，用于测试)
echo   2. Release 版本 (优化构建，用于发布)
echo.
set /p build_type="请输入选项 (1 或 2): "

if "%build_type%"=="1" (
    set target=assembleDebug
    set output_dir=debug
    set apk_name=app-debug.apk
) else if "%build_type%"=="2" (
    set target=assembleRelease
    set output_dir=release
    set apk_name=app-release.apk
) else (
    echo 无效的选项
    pause
    exit /b 1
)

echo.
echo 开始构建 %apk_name%...
echo 这可能需要 5-15 分钟，请耐心等待...
echo.

cd platforms\android

:: 构建
call gradlew.bat %target%

if errorlevel 1 (
    echo.
    echo ========================================
    echo     构建失败
    echo ========================================
    echo.
    echo 可能的原因:
    echo   1. Java 版本不兼容 (需要 JDK 17 或更高)
    echo   2. Android SDK 未正确安装
    echo   3. 网络问题 (下载依赖)
    echo   4. 磁盘空间不足
    echo.
    echo 解决方案:
    echo   1. 运行 setup_environment.bat 重新设置环境
    echo   2. 检查 Java 版本: java -version
    echo   3. 清理构建: gradlew.bat clean
    echo   4. 检查网络连接
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo     构建成功！
echo ========================================
echo.
echo APK 文件位置:
echo   platforms\android\app\build\outputs\apk\%output_dir%\%apk_name%
echo.
echo 完整路径:
echo   %cd%\app\build\outputs\apk\%output_dir%\%apk_name%
echo.
echo 文件大小:
dir "app\build\outputs\apk\%output_dir%\%apk_name%" | findstr "%apk_name%"
echo.
echo ========================================
echo     下一步
echo ========================================
echo.
echo 1. 将 APK 文件传输到手机
echo 2. 在手机上安装 APK
echo 3. 打开 "War Front" 应用
echo 4. 开始游戏！
echo.
echo 如果是 Debug 版本，可以直接安装
echo 如果是 Release 版本，需要对 APK 进行签名
echo.
echo 按任意键关闭此窗口...
pause >nul