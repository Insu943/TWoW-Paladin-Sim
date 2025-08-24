@echo off
echo.
echo =====================================
echo  TWoW Paladin Simulator Setup
echo =====================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Then run this setup again.
    echo.
    pause
    exit /b 1
)

:: Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Then run this setup again.
    echo.
    pause
    exit /b 1
)

echo Node.js and npm found!
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
