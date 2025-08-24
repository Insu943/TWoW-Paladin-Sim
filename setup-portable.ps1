# TWoW Paladin Simulator - Portable Setup
# No installation required - everything runs from this folder!

Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host " TWoW Paladin Simulator - Portable Setup" -ForegroundColor Cyan  
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This setup requires NO installation of any software!" -ForegroundColor Green
Write-Host "Everything runs portably from this folder." -ForegroundColor Green
Write-Host ""

# Enable TLS 1.2
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# Create portable directory structure
$portableDir = "portable"
$nodejsDir = "$portableDir\nodejs"
$tempDir = "$portableDir\temp"

@($portableDir, $nodejsDir, $tempDir) | ForEach-Object {
    if (!(Test-Path $_)) {
        New-Item -ItemType Directory -Path $_ -Force | Out-Null
    }
}

# Check if portable Node.js already exists
if (Test-Path "$nodejsDir\node.exe") {
    Write-Host "Portable Node.js found! Skipping download..." -ForegroundColor Green
} else {
    Write-Host "Downloading portable Node.js..." -ForegroundColor Yellow
    Write-Host "This may take a few minutes depending on your connection..." -ForegroundColor Gray
    Write-Host ""
    
    try {
        # Download Node.js portable
        $nodeUrl = "https://nodejs.org/dist/v20.17.0/node-v20.17.0-win-x64.zip"
        $nodeZip = "$tempDir\nodejs.zip"
        
        Write-Host "Downloading from: $nodeUrl" -ForegroundColor Gray
        Invoke-WebRequest -Uri $nodeUrl -OutFile $nodeZip -UseBasicParsing
        
        Write-Host "Download complete! Extracting..." -ForegroundColor Yellow
        
        # Extract Node.js
        Expand-Archive -Path $nodeZip -DestinationPath $tempDir -Force
        
        # Move files to correct location
        $extractedDir = "$tempDir\node-v20.17.0-win-x64"
        Get-ChildItem $extractedDir | Move-Item -Destination $nodejsDir -Force
        
        Write-Host "Node.js portable setup complete!" -ForegroundColor Green
        
    } catch {
        Write-Host "ERROR: Failed to download/extract Node.js!" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Please check your internet connection and try again." -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host ""
Write-Host "Setting up project dependencies..." -ForegroundColor Yellow

try {
    # Add portable Node.js to PATH for this session
    $env:PATH = "$(Resolve-Path $nodejsDir);$env:PATH"
    
    # Verify Node.js works
    $nodeVersion = & "$nodejsDir\node.exe" --version
    Write-Host "Using Node.js version: $nodeVersion" -ForegroundColor Green
    
    # Install dependencies
    Write-Host "Installing project dependencies..." -ForegroundColor Yellow
    & "$nodejsDir\npm.cmd" install
    
    if ($LASTEXITCODE -ne 0) {
        throw "npm install failed"
    }
    
    Write-Host "Dependencies installed successfully!" -ForegroundColor Green
    
    # Build the project
    Write-Host ""
    Write-Host "Building simulator..." -ForegroundColor Yellow
    & "$nodejsDir\npm.cmd" run build:win
    
    if ($LASTEXITCODE -ne 0) {
        throw "build failed"
    }
    
    Write-Host "Build completed successfully!" -ForegroundColor Green
    
} catch {
    Write-Host ""
    Write-Host "ERROR: Setup failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Clean up temp files
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}

Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host " Portable Setup Complete!" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "The TWoW Paladin Simulator is now ready!" -ForegroundColor Green
Write-Host "Everything is contained in this folder - no system installation required." -ForegroundColor Green
Write-Host ""
Write-Host "To start the simulator:" -ForegroundColor Yellow
Write-Host "- Double-click 'START_SIMULATOR.bat'" -ForegroundColor White
Write-Host "- Or run: build\win-unpacked\TWoW Paladin Simulator.exe" -ForegroundColor White
Write-Host ""
Write-Host "Note: You can move this entire folder anywhere and it will still work!" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to exit"
