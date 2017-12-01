<template>
  <div class="print-modal">
    <Modal
      :value="value"
      @input="value => $emit('input', value)"
      title="打印试卷"
      :mask-closable="false"
      width="835"
    >

      <app-editor
        ref="myEditor"
        :config="{width:'21cm'}"
        :height="978"
        :value="data"
      ></app-editor>

    </Modal>
  </div>
</template>

<script>
export default {

  props: {
    value: {
      type: Boolean,
      required: true,
    },
    data: {
      type: String,
      required: true,
    },
  },

  watch: {
    value(val) {
      if (val) {
        this.$nextTick(() => this.$refs.myEditor.editor &&
           this.$refs.myEditor.editor.setData(this.data))
      }
    },
  },

}
</script>

<style lang="less">
</style>
