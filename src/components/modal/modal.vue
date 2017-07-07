<template lang="html">
  <div class="modal" v-if="modalShowed">
    <div class="modal-dialog">
      <slot name="modalDialog"></slot>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {};
  },
  props: {
    // 控制模态组件显示/隐藏
    modalShowed: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="less" scoped>
@import '../../assets/styles/config.less';

.modal {
  position: fixed;
  z-index: 20;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: @mask-color;
}

.modal-dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}


</style>
