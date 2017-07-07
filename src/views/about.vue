<template lang="html">
  <div class="about">
    <!-- about-header -->
    <div class="about-header">
      <img class="about-header-logo" :src="ipengoo" alt="">
      <h1>IRM-TOOLS</h1>
    </div>

    <!-- about-sysInfo -->
    <div class="about-sysInfo">
      <h2 class="about-sysInfoItem">AppVersion: {{sysInfo.appVersion}}</h2>
      <h3 class="about-sysInfoItem">SysPlatform: {{sysInfo.platform}}</h3>
      <h3 class="about-sysInfoItem">SysArch: {{sysInfo.arch}}</h3>
    </div>

    <!-- about-update -->
    <div class="about-update">
      <button class="checkUpdateBtn" type="button" name="button" @click="clickCUBtn">
        <span v-show="CUBtn.status===0">Check Update</span>
        <span v-show="CUBtn.status===1"><i class="iconfont icon-loading"></i>Checking ...</span>
        <span v-show="CUBtn.status===2"><i class="iconfont icon-check"></i>Already the newest version!</span>
        <span v-show="CUBtn.status===3"><i class="iconfont icon-cute"></i>The newest version {{newVersion}} avaliable!</span>
        <span v-show="CUBtn.status===-1"><i class="iconfont icon-warning"></i>Check Failed!</span>
      </button>
    </div>

    <!-- about-footer -->
    <div class="about-footer">
      <!-- 编写作者信息 -->
      <p><i class="iconfont icon-code"></i>
        With
        <i class="iconfont icon-heart"></i>
        By
        <i class="iconfont icon-ironman"></i></p>

      <!-- 作者github -->
      <p><i class="iconfont icon-github"></i>&emsp;
        <a class="link" href="javascript:;" @click="skipToGithubPage(GHAuthorUrl)">{{GHAuthorUrl}}</a></p>
      <p><i class="iconfont icon-repo"></i>&emsp;
        <a class="link" href="javascript:;" @click="skipToGithubPage(GHIRMToolsReleasesUrl)">{{GHIRMToolsReleasesUrl}}</a></p>
    </div>

    <div class="about-bottom">
       <router-link to="/home"><i class="iconfont icon-back"></i> 返回主页</router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import {ipcRenderer, shell} from 'electron'; // 用于渲染进行向主进程通信
import ipengoo from 'IMAGES/ipengoo.png';
import Configuration from 'ROOT/app.config.js';


export default {
  data () {
    return {
      GHAuthorUrl: Configuration.linkUrl.GHAuthorUrl,
      GHIRMToolsReleasesUrl: Configuration.linkUrl.GHIRMToolsReleasesUrl,

      ipengoo,
      sysInfo: {
        appVersion: '',
        platform: '',
        arch: '',
      },
      CUBtn: {
        text: '',
        status: '',
      },
      newVersion: '',
    };
  },
  mounted () {
    this.sysInfo.appVersion = 'v'+ipcRenderer.sendSync('syncAsked', 'AppVersion');
    this.sysInfo.platform = process.platform;
    this.sysInfo.arch = process.arch;

    this.CUBtn.status = 0;
  },
  watch: {
    'CUBtn.status': function (newVal, oldVal) {
      switch (newVal) {
        case 0:
          this.CUBtn.text = 'Check Update';
          break;
        case 1:
          this.CUBtn.text = 'Checking...';
          break;
        default:
          break;
      }
    },
  },
  methods: {
    skipToGithubPage (url) {
      shell.openExternal(url);
    },
    clickCUBtn () {
      var that = this;
      switch (this.CUBtn.status) {
        case 0:
        this.CUBtn.status = 1;
        axios.get('https://api.github.com/repos/ironmaxtory/irm-tools/tags')
          .then(function (response) {
            var rsp = response.data;
            var newVersion = rsp[0].name;
            if (that.sysInfo.appVersion === newVersion) {
              // the newest version
              that.CUBtn.status = 2;
            } else {
              // not the newest version
              that.newVersion = newVersion;
              that.CUBtn.status = 3;
            }
            console.log(rsp);
          })
          .catch(function (error) {
            console.log(error);
          });
          break;
        case 1:
          break;
        case 3:
          shell.openExternal(this.GHIRMToolsReleasesUrl);
          break;
        default:

      }
    },
  },
}
</script>

<style lang="less" scoped>
@import '../assets/styles/config.less';

@keyframes keeproatating {
  0% {transform: rotate(0deg);}
  100% {transform: rotate(360deg);}
}

.checkUpdateBtn {
  min-width: 140px;
  height: 42px;
  line-height: 42px;
  padding: 0 10px;
  border-radius: 5px;
  border: 2px solid @black-color;
  background-color: @main-color;
  font-size: 15px;
  font-weight: bold;
  // color:@white-color;
}
.checkUpdateBtn:hover {
  background-color: darken(@main-color, 5%);
}
.checkUpdateBtn .iconfont {
  display: inline-block;
  margin-right: 10px;
}
.icon-loading {
  transform-origin: center;
  animation: keeproatating 1s linear infinite;
}

.about {
  padding: 30px 40px 0;
  height: 100vh;
  // background-color: @section-background-color;
  background-color: lighten(@assist-color, 5%);
  color: @white-color;
}
.about-header {
  text-align: center;
  margin-bottom: 50px;
  h1 {
    font-size: @fontSize-imp-title;
  }
}
.about-header-logo {
  width: 80px;
  height: 80px;
}

.about-sysInfo {
  margin-bottom: 10px;
  text-align: center;
}
.about-sysInfoItem {
  line-height: 24px;
}

.about-update {
  margin-bottom: 80px;
  text-align: center;
}

.about-footer {
  text-align: center;
  font-size: @fontSize-assist-text;

  > p {
    margin-bottom: 10px;
  }
}

.about-bottom {
  position: fixed;
  bottom: 20px;
  height: 24px;
  line-height: 24px;
}
</style>
