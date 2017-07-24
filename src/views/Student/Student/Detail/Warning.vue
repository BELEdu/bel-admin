<template>
  <div>
    <!-- 搜索表单 -->
    <Form inline class="app-search-form">
      <Form-item>
        <Input v-model="query.like[likeKey]" placeholder="请输入关键字">
          <Select v-model="likeKey" slot="prepend" style="width:6em;">
            <Option v-for="likeKey in likeKeys" :key="likeKey.value" :value="likeKey.value">{{ likeKey.label }}</Option>
          </Select>
        </Input>
     </Form-item>
     <Form-item>
        <Select v-model="query.equal.warning_type" style="width:9em;" placeholder="请选择预警类型">
          <Option v-for="item in warning_type" :value="item.value" :key="item.display_name">{{item.display_name}}</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Select v-model="query.equal.warning_status" style="width:9em;" placeholder="请选择预警状态">
          <Option v-for="item in warning_status" :value="item.value" :key="item.display_name">{{item.display_name}}</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Date-picker v-model="query.between.time" type="daterange" placeholder="请选择预警时间"></Date-picker>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search" @click="search">搜索</Button>
      </Form-item>
    </Form>

    <!-- 操作按钮 -->
    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2>预警记录</h2>
      </Col>
    </Row>

    <!-- 解决预警信息组件 -->
    <warning-ok-modal
      v-model="modal.ok"
      @closeWarningOkModal="modal.ok=false"
      :warningId="warningId"
      :warningStatus="warningStatus"
      @updateData="updateData"
    ></warning-ok-modal>

    <!-- 取消预警信息组件 -->
    <warning-cancel-modal
      v-model="modal.cancel"
      @closeWarningCancelModal="modal.cancel=false"
      :warningId="warningId"
      :warningStatus="warningStatus"
      @updateData="updateData"
    ></warning-cancel-modal>

    <!-- 预警信息列表 -->
    <Table class="app-table" :columns="columns" :data="list.data" border @on-sort-change="sort"></Table>

    <!-- 分页 -->
    <app-pager :data="list" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>

  </div>
</template>

<script>
/**
 * 学员管理 - 学员信息 - 学员详情 - 预警信息
 * @author zml
 * @version 2017-06-14
 */
import { mapState } from 'vuex'
import { list } from '@/mixins'
import { STUDENT } from '@/store/mutationTypes'
import { createButton } from '@/utils'
import WarningOkModal from '../components/WarningOkModal'
import WarningCancelModal from '../components/WarningCancelModal'


export default {
  name: 'app-student-student-detail-warning',

  mixins: [list],

  data() {
    return {
      likeKeys: [
        { label: '预警ID', value: 'id' },
      ],
      likeKey: 'id',
      query: {
        equal: {
          warning_type: '',
          warning_status: '',
        },
        between: {
          time: [],
        },
      },

      columns: [
        { title: '预警ID', key: 'id', align: 'center', sortable: 'custom' },
        { title: '预警类型', key: 'warning_type', align: 'center' },
        { title: '预警时间', key: 'created_at', align: 'center', sortable: 'custom' },
        { title: '操作人', key: 'user_name', align: 'center' },
        { title: '操作人岗位', key: '', align: 'center' },
        { title: '预警原因', key: 'warning_reason', align: 'center' },
        { title: '状态', key: 'warning_status', align: 'center' },
        {
          title: '操作',
          key: 8,
          align: 'center',
          width: 160,
          render: createButton([
            { text: '取消预警', type: 'primary', click: row => this.OpenWarningCancelModal(row.id, row.warning_status) },
            { text: '已解决', type: 'primary', click: row => this.OpenWarningOkModal(row.id, row.warning_status) },
          ]),
        },
      ],

      // 弹窗控制
      modal: {
        cancel: false,
        ok: false,
      },

      warningId: 0, // 预警Id
      warningStatus: 0, // 预警状态
    }
  },

  computed: {
    ...mapState({
      list: state => state.student.warning.list,
      warning_status: state => state.dicts.warning_status,
      warning_type: state => state.dicts.warning_type,
    }),

    studentId() {
      return +this.$router.currentRoute.params.studentId
    },
  },

  components: {
    WarningOkModal,
    WarningCancelModal,
  },

  methods: {
    OpenWarningOkModal(id, status) { // 打开解决预警弹窗
      this.warningId = id
      this.warning_status = status
      this.modal.ok = true
    },

    OpenWarningCancelModal(id, status) { // 打开取消预警弹窗
      this.warningId = id
      this.warning_status = status
      this.modal.cancel = true
    },

    getData(qs) { // 获取列表数据
      return this.$store.dispatch(STUDENT.STUDENT.WARNING.INIT, {
        id: this.studentId,
        query: qs,
      })
    },
  },

}
</script>

<style lang="less">
@import '~vars';
</style>
