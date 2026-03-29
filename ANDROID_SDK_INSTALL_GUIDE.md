# Android SDK 手动安装指南

## 下载 Android Command Line Tools

由于 Android Studio 下载困难，我们使用命令行工具。

### 方法1: 官方下载
访问: https://developer.android.com/studio#command-tools
下载 "Command line tools only" for Windows

### 方法2: 直接下载链接
Windows 版本:
- Windows 64-bit: https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip

### 方法3: 如果上述链接无法访问
尝试搜索 "Android command line tools download" 找到最新版本

---

## 安装步骤

### 1. 创建目录结构
在 C 盘创建 Android SDK 目录：
```
C:\Android
C:\Android\Sdk
C:\Android\Sdk\cmdline-tools
C:\Android\Sdk\cmdline-tools\latest
```

### 2. 解压下载的文件
将下载的 `commandlinetools-win-*.zip` 解压到：
```
C:\Android\Sdk\cmdline-tools\latest\
```

解压后的目录结构应该是：
```
C:\Android\Sdk\cmdline-tools\latest\
  ├── bin\
  ├── lib\
  ├── NOTICE.txt
  └── source.properties
```

### 3. 设置环境变量

#### 方法1: 临时设置（当前窗口有效）
打开命令提示符，运行：
```cmd
set ANDROID_HOME=C:\Android\Sdk
set ANDROID_SDK_ROOT=C:\Android\Sdk
set PATH=%PATH%;C:\Android\Sdk\cmdline-tools\latest\bin
```

#### 方法2: 永久设置
1. 右键点击"此电脑" → "属性"
2. 点击"高级系统设置"
3. 点击"环境变量"
4. 在"系统变量"中添加：
   - 变量名: `ANDROID_HOME`
   - 变量值: `C:\Android\Sdk`

5. 编辑 `Path` 变量，添加：
   - `%ANDROID_HOME%\cmdline-tools\latest\bin`
   - `%ANDROID_HOME%\platform-tools`

### 4. 验证安装
在新的命令提示符窗口中运行：
```cmd
sdkmanager --version
```

如果显示版本号，说明安装成功！

---

## 安装必需的 SDK 组件

### 创建一个批处理文件来安装

创建文件 `install_sdk_components.bat`，内容如下：

```batch
@echo off
echo Installing Android SDK components...

:: 接受许可证
yes | sdkmanager --licenses

:: 安装必需组件
sdkmanager "platform-tools"
sdkmanager "platforms;android-33"
sdkmanager "platforms;android-34"
sdkmanager "build-tools;34.0.0"
sdkmanager "build-tools;33.0.2"
sdkmanager "build-tools;33.0.0"
sdkmanager "ndk;25.2.9519653"
sdkmanager "cmake;3.22.1"

echo.
echo Android SDK components installed successfully!
pause
```

运行这个批处理文件：
```cmd
install_sdk_components.bat
```

### 或者手动安装

在命令提示符中逐个运行：

```cmd
:: 首先接受许可证
yes | sdkmanager --licenses

:: 安装平台工具
sdkmanager "platform-tools"

:: 安装 Android 平台
sdkmanager "platforms;android-33"
sdkmanager "platforms;android-34"

:: 安装构建工具
sdkmanager "build-tools;34.0.0"
sdkmanager "build-tools;33.0.2"

:: 安装 NDK（可选）
sdkmanager "ndk;25.2.9519653"

:: 安装 CMake（可选）
sdkmanager "cmake;3.22.1"
```

---

## 完成安装

安装完成后，你的目录结构应该是：

```
C:\Android\Sdk\
  ├── cmdline-tools\
  │   └── latest\
  │       ├── bin\
  │       ├── lib\
  │       └── ...
  ├── platform-tools\
  │   ├── adb.exe
  │   ├── fastboot.exe
  │   └── ...
  ├── platforms\
  │   ├── android-33\
  │   └── android-34\
  ├── build-tools\
  │   ├── 33.0.0\
  │   ├── 33.0.2\
  │   └── 34.0.0\
  └── ndk\
      └── 25.2.9519653\
```

---

## 验证安装

运行以下命令验证：

```cmd
:: 检查 adb
adb version

:: 检查 SDK
sdkmanager --list_installed

:: 检查平台
sdkmanager --list | findstr "android-"
```

---

## 下一步

安装完成后，重新运行环境设置脚本：

```cmd
setup_env.bat
```

这次应该能够检测到 Android SDK 了！

---

## 常见问题

### Q: sdkmanager 命令无法识别？
A: 检查环境变量是否正确设置，确保路径包含 `cmdline-tools\latest\bin`

### Q: 下载速度慢？
A: 配置代理或使用国内镜像，创建文件：
`C:\Users\你的用户名\.gradle\gradle.properties`
添加：
```
systemProp.https.proxyHost=your-proxy-host
systemProp.https.proxyPort=your-proxy-port
```

### Q: 许可证接受失败？
A: 手动运行 `sdkmanager --licenses` 并逐个接受

---

## 预计安装时间

- 下载时间: 10-30分钟（取决于网络速度）
- 安装时间: 5-10分钟
- 总计: 约 20-40分钟

---

## 存储空间需求

Android SDK 总共需要约 5-10GB 的存储空间。