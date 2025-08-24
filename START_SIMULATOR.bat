@echo off
echo.
echo =====================================
echo  Starting TWoW Paladin Simulator
echo =====================================
echo.

:: Check if executable exists
if not exist "build\win-unpacked\TWoW Paladin Simulator.exe" (
    echo ERROR: Simulator executable not found!
    echo.
    echo Please run setup.bat first to build the simulator.
    echo.
    pause
    exit /b 1
)

echo Launching simulator...
echo.

:: Start the simulator
start "" "build\win-unpacked\TWoW Paladin Simulator.exe"

echo Simulator started!
echo You can close this window now.
echo.
timeout /t 3 /nobreak >nul
