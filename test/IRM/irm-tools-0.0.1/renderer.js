// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const fs = require('fs'),
  path = require('path'),
  gulp = require('gulp'),
  chalk = require('chalk'),
  browserSync = require('browser-sync'),
  childProcess = require('child_process'),
  spawn = require('child_process').spawn,
  exec = require('child_process').exec;
const platform = process.platform;
var $ = require('jquery');
console.log($);

var startBtn = document.getElementById("reload-start");
var stopBtn = document.getElementById("reload-stop");
var rootPathInput = document.getElementById("root-path");
var templatePathInput = document.getElementById("template-path");
var stylePathInput = document.getElementById("style-path");
var scriptPathInput = document.getElementById("script-path");
var terminalOutput= document.getElementsByClassName('section-terminal-ouput')[0];
var pid = null;
var reload = null;
var running = {
  _val_: false,
};
Object.defineProperty(running, 'val', {
  get: function(){
    return this._val_;
  },
  set: function(newVal){
    this._val_ = newVal;
    if(!!newVal) {
      $(startBtn).toggleClass('btn-confirm');
      $(startBtn).toggleClass('btn-disabled');
    }
  },
  enumerable: true,
  configurable: true,
});

startBtn.addEventListener('click', function(){
  var root_path = path.normalize(rootPathInput.value);
  var template_html_path = path.resolve(templatePathInput.value, '**/*.html');
  var template_php_path = path.resolve(templatePathInput.value, '**/*.php');
  var style_path = path.resolve(stylePathInput.value, '**/*.css');
  var script_path = path.resolve(scriptPathInput.value, '**/*.js');
  startReloadProject(root_path, [template_html_path, template_php_path, style_path, script_path]);
});

stopBtn.addEventListener('click', function(){
  console.log(`正在终止进程：${pid}`);
  if (platform === 'win32') {
    childProcess.exec('taskkill /pid ' + pid + ' /T /F');
  } else {
    exec(`kill ${pid}`, function(){
      console.log(arguments);
    });
  }
});

function startReloadProject(root_path, files) {
  console.log(arguments);
  var timestamp = (new Date()).getTime();
  var configFile = `./.config.${timestamp}.json`;
  var fileWriteStream = fs.createWriteStream(configFile, {
    flags: 'w',
    defaultEncoding: 'utf8',
    mode: 0666,
    autoClose: true
  });
  fileWriteStream.write(JSON.stringify(files));
  fileWriteStream.end();

  reload = exec('gulp ' + (['--config', configFile, '--rootpath', root_path, '--gulpfile', 'gulpfile.config.js']).join(' '));
  var regRet = /(\n\r)|(\r\n)|[\r\n]/g;
  pid = reload.pid;
  console.log(`已启动进程 pid: ${pid}`);
  running.val = true;
  reload.stdout.on('data', (data) => {
    var outputStr = `${data}`.replace(regRet, '<br/>');
    console.log(outputStr);
    refreshTerminalOutput(outputStr, 'success');
  });
  reload.stderr.on('data', (data) => {
    var outputStr = `stderr: ${data}`.replace(regRet, '<br/>');
    console.log(outputStr);
    refreshTerminalOutput(outputStr, 'warning');
  });
  reload.on('close', (code) => {
    var outputStr = `子进程已退出。退出码： ${code}`.replace(regRet, '<br/>');
    exec('rm -f '+configFile);
    console.log(outputStr);
    refreshTerminalOutput(outputStr, 'alarm');
  });
  reload.on('disconnect', () => {
    console.log(arguments);
  });
}

function refreshTerminalOutput(outputStr, type) {
  terminalOutput.innerHTML += '<div class="text-'+ type +'">'+outputStr+'</div>';
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}
