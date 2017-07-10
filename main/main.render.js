const electron = require('electron');
const path = require('path');
const BrowserWindow = electron.BrowserWindow;
const ROOT_PATH = path.resolve(__dirname, '../');
const DIST_PATH = path.resolve(ROOT_PATH, './dist');


function createWindow (projects) {
  mainWindow = new BrowserWindow({width: 820, height: 820, resizable: false,});

  if (1) {
    // When Build
    mainWindow.loadURL(url.format({
      pathname: path.resolve(DIST_PATH, 'index.html'),
      protocol: 'file:',
      slashes: true
    }))
  } else {
    // When Dev
    mainWindow.loadURL('http://localhost:5010/dist/#/');
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // shutdown all of the projects
    if ((Array.isArray(projects)) && (projects.length > 0)) {
      projects.forEach(function(item){
        item.stop();
      });
    }
    setTimeout(()=>{
      mainWindow = null;
    }, 1000);
  });

}

var mainRenderModule = {
  createWindow: createWindow,
};

module.exports = mainRenderModule;
