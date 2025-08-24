# TWoW Paladin Simulator

A tool to simulate paladins in TWOW.

## Quick Start (No Pre-installed Software Required!)

### Windows - Automatic Setup
1. Download the repository
2. Run `setup.bat` or `setup.ps1` (this will automatically download Node.js if needed, install dependencies, and build the executable)
3. Run `START_SIMULATOR.bat` to launch the simulator

**No need to install Node.js manually - the setup script handles everything!**

### Alternative Methods
- **PowerShell**: Right-click `setup.ps1` → "Run with PowerShell"
- **Command Prompt**: Double-click `setup.bat`
- **Manual**: If you already have Node.js installed, run `npm run setup`

## Development
- `npm start` - Run in development mode
- `npm run build:win` - Build Windows executable  
- `npm run clean` - Clean build folders
- `npm run setup` - Install dependencies and build