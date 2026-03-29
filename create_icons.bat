@echo off
title War Front - 创建应用图标

echo.
echo ========================================
echo     War Front - 创建应用图标
echo ========================================
echo.
echo 此脚本将创建应用图标和启动画面
echo.

cd /d "%~dp0"

:: 检查 ImageMagick（用于生成图标）
where magick >nul 2>&1
if %errorlevel% neq 0 (
    echo 警告: 未找到 ImageMagick
    echo.
    echo 如果要自动生成图标，请安装 ImageMagick:
    echo   访问: https://imagemagick.org/script/download.php#windows
    echo   下载并安装 ImageMagick
    echo.
    echo 或者手动准备图标文件并放到 res/ 目录
    echo.
    echo 现在将创建基本的图标结构...
    goto :manual_create
)

:: 自动创建图标
echo 使用 ImageMagick 自动生成图标...

:: 创建 res 目录结构
if not exist "res\icon\android" mkdir "res\icon\android"
if not exist "res\screen\android" mkdir "res\screen\android"

:: 创建应用图标 (创建一个简单的卡牌图标)
echo 创建应用图标...
magick convert -size 512x512 xc:#1a1a2e ^
  -fill "#ffd700" -draw "circle 256,256 256,128" ^
  -fill "#ffffff" -font Arial -pointsize 200 -gravity center -annotate 0 "⚔️" ^
  -fill "#ffffff" -font Arial -pointsize 40 -gravity south -annotate +0+20 "WAR FRONT" ^
  res\icon\android\icon.png

:: 生成不同尺寸的图标
echo 生成不同尺寸的图标...
magick convert res\icon\android\icon.png -resize 36x36 res\icon\android\ldpi.png
magick convert res\icon\android\icon.png -resize 48x48 res\icon\android\mdpi.png
magick convert res\icon\android\icon.png -resize 72x72 res\icon\android\hdpi.png
magick convert res\icon\android\icon.png -resize 96x96 res\icon\android\xhdpi.png
magick convert res\icon\android\icon.png -resize 144x144 res\icon\android\xxhdpi.png
magick convert res\icon\android\icon.png -resize 192x192 res\icon\android\xxxhdpi.png

:: 创建启动画面
echo 创建启动画面...
magick convert -size 2732x2732 xc:#1a1a2e ^
  -fill "#ffd700" -font Arial -pointsize 300 -gravity center -annotate 0 "⚔️" ^
  -fill "#ffffff" -font Arial -pointsize 100 -gravity center -annotate +0+200 "WAR FRONT" ^
  -fill "#ffffff" -font Arial -pointsize 60 -gravity south -annotate +0+100 "KARDS Style Card Game" ^
  res\screen\android\splash.png

:: 生成不同尺寸的启动画面
echo 生成不同尺寸的启动画面...
magick convert res\screen\android\splash.png -resize 800x480 res\screen\android\land-ldpi.png
magick convert res\screen\android\splash.png -resize 960x540 res\screen\android\land-mdpi.png
magick convert res\screen\android\splash.png -resize 1280x720 res\screen\android\land-hdpi.png
magick convert res\screen\android\splash.png -resize 1920x1080 res\screen\android\land-xhdpi.png
magick convert res\screen\android\splash.png -resize 2560x1440 res\screen\android\land-xxhdpi.png
magick convert res\screen\android\splash.png -resize 3840x2160 res\screen\android\land-xxxhdpi.png

echo.
echo ========================================
echo     图标创建完成！
echo ========================================
echo.
echo 生成的文件:
echo   res\icon\android\*.png
echo   res\screen\android\*.png
echo.
pause
exit /b 0

:manual_create
:: 手动创建图标结构
echo.
echo 创建目录结构...

if not exist "res" mkdir "res"
if not exist "res\icon" mkdir "res\icon"
if not exist "res\icon\android" mkdir "res\icon\android"
if not exist "res\screen" mkdir "res\screen"
if not exist "res\screen\android" mkdir "res\screen\android"

echo 创建占位符文件...

:: 创建简单的 SVG 图标
echo ^<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"^> > res\icon\android\icon.svg
echo   ^<rect width="512" height="512" fill="#1a1a2e"/^> >> res\icon\android\icon.svg
echo   ^<circle cx="256" cy="256" r="128" fill="#ffd700"/^> >> res\icon\android\icon.svg
echo   ^<text x="50%%" y="55%%" text-anchor="middle" font-size="200" fill="white"^>⚔️^</text^> >> res\icon\android\icon.svg
echo   ^<text x="50%%" y="85%%" text-anchor="middle" font-size="40" fill="white"^>WAR FRONT^</text^> >> res\icon\android\icon.svg
echo ^</svg^> >> res\icon\android\icon.svg

echo 创建占位符文本文件...
echo 这个文件应该被真实的图标文件替换 > res\icon\android\README.txt
echo. >> res\icon\android\README.txt
echo 请准备以下尺寸的图标文件: >> res\icon\android\README.txt
echo - ldpi.png (36x36) >> res\icon\android\README.txt
echo - mdpi.png (48x48) >> res\icon\android\README.txt
echo - hdpi.png (72x72) >> res\icon\android\README.txt
echo - xhdpi.png (96x96) >> res\icon\android\README.txt
echo - xxhdpi.png (144x144) >> res\icon\android\README.txt
echo - xxxhdpi.png (192x192) >> res\icon\android\README.txt
echo. >> res\icon\android\README.txt
echo 或者安装 ImageMagick 并重新运行此脚本 >> res\icon\android\README.txt

echo 这个文件应该被真实的启动画面文件替换 > res\screen\android\README.txt
echo. >> res\screen\android\README.txt
echo 请准备以下尺寸的启动画面文件: >> res\screen\android\README.txt
echo - land-ldpi.png (800x480) >> res\screen\android\README.txt
echo - land-mdpi.png (960x540) >> res\screen\android\README.txt
echo - land-hdpi.png (1280x720) >> res\screen\android\README.txt
echo - land-xhdpi.png (1920x1080) >> res\screen\android\README.txt
echo - land-xxhdpi.png (2560x1440) >> res\screen\android\README.txt
echo - land-xxxhdpi.png (3840x2160) >> res\screen\android\README.txt

echo.
echo ========================================
echo     占位符创建完成
echo ========================================
echo.
echo 已创建基本的目录结构和占位符文件
echo.
echo 要创建真实的图标:
echo   1. 安装 ImageMagick: https://imagemagick.org/script/download.php#windows
echo   2. 重新运行此脚本
echo.
echo 或者:
echo   手动准备图标文件并放到 res/ 目录
echo.
pause