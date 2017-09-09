<template>
  <div class="algorithm-knowledge-info">
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
              :key="likeKey.value"
              :value="likeKey.value"
            >
              {{ likeKey.label }}
            </Option>
          </Select>
        </Input>
      </Form-item>
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

    <div class="app-content-topbar">
      <h2>知识点详情列表</h2>
      <span>知识点列表</span>
      <span>薄弱知识点：70个</span>
      <span>总知识点： 172个</span>
      <Button
        :type="statisticType
          ? 'primary'
          : 'warning'"
        @click="onToggleList"
      >
        {{statisticType
          ? '显示明细列表'
          : '显示统计列表'
        }}
      </Button>
    </div>

    <!-- 统计列表 -->
    <div
      v-if="statisticType"
    >
      <Table border
        :columns="statisticColConfig"
        :data="statistics"
        @on-sort-change="sort"
      ></Table>

      <!-- <app-pager
        :data="buffer"
        @on-change="goTo"
        @on-page-size-change="pageSizeChange"
      ></app-pager> -->
    </div>

    <!-- 明细列表 -->

    <div
      v-if="!statisticType"
    >
      <Table border
        :columns="detailColConfig"
        :data="details"
        @on-sort-change="sort"
      ></Table>

      <!-- <app-pager
        :data="buffer"
        @on-change="goTo"
       @on-page-size-change="pageSizeChange"
      ></app-pager> -->
    </div>

    <!-- 查看知识点明细 -->
    <Modal
      class="algorithm-knowledge-info__info"
      v-model="infoModal.active"
      title="知识点详情"
    >
      <h4
        class="info__title"
      >知识点：正数与负数</h4>
      <Table border
        :columns="infoColConfig"
        :data="infos"
      ></Table>
    </Modal>
  </div>
</template>

<script>
/**
 * 算法中心 - 学员知识详情
 *
 * @author
 */

import { GLOBAL } from '@/store/mutationTypes'
import list from '@/mixins/list'
import { createButton } from '@/utils'

export default {
  name: '',

  mixins: [list],

  data() {
    return {
      /* --- 搜索 --- */

      likeKeys: [
        { value: 'number', label: '知识点编号' },
        { value: 'name', label: '知识点名称' },
      ],

      likeKey: 'number',

      /* --- 列表 --- */

      statisticType: true,

      /* 统计列表 */

      statisticColConfig: [
        {
          title: '知识点编号',
          key: 1,
          align: 'center',
        },
        {
          title: '知识点名称',
          key: 2,
          align: 'center',
        },
        {
          title: '测试频次',
          key: 3,
          align: 'center',
          sortable: 'custom',
        },
        {
          title: '错误频次',
          key: 4,
          align: 'center',
          sortable: 'custom',
        },
        {
          title: '是否薄弱',
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
            click: this.toCheckInfo,
          }]),
        },
      ],

      statistics: Array(10).fill({
        1: 3478,
        2: '正数与负数',
        3: 5,
        4: 2,
        5: '是',
      }),

      /* 某知识点详情列表 */

      infoModal: {
        active: true,
      },

      infoColConfig: [
        {
          title: '题目ID',
          key: 1,
          align: 'center',
        },
        {
          title: '是否正确',
          key: 2,
          align: 'center',
        },
        {
          title: '测试时间',
          key: 3,
          align: 'center',
        },
        {
          title: '测试ID',
          key: 4,
          align: 'center',
        },
      ],

      infos: Array(8).fill({
        1: '1019154102',
        2: '是',
        3: '2017-06-08',
        4: 'WYW1057481',
      }),

      /* 详情列表 */

      detailColConfig: [
        {
          title: '知识点编号',
          key: 1,
          align: 'center',
        },
        {
          title: '知识点名称',
          key: 2,
          align: 'center',
        },
        {
          title: '题目编号',
          key: 3,
          align: 'center',
        },
        {
          title: '是否正确',
          key: 4,
          align: 'center',
        },
        {
          title: '测试时间',
          key: 5,
          align: 'center',
        },
        {
          title: '测试编号',
          key: 6,
          align: 'center',
        },
      ],

      details: Array(10).fill({
        1: 3478,
        2: '正数与负数',
        3: 1019154102,
        4: '是',
        5: '2017-06-08',
        6: 'WYW1057481',
      }),
    }
  },

  methods: {
    onToggleList() {
      this.statisticType = !this.statisticType
    },
    toCheckInfo() {
      this.infoModal.active = true
    },
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">
.algorithm-knowledge-info {

  &__info {

    & .info__title {
      margin-bottom: 15px;
      font-weight: normal;
    }
  }
}
</style>
