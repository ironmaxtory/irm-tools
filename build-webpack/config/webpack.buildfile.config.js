var path = require('path');
var gulpfilepath = path.resolve('gulpfile.config.js');

module.exports = {
  js: {
    // 此语句待优化
    gulpfile: require('!file-loader?name=dist/[name].[ext]!../../gulpfile.config.js'),
    // for testing
    // gulpfile: require('!file-loader?name=[name].[ext]!'+gulpfilepath),
    // gulpfile: '!file-loader?name=[name].[ext]!'+gulpfilepath,
    // gulpfile: gulpfilepath,
  },
};
