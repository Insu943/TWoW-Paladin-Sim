@echo off
echo.
echo ========================================
echo  Creating Standalone TWoW Paladin Simulator
echo ========================================
echo.

:: Check if built version exists
if not exist "build\win-unpacked\TWoW Paladin Simulator.exe" (
    echo ERROR: Built simulator not found!
    echo Please run 'npm run build:win' first to build the simulator.
    echo.
    pause
    exit /b 1
)

:: Create standalone folder
echo Creating standalone version...
if not exist "TWoW-Paladin-Simulator-Standalone" mkdir "TWoW-Paladin-Simulator-Standalone"

:: Copy all files
echo Copying simulator files...
xcopy "build\win-unpacked\*" "TWoW-Paladin-Simulator-Standalone\" /E /I /Y >nul

:: Create simple launcher in the standalone folder
echo @echo off > "TWoW-Paladin-Simulator-Standalone\Launch.bat"
echo start "" "TWoW Paladin Simulator.exe" >> "TWoW-Paladin-Simulator-Standalone\Launch.bat"

:: Create main launcher
echo @echo off > "Launch-TWoW-Paladin-Simulator.bat"
echo cd /d "TWoW-Paladin-Simulator-Standalone" >> "Launch-TWoW-Paladin-Simulator.bat"
echo start "" "TWoW Paladin Simulator.exe" >> "Launch-TWoW-Paladin-Simulator.bat"

echo.
echo ========================================
echo  Standalone Version Created!
echo ========================================
echo.
echo The standalone simulator is ready in:
echo TWoW-Paladin-Simulator-Standalone\
echo.
echo To run: Double-click "Launch-TWoW-Paladin-Simulator.bat"
echo.
echo This version needs NO setup and runs directly!
echo.
pause
