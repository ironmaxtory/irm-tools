<template lang="html">
  <modal :modalShowed="modalShowed">
    <modal-dialog slot="modalDialog" :width="550" :height="400">
      <!-- modalDialogHeader -->
      <span slot="modalDialogHeader">选项配置</span>

      <!-- modalDialogBody -->
      <div class="modal-dialog-bodyContainer" slot="modalDialogBody">
        <div class="modal-dialog-body">
          <div class="modal-dialog-body-selContainer">
            <ul class="modal-dialog-body-sel">
              <li class="sel-item" :class="{'sel-item-active':(selItemActiveIndex === index)}" v-for="(item, index) in sel" @click="clickSelItem(item, index)">
                <a :class="{'delete':(status===3 && (selItemActiveIndex === index))}">{{item[selKey]}}</a></li>
            </ul>
          </div>
          <div class="modal-dialog-body-info">
            <slot name="modalDialogBodyInfo"></slot>
          </div>
        </div>

        <div class="modal-dialog-toolbar">
          <div class="tools" :class="{'active':(status!==0)}">
            <i class="iconfont icon-add" :class="{'active':(status===1)}" @click="clickTools('add')"></i>
            <i class="iconfont icon-edit" :class="{'active':(status===2)}" @click="clickTools('edit')"></i>
            <i class="iconfont icon-delete" :class="{'active':(status===3)}" @click="clickTools('delete')"></i>
          </div>
          <div class="hints" :class="{'hints-show': hintsShow}">
            {{hintsInfoText}}
          </div>
        </div>
      </div>

      <!-- modalDialogFooter -->
      <div class="modal-dialog-footer" slot="modalDialogFooter">
        <button class="modal-dialog-footer-btn cancel" type="button" name="cancel" @click="clickCancel">
          <slot name="btnCancelCtn"></slot>
        </button>
        <button class="modal-dialog-footer-btn confirm" type="button" name="confirm"  @click="clickConfirm">
          <slot name="btnConfirmCtn"></slot>
        </button>
      </div>
    </modal-dialog>
  </modal>
</template>

<script>
import Vue from 'vue';
import Modal from 'COMPONENTS/modal/modal.vue';
import ModalDialog from 'COMPONENTS/modal/modalDialog.vue';

export default {
  components: {
    Modal, ModalDialog,
  },
  data () {
    return {};
  },
  props: {
    // 控制模态组件显示/隐藏
    modalShowed: {
      type: Boolean,
      default: false,
    },

    // 选项数据
    sel: {
      type: Array,
      default: [],
      required: false,
    },

    // 选项数据的键名
    selKey: {
      type: String,
      default: 'name',
      required: false,
    },

    selItemActiveIndex: {
      type: Number,
      default: 0,
    },

    // 0 - 预览模式
    // 1 - 新增模式
    // 2 - 编辑模式
    // 3 - 删除模式
    // -1 - 出错模式
    status: {
      type: Number,
      default: 0,
      required: true,
    },

    // 提示信息的内容
    hintsInfoText: {
      default: '',
      type: String,
      required: false,
    },
    // 控制提示组件信息的显示/隐藏
    hintsShow: {
      default: false,
      type: Boolean,
    },
  },
  watch: {
    /**
     * 观察数据数组长度，并且高亮选中item
     * @param  {[type]} newVal [description]
     * @param  {[type]} oldVal [description]
     * @return {[type]}        [description]
     */
    'sel.length': function (newVal, oldVal) {
      var that = this;
      Vue.nextTick((function(){
        var selItem = null;
        var selItemHeight = 0;
        return function(){
          if ((!selItemHeight) && (newVal>0)) {
            selItem = document.getElementsByClassName('sel-item')[0];
            selItemHeight = parseInt((window.getComputedStyle(selItem)).height);
          }
          var modalDialogBodySelCtnr = document.getElementsByClassName('modal-dialog-body-selContainer')[0];
          var height = parseInt((window.getComputedStyle(modalDialogBodySelCtnr)).height);
          modalDialogBodySelCtnr.scrollTop = selItemHeight*that.selItemActiveIndex;
        };
      })());
    },
  },
  methods: {
    clickCancel () {
      this.$emit('clickCancel');
    },
    clickConfirm () {
      this.$emit('clickConfirm');
    },
    clickSelItem (item, index) {
      this.$emit('clickSelItem', {
        item,
        index,
      });
    },

    // 点击工具栏工具
    clickTools (item) {
      this.$emit('clickTools', item);
    },
  },
}
</script>

