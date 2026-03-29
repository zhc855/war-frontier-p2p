@echo off
title War Front - Start Game and Server

echo.
echo ========================================
echo     War Front - Complete Startup
echo ========================================
echo.
echo Starting game and server...
echo.

cd /d "%~dp0"

echo Step 1: Starting server...
cd server
start "War Front Server" cmd /k "node server.js"
cd ..

echo Step 2: Waiting for server to start...
timeout /t 3 /nobreak >nul

echo Step 3: Opening game...
start "" "index.html"

echo.
echo ========================================
echo     Startup Complete!
echo ========================================
echo.
echo Server is running in background window
echo Game has been opened in browser
echo.
echo Press any key to close this window...
pause >nul