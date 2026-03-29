@echo off
title JDK Installation Check

echo.
echo ========================================
echo     JDK Installation Check
echo ========================================
echo.

echo Checking for Java installation...

where java >nul 2>&1
if %errorlevel% equ 0 (
    echo.
    echo JDK is INSTALLED!
    java -version
    echo.
    echo You can proceed with Android build.
    pause
    exit /b 0
) else (
    echo.
    echo JDK is NOT installed.
    echo.
    echo ========================================
    echo     Install JDK - Follow These Steps
    echo ========================================
    echo.
    echo Option 1: Install JDK 17 (Recommended)
    echo 1. Visit: https://www.oracle.com/java/technologies/downloads/#java17
    echo 2. Download JDK 17 for Windows
    echo 3. Run the installer
    echo 4. Restart your computer
    echo.
    echo Option 2: Install Android Studio (Everything Included)
    echo 1. Visit: https://developer.android.com/studio
    echo 2. Download and install Android Studio
    echo 3. This includes JDK, Android SDK, and build tools
    echo 4. Restart your computer
    echo.
    echo Option 3: Use Portable JDK
    echo 1. Visit: https://adoptium.net/temurin/releases/?version=17
    echo 2. Download the portable JDK (zip file)
    echo 3. Extract to a folder
    echo 4. Set JAVA_HOME environment variable
    echo 5. Add JDK bin folder to PATH
    echo 6. Restart your computer
    echo.
    echo ========================================
    echo     Why JDK is Required
    echo ========================================
    echo.
    echo - JDK is used to compile Java/Kotlin code
    echo - Android apps are written in Java/Kotlin
    echo - Cordova uses JDK for building
    echo - Gradle build tool needs JDK
    echo.
    echo ========================================
    echo     Current Status
    echo ========================================
    echo.
    echo Node.js:
node --version
    if errorlevel 1 (
        echo   Status: Not installed
) else (
    echo   Status: Installed
)

echo.
    echo Java:
where java
if errorlevel 1 (
    echo   Status: NOT INSTALLED - This is the problem!
) else (
    echo   Status: Installed
)

echo.
    echo JDK must be installed to build Android APK
    echo.
    echo After installing JDK, run this script again to verify
    echo.
pause