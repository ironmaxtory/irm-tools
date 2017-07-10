/* 引入css文件
*/
import 'STYLES/base.less';
import 'STYLES/common.less';

/* 引入Vue相关资源
*/
import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import axios from 'axios';
import {ipcRenderer, shell} from 'electron'; // 用于渲染进行向主进程通信
import Configuration from 'ROOT/app.config.js';

// 引入组件
import Modal from 'COMPONENTS/modal/modal.vue';
import Dialogx from 'COMPONENTS/dialog/dialogx.vue';

const exec = require('child_process').exec;

var Remote = require('electron').remote;
var Menu = Remote.Menu;

/* 载入Vue插件
*/
Vue.use(Vuex);
Vue.use(VueRouter);


/**
 * 引入组件
 *   i.e. import Myheader from './components/header.vue';
 */

/* router 配置 */
import routes from './router.js';
//创建路由实例，传入配置参数
var router = new VueRouter({
  // mode: 'history',
  routes
});
router.beforeEach((to, from, next) => {
  next();
});
router.afterEach((to, from, next) => {
});

window.onkeydown = (function(){
  const F12 = 123;
  var devToolsShowed = false;
  return function(e){
    if (!!e) {
      switch (e.keyCode) {
        case F12:
          ipcRenderer.sendSync('syncAsked', 'ToggleDevTools');
          break;
        default:
      }
    }
  }
})();

/**
 * http 配置
 */
// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// 当后台代码运行环境发生变化后，只需要修改baseURL即可
// if(!PRODUCTION){
//   axios.defaults.baseURL = 'http://localhost:8080/mysql_project/test-api/';
// }
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


var vm = new Vue({
  router,
  components: {
    Modal, Dialogx,
  },
  data: {
    GHApiDistTagsUrl: Configuration.linkUrl.GHApiDistTagsUrl,
    GHDistReleasesUrl: Configuration.linkUrl.GHDistReleasesUrl,

    showModal: false,
    dialogxMsg: '',
    cancelBtnShowed: true,
    confirmBtnShowed: true,

    appNewVerison: '',
  },
  mounted () {
    this.setMenu();
    this.checkNodeModules();
  },
  methods: {
    checkNodeModules () {
      var that = this;
      that.dialogxMsg = '正在检查安装...';
      that.showModal = true;

      var prms1 = new Promise(function(resolve, reject){
        exec('cnpm list yyy', function(err, stdout, stderr){
          if (err) {
            that.dialogxMsg = '正在安装依赖';
            that.showModal = true;
            resolve({ success: false, name: 'yyy', type: 'g', });
          } else {
            resolve({ success: true, name: 'yyy', type: 'g', });
          }
        });
      });
      var prms2 = new Promise(function(resolve, reject){
        exec('cnpm list xxx', function(err, stdout, stderr){
          if (err) {
            that.dialogxMsg = '正在安装依赖';
            that.showModal = true;
            resolve({ success: false, name: 'xxx', type: 'g', });
          } else {
            resolve({ success: true, name: 'xxx', type: 'g', });
          }
        });
      });

      Promise.all([prms1, prms2]).then(function(){
        var len = arguments.length;
        var success = true;
        for (var i=0;i<len;i++) {
          success &= argu;
        }
      }).catch(function(){
        console.log(arguments);
      });


      // output.stdout.on('data', (data) => {
      //   console.log(data);
      // });
      // output.stderr.on('data', (data) => {
      //   console.log(data);
      // });
      // output.on('message', (date)=>{
      //   console.log(data);
      // });
      // output.on('close', (data)=>{
      //   console.log(data);
      // });
    },
    setMenu () {
      // 设置应用界面菜单栏
      var confs = Configuration.appMenuConf;
      confs.forEach(function(item, index){
        switch (item.label) {
          case 'About':
            item.click = function(item, focusedWindow){
              router.push('/about');
            }
            break;
          default:
        }
      });
      var mainMenu = Menu.buildFromTemplate(Configuration.appMenuConf);
          Menu.setApplicationMenu(mainMenu);
    },
    checkUpdate () {
      var that = this;
      // 检查版本更新
      axios.get(this.GHApiDistTagsUrl)
        .then(function (response) {
          var rsp = response.data;
          var currentVersion;
          if (rsp.length <= 0) { return; }
          currentVersion = 'v'+ipcRenderer.sendSync('syncAsked', 'AppVersion');
          var newVersion = rsp[0].name;
          console.log(currentVersion);
          console.log(newVersion);
          if (currentVersion < newVersion) {
            // not the newest version
            that.dialogxMsg = `新版本 ${newVersion} 现可用，是否去下载？`;
            that.appNewVerison = newVersion;
            that.showModal = true;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    dialogxCancelBtnClicked () {
      this.showModal = false;
    },
    dialogxConfirmBtnClicked () {
      this.showModal = false;
      shell.openExternal(Configuration.linkUrl.GHDistReleasesUrl);
      ipcRenderer.sendSync('syncAsked', {name: 'UpdateApp', version: this.appNewVerison});
      // download('ironmaxtory/irm-tools-dist', path.resolve(__dirname, '../.tmp_update'), { clone: false }, function (err) {
      //   console.log('下载完成');
      // });
    },
  },
}).$mount('#root');
