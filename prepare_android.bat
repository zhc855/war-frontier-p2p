@echo off
title Prepare Android Platform

echo.
echo ========================================
echo     Prepare Android Platform
echo ========================================
echo.
echo This will generate Gradle wrapper files
echo.

cd /d "%~dp0"

echo Preparing Android platform...
echo This may take 2-5 minutes...
echo.

call cordova prepare android

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo     Preparation Complete!
    echo ========================================
    echo.
    echo Now you can run build_apk.bat
    echo.
) else (
    echo.
    echo ========================================
    echo     Preparation Failed
    echo ========================================
    echo.
    echo Please check the error messages above
    echo.
)

pause