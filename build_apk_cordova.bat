@echo off
title Build APK using Cordova

echo.
echo ========================================
echo     Build APK using Cordova
echo ========================================
echo.
echo This will build Android APK using Cordova CLI
echo.

cd /d "%~dp0"

:: Set environment variables
set ANDROID_HOME=C:\Android\Sdk
set ANDROID_SDK_ROOT=C:\Android\Sdk
set PATH=%PATH%;C:\Android\Sdk\cmdline-tools\latest\bin;C:\Android\Sdk\platform-tools

echo Checking Cordova installation...
cordova --version
if %errorlevel% neq 0 (
    echo ERROR: Cordova not working!
    echo Please run: npm install -g cordova
    pause
    exit /b 1
)
echo.

echo Checking Android platform...
if not exist "platforms\android" (
    echo Android platform not found, adding...
    call cordova platform add android
)
echo.

echo Building Android APK...
echo This may take 5-15 minutes...
echo.

call cordova build android --debug 2>&1

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo     Build Successful!
    echo ========================================
    echo.
    echo APK Location:
    echo   platforms\android\app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo Full Path:
    echo   %cd%\platforms\android\app\build\outputs\apk\debug\app-debug.apk
    echo.
) else (
    echo.
    echo ========================================
    echo     Build Failed
    echo ========================================
    echo.
    echo Please check error messages above
    echo.
)

pause