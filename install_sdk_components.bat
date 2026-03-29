@echo off
title Install Android SDK Components

echo.
echo ========================================
echo     Install Android SDK Components
echo ========================================
echo.
echo This script will install required Android SDK components
echo.

:: Set environment variables for this session
set ANDROID_HOME=C:\Android\Sdk
set ANDROID_SDK_ROOT=C:\Android\Sdk
set PATH=%PATH%;C:\Android\Sdk\cmdline-tools\latest\bin;C:\Android\Sdk\platform-tools

echo Setting environment variables:
echo   ANDROID_HOME=%ANDROID_HOME%
echo   ANDROID_SDK_ROOT=%ANDROID_SDK_ROOT%
echo.

:: Check if sdkmanager.bat is available
if not exist "C:\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat" (
    echo ERROR: sdkmanager.bat not found!
    echo.
    echo Please make sure:
    echo 1. Android SDK is installed
    echo 2. Directory structure: C:\Android\Sdk\cmdline-tools\latest\bin
    echo 3. sdkmanager.bat exists in that directory
    echo.
    echo Read ANDROID_SDK_INSTALL_GUIDE.md for installation instructions
    pause
    exit /b 1
)

echo sdkmanager.bat found
call sdkmanager.bat --version
echo.

:: Accept licenses
echo [1/2] Accepting licenses...
echo.
echo Please read and accept all licenses by typing 'y' when prompted
echo.
sdkmanager --licenses
echo.
echo Licenses accepted
echo.

:: Install required components
echo [2/2] Installing SDK components...
echo.
echo This may take 10-30 minutes depending on your internet speed
echo.

:: Platform tools
echo Installing platform-tools...
sdkmanager "platform-tools"

:: Android platforms
echo Installing Android platforms...
sdkmanager "platforms;android-33"
sdkmanager "platforms;android-34"

:: Build tools
echo Installing build tools...
sdkmanager "build-tools;34.0.0"
sdkmanager "build-tools;33.0.2"
sdkmanager "build-tools;33.0.0"

:: Optional: NDK and CMake
echo Installing NDK and CMake (optional)...
sdkmanager "ndk;25.2.9519653"
sdkmanager "cmake;3.22.1"

echo.
echo ========================================
echo     Installation Complete!
echo ========================================
echo.
echo Installed components:
echo   - Platform tools
echo   - Android platforms (33, 34)
echo   - Build tools (33.0.0, 33.0.2, 34.0.0)
echo   - NDK 25.2.9519653
echo   - CMake 3.22.1
echo.
echo Next steps:
echo   1. Run setup_env.bat to complete environment setup
echo   2. Run build_apk.bat to build APK
echo.
pause