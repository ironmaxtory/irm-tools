const electron = require('electron')
const app = electron.app
const dialog = electron.dialog;

// function createMB() {
//   dialog.showMessageBox({
//     type: 'info',
//     title: '测试消息框',
//     message: '我就测试一下消息框',
//   }, function(){
//     console.log('关闭时候调用的');
//   })
// }





// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
// require('./reload.js');



require('./main.app.js');
