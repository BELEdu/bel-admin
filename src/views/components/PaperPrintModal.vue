<template>
  <Modal
    :value="visible"
    :width="width"
    title="打印试卷"
    :mask-closable="false"
    :closable="false"
    class="print-modal"
  >
    <!-- 加载loading -->
    <Spin v-if="!loadOk" fix>试卷正在加载中...</Spin>

    <!-- 富文本编辑器 -->
    <app-editor
      v-if="isfirstRender"
      ref="myEditor"
      :config="config"
      :height="978"
      :value="formatData"
      @init="() => this.loadOk = true"
    ></app-editor>

    <div slot="footer">
      <Button
        type="primary"
        size="large"
        @click="closeModal"
      >取消</Button>
    </div>

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
      default: 846,
    },
  },

  data() {
    return {
      isfirstRender: false, // 是否第一次加载（用于编辑器加载静态资源）
      loadOk: false, // 编辑器加载成功

      // 编辑器配置
      config: {
        width: '21.5cm', // 预留0.5cm给滚动条
      },
    }
  },

  computed: {
    /**
     * 临时处理一些会对打印产生影响的样式
     * p、ul&li、img还有待考量
     */
    formatData() {
      return `
        <style>
        body{height: auto;margin: 0 auto;background: #fff url(${printBg}) repeat-y center top;}
        ul{list-style:none;}
        p{margin:0;}
        img {vertical-align: middle;}
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
        this.isfirstRender = val

        this.$nextTick(() => {
          if (this.$refs.myEditor.editor) {
            this.$refs.myEditor.editor.setData(this.formatData)
          }
        })
      }
    },
  },

  methods: {
    closeModal() {
      const text = '取消后将不保存任何试卷排版，确定取消？'
      this.$Modal.confirm({
        title: '取消确认',
        content: `<div style="font-size:14px;text-align:center;fontt-weight:bold;">${text}</div>`,
        cancelText: '返回',
        okText: '确认',
        onOk: () => {
          this.$emit('update:visible', false)
        },
      })
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
