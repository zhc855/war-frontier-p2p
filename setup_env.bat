@echo off
title War Front - Environment Setup

echo.
echo ========================================
echo     War Front - Environment Setup
echo ========================================
echo.
echo This script will help you setup Android build environment
echo.

cd /d "%~dp0"

:: Check Node.js
echo [1/6] Checking Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found!
    echo.
    echo Please download and install Node.js from: https://nodejs.org/
    echo Recommended version: Node.js 18 or higher
    echo.
    pause
    exit /b 1
)
echo Node.js is installed
node --version

:: Check Java
echo.
echo [2/6] Checking Java JDK...
where java >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java JDK not found!
    echo.
    echo Please install JDK using one of these methods:
    echo.
    echo Method 1: Install JDK 17 or higher
    echo   Visit: https://www.oracle.com/java/technologies/downloads/
    echo   Or: https://adoptium.net/temurin/releases/
    echo.
    echo Method 2: Install Android Studio
    echo   Visit: https://developer.android.com/studio
    echo.
    pause
    exit /b 1
)
echo Java is installed
java -version

:: Check Android SDK
echo.
echo [3/6] Checking Android SDK...
set ANDROID_SDK_FOUND=0
set ANDROID_SDK=

:: Check common installation locations
if exist "%LOCALAPPDATA%\Android\Sdk" (
    set ANDROID_SDK=%LOCALAPPDATA%\Android\Sdk
    set ANDROID_SDK_FOUND=1
    echo Found Android SDK: %ANDROID_SDK%
) else if exist "C:\Android\Sdk" (
    set ANDROID_SDK=C:\Android\Sdk
    set ANDROID_SDK_FOUND=1
    echo Found Android SDK: %ANDROID_SDK%
)

if %ANDROID_SDK_FOUND%==0 (
    echo WARNING: Android SDK not found
    echo.
    echo Android SDK is required to build APK files.
    echo.
    echo Please install Android Studio:
    echo   1. Visit: https://developer.android.com/studio
    echo   2. Download and install Android Studio
    echo   3. Open Android Studio
    echo   4. Go to SDK Manager
    echo   5. Install Android SDK Platform-Tools
    echo   6. Install Android SDK Build-Tools
    echo   7. Install at least one Android SDK Platform (recommend API 33)
    echo.
    echo Or manually set ANDROID_HOME environment variable
    echo.
    echo Do you want to:
    echo   1. Skip Android SDK check and continue with other setup
    echo   2. Exit and install Android SDK first
    echo.
    set /p choice="Enter your choice (1 or 2): "
    if "%choice%"=="2" (
        echo.
        echo Please install Android SDK and run this script again.
        pause
        exit /b 1
    )
    echo.
    echo Skipping Android SDK check...
    set SKIP_ANDROID=1
) else (
    :: Set environment variables
    set ANDROID_HOME=%ANDROID_SDK%
    set ANDROID_SDK_ROOT=%ANDROID_SDK%
    echo Android SDK path: %ANDROID_HOME%
    set SKIP_ANDROID=0
)

:: Check Cordova
echo.
echo [4/6] Checking Cordova...
where cordova >nul 2>&1
if %errorlevel% neq 0 (
    echo Cordova not installed, installing now...
    call npm install -g cordova
    if errorlevel 1 (
        echo ERROR: Failed to install Cordova
        pause
        exit /b 1
    )
    echo Cordova installed successfully
) else (
    echo Cordova is installed
    cordova --version
)

:: Install project dependencies
echo.
echo [5/6] Installing project dependencies...
if not exist "node_modules" (
    echo Installing npm dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install npm dependencies
        pause
        exit /b 1
    )
    echo npm dependencies installed successfully
) else (
    echo npm dependencies already exist, skipping installation
)

:: Check Android platform
echo.
echo [6/6] Checking Cordova Android platform...
if %SKIP_ANDROID%==0 (
    if not exist "platforms\android" (
        echo Adding Android platform...
        call cordova platform add android
        if errorlevel 1 (
            echo ERROR: Failed to add Android platform
            pause
            exit /b 1
        )
        echo Android platform added successfully
    ) else (
        echo Android platform already exists
    )

    :: Check Gradle
    echo.
    echo Checking Gradle...
    if not exist "platforms\android\gradlew.bat" (
        echo Setting up Gradle wrapper...
        cd platforms\android
        call gradle wrapper --gradle-version 8.0
        cd ..\..
        echo Gradle wrapper setup completed
    ) else (
        echo Gradle wrapper already exists
    )
) else (
    echo Skipping Android platform setup (Android SDK not available)
    echo.
    echo You can add Android platform later by running:
    echo   cordova platform add android
    echo.
)

echo.
echo ========================================
echo     Environment Setup Complete!
echo ========================================
echo.
echo Environment info:
echo   Node.js: 
node --version
echo   Java: 
java -version
echo   Cordova: 
cordova --version
if %SKIP_ANDROID%==0 (
    echo   Android SDK: %ANDROID_HOME%
    echo.
    echo Next steps:
    echo   1. Run build_apk.bat to build APK
    echo   2. Or run build_release.bat to build release version
) else (
    echo   Android SDK: Not installed
    echo.
    echo IMPORTANT: You need to install Android SDK to build APK files
    echo.
    echo To install Android SDK:
    echo   1. Download and install Android Studio from: https://developer.android.com/studio
    echo   2. Run setup_env.bat again to complete setup
    echo.
    echo For now, you can:
    echo   - Test the game in browser
    echo   - Run the server for multiplayer
)
echo.
echo Note: First build may take 10-20 minutes
echo.
pause