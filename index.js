const { app, BrowserWindow, nativeTheme } = require('electron');
const path = require('path')
require("./ipcHandler")
//create window
function createWindow() {
    const win = new BrowserWindow({
        //parameters
        width: 720,
        height: 700,
        icon: path.join(__dirname, "src", "media", "icon.png"),
        // load the pre-loaded script
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    //main entry file
    win.loadFile('src/index.html')

}
//start the app
app.whenReady().then(createWindow);

// to close the app
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})