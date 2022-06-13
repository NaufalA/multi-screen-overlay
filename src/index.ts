import { app, BrowserWindow, Display, screen } from 'electron';
import * as path from 'path';

let mainDisplay: Display;

let mainWindow: BrowserWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const createExtraWindow = (display: Display, mainWindow: BrowserWindow): void => {
  const extraWindow = new BrowserWindow({
    fullscreen: true,
    x: display.bounds.x,
    y: display.bounds.y,
    height: display.size.height,
    width: display.size.width,
    parent: mainWindow,
  });

  extraWindow.loadFile(path.join(__dirname, '../src/index.html'));
}

const setupExtraWindows = (newDisplay: Display): void => {
  console.log(mainDisplay.bounds.x === newDisplay.bounds.x && mainDisplay.bounds.y === newDisplay.bounds.y);
  if (mainDisplay.bounds.x === newDisplay.bounds.x && mainDisplay.bounds.y === newDisplay.bounds.y) {
    mainDisplay = newDisplay;
    mainWindow.setPosition(mainDisplay.bounds.x, mainDisplay.bounds.y, false);
    mainWindow.setSize(mainDisplay.size.width, mainDisplay.size.height, false);
  }

  mainWindow.getChildWindows().forEach((cw) => cw.close());

  const displays = screen.getAllDisplays();
  displays.forEach((display) => {
    if (display.bounds.x !== 0 || display.bounds.y !== 0) {
      createExtraWindow(display, mainWindow);
    }
  });

  mainWindow.moveTop();
}

const createWindow = (): void => {
  mainDisplay = screen.getPrimaryDisplay();
  console.log(mainDisplay);
  // Create the browser window.
  mainWindow = new BrowserWindow({
    fullscreen: true,
    height: mainDisplay.size.height,
    width: mainDisplay.size.width,
  });

  // Create extra window to cover external displays
  setupExtraWindows(mainDisplay);

  screen.on('display-added', (event, newDisplay) => {
    setupExtraWindows(newDisplay);
  });

  
  screen.on('display-removed', (event, oldDisplay) => {
    setupExtraWindows(screen.getPrimaryDisplay());
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../src/index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
