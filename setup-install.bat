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
    echo Copying built application to main directory for easy access...
    
    :: Create a standalone folder for the app
    if not exist "TWoW-Paladin-Simulator" mkdir "TWoW-Paladin-Simulator"
    
    :: Copy all necessary files
    copy "build\win-unpacked\*" "TWoW-Paladin-Simulator\" /Y
    
    :: Create a simple launcher in the main directory
    echo @echo off > "Launch-TWoW-Paladin-Simulator.bat"
    echo cd /d "TWoW-Paladin-Simulator" >> "Launch-TWoW-Paladin-Simulator.bat"
    echo start "" "TWoW Paladin Simulator.exe" >> "Launch-TWoW-Paladin-Simulator.bat"
    
    echo All files copied to TWoW-Paladin-Simulator folder!
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
echo To start: Double-click "Launch-TWoW-Paladin-Simulator.bat"
echo Or go to the TWoW-Paladin-Simulator folder and run "TWoW Paladin Simulator.exe"
echo.
pause

:: Optionally auto-launch
if exist "TWoW-Paladin-Simulator\TWoW Paladin Simulator.exe" (
    echo Starting simulator...
    cd "TWoW-Paladin-Simulator"
    start "" "TWoW Paladin Simulator.exe"
)
