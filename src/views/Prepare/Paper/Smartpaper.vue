<template>
  <div
    v-if="preConfig"
    class="prepare-paper-smartpaper"
  >
    <Form
      class="app-form-entire"
      :label-width="130"
    >
      <app-form-alert :errors="formErrors"></app-form-alert>
      <Form-item label="选择科目" required>
        <AppButtonRadio
          v-model="fdata.subject_id"
          :data="preConfig.grade_range_subject_id"
          size="small"
          @change="({ id }) => v_getPreConfig(id)"
        />
      </Form-item>
      <Form-item
        class="prepare-paper-smartpaper__types"
        label="选择题量"
      >
        <dl
          v-for="(type, index) in fdata.question_types"
          class="clearfix"
        >
          <dt>{{preConfig.question_type_id.data[index].display_name}}：</dt>
          <dd>
            <Input-number
              v-model="type.number"
              :min="0"
            ></Input-number>
          </dd>
        </dl>
      </Form-item>
      <Form-item label="选择难度">
       <AppButtonRadio
          v-model="fdata.question_difficulty"
          :data="preConfig.question_difficulty.data"
          size="small"
        />
      </Form-item>
      <Form-item label="选择知识点">
        <app-tree-select
          v-model="fdata.knowledge"
          :data="preConfig.knowledge_tree"
          multiple
        ></app-tree-select>
      </Form-item>
      <Form-item>
        <Button
          @click="v_cancel"
        >取消</Button>
        <Button
          type="primary"
          :loading="loading"
          @click="v_composePaper"
        >预览试卷</Button>
      </Form-item>
    </Form>

    <!-- 试卷预览弹窗 -->
    <PaperPreviewDialog
      :visible.sync="previewModal.visible"
      :data="previewModal.data"
      :loading="previewModal.loading"
      @on-ok="vm_createPaper"
    />
  </div>
</template>

<script>
/**
 * 备课管理 - 试卷中心 - 智能组卷
 *
 * @author huojinzhao
 */
import { form } from '@/mixins'
import { GLOBAL } from '@/store/mutationTypes'
import {
  PaperPreviewDialog,
} from '@/views/components'

const initFdata = subject_id => ({
  subject_id,
  question_types: [],
  question_difficulty: null,
  knowledge: [],
})

const paperFactory = () => ({
  campuses: [[]],
  grade: null,
  subject_type: null,
  paper_type: null,
  year: null,
  display_name: '',
  exam_time: 0,
  question_types: [],
})

export default {
  name: 'PreparePaperSmartpaper',

  mixins: [form],

  components: {
    PaperPreviewDialog,
  },

  data: () => ({
    preConfig: null,

    fdata: initFdata(10),

    previewModal: {
      visible: false,
      data: paperFactory(),
      loading: false,
    },

    loading: false,
  }),

  created() {
    this.v_getPreConfig()
      .then(() => this.$store.commit(GLOBAL.LOADING.HIDE))
  },

  methods: {
    /* --- Initialization --- */

    v_getPreConfig(subjectId) {
      const uri = '/paper_center/intelligence_before'
      const url = subjectId
        ? `${uri}?grade_range_subject_id=${subjectId}` : uri

      return this.$http.get(url)
        .then((before) => {
          this.m_initPreConfig(before)
        })
    },

    m_initPreConfig(before) {
      this.fdata = initFdata(this.fdata.subject_id)
      this.fdata.knowledge = []
      this.preConfig = before
      this.m_constructQuestionTypes(before.question_type_id.data)
    },

    m_constructQuestionTypes(question_types) {
      this.fdata.question_types = question_types
        .map(type => ({
          question_type_id: type.id,
          number: 0,
        }))
    },

    /* --- Control --- */

    v_cancel() {
      this.$router.push('/prepare/papercenter')
    },

    /* --- Business --- */

    v_composePaper() {
      this.formErrors = {}
      this.loading = true

      this.$http.post('/paper_center/intelligence', this.fdata)
        .then(res => this.m_composePaper(res))
        .catch(this.errorHandler)
        .then(() => { this.loading = false })
    },

    m_composePaper(paper) {
      const id = this.fdata.subject_id

      this.previewModal.data = {
        ...paperFactory(),
        ...paper,
        ...{
          // 视图学科数据生成
          subjectName: this.filterSubjectName(id),
          grade_range_subject_id: id,
        },
      }
      this.m_openPreview()
    },

    vm_createPaper(paper) {
      this.previewModal.loading = true

      this.$http.post('/paper_center', paper)
        .then(() => this.v_cancel())
        .catch(() => {
          this.$Notice.error({
            title: '创建试卷失败',
            duration: 0,
          })
          this.previewModal.loading = false
        })
    },

    vm_closePreview() {
      this.previewModal.visible = false
    },

    m_openPreview() {
      this.previewModal.visible = true
    },


    /* --- Assistance --- */

    filterSubjectName(id) {
      const name = this.preConfig.grade_range_subject_id
        .find(subject => subject.id === id)

      return name ? name.display_name.slice(2) : ''
    },
  },
}
</script>

<style lang="less">
@import "~mixin";

.prepare-paper-smartpaper {

  &__types {
    dl,
    dt,
    dd  {
      float: left
    }

    dt {
      width: 80px;
      text-align: right;
    }

    .ivu-input-number {
      width: 100px;
    }
  }
}
</style>
