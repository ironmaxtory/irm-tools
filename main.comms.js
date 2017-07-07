const electron = require('electron');
const path = require('path');
const childProcess = require('child_process');
const ipcMain = electron.ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

var tarball = require('tarball-extract')


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

// 分发处理消息
function respMessage (evt, arg, projects) {
  // 获取主窗口对象
  const mainWindow = (BrowserWindow.getAllWindows())[0];
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
      case 'UpdateApp':
        evt.returnValue = true;
        // mainWindow.close();
        console.log(tarball);
        tarball.extractTarball('./test/irm-tools-0.0.1.tar.gz', './test/IRM', function(err){
          if(err) console.log(err)
        });
        break;
      default:
        evt.returnValue = false;
        break;
    }
  } else if (typeof arg === 'object') {
    switch (arg.name) {
      case 'autoreloadStarted':
        if (!Array.isArray(projects)) return;
        projects.push(new AutoreloadProject(arg.pid));
        evt.returnValue = true;
        break;
      case 'autoreloadStop':
        if (!Array.isArray(projects)) return;
        for(let i=0; i<projects.length; i++){
          if (projects[i].pid === arg.pid) {
            projects.splice(i, 1);
            break;
          }
        }
        evt.returnValue = true;
        break;
      default:
        evt.returnValue = false;
        break;
    }
  }
}

const mainCommsModule = {
  respMessage: respMessage,
};

module.exports = mainCommsModule;
