@echo off
title Set Android SDK Environment Variables

echo.
echo ========================================
echo     Set Android SDK Environment
echo ========================================
echo.
echo Setting environment variables for Android SDK...
echo.

:: Set ANDROID_HOME
setx ANDROID_HOME "C:\Android\Sdk" /M
if %errorlevel% equ 0 (
    echo ANDROID_HOME set to: C:\Android\Sdk
) else (
    echo Warning: Failed to set ANDROID_HOME system-wide
    echo Setting for current session only...
    set ANDROID_HOME=C:\Android\Sdk
)

:: Set ANDROID_SDK_ROOT
setx ANDROID_SDK_ROOT "C:\Android\Sdk" /M
if %errorlevel% equ 0 (
    echo ANDROID_SDK_ROOT set to: C:\Android\Sdk
) else (
    echo Warning: Failed to set ANDROID_SDK_ROOT system-wide
    echo Setting for current session only...
    set ANDROID_SDK_ROOT=C:\Android\Sdk
)

:: Add to PATH
setx PATH "%PATH%;C:\Android\Sdk\cmdline-tools\latest\bin;C:\Android\Sdk\platform-tools" /M
if %errorlevel% equ 0 (
    echo Added Android SDK to PATH
) else (
    echo Warning: Failed to update PATH system-wide
    echo Adding for current session only...
    set PATH=%PATH%;C:\Android\Sdk\cmdline-tools\latest\bin;C:\Android\Sdk\platform-tools
)

:: Set for current session
set ANDROID_HOME=C:\Android\Sdk
set ANDROID_SDK_ROOT=C:\Android\Sdk
set PATH=%PATH%;C:\Android\Sdk\cmdline-tools\latest\bin;C:\Android\Sdk\platform-tools

echo.
echo ========================================
echo     Environment Variables Set!
echo ========================================
echo.
echo Current session variables:
echo   ANDROID_HOME = %ANDROID_HOME%
echo   ANDROID_SDK_ROOT = %ANDROID_SDK_ROOT%
echo.
echo NOTE: System-wide changes will take effect after:
echo   1. Restarting Command Prompt
echo   2. OR restarting your computer
echo.
echo Testing current session...
echo.

:: Test sdkmanager
where sdkmanager >nul 2>&1
if %errorlevel% equ 0 (
    echo SUCCESS: sdkmanager found!
    echo.
    sdkmanager --version
) else (
    echo ERROR: sdkmanager not found in current PATH
    echo.
    echo Please restart Command Prompt and try again
)

echo.
echo Next steps:
echo   1. Restart Command Prompt to apply system-wide changes
echo   2. Run install_sdk_components.bat to install SDK components
echo.
pause