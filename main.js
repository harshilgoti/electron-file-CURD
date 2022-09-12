const { app, BrowserWindow, ipcMain, dialog } = require('electron')

const path = require('path')

const fs = require('fs')

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900, height: 680, webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.js'),
            // protocol: 'file:',
            // slashes: true
        }
    });

    mainWindow.loadFile('index.html');

}

function readFile(filepath, event) {

    fs.readFile(filepath, 'utf-8', function (err, data) {
        if (err) {
            console.log("An error ocurred reading the file :" + err.message);
            return;
        }

        event.sender.send('open-file-paths', data)
        // document.getElementById('content-editor').value = data;
    });
}

async function handleFileOpen(event, path) {
    const { canceled, filePaths } = await dialog.showOpenDialog()

    if (canceled) {
        console.log("No file selected");
    } else {
        readFile(filePaths[0], event);
        return filePaths[0]
    }

}

async function handleFileSave(event, { actualFilePath, contentEditor }) {
    fs.writeFile(actualFilePath, contentEditor, function (err) {
        if (err) {
            console.log("An error ocurred updating the file" + err.message);
            return;
        }

        console.log("The file has been succesfully saved");
    });
}

async function handleFileRemove(event, filepath) {
    fs.exists(filepath, function (exists) {
        if (exists) {
            // File exists deletings
            fs.unlink(filepath, function (err) {
                if (err) {
                    console.log("An error ocurred updating the file" + err.message);
                    console.log(err);
                    return;
                }
            });
        } else {
            console.log("This file doesn't exist, cannot delete");
        }
    });
}

function createFile(filePath, content, event) {

    fs.writeFile(filePath, content, function (err) {
        if (err) {
            console.log("An error ocurred creating the file " + err.message)
        }

        console.log("The file has been succesfully saved");
        event.sender.send('create-file', filePath);
    });
}

async function handleFileCreate(event, content) {
    const { filePath } = await dialog.showSaveDialog()

    if (filePath === undefined) {
        console.log("You didn't save the file");
        return;
    }

    createFile(filePath, content, event)

}



ipcMain.handle('dialog:saveFile', handleFileSave)

ipcMain.handle('dialog:removeFile', handleFileRemove)
ipcMain.handle('dialog:createFile', handleFileCreate)


app.whenReady().then(() => {
    ipcMain.handle('dialog:openFile', handleFileOpen)
    createWindow()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
});

// app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});



app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});
