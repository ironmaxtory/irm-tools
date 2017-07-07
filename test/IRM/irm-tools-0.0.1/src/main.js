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
import {ipcRenderer} from 'electron'; // 用于渲染进行向主进程通信

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

/* http 配置
*/
// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// 当后台代码运行环境发生变化后，只需要修改baseURL即可
if(!PRODUCTION){
  axios.defaults.baseURL = 'http://localhost:8080/mysql_project/test-api/';
}
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

var vm = new Vue({
  router,
  components: {
    // Myheader
  }
}).$mount('#root');
