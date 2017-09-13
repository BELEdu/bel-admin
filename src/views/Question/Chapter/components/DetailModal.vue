<template>
  <div class="chapter-detail">

    <app-form-modal
      :value="value"
      @input="value => $emit('input', value)"
      title="查看详情"
      :loading="loading.modal"
      @on-ok="closeModal()"
      @on-cancle="closeModal()"
      :maskClosable="true"
    >
      查看详情
    </app-form-modal>

  </div>
</template>

<script>
/**
 * 查看详情
 * @author zml
 * @version 2017-09-13
 */

export default {
  name: 'question-chapter-detail-modal',

  props: {
    value: {
      type: Boolean,
      required: true,
      default: false,
    },
  },

  data() {
    return {
      loading: {
        modal: false,
      },
    }
  },

  methods: {
    closeModal() { // 关闭该模态框
      this.$emit('closeDetailModal')
    },
  },
}
</script>

<style lang="less">
@import '~vars';
</style>
