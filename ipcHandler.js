//required imports
const { app, ipcMain } = require('electron');
const path = require('path')
const fs = require('fs')
const fsp = require('node:fs/promises');
//get all the user files
ipcMain.handle('get-files', async (event, data) => {
    try {
        const folderPath = path.join(app.getPath('userData'), 'note');
        const files = fs.readdirSync(folderPath);
        return { success: true, files };
    } catch (err) {
        console.error('Error reading files:', err);
        return { success: false, files: [] };
    }
})

//get the content of a specific file
ipcMain.handle('get-content', async (event, data) => {
    if (!data || !data.title) return false;
    try {
        const filePath = path.join(app.getPath('userData'), 'note', data.title)
        const content = await fsp.readFile(filePath, { encoding: 'utf8' })
        return { success: true, content }
    }
    catch (err) {
        console.log(err)
        return { success: false, data: null }
    }
})

//save the new content
// Handle the save note request from renderer process
ipcMain.handle('save-note', async (event, { title, content }) => {
    try {
        const filePath = path.join(app.getPath('userData'), 'note', `${title}`);

        // Write the content to the file (auto-save feature)
        fs.writeFile(filePath, content, { flag: 'w+' }, err => { });
        console.log('Note saved:', title);

        return { success: true };
    } catch (error) {
        console.log('Error saving note:', error);
        return { success: false, error: error.message };
    }
});



//function to create txt files
// IPC (Inter-Process Communication) handler
ipcMain.handle('create-file', async (event, data) => {
    if (!data || !data.title || !data.content) return false;
    // to store data in UserData
    //C:\Users\hp\AppData\Roaming
    const folderName = path.join(app.getPath('userData'), 'note');
    try {
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName);
        }
    }
    catch (err) {
        console.log(err.message)
    }
    const filePath = path.join(folderName, `${data.title}.txt`)
    fs.writeFileSync(filePath, data.content);
    return { success: true, filePath }
})

//delete a fle
ipcMain.handle('delete-file', async (event, data) => {
    if (!data || !data.title) return { success: false };
    try {
        const filePath = path.join(app.getPath('userData'), 'note', data.title);
        fs.unlinkSync(filePath);  // Delete the file
        return { success: true };
    } catch (err) {
        console.log(err);
        return { success: false };
    }
});
