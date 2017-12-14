<template>
  <div
  v-if="data"
  class="smartexam-preview"
  >
    <app-editor-title>
      <div class="smartexam-preview__action">
        <Button
          type="ghost"
          @click="goBack"
        >返回</Button>

        <Button
          type="warning"
          icon="paper-airplane"
          @click="openPrintModal"
        >打印试卷</Button>

        <Button
          type="warning"
          icon="archive"
          @click="download"
        >下载Word</Button>
      </div>
    </app-editor-title>


    <div class="clearfix">
      <!-- 左侧选择学员 -->
      <aside class="smartexam-preview__aside left">

        <!-- 学员按钮组（到时候未考试的要变为disabled） -->
        <ButtonGroup
          class="smartexam-preview__btns"
          vertical
        >
          <Button
            v-for="item in student_data"
            :key="item.id"
            :disabled="false"
            :type="buttonFormat(item.id)"
            @click="changeStudentTestId(item.id)"
          >
            {{ item.student.display_name }}
          </Button>
        </ButtonGroup>

      </aside>

      <!-- 右侧试卷展示部分 -->
      <div
        class="smartexam-preview__sidebar left"
        ref="paperDom"
      >
        <!-- 试卷展示组件（打印区域） -->
        <paper-readonly
          :data="data"
        />
      </div>

    </div>

    <!-- 编辑器打印试卷组件 -->
    <paper-print-modal
      :visible.sync="printModal.active"
      :data="printModal.content"
    />

  </div>
</template>

<script>
/**
 * 测试管理 - 智能测试 - 查看试卷
 * @author zhoumenglin
 * @version 2017-10-27
 */

import { mapState } from 'vuex'
import { GLOBAL, EXAMINATION } from '@/store/mutationTypes'
import { goBack } from '@/mixins'
import { PaperReadonly, PaperPrintModal } from '@/views/components'

export default {
  name: 'app-examination-smartexam-preview',

  mixins: [goBack],

  components: {
    PaperReadonly,
    PaperPrintModal,
  },

  data() {
    return {
      currentStudentTestId: null, // 当前选中的测试学员的测试id

      data: null, // 试卷信息

      apiHead: process.env.NODE_ENV === 'production' ?
        `https://${window.location.hostname.replace(/([^.]+)\./, '$1-api.')}`
        : 'https://oa-api.caihonggou.com',

      printModal: {
        active: false,
        content: '',
      },
    }
  },

  computed: {
    // 参加测试的学员信息
    ...mapState({
      student_data: state => state.examination.smartexam.student_data,
    }),

    // 测试id
    testid() {
      return +this.$route.params.testid
    },

  },

  methods: {
    // 打开编辑器打印弹窗，并获取试卷 Dom 的 innerHTML 传入编辑器
    openPrintModal() {
      this.$nextTick(() => {
        const contentHtml = this.$refs.paperDom.innerHTML
        this.printModal.content = contentHtml
        this.printModal.active = true
      })
    },

    // 按钮模板
    buttonFormat(id) {
      if (this.currentStudentTestId === id) {
        return 'primary'
      }
      return 'ghost'
    },

    // 下载word
    download() {
      window.open(`${this.apiHead}/down_word/${this.currentStudentTestId}`)
    },

    // 获取试卷详情
    getPaperData(student_test_id) {
      return this.$http.get(`/test/paperinspection/${student_test_id}`)
        .then((res) => {
          this.data = res
        })
    },

    // 切换测试学员
    changeStudentTestId(student_test_id) {
      this.currentStudentTestId = student_test_id
      this.getPaperData(student_test_id)
    },
  },

  created() {
    this.$store.dispatch(EXAMINATION.SMARTEXAM.STUDENT_DATA, this.testid)
      .then(() => {
        // 这里还有待优化，先取第一个学生
        const firstStudentId = this.student_data[0].id
        this.currentStudentTestId = firstStudentId
        this.getPaperData(firstStudentId)
          .then(() => {
            this.$store.commit(GLOBAL.LOADING.HIDE)
          })
      })
  },

}
</script>

<style lang="less">
.smartexam-preview {
  &__btns {
    width: 100%;
  }

  &__action {
    margin-top: 15px;

    .ivu-btn {
      min-width: 100px;
    }
  }

  &__aside {
    width:100px;
    max-height: 500px;
    overflow: auto;
    margin-right: 20px;
  }

  &__sidebar{
    width: 885px;
  }
}
</style>
