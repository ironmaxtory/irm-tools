<template lang="html">
  <div class="autoreload">
    <!-- header -->
    <header>
      <h1 class="autoreload-title"> Auto Reload </h1>
      <span class="autoreload-index" v-if="!!exampleName"> - {{exampleName}}</span>
      <span class="autoreload-status" v-show="exampleStatus===2"><i class="label label-main">正在启动</i></span>
      <span class="autoreload-status" v-show="exampleStatus===1"><i class="label label-success">运行正常</i></span>
      <span class="autoreload-status" v-show="exampleStatus===-1"><i class="label label-alarm">运行出错</i></span>
      <span class="autoreload-status" v-show="exampleStatus===0"><i class="label label-disabled">尚未运行</i></span>
    </header>

    <!-- content -->
    <div class="autoreload-content">
      <div class="autoreload-form">
        <div class="form-row">
          <label for="exampleName"> 本实例名称 </label>
          <input id="exampleName" name="exampleName" type="text" value="" :disabled="exampleStatus!=0" v-model.trim="exampleName" placeholder="请输入本实例名称">
          <span class="form-hint" v-show="valiResult.exampleNameError">* 请输入有效的本实例名称</span>
        </div>
        <div class="form-row">
          <label for="rootpath"> 工程根目录 </label>
          <input id="rootpath" name="rootpath" type="text" value="" :disabled="exampleStatus!=0" v-model.trim="rootpath" placeholder="请输入工程根目录">
          <span class="form-hint" v-show="valiResult.rootpathError">* 请输入有效的工程根目录</span>
        </div>
        <div class="form-row">
          <label for="templatepath"> 模板根目录 </label>
          <input id="templatepath" name="templatepath" type="text" value="" :disabled="exampleStatus!=0" v-model.trim="templatepath" placeholder="请输入模板根目录（不填默认为工程根目录）">
          <span class="form-hint" v-show="valiResult.templatepathError">* 请输入有效的模板根目录</span>
        </div>
        <div class="form-row">
          <label for="stylepath"> 样式根目录 </label>
          <input id="stylepath" name="stylepath" type="text" value="" :disabled="exampleStatus!=0" v-model.trim="stylepath" placeholder="请输入样式根目录（不填默认为工程根目录）">
          <span class="form-hint" v-show="valiResult.stylepathError">* 请输入有效的样式根目录</span>
        </div>
        <div class="form-row">
          <label for="scriptpath"> 脚本根目录 </label>
          <input id="scriptpath" name="scriptpath" type="text" value="" :disabled="exampleStatus!=0" v-model.trim="scriptpath" placeholder="请输入脚本根目录（不填默认为工程根目录）">
          <span class="form-hint" v-show="valiResult.scriptpathError">* 请输入有效的脚本根目录</span>
        </div>
        <div class="form-row">
          <button class="btn btn-normal" :class="{'btn-disabled':exampleStatus==0, 'btn-default':exampleStatus!=0}" type="button" name="btn-stop" @click="stopProject">停止</button>
          <button class="btn btn-normal" :class="{'btn-disabled':exampleStatus!=0, 'btn-default':exampleStatus==0}" type="button" name="btn-start" @click="startProject">运行</button>
          <button class="btn btn-normal" :class="{'btn-disabled':exampleStatus!=0, 'btn-default':exampleStatus==0}" type="button" name="btn-start" @click="openConf">打开配置</button>
          <!-- <button class="btn btn-normal" :class="{'btn-disabled':exampleStatus!=0, 'btn-default':exampleStatus==0}" type="button" name="btn-start" @click="saveConf">保存配置</button> -->
          <button class="btn btn-normal" :class="{'btn-disabled':exampleStatus==0, 'btn-default':exampleStatus!=0}" type="button" name="btn-start" @click="saveConf">保存配置</button>
        </div>
      </div>
    </div>

    <!-- spyer -->
    <div class="autoreload-spyer">
      <div class="autoreload-spyer-title"> 终端监控情况： </div>
      <div class="autoreload-spyer-displayer" v-html="spyerOutput"></div>
    </div>

    <toast :show="showToast" :type="toastType" :text="toastText"></toast>

    <modal-interactive :modal-showed="showModal" :sel="autoreloadConfs" sel-key="exampleName"
      :sel-item-active-index="modalBodyInfoObjIndex" :status="modalStatus"
      :hintsShow="modalHintsShow" :hintsInfoText="modalHintsInfoText"
      @clickCancel="modalCancelTypeClicked"
      @clickConfirm="modalConfirmTypeClicked"
      @clickTools="modalToolsClicked"
      @clickSelItem="modalSelItemClicked">
      <!-- group 1 -->
      <i v-show="modalStatus!==0" class="iconfont icon-cancel" slot="btnCancelCtn"></i>
      <i v-show="modalStatus!==0" class="iconfont icon-confirm" slot="btnConfirmCtn"></i>
      <!-- group 2 -->
      <span v-show="modalStatus===0" slot="btnCancelCtn">返回</span>
      <span v-show="modalStatus===0 && (!!modalModifiedStatus)" slot="btnConfirmCtn">保存</span>
      <span v-show="modalStatus===0 && (!modalModifiedStatus)" slot="btnConfirmCtn">应用</span>
      <autoreload-info-comp slot="modalDialogBodyInfo" :info.sync="modalBodyInfoObj"
        :infoEditDisabled="((modalStatus!==1) && (modalStatus!==2))" @infoModified="modalInfoModified"></autoreload-info-comp>
    </modal-interactive>

  </div>
