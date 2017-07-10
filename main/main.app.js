const electron = require('electron');
const ipcMain = electron.ipcMain;
const app = electron.app;
const dialog = electron.dialog;

const mainRenderModule = require('./main.render.js');
const mainCommsModule = require('./main.comms.js');

// import mainRenderModule from './main.render.js';
// import mainCommsModule from './main.comms.js';

// 渲染进程中启动的项目
var projects = [];

// App主模块
app.on('ready', function(){
  mainRenderModule.createWindow(projects);
})
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
    console.log('所有窗口已经关闭');
  }
})
app.on('activate', function () {
  if (mainWindow === null) {
    mainRenderModule.createWindow(projects)
  }
})


// 通信模块
ipcMain.on('syncAsked', function(evt, arg){
  mainCommsModule.respMessage(evt, arg, projects);
});
