@echo off
title Setup GitHub Repository

echo.
echo ========================================
echo     Setup GitHub Repository
echo ========================================
echo.
echo This will help you push your project to GitHub
echo and trigger automatic APK builds.
echo.

cd /d "%~dp0"

:: Check if git is initialized
if not exist ".git" (
    echo [1/5] Initializing Git repository...
    git init
) else (
    echo [1/5] Git repository already initialized
)

echo.
echo [2/5] Adding all files...
git add .

echo.
echo [3/5] Creating initial commit...
git commit -m "Initial commit - War Front Card Game"

echo.
echo [4/5] Please enter your GitHub repository URL:
echo.
echo Your repository URL should look like:
echo   https://github.com/YOUR_USERNAME/REPO_NAME.git
echo.
set /p REPO_URL="Enter your repository URL: "

if "%REPO_URL%"=="" (
    echo ERROR: Repository URL cannot be empty!
    pause
    exit /b 1
)

echo.
echo Adding remote origin...
git remote add origin %REPO_URL%

echo.
echo [5/5] Pushing to GitHub...
git branch -M main
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo     Setup Complete!
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Visit your repository on GitHub
    echo 2. Go to "Actions" tab
    echo 3. Wait for the build to complete
    echo 4. Download the APK from Artifacts section
    echo.
    echo Build guide: GITHUB_ACTIONS_GUIDE.md
    echo.
) else (
    echo.
    echo ========================================
    echo     Push Failed
    echo ========================================
    echo.
    echo Possible reasons:
    echo 1. Repository doesn't exist on GitHub
    echo 2. Invalid repository URL
    echo 3. Authentication required (use SSH key or token)
    echo.
    echo Please check your GitHub credentials
    echo.
)

pause