<template>
  <div class="smartexam">

    <!-- 搜索 -->
    <Form inline class="app-search-form">
      <!-- 关键字 -->
      <Form-item>
        <Input v-model="likeValue" placeholder="请输入关键字">
          <Select
            v-model="likeKey"
            slot="prepend"
            style="width:6em;"
          >
            <Option
              v-for="likeKey in likeKeys"
              :key="likeKey.value"
              :value="likeKey.value"
            >{{ likeKey.label }}</Option>
          </Select>
        </Input>
      </Form-item>

      <!-- 测试时间 -->
      <Form-item>
        <Date-picker
          v-model="query['between[exam_time]']"
          format="yyyy-MM-dd"
          type="daterange"
          placeholder="请选择测试时间"
        ></Date-picker>
      </Form-item>

      <!-- 测试类型 -->
      <Form-item>
        <Select
          v-model="query['equal[exam_type]']"
          style="width:9em;"
          placeholder="请选择测试类型"
        >
          <Option
            v-for="item in exam_type"
            :value="item.value"
            :key="item.value"
          >{{ item.display_name }}</Option>
        </Select>
      </Form-item>

      <!-- 答题方式 -->
      <Form-item>
        <Select
          v-model="query['equal[answer_type]']"
          style="width:9em;"
          placeholder="请选择答题方式"
        >
          <Option
            v-for="item in answer_type"
            :value="item.value"
            :key="item.value"
          >{{ item.display_name }}</Option>
        </Select>
      </Form-item>

      <!-- 状态 -->
      <Form-item>
        <Select
          v-model="query['equal[status]']"
          style="width:9em;"
          placeholder="请选择状态"
        >
          <Option
            v-for="item in status"
            :value="item.value"
            :key="item.value"
          >{{ item.display_name }}</Option>
        </Select>
      </Form-item>

      <Form-item>
        <Button type="primary" icon="ios-search" @click="search">搜索</Button>
      </Form-item>
    </Form>

    <!-- 操作 -->
    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2>智能测试</h2>
      </Col>
      <Col>
        <Button type="primary" @click="openAddModal()" >添加测试</Button>
      </Col>
    </Row>

    <!--智能测试表格-->
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

    <!-- 删除弹窗 -->
    <app-warn-modal
      v-model="deleteModal.active"
      title="删除确认"
      :loading="deleteModal.loading"
      @on-ok="deleteSubmit()"
      action="删除"
    >
      <div class="text-center">删除该测试后将无法再回复，是否继续删除？</div>
    </app-warn-modal>

    <!-- 开始测试确认弹窗 -->
    <app-warn-modal
      v-model="startModal.active"
      title="开始测试"
      :loading="startModal.loading"
      @on-ok="startSubmit()"
      action="确定"
    >
      <div class="text-center">是否确定开始测试？</div>
    </app-warn-modal>

    <!-- 选择设备弹窗 -->
    <device-modal
      v-model="deviceModal.active"
      @closeDeviceModal="deviceModal.active = false"
    ></device-modal>

    <!-- 添加测试弹窗 -->
    <add-modal
      v-model="addModal.active"
      @closeAddModal="addModal.active = false"
    ></add-modal>

  </div>
</template>

<script>
/**
 * 测试管理 - 智能测试
 * @author zhoumenglin
 * @version 2017-10-18
 */
import { GLOBAL } from '@/store/mutationTypes'
import { list } from '@/mixins'
import { createButton } from '@/utils'
import DeviceModal from './components/DeviceModal'
import AddModal from './components/AddModal'

