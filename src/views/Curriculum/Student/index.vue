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
          <Button type="primary" @click="$router.push('/curriculum/student/timetable/2')">打印</Button>
          </Col>
        </Row>

        <!--列表数据模块-->
        <Table class="app-table" :columns="studentColumns" :data="studentData.data" border></Table>
        <app-pager :data="studentData" @on-change="getPageInfo" @on-page-size-change="getPerPageInfo"></app-pager>
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
          <Button type="primary" @click="$router.push('/curriculum/student/timetable/2')">打印</Button>
          </Col>
        </Row>

        <!--列表数据模块-->
        <Table class="app-table" :columns="clbumColumns" :data="clbumData.data" border></Table>
        <app-pager :data="clbumData" @on-change="getPageInfo" @on-page-size-change="getPerPageInfo"></app-pager>
      </Tab-pane>
    </Tabs>

    <!--查看班级人员信息弹窗-->
    <Modal v-model="clbumModal" width="800">
      <p slot="header" class="modal-header">
        <span>班级：{{currentClbum.class_name}}</span>
        <span>学员个数：{{currentClbum.student_count}}</span>
        <span>班主任：{{currentClbum.head_teacher}}</span>
        <span>学管师：{{currentClbum.customer_teacher}}</span>
      </p>
      <Table class="app-table" :columns="showColumns" :data="clbumInfoData.data" border></Table>
      <app-pager :data="clbumInfoData" @on-change="getPageInfo" @on-page-size-change="getPerPageInfo"></app-pager>
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
  mounted() {
    this.tabSwitch()
  },
  data() {
    return {
      // 当前标签
      currentTab: {
        id: '1',
      },
      // 搜索字段
      form: {
        keyword: '',
      },
      // 学员字段
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
                this.$router.push(`/curriculum/student/edit/${params.id}`)
              },
              text: '排课管理',
            },
          ]),
        },
      ],
      // 学员数据
      studentData: {},
      // 班级字段
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
              key: 'class_name',
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
          align: 'center',
          render: createButton([
            {
              icon: 'edit',
              type: 'primary',
              click: (params) => {
                this.$router.push(`/curriculum/student/clbumEdit/${params.id}`)
              },
              text: '排课管理',
            },
          ]),
        },
      ],
      // 班级数据
      clbumData: {},
      // 班级弹窗-初始化状态
      clbumModal: false,
      // 班级学员信息字段
      showColumns: [
        { title: '学员名称', key: 'student_name', align: 'center' },
        { title: '学员编号', key: 'student_number', align: 'center' },
        { title: '当前年级', key: 'current_grade', align: 'center' },
        { title: '产品子类型', key: 'product_subtype', align: 'center' },
        { title: '剩余课时', key: 'surplus_period', align: 'center' },
        { title: '上课年级', key: 'coach_grade', align: 'center' },
      ],
      // 班级学员信息数据
      clbumInfoData: {},
      // 当前查看的班级
      currentClbum: {},
      // 分页数据
      pager: {
        // 默认分页数据
        defaultPage: {
          page: 1,
          per_page: 10,
        },
        // 学员分页数据
        student: {},
        // 班级分页数据
        clbum: {},
        // 班级学员信息分页数据
        clbumInfo: {},
      },
    }
  },
  methods: {
    /**
     * 标签切换事件
     * @param id  [string]  1-> 学员 2-> 班级
     * @returns {*}
     */
    tabSwitch(id = '1') {
      this.currentTab.id = id
      this.$store.commit(GLOBAL.LOADING.SHOW)
      // id为标签
      if (id === '2') {
        return this.getClbumData()
      }
      return this.getStudentData()
    },
    /**
     * 查看班级信息
     * @param row  [object]   当前班级信息
     */
    classShow(row) {
      this.currentClbum = row
      this.getClubumInfo(row.id)
    },
    // 获取班级学员信息
    getClubumInfo(id, pageData = this.pager.defaultPage) {
      this.pager.clbumInfo = pageData
      this.$http.get(`/curriculum/student/clbumInfo.json?id=${id}&page=${pageData.page}&per_page=${pageData.per_page}`)
        .then((data) => {
          this.clbumInfoData = data
          this.clbumModal = true
        })
    },
    // 获取学员数据
    getStudentData(pageData = this.pager.defaultPage) {
      this.pager.student = pageData
      this.$http.get(`/curriculum/student/studentData.json?page=${pageData.page}&per_page=${pageData.per_page}`)
        .then((data) => {
          this.$store.commit(GLOBAL.LOADING.HIDE)
          this.studentData = data
        })
    },
    // 获取班级数据
    getClbumData(pageData = this.pager.defaultPage) {
      this.pager.student = pageData
      this.$http.get(`/curriculum/student/clbumData.json?page=${pageData.page}&per_page=${pageData.per_page}`)
        .then((data) => {
          this.$store.commit(GLOBAL.LOADING.HIDE)
          this.clbumData = data
        })
    },
    // 根据当前页码或每页条数获取数据
    getPageData(pageInfo) {
      if (this.clbumModal) {
        this.getClubumInfo(this.currentClbum.id, pageInfo)
      } else {
        switch (this.currentTab.id) {
          case '2':
            this.getClbumData(pageInfo)
            break
          default :
            this.getStudentData(pageInfo)
            break
        }
      }
    },
    // 根据页码获取数据
    getPageInfo(pageId = 1) {
      const pageInfo = Object.assign({}, this.pager.defaultPage, { page: pageId })
      this.getPageData(pageInfo)
    },
    // 根据每页条数获取数据
    getPerPageInfo(perPageId = 10) {
      const pageInfo = Object.assign({}, this.pager.defaultPage, { per_page: perPageId })
      this.getPageData(pageInfo)
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
