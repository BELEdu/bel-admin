<template>
  <div>

    <Form inline class="app-search-form">
      <Form-item>
        <Input type="text" placeholder="请输入关键字"></Input>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search">搜索</Button>
      </Form-item>
    </Form>

    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2>历史计划</h2>
      </Col>
    </Row>

    <Table class="app-table" :columns="columns" :data="hdata" border></Table>

    <app-pager :data="pager" @on-change="() => {}"></app-pager>

    <!--班级详情组件-->
    <history-modal
      v-model="modal.history"
      @closeClassesModal="modal.history = false"
    >
    </history-modal>

  </div>
</template>

<script>
/**
 * 学员管理 - 学习进度 - 详情主组件- 历史计划子组件
 * @author zml
 * @version 2017-07-04
 */

import { GLOBAL } from '@/store/mutationTypes'
import { createButton } from '@/utils'
import HistoryModal from '../components/HistoryModal'
import hdata from '../Data/hdata'

export default {
  name: 'app-student-studyprogress-detail-history',

  props: {
    type: {
      type: String,
      required: true,
    },
    id: {
      type: [Number, String],
      required: true,
    },
  },

  data() {
    return {

      modal: {
        history: false,
      },

      columns: [
        { title: '科目', key: 1, align: 'center' },
        { title: '计划开始时间', key: 2, align: 'center' },
        { title: '计划结束时间', key: 3, align: 'center' },
        { title: '实际上课课时', key: 4, align: 'center' },
        { title: '知识点总数', key: 5, align: 'center' },
        {
          title: '操作',
          key: 6,
          align: 'center',
          render: createButton([
            { text: '查看', type: 'primary', click: row => this.openHistoryModal(row.id) },
          ]),
        },
      ],

      hdata, // 表格数据

      pager: undefined, // 分页配置
    }
  },

  methods: {
    openHistoryModal(id) {
      this.modal.history = true
      this.$Message.info(`编号${id}`)
    },
  },

  components: {
    HistoryModal,
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
    this.$route.meta.breadcrumb[1].link = `/student/studyprogress/${this.type}`
  },
}
</script>

<style lang="less">
@import "~vars.less";
</style>