export default {
  name: 'app-examination-smartexam',

  mixins: [list],

  components: {
    DeviceModal,
    AddModal,
  },

  data() {
    return {
      likeKeys: [
        { label: '测试对象', value: 'display_name' },
        { label: '测试编号', value: 'number' },
      ],
      likeKey: 'display_name',
      query: {
        'equal[exam_type]': null,
        'equal[answer_type]': null,
        'equal[status]': null,
        'between[exam_time]': [],
      },

      columns: [
        { title: '测试编号', key: 'number', align: 'center', width: 100, sortable: 'custom' },
        { title: '测试对象', key: 'display_name', align: 'center' },
        { title: '课序', key: 'classes_order', align: 'center', width: 70, sortable: 'custom' },
        { title: '测试类型', key: 'exam_type', align: 'center', width: 100 },
        { title: '答题方式', key: 'answer_type', align: 'center', width: 80 },
        { title: '考试时长', key: 'exam_duration', align: 'center', width: 100, sortable: 'custom' },
        { title: '测试时间', key: 'exam_time', align: 'center' },
        { title: '状态', key: 'status', align: 'center', width: 80 },
        {
          title: '操作',
          align: 'center',
          render: createButton([
            { text: '删除', type: 'error', click: row => this.openDeleteModal(row.id) },
            { text: '查看试卷', type: 'primary', click: row => this.$router.push(`/prepare/prepareplan/${row.id}`) },
            { text: '阅卷', type: 'warning', click: row => this.$router.push(`/prepare/prepareplan/${row.id}`) },
            { text: '开始测试（线上）', type: 'success', click: row => this.openStartModal(row.id, 'online') },
            { text: '开始测试（线下）', type: 'success', click: row => this.openStartModal(row.id, 'offline') },
          ]),
        },
      ],

      // 列表假数据
      list: {
        data: Array(10).fill(null).map(() => ({
          id: 34,
          number: 100010,
          display_name: '初一数学加强尖子一对一班 000001',
          classes_order: 3,
          exam_type: '日常测试',
          answer_type: '线上',
          exam_duration: 60,
          exam_time: '2017-06-08 16:20',
          status: '待阅卷',
        })),
      },

      // 测试类型假数据源
      exam_type: [
        {
          display_name: '日常测试',
          value: 1,
        },
        {
          display_name: '课堂练习',
          value: 2,
        },
        {
          display_name: '课后练习',
          value: 3,
        },
        {
          display_name: '入学测试',
          value: 4,
        },
      ],

      // 答题方式假数据源
      answer_type: [
        {
          display_name: '线上',
          value: 1,
        },
        {
          display_name: '线下',
          value: 2,
        },
      ],

      // 测试状态假数据源
      status: [
        {
          display_name: '待测试',
          value: 1,
        },
        {
          display_name: '待阅卷',
          value: 2,
        },
        {
          display_name: '已阅卷',
          value: 3,
        },
      ],

      currentId: null, // 当前选中的测试id

      // 删除弹窗
      deleteModal: {
        active: false,
        loading: false,
      },

      // 开始测试弹窗
      startModal: {
        active: false,
        loading: false,
      },

      // 选择设备弹窗
      deviceModal: {
        active: false,
      },

      // 添加测试弹窗
      addModal: {
        active: false,
      },
    }
  },

  methods: {
    // 打开添加测试弹窗
    openAddModal() {
      this.addModal.active = true
    },

    // 打开删除弹窗
    openDeleteModal(id) {
      this.currentId = id
      this.deleteModal.active = true
    },

    // 确认删除
    deleteSubmit() {
      // 这里到时候走删除store
      this.deleteModal.loading = true
      setTimeout(() => {
        this.deleteModal.active = false
        this.deleteModal.loading = false
        this.$Message.warning('删除成功')
      }, 1500)
    },

    // 打开开始测试弹窗
    openStartModal(id, type) {
      this.currentId = id
      if (type === 'offline') {
        this.startModal.active = true
      } else {
        this.deviceModal.active = true
      }
    },

    // 确认开始线下测试
    startSubmit() {
      // 这里到时候走开始线下测试store
      this.startModal.loading = true
      setTimeout(() => {
        this.startModal.active = false
        this.startModal.loading = false
        this.$Message.warning('测试已开始')
      }, 1500)
    },
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">
.smartexam {

}
</style>
