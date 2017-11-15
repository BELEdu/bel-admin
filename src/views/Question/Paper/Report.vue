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
      <div class="text-center">该评语删除后将无法恢复，是否继续删除？</div>
    </app-warn-modal>

    <!-- 学校参考线弹窗 -->
    <refer-modal
      v-model="referModal.active"
      :id="id"
      :data="referModal.data"
      :campuses="campuses"
      @closeReferModal="referModal.active = false"
      @updateData="openReferModal"
    ></refer-modal>

    <!-- 新增/编辑评语弹窗 -->
    <remark-modal
      v-model="remarkModal.active"
      :id="id"
      :remarkId="remarkId"
      :isEdit="remarkModal.isEdit"
      :form="remarkModal.form"
      :types="types"
      @closeRemarkModal="remarkModal.active = false"
      @update="fetchData"
    ></remark-modal>

  </div>
</template>

<script>
/**
 * 题库中心 - 试卷 - 报告配置
 *
 * @author zhoumenglin
 */

import { mapState } from 'vuex'
import { QUESTION } from '@/store/mutationTypes'
import { list } from '@/mixins'
import { createButton } from '@/utils'
import { ConditionRadio } from '@/views/components'
import ReferModal from './components/ReferModal'
import RemarkModal from './components/RemarkModal'

// 默认表单
const defaultForm = {
  dimension: null, // 配置类型
  sub_dimension: null, // 配置子类型
  match_type: null, // 匹配类型
  match_start: 0, // 匹配值 - 起始
  match_end: 0, // 匹配值 - 结束
  description: '', // 评语
}

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
        { title: '配置类型', key: 'dimension_name', align: 'center' },
        { title: '配置子类型', key: 'sub_dimension_name', align: 'center' },
        { title: '匹配类型', key: 'match_type_name', align: 'center' },
        { title: '匹配值', key: 'match_range', align: 'center', width: 120 },
        { title: '评语', key: 'description', align: 'center', width: 400 },
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

      // 配置类型数据源（列表用）
      dimension: [],

      // 学校数据源
      campuses: [],

      // 配置类型数据源（编辑弹窗用）
      types: [],

      // 评语弹窗配置参数
      remarkModal: {
        active: false,
        isEdit: false,
        form: { ...defaultForm },
      },

      // 参考线弹窗配置参数
      referModal: {
        data: [],
        active: false,
      },

      // 删除弹窗配置参数
      deleteModal: {
        active: false,
        loading: false,
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
    ...mapState({
      list: state => state.question.report.list,
    }),

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

      this.$store.dispatch(QUESTION.REPORT.DELETE, {
        id: this.id,
        remarkId: this.remarkId,
      })
        .then(() => {
          this.deleteModal.loading = false
          this.deleteModal.active = false
          this.$Message.warning('删除成功！')
        })
        .catch(({ message }) => {
          this.deleteModal.loading = false
          this.$Message.warning(message)
        })
    },

    // 打开参考线弹窗
    openReferModal() {
      this.$http.get(`/paper/${this.id}/refer_school`)
        .then((res) => {
          this.referModal.data = res
          this.referModal.active = true
        })
        .catch(({ message }) => {
          this.errorNotice(message)
        })
    },

    // 打开评语弹窗
    openRemarkModal(type, id) {
      this.remarkId = id || null

      switch (type) {
        case 'edit':
          this.remarkModal.isEdit = true
          this.getDetailData()
          break

        default:
          this.remarkModal.isEdit = false
          this.remarkModal.active = true
          break
      }
    },

    // 获取详情数据
    getDetailData() {
      this.$http.get(`/paper/${this.id}/refer/${this.remarkId}`)
        .then((res) => {
          this.remarkModal.form = { ...res }
          this.remarkModal.active = true
        })
        .catch(({ message }) => {
          this.errorNotice(message)
        })
    },

    // 获取before接口数据
    getBeforeData() {
      this.$http.get(`/paper/${this.id}/refer/index_before`)
        .then(({
          dimension,
          campuses,
          types,
        }) => {
          this.dimension = dimension
          this.campuses = campuses
          this.types = types
        })
        .catch(({ message }) => {
          this.errorNotice(message)
        })
    },

    // 获取列表数据
    getData(qs) {
      return this.$store.dispatch(QUESTION.REPORT.INIT, { qs, id: this.id })
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
  },
}
</script>

<style lang="less">

</style>
