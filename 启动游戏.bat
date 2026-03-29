@echo off
title War Front - KARDS Card Game

echo.
echo ========================================
echo     War Front - KARDS Card Game
echo ========================================
echo.
echo Starting game...
echo.

cd /d "%~dp0"

if not exist "index.html" (
    echo Error: Game file not found!
    echo Please make sure this script is in the game directory.
    pause
    exit /b 1
)

echo Opening game...
start "" "index.html"

echo.
echo Game started!
echo.
echo Hotkeys:
echo   Esc - Cancel current action
echo   E   - End turn
echo   W   - Wait
echo.
echo Press any key to close this window...
pause >nul