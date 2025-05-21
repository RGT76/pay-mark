const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  saveFile: (fileData, suggestedName) => {
    return ipcRenderer.invoke('save-file', { fileData, suggestedName });
  },
  openFile: () => {
    return ipcRenderer.invoke('open-file');
  }
});