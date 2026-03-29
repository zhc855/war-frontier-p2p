@echo off
title War Front - Final Build Script

echo.
echo ========================================
echo     War Front - Android Build
echo ========================================
echo.
echo Checking prerequisites...
echo.

cd /d "%~dp0"

:: Check Java
echo [1/3] Checking Java...
where java >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java JDK not found!
    echo.
    echo Please install JDK first:
    echo 1. Visit: https://www.oracle.com/java/technologies/downloads/#java17
    echo 2. Download and install JDK 17
    echo 3. Restart your computer
    echo 4. Run this script again
    echo.
    pause
    exit /b 1
)
echo Java found: OK
java -version | findstr /i "version"

:: Check Node.js
echo.
echo [2/3] Checking Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js found: OK
node --version

:: Check Android platform
echo.
echo [3/3] Checking Android platform...
if not exist "platforms\android\gradlew.bat" (
    echo Setting up Gradle wrapper...
    cd platforms\android
    gradle wrapper --gradle-version 7.6.1
    cd ..\..
    echo Gradle wrapper created
)
echo Android platform: OK

echo.
echo ========================================
echo     Building Android APK
echo ========================================
echo.
echo This may take 5-10 minutes...
echo.

cd platforms\android

:: Build debug APK
echo Building debug APK...
call gradlew.bat assembleDebug

if errorlevel 1 (
    echo.
    echo ========================================
    echo     BUILD FAILED
    echo ========================================
    echo.
    echo Please check:
    echo 1. Java is properly installed
    echo 2. Android SDK is installed
    echo 3. Environment variables are set
    echo.
    echo Run: check_jdk.bat to verify installation
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo     BUILD SUCCESSFUL!
    echo ========================================
echo.
echo APK Location:
echo   platforms\android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo Full Path:
echo   %cd%\app\build\outputs\apk\debug\app-debug.apk
echo.
echo APK Size:
dir "app\build\outputs\apk\debug\app-debug.apk" | findstr "app-debug.apk"
echo.
echo ========================================
echo     Next Steps
echo ========================================
echo.
echo 1. Copy APK to your phone
echo 2. Install the APK
echo 3. Open "War Front" app
echo 4. Start playing!
echo.
echo For phone-to-phone multiplayer:
echo - Start game server
echo - Connect phones to same network
echo - Play via room ID
echo.
echo Press any key to close this window...
pause >nul