<template>
  <Modal v-model="visible" :title="title" :width="width" :closable="closable" :mask-closable="maskClosable" @input="cancel">
    <slot></slot>
    <div slot="footer">
      <div class="default-btn">
        <Button type="ghost" size="large" @click="cancel" v-if="cancelBtn">{{cancelValue}}</Button>
        <Button type="primary" size="large" :loading="loading" @click="ok" v-if="okBtn">{{okValue}}</Button>
      </div>
      <div class="assist-btn" v-if="assistValue">
        <Tooltip :content="assistTip" placement="left" :disabled="!assistTip">
          <Button type="text" size="large" @click="assist">{{assistValue}}</Button>
        </Tooltip>
      </div>
    </div>
  </Modal>
</template>

<script>
/**
 * 公共表单式模态框
 * @author lmh
 * @name app-form-modal
 * @param {Boolean} v-model - 模态框显示/隐藏
 * @param {String} title - 模态框标题
 * @param {Number|String} width - 模态框宽度
 * @param {Boolean} loading - 操作按钮loading状态
 * @param {Boolean} closable - 是否显示右上角关闭按钮
 * @param {Boolean} maskClosable - 是否允许点击遮罩层关闭
 * @param {okCallback} on-ok 确认操作回调函数
 * @param {cancelCallback} on-cancel 取消操作回调函数
 * @param {assistCallback} on-assist 辅助操作回调函数
 * @param {Boolean} okBtn - 按钮显示状态
 * @param {String} okValue - 确认按钮文字
 * @param {Boolean} cancelBtn - 按钮显示状态
 * @param {String} cancelValue - 取消按钮文字
 * @param {String} assistValue - 辅助按钮文字
 * @version 2017-06-08
 */

export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    width: {
      type: Number || String,
      default: 520,
    },
    loading: {
      type: Boolean,
      required: true,
    },
    closable: {
      type: Boolean,
      default: true,
    },
    maskClosable: {
      type: Boolean,
      default: false,
    },
    okBtn: {
      type: Boolean,
      default: true,
    },
    okValue: {
      type: String,
      default: '确认',
    },
    cancelBtn: {
      type: Boolean,
      default: true,
    },
    cancelValue: {
      type: String,
      default: '取消',
    },
    assistValue: {
      type: String,
      default: '',
    },
    assistTip: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      visible: this.value,
    }
  },
  watch: {
    value(val) {
      this.visible = val
    },
    visible(val) {
      if (val === false) {
        this.$emit('input', false)
      }
    },
  },
  methods: {
    ok() {
      this.$emit('on-ok')
    },

    cancel() {
      this.$emit('input', false)
      this.$emit('on-cancel')
    },

    assist() {
      this.$emit('on-assist')
    },
  },
}
</script>

<style lang="less" scoped>
  .default-btn {
    &, + .assist-btn {
      text-align: center;
    }
    > button {
      + button {
        margin-left: 16%;
      }
    }
  }
  .assist-btn {
    padding-top: 10px;
  }
</style>
