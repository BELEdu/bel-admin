<template>
  <div class="algorthm-knowledge">
    <Form class="app-search-form app-search-form-layout">
      <!-- 特殊字段搜索 -->
      <Form-item>
        <Select
          v-model="query['equal[subject_id]']"
          placeholder="选择学科"
          style="width: 150px;"
        >
          <Option
            v-for="item in subject"
            :key="item.value"
            :value="item.value"
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
      <Form-item>
        <Button type="primary" icon="ios-search" @click="search">
          搜索
        </Button>
      </Form-item>
    </Form>

    <div
      class="app-content-header"
    >
      <h2>学员列表</h2>
    </div>

    <Table
      border
      :columns="colConfig"
      :data="buffer.data"
      @on-sort-change="sort"
    ></Table>

    <!-- <app-pager
      :data="buffer"
      @on-change="goTo"
      @on-page-size-change="pageSizeChange"
    ></app-pager> -->
  </div>
</template>

<script>
/**
 * 算法中心 - 学员知识点
 *
 * @author
 */

import { GLOBAL } from '@/store/mutationTypes'
import list from '@/mixins/list'
import { createButton } from '@/utils'

export default {
  name: 'algorithm-knowledge',

  mixins: [list],

  data() {
    return {
    /* --- 头部搜索栏数据 --- */

      likeKeys: [
        { value: 'number', label: '知识点编号' },
        { value: 'name', label: '知识点名称' },
      ],
      likeKey: 'number',

      query: {
        'equal[subject_id]': 1,
      },

      subject: [
        { value: 1, display_name: '高中数学' },
        { value: 2, display_name: '高中英语' },
      ],

      /* --- 下方列表 --- */

      colConfig: [
        {
          title: '学员编号',
          key: 1,
          align: 'center',
        },
        {
          title: '学员姓名',
          key: 2,
          align: 'center',
        },
        {
          title: '学科',
          key: 3,
          align: 'center',
        },
        {
          title: '薄弱知识点个数',
          key: 4,
          align: 'center',
          sortable: 'custom',
        },
        {
          title: '总知识点个数',
          key: 5,
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

      /* 模拟列表数据 */
      buffer: {
        data: Array(10).fill({
          1: 3478,
          2: '正数与负数',
          3: 5,
          4: 2,
          5: '是',
        }),
      },
    }
  },

  methods: {
    // eslint-disable-next-line
    toCheck(row) {
      this.$router.push('/algorithm/knowledge/info')
    },
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">
.algorithm-knowledge {

}
</style>
