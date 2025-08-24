const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function getPresetsPath() {
    return path.join(app.getPath('userData'), 'saved_presets');
}

function getDatabasePath() {
    if (app.isPackaged) {
        const resourcesPath = path.join(process.resourcesPath, 'data', 'database');
        const appPath = path.join(__dirname, 'data', 'database');
        
        if (fs.existsSync(resourcesPath)) {
            return path.join(process.resourcesPath, 'data');
        } else if (fs.existsSync(appPath)) {
            return path.join(__dirname, 'data');
        } else {
            const userDataPath = path.join(app.getPath('userData'), 'data');
            return userDataPath;
        }
    } else {
        return path.join(__dirname, 'data');
    }
}

function ensurePresetsDirectory() {
    const presetsPath = getPresetsPath();
    const parentDir = path.dirname(presetsPath);
    console.log('DEBUG: userData parent absolute path:', parentDir);
    console.log('DEBUG: saved_presets absolute path:', presetsPath);
    if (fs.existsSync(parentDir)) {
        console.log('DEBUG: userData parent exists. isDirectory:', fs.lstatSync(parentDir).isDirectory());
    } else {
        console.log('DEBUG: userData parent does not exist.');
    }
    if (fs.existsSync(presetsPath)) {
        console.log('DEBUG: saved_presets exists. isDirectory:', fs.lstatSync(presetsPath).isDirectory());
    } else {
        console.log('DEBUG: saved_presets does not exist.');
    }

    if (fs.existsSync(parentDir) && !fs.lstatSync(parentDir).isDirectory()) {
        fs.unlinkSync(parentDir);
        console.log('Deleted file at userData parent path, recreating as directory:', parentDir);
    }
    if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
        console.log('Created userData parent directory:', parentDir);
    }
    if (fs.existsSync(presetsPath) && !fs.lstatSync(presetsPath).isDirectory()) {
        fs.unlinkSync(presetsPath);
        console.log('Deleted file at saved_presets path, recreating as directory:', presetsPath);
    }
    if (!fs.existsSync(presetsPath)) {
        fs.mkdirSync(presetsPath, { recursive: true });
        console.log('Created presets directory:', presetsPath);
    }

    if (fs.existsSync(parentDir)) {
        console.log('DEBUG AFTER: userData parent exists. isDirectory:', fs.lstatSync(parentDir).isDirectory());
    } else {
        console.log('DEBUG AFTER: userData parent does not exist.');
    }
    if (fs.existsSync(presetsPath)) {
        console.log('DEBUG AFTER: saved_presets exists. isDirectory:', fs.lstatSync(presetsPath).isDirectory());
    } else {
        console.log('DEBUG AFTER: saved_presets does not exist.');
    }
    return presetsPath;
}

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1200,
        minHeight: 800,
        center: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false
        },
        title: 'TWoW Paladin Simulator',
        show: false,
        backgroundColor: '#1a1a2e',
        useContentSize: true,
        thickFrame: false,
        frame: true,
        titleBarStyle: 'default',
        icon: path.join(__dirname, 'assets', 'icons', 'titleicon.png')
    });

    // Load file and then wait before showing
    const indexPath = path.join(__dirname, 'src', 'index.html');
    mainWindow.loadFile(indexPath).then(() => {
        // Wait 1 second before showing window
        setTimeout(() => {
            mainWindow.show();
            
            console.log('App is packaged:', app.isPackaged);
            console.log('Resources path:', process.resourcesPath);
            console.log('App path:', app.getAppPath());
            console.log('User data path:', app.getPath('userData'));
            console.log('Presets path:', getPresetsPath());
            console.log('Database path:', getDatabasePath());
        }, 1000);
    });

    // Restore Ctrl+Shift+D DevTools command and remove default menu bar
    const template = [
        {
            label: 'DevTools',
            submenu: [
                {
                    label: 'Toggle DevTools',
                    accelerator: 'Ctrl+Shift+D',
                    click: () => {
                        mainWindow.webContents.toggleDevTools();
                    }
                }
            ]
        }
    ];
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    mainWindow.setMenuBarVisibility(false);
    return mainWindow;
}

ipcMain.handle('load-presets', async () => {
    try {
        const presetsPath = ensurePresetsDirectory();
        console.log('[PRESET DEBUG] Reading presets from:', presetsPath);
        if (!fs.existsSync(presetsPath)) {
            console.log('[PRESET DEBUG] Presets directory does not exist:', presetsPath);
            return [];
        }
        const allFiles = fs.readdirSync(presetsPath);
        console.log('[PRESET DEBUG] Files in directory:', allFiles);
        const files = allFiles.filter(file => file.endsWith('.json') && file !== '.gitkeep');
        console.log('[PRESET DEBUG] Preset .json files:', files);
        const presetNames = files
            .map(file => path.basename(file, '.json'))
            .filter(name => name && name.trim().length > 0);
        return presetNames;
    } catch (error) {
        console.error('[PRESET DEBUG] Error loading presets:', error);
        return [];
    }
});
ipcMain.handle('save-preset', async (event, presetName, presetData) => {
    try {
        const presetsPath = ensurePresetsDirectory();
        const filePath = path.join(presetsPath, `${presetName}.json`);
        fs.writeFileSync(filePath, JSON.stringify(presetData, null, 2));
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message || String(error) };
    }
});

ipcMain.handle('load-preset-data', async (event, presetName) => {
    try {
        const presetsPath = ensurePresetsDirectory();
        const filePath = path.join(presetsPath, `${presetName}.json`);
        if (!fs.existsSync(filePath)) {
            throw new Error('Preset file not found: ' + filePath);
        }
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { error: error.message || String(error) };
    }
});

ipcMain.handle('delete-preset', async (event, presetName) => {
    try {
        const presetsPath = ensurePresetsDirectory();
        const filePath = path.join(presetsPath, `${presetName}.json`);
        
        console.log('Deleting preset:', presetName, 'from:', filePath);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log('Preset deleted successfully');
        }
        return true;
    } catch (error) {
        console.error('Error deleting preset:', error);
        throw error;
    }
});

ipcMain.handle('get-data-paths', async () => {
    return {
        presetsPath: ensurePresetsDirectory(),
        databasePath: getDatabasePath(),
        isPackaged: app.isPackaged
    };
});

app.whenReady().then(() => {
    createWindow();
    
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        } 
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});