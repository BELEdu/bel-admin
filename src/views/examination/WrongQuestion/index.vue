<template>
  <div class="examination-wrongquestion">
    <!-- 顶部 搜索栏 -->
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
          type="primary"
          icon="ios-search"
          @click="search"
        >
          搜索
        </Button>
      </Form-item>
    </Form>

    <!-- 中部 列表title栏 -->
    <div class="app-content-topbar">
      <h2>
        <svg
          class="svg-icon" xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1024 1024"
          width="14"
          height="14"
        >
          <path d="M0 0h455.111v455.111H0V0zM568.889 0H1024v455.111H568.889V0zM0 568.889h455.111V1024H0V568.889zM568.889 568.889H1024V1024H568.889V568.889z"/>
        </svg>
        错题管理
      </h2>
    </div>

    <!-- 下部 列表展示-->
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
 * 测试管理 - 错题管理
 *
 * @author huojinzhao
 */

import { list, tableCommon } from '@/mixins'
import { createButton } from '@/utils'

export default {
  name: 'ExaminationWrongQuestion',

  mixins: [list, tableCommon],

  data() {
    return {
      /* --- 顶部搜索栏数据 --- */

      likeKeys: [
        {
          field_name: 'display_name',
          display_name: '学员姓名',
        },
        {
          field_name: 'counsellor_name',
          display_name: '学管师',
        },
      ],

      likeKey: 'display_name',

      // 全员列表配置
      colConfig: [
        {
          title: '学员姓名',
          key: 'display_name',
          align: 'center',
        },
        {
          title: '当前年级',
          key: 'current_grade_name',
          align: 'center',
        },
        {
          title: '学管师',
          key: 'study_teacher_name',
          align: 'center',
        },
        {
          title: '测试次数',
          key: 'test_count',
          align: 'center',
          sortable: 'custom',
        },
        {
          title: '错题数',
          key: 'wrong_count',
          align: 'center',
          sortable: 'custom',
        },
        {
          title: '操作',
          key: 6,
          align: 'center',
          render: createButton([
            {
              text: '查看',
              type: 'primary',
              click: this.checkDetail,
            },
          ]),
        },
      ],
    }
  },

  created() {
    // const subjectId = this.$route.query['equal[grade_range_subject_id]']
    // this.getPrecondition(subjectId)
  },

  methods: {
    /* --- Initialization --- */

    getPrecondition(subjectId) {
      const host = '/paper_center/index_before'
      const url = subjectId
        ? `${host}?grade_range_subject_id=${subjectId}` : host

      this.$http.get(url)
        .then(({
          search_fields,
        }) => {
          this.likeKeys = search_fields
        })
    },

    /* --- Control --- */

    checkDetail({ id }) {
      this.$router.push(`/examination/wrongquestion/${id}`)
    },
  },
}
</script>

<style lang="less">

</style>
