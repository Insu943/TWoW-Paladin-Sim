# TWoW Paladin Simulator Auto-Setup Script
# This script will automatically download and install all required dependencies

param(
    [switch]$SkipNodeInstall
)

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host " TWoW Paladin Simulator Auto-Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Enable TLS 1.2 for downloads
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# Create temp directory
if (!(Test-Path "temp")) {
    New-Item -ItemType Directory -Path "temp" | Out-Null
}

# Function to download files with progress
function Download-File {
    param($Url, $Output)
    try {
        Write-Host "Downloading $(Split-Path $Output -Leaf)..." -ForegroundColor Yellow
        Invoke-WebRequest -Uri $Url -OutFile $Output -UseBasicParsing
        return $true
    } catch {
        Write-Host "Download failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Check if Node.js is already installed
$nodeInstalled = $false
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "Node.js found: $nodeVersion" -ForegroundColor Green
        $nodeInstalled = $true
    }
} catch {
    # Node.js not found
}

if (!$nodeInstalled -and !$SkipNodeInstall) {
    Write-Host "Node.js not found. Installing automatically..." -ForegroundColor Yellow
    Write-Host ""
    
    # Download Node.js installer
    $nodeUrl = "https://nodejs.org/dist/v20.17.0/node-v20.17.0-x64.msi"
    $nodeInstaller = "temp\node-installer.msi"
    
    if (!(Download-File $nodeUrl $nodeInstaller)) {
        Write-Host "ERROR: Failed to download Node.js!" -ForegroundColor Red
        Write-Host "Please check your internet connection and try again." -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 1
    }
    
    Write-Host ""
    Write-Host "Installing Node.js silently..." -ForegroundColor Yellow
    Write-Host "This may take a few minutes..." -ForegroundColor Gray
    
    # Install Node.js silently
    try {
        $process = Start-Process -FilePath "msiexec.exe" -ArgumentList "/i", $nodeInstaller, "/quiet", "/norestart" -Wait -PassThru
        if ($process.ExitCode -ne 0) {
            throw "Installation failed with exit code $($process.ExitCode)"
        }
        Write-Host "Node.js installed successfully!" -ForegroundColor Green
        
        # Refresh environment variables
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        
        # Verify installation
        try {
            $nodeVersion = node --version 2>$null
            Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
        } catch {
            Write-Host "Warning: Node.js may not be immediately available. You may need to restart your terminal." -ForegroundColor Yellow
        }
        
    } catch {
        Write-Host "ERROR: Failed to install Node.js automatically." -ForegroundColor Red
        Write-Host "Please install Node.js manually from: https://nodejs.org/" -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host ""
Write-Host "Installing project dependencies..." -ForegroundColor Yellow

try {
    # Ensure we're using the right npm
    $npmPath = where.exe npm 2>$null
    if (!$npmPath) {
        throw "npm not found in PATH"
    }
    
    # Install dependencies
    & npm install
    if ($LASTEXITCODE -ne 0) {
        throw "npm install failed with exit code $LASTEXITCODE"
    }
    Write-Host "Dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "ERROR: Failed to install dependencies!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Building executable..." -ForegroundColor Yellow

try {
    & npm run build:win
    if ($LASTEXITCODE -ne 0) {
        throw "build failed with exit code $LASTEXITCODE"
    }
    Write-Host "Build completed successfully!" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "ERROR: Failed to build executable!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Clean up temp files
if (Test-Path "temp") {
    Remove-Item "temp" -Recurse -Force
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
Write-Host "- Run: build\win-unpacked\TWoW Paladin Simulator.exe" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"
