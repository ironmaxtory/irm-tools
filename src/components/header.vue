<template lang="html">
  <header class="header">
    <div class="header-logo"> IRM·Toolization </div>
    <div class="header-bar">
      <img class="header-bar-avatar" :src="ipengoo" />
    </div>
  </header>
</template>

<script>
import avatar from 'IMAGES/avatar.jpg';
import ipengoo from 'IMAGES/ipengoo.png';
export default {
  data () {
    return {
      avatar,
      ipengoo
    };
  },
  props: {
  }
}
</script>

<style lang="less" scoped>
@import '../assets/styles/config.less';
.header {
  position: fixed;
  z-index: 10;
  width: 800px;
  height: 60px;
  line-height: 60px;
  padding: 0 10px;
  background-color: @assist-color;
  color: @main-color;
}
.header-logo {
  font-size: 24px;
  float: left;
}
.header-bar {
  float: right;
  overflow: hidden;
  height: 100%;
}
.header-bar-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid @main-color;
  vertical-align: middle;
}
</style>
