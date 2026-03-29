@echo off
echo Starting simple test...
echo.

cd /d "C:\Users\Z\自制卡牌\kards-style"

echo Current directory:
cd
echo.

echo Testing Cordova...
cordova --version
echo Cordova test result: %errorlevel%
echo.

echo Checking platform directory...
dir platforms\android
echo.

echo Testing Android platform...
cordova platform ls
echo.

echo Test complete!
pause