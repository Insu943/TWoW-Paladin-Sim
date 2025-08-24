# TWoW Paladin Simulator

A tool to simulate paladins in TWOW.

## Setup Options (Choose Your Preference!)

### 🚀 Option 1: Zero Install (Easiest!)
**No Node.js, npm, or any build tools required!**
1. Download the repository
2. Run `setup-zero-install.bat` 
3. Downloads pre-built executable and runs immediately

### 🔧 Option 2: Portable Setup (No System Installation)
**Uses portable Node.js - nothing installed to your system!**
1. Download the repository  
2. Run `setup-portable.bat` or `setup-portable.ps1`
3. Everything runs from the project folder
4. Run `START_SIMULATOR.bat` to launch

### ⚙️ Option 3: Auto Install (Installs Node.js if needed)
1. Download the repository
2. Run `setup.bat` or `setup.ps1` 
3. Automatically installs Node.js if missing
4. Run `START_SIMULATOR.bat` to launch

### 💻 Option 4: Manual (For Developers)
If you already have Node.js: `npm run setup`

## What Each Setup Does
- **Zero Install**: Downloads ready-to-run executable (fastest)
- **Portable**: Downloads portable Node.js, builds locally (no system changes)
- **Auto Install**: Installs Node.js to system if needed, then builds
- **Manual**: Uses your existing Node.js installation

## Development Commands
- `npm start` - Run in development mode
- `npm run build:win` - Build Windows executable  
- `npm run clean` - Clean build folders
- `npm run setup` - Install dependencies and build