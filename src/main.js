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

/* router 配置
*/
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
if(!PRODUCTION){
  // axios.defaults.baseURL = 'http://localhost:8080/mysql_project/test-api/';
}
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


var vm = new Vue({
  router,
  components: {
    Modal, Dialogx,
  },
  data: {
    showModal: false,
    dialogxMsg: '',
    cancelBtnShowed: true,
    confirmBtnShowed: true,

    appNewVerison: '',
  },
  mounted () {
    var that = this;
    // 检查版本更新
    axios.get('https://api.github.com/repos/ironmaxtory/irm-tools-dist/tags')
      .then(function (response) {
        var rsp = response.data;
        var currentVersion;
        if (rsp.length <= 0) { return; }
        currentVersion = 'v'+ipcRenderer.sendSync('syncAsked', 'AppVersion');
        var newVersion = rsp[0].name;
        if (currentVersion >= newVersion) {
          // not the newest version
          that.showModal = true;
          that.dialogxMsg = `新版本 ${newVersion} 现可用，是否去下载？`;
          that.appNewVerison = newVersion;
        }
      })
      .catch(function (error) {
        console.log(error);
      });
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
  methods: {
    dialogxCancelBtnClicked () {
      this.showModal = false;
    },
    dialogxConfirmBtnClicked () {
      this.showModal = false;
      // shell.openExternal(Configuration.linkUrl.GHIRMToolsReleasesUrl);
      ipcRenderer.sendSync('syncAsked', {name: 'UpdateApp', version: this.appNewVerison});
      // download('ironmaxtory/irm-tools-dist', path.resolve(__dirname, '../.tmp_update'), { clone: false }, function (err) {
      //   console.log('下载完成');
      // });
    },
  },
}).$mount('#root');
