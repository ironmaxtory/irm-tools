<template lang="html">
  <div class="sidebar">
    <ul class="sidebar-list">
      <li class="sidebar-list-item" v-for="item in conf.sidebar">
        <a :href="item.link" :class="{active: item.active}" @click="clickSidebarItem(item, conf.sidebar)"><i class="iconfont" :class="item.icon"></i>{{item.title}}</a>
      </li>
    </ul>
  </div>
</template>

<script>
import Configuration from 'ROOT/app.config.js';
export default {
  data () {
    return {
      conf: Configuration,
    };
  },
  methods: {
    clickSidebarItem (item, arr) {
      console.log(arguments);
      arr.forEach(function(obj){
        obj.active = false;
      });
      item.active = true;
    }
  },
}
</script>

<style lang="less" scoped>
@import '../assets/styles/config.less';
.sidebar {
  position: fixed;
  z-index: 9;
  // left: 0;
  width: 168px;
  height: 100vh;
  padding-top: 60px;
  background-color: #333;
  color: @fontColor-light;
}
.sidebar-list {
  width: 100%;
  height: 100%;
}
.sidebar-list-item:first-child {
  border-top: 2px solid @main-color;
}
.sidebar-list-item > a {
  display: inline-block;
  width: 100%;
  height: 45px;
  line-height: 45px;
  font-size: @fontSize-para-title;
  padding-left: 20px;
}
.sidebar-list-item > a:hover,
.sidebar-list-item > a.active {
  color: @main-color;
  background-color: darken(@assist-color, 5%);
}
.sidebar-list-item > a:active {
  background-color: darken(@assist-color, 10%);
}
.sidebar-list-item .iconfont {
  margin-right: 10px;
}
</style>
