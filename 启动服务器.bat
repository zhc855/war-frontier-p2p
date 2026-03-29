@echo off
title War Front - Server

echo.
echo ========================================
echo     War Front - Game Server
echo ========================================
echo.
echo Starting server...
echo.

cd /d "%~dp0\server"

if not exist "server.js" (
    echo Error: Server file not found!
    echo Please make sure you are in the game directory.
    pause
    exit /b 1
)

echo Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo Error: Failed to install dependencies!
        pause
        exit /b 1
    )
)

echo.
echo Starting server on port 3000...
echo.
echo Server URL: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

node server.js

pause