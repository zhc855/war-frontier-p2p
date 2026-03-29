@echo off
title Install Android SDK Components

echo.
echo ========================================
echo     Install Android SDK Components
echo ========================================
echo.
echo Installing required components...
echo This may take 10-30 minutes
echo.

cd /d "%~dp0"

:: Set environment variables
set ANDROID_HOME=C:\Android\Sdk
set ANDROID_SDK_ROOT=C:\Android\Sdk
set PATH=%PATH%;C:\Android\Sdk\cmdline-tools\latest\bin;C:\Android\Sdk\platform-tools

:: Install components
echo [1/6] Installing platform-tools...
call "C:\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat" "platform-tools"

echo [2/6] Installing Android platforms (33)...
call "C:\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat" "platforms;android-33"

echo [3/6] Installing Android platforms (34)...
call "C:\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat" "platforms;android-34"

echo [4/6] Installing build-tools (34.0.0)...
call "C:\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat" "build-tools;34.0.0"

echo [5/6] Installing build-tools (33.0.2)...
call "C:\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat" "build-tools;33.0.2"

echo [6/6] Installing build-tools (33.0.0)...
call "C:\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat" "build-tools;33.0.0"

echo.
echo ========================================
echo     Installation Complete!
echo ========================================
echo.
pause