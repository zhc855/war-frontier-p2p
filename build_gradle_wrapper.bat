@echo off
title Create Gradle Wrapper

echo.
echo ========================================
echo     Create Gradle Wrapper
echo ========================================
echo.
echo This will create Gradle wrapper files
echo.

cd /d "%~dp0\platforms\android"

:: Set environment variables
set ANDROID_HOME=C:\Android\Sdk
set ANDROID_SDK_ROOT=C:\Android\Sdk
set PATH=%PATH%;C:\Android\Sdk\cmdline-tools\latest\bin;C:\Android\Sdk\platform-tools

echo Creating Gradle wrapper...
echo.

gradle wrapper --gradle-version 7.6.1

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo     Gradle Wrapper Created!
    echo ========================================
    echo.
    echo Now run build_apk.bat to build APK
    echo.
) else (
    echo.
    echo ========================================
    echo     Wrapper Creation Failed
    echo ========================================
    echo.
    echo Trying alternative method...
    echo.
    
    :: Create gradlew.bat manually
    echo @echo off > gradlew.bat
    echo setlocal >> gradlew.bat
    echo set APP_HOME=%%~dp0 >> gradlew.bat
    echo set APP_BASE_NAME=%%~n0 >> gradlew.bat
    echo call "%%APP_HOME%%\gradle\bin\gradle.bat" %%* >> gradlew.bat
    
    echo gradlew.bat created manually
    echo.
)

pause