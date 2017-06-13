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
      <Button type="primary" @click="$router.push('/student/class/edit')" >添加班级</Button>
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
        <Form-item >
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
    <Table class="app-table" :columns="columns" :data="fdata" border></Table>

    <!--分页-->
    <app-pager :data="pager" @on-change="() => {}"></app-pager>

  </div>
</template>

<script>
/**
 * 学员管理 - 班级管理
 * @author zml
 * @version 2017-06-08
 */
import { GLOBAL } from '@/store/mutationTypes'
import { createButton } from '@/utils'
import fdata from './fdata'

export default {
  name: 'app-student-class',

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
          value: 'beijing',
          label: '张三',
        },
        {
          value: 'shanghai',
          label: '李四',
        },
        {
          value: 'shenzhen',
          label: '王五',
        },
        {
          value: 'hangzhou',
          label: '小六',
        },
        {
          value: 'nanjing',
          label: '小七',
        },
        {
          value: 'chongqing',
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
        { title: '班级名称', key: 1, align: 'center', width: 150 },
        { title: '班级编号', key: 'classId', align: 'center' },
        { title: '年级', key: 3, align: 'center' },
        { title: '班主任', key: 4, align: 'center', width: 100 },
        { title: '教师', key: 5, align: 'center', width: 180 },
        { title: '学员人数', key: 6, align: 'center', width: 80 },
        { title: '开办日期', key: 7, align: 'center' },
        { title: '创建日期', key: 8, align: 'center' },
        { title: '状态', key: 9, align: 'center' },
        {
          title: '操作',
          key: 10,
          align: 'center',
          width: 130,
          render: createButton([
            { icon: 'trash-a', type: 'warning', click: row => this.openDeleteModal(row.classId) },
            { icon: 'person', type: 'primary', click: row => this.openManageModal(row.classId) },
            { icon: 'edit', type: 'primary', click: () => this.$router.push('/student/class/edit/10086') },
          ]),
        },
      ],
      //  班级编号（临时）
      classId: '',
      // 表格数据
      fdata,
      // 分页配置
      pager: undefined,
    }
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },

  methods: {
    // 打开班级学员管理模态框
    openManageModal(classId) {
      this.modal.manage = true
      this.classId = classId
    },
    // 打开删除班级模态框
    openDeleteModal(classId) {
      this.modal.delete = true
      this.classId = classId
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
    deleteSubmit(classId) {
      // 这个classid用来请求删除接口
      window.console.log(classId)

      this.loading.delete = true
      setTimeout(() => {
        this.loading.delete = false
        this.modal.delete = false
        this.$Message.warning('删除成功！')
      }, 1500)
    },
  },
}
</script>

<style lang="less" scoped>
@import '~vars';
</style>
