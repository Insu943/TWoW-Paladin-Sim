# TWoW Paladin Simulator Setup Script
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host " TWoW Paladin Simulator Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version 2>$null
    Write-Host "Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "Then run this setup again." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version 2>$null
    Write-Host "npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: npm is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "Then run this setup again." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow

try {
    npm install
    if ($LASTEXITCODE -ne 0) {
        throw "npm install failed"
    }
    Write-Host "Dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "ERROR: Failed to install dependencies!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Building executable..." -ForegroundColor Yellow

try {
    npm run build:win
    if ($LASTEXITCODE -ne 0) {
        throw "build failed"
    }
    Write-Host "Build completed successfully!" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "ERROR: Failed to build executable!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host " Setup Complete!" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "The TWoW Paladin Simulator has been built successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the simulator:" -ForegroundColor Yellow
Write-Host "- Double-click 'START_SIMULATOR.bat', or" -ForegroundColor White
Write-Host "- Run the executable directly from: build\win-unpacked\TWoW Paladin Simulator.exe" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"
