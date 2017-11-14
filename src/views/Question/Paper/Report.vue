<template>
  <div>
    <!-- 上方条件过滤 -->
    <ConditionRadio
      label="配置类型"
      :data="dimension"
      :tag="`equal[dimension]`"
    />

    <!-- 操作 -->
    <Row
      class="app-content-header"
      type="flex"
      justify="space-between"
    >
      <Col>
        <h2><Icon type="gear-b"/> 配置列表</h2>
      </Col>
      <Col>
        <Button
          type="primary"
          @click="openReferModal"
        >管理学校参考线</Button>
        <Button
          type="primary"
          @click="openRemarkModal('add')"
        >新增配置</Button>
      </Col>
    </Row>

    <!--配置列表-->
    <Table
      class="app-table"
      :columns="columns"
      :data="list.data"
      border
      @on-sort-change="sort"
    ></Table>

    <!--分页-->
    <app-pager
      :data="list"
      @on-change="goTo"
      @on-page-size-change="pageSizeChange"
    ></app-pager>

    <!-- 删除模态框 -->
    <app-warn-modal
      v-model="deleteModal.active"
      title="删除确认"
      :loading="deleteModal.loading"
      @on-ok="deleteItem"
      action="删除"
    >
      <div class="text-center">该试卷删除后将无法恢复，是否继续删除？</div>
    </app-warn-modal>

    <!-- 学校参考线弹窗 -->
    <refer-modal
      v-model="referModal.active"
      :data="referData"
      :campuses="campuses"
      @closeLabelModal="referModal.active = false"
    ></refer-modal>

    <remark-modal
      v-model="remarkModal.active"
      :isEdit="remarkModal.isEdit"
      @closeRemarkModal="remarkModal.active = false"
    ></remark-modal>

  </div>
</template>

<script>
/**
 * 题库中心 - 试卷 - 报告配置
 *
 * @author zhoumenglin
 */

import { GLOBAL } from '@/store/mutationTypes'
import { list } from '@/mixins'
import { createButton } from '@/utils'
import { ConditionRadio } from '@/views/components'
import ReferModal from './components/ReferModal'
import RemarkModal from './components/RemarkModal'

export default {
  name: 'QuestionPaperReport',

  mixins: [list],

  components: {
    ConditionRadio,
    ReferModal,
    RemarkModal,
  },

  data() {
    return {
      columns: [
        { title: '配置类型', key: '1', align: 'center' },
        { title: '配置子类型', key: '2', align: 'center' },
        { title: '匹配类型', key: '3', align: 'center' },
        { title: '匹配值', key: '4', align: 'center', width: 120 },
        { title: '评语', key: '5', align: 'center', width: 400 },
        {
          title: '操作',
          key: 10,
          align: 'center',
          render: createButton([
            {
              text: '删除',
              type: 'error',
              click: row => this.openDeleteModal(row.id),
            },
            {
              text: '编辑',
              type: 'success',
              click: row => this.openRemarkModal('edit', row.id),
            },
          ]),
        },
      ],

      // 配置id
      remarkId: null,

      // 配置类型数据源
      dimension: [],

      // 学校数据源
      campuses: [],

      // 评语弹窗配置参数
      remarkModal: {
        active: false,
        isEdit: false,
      },

      // 参考线弹窗配置参数
      referModal: {
        active: false,
      },

      // 删除弹窗配置参数
      deleteModal: {
        active: false,
        loading: false,
      },

      // 模拟列表假数据
      list: {
        data: Array(10).fill({
          id: 10086,
          1: '难度得分',
          2: '容易',
          3: '数值范围',
          4: '80-100',
          5: '整体学科水平较好，知识点综合运用熟练度及迁移能力有待提高。',
        }),
      },

      // 参考线假数据
      referData: Array(10).fill({
        school_id: 2,
        display_name: '厦门一中',
        normal: 75,
        high: 100,
      }),

    }
  },

  computed: {
    // 试卷id
    id() {
      return +this.$router.currentRoute.params.id
    },
  },

  methods: {
    // 打开删除弹窗
    openDeleteModal(id) {
      this.remarkId = id
      this.deleteModal.active = true
    },

    // 删除操作
    deleteItem() {
      this.deleteModal.loading = true

      // 这里要接口
      this.deleteModal.loading = false
      this.deleteModal.active = false
      this.$Message.warning('删除成功')
    },

    // 打开参考线弹窗
    openReferModal() {
      // 请求接口
      this.$Message.warning(`请求试卷id为${this.id}的参考线列表数据`)
      this.referModal.active = true
    },

    // 打开评语弹窗
    openRemarkModal(type, id) {
      this.remarkId = id
      this.remarkModal.active = true
      switch (type) {
        case 'edit':
          this.isEdit = true
          this.getDetailData(id)
          break

        default:
          this.isEdit = false
          break
      }
    },

    // 获取详情数据
    getDetailData(id) {
      this.$Message.warning(`请求id为${id}的详情数据`)
    },

    // 获取before接口数据
    getBeforeData() {
      this.$http.get(`/paper/${this.id}/refer/index_before`)
        .then(({ dimension, campuses }) => {
          this.dimension = dimension
          this.campuses = campuses
        })
        .catch(({ message }) => {
          this.errorNotice(message)
        })
    },

    // 接口错误处理
    errorNotice(message) {
      this.$Notice.error({
        title: message,
        duration: 0,
      })
    },
  },

  created() {
    this.getBeforeData()
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">

</style>
