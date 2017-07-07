<template lang="html">
  <div class="modalDialog" :style="{width:`${width}px`, height:`${height}px`}">
    <div class="modalDialog-header">
      <slot name="modalDialogHeader"></slot>
    </div>
    <div class="modalDialog-body">
      <slot name="modalDialogBody"></slot>
    </div>
    <div class="modalDialog-footer">
      <slot name="modalDialogFooter"></slot>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {};
  },
  props: {
    width: {
      type: Number,
      default: 200,
    },
    height: {
      type: Number,
      default: 200,
    },
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/styles/config.less';

.modalDialog {
  background-color: @white-color;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

.modalDialog-header {
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: @fontSize-strong-title;
}
.modalDialog-body {
  flex: 1;
  overflow: auto;
  // flex-shrink: 1;
}
.modalDialog-footer {
  height: 40px;
}

</style>