</template>

<script>
import Vue from 'vue';
import AutoreloadInfoComp from 'COMPONENTS/autoreloadInfoComp.vue';
import ModalInteractive from 'COMPONENTS/modal/modalInteractive.vue';
import Toast from 'COMPONENTS/toast/toast.vue';
import {ipcRenderer} from 'electron'; // 用于渲染进行向主进程通信
import BuildFiles from 'BUILD/config/webpack.buildfile.config.js';

const fs = require('fs'),
  path = require('path'),
  chalk = require('chalk'),
  childProcess = require('child_process'),
  spawn = require('child_process').spawn,
  exec = require('child_process').exec;
const download = require('download-git-repo');

const platform = process.platform;

const MS_ADD = 1;
const MS_EDIT = 2;
const MS_DELETE = 3;
const MS_PREVIEW = 0;

var appPath = ipcRenderer.sendSync('syncAsked', 'AppPath');
var saveConfPath = path.resolve(appPath, '.ApplicationConf');
var autoreloadConfPath = path.resolve(saveConfPath, 'autoreload.config.json');
var autoreloadAppliedPath = path.resolve(saveConfPath, 'autoreload.applied.json');
var spyerDisplayer;


function ConfProject () {
  this.exampleName = '新建实例';
  this.rootpath = '';
  this.templatepath = '';
  this.stylepath = '';
  this.scriptpath = '';
  // this.active = false;
}

