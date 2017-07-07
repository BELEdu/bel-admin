<template>
  <div class="student-class">

    <Form inline class="app-search-form">
       <Form-item>
        <Input v-model="query.like[likeKey]" placeholder="请输入关键字">
          <Select v-model="likeKey" slot="prepend" style="width:6em;">
            <Option v-for="likeKey in likeKeys" :key="likeKey.value" :value="likeKey.value">{{ likeKey.label }}</Option>
          </Select>
        </Input>
      </Form-item>
      <Form-item>
        <Select v-model="query.equal.current_grade" style="width:8em;" placeholder="请选择年级" >
          <Option v-for="grade in grades" :value="grade.value" :key="grade.display_name">{{ grade.display_name }}</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Select v-model="query.equal.status" placeholder="请选择状态" style="width:7em;">
          <Option :value="1">未开班</Option>
          <Option :value="2">开班中</Option>
          <Option :value="3">已结束</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Date-picker v-model="query.between.start_at" format="yyyy-MM-dd" type="daterange" placeholder="请选择开班日期"></Date-picker>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search" @click="search">搜索</Button>
      </Form-item>
    </Form>

    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2><Icon type="ios-browsers"/> 班级管理</h2>
      </Col>
      <Col>
        <Button type="primary" @click="$router.push('/student/classes/edit')" >添加班级</Button>
      </Col>
    </Row>

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

    <!--学员管理组件-->
    <manage-modal
      v-model="modal.manage"
      :classId="classId"
      @closeManageModal="modal.manage=false"
      :form="form"
      :studentData="student_data"
    >
    </manage-modal>

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
import { STUDENT } from '@/store/mutationTypes'
import { createButton } from '@/utils'
import ManageModal from './components/ManageModal'

export default {
  name: 'app-student-classes',

  mixins: [list],

  data() {
    return {
      likeKeys: [
        { label: '班级名称', value: 'display_name' },
        { label: '班级编号', value: 'classes_number' },
        { label: '产品名称', value: '111' },
        { label: '产品类型', value: '111' },
      ],

      likeKey: 'display_name',

      query: {
        equal: {
          current_grade: null,
          status: null,
        },
        between: {
          start_at: [],
        },
      },

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
        { title: '开班日期', key: 'start_at', align: 'center' },
        { title: '创建日期', key: 'created_at', align: 'center' },
        { title: '状态', key: 'status_name', align: 'center' },
        {
          title: '操作',
          key: 10,
          align: 'center',
          width: 180,
          render: createButton([
            { text: '删除', type: 'error', isShow: ({ row }) => row.status_name === '未开班', click: row => this.openDeleteModal(row.id) },
            { text: '管理', type: 'primary', click: row => this.openManageModal(row.id) },
            { text: '编辑', type: 'primary', click: row => this.$router.push(`/student/classes/edit/${row.id}`) },
          ]),
        },
      ],

      modal: { // 模态框
        manage: false,
        delete: false,
      },

      loading: {
        delete: false,
      },

      classId: 0, //  班级编号（管理班级学员用）

      form: {}, // 班级表单数据（管理班级学员用）

      student_data: [], // 学生数据源（管理班级学员用）
    }
  },

  computed: {
    // 使用mapState获取list
    ...mapState({
      list: state => state.student.classes.list,
      grades: state => state.dicts.grade,
    }),
  },

  components: {
    ManageModal,
  },

  methods: {
    // 打开班级学员管理模态框
    openManageModal(id) {
      this.modal.manage = true
      this.classId = id
      this.$http.get(`/classes/${id}`)
        .then((res) => {
          const {
            student_data,
            ...others
          } = res

          this.form = { ...others }
          this.student_data = student_data
        })
    },

    // 打开删除班级模态框
    openDeleteModal(id) {
      this.modal.delete = true
      this.classId = id
    },

    // 删除班级
    deleteSubmit(id) {
      this.classId = id
      this.loading.delete = true
      // 班级id用来请求删除接口
      this.$store.dispatch(STUDENT.CLASSES.DELETE, id)
      .then(() => {
        this.loading.delete = false
        this.modal.delete = false
        this.$Message.warning('删除成功！')
      })
    },

    // 根据接口和loaction.search（query）获取数据
    getData(qs) {
      return this.$store.dispatch(STUDENT.CLASSES.INIT, qs)
    },
  },
}
</script>

<style lang="less" scoped>
@import '~vars';
</style>
