<template>
  <div>
    <Table class="app-table" :columns="clbumColumns" :data="clbumData.data" border></Table>
    <app-pager :data="clbumData" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>
  </div>
</template>

<script>
/**
 * 课程管理 - 班级上课记录
 * @author chenliangshan
 * @version 2017/07/01
 */

import { GLOBAL } from '@/store/mutationTypes'
import { createButton } from '@/utils'
import { list } from '@/mixins'

export default {
  name: 'app-student-record',
  mixins: [list],
  data() {
    return {
      // 搜索字段
      form: {
        keyword: '',
      },
      // 班级字段
      clbumColumns: [
        { title: '班级名称',
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
        { title: '上课年级', key: 'grade_name', align: 'center' },
        { title: '产品名称', key: 'schedule_product_name', align: 'center' },
        { title: '班主任', key: 'belong_customer_relationships', align: 'center' },
        {
          title: '操作',
          align: 'center',
          render: createButton([
            {
              type: 'primary',
              click: (params) => {
                this.$router.push(`/curriculum/record/classShow/${params.id}`)
              },
              text: '查看',
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
    getClubumInfo(id, pageData = this.pager.defaultPage) {
      this.pager.clbumInfo = pageData
      this.$http.get(`/curriculum/student/clbumInfo.json?id=${id}&page=${pageData.page}&per_page=${pageData.per_page}`)
        .then((data) => {
          this.clbumInfoData = data
          this.clbumModal = true
        })
    },
    // 获取班级数据
    getData() {
      this.$http.get(`/curricularecord/class/information${this.qs}`)
        .then((data) => {
          this.$store.commit(GLOBAL.LOADING.HIDE)
          this.clbumData = data
        })
    },
    // 根据页码获取数据
    getPageInfo(pageId = 1) {
      const pageInfo = Object.assign({}, this.pager.defaultPage, { page: pageId })
      this.getClubumInfo(this.currentClbum.id, pageInfo)
    },
    // 根据每页条数获取数据
    getPerPageInfo(perPageId = 10) {
      const pageInfo = Object.assign({}, this.pager.defaultPage, { per_page: perPageId })
      this.getClubumInfo(this.currentClbum.id, pageInfo)
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
