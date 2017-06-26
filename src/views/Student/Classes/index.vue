<template>
  <div class="student-class">

    <Form inline class="app-search-form">
      <Form-item>
        <Row>
          <Col span="11">
          <Date-picker type="date" v-model="formSearch.start" placeholder="选择日期"></Date-picker>
          </Col>
          <Col span="2" style="text-align: center">至</Col>
          <Col span="11">
          <Date-picker type="date" v-model="formSearch.end" placeholder="选择日期"></Date-picker>
          </Col>
        </Row>
      </Form-item>
      <Form-item>
        <Input type="text" v-model="formSearch.keyword" placeholder="请输入关键字"></Input>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search">搜索</Button>
      </Form-item>
    </Form>

    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
      <h2>班级管理</h2>
      </Col>
      <Col>
      <Button type="primary" @click="$router.push('/student/classes/edit')" >添加班级</Button>
      </Col>
    </Row>

    <!-- 班级学员管理模态框 -->
    <app-form-modal
      v-model="modal.manage"
      :title="`班级学员管理 : ${classId}`"
      :loading="loading.manage"
      @on-ok="manageSubmit('formManage')"
    >
      <Form ref="formManage">
        <Form-item>
          <Select v-model="formManage.student" placeholder="请选择学生..." filterable multiple>
            <Option v-for="item in studentList" :value="item.value" :key="item">{{ item.label }}</Option>
          </Select>
        </Form-item>
      </Form>
    </app-form-modal>

    <!-- 删除模态框 -->
    <app-warn-modal
      v-model="modal.delete"
      title="删除确认"
      :loading="loading.delete"
      @on-ok="deleteSubmit(classId)"
      action="删除"
    >
      <div class="text-center">删除该班级（{{classId}}）后将无法再回复，是否继续删除？</div>
    </app-warn-modal>

    <!--班级管理表格-->
    <Table class="app-table" :columns="columns" :data="list.data" border></Table>

    <!--分页-->
    <app-pager :data="list" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>

  </div>
</template>

<script>
/**
 * 学员管理 - 班级管理
 * @author zml
 * @version 2017-06-08
 * @version 2017-06-13
 * @version 2017-06-15
 * @version 2017-06-20
 */
import { mapState } from 'vuex'
import { list } from '@/mixins'
import { GLOBAL, STUDENT } from '@/store/mutationTypes'
import { createButton } from '@/utils'

export default {
  name: 'app-student-classes',

  mixins: [list],

  data() {
    return {
      // 搜索栏表单
      formSearch: {
        start: '',
        end: '',
        keyword: '',
      },
      // 学员管理表单
      formManage: {
        student: [],
      },
      // 学生列表
      studentList: [
        {
          value: '张三',
          label: '张三',
        },
        {
          value: '李四',
          label: '李四',
        },
        {
          value: '王五',
          label: '王五',
        },
        {
          value: '小六',
          label: '小六',
        },
        {
          value: '小七',
          label: '小七',
        },
        {
          value: '小八',
          label: '小八',
        },
      ],
       // 模态框配置
      modal: {
        manage: false,
        delete: false,
      },
      // 模态框确定按钮loading状态
      loading: {
        manage: false,
        delete: false,
      },
      // 表格配置
      columns: [
        { title: '班级名称', key: 'display_name', align: 'center', width: 130 },
        { title: '班级编号', key: 'classes_number', align: 'center', width: 100 },
        { title: '年级', key: 'grade_name', align: 'center', width: 120 },
        { title: '班主任', key: 'classes_director', align: 'center', width: 100 },
        // {
        //   title: '教师',
        //   key: 'teacher_item',
        //   align: 'center',
        //   render: (h, params) => {
        //     // 解构，const { xx } = obj 相当于 const xx in row { xx } = params.row
        //     const { teacher_item } = params.row
        //     // 相当于cosnt { teacher_id } = item
        //     // const text = teacher_item
        //     //   .map(({ teacher_id }) => `${teacher_id}`)
        //     //   .join('，')
        //     const text = teacher_item
        //       .reduce((result, item) => `${result} ${item.teacher_id}，`, '')
        //       .slice(0, -1)

        //     return h('span', text)
        //   },
        // },
        { title: '教师', key: 'teacher_item', align: 'center' },
        { title: '学员人数', key: 'student_total', align: 'center', width: 80 },
        { title: '开办日期', key: 'start_at', align: 'center' },
        { title: '创建日期', key: 'created_at', align: 'center' },
        { title: '状态', key: 'status_name', align: 'center' },
        {
          title: '操作',
          key: 10,
          align: 'center',
          width: 160,
          render: createButton([
            { text: '删除', type: 'error', isShow: ({ row }) => row.status_name === '未开班', click: row => this.openDeleteModal(row.id) },
            { text: '管理', type: 'primary', click: row => this.openManageModal(row.id) },
            { text: '编辑', type: 'primary', click: row => this.$router.push(`/student/classes/edit/${row.id}`) },
          ]),
        },
      ],
      //  班级编号（临时）
      classId: '',
      // location.search(query)
      query: {},
    }
  },

  computed: {
    // 使用mapState获取list
    ...mapState({
      list: state => state.student.classes.list,
    }),
  },

  methods: {
    // 打开班级学员管理模态框
    openManageModal(id) {
      this.modal.manage = true
      this.classId = id
    },


    // 打开删除班级模态框
    openDeleteModal(id) {
      this.modal.delete = true
      this.classId = id
    },

    // 班级学员管理表单提交
    manageSubmit() {
      this.loading.manage = true
      setTimeout(() => {
        this.loading.manage = false
        this.modal.manage = false
        this.$Message.success('提交成功！')
      }, 1500)
    },

    // 删除班级
    deleteSubmit(id) {
      this.classId = id
      this.loading.delete = true
      // 这个id用来请求删除接口
      this.$store.dispatch(STUDENT.CLASSES.DELETE, id)
      .then(() => {
        this.loading.delete = false
        this.modal.delete = false
        this.$Message.warning('删除成功！')
      })
    },

    // 根据接口和loaction.search（query）获取数据
    getData(qs) {
      this.$store.dispatch(STUDENT.CLASSES.INIT, qs)
        .then(() => {
          this.$router.push(`/student/classes${qs}`)
          // 关闭loading动画
          this.$store.commit(GLOBAL.LOADING.HIDE)
        })
    },

    // 列表筛选，（排序）（字段筛选）（暂不使用）
    search() {
      const { path } = this.$router.currentRoute
      this.$router.push(`${path}${this.qs}`)
      this.getData(this.qs)
    },
  },
}
</script>

<style lang="less" scoped>
@import '~vars';
</style>
