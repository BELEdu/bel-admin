<template>
  <Modal
    :value="visible"
    @input="toggleModal"
    title="预览进度"
    :width="320"
    mask-closable
  >
    <div>
      <span>上传文件：</span>
      <span class="color-primary">{{name}}</span>
    </div>
    <p>
      <span>上传进度：</span>
      <span class="color-primary">{{`${percent}%`}}</span>
    </p>
    <p>
      <span>文件大小：</span>
      <span class="color-primary">{{data.done}} / {{data.total}}</span>
    </p>
    <!-- 进度条 -->
    <Progress
      :percent="percent"
      status="active"
      :stroke-width="15"
      hide-info
    ></Progress>

    <div slot="footer">
      <Button
        type="ghost"
        @click="closeModal"
      >返回</Button>
    </div>
  </Modal>
</template>

<script>
export default {

  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },

  computed: {
    percent() {
      return ((this.data.done / this.data.total) * 100).toFixed(0) || 0
    },
  },

  methods: {
    // 监听弹窗的显示/隐藏
    toggleModal(val) {
      this.$emit('update:visible', val)
    },

    // 关闭弹窗
    closeModal() {
      this.$emit('update:visible', false)
    },
  },

}
</script>

<style>

</style>
