@echo off
title War Front - Build APK

echo.
echo ========================================
echo     War Front - Build APK
echo ========================================
echo.
echo This script will build Android APK file
echo.

cd /d "%~dp0"

:: Check environment
echo Checking build environment...

where java >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java JDK not found
    echo Please run setup_env.bat to setup environment
    pause
    exit /b 1
)

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found
    echo Please run setup_env.bat to setup environment
    pause
    exit /b 1
)

if not exist "platforms\android" (
    echo ERROR: Android platform not found
    echo Please run setup_env.bat to setup environment
    pause
    exit /b 1
)

echo Environment check passed
echo.

:: Build options
echo Select build type:
echo   1. Debug version (fast build, for testing)
echo   2. Release version (optimized build, for publishing)
echo.
set /p build_type="Enter option (1 or 2): "

if "%build_type%"=="1" (
    set target=assembleDebug
    set output_dir=debug
    set apk_name=app-debug.apk
) else if "%build_type%"=="2" (
    set target=assembleRelease
    set output_dir=release
    set apk_name=app-release.apk
) else (
    echo Invalid option
    pause
    exit /b 1
)

echo.
echo Building %apk_name%...
echo This may take 5-15 minutes, please wait...
echo.

cd platforms\android

:: Build
call gradlew.bat %target%

if errorlevel 1 (
    echo.
    echo ========================================
    echo     Build Failed
    echo ========================================
    echo.
    echo Possible reasons:
    echo   1. Java version incompatible (need JDK 17+)
    echo   2. Android SDK not properly installed
    echo   3. Network issues (downloading dependencies)
    echo   4. Insufficient disk space
    echo.
    echo Solutions:
    echo   1. Run setup_env.bat to reset environment
    echo   2. Check Java version: java -version
    echo   3. Clean build: gradlew.bat clean
    echo   4. Check network connection
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo     Build Successful!
echo ========================================
echo.
echo APK file location:
echo   platforms\android\app\build\outputs\apk\%output_dir%\%apk_name%
echo.
echo Full path:
echo   %cd%\app\build\outputs\apk\%output_dir%\%apk_name%
echo.
echo File size:
dir "app\build\outputs\apk\%output_dir%\%apk_name%" | findstr "%apk_name%"
echo.
echo ========================================
echo     Next Steps
echo ========================================
echo.
echo 1. Transfer APK file to your phone
echo 2. Install APK on your phone
echo 3. Open "War Front" app
echo 4. Start playing!
echo.
echo For Debug version, you can install directly
echo For Release version, you need to sign the APK
echo.
echo Press any key to close this window...
pause >nul