<script>
/**
 * 试卷 - 试卷预览模态框组件
 *
 * @author  huojinzhao
 */

import PaperPreview from './PaperPreview'

export default {
  name: 'PaperPreviewDialog',

  components: {
    PaperPreview,
  },

  props: {
    // 组件显示开关
    visible: {
      type: Boolean,
      required: true,
    },

    // 保存按钮loading状态控制
    loading: {
      type: Boolean,
      default: false,
    },

    // 试卷完整数据，格式见 PaperPreview 组件注释
    data: {
      type: Object,
      required: true,
    },
  },

  methods: {
    v_closeDialog(value) {
      if (value) return
      this.$emit('update:visible', false)
    },

    v_createPaper() {
      this.$refs.paperPreview
        .$_formValidate(valid => valid && this.$emit('on-ok', this.data))
    },
  },
}
</script>

<template>
  <Modal
    :value="visible"
    @input="v_closeDialog"
    title="试卷预览"
    :styles="{ top: '50px', width: '950px' }"
  >
    <PaperPreview
      ref="paperPreview"
      :data="data"
      in-modal
    />
    <div slot="footer">
      <Button
        type="text"
        @click="v_closeDialog"
      >
        取消
      </Button>
      <Button
        type="primary"
        :loading="loading"
        @click="v_createPaper"
      >
        保存
      </Button>
    </div>
  </Modal>
</template>

<style lang="less">

</style>
