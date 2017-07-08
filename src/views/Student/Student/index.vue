<template>
  <div class="student-info">

    <!-- 搜索表单 -->
    <Form inline class="app-search-form">
       <Form-item>
        <Input v-model="query.like[likeKey]" placeholder="请输入关键字">
          <Select v-model="likeKey" slot="prepend" style="width:7em;">
            <Option v-for="likeKey in likeKeys" :key="likeKey.value" :value="likeKey.value">{{ likeKey.label }}</Option>
          </Select>
        </Input>
      </Form-item>
      <Form-item>
        <Select v-model="query.equal.school_zone" style="width:7em;" placeholder="请选择校区" >
          <Option v-for="school in school_list" :value="school.display_name" :key="school.display_name">{{ school.display_name }}</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Date-picker v-model="query.between.created_at" format="yyyy-MM-dd" type="daterange" placeholder="请选择首签日期"></Date-picker>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search" @click="search">搜索</Button>
      </Form-item>
    </Form>

    <!-- 操作按钮 -->
    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2>学员列表</h2>
      </Col>
      <Col>
        <Button type="primary" @click="openTeacherModal">分配教师</Button>
        <Button type="primary" @click="modal.manage = true">分配学管师</Button>
        <Button type="primary" @click="$router.push('/student/student/edit')">添加学员</Button>
      </Col>
    </Row>

    <!-- 删除模态框 -->
    <app-warn-modal
      v-model="modal.delete"
      title="删除确认"
      :loading="loading.delete"
      @on-ok="studentDelete(studentId)"
      action="删除"
    >
      <div class="text-center">是否删除该编号为{{studentId}}的学员？</div>
    </app-warn-modal>

    <!-- 分配学管师模态框 -->
    <app-form-modal
      v-model="modal.manage"
      title="分配学管师"
      :loading="loading.manage"
      @on-ok="manageSubmit('formManage')"
    >
      <Form ref="formManage" :model="formManage" :rules="ruleManage" :label-width="100">
        <Form-item label="分配给" prop="manage">
          <Select v-model="formManage.manage" placeholder="请选择...">
            <Option value="1">学管李</Option>
            <Option value="2">学管王</Option>
            <Option value="3">学管黄</Option>
          </Select>
        </Form-item>
        <Form-item label="通知该教师" prop="notice">
          <Radio-group v-model="formManage.notice">
            <Radio label="1">发送短信</Radio>
            <Radio label="2">发送邮件</Radio>
          </Radio-group>
        </Form-item>
      </Form>
    </app-form-modal>

    <!--分配教师组件-->
    <teacher-modal
      v-model="modal.teacher"
      @closeTeacherModal="modal.teacher = false"
      :studentItem="studentItem"
      :updateData="updateData"
    ></teacher-modal>

    <!-- 学员信息表格 -->
    <Table class="app-table" :columns="columns" :data="list.data" border @on-selection-change="onSelectionChange"></Table>

    <!-- 分页 -->
    <app-pager :data="list" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>

  </div>
</template>

<script>
/**
 * 学员管理 - 学员信息
 * @author zml
 * @version 2017-06-08
 * @version 2017-06-13
 */

import { mapState } from 'vuex'
import { list } from '@/mixins'
import { STUDENT } from '@/store/mutationTypes'
import { createButton } from '@/utils'
import TeacherModal from './components/TeacherModal'

