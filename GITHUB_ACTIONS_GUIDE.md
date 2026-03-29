# GitHub Actions 自动构建 Android APK

## 🚀 使用 GitHub Actions 构建 APK

GitHub Actions 可以在云端自动构建 Android APK，无需本地复杂的环境配置。

## 📋 使用步骤

### 1. 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 创建一个新的仓库（例如：`warfront-game`）
3. 不要添加 .gitignore 或 README（我们已经有这些文件了）

### 2. 初始化 Git 仓库

```bash
cd C:\Users\Z\自制卡牌\kards-style
git init
git add .
git commit -m "Initial commit"
```

### 3. 连接到 GitHub 仓库

```bash
git remote add origin https://github.com/YOUR_USERNAME/warfront-game.git
git branch -M main
git push -u origin main
```

### 4. 触发构建

构建会自动在以下情况触发：
- 推送代码到 main 分支
- 创建 Pull Request
- 手动触发（在 GitHub Actions 页面点击 "Run workflow"）

### 5. 下载 APK

构建完成后：
1. 访问仓库的 "Actions" 页面
2. 点击最近的构建任务
3. 在页面底部找到 "Artifacts" 部分
4. 下载 `app-debug` 或 `app-release`

## 🔧 配置选项

### 手动触发构建

1. 访问 "Actions" 页面
2. 选择 "Build Android APK"
3. 点击 "Run workflow"
4. 选择分支并点击 "Run workflow"

### 创建 Release 版本

```bash
git tag v1.0.0
git push origin v1.0.0
```

这会触发构建并创建 GitHub Release。

## ⏱️ 构建时间

- 首次构建：约 10-15 分钟
- 后续构建：约 5-8 分钟

## 📱 APK 文件

构建会生成两个版本：

1. **Debug APK** (`app-debug.apk`)
   - 用于测试
   - 可以直接安装
   - 文件较小

2. **Release APK** (`app-release-unsigned.apk`)
   - 用于发布
   - 需要签名后才能安装
   - 文件较大但性能更好

## 🔍 查看构建日志

1. 访问 "Actions" 页面
2. 点击具体的构建任务
3. 展开各个步骤查看详细日志

## ❗ 故障排除

### 构建失败

1. 检查 Actions 页面的错误日志
2. 确保所有文件都已提交
3. 检查网络连接（需要下载依赖项）

### APK 无法安装

确保下载的是 Debug 版本（app-debug.apk）。

Release 版本需要签名后才能安装。

## 💡 高级配置

### 自动签名 Release APK

1. 生成签名密钥：
```bash
keytool -genkey -v -keystore warfront-release.keystore -alias warfront -keyalg RSA -keysize 2048 -validity 10000
```

2. 在 GitHub 仓库设置中添加 Secrets：
   - `KEYSTORE_FILE` (Base64 编码的 keystore 文件)
   - `KEYSTORE_PASSWORD`
   - `KEY_ALIAS`
   - `KEY_PASSWORD`

3. 修改 build-android.yml 添加签名步骤

## 📚 更多信息

- GitHub Actions 文档：https://docs.github.com/en/actions
- Cordova 构建文档：https://cordova.apache.org/docs/en/latest/guide/platforms/android/

---

**构建完成后，APK 会自动保存 30 天！**