<template>
  <div class="qusetion-paper">
    <!-- 顶部搜索栏 -->
    <App-table-form @on-submit="search">
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
    </App-table-form>

    <!-- 科目过滤 -->
    <ConditionRadioQuery
      v-if="subjects"
      :data="subjects.data"
      :default="subjects.default"
      @change="getPrecondition"
    />

    <!-- 上方条件过滤 -->
    <ConditionRadio
      v-for="(condition, key) in advanceConditions"
      :key="key"
      :label="condition.label"
      :data="condition.data"
      :tag="`equal[${key}]`"
    />

    <!-- 中部标题栏 -->
    <div
      class="app-content-topbar"
    >
      <h2><Icon type="ios-lightbulb"/> 试卷列表</h2>
      <Button
        type="primary"
        @click="toComposePaper"
      >组卷</Button>
    </div>

    <!-- 下方试卷列表 -->
    <Table
      border
      :columns="colConfig"
      :data="tableInfo.data"
      @on-sort-change="sort"
    ></Table>

    <!-- 底部分页 -->
    <app-pager
      :data="tableInfo"
      @on-change="goTo"
      @on-page-size-change="pageSizeChange"
    ></app-pager>
  </div>
</template>

<script>
/**
 * 题库中心 - 试卷
 *
 * @author huojinzhao
 */

import { list, tableCommon, lastRecord } from '@/mixins'
import { createButton } from '@/utils'
import {
  ConditionRadio,
  ConditionRadioQuery,
} from '@/views/components'
import isEqual from 'lodash/isEqual'

export default {
  name: 'question-paper',

  mixins: [list, tableCommon, lastRecord],

  components: {
    ConditionRadio,
    ConditionRadioQuery,
  },

  data() {
    return {
      /* --- 顶部搜索栏数据 --- */

      likeKeys: [],

      likeKey: 'display_name',

      /* --- 上方高级搜索数据 --- */

      subjects: null,

      advanceConditions: {},

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
              click: ({ id }) => this.deleteItem(id),
            },
            {
              text: '编辑',
              type: 'success',
              click: this.onEditPaper,
            },
            {
              text: '查看',
              type: 'info',
              click: this.onCheckPaper,
            },
            {
              text: '报告配置',
              type: 'warning',
              click: this.onConfigReport,
            },
          ]),
        },
      ],
    }
  },

  computed: {
    subjectId() {
      let subjectId = this.$route.query['equal[grade_range_subject_id]']
      subjectId = subjectId || this.subjects.default
      return subjectId
    },

    currentSubject() {
      return `equal[grade_range_subject_id]=${this.subjectId}`
    },
  },

  methods: {
    /* --- initialization --- */

    getPrecondition(id) {
      // id为空时获取默认行为数据
      const subjectId = +id || this.getLastRecord('subject_id')

      /* eslint-disable prefer-template */
      const url = '/paper/index_before'
        + (subjectId ? `?grade_range_subject_id=${subjectId}` : '')

      this.query['equal[grade_range_subject_id]'] = subjectId
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
          // 设置默认行为数据
          this.setLastRecord('subject_id', current_grade_range_subject_id)
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

    toComposePaper() {
      const url = `/question/paper/composition?${this.currentSubject}`
      this.$router.push(url)
    },

    /* --- business --- */

    /* check */

    onCheckPaper(row) {
      this.$router.push(`/question/paper/${row.id}`)
    },

    /* edit */

    onEditPaper(row) {
      const path = `/question/paper/composition/${row.id}`
      const subject = `?equal[grade_range_subject_id]=${row.grade_range_subject_id}`
      const url = `${path}${subject}`
      this.$router.push(url)
    },

    onConfigReport({ id }) {
      const url = `/question/paper/report/${id}`
      this.$router.push(url)
    },
  },

  created() {
    const subjectId = this.$route.query['equal[grade_range_subject_id]']
    this.getPrecondition(subjectId)
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      /* eslint no-param-reassign: ["error", { "props": false }] */
      if (vm.getLastRecord('subject_id')) {
        vm.$route.query['equal[grade_range_subject_id]'] = vm.getLastRecord('subject_id')
      }
    })
  },

  beforeRouteUpdate(to, from, next) {
    const query = to.query
    if (to.fullPath === '/question/paper' &&
     !isEqual(query['equal[grade_range_subject_id]'], this.getLastRecord('subject_id')) &&
      this.getLastRecord('subject_id')) {
      // TODO 暂时用重复请求来处理参数问题
      this.$nextTick(() => {
        this.$router.push(`/question/paper?equal[grade_range_subject_id]=${this.getLastRecord('subject_id')}`)
      })
    }
    next()
  },
}
</script>

<style lang="less">

</style>
