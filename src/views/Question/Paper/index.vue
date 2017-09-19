<template>
  <div class="qusetion-paper">
    <!-- 顶部搜索栏 -->
    <Form class="app-search-form app-search-form-layout">
      <!-- 关键字检索 -->
      <Form-item>
        <Input
          placeholder="搜索关键字"
          v-model="likeValue"
          style="width: calc(7em + 200px);"
        >
          <Select
            v-model="likeKey"
            slot="prepend"
            style="width: 7em"
          >
            <Option
              v-for="likeKey in likeKeys"
              :key="likeKey.field_name"
              :value="likeKey.field_name"
            >
              {{ likeKey.display_name }}
            </Option>
          </Select>
        </Input>
      </Form-item>
      <!-- 查询按钮 -->
      <Form-item>
        <Button
          type="primary" icon="ios-search"
          @click="search"
        >
          搜索
        </Button>
      </Form-item>
    </Form>


    <!-- 科目过滤 -->
    <v-subject-radio
      v-if="subjects"
      :data="subjects.data"
      :default="subjects.default"
      @change="getPrecondition"
    >
    </v-subject-radio>
    <!-- 上方条件过滤 -->
    <v-advance-search
      v-if="advanceConditions"
      :data="advanceConditions"
    ></v-advance-search>

    <!-- 中部标题栏 -->
    <div
      class="app-content-topbar"
    >
      <h2>试卷列表</h2>
      <Button
        type="primary"
        @click="toComposePaper"
      >组卷</Button>
    </div>

    <!-- 下方试卷列表 -->
    <Table
      border
      :columns="colConfig"
      :data="buffer.data"
      @on-sort-change="sort"
    ></Table>

    <!-- 底部分页 -->
    <app-pager
      :data="buffer"
      @on-change="goTo"
      @on-page-size-change="pageSizeChange"
    ></app-pager>

    <!-- 删除警告框 -->
    <app-warn-modal
      v-model="deletionModal.active"
      :title="deletionModal.title"
      :loading="deletionModal.confirmLoading"
      @on-ok="deletePaper"
    >
      <div>该试卷删除后将无法恢复，是否继续删除？</div>
    </app-warn-modal>
  </div>
</template>

<script>
/**
 * 题库中心 - 试卷
 *
 * @author huojinzhao
 */

import { list } from '@/mixins'
import { createButton } from '@/utils'
import vAdvanceSearch from './components/AdvanceSearch'
import vSubjectRadio from './components/SubjectRadio'

export default {
  name: 'question-paper',

  mixins: [list],

  components: {
    vAdvanceSearch,
    vSubjectRadio,
  },

  data() {
    return {
      /* --- 顶部搜索栏数据 --- */

      likeKeys: [],

      likeKey: 'display_name',


      /* --- 上方高级搜索数据 --- */

      subjects: null,

      advanceConditions: null,

      /* --- 下方试卷列表 --- */
      colConfig: [
        {
          title: '试卷标题',
          key: 'display_name',
          align: 'center',
        },
        {
          title: '试题量',
          key: 'question_count',
          align: 'center',
          sortable: 'custom',
        },
        {
          title: '创建人',
          key: 'user_realname',
          align: 'center',
        },
        {
          title: '创建日期',
          key: 'created_at',
          align: 'center',
          sortable: 'custom',
        },
        {
          title: '浏览量',
          key: 'view_count',
          align: 'center',
          sortable: 'custom',
        },
        {
          title: '操作',
          key: 6,
          align: 'center',
          render: createButton([
            {
              text: '删除',
              type: 'error',
              click: this.activatePaperDeletion,
            },
            {
              text: '编辑',
              type: 'success',
            },
            {
              text: '查看',
              type: 'info',
              click: this.onCheckPaper,
            },
          ]),
        },
      ],

      buffer: {},

      deletionModal: {
        active: false,
        confirmLoading: false,
        title: '删除确认',
      },

      deletionTarget: null,
    }
  },

  methods: {
    /* --- initialization --- */

    getPrecondition(subjectId) {
      /* eslint-disable prefer-template */
      const url = '/paper/index_before'
        + (subjectId ? `?grade_range_subject_id=${subjectId}` : '')
      /* eslint-enable */

      this.$http.get(url)
        .then(({
          // 条件搜索
          search_fields,
          // 高级搜索
          current_grade_range_subject_id,
          grade_range_subject_id,
          grade,
          paper_type,
          province,
          year,
        }) => {
          this.subjects = {
            default: current_grade_range_subject_id,
            data: grade_range_subject_id,
          }
          this.likeKeys = search_fields
          this.advanceConditions = {
            grade,
            paper_type,
            province,
            year,
          }
        })
    },

    getData(queryUrl, to) {
      const url = to.fullPath
        .split('/')
        .splice(2)
        .join('/')
      return this.$http.get(`/${url}`)
        .then((res) => { this.buffer = res })
    },

    toComposePaper() {
      this.$router.push('/question/paper/composition')
    },

    onCheckPaper(row) {
      this.$router.push(`/question/paper/${row.id}`)
    },

    activatePaperDeletion(row) {
      this.deletionTarget = row
      this.deletionModal.active = true
    },

    deactivatePaperDeletion() {
      this.deletionTarget = null
      this.deletionModal.active = false
      this.deletionModal.confirmLoading = false
    },

    deletePaper() {
      this.deletionModal.confirmLoading = true
      const id = this.deletionTarget.id
      this.$http.delete(`/paper/${id}`)
        .then(() => {
          this.buffer.data = this.buffer.data
            .filter(data => data.id !== id)
          this.$Message.success('删除成功')
        })
        .catch(() => {
          this.$Message.error('删除失败')
        })
        .then(() => this.deactivatePaperDeletion())
    },
  },

  created() {
    const subjectId = this.$route.query['equal[grade_range_subject_id]']
    this.getPrecondition(subjectId)
  },
}
</script>

<style lang="less">

</style>
