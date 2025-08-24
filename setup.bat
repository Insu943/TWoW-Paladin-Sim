@echo off
echo.
echo =====================================
echo  TWoW Paladin Simulator Setup
echo =====================================
echo.

:: Create temp directory for downloads
if not exist "temp" mkdir temp

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
echo This may take a few minutes and will open an installer window.
echo Please follow the installer prompts to complete the installation.
echo.
start /wait msiexec /i "temp\node-installer.msi" /quiet /norestart

:: Refresh PATH environment variable
call refreshenv 2>nul || (
    echo.
    echo Please close this window and run setup.bat again to continue...
    pause
    exit /b 0
)

:: Verify Node.js installation
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo Node.js installation may not be complete.
    echo Please restart your computer and run setup.bat again.
    pause
    exit /b 1
)

:install_deps
echo.
echo Node.js is ready!
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
echo Building executable...
call npm run build:win
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to build executable!
    pause
    exit /b 1
)

:: Clean up temp files
if exist "temp" rmdir /s /q "temp"

echo.
echo =====================================
echo  Setup Complete!
echo =====================================
echo.
echo The TWoW Paladin Simulator has been built successfully!
echo.
echo To start the simulator:
echo - Double-click "START_SIMULATOR.bat", or
echo - Run the executable directly from: build\win-unpacked\TWoW Paladin Simulator.exe
echo.
pause
