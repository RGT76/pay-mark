const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const serve = require('electron-serve');
const Store = require('electron-store');

const isProd = process.env.NODE_ENV === 'production';
const loadURL = isProd ? serve({ directory: 'dist' }) : null;
const store = new Store();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../public/favicon.ico')
  });

  if (isProd) {
    loadURL(mainWindow);
  } else {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

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

// Handle file save dialog
ipcMain.handle('save-file', async (event, { fileData, suggestedName }) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Enregistrer le PDF avec filigrane',
    defaultPath: suggestedName || 'document-avec-filigrane.pdf',
    filters: [{ name: 'PDF', extensions: ['pdf'] }]
  });

  if (!canceled && filePath) {
    const fs = require('fs');
    const buffer = Buffer.from(fileData);
    fs.writeFileSync(filePath, buffer);
    return { success: true, filePath };
  }
  
  return { success: false };
});

// Handle file open dialog
ipcMain.handle('open-file', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'PDF', extensions: ['pdf'] }]
  });

  if (!canceled && filePaths.length > 0) {
    const fs = require('fs');
    const files = [];
    
    for (const filePath of filePaths) {
      const fileBuffer = fs.readFileSync(filePath);
      const fileName = path.basename(filePath);
      
      files.push({
        name: fileName,
        path: filePath,
        data: fileBuffer.toString('base64')
      });
    }
    
    return { success: true, files };
  }
  
  return { success: false, files: [] };
});