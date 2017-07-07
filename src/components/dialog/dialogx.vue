<template lang="html">
  <div class="dialog">
    <div class="dialog-header">
      <img :src="ipengoo" alt="">
    </div>
    <div class="dialog-body">
      <div class="content" v-html="msg"></div>
    </div>
    <div class="dialog-footer">
      <button type="button" name="cancelBtn" v-if="cancelBtnShowed" @click="clickCancelBtn">取消</button>
      <button class="btnConfirm" type="button" name="confirmBtn" v-if="confirmBtnShowed" @click="clickConfirmBtn">确认</button>
    </div>
  </div>
</template>

<script>
import ipengoo from 'IMAGES/ipengoo.png';
export default {
  data () {
    return {
      ipengoo,
    };
  },
  props: {
    msg: {
      type: String,
      default: '',
      required: true,
    },
    cancelBtnShowed: {
      type: Boolean,
      default: true,
      required: true,
    },
    confirmBtnShowed: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  methods: {
    clickCancelBtn () {
      this.$emit('clickcancelbtn');
    },
    clickConfirmBtn () {
      this.$emit('clickconfirmbtn');
    },
  },
}
</script>

<style lang="less" scoped>
@import '../../assets/styles/config.less';

.dialog {
  width: 260px;
  height: 160px;
  background-color: @white-color;
  overflow: hidden;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.dialog-header {
  padding: 10px 0 0 0;
  text-align: center;
}
.dialog-header img {
  width: 30px;
  height: 30px;
}
.dialog-body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  padding: 10px;
}
.dialog-footer {
  height: 40px;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid @border-color;
}
.dialog-footer button {
  flex-grow: 1;
  height: 100%;
  text-align: center;
}
.dialog-footer .btnConfirm {
  color: @success-color;
}
.dialog-footer button:not(:first-child) {
  border-left: 1px solid @border-color;
}
</style>
