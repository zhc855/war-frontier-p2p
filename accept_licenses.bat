@echo off
title Accept Android SDK Licenses

echo.
echo ========================================
echo     Accept Android SDK Licenses
echo ========================================
echo.
echo This script will accept all Android SDK licenses
echo You may need to type 'y' and press Enter multiple times
echo.
echo Starting...
echo.

set ANDROID_HOME=C:\Android\Sdk
set ANDROID_SDK_ROOT=C:\Android\Sdk
set PATH=%PATH%;C:\Android\Sdk\cmdline-tools\latest\bin;C:\Android\Sdk\platform-tools

cd /d "%~dp0"

echo y | sdkmanager --licenses

echo.
echo ========================================
echo     Licenses Accepted!
echo ========================================
echo.
echo Now you can run install_sdk_components.bat
echo.
pause