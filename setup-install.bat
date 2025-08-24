@echo off
echo.
echo ===============================================
echo  TWoW Paladin Simulator Setup
echo ===============================================
echo.
echo This setup will build the simulator for you!
echo No pre-installed software required!
echo.

:: Create temp directory for downloads
if not exist "temp" mkdir temp

:: Check if we already have the built version
if exist "build\win-unpacked\TWoW Paladin Simulator.exe" (
    echo Built simulator found!
    goto :copy_exe
)

:: Check if Node.js is already installed
where node >nul 2>nul
if %errorlevel% equ 0 (
    echo Node.js found! Skipping download...
    goto :install_deps
)

echo Node.js not found. Downloading and installing...
echo.

:: Download Node.js LTS (Windows x64)
echo Downloading Node.js...
powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.17.0/node-v20.17.0-x64.msi' -OutFile 'temp\node-installer.msi'}"

if not exist "temp\node-installer.msi" (
    echo ERROR: Failed to download Node.js installer!
    echo.
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)

echo.
echo Installing Node.js...
echo This may take a few minutes...
start /wait msiexec /i "temp\node-installer.msi" /quiet /norestart

:: Refresh PATH environment variable
set "PATH=%PATH%;C:\Program Files\nodejs"

:install_deps
echo.
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo Building simulator...
call npm run build:win
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to build simulator!
    pause
    exit /b 1
)

:copy_exe
if exist "build\win-unpacked\TWoW Paladin Simulator.exe" (
    echo.
    echo Copying built executable to main directory for easy access...
    copy "build\win-unpacked\TWoW Paladin Simulator.exe" "TWoW-Paladin-Simulator.exe"
    
    :: Also copy required DLLs if needed
    if exist "build\win-unpacked\ffmpeg.dll" (
        copy "build\win-unpacked\ffmpeg.dll" "."
    )
    if exist "build\win-unpacked\libEGL.dll" (
        copy "build\win-unpacked\libEGL.dll" "."
    )
    if exist "build\win-unpacked\libGLESv2.dll" (
        copy "build\win-unpacked\libGLESv2.dll" "."
    )
)

:: Clean up temp files
if exist "temp" rmdir /s /q "temp"

echo.
echo ===============================================
echo  Setup Complete!
echo ===============================================
echo.
echo The TWoW Paladin Simulator has been built successfully!
echo.
echo To start: Double-click "TWoW-Paladin-Simulator.exe"
echo.
pause

:: Optionally auto-launch
if exist "TWoW-Paladin-Simulator.exe" (
    echo Starting simulator...
    start "" "TWoW-Paladin-Simulator.exe"
)
