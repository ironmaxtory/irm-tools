/**
 * gulpfile.config.js
 * 供irm-tools运行起来后调用的gulpfile配置脚本
 */


;
const fs = require('fs'),
  path = require('path'),
  gulp = require('gulp'),
  argv = require('yargs').argv,
  browserSync = require('browser-sync');

var config = require(argv.config);
var rootpath = config.rootpath;

console.log(argv);

var filesBuff = [];
for (var key in config) {
  switch (key) {
    case 'templatepath':
      filesBuff.push(path.resolve(config[key], '**/*.html'));
      filesBuff.push(path.resolve(config[key], '**/*.php'));
      break;
    case 'stylepath':
      filesBuff.push(path.resolve(config[key], '**/*.css'));
      break;
    case 'scriptpath':
      filesBuff.push(path.resolve(config[key], '**/*.js'));
      break;
  }
}

gulp.task('default', ['browser-sync'], function(){});

/***************************************************
 * browser-sync
***************************************************/
gulp.task('browser-sync', function() {
  var files = [
    {
      match: filesBuff,
      fn: function(event, file){
        console.log(`[Event: ${event}] ${file}`);
        browserSync.reload();
        // 文本信息
      },
    }
  ];
  // 官网项目监视器
  browserSync.init({
    files: files,
    host: 'www.guojj.com',
    // port: 3000,
    open: "external",
    proxy: 'http://www.guojj.com',
  }, function(){
    console.log('BrowserSync启动成功');
  });
  // browserSync.init({
  //   files: files,
  //   server: {
  //     baseDir: rootpath,
  //     directory: true,
  //   },
  // });
});
