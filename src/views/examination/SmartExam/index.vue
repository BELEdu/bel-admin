<template>
  <div class="smartexam">
    <!-- 搜索 -->
    <App-table-form @on-submit="search">
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
        <app-date-picker
          style="width:20em;"
          v-model="query['between[test_at]']"
          format="yyyy-MM-dd HH:mm"
          type="datetimerange"
          placeholder="请选择测试时间"
        ></app-date-picker>
      </Form-item>

      <!-- 测试类型 -->
      <Form-item>
        <Select
          v-model="query['equal[test_type]']"
          style="width:9em;"
          placeholder="请选择测试类型"
        >
          <Option
            v-for="item in test_type"
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
          v-model="query['equal[test_status]']"
          style="width:9em;"
          placeholder="请选择状态"
        >
          <Option
            v-for="item in test_status"
            :value="item.value"
            :key="item.value"
          >{{ item.display_name }}</Option>
        </Select>
      </Form-item>
    </App-table-form>

    <!-- 操作 -->
    <Row
      class="app-content-header"
      type="flex"
      justify="space-between"
    >
      <Col>
        <h2><Icon type="android-menu"/> {{isMySmartExam?"我的测试":"智能测试"}}</h2>
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
      <div class="text-center">
        删除该编号为
        <span class="color-primary">{{currentId}}</span>
        的测试后将无法再回复，<br>是否继续删除？
      </div>
    </app-warn-modal>

    <!-- 选择设备（开始测试）弹窗 -->
    <device-modal
      v-model="deviceModal.active"
      :students="student_data"
      :answer-type='currentAnswerType'
      :test-number="currentId"
      @closeDeviceModal="deviceModal.active = false"
      @update="fetchData"
    ></device-modal>

    <!-- 添加测试弹窗 -->
    <add-modal
      v-model="addModal.active"
      @closeAddModal="addModal.active = false"
      @update="goTo(1)"
    ></add-modal>

  </div>
</template>

<script>
/**
 * 测试管理 - 智能测试
 * @author zhoumenglin
 * @version 2017-10-18
 */

import { mapState } from 'vuex'
import { EXAMINATION } from '@/store/mutationTypes'
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
        { label: '测试对象', value: 'test_object_name' },
        { label: '测试编号', value: 'id' },
      ],
      likeKey: 'test_object_name',
      query: {
        'equal[test_type]': null,
        'equal[answer_type]': null,
        'equal[test_status]': null,
        'between[test_at]': [],
      },

      columns: [
        { title: '测试编号', key: 'id', align: 'center', width: 100, sortable: 'custom' },
        { title: '测试对象', key: 'test_object_name', align: 'center' },
        { title: '课序', key: 'course_sort', align: 'center', width: 70, sortable: 'custom' },
        { title: '测试类型', key: 'test_type_name', align: 'center', width: 100 },
        { title: '答题方式', key: 'answer_type_name', align: 'center', width: 80 },
        { title: '考试时长', key: 'duration', align: 'center', width: 100, sortable: 'custom' },
        { title: '测试时间', key: 'test_at', align: 'center' },
        { title: '状态', key: 'test_status_name', align: 'center', width: 80 },
        {
          title: '操作',
          align: 'center',
          render: createButton([
            {
              text: '删除',
              type: 'error',
              isShow: ({ row }) => row.operation.destroy,
              click: row => this.openDeleteModal(row.id),
            },
            {
              text: '查看试卷',
              type: 'primary',
              isShow: ({ row }) => row.operation.show,
              click: row => this.$router.push(`/examination/smartexam/${row.id}/preview`),
            },
            {
              text: '阅卷',
              type: 'warning',
              isShow: ({ row }) => row.operation.inspection && row.test_status === 3,
              click: row => this.$router.push(`/examination/smartexam/${row.id}/check`),
            },
            {
              text: '查看阅卷',
              type: 'success',
              isShow: ({ row }) => row.operation.inspection && row.test_status === 4,
              click: row => this.$router.push(`/examination/smartexam/${row.id}/check`),
            },
            {
              text: '开始测试',
              type: 'success',
              isShow: ({ row }) => row.operation.start,
              click: row => this.openStartModal(row.id, row.answer_type),
            },
          ]),
        },
      ],

      // 列表假数据
      list2: {
        data: Array(10).fill(null).map(() => ({
          id: 34,
          test_number: 100010,
          test_object_name: '初一数学加强尖子一对一班 000001',
          course_sort: 3,
          test_type_name: '日常测试',
          answer_type_name: '线上',
          duration: 60,
          test_at: '2017-06-08 16:20',
          test_status_name: '待阅卷',
        })),
      },

      currentId: null, // 当前选中的测试id
      currentAnswerType: 1, // 当前测试的答题方式 1：线上 2：线下

      // 删除弹窗
      deleteModal: {
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

  computed: {
    ...mapState({
      list: state => state.examination.smartexam.list,
      student_data: state => state.examination.smartexam.student_data,
      test_type: state => state.dicts.test_type,
      test_status: state => state.dicts.test_status,
      answer_type: state => state.dicts.answer_type,
    }),

    isMySmartExam() { // 当前路由是否是 “我的测试”
      return this.$route.path === '/examination/mysmartexam'
    },
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

      this.$store.dispatch(EXAMINATION.SMARTEXAM.DELETE, this.currentId)
        .then(() => {
          this.deleteModal.active = false
          this.deleteModal.loading = false
          this.$Message.warning('删除成功！')
        })
        .catch(({ message }) => {
          this.$Message.error(message)
        })
    },

    // 打开开始测试弹窗
    openStartModal(id, answerType) {
      this.currentId = id
      this.currentAnswerType = answerType

      this.$store.dispatch(EXAMINATION.SMARTEXAM.STUDENT_DATA, id)
        .then((res) => {
          this.currentStudents = res
          this.deviceModal.active = true
        })
        .catch(({ message }) => {
          this.$Message.error(message)
        })
    },

    // 获取测试数据，根据是否在 “我的测试” 列表，请求不同接口
    getData(qs) {
      if (this.isMySmartExam) {
        return this.$store.dispatch(EXAMINATION.SMARTEXAM.MY, qs)
      }
      return this.$store.dispatch(EXAMINATION.SMARTEXAM.INIT, qs)
    },
  },

  created() {

  },
}
</script>

<style lang="less">
.smartexam {

}
</style>
