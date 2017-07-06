<template>
  <div>
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
    <app-pager :data="clbumData" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>

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
   * @author    chenliangshan
   * @addTime   2017/06/28
   */

  import { createButton } from '@/utils'
  import { list } from '@/mixins'

  export default {
    name: 'app-curriculum-student-class',
    mixins: [list],
    data() {
      return {
        // 搜索字段
        form: {
          keyword: '',
        },
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
                key: 'display_name',
              },
            ]) },
          { title: '学员人数（个）', key: 'student_total', align: 'center' },
          { title: '当前年级', key: 'grade_name', align: 'center' },
          { title: '班主任', key: 'classes_director', align: 'center' },
          { title: '产品名称', key: 'schedule_product_name', align: 'center' },
          {
            title: '操作',
            align: 'center',
            render: createButton([
              {
                icon: 'edit',
                type: 'primary',
                click: (params) => {
                  this.$router.push(`/curriculum/class/course/${params.id}`)
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
          // 班级学员信息分页数据
          clbumInfo: {},
        },
      }
    },
    methods: {
      /**
       * 查看班级信息
       * @param row  [object]   当前班级信息
       */
      classShow(row) {
        this.currentClbum = row
        this.getClubumInfo(row.id)
      },
      // 获取班级学员信息
      getClubumInfo(pageData = this.pager.defaultPage) {
        this.pager.clbumInfo = pageData
        this.$http.get(`/curriculum/student/clbumInfo.json?id=${this.currentClbum.id}&page=${pageData.page}&per_page=${pageData.per_page}`)
          .then((data) => {
            this.clbumInfoData = data
            this.clbumModal = true
          })
      },
      // 获取班级数据
      getData(qs) {
        return this.$http.get(`/classcurricula${qs}`)
          .then((data) => {
            this.clbumData = data
          })
      },
      // 根据页码获取数据
      getPageInfo(pageId = 1) {
        const pageInfo = Object.assign({}, this.pager.defaultPage, { page: pageId })
        this.getClubumInfo(pageInfo)
      },
      // 根据每页条数获取数据
      getPerPageInfo(perPageId = 10) {
        const pageInfo = Object.assign({}, this.pager.defaultPage, { per_page: perPageId })
        this.getClubumInfo(pageInfo)
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
