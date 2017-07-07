const electron = require('electron')
const ipcMain = electron.ipcMain
const childProcess = require('child_process')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

const ROOT_PATH = path.resolve(__dirname);
const DIST_PATH = path.resolve(ROOT_PATH, './dist');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

let alproject
let AutoreloadProject = (function(childProcess){
  return function (pid) {
    this.pid = pid;
    this.childProcess = childProcess;
  }
})(childProcess);
AutoreloadProject.prototype.stop = function () {
  if (process.platform === 'win32') {
    this.childProcess.execSync(`taskkill /pid ${this.pid} /T /F`);
    this.childProcess.execSync(`del .config.*.json`);
  } else {
    this.childProcess.execSync(`kill ${this.pid}`);
    this.childProcess.execSync(`rm -f .config.*.json`);
  }
};

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 820, height: 820, resizable: false,})

  // and load the index.html of the app.
  // When Build
  // mainWindow.loadURL(url.format({
  //   pathname: path.resolve(DIST_PATH, 'index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }))
  // When Dev
  mainWindow.loadURL('http://localhost:5010/dist/#/')

  // set menu
  // mainWindow.setMenu()

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.

    if ((typeof alproject === 'object') && (alproject != undefined)) {
      alproject.stop();
    }

    setTimeout(()=>{
      mainWindow = null
    }, 1000);


  })

}

/**
 * app前期生命周期
 * - ready
 * - window-all-closed
 * - activate
 */
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function(){
  createWindow();
  console.log('xxx');
  console.log(BrowserWindow.getAllWindows());
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('syncAsked', function(evt, arg){
  console.log(arg);
  if (typeof arg === 'string') {
    switch (arg) {
      case 'AppPath':
        evt.returnValue = path.resolve(__dirname);
        break;
      case 'AppVersion':
        evt.returnValue = app.getVersion();
        break;
      case 'ToggleDevTools':
        mainWindow.webContents.toggleDevTools();
        evt.returnValue = true;
        break;
      default:
        evt.returnValue = false;
        break;
    }
  } else if (typeof arg === 'object') {
    switch (arg.name) {
      case 'autoreloadStarted':
        alproject = new AutoreloadProject(arg.pid);
        evt.returnValue = true;
        break;
      case 'autoreloadStop':
        if (alproject.pid === arg.pid) {
          alproject = undefined;
        }
        evt.returnValue = true;
        break;
      default:
        evt.returnValue = false;
        break;
    }
  }
});
