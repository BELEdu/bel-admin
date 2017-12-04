<template>
  <Modal
    :value="visible"
    :width="width"
    title="打印试卷"
    :mask-closable="false"
    @input="toggleModal"
    class="print-modal"
  >
    <!-- 加载loading -->
    <Spin v-if="isLoading" fix>试卷正在加载中...</Spin>

    <!-- 富文本编辑器 -->
    <app-editor
      v-if="isRender"
      ref="myEditor"
      :config="config"
      :height="978"
      :value="formatData"
      @init="() => this.isLoading = false"
    ></app-editor>

  </Modal>
</template>

<script>
/**
 * 编辑器试卷打印组件
 * @author zhoumenglin
 * @version 2017-12-04
 */

import printBg from '@/assets/A4.jpg'

export default {

  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    data: {
      type: String,
      required: true,
    },
    width: {
      type: [String, Number],
      default: 829,
    },
  },

  data() {
    return {
      isRender: false, // 是否第一次加载（用于编辑器加载静态资源）
      isLoading: true, // 加载标志

      // 编辑器配置
      config: {
        width: '21cm',
      },
    }
  },

  computed: {
    // 临时处理一些会对打印产生影响的样式
    formatData() {
      return `
        <style>
        body{height: auto;margin: 0 auto;background: #fff url(${printBg}) repeat-y center top;}
        ul{list-style:none;}
        .topic-item__control{display:none;}
        .app-question__student-answer{display:none;}
        @media print {
          body {background: none !important;}
          .cke_editable div.cke_pagebreak {
            background: none !important;
            border-top: none !important;
            border-bottom: none !important;
          }
        }
        </style>
        ${this.data}`
    },
  },

  watch: {
    // 监听：当弹窗为打开状态时，调用编辑器的setData方法将格式化后的HTML代码注入
    visible(val) {
      if (val) {
        this.isRender = val

        this.$nextTick(() => {
          if (this.$refs.myEditor.editor) {
            this.$refs.myEditor.editor.setData(this.formatData)
          }
        })
      }
    },
  },

  methods: {
    toggleModal(value) {
      this.$emit('update:visible', value)
    },
  },

}
</script>

<style lang="less">
.print-modal {

  .ivu-modal-body {
    min-height: 300px;
    position: relative;
  }
}
</style>
