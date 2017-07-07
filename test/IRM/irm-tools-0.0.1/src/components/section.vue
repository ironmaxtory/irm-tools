<template lang="html">
  <div class="section">
    <slot></slot>
  </div>
</template>

<script>
export default {
  data () {
    return {

    };
  },
}
</script>

<style lang="less" scoped>
@import '../assets/styles/config.less';
.section {
  width: 100%;
  min-height: 100vh;
  padding: 75px 15px 0 183px;
  background-color: @section-background-color;
}
</style>
