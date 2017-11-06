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
    <ConditionRadioSubject
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

import { list, tableCommon } from '@/mixins'
import { createButton } from '@/utils'
import {
  ConditionRadio,
  ConditionRadioSubject,
} from '@/views/components'

export default {
  name: 'question-paper',

  mixins: [list, tableCommon],

  components: {
    ConditionRadio,
    ConditionRadioSubject,
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

    toComposePaper() {
      const url = '/question/paper/composition'
        + `?equal[grade_range_subject_id]=${this.subjectId}`
      this.$router.push(url)
    },

    /* --- business --- */

    /* check */

    onCheckPaper(row) {
      this.$router.push(`/question/paper/${row.id}`)
    },

    /* edit */

    onEditPaper(row) {
      const url = `/question/paper/creation/${row.id}?${this.currentSubject}`
      this.$router.push(url)
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
