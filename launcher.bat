@echo off
echo.
echo ========================================
echo  TWoW Paladin Simulator Launcher
echo ========================================
echo.

:: Check if the simulator exists
if exist "build\win-unpacked\TWoW Paladin Simulator.exe" (
    echo Starting TWoW Paladin Simulator...
    echo.
    cd "build\win-unpacked"
    start "" "TWoW Paladin Simulator.exe"
    echo Simulator launched!
    timeout /t 2 /nobreak >nul
    exit
)

:: If simulator doesn't exist, check for it in current directory
if exist "TWoW Paladin Simulator.exe" (
    echo Starting TWoW Paladin Simulator...
    echo.
    start "" "TWoW Paladin Simulator.exe"
    echo Simulator launched!
    timeout /t 2 /nobreak >nul
    exit
)

:: If no simulator found, show error
echo ERROR: TWoW Paladin Simulator not found!
echo.
echo Please make sure the simulator is built or placed in the correct location:
echo - build\win-unpacked\TWoW Paladin Simulator.exe
echo - OR TWoW Paladin Simulator.exe in current folder
echo.
pause