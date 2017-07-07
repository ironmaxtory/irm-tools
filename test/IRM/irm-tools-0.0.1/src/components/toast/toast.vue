<template lang="html">
  <div v-if="show" class="toast">
    <div class="toast-dialog">
      <i class="iconfont icon-check" v-show="type==='success'"></i>
      <i class="iconfont icon-info" v-show="type==='info'"></i>
      <i class="iconfont icon-warn" v-show="type==='warn'"></i>
      <p class="toast-dialog-text">{{text}}</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    };
  },
  props: {
    type: {
      type: String,
      required: false,
      default: 'info',
    },
    text: {
      type: String,
      required: false,
    },
    show: {
      type: Boolean,
      required: true,
    },
  },
}
</script>

<style lang="less" scoped>
@import '../../assets/styles/config.less';
.toast {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: @mask-glass-color;
  // background-color: @mask-color;
  z-index: 30;
}
.toast-dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150px;
  height: 150px;
  padding: 10px;
  border-radius: 6px;
  // background-color: fadeout(@main-color, 50%);
  background-color: @mask-color;
  text-align: center;
  color: @white-color;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.toast-dialog-text {
  line-height: 20px;
}
.toast-dialog .iconfont {
  display: inline-block;
  font-size:60px;
  margin: 0 0 10px;
}
</style>
