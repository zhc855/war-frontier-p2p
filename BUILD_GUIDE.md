# War Front - Build Android APK

## Build Android App in 3 Steps

### Step 1: Install JDK
**Required** - You need Java JDK to build Android apps.

**Download:** https://www.oracle.com/java/technologies/downloads/#java17

**Or Install Android Studio** (includes everything):
- Download: https://developer.android.com/studio
- This includes JDK, Android SDK, and build tools

**Check Installation:**
```
Double-click: check_jdk.bat
```

### Step 2: Setup Project
```
Double-click: setup_android.bat
```

### Step 3: Build APK
```
Double-click: build_final.bat
```

Wait 5-10 minutes for build to complete.

## APK Location

After successful build:
```
platforms\android\app\build\outputs\apk\debug\app-debug.apk
```

## Install on Phone

1. Copy `app-debug.apk` to your phone
2. Click the APK file
3. Allow installation from unknown sources
4. Wait for installation
5. Open "War Front" app

## Phone vs Phone Multiplayer

After installing on both phones:

**Option 1: Use Built-in Server**
- Start server on one phone (in-app)
- Other phone connects to server IP
- Play via room ID

**Option 2: Use PC Server**
- Run `start_server.bat` on PC
- Both phones connect to PC's LAN IP
- Play via room ID

**Option 3: Use Public Server**
- Deploy server to cloud
- All phones connect to public IP
- Play via room ID

## Build Scripts

- `check_jdk.bat` - Check JDK installation
- `setup_android.bat` - Setup Android environment
- `build_final.bat` - Build APK (use this)
- `build_android.bat` - Alternative build script
- `build_android_release.bat` - Build release version

## Troubleshooting

**"Java not found"**
- Install JDK, restart computer

**"Build failed"**
- Check Java is installed: `java -version`
- Check Node.js is installed: `node --version`
- Run `check_jdk.bat` to verify

**"APK not generated"**
- Check if build completed successfully
- Look for errors in build output
- Run `build_final.bat` again

## Success Indicators

When build succeeds:
- You'll see "BUILD SUCCESSFUL"
- APK file is created
- File size: 15-25 MB

## Game Info

- **Name:** War Front
- **Package:** com.warfront.game
- **Version:** 0.2.0
- **Min Android:** 5.0 (API 21)
- **Screen:** Landscape

## Support

For detailed build guide: `BUILD_SIMPLE.txt`