<template>
  <div>
    <Tabs type="card" :animated="false" @on-click="tabSwitch">
      <Tab-pane label="学员" name="1">
        <!--条件查询模块-->
        <Form inline class="app-search-form">
          <Form-item prop="start">
            <Input v-model="form.keyword" placeholder="请输入关键字"></Input>
          </Form-item>
          <Form-item>
            <Button type="primary" icon="ios-search">搜索</Button>
          </Form-item>
        </Form>

        <!--列表工具模块-->
        <Row class="app-content-header" type="flex" justify="end">
          <Col>
          <Button type="primary" @click="$router.push('/arrange/student/timetable/2')">打印</Button>
          </Col>
        </Row>

        <!--列表数据模块-->
        <Table class="app-table" :columns="studentColumns" :data="studentList.data" border></Table>
        <app-pager :data="studentList"></app-pager>
      </Tab-pane>

      <!--班级模块-->
      <Tab-pane label="班级" name="2">
        <!--条件查询模块-->
        <Form inline class="app-search-form">
          <Form-item prop="start">
            <Input v-model="form.keyword" placeholder="请输入关键字"></Input>
          </Form-item>
          <Form-item>
            <Button type="primary" icon="ios-search">搜索</Button>
          </Form-item>
        </Form>

        <!--列表工具模块-->
        <Row class="app-content-header" type="flex" justify="end">
          <Col>
          <Button type="primary" @click="$router.push('/arrange/student/timetable/2')">打印</Button>
          </Col>
        </Row>

        <!--列表数据模块-->
        <Table class="app-table" :columns="clbumColumns" :data="clbumList.data" border></Table>
        <app-pager :data="clbumList"></app-pager>
      </Tab-pane>
    </Tabs>

    <!--查看班级人员信息弹窗-->
    <Modal v-model="showModal" width="800">
      <p slot="header" class="modal-header">
        <span>班级：{{currentTab.clbumm_name}}</span>
        <span>学员个数：{{currentTab.student_count}}</span>
        <span>班主任：{{currentTab.head_teacher}}</span>
        <span>学管师：{{currentTab.customer_teacher}}</span>
      </p>
      <Table class="app-table" :columns="showColumns" :data="showList.data" border></Table>
      <app-pager :data="showList"></app-pager>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
/**
 * 排课管理 - 学员排课
 * @author yangjun|chenliangshan
 * @version 2017-06-08
 */

import { GLOBAL } from '@/store/mutationTypes'
import { createButton } from '@/utils'

export default {
  name: 'app-curriculum-studentcurricula',
  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
  mounted() {
    this.tabSwitch()
  },
  data() {
    return {
      showModal: false,
      form: {
        keyword: '',
      },
      studentColumns: [
        { title: '学员姓名', key: 'student_name', align: 'center' },
        { title: '学员编号', key: 'student_number', align: 'center' },
        { title: '当前年级', key: 'current_grade', align: 'center' },
        { title: '班主任', key: 'head_teacher', align: 'center' },
        { title: '学管师', key: 'customer_teacher', align: 'center' },
        { title: '产品名称', key: 'product_subtype', align: 'center' },
        { title: '上课课时', key: 'period', align: 'center' },
        {
          title: '操作',
          align: 'center',
          render: createButton([
            {
              icon: 'edit',
              type: 'primary',
              click: (params) => {
                this.$router.push(`/curriculum/student/edit/${params.a}`)
              },
              text: '排课管理',
            },
          ]),
        },
      ],
      studentList: {},
      clbumColumns: [
        { title: '班级',
          align: 'center',
          render: createButton([
            {
              type: 'primary',
              click: (params) => {
                // 查看班级人员信息
                this.classShow(params)
              },
              key: 'clbumm_name',
            },
          ]) },
        { title: '学员人数（个）', key: 'student_count', align: 'center' },
        { title: '学员编号', key: 'student_number', align: 'center' },
        { title: '当前年级', key: 'current_grade', align: 'center' },
        { title: '班主任', key: 'head_teacher', align: 'center' },
        { title: '学管师', key: 'customer_teacher', align: 'center' },
        { title: '产品子类型', key: 'product_subtype', align: 'center' },
        { title: '剩余课时', key: 'surplus_period', align: 'center' },
        {
          title: '操作',
          key: 10,
          align: 'center',
          render: createButton([
            {
              icon: 'edit',
              type: 'primary',
              click: (params) => {
                this.$router.push(`/arrange/student/edit/${params.a}`)
              },
              text: '排课管理',
            },
          ]),
        },
      ],
      clbumList: {},
      showColumns: [
        { title: '学员名称', key: 'student_name', align: 'center' },
        { title: '学员编号', key: 'student_number', align: 'center' },
        { title: '当前年级', key: 'current_grade', align: 'center' },
        { title: '学管师', key: 'customer_teacher', align: 'center' },
        { title: '产品子类型', key: 'product_subtype', align: 'center' },
        { title: '剩余课时', key: 'surplus_period', align: 'center' },
        { title: '上课年级', key: 'coach_grade', align: 'center' },
      ],
      showList: {},
      currentTab: {},
      pager: undefined,
    }
  },
  methods: {
    tabSwitch(id = '1') {
      // id为标签
      if (id === '2') {
        return this.getClbummResults()
      }
      return this.getStudentResults()
    },
    classShow(row) {
      this.currentTab = row
      this.$http.post('/arrange/student/clbummInfo.json')
        .then((data) => {
          this.showList = data
          this.showModal = true
        })
    },
    // 获取学员数据
    getStudentResults() {
      return this.$http.get('/arrange/student/studentList.json')
        .then((data) => {
          this.studentList = data
        })
    },
    // 获取班级数据
    getClbummResults() {
      return this.$http.get('/arrange/student/clbummList.json')
        .then((data) => {
          this.clbumList = data
        })
    },
  },
}
</script>

<style lang="less">
  .modal-header {
    span {
      padding-right: 10px;
    }
  }
</style>
