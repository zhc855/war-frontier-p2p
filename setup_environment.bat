@echo off
title War Front - 环境设置脚本

echo.
echo ========================================
echo     War Front - 环境设置
echo ========================================
echo.
echo 此脚本将帮助您设置 Android 构建环境
echo.

cd /d "%~dp0"

:: 检查 Node.js
echo [1/5] 检查 Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到 Node.js！
    echo.
    echo 请从 https://nodejs.org/ 下载并安装 Node.js
    echo 推荐版本: Node.js 18 或更高版本
    echo.
    pause
    exit /b 1
)
echo Node.js 已安装
node --version

:: 检查 Java
echo.
echo [2/5] 检查 Java JDK...
where java >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到 Java JDK！
    echo.
    echo 请选择以下方式之一安装 JDK：
    echo.
    echo 方式1: 安装 JDK 17 (推荐)
    echo   访问: https://www.oracle.com/java/technologies/downloads/#java17
    echo   下载并安装 JDK 17
    echo.
    echo 方式2: 安装 Android Studio (包含所有必需工具)
    echo   访问: https://developer.android.com/studio
    echo   下载并安装 Android Studio
    echo.
    pause
    exit /b 1
)
echo Java 已安装
java -version

:: 检查 Android SDK
echo.
echo [3/5] 检查 Android SDK...
set ANDROID_SDK_FOUND=0

:: 检查常见安装位置
if exist "%LOCALAPPDATA%\Android\Sdk" (
    set ANDROID_SDK=%LOCALAPPDATA%\Android\Sdk
    set ANDROID_SDK_FOUND=1
    echo 找到 Android SDK: %ANDROID_SDK%
) else if exist "%APPDATA%\..\Local\Android\Sdk" (
    set ANDROID_SDK=%APPDATA%\..\Local\Android\Sdk
    set ANDROID_SDK_FOUND=1
    echo 找到 Android SDK: %ANDROID_SDK%
) else if exist "C:\Android\Sdk" (
    set ANDROID_SDK=C:\Android\Sdk
    set ANDROID_SDK_FOUND=1
    echo 找到 Android SDK: %ANDROID_SDK%
)

if %ANDROID_SDK_FOUND%==0 (
    echo 警告: 未找到 Android SDK
    echo.
    echo 请安装 Android Studio:
    echo   1. 访问: https://developer.android.com/studio
    echo   2. 下载并安装 Android Studio
    echo   3. 打开 Android Studio
    echo   4. 进入 SDK Manager
    echo   5. 安装 Android SDK Platform-Tools
    echo   6. 安装 Android SDK Build-Tools
    echo   7. 安装至少一个 Android SDK Platform (推荐 API 33)
    echo.
    echo 或者手动设置 ANDROID_HOME 环境变量
    echo.
    pause
    exit /b 1
)

:: 设置环境变量
set ANDROID_HOME=%ANDROID_SDK%
set ANDROID_SDK_ROOT=%ANDROID_SDK%

echo Android SDK 路径: %ANDROID_HOME%

:: 检查 Cordova
echo.
echo [4/5] 检查 Cordova...
where cordova >nul 2>&1
if %errorlevel% neq 0 (
    echo Cordova 未安装，正在安装...
    call npm install -g cordova
    if errorlevel 1 (
        echo 错误: Cordova 安装失败
        pause
        exit /b 1
    )
    echo Cordova 安装成功
) else (
    echo Cordova 已安装
    cordova --version
)

:: 安装项目依赖
echo.
echo [5/5] 安装项目依赖...
if not exist "node_modules" (
    echo 正在安装 npm 依赖...
    call npm install
    if errorlevel 1 (
        echo 错误: npm 依赖安装失败
        pause
        exit /b 1
    )
    echo npm 依赖安装成功
) else (
    echo npm 依赖已存在，跳过安装
)

:: 检查 Android 平台
echo.
echo 检查 Cordova Android 平台...
if not exist "platforms\android" (
    echo 正在添加 Android 平台...
    call cordova platform add android
    if errorlevel 1 (
        echo 错误: Android 平台添加失败
        pause
        exit /b 1
    )
    echo Android 平台添加成功
) else (
    echo Android 平台已存在
)

:: 检查 Gradle
echo.
echo 检查 Gradle...
if not exist "platforms\android\gradlew.bat" (
    echo 正在设置 Gradle wrapper...
    cd platforms\android
    call gradle wrapper --gradle-version 8.0
    cd ..\..
    echo Gradle wrapper 设置完成
) else (
    echo Gradle wrapper 已存在
)

echo.
echo ========================================
echo     环境设置完成！
echo ========================================
echo.
echo 环境信息:
echo   Node.js: 
node --version
echo   Java: 
java -version
echo   Cordova: 
cordova --version
echo   Android SDK: %ANDROID_HOME%
echo.
echo 下一步:
echo   1. 运行 build_android.bat 构建 APK
echo   2. 或运行 build_android_release.bat 构建发布版本
echo.
echo 注意: 首次构建可能需要 10-20 分钟
echo.
pause