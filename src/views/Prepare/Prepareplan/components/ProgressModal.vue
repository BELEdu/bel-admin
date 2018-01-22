<template>
  <Modal
    :value="visible"
    :closable="false"
    @input="toggleModal"
    title="预览进度"
    :width="320"
    :mask-closable="false"
  >
    <div class="text-center">
      <span class="color-error">正在上传文件中 ...<br>上传成功后才可预览，请耐心等待！</span>
    </div>
    <p>
      <span>上传文件：</span>
      <span class="color-primary">{{name}}</span>
    </p>
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
      v-if="visible"
      :percent="+percent"
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
      if (this.data.done && this.data.total) {
        return ((this.data.done / this.data.total) * 100).toFixed(0)
      }
      return 0
    },
  },

  methods: {
    // 监听弹窗的显示/隐藏
    toggleModal(val) {
      this.$emit('update:visible', val)
    },

    // 关闭弹窗
    closeModal() {
      this.$emit('on-hide')
      this.$emit('update:visible', false)
    },
  },

}
</script>

<style>

</style>
