<template>
  <Modal :value="value" :width="width" @on-cancle="cancle" @input="cancle">
    <p slot="header" class="color-warning text-center">
      <Icon type="information-circled"></Icon>
      <span>{{ title }}</span>
    </p>
    <slot v-if="prevent" name="prevent"></slot>
    <slot v-else></slot>
    <div slot="footer">
      <!--无法删除-->
      <Button v-if="prevent" type="primary" size="large" long @click="cancle">确认</Button>
      <!--确认删除-->
      <Button v-else type="warning" size="large" long :loading="loading" @click="ok">删除</Button>
    </div>
  </Modal>
</template>

<script>
/**
 * 公共警告式模态框
 * @author lmh
 * @name app-warn-modal
 * @param {Boolean} v-model - 模态框显示/隐藏
 * @param {String} title - 模态框标题
 * @param {Number|String} width - 模态框宽度
 * @param {Boolean} loading - 操作按钮loading状态
 * @param {Boolean} prevent - 是否阻止操作
 * @param {String} action - 操作按钮文本
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
      default: 360,
    },
    loading: {
      type: Boolean,
      required: true,
    },
    prevent: {
      type: Boolean,
      default: false,
    },
    action: {
      type: String,
      required: true,
    },
  },

  methods: {
    cancle() {
      this.$emit('input', false)
      this.$emit('on-cancle')
    },

    ok() {
      this.$emit('on-ok')
    },
  },
}
</script>
