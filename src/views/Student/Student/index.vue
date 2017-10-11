<template>
  <div class="student-info">

    <Form inline class="app-search-form">
      <!-- 关键字搜索 -->
      <Form-item>
        <Input
          v-model="likeValue"
          placeholder="请输入关键字"
        >
          <Select
            v-model="likeKey"
            slot="prepend"
            style="width:7em;"
          >
            <Option
              v-for="likeKey in likeKeys"
              :key="likeKey.value"
              :value="likeKey.value"
            >{{ likeKey.label }}</Option>
          </Select>
        </Input>
      </Form-item>

      <!-- 在读学校 -->
      <Form-item>
        <Select
          v-model="query['equal[current_school]']"
          style="width:9em;"
          placeholder="选择在读学校"
        >
          <Option
            v-for="school in current_school_list"
            :value="school.id"
            :key="school.id"
          >{{ school.display_name }}</Option>
        </Select>
      </Form-item>

      <!-- 当前年级 -->
      <Form-item>
        <Select
          v-model="query['equal[current_grade]']"
          style="width:9em;"
          placeholder="请选择当前年级"
        >
          <Option
            v-for="grade in grades"
            :value="grade.value"
            :key="grade.value"
          >{{ grade.display_name }}</Option>
        </Select>
      </Form-item>

      <!-- 首签日期 -->
      <Form-item>
        <Date-picker
          v-model="query['between[original_contractor_at]']"
          format="yyyy-MM-dd"
          type="daterange"
          placeholder="请选择首签日期"
        ></Date-picker>
      </Form-item>

      <!-- 搜索按钮 -->
      <Form-item>
        <Button
          type="primary"
          icon="ios-search"
          @click="search"
        >搜索</Button>
      </Form-item>
    </Form>

    <!-- 操作按钮 -->
    <Row
      class="app-content-header"
      type="flex"
      justify="space-between"
    >
      <Col>
        <h2>学员列表</h2>
      </Col>
      <Col>
        <Button type="primary" @click="openManageModal">分配学管师</Button>
        <!-- <Button type="primary" @click="$router.push('/student/student/edit')">添加学员旧</Button> -->
        <Button type="primary" @click="$router.push('/student/student/add')">添加学员</Button>
      </Col>
    </Row>

    <!-- 删除模态框 -->
    <app-warn-modal
      v-model="modal.delete"
      title="删除确认"
      :loading="loading.delete"
      @on-ok="studentDelete(studentId)"
      action="删除"
    >
      <div class="text-center">是否删除该编号为{{studentId}}的学员？</div>
    </app-warn-modal>

    <!-- 分配学管师组件 -->
    <manage-modal
      v-model="modal.manage"
      @closeManageModal="modal.manage = false"
      :studentItem="studentItem"
      @update="fetchData"
    ></manage-modal>

    <!-- 学员信息表格 -->
    <Table
      class="app-table"
      :columns="columns"
      :data="list.data"
      border
      @on-selection-change="onSelectionChange"
      @on-sort-change="sort"
    ></Table>

    <!-- 分页 -->
    <app-pager
      :data="list"
      @on-change="goTo"
      @on-page-size-change="pageSizeChange"
    ></app-pager>

  </div>
</template>

<script>
/**
 * 学员管理 - 学员信息
 * @author zml
 * @version 2017-06-08
 * @version 2017-06-13
 */

import { mapState } from 'vuex'
import { list } from '@/mixins'
import { STUDENT } from '@/store/mutationTypes'
import { createButton } from '@/utils'
import ManageModal from './components/ManageModal'

export default {
  name: 'app-student-student',

  mixins: [list],

  components: {
    ManageModal,
  },

  data() {
    return {
      likeKeys: [
        { label: '学员姓名', value: 'display_name' },
        { label: '学员编号', value: 'number' },
        { label: '归属学管师', value: 'belong_customer_relationships_name' },
      ],
      likeKey: 'display_name',
      query: {
        'equal[current_school]': '',
        'equal[current_grade]': '',
        'between[original_contractor_at]': [],
      },

      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
        },
        { title: '学员姓名', key: 'display_name', align: 'center' },
        { title: '学员编号', key: 'number', align: 'center', width: 180, sortable: 'custom' },
        { title: '首签日期', key: 'original_contractor_at', align: 'center', width: 180, sortable: 'custom' },
        { title: '在读学校', key: 'current_school', align: 'center' },
        { title: '当前年级', key: 'current_grade_name', align: 'center' },
        { title: '归属学管师', key: 'study_teacher_id', align: 'center' },
        { title: '总课时', key: 'course_total', align: 'center', sortable: 'custom' },
        {
          title: '剩余总课时',
          key: 'course_remain',
          align: 'center',
          sortable: 'custom',
          render: (h, params) => { // 剩余课时小于10的时候变红
            const { course_remain } = params.row
            const className = +course_remain < 10 ? 'color-error' : ''
            return h('span', {
              class: className,
            }, course_remain)
          },
        },
        { title: '状态', key: 'student_current_status_name', align: 'center' },
        {
          title: '操作',
          key: 13,
          align: 'center',
          width: 200,
          render: createButton([
            { text: '删除', type: 'error', isShow: ({ row }) => row.operation.destroy, click: row => this.openDeleteModal(row.id) },
            { text: '编辑', type: 'primary', click: row => this.$router.push(`/student/student/${row.id}/editold`) },
            { text: '编辑', type: 'success', click: row => this.$router.push(`/student/student/${row.id}/edit`) },
            { text: '查看', type: 'primary', click: row => this.$router.push(`/student/student/${row.id}/info`) },
          ]),
        },
      ],

      modal: {// 模态框状态
        manage: false,
        delete: false,
      },

      loading: { // 模态框按钮loading状态
        delete: false,
      },

      studentId: '', // 学员编号（用于删除学员）
      studentItem: [], // 勾选的学生id数组（用于分配学管师）
      current_school_list: [ // 在读校区列表临时数据
        {
          id: 1,
          display_name: '厦门一中',
        },
        {
          id: 2,
          display_name: '双十中学',
        },
        {
          id: 3,
          display_name: '外国语学校',
        },
        {
          id: 4,
          display_name: '蔡塘学校',
        },
      ],

    }
  },

  computed: {
    ...mapState({
      list: state => state.student.student.list,
      grades: state => state.dicts.grade,
    }),
  },

  methods: {
    openManageModal() { // 打开分配学管师弹窗
      if (this.studentItem.length > 0) {
        this.modal.manage = true
      } else {
        this.$Message.warning('请先选择要分配学管师的学员')
      }
    },

    onSelectionChange(selection) { // 获取选中的学生ID（iview表格自带）
      this.studentItem = selection.map(item => item.id)
    },

    getData(qs) { // 获取列表数据
      return this.$store.dispatch(STUDENT.STUDENT.INIT, qs)
    },

    openDeleteModal(id) { // 打开删除模态框
      this.modal.delete = true
      this.studentId = id
    },

    studentDelete(id) { // 删除未签约学员
      this.studentId = id
      this.loading.delete = true
      this.$store.dispatch(STUDENT.STUDENT.DELETE, id)
        .then(() => {
          this.loading.delete = false
          this.modal.delete = false
          this.$Message.warning('删除成功！')
        })
    },
  },

  created() {

  },
}
</script>

<style lang="less">
@import '~vars';
</style>
