<template>
  <div>
    <!--条件查询模块-->
    <Form inline class="app-search-form">
      <Form-item>
        <Input v-model="query.like[likeKey]" placeholder="请输入关键字">
        <Select v-model="likeKey" slot="prepend" style="width:6em">
          <Option v-for="likeKey in likeKeys"
                  :key="likeKey.value"
                  :value="likeKey.value">{{ likeKey.label }}</Option>
        </Select>
        </Input>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search" @click="search">搜索</Button>
      </Form-item>
    </Form>

    <!--列表工具模块-->
    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
      <h2><Icon type="ios-calendar" /> 晚辅导列表</h2>
      </Col>
      <Col>
      <Button type="primary">打印</Button>
      </Col>
    </Row>

    <!--列表数据模块-->
    <Table class="app-table" :columns="coachColumns" :data="coachData.data" border></Table>
    <app-pager :data="coachData" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>

    <!--查看辅导班人员信息弹窗-->
    <student-list-modal v-model="coachModal"
                        :okBtn="false"
                        cancel-value="关闭">
      <template slot="header">
        <span>班级：{{coachInfoData.display_name}}</span>
        <span>学员个数：{{coachInfoData.student_count}}</span>
        <span>班主任：{{coachInfoData.head_teacher}}</span>
      </template>
      <Table class="app-table" :columns="currentCoachColumns" :data="currentCoachData.data" border></Table>
    </student-list-modal>
  </div>
</template>

<script>
  /**
   * 晚辅导列表
   * @author    chenliangshan
   * @version   2017/07/13
   */

  import { createButton } from '@/utils'
  import { list } from '@/mixins'
  import StudentListModal from '../../Components/StudentListModal'

  export default {
    name: 'app-curriculum-student-coach',
    mixins: [list],
    components: { StudentListModal },
    data() {
      return {
        // 搜索字段
        likeKeys: [
          { label: '班级名称', value: 'display_name' },
          { label: '班主任', value: 'classes_director' },
          { label: '产品名称', value: 'schedule_product_name' },
        ],
        likeKey: 'display_name',  // 默认模糊字段
        // 班级字段
        coachColumns: [
          { title: '班级',
            align: 'center',
            render: createButton([
              {
                type: 'primary',
                click: (params) => {
                  // 查看班级人员信息
                  this.studentListShow(params)
                },
                key: 'display_name',
              },
            ]) },
          { title: '学员人数（个）', key: 'student_total', align: 'center' },
          { title: '教师姓名', key: 'teacher_item', align: 'center' },
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
                  this.$router.push(`/curriculum/studentcurricula/coach/course/${params.id}`)
                },
                text: '排课管理',
              },
            ]),
          },
        ],
        // 班级数据
        coachData: {},
        // 班级弹窗-初始化状态
        coachModal: false,
        // 班级学员信息字段
        currentCoachColumns: [
          { title: '序号', type: 'index', align: 'center', width: '50' },
          { title: '学员名称', key: 'student_name', align: 'center' },
          { title: '学员编号', key: 'student_number', align: 'center' },
          { title: '当前年级', key: 'current_grade', align: 'center' },
          { title: '学管师', key: 'counsellor_name', align: 'center' },
          { title: '产品名称', key: 'product_name', align: 'center' },
          { title: '签约课时', key: 'course_total', align: 'center' },
          { title: '剩余课时', key: 'course_remain', align: 'center' },
        ],
        // 班级学员信息数据
        coachInfoData: {},
        // 当前查看的班级
        currentCoachData: {},
      }
    },
    methods: {
      /**
       * 查看辅导班学员信息
       * @param row  [object]   当前班级信息
       */
      studentListShow(row) {
        this.currentCoachData = row
        this.getCoachInfo(row.id)
      },
      // 获取班级学员信息
      getCoachInfo(id) {
        this.$http.get(`/curriculum/student/clbumInfo.json?id=${id}`)
          .then((data) => {
            this.coachInfoData = data
            this.coachModal = true
          })
      },
      // 获取班级数据
      getData(qs) {
        return this.$http.get(`/classcurricula${qs}`)
          .then((data) => {
            this.coachData = data
          })
      },
    },
  }
</script>

<style lang="less" scoped>

</style>
