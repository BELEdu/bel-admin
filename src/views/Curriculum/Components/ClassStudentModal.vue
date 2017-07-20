<template>
  <Modal v-model="visible" width="800">
    <p slot="header" class="modal-header">
      <span>班级：{{clbumInfoData.class.display_name}}</span>
      <span>学员个数：{{clbumInfoData.class.student_total}}</span>
      <span>班主任：{{clbumInfoData.class.headmaster}}</span>
      <span>产品名称：{{clbumInfoData.class.product_name}}</span>
    </p>
    <Table class="app-table" :columns="showColumns" :data="clbumInfoData.student" border></Table>
    <div slot="footer">
      <Page :total="clbumInfoData.total" size="small" placement="top" show-total show-elevator show-sizer @on-change="getPageInfo" @on-page-size-change="getPerPageInfo"></Page>
    </div>
  </Modal>
</template>
<script>
  /**
   * 班级学员列表
   * @author  chenliangshan
   * @version 2017/07/20
   */

  export default {
    name: 'class-student-modal',
    props: {
      value: {
        type: Boolean,
        default: false,
      },
      // 班级ID
      id: [Number, String],
    },
    data() {
      return {
        visible: this.value,
        // 班级学员信息字段
        showColumns: [
          { title: '学员名称', key: 'display_name', align: 'center' },
          { title: '学员编号', key: 'number', align: 'center' },
          { title: '当前年级', key: 'current_grade_name', align: 'center' },
          { title: '学管师', key: 'counsellor_name', align: 'center' },
          { title: '签约课时', key: 'course_total', align: 'center' },
          { title: '剩余课时', key: 'course_remain', align: 'center' },
        ],
        // 班级学员信息数据
        clbumInfoData: {
          class: {},
          student: [],
        },
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
      // 获取班级学员信息
      getClubumInfo(pageData = this.pager.defaultPage) {
        this.pager.clbumInfo = pageData
        this.$http.get(`/classcurricula/info/${this.id}?page=${pageData.page}&per_page=${pageData.per_page}`)
          .then((data) => {
            this.clbumInfoData = data
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
    watch: {
      value(val) {
        this.visible = val
      },
      visible(val) {
        if (val === false) {
          this.$emit('input', false)
        } else {
          this.getClubumInfo()
        }
      },
    },
  }
</script>
<style lang="less">

</style>
