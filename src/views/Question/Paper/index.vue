<template>
  <div class="qusetion-paper">
    <!-- 顶部搜索栏 -->
    <Form class="app-search-form app-search-form-layout">
      <!-- 年段+学科 -->
      <Form-item v-if="likeKeys.length && subjects.length">
        <Select
          v-model="query['equal[grade_range_subject_id]']"
          placeholder="年段学科"
          style="width: 150px;"
        >
          <Option
            v-for="item in subjects"
            :value="item.id"
            :key="item.id"
          >
            {{item.display_name}}
          </Option>
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
  </div>
</template>

<script>
/**
 * 题库中心 - 试卷
 *
 * @author huojinzhao
 */

import { GLOBAL } from '@/store/mutationTypes'
import { list } from '@/mixins'
import { createButton } from '@/utils'
import vAdvanceSearch from './components/AdvanceSearch'

export default {
  name: 'question-paper',

  mixins: [list],

  components: {
    vAdvanceSearch,
  },

  data() {
    return {
      /* --- 顶部搜索栏数据 --- */

      likeKeys: [],

      likeKey: 'display_name',

      subjects: [],

      query: {
        'equal[grade_range_subject_id]': 5,
      },

      /* --- 上方高级搜索数据 --- */

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
            },
            {
              text: '编辑',
              type: 'success',
            },
            {
              text: '查看',
              type: 'info',
            },
          ]),
        },
      ],

      buffer: {},
    }
  },

  methods: {
    toComposePaper() {
      this.$router.push('/question/paper/composition')
    },

    getData(queryUrl, to) {
      const url = to.fullPath
        .split('/')
        .splice(2)
        .join('/')
      return this.$http.get(`/${url}`)
        .then((res) => { this.buffer = res })
    },
  },

  beforeRouteE(to, from, next) {
    this.$store.commit(GLOBAL.LOADING.HIDE)
    next()
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
    this.$http.get('/paper/index_before')
      .then(({
        // 条件搜索
        grade_range_subject_id,
        search_fields,
        // 高级搜索
        grade,
        paper_type,
        province,
        year,
      }) => {
        this.subjects = grade_range_subject_id
        this.likeKeys = search_fields
        this.advanceConditions = {
          grade,
          paper_type,
          province,
          year,
        }
      })
  },
}
</script>

<style lang="less">

</style>