export default {
  name: 'app-student-student',

  mixins: [list],

  data() {
    return {

      likeKeys: [
        { label: '校区名称', value: 'school_zone' },
        { label: '学员姓名', value: 'display_name' },
        { label: '学员编号', value: 'id' },
        { label: '在读学校', value: 'school_name' },
        { label: '归属咨询师', value: 'belong_counselor' },
        { label: '归属学管师', value: 'belong_customer_relationships' },
      ],
      likeKey: 'display_name',
      query: {
        equal: {
          school_zone: '',
        },
        between: {
          created_at: [],
        },
      },

      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
        },
        { title: '校区', key: 'school_zone', align: 'center' },
        { title: '学员姓名', key: 'display_name', align: 'center' },
        { title: '学员编号', key: 'id', align: 'center' },
        {
          title: '家长姓名',
          key: 'parent_name',
          align: 'center',
        },
        { title: '首签日期', key: 'created_at', align: 'center' },
        { title: '在读学校', key: 'school_name', align: 'center' },
        { title: '当前年级', key: 'current_grade', align: 'center' },
        { title: '归属咨询师', key: 'belong_counselor', align: 'center' },
        { title: '归属学管师', key: 'belong_customer_relationships', align: 'center' },
        { title: '签约课时', key: 'course_remain', align: 'center' },
        {
          title: '剩余课时',
          key: 'course_total',
          align: 'center',
          // 剩余课时小于10的时候变红
          render: (h, params) => {
            const { course_total } = params.row
            const className = +course_total < 10 ? 'color-error' : ''
            return h('span', {
              class: className,
            }, course_total)
          },
        },
        {
          title: '操作',
          key: 13,
          align: 'center',
          width: 200,
          render: createButton([
            { text: '删除', type: 'error', click: row => this.openDeleteModal(row.id) },
            { text: '编辑', type: 'primary', click: row => this.$router.push(`/student/student/${row.id}/edit`) },
            { text: '交流会', type: 'primary', click: row => this.$router.push(`/student/student/${row.id}/meeting/edit`) },
          ]),
        },
      ],

      formManage: {// 分配学管师表单
        manage: '',
        notice: '',
      },

      ruleManage: { // 分配学管师表单验证规则
        manage: [
          { required: true, message: '请选择学管师', trigger: 'change' },
        ],
        notice: [
          { required: true, message: '请选择通知方式', trigger: 'change' },
        ],
      },

      modal: {// 模态框状态
        teacher: false,
        manage: false,
        delete: false,
      },

      loading: { // 模态框按钮loading状态
        manage: false,
        delete: false,
      },

      studentId: '', // 学员编号（用于删除学员）

      studentItem: [], // 学生id数组（用于分配教师）

      school_list: [], // 校区列表
    }
  },

  computed: {
    ...mapState({
      list: state => state.student.student.list,
    }),
  },

  components: {
    TeacherModal,
  },

  methods: {

    openTeacherModal() { // 打开分配教师弹窗
      if (this.studentItem.length > 0) {
        this.modal.teacher = true
      } else {
        this.$Message.warning('请先选择要分配教师的学员')
      }
    },

    onSelectionChange(selection) { // 获取选中的学生ID（iview表格自带）
      this.studentItem = selection.map(item => item.id)
    },

    getData(qs) {
      return this.$store.dispatch(STUDENT.STUDENT.INIT, qs)
    },

    manageSubmit(name) { // 分配学管师表单提交
      this.$refs[name].validate((valid) => { // 验证表单
        if (valid) {
          this.loading.manage = true
          // 用延时模拟请求成功
          setTimeout(() => {
            this.loading.manage = false
            this.modal.manage = false
            this.$Message.success('学管师分配成功！')
            // 重置该表单
            this.$refs[name].resetFields()
          }, 1500)
        } else {
          this.$Message.error('表单验证失败！')
        }
      })
    },

    // 打开删除模态框
    openDeleteModal(id) {
      this.modal.delete = true
      this.studentId = id
    },

    studentDelete(id) { // 删除未签约学员
      this.studentId = id
      this.loading.delete = true
      this.$store.dispatch(STUDENT.STUDENT.DELETE, id)
      .then(() => {
        this.loading.delete = false
        this.modal.delete = false
        this.$Message.warning('删除成功！')
      })
    },

    getSchoolList() { // 获取校区列表
      this.$http.get('/school_list')
        .then((res) => {
          this.school_list = res
        })
    },
  },

  created() {
    this.getSchoolList()
  },
}
</script>

<style lang="less">
@import '~vars';
</style>
