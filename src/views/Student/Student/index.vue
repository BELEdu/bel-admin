<template>
  <div class="student-info">

    <!-- 搜索表单 -->
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

    <!-- 操作按钮 -->
    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2>学员列表</h2>
      </Col>
      <Col>
        <Button type="primary" @click="modal.teacher = true">分配教师</Button>
        <Button type="primary" @click="modal.manage = true">分配学管师</Button>
        <Button type="primary" @click="$router.push('/student/student/edit')">添加学员</Button>
        <Button type="warning" @click="modal.delete = true">删除</Button>
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

    <!-- 分配教师模态框 -->
    <app-form-modal
      v-model="modal.teacher"
      title="分配教师"
      :loading="loading.teacher"
      @on-ok="teacherSubmit('formTeacher')"
    >
      <Form ref="formTeacher" :model="formTeacher" :rules="ruleTeacher" :label-width="100">
        <Form-item label="分配给" prop="teacher">
          <Select v-model="formTeacher.teacher" placeholder="请选择...">
            <Option value="1">李老师</Option>
            <Option value="2">王老师</Option>
            <Option value="3">黄老师</Option>
          </Select>
        </Form-item>
        <Form-item label="通知该教师" prop="notice">
          <Radio-group v-model="formTeacher.notice">
            <Radio label="message">发送短信</Radio>
            <Radio label="address">发送邮件</Radio>
          </Radio-group>
        </Form-item>
      </Form>
    </app-form-modal>

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
            <Radio label="message">发送短信</Radio>
            <Radio label="address">发送邮件</Radio>
          </Radio-group>
        </Form-item>
      </Form>
    </app-form-modal>

    <!-- 学员信息表格 -->
    <Table class="app-table" :columns="columns" :data="fdata" border></Table>

    <!-- 分页 -->
    <app-pager :data="pager" @on-change="() => {}"></app-pager>

  </div>
</template>

<script>
/**
 * 学员管理 - 学员信息
 * @author zml
 * @version 2017-06-08
 * @version 2017-06-13
 */
import { GLOBAL } from '@/store/mutationTypes'
import { createButton } from '@/utils'
import fdata from './fdata'

export default {
  name: 'app-student-student',

  data() {
    return {
      // 搜索表单
      formSearch: {
        start: '',
        end: '',
        keyword: '',
      },
      // 分配教师表单
      formTeacher: {
        teacher: '',
        notice: '',
      },
      // 分配教师表单验证规则
      ruleTeacher: {
        teacher: [
          { required: true, message: '请选择教师', trigger: 'change' },
        ],
        notice: [
          { required: true, message: '请选择通知方式', trigger: 'change' },
        ],
      },
      // 分配学管师表单
      formManage: {
        manage: '',
        notice: '',
      },
      // 分配学管师表单验证规则
      ruleManage: {
        manage: [
          { required: true, message: '请选择学管师', trigger: 'change' },
        ],
        notice: [
          { required: true, message: '请选择通知方式', trigger: 'change' },
        ],
      },
      // 模态框配置
      modal: {
        teacher: false,
        manage: false,
        delete: false,
      },
      // 模态框确定按钮loading状态
      loading: {
        teacher: false,
        manage: false,
        delete: false,
      },
      // 表格配置
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
        },
        { title: '公司', key: 1, align: 'center' },
        { title: '校区', key: 2, align: 'center' },
        { title: '学员编号', key: 'studentId', align: 'center' },
        { title: '学员姓名', key: 4, align: 'center' },
        { title: '家长姓名', key: 5, align: 'center' },
        { title: '首签日期', key: 6, align: 'center' },
        { title: '在读学校', key: 7, align: 'center' },
        { title: '当前年级', key: 8, align: 'center' },
        { title: '归属咨询师', key: 9, align: 'center' },
        { title: '归属学管师', key: 10, align: 'center' },
        { title: '签约课时', key: 11, align: 'center' },
        {
          title: '剩余课时',
          key: 'time',
          align: 'center',
          // 剩余课时小于10的时候变红
          render: (h, params) => {
            const row = params.row
            const className = +row.time < 10 ? 'color-error' : ''
            const text = row.time
            return h('span', {
              class: className,
            }, text)
          },
        },
        {
          title: '操作',
          key: 13,
          align: 'center',
          width: 150,
          render: createButton([
            // 删除该学员
            { text: '删除', type: 'error', click: row => this.openDeleteModal(row.studentId) },
            { text: '编辑', type: 'primary', click: () => this.$router.push('/student/student/detail') },
            { text: '添加', type: 'primary', click: () => this.$router.push('/student/student/detail/meeting/edit') },
          ]),
        },
      ],
      // 表格数据
      fdata,
      // 学员编号
      studentId: '',
      // 分页配置
      pager: undefined,
    }
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },

  methods: {

    // 分配教师表单提交
    teacherSubmit(name) {
      // 验证表单
      this.$refs[name].validate((valid) => {
        if (valid) {
          // 禁止连续点击
          this.loading.teacher = true
          // 用延时模拟请求成功
          setTimeout(() => {
            this.loading.teacher = false
            this.modal.teacher = false
            this.$Message.success('教师分配成功！')
            // 重置该表单
            this.$refs[name].resetFields()
          }, 1500)
        } else {
          this.$Message.error('表单验证失败！')
        }
      })
    },

    // 分配学管师表单提交
    manageSubmit(name) {
      // 验证表单
      this.$refs[name].validate((valid) => {
        if (valid) {
          // 禁止连续点击
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
    openDeleteModal(studentId) {
      this.modal.delete = true
      // 传入表格中对应学员编号
      this.studentId = studentId
    },

    // 删除未签约学员
    studentDelete(studentId) {
      this.studentId = studentId
      // 禁止连续点击
      this.loading.delete = true
      // 用延时模拟请求成功
      setTimeout(() => {
        this.loading.delete = false
        this.modal.delete = false
        this.$Message.warning('删除成功！')
      }, 1500)
    },
  },
}
</script>

<style lang="less">
@import '~vars';
</style>
