<template>
  <div class="no-reset prepareplan-preview">
    <div class="lesson panel">
      <div
        class="lesson-dom -zoom"
        ref="lessonDom"
        v-html="content"
      ></div>
      <PreviewCanvas
        v-if="height"
        :width="1480"
        :height="height"
        :html="content"
        :zoom="true"
      />
    </div>
  </div>
</template>

<script>
import PreviewCanvas from './components/PreviewCanvas'

export default {
  name: 'Preview',

  components: {
    PreviewCanvas,
  },

  data() {
    return {
      content: localStorage.getItem('previewPreparePlan'),
      height: null,
    }
  },

  mounted() {
    setTimeout(() => {
      this.height = this.$refs.lessonDom.clientHeight
    }, 500)
  },
}
</script>

<style>
.prepareplan-preview {
  background-image: url("../../../assets/preview-background.jpg");
  background-attachment: fixed;
  overflow: hidden;
}

.panel {
  border-radius: 10px;
  background-color: #ddd;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.4);
}

.lesson {
  position: relative;
  width: 1480px;
  margin: 100px auto 40px;
  overflow: hidden;
}

/* 教案样式 */
.lesson-dom {
  visibility: hidden;
  min-height: 800px;
  padding: 20px 60px;
  font-size: 16px;
}

.lesson-dom p {
  line-height: 24px;
}

.lesson-dom * {
  font-family: sans-serif !important;
  font-size: inherit !important;
}

.lesson-dom img {
  vertical-align: middle;
}

.lesson-dom table, td {
  width: auto !important;
}

.lesson-dom.-zoom {
  font-size: 28px;
}

.lesson-dom.-zoom p {
  line-height: 32px;
}

.lesson-dom.-zoom img {
  zoom: 1.75;
}
</style>
