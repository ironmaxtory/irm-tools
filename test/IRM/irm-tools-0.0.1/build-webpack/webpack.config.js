var path = require('path');
var Webpack = require('webpack');
var ExtractPlugin = require('extract-text-webpack-plugin');
var DefinePlugin = Webpack.DefinePlugin;

// 纯属是装B用的 - 仪表盘
// var Dashboard = require('webpack-dashboard');
// var DashboardPlugin = require('webpack-dashboard/plugin');
// var dashboard = new Dashboard();

var CONFIGURATION = require('./config/webpack.common.config');

//定义指定文件夹的路径
const ROOT_PATH = CONFIGURATION.PATH.ROOT_PATH;
const SRC_PATH = CONFIGURATION.PATH.SRC_PATH;
const DIST_PATH = CONFIGURATION.PATH.DIST_PATH;
console.log(ROOT_PATH);
var webpackConfig = {
  target: CONFIGURATION.target,
  context: ROOT_PATH,
  entry: {
    'dist/main': path.resolve(SRC_PATH, 'main.js'),
  },
  output: {
    path: DIST_PATH,
    // publicPath: 'http://localhost:5004/dist/', //模拟静态资源存放在CDN
    publicPath: '/dist/', //静态资源存放于index.html同根目录下使用，即不分开部署时使用
    filename: '[name].[hash:8].js',
    chunkFilename: "[name].[chunkhash:8].js"
  },
  devtool: 'eval-source-map',
  devServer: {
    hot: true,
    inline: true,
    historyApiFallback: false,
    disableHostCheck: true,
  },
  resolve: CONFIGURATION.resolve,
  externals: CONFIGURATION.externals,
  module: CONFIGURATION.module,
  plugins: [
    new DefinePlugin({
      PRODUCTION: false, // 现在是调试环境
    }),

    // new DashboardPlugin(dashboard.setData),
  ]
};

webpackConfig.plugins = webpackConfig.plugins.concat(CONFIGURATION.plugins.slice(0));

module.exports = webpackConfig;