<style lang="less" scoped>
@import '../../assets/styles/config.less';

/**
 * modal-dialog-body
 */
.modal-dialog-bodyContainer {
  height: 100%;
}
.modal-dialog-body {
  height: 100%;
  display: flex;
  padding-bottom: 30px;
}

/**
 * modal-dialog-body-sel
 */
.modal-dialog-body-selContainer {
  position: relative;
  width: 30%;
  height: 100%;
  color: @fontColor-light;
  background-color: @assist-color !important;
  overflow: auto;
}
.modal-dialog-body-sel {
}
.sel-item-active {
  color: @main-color;
  background-color: darken(@assist-color, 5%);
}
.sel-item:hover {
  color: @main-color;
  background-color: darken(@assist-color, 5%);
}
.modal-dialog-body-sel .sel-item {
  border-bottom: 1px solid @border-dark-color;
  overflow: hidden;
  white-space: nowrap;
}
.modal-dialog-body-sel .sel-item a {
  display: block;
  text-align: center;
  height: 40px;
  line-height: 40px;
}
.modal-dialog-body-sel .sel-item a.delete {
  color: @alarm-color;
  text-decoration: line-through;
}
.modal-dialog-body-info {
  width: 70%;
  background-color: @background-color !important;
}

/**
 * modal-dialog-toolbar
 */
.modal-dialog-toolbar {
  width: 100%;
  display: flex;
  position: fixed;
  bottom: 40px;
  background-color: @background-color;
  color: @fontColor-light;
}
.modal-dialog-toolbar .tools {
  width: 30%;
  height: 30px;
  line-height: 30px;
  background-color: @assist-color;

  display: flex;
  text-align: center;
}
.modal-dialog-toolbar .hints {
  opacity: 0;
  width: 70%;
  height: 30px;
  line-height: 30px;
  padding-left:20px;
  color: @white-color;
  background-color: fadeout(@alarm-color, 50%);
  transition: all .5s linear;
}
.modal-dialog-toolbar .hints-show {
  opacity: 1;
}
.modal-dialog-toolbar .iconfont {
  width: 33.3333%;
}
.modal-dialog-toolbar .tools:not(.active) {
  .iconfont:hover {
    color: @main-color;
    cursor: pointer;
    background-color: darken(@assist-color, 5%);
  }
  .iconfont:active {
    color: @main-color;
    background-color: darken(@assist-color, 10%);
  }

  .iconfont.icon-delete:hover,
  .iconfont.icon-delete:active {
    color: @alarm-color;
  }
}
.modal-dialog-toolbar .tools.active {
  .iconfont.active {
    color: @main-color;
    background-color: darken(@assist-color, 10%);
  }
  .iconfont.icon-delete.active {
    color: @alarm-color;
  }
}

/**
 * .modal-dialog-footer
 */
 .modal-dialog-footer {
   width: 100%;
   height: 40px;
   display: flex;
   justify-content: space-between;
 }
.modal-dialog-footer-btn {
  width: 50%;
  height: 100%;
  font-size: @fontSize-para-title;
}
.modal-dialog-footer-btn:not(:first-child) {
  border-left: 1px solid @border-color;
}

.modal-dialog-footer-btn.confirm {
  color: @success-color;
}
.modal-dialog-footer-btn.canel {
  color: @fontColor-black;
}

.modal-dialog.modal-dialogInteractive {
  width: 550px;
  height: 400px;
}
</style>