export default {
  components: {
    ModalInteractive, AutoreloadInfoComp,
    Toast,
  },
  computed: {
  },
  data () {
    return {
      autoreloadConfsStr: '',
      autoreloadConfs: [],
      showModal: false,
      modalStatus: 0,
      modalBodyInfoObjIndex: 0,
      modalBodyInfoObjStr: '',
      modalBodyInfoObj: {
        exampleName: '',
        rootpath: '',
        templatepath: '',
        stylepath: '',
        scriptpath: '',
      },
      modalHintsShow: false,
      modalHintsInfoText: '',
      modalInfoChanged: false,
      modalInfoChangeChecked: false,
      modalModifiedStatus: false,

      showToast: false,
      toastText: '',
      toastType: '',

      exampleStatus: 0,
      exampleName: '',
      rootpath: '',
      templatepath: '',
      stylepath: '',
      scriptpath: '',
      spyerOutput: '',
      pid: '',
      valiResult: {
        exampleNameError: false,
        rootpathError: false,
        templatepathError: false,
        stylepathError: false,
        scriptpathError: false,
      },
    }
  },
  mounted () {
    spyerDisplayer = document.getElementsByClassName('autoreload-spyer-displayer')[0];
    this.loadAppliedConf();
  },
  watch: {
    modalStatus (newVal, oldVal) {
      console.log(newVal);
      switch (newVal) {
        case MS_ADD:
          var lastIndex;
          this.autoreloadConfsStr = JSON.stringify(this.autoreloadConfs);
          this.autoreloadConfs.push(new ConfProject());
          lastIndex = this.autoreloadConfs.length-1;
          this.modalSelItemClicked({index:lastIndex, item:this.autoreloadConfs[lastIndex]});
          break;
        case MS_EDIT:
          this.autoreloadConfsStr = JSON.stringify(this.autoreloadConfs);
          this.modalBodyInfoObjStr = JSON.stringify(this.modalBodyInfoObj);
          break;
        case MS_DELETE:
          this.autoreloadConfsStr = JSON.stringify(this.autoreloadConfs);
          this.modalBodyInfoObjStr = JSON.stringify(this.modalBodyInfoObj);
          break;
        default:
          break;
      }
    }
  },
  methods: {
    /**
     * 接收到模态框组件cancel按钮的点击上报事件后
     * @return {[type]} [description]
     */
    modalCancelTypeClicked () {
      // 首先判断所处的状态
      if (this.modalStatus === MS_PREVIEW) {
        this.showModal = false;
        return ;
      }
      switch (this.modalStatus) {
        case MS_ADD:
          this.autoreloadConfs.pop();
          if (!!this.autoreloadConfs.length) {
            this.modalBodyInfoObj = this.autoreloadConfs[0];
          } else {
            this.modalBodyInfoObj = {};
          }
          this.modalBodyInfoObjIndex = 0;
          break;
        case MS_EDIT:
          // 当配置有被改动时
          if (this.modalInfoChanged) {
            // 撤销改动
            var obj = JSON.parse(this.modalBodyInfoObjStr);
            for (var key in obj) {
              this.modalBodyInfoObj[key] = obj[key];
            }
          }
          break;
        case MS_DELETE:
          // nothing to do
          break;
        default:
      }
      this.modalStatus = MS_PREVIEW; // 恢复预览模式
      this.checkIsModifiedConfs();
    },
    /**
     * 接收到模态框组件confirm类按钮的点击上报事件后
     * @return {[type]} [description]
     */
    modalConfirmTypeClicked () {
      if (this.modalStatus === MS_PREVIEW) {
        if (!!this.modalModifiedStatus) {
          this.modalSaveClicked();
        } else {
          this.modalApplyClicked();
        }
      } else {
        this.modalConfirmClicked();
      }
    },
    /**
     * 接收到selitem被点击的上报事件后，处理相关逻辑
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    modalSelItemClicked (data) {
      console.log(data);
      // 当不是预览状态或者本来就被激活着的时候，不再往下执行
      if ((this.modalStatus !== 0) && (this.modalStatus !== 1) || ((this.modalBodyInfoObjIndex === data.index) && ((this.modalBodyInfoObjIndex !== 0)))) return;
      this.modalBodyInfoObj = data.item;
      this.modalBodyInfoObjIndex = data.index;
      console.log('全部执行完毕');
      // this.autoreloadConfs.forEach(function(item, index){
      //   item.active = false;
      // });
      // this.autoreloadConfs[data.index]['active'] = true;
    },
    /**
     * 接收到信息被修改的上报事件后，检查配置是否改变
     * @param  {[type]} modifiedData [description]
     * @return {[type]}              [description]
     */
    modalInfoModified (modifiedData) {
      var str = JSON.stringify(this.modalBodyInfoObj);
      if (str !== this.modalBodyInfoObjStr) {
        this.modalInfoChanged = true;
        console.log('你修改了单个配置！');
      } else {
        this.modalInfoChanged = false;
        console.log('你没有修改单个配置！');
      }
    },
    /**
     * 接收到工具栏按钮被触发的上报事件后，改变组件的相应状态
     * @param  {[type]} toolName [description]
     * @return {[type]}          [description]
     */
    modalToolsClicked (toolName) {
      if (this.modalStatus !== 0) return;
      switch (toolName) {
        case 'add':
          this.modalStatus = (this.modalStatus !== 1)?1:0;
          break;
        case 'edit':
          this.modalStatus = (this.modalStatus !== 2)?2:0;
          this.modalInfoChanged = false; //复位数据的修改状态
          break;
        case 'delete':
          this.modalStatus = (this.modalStatus !== 3)?3:0;
          break;
      }
    },


    /**
     * 触发暂存配置函数
     * @return {[type]} [description]
     */
    modalConfirmClicked () {
      switch (this.modalStatus) {
        case MS_ADD:
          if (!(this.modalInfoChangeChecked = this.checkModifiedConf())) {
            this.hintsModalInfo('已存在相同名称的配置');
            return ;
          }
          break;
        case MS_EDIT:
          // 若没有改变或者有改变而且校验成功，则直接退出该模式
          if (!this.modalInfoChanged || (this.modalInfoChangeChecked = this.checkModifiedConf())) {
            break;
          } else {
            this.hintsModalInfo('已存在相同名称的配置');
            return ;
          }
          break;
        case MS_DELETE:
          console.log(`要删除第${this.modalBodyInfoObjIndex}项配置`);
          this.autoreloadConfs.splice(this.modalBodyInfoObjIndex, 1);
          if (!!this.autoreloadConfs.length) {
            this.modalBodyInfoObj = this.autoreloadConfs[0];
            this.modalBodyInfoObjIndex = 0;
            // this.modalBodyInfoObj.active = true;
          } else {
            this.modalBodyInfoObj = {};
          }
          break;
        default:
      }
      this.modalStatus = MS_PREVIEW; // 恢复预览模式
      this.checkIsModifiedConfs();
    },
    /**
     * 触发保存到本地配置文件函数
     * @return {[type]} [description]
     */
    modalSaveClicked () {
      var str = JSON.stringify(this.autoreloadConfs);
      console.log(str);
      console.log(this.autoreloadConfsStr);
      if (str !== this.autoreloadConfsStr) {
        this.overideConfToFiles(autoreloadConfPath, this.autoreloadConfs);
      }
      this.modalModifiedStatus = false;
      this.hintsToast('success', '保存成功');
    },
    /**
     * 触发应用当前配置函数
     * @return {[type]} [description]
     */
    modalApplyClicked () {
      for (var key in this.modalBodyInfoObj) {
        this[key] = this.modalBodyInfoObj[key];
      }
      this.showModal = false;
      this.overideConfToFiles(autoreloadAppliedPath, this.modalBodyInfoObj);
    },
    /**
     * 触发开始当前autoreload项目
     * @return {[type]} [description]
     */
    startProject () {
      if ((this.exampleStatus === 2) || (this.exampleStatus === 1) || (this.valiFormError())) {return ;}
      this.exampleStatus = 2;

      var rootpath = path.normalize(this.rootpath);
      var templatepath = path.normalize(this.templatepath);
      var stylepath = path.normalize(this.stylepath);
      var scriptpath = path.normalize(this.scriptpath);

      var reloadOptions = {
        rootpath: this.rootpath,
        templatepath: this.templatepath,
        stylepath: this.stylepath,
        scriptpath: this.scriptpath,
      };

      this.overideConfToFiles(autoreloadAppliedPath, {
        exampleName: this.exampleName,
        rootpath: this.rootpath,
        templatepath: this.templatepath,
        stylepath: this.stylepath,
        scriptpath: this.scriptpath,
      });
      this.startReloadProject(reloadOptions);
    },
    /**
     * 触发停止当前autoreload项目
     * @return {[type]} [description]
     */
    stopProject () {
      var that = this;
      if (this.exampleStatus === 0) {return ;}
      if (platform === 'win32') {
        exec('taskkill /pid ' + this.pid + ' /T /F');
      } else {
        exec(`kill ${this.pid}`, function(){
        });
      }
      // 告诉主进程已经停止子进程
      ipcRenderer.sendSync('syncAsked', {
        name: 'autoreloadStop',
        pid: this.pid,
      });
      that.exampleStatus = 0;
    },
    ensureConfFileExists () {
      var fileWriteStream = null;

      if (!fs.existsSync(saveConfPath)) {
        console.log('不存在配置文件夹，正在准备创建...');
        fs.mkdirSync(saveConfPath);
      }
      console.log('已存在配置文件夹，正在检查配置文件...');

      if (!fs.existsSync(autoreloadConfPath)) {
        console.log('不存在配置文件，正在准备创建...');
        fileWriteStream = fs.createWriteStream(autoreloadConfPath, {
          flags: 'w',
          defaultEncoding: 'utf8',
          mode: 0o777,
          autoClose: true
        });
        fileWriteStream.write(JSON.stringify([]));
        fileWriteStream.end();
      }
      console.log('已存在配置文件，正在准备写入...');
    },
    /**
     * 触发打开autoreload配置项
     * @return {[type]} [description]
     */
    openConf () {
      var that = this;

      this.ensureConfFileExists();
      fs.readFile(autoreloadConfPath, {encoding:'utf8'}, function(err, data){
        var readData = JSON.parse(data);
        that.autoreloadConfs = readData;
        if (!!readData.length) {
          that.modalBodyInfoObj = readData[0];
          that.modalBodyInfoObjIndex = 0;
        }
        that.showModal = true;
      });
    },
    /**
     * 触发保存当前所应用的配置项到本地配置文件
     * @return {[type]} [description]
     */
    saveConf () {
      var that = this;
      var fileWriteStream = null;
      var readData = '';
      var conf = {
        exampleName: this.exampleName,
        rootpath: this.rootpath,
        templatepath: this.templatepath,
        stylepath: this.stylepath,
        scriptpath: this.scriptpath,
      };

      this.ensureConfFileExists();
      fs.readFile(autoreloadConfPath, {encoding:'utf8'}, function(err, data){
        if (data.indexOf(conf.exampleName) !== -1) {
          that.hintsToast('warn', '已存在相同名称的配置，拒绝保存');
          console.log('已存在相同名称的配置，拒绝保存');
          return ;
        }
        readData = JSON.parse(data);
        readData.push(conf);

        that.overideConfToFiles(autoreloadConfPath, readData);
      });
    },
    /**
     * 触发以传入的配置项，重写本地配置文件 | 暴力保存方式
     * @return {[type]} [description]
     */
    overideConfToFiles (filepath, readData) {
      var fileWriteStream = fs.createWriteStream(filepath, {
        flags: 'w',
        defaultEncoding: 'utf8',
        mode: 0o777,
        autoClose: true
      });
      fileWriteStream.write(JSON.stringify(readData));
      fileWriteStream.end();
    },
    /**
     * 加载最后一次应用过的配置项，提高用户体验
     * @return {[type]} [description]
     */
    loadAppliedConf () {
      var that = this;
      var fileWriteStream = null;
      if (!fs.existsSync(autoreloadAppliedPath)) {
        console.log('不存在应用配置文件，正在准备创建...');
        fileWriteStream = fs.createWriteStream(autoreloadAppliedPath, {
          flags: 'w',
          defaultEncoding: 'utf8',
          mode: 0o777,
          autoClose: true
        });
        fileWriteStream.write(JSON.stringify({}));
        fileWriteStream.end();
        return false;
      } else {
        console.log('存在应用配置文件，正在准备读取...');
        fs.readFile(autoreloadAppliedPath, {encoding:'utf8'}, function(err, data){
          var readData = null;
          readData = JSON.parse(data);
          if (!!readData.exampleName) {
            that.exampleName = readData.exampleName;
            that.rootpath = readData.rootpath;
            that.templatepath = readData.templatepath;
            that.stylepath = readData.stylepath;
            that.scriptpath = readData.scriptpath;
          }
        });
      }
    },
    /**
     * 检查是否修改了配置项数组
     * @return {[type]} [description]
     */
    checkIsModifiedConfs () {
      var str = JSON.stringify(this.autoreloadConfs);
      if (str !== this.autoreloadConfsStr) {
        this.modalModifiedStatus = true;
        console.log('你修改了配置数组！');
      } else {
        this.modalModifiedStatus = false;
        console.log('你没有修改配置数组！');
      }
    },
    /**
     * 检查是否修改了当个配置项
     * @return {[type]} [description]
     */
    checkIsModifiedConf () {
      var str = JSON.stringify(this.modalBodyInfoObj);
      if (str !== this.modalBodyInfoObjStr) {
        this.modalInfoChanged = true;
        console.log('你修改了单个配置！');
      } else {
        this.modalInfoChanged = false;
        console.log('你没有修改单个配置！');
      }
    },
    /**
     * 检查被修改的配置项数组是否符合规则
     * @return {[type]} [description]
     */
    checkModifiedConf () {
      var exampleNameReg = new RegExp(this.modalBodyInfoObj['exampleName'], 'g');
      var autoreloadConfStr = JSON.stringify(this.autoreloadConfs);
      var matchNum = (autoreloadConfStr.match(exampleNameReg)).length;
      return (!(matchNum > 1));
    },
    /**
     * 触发模态框组件内的信息提示
     * @return {[type]} [description]
     */
    hintsModalInfo: (function(){
      var timeouter = null;
      return function(text) {
        var that = this;
        this.modalHintsInfoText = text;
        this.modalHintsShow = true;
        window.clearTimeout(timeouter);
        timeouter = window.setTimeout(function(){
          that.modalHintsInfoText = '';
          that.modalHintsShow = false;
        }, 3000);
      }
    })(),
    /**
     * 触发toast信息提示
     * @return {[type]} [description]
     */
    hintsToast: (function(){
      var timeouter = null;
      return function(type, text) {
        var that = this;
        this.toastType = type;
        this.toastText = text;
        this.showToast = true;
        window.clearTimeout(timeouter);
        timeouter = window.setTimeout(function(){
          that.toastText = '';
          that.showToast = false;
        }, 1500);
      }
    })(),
    /**
     * 表单校验函数
     * @return {[type]} [description]
     */
    valiFormError () {
      var regNotEmpty = /\S+/; // 非空正则表达式
      var result = false;
      this.valiResult.exampleNameError = (!regNotEmpty.test(this.exampleName));
      this.valiResult.rootpathError = (!regNotEmpty.test(this.rootpath));
      if (!this.valiResult.rootpathError && (this.valiResult.templatepathError = (!regNotEmpty.test(this.templatepath)))) {
        this.templatepath = this.rootpath;
      }
      if (!this.valiResult.rootpathError && (this.valiResult.stylepathError = (!regNotEmpty.test(this.stylepath)))) {
        this.stylepath = this.rootpath;
      }
      if (!this.valiResult.rootpathError && (this.valiResult.scriptpathError = (!regNotEmpty.test(this.scriptpath)))) {
        this.scriptpath = this.rootpath;
      }
      for (var key in this.valiResult) {
        result |= this.valiResult[key];
      }
      return result;
    },
    /**
     * 配置工程启动项并启动整个autoreload工程
     * @return {[type]} [description]
     */
    startReloadProject (reloadOptions) {
      var that = this;
      function refreshSpyerOutput (outputStr, type) {
        that.spyerOutput += '<div class="text-'+ type +'">'+outputStr+'</div>';
        Vue.nextTick(function(){
          spyerDisplayer.scrollTop = spyerDisplayer.scrollHeight - spyerDisplayer.offsetHeight;
        });
      }

      var pid = null;
      var reload = null;
      var timestamp = (new Date()).getTime();
      var configFile = path.resolve(appPath, `.config.${timestamp}.json`);
      var fileWriteStream = fs.createWriteStream(configFile, {
        flags: 'w',
        defaultEncoding: 'utf8',
        mode: 0o666,
        autoClose: true
      });
      fileWriteStream.write(JSON.stringify(reloadOptions));
      fileWriteStream.end();

      console.log(PRODUCTION);
      if (!PRODUCTION) {
        console.log('开发环境');
        reload = exec('gulp ' + (['--config', configFile, '--gulpfile', path.resolve(appPath, 'gulpfile.config.js')]).join(' '));
      } else {
        console.log('生产环境');
        console.log(BuildFiles.js.gulpfile);
        console.log(path.resolve(appPath, 'dist/'+BuildFiles.js.gulpfile));
        reload = exec('gulp ' + (['--config', configFile, '--gulpfile', path.resolve(appPath, 'dist/'+BuildFiles.js.gulpfile)]).join(' '));
      }
      var regRet = /(\n\r)|(\r\n)|[\r\n]/g;
      pid = reload.pid;
      this.pid = reload.pid;
      console.log(`已启动进程 pid: ${pid}`);
      // 告诉主进程已经启动子进程
      ipcRenderer.sendSync('syncAsked', {
        name: 'autoreloadStarted',
        pid: this.pid,
      });
      reload.on('message', function(){
        console.log(arguments);
      });
      reload.stdout.on('data', (data) => {
        var outputStr = '';
        console.log(data);
        if (data.indexOf('BrowserSync启动成功') !== -1) {
          this.exampleStatus = (!!this.pid)?1:0;
        }
        outputStr = `${data}`.replace(regRet, '<br/>');
        refreshSpyerOutput(outputStr, 'default');
      });
      reload.stderr.on('data', (data) => {
        var outputStr = `stderr: ${data}`.replace(regRet, '<br/>');
        refreshSpyerOutput(outputStr, 'warn');
      });
      reload.on('close', (code) => {
        var outputStr = `子进程已退出。退出码： ${code}`.replace(regRet, '<br/>');
        exec('rm -f '+configFile);
        refreshSpyerOutput(outputStr, 'alarm');
      });
      reload.on('disconnect', () => {
        console.log('已断开连接');
      });
    },
  },
}
</script>

<style lang="less" >
@import '../assets/styles/config.less';
@import '../assets/styles/components.less';

input {
  height: 18px;
  line-height: 18px;
  width: 310px;
  margin-right: 10px;
}

header {
  margin-bottom: 25px;
}
.autoreload-title {
  vertical-align: middle;
  display: inline-block;
  font-size: @fontSize-imp-title;
}
.autoreload-index {
  vertical-align: middle;
  font-size: @fontSize-emp-title;
}

.autoreload-content {
  padding: 0 15px;
  margin-bottom: 20px;
  font-size: @fontSize-para-title;
}
.autoreload-content input{
  font-size: @fontSize-para-title;
}

.btn:not(:last-child) {
  margin-right: 25px;
}

.autoreload-spyer {
  padding: 0 15px;
}
.autoreload-spyer-title {
  font-size: @fontSize-para-title;
  margin-bottom: 5px;
}
.autoreload-spyer-displayer {
  width: 100%;
  height: 400px;
  border-radius: 5px;
  background-color: @assist-color;
  padding: 15px;
  color: @fontColor-light;
  line-height: 18px;
  overflow: auto;
}

</style>
