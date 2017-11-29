<template>
  <div class="algorthm-knowledge">
    <App-table-form @on-submit="search">
      <!-- 特殊字段搜索 -->
      <Form-item>
        <Select
          v-model="query['equal[grade_range_subject_id]']"
          placeholder="全部学科"
          style="width: 150px;"
        >
          <Option
            v-for="item in subjects"
            :key="item.id"
            :value="item.id"
          >
            {{item.display_name}}
          </Option>
          <Option value="">全部学科</Option>
        </Select>
      </Form-item>
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

    <div
      class="app-content-header"
    >
      <h2><Icon type="android-contacts"/> 学员列表</h2>
    </div>

    <Table
      border
      :columns="colConfig"
      :data="buffer.data"
      @on-sort-change="sort"
    ></Table>

    <app-pager
      :data="buffer"
      @on-change="goTo"
      @on-page-size-change="pageSizeChange"
    ></app-pager>
  </div>
</template>

<script>
/**
 * 算法中心 - 学员知识点
 *
 * @author
 */

import Http from '@/utils/http'
import list from '@/mixins/list'
import { createButton } from '@/utils'

export default {
  name: 'algorithm-knowledge',

  mixins: [list],

  data() {
    return {
    /* --- 头部搜索栏数据 --- */

      likeKeys: [],
      likeKey: 'student_number',

      query: {
        'equal[grade_range_subject_id]': '',
      },

      subjects: [],

      /* --- 下方列表 --- */

      colConfig: [
        {
          title: '学员编号',
          key: 'number',
          align: 'center',
        },
        {
          title: '学员姓名',
          key: 'display_name',
          align: 'center',
        },
        {
          title: '学科',
          key: 'subject_name',
          align: 'center',
        },
        {
          title: '薄弱知识点个数',
          key: 'count_weak_knowledge',
          align: 'center',
          sortable: 'custom',
        },
        {
          title: '总知识点个数',
          key: 'count_knowledge',
          align: 'center',
          sortable: 'custom',
        },
        {
          title: '操作',
          key: 6,
          align: 'center',
          render: createButton([{
            text: '查看',
            type: 'primary',
            click: this.toCheck,
          }]),
        },
      ],

      /* 列表数据 */
      buffer: {},
    }
  },

  methods: {
    toCheck({ student_id: id, subject_type: type }) {
      const url = `/algorithm/knowledge/show/${id}/${type}`
      this.$router.push(url)
    },

    getData(query, to) {
      return this.$http.get(to.fullPath)
        .then((res) => { this.buffer = res })
    },
  },

  beforeRouteEnter(to, from, next) {
    Http.get('/algorithm/knowledge/index_before')
      .then(({
        search_fields,
        grade_range_subject_id,
      }) => {
        next((vm) => {
          /* eslint-disable no-param-reassign */
          vm.subjects = grade_range_subject_id
          vm.likeKeys = search_fields
          /* eslint-enalbe */
        })
      })
  },
}
</script>

<style lang="less">
.algorithm-knowledge {

}
</style>
