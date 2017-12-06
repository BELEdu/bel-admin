<template>
  <section
    v-if="paper"
    class="question-paper-detail"
  >
    <app-editor-title>
      <div class="question-paper-detail__action">
        <!-- 返回 -->
        <Button
          type="ghost"
          @click="goBack"
        >返回</Button>

        <!-- 打印试卷 -->
        <Button
          type="warning"
          icon="archive"
          @click="openPrintModal"
        >打印试卷</Button>
      </div>
    </app-editor-title>

    <div ref="paperDom">
      <!-- 试卷展示组件（打印区域） -->
      <paper-readonly
        :data="paper"
      />
    </div>

     <!-- 编辑器打印试卷组件 -->
    <paper-print-modal
      :visible.sync="printModal.active"
      :data="printModal.content"
    />

  </section>
</template>

<script>
/**
 * 题库中心 - 试卷 - 试卷详情
 *
 * @author huojinzhao
 */

import { GLOBAL } from '@/store/mutationTypes'
import { goBack } from '@/mixins'
import { PaperReadonly, PaperPrintModal } from '@/views/components'

export default {
  name: 'question-paper-detail',

  mixins: [goBack],

  components: {
    PaperReadonly,
    PaperPrintModal,
  },

  data: () => ({
    paper: null,

    printModal: {
      active: false,
      content: '',
    },

  }),

  methods: {
    // 打开编辑器打印弹窗，并获取试卷 Dom 的 innerHTML 传入编辑器
    openPrintModal() {
      this.$nextTick(() => {
        const contentHtml = this.$refs.paperDom.innerHTML
        this.printModal.content = contentHtml
        this.printModal.active = true
      })
    },
  },

  created() {
    const id = this.$route.params.id
    const uri = this.$route.meta.uri
    this.$http.get(`${uri}/${id}`)
      .then((res) => {
        this.paper = res
        this.$store.commit(GLOBAL.LOADING.HIDE)
      })
  },
}
</script>

<style lang="less">
@import "~vars";

.question-paper-detail {

  &__action {
    margin-top: 15px;

    .ivu-btn {
      min-width: 100px;
    }
  }
}
</style>
