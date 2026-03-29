@echo off
title Test Android SDK Installation

echo.
echo ========================================
echo     Android SDK Diagnostic Tool
echo ========================================
echo.
echo Checking Android SDK installation...
echo.

:: Set environment variables
set ANDROID_HOME=C:\Android\Sdk
set ANDROID_SDK_ROOT=C:\Android\Sdk
set PATH=%PATH%;C:\Android\Sdk\cmdline-tools\latest\bin;C:\Android\Sdk\platform-tools

echo Environment Variables:
echo   ANDROID_HOME = %ANDROID_HOME%
echo   ANDROID_SDK_ROOT = %ANDROID_SDK_ROOT%
echo.

echo Checking directory structure...
if exist "C:\Android\Sdk" (
    echo [OK] C:\Android\Sdk exists
) else (
    echo [ERROR] C:\Android\Sdk not found
    goto :end
)

if exist "C:\Android\Sdk\cmdline-tools" (
    echo [OK] C:\Android\Sdk\cmdline-tools exists
) else (
    echo [ERROR] C:\Android\Sdk\cmdline-tools not found
    goto :end
)

if exist "C:\Android\Sdk\cmdline-tools\latest" (
    echo [OK] C:\Android\Sdk\cmdline-tools\latest exists
) else (
    echo [ERROR] C:\Android\Sdk\cmdline-tools\latest not found
    goto :end
)

if exist "C:\Android\Sdk\cmdline-tools\latest\bin" (
    echo [OK] C:\Android\Sdk\cmdline-tools\latest\bin exists
) else (
    echo [ERROR] C:\Android\Sdk\cmdline-tools\latest\bin not found
    goto :end
)

if exist "C:\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.exe" (
    echo [OK] sdkmanager.exe exists
) else (
    echo [ERROR] sdkmanager.exe not found
    goto :end
)

echo.
echo Checking sdkmanager...
cd "C:\Android\Sdk\cmdline-tools\latest\bin"
if exist sdkmanager.exe (
    echo [OK] sdkmanager.exe found in bin directory
    echo.
    echo Testing sdkmanager...
    sdkmanager --version
    if %errorlevel% equ 0 (
        echo.
        echo [SUCCESS] sdkmanager works correctly!
    ) else (
        echo.
        echo [ERROR] sdkmanager failed to run
    )
) else (
    echo [ERROR] sdkmanager.exe not found
    dir /b
)

:end
echo.
echo ========================================
echo     Diagnostic Complete
echo ========================================
echo.
echo Press any key to close...
pause >nul