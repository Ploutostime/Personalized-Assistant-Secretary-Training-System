@echo off
echo ========================================
echo   智学秘伴 - 智能学习平台
echo ========================================
echo.

REM 检查Node.js是否安装
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js未安装，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查npm是否安装
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm未安装，请检查Node.js安装
    pause
    exit /b 1
)

echo ✅ Node.js版本: 
node --version
echo ✅ npm版本:
npm --version
echo.

REM 检查依赖是否安装
if not exist "node_modules" (
    echo 📦 正在安装项目依赖...
    npm install --force
    if errorlevel 1 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
    echo ✅ 依赖安装完成
) else (
    echo ✅ 依赖已安装
)

echo.
echo 🚀 启动开发服务器...
echo 访问地址: http://localhost:5173
echo.

REM 启动开发服务器
npm run dev

pause