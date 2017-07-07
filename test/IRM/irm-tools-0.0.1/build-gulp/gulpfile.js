// gulpfile.js
;
const fs = require('fs'),
  path = require('path'),
  gulp = require('gulp'),
  argv = require('yargs').argv,
  chalk = require('chalk'),
  browserSync = require('browser-sync');

console.log(process.argv);
console.log(argv);

// svn根目录地址
const ROOT_PATH = path.resolve(__dirname, '../');
const SRC_PATH = path.resolve(ROOT_PATH, 'src');
const STYLE_PATH = path.resolve(SRC_PATH, 'style');

gulp.task('default', ['browser-sync'], function(){});

/***************************************************
 * browser-sync
***************************************************/
gulp.task('browser-sync', function() {
  var files = [
    {
      match: [
        path.resolve(ROOT_PATH, '**/*.html'),
        path.resolve(ROOT_PATH, '**/*.js'),
        path.resolve(STYLE_PATH, '**/*.css'),
      ],
      fn: function(event, file){
        console.log(chalk.green('[Event: '+ event +'] ') + file);
        browserSync.reload();
      },
    }
  ];
  browserSync.init({
    files: files,
    server: {
      baseDir: './',
      directory: true,
    },
    // host: 'www.guojj.com',
    // port: 3000,
    // open: "external",
    // proxy: 'http://www.guojj.com',
  });
});
