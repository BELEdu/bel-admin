<template>
  <div
    class="no-reset prepareplan-preview"
    :style="{
      'background-image': `url(${assetsPreviewBackground})`,
      'background-repeat': 'repeat-y',
    }"
  >
    <div
      class="prepareplan-preview-content"

    >
      <div
        class="prepareplan-preview-dom"
        ref="lessonDom"
      ></div>
      <PreviewCanvas
        v-if="renderCanvas"
        :width="canvasWidth"
        :height="canvasHeight"
        :html="content"
        :font-size="28"
      />
    </div>
  </div>
</template>

<script>
import assetsPreviewBackground from '@/assets/preview-background.jpg'
import PreviewCanvas from './components/PreviewCanvas'

export default {
  name: 'PrepareplanPreview',

  components: {
    PreviewCanvas,
  },

  data() {
    return {
      assetsPreviewBackground,
      content: '',
      renderCanvas: false,
      canvasWidth: 0,
      canvasHeight: 0,
    }
  },

  methods: {
    renderLesson(content, remove) {
      this.renderCanvas = false

      const { lessonDom } = this.$refs

      lessonDom.innerHTML = content

      this.$nextTick(() => {
        this.canvasWidth = lessonDom.clientWidth
        // 画布的高度计算不完全可靠，总是多给50个像素以防止内容渲染不全
        this.canvasHeight = Math.max(lessonDom.clientHeight + 100, 800)

        this.renderCanvas = true

        if (remove) {
          lessonDom.remove()
        }
      })
    },
  },

  created() {
    this.content = localStorage.getItem('previewPreparePlan')
  },

  mounted() {
    this.renderLesson(this.content, true)
  },
}
</script>

<style lang="less">

.prepareplan-preview {
  width: 100%;
  padding: 90px 0;
}

.prepareplan-preview-dom {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  padding: 20px 60px;
  font-family: sans-serif;
  line-height: 1.7;
  visibility: hidden;
  font-size: calc(28 / 16 * 1rem);
}

.prepareplan-preview-dom * {
  font-family: inherit !important;
  font-size: inherit !important;
}


.prepareplan-preview-dom img {
  mix-blend-mode: multiply;
  vertical-align: middle;
  zoom: calc(28 / 16);
}

.prepareplan-preview-content {
  margin: 0 auto;
  position: relative;
  width: 1480px;
  min-height: 800px;
  background-color: rgb(221, 221, 221);
  border-radius: 10px;

  table, td {
    width: auto !important;
  }
}
</style>
