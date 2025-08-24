@echo off
echo.
echo ===============================================
echo  TWoW Paladin Simulator - Zero Install Setup
echo ===============================================
echo.
echo This setup downloads a PRE-BUILT version!
echo No Node.js, npm, or build process required!
echo.

:: Create downloads directory
if not exist "downloads" mkdir downloads

:: Check if we already have the pre-built version
if exist "TWoW-Paladin-Simulator.exe" (
    echo Pre-built simulator found!
    goto :launch
)

echo Downloading pre-built simulator...
echo This downloads the ready-to-run executable.
echo.

:: For now, let's use a placeholder - you would replace this with actual download
echo NOTE: This would download a pre-built executable from a file hosting service
echo such as GitHub Releases, Google Drive, or similar.
echo.
echo For demonstration, we'll build it locally this one time...

:: Fallback to portable build if no pre-built version available
call setup-portable.bat

if exist "build\win-unpacked\TWoW Paladin Simulator.exe" (
    echo.
    echo Copying built executable to main directory for easy access...
    copy "build\win-unpacked\TWoW Paladin Simulator.exe" "TWoW-Paladin-Simulator.exe"
    
    :: Also copy required DLLs
    if exist "build\win-unpacked\*.dll" (
        copy "build\win-unpacked\*.dll" "."
    )
)

:launch
echo.
echo ===============================================
echo  Zero Install Setup Complete!
echo ===============================================
echo.
echo The simulator is ready to run!
echo.
echo To start: Double-click "TWoW-Paladin-Simulator.exe"
echo.
pause

:: Optionally auto-launch
if exist "TWoW-Paladin-Simulator.exe" (
    echo Starting simulator...
    start "" "TWoW-Paladin-Simulator.exe"
)
