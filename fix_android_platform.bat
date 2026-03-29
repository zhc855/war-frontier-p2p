@echo off
title Fix Android Platform

echo.
echo ========================================
echo     Fix Android Platform
echo ========================================
echo.
echo This will fix the Android platform structure
echo.

cd /d "%~dp0"

:: Check if config.xml exists
if not exist "config.xml" (
    echo ERROR: config.xml not found!
    echo This is not a valid Cordova project.
    pause
    exit /b 1
)

echo Checking Android platform...
if not exist "platforms\android" (
    echo ERROR: Android platform not found!
    echo Running: cordova platform add android
    call cordova platform add android
) else (
    echo Android platform exists
    echo Removing and re-adding...
    call cordova platform remove android
    call cordova platform add android
)

echo.
echo ========================================
echo     Platform Setup Complete!
    echo ========================================
echo.
echo Now run build_apk.bat to build APK
echo.
pause