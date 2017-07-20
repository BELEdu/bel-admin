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
      <h2><Icon type="ios-calendar" /> 班级列表</h2>
      </Col>
      <Col>
      <Button type="primary">打印</Button>
      </Col>
    </Row>

    <!--列表数据模块-->
    <Table class="app-table" :columns="clbumColumns" :data="clbumData.data" border></Table>
    <app-pager :data="clbumData" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>

    <!--查看班级人员信息弹窗-->
    <class-student-modal v-model="classModal" :id="this.currentClbum.id"></class-student-modal>
  </div>
</template>

<script>
  /**
   * @author    chenliangshan
   * @version   2017/07/20
   */

  import { createButton } from '@/utils'
  import { list } from '@/mixins'
  import ClassStudentModal from '../../Components/ClassStudentModal'

  export default {
    name: 'app-curriculum-student-class',
    mixins: [list],
    components: { ClassStudentModal },
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
          { title: '教师', key: 'teacher_item', align: 'center' },
          { title: '班主任', key: 'headmaster', align: 'center' },
          { title: '产品名称', key: 'product_name', align: 'center' },
          {
            title: '操作',
            align: 'center',
            render: createButton([
              {
                icon: 'edit',
                type: 'primary',
                click: (params) => {
                  this.$router.push(`/curriculum/studentcurricula/class/course/${params.id}`)
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
        // 当前查看的班级
        currentClbum: {},
        // 班级学员信息弹窗
        classModal: false,
      }
    },
    methods: {
      /**
       * 查看班级信息
       * @param row  [object]   当前班级信息
       */
      classShow(row) {
        this.currentClbum = row
        this.classModal = true
      },
      // 获取班级数据
      getData(qs) {
        return this.$http.get(`/classcurricula${qs}`)
          .then((data) => {
            this.clbumData = data
          })
      },
    },
  }
</script>

<style lang="less" scoped>
  .modal-header {
    span {
      padding-right: 10px;
    }
  }
</style>
