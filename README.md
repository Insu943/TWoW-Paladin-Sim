# TWoW Paladin Simulator

A comprehensive simulation tool for Paladin characters in Turtle WoW.

## For Users

### Quick Start
1. **Run the Application**: Double-click `START_SIMULATOR.bat`
2. **Download Builds**: Check the `dist/` folder for the latest executable

### What You Need
- The `dist/` folder contains the built application
- The `START_SIMULATOR.bat` file will launch the app automatically

## For Developers

### Development Setup
All development files are located in the `dev/` folder:

```
dev/
├── src/                  # Source code
│   ├── index.html       # Main HTML file
│   ├── css/app.css      # Styles
│   └── js/              # JavaScript files
├── data/                # Game data (JSON files)
├── assets/              # Images and icons
├── electron.js          # Electron main process
├── package.json         # Dependencies
└── node_modules/        # Installed packages
```

### Development Commands
```bash
cd dev
npm install              # Install dependencies
npm start               # Run in development mode
```

### Project Structure
- **User Files**: Root directory contains only what users need
- **Development Files**: `dev/` folder contains all development resources
- **Builds**: `dist/` folder contains built executables

## Features

- **Character Equipment**: Equip and manage gear across all equipment slots
- **Stat Calculations**: Real-time stat calculations with detailed breakdowns  
- **Enchant System**: Apply enchants to compatible gear pieces
- **Preset Management**: Save and load character builds
- **Interactive UI**: Click on stat names for detailed breakdowns
- **Race Selection**: Choose from different races with unique bonuses

## Development

The application is built with:
- **Electron** - Desktop application framework
- **Vanilla JavaScript** - Core application logic
- **CSS Grid/Flexbox** - Responsive UI layout
- **JSON** - Data storage for items, enchants, and character data