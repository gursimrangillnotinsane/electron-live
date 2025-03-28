//pre-load css, to use express functions
//has access to nodejs
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    title: "the note app",
    createNote: (data) => ipcRenderer.invoke('create-file', data),
    getFiles: () => ipcRenderer.invoke('get-files'),
    getContent: (data) => ipcRenderer.invoke('get-content', data),
    autoSave: (data) => ipcRenderer.invoke('save-note', data),
    deleteFile: (data) => ipcRenderer.invoke('delete-file', data),
    toggleTheme: () => ipcRenderer.send('toggle-theme'),
    onThemeUpdate: (callback) => ipcRenderer.on('theme-updated', (_, newTheme) => callback(newTheme))
})

