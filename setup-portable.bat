@echo off
echo.
echo ==========================================
echo  TWoW Paladin Simulator - Portable Setup
echo ==========================================
echo.
echo This setup requires NO installation of any software!
echo Everything runs portably from this folder.
echo.

:: Create portable directory structure
if not exist "portable" mkdir portable
if not exist "portable\nodejs" mkdir portable\nodejs
if not exist "portable\temp" mkdir portable\temp

:: Check if portable Node.js already exists
if exist "portable\nodejs\node.exe" (
    echo Portable Node.js found! Skipping download...
    goto :setup_project
)

echo Downloading portable Node.js...
echo This may take a few minutes depending on your connection...
echo.

:: Download portable Node.js
powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Write-Host 'Downloading Node.js portable...'; Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.17.0/node-v20.17.0-win-x64.zip' -OutFile 'portable\temp\nodejs.zip'}"

if not exist "portable\temp\nodejs.zip" (
    echo ERROR: Failed to download Node.js!
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)

echo.
echo Extracting Node.js...
powershell -Command "Expand-Archive -Path 'portable\temp\nodejs.zip' -DestinationPath 'portable\temp' -Force"

:: Move Node.js files to the right location
powershell -Command "Move-Item 'portable\temp\node-v20.17.0-win-x64\*' 'portable\nodejs\' -Force"

echo Node.js portable setup complete!

:setup_project
echo.
echo Setting up project dependencies...

:: Set PATH to use portable Node.js
set "PATH=%~dp0portable\nodejs;%PATH%"

:: Install dependencies using portable Node.js
echo Installing project dependencies...
call "%~dp0portable\nodejs\npm.cmd" install

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo Building simulator...
call "%~dp0portable\nodejs\npm.cmd" run build:win

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to build simulator!
    pause
    exit /b 1
)

:: Clean up temp files
if exist "portable\temp" rmdir /s /q "portable\temp"

echo.
echo ==========================================
echo  Portable Setup Complete!
echo ==========================================
echo.
echo The TWoW Paladin Simulator is now ready!
echo Everything is contained in this folder - no system installation required.
echo.
echo To start the simulator:
echo - Double-click "START_SIMULATOR.bat"
echo - Or run: build\win-unpacked\TWoW Paladin Simulator.exe
echo.
echo Note: You can move this entire folder anywhere and it will still work!
echo.
pause
