<template lang="html">
  <div class="infoConatiner" v-if="infoShowed">
    <div class="row"><span class="col info-key">本实例名称</span>
      <input type="text" class="col info-value" :disabled="infoEditDisabled" v-model.trim="info.exampleName"
        @input="infoModified('exampleName', info.exampleName)"/></div>
    <div class="row"><span class="col info-key">工程根目录</span>
      <input type="text" class="col info-value" :disabled="infoEditDisabled" v-model.trim="info.rootpath"
        @input="infoModified('rootpath', info.rootpath)"/></div>
    <div class="row"><span class="col info-key">模板根目录</span>
      <input type="text" class="col info-value" :disabled="infoEditDisabled" v-model.trim="info.templatepath"
        @input="infoModified('templatepath', info.templatepath)"/></div>
    <div class="row"><span class="col info-key">样式根目录</span>
      <input type="text" class="col info-value" :disabled="infoEditDisabled" v-model.trim="info.stylepath"
        @input="infoModified('stylepath', info.stylepath)"/></div>
    <div class="row"><span class="col info-key">脚本根目录</span>
      <input type="text" class="col info-value" :disabled="infoEditDisabled" v-model.trim="info.scriptpath"
        @input="infoModified('scriptpath', info.scriptpath)"/></div>
  </div>
</template>

<script>
export default {
  data () {
    return {};
  },
  computed: {
    infoShowed () {
      // return true;
      return ((!this.infoEditDisabled) || (!!this.info.exampleName) || (!!this.info.rootpath) || (!!this.info.templatepath) || (!!this.info.stylepath) || (!!this.info.scriptpath));
    }
  },
  props: {
    // 数据主体对象
    info: {
      type: Object,
      default: {},
    },

    // 输入框编辑状态
    infoEditDisabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    // 数据被修改，上报事件
    infoModified (key, val) {
      this.$emit('infoModified', {
        key: key,
        val: val,
      });
    },
  },
}
</script>

<style lang="less" scoped>
@import '../assets/styles/config.less';

.infoConatiner {
  padding: 10px;
  font-size: 16px;
}
.row {
  height: 28px;
  line-height: 28px;
}
.info-key {
  margin-right: 20px;
}
.info-value {
  width: 250px;
  font-size: 16px;
}

</style>
