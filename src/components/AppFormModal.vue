<template>
  <Modal :value="value" :title="title" :width="width"  @input="cancle">
    <slot></slot>
    <div slot="footer">
      <Button type="text" size="large" @click="cancle">取消</Button>
      <Button type="primary" size="large" :loading="loading" @click="ok">确定</Button>
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
 * @param {okCallback} on-ok 确认操作回调函数
 * @param {cancleCallback} on-cancle 取消操作回调函数
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
  },

  methods: {
    ok() {
      this.$emit('on-ok')
    },

    cancle() {
      this.$emit('input', false)
      this.$emit('on-cancle')
    },
  },
}
</script>
