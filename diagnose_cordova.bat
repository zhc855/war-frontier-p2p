@echo off
title Diagnose Cordova Build

echo.
echo ========================================
echo     Diagnose Cordova Build
echo ========================================
echo.
echo Checking environment...
echo.

cd /d "%~dp0"

:: Check if cordova is installed
echo [1] Checking Cordova...
where cordova >nul 2>&1
if %errorlevel% equ 0 (
    cordova --version
    echo Cordova is installed: OK
) else (
    echo ERROR: Cordova not found!
    echo Please run: npm install -g cordova
    pause
    exit /b 1
)

echo.

:: Check if Android platform exists
echo [2] Checking Android platform...
if exist "platforms\android" (
    echo Android platform exists: OK
) else (
    echo ERROR: Android platform not found!
    echo Running: cordova platform add android
    call cordova platform add android
    if %errorlevel% neq 0 (
        echo Failed to add Android platform
        pause
        exit /b 1
    )
)

echo.

:: Check config.xml
echo [3] Checking config.xml...
if exist "config.xml" (
    echo config.xml exists: OK
) else (
    echo ERROR: config.xml not found!
    echo This is required for Cordova project
    pause
    exit /b 1
)

echo.

:: Try to run cordova requirements
echo [4] Checking Android requirements...
call cordova requirements android

echo.
echo ========================================
echo     All checks passed!
    echo ========================================
echo.
echo Next: Run build_apk_cordova.bat
echo.
pause