<template>
  <div class="qusetion-paper">
    <!-- 顶部搜索栏 -->
    <Form class="app-search-form app-search-form-layout">
      <!-- 年段+学科 -->
      <Form-item>
        <Select
          v-model="query['equal[subject_id]']"
          placeholder="年段学科"
          style="width: 150px;"
        >
          <Option
            v-for="item in subjects"
            :value="item.value"
            :key="item.value"
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
              :key="likeKey.value"
              :value="likeKey.value"
            >
              {{ likeKey.label }}
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
      :label="['学科', '状态', '难度']"
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
      :data="list"
      @on-sort-change="sort"
    ></Table>

    <!-- 底部分页 -->
    <!-- <app-pager
      :data="buffer"
      @on-change="goTo"
      @on-page-size-change="pageSizeChange"
    ></app-pager> -->
  </div>
</template>

<script>
/**
 * 题库中心 - 试卷
 *
 * @author huojinzhao
 */

import { GLOBAL } from '@/store/mutationTypes'
// import { list } from '@/mixins'
import { createButton } from '@/utils'
import vAdvanceSearch from './components/AdvanceSearch'

export default {
  name: 'question-paper',

  // mixins: [list],

  components: {
    vAdvanceSearch,
  },

  data: () => ({
    /* --- 顶部搜索栏数据 --- */

    likeKeys: [
      { value: 'title', label: '试卷标题' },
      { value: 'name', label: '创建人' },
    ],
    likeKey: 'title',

    query: {
      'equal[subject_id]': 1,
    },

    subjects: [
      { value: 1, display_name: '高中数学' },
      { value: 2, display_name: '高中英语' },
    ],

    /* --- 上方高级搜索数据 --- */

    advanceConditions: {
      grade_range_subject: [
        {
          value: 1,
          display_name: '初中数学',
        },
        {
          value: 3,
          display_name: '初中物理',
        },
      ],
      question_status: [
        {
          value: 1,
          display_name: '草稿',
        },
        {
          value: 2,
          display_name: '待审核',
        },
      ],
      difficulty: [
        {
          value: 1,
          display_name: '困难（0.26-0.40）',
        },
        {
          value: 2,
          display_name: '较难（0.26-0.40）',
        },
        {
          value: 3,
          display_name: '中等（0.26-0.40）',
        },
        {
          value: 4,
          display_name: '较易（0.26-0.40）',
        },
        {
          value: 5,
          display_name: '容易（0.26-0.40）',
        },
      ],
    },

    /* --- 下方试卷列表 --- */
    colConfig: [
      {
        title: '试卷标题',
        key: 1,
        align: 'center',
      },
      {
        title: '试题量',
        key: 2,
        align: 'center',
        sortable: 'custom',
      },
      {
        title: '创建人',
        key: 3,
        align: 'center',
      },
      {
        title: '创建日期',
        key: 4,
        align: 'center',
        sortable: 'custom',
      },
      {
        title: '浏览量',
        key: 5,
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

    list: Array(10).fill({
      1: '2017届河北省承德实验中学高三上学期期中考试语文试卷',
      2: 15,
      3: '李小平',
      4: '2017-04-23',
      5: 197,
    }),
  }),

  methods: {
    toComposePaper() {
      //
    },
  },

  beforeRouteUpdate(to, from, next) {
    this.$store.commit(GLOBAL.LOADING.HIDE)
    next()
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">

</style>
