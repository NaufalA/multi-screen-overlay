"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
var mainDisplay;
var mainWindow;
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    // eslint-disable-line global-require
    electron_1.app.quit();
}
var createExtraWindow = function (display, mainWindow) {
    var extraWindow = new electron_1.BrowserWindow({
        fullscreen: true,
        x: display.bounds.x,
        y: display.bounds.y,
        height: display.size.height,
        width: display.size.width,
        parent: mainWindow
    });
    extraWindow.loadFile(path.join(__dirname, '../src/index.html'));
};
var setupExtraWindows = function (newDisplay) {
    console.log(mainDisplay.bounds.x === newDisplay.bounds.x && mainDisplay.bounds.y === newDisplay.bounds.y);
    if (mainDisplay.bounds.x === newDisplay.bounds.x && mainDisplay.bounds.y === newDisplay.bounds.y) {
        mainDisplay = newDisplay;
        mainWindow.setPosition(mainDisplay.bounds.x, mainDisplay.bounds.y, false);
        mainWindow.setSize(mainDisplay.size.width, mainDisplay.size.height, false);
    }
    mainWindow.getChildWindows().forEach(function (cw) { return cw.close(); });
    var displays = electron_1.screen.getAllDisplays();
    displays.forEach(function (display) {
        if (display.bounds.x !== 0 || display.bounds.y !== 0) {
            createExtraWindow(display, mainWindow);
        }
    });
    mainWindow.moveTop();
};
var createWindow = function () {
    mainDisplay = electron_1.screen.getPrimaryDisplay();
    console.log(mainDisplay);
    // Create the browser window.
    mainWindow = new electron_1.BrowserWindow({
        fullscreen: true,
        height: mainDisplay.size.height,
        width: mainDisplay.size.width
    });
    // Create extra window to cover external displays
    setupExtraWindows(mainDisplay);
    electron_1.screen.on('display-added', function (event, newDisplay) {
        setupExtraWindows(newDisplay);
    });
    electron_1.screen.on('display-removed', function (event, oldDisplay) {
        setupExtraWindows(electron_1.screen.getPrimaryDisplay());
    });
    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, '../src/index.html'));
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
};
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.on('ready', createWindow);
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
//# sourceMappingURL=index.js.map