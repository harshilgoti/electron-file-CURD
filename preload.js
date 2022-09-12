const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    saveFile: (callback) => ipcRenderer.invoke('dialog:saveFile', callback),
    removeFile: (callback) => ipcRenderer.invoke('dialog:removeFile', callback),
    createFile: (callback) => ipcRenderer.invoke('dialog:createFile', callback)
})


window.addEventListener('DOMContentLoaded', () => {
    const contentEditor = document.getElementById('content-editor')
    const actualFile = document.getElementById('actual-file')
    ipcRenderer.on('open-file-paths', (_event, arg) => {
        contentEditor.value = arg
    })
    ipcRenderer.on('create-file', (_event, arg) => {
        actualFile.value = arg
    })
})