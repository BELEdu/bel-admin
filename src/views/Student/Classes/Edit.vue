<template>
  <div>
    <app-editor-title></app-editor-title>
    <Form :label-width="130" class="app-form-entire">
      <Form-item label="班级名称" required>
        <Input placeholder="请输入班级名称"></Input>
      </Form-item>
      <Form-item label="班级分类">
        <Select placeholder="请选择...">
          <Option value="1">奥数小班</Option>
          <Option value="2">作文小班</Option>
          <Option value="3">新初一衔接班</Option>
        </Select>
      </Form-item>
      <Form-item label="当前年级">
        <Select placeholder="请选择...">
          <Option value="1">小学一年级</Option>
          <Option value="2">小学二年级</Option>
          <Option value="3">小学三年级</Option>
        </Select>
      </Form-item>
      <Form-item label="班主任">
        <Select placeholder="请选择...">
          <Option value="1">张三</Option>
          <Option value="2">李四</Option>
          <Option value="3">王五</Option>
        </Select>
      </Form-item>
      <Form-item label="教师">
        <Select v-model="formClass.teacher" placeholder="请选择老师..." filterable multiple>
          <Option v-for="item in teacherList" :value="item.value" :key="item">{{ item.label }}</Option>
        </Select>
      </Form-item>
      <Form-item label="开办日期" >
        <Date-picker placeholder="请选择开办日期"></Date-picker>
      </Form-item>
      <Form-item label="选择学员" >
        <Select v-model="formClass.student" placeholder="请选择学生..." multiple remote filterable :remote-method="searchStudents">
          <Option v-for="item in studentList" :value="item" :key="item">{{ item }}</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Button>取消</Button>
        <Button type="primary">提交</Button>
      </Form-item>
    </Form>
  </div>
</template>

<script>
/**
 * 班级管理 - 班级信息 - 编辑班级
 * @author zml
 * @version 2017-06-13
 * @version 2017-06-15
 */
import { GLOBAL } from '@/store/mutationTypes'

const myStudents = [
  '张三',
  '李四',
  '王五',
]

// eslint-disable-next-line
const allStudents = [
  ...myStudents,
  '赵六',
  '赵7',
  '赵8',
  '赵9',
  '赵10',
]

export default {
  name: 'app-student-classes-edit',

  data() {
    return {
      // 编辑班级表单
      formClass: {
        student: [],
        teacher: [],
      },
       // 学生列表
      studentList: [
        // {
        //   value: '张三',
        //   label: '张三',
        // },
        // {
        //   value: '李四',
        //   label: '李四',
        // },
        // {
        //   value: '王五',
        //   label: '王五',
        // },
        // {
        //   value: '小六',
        //   label: '小六',
        // },
        // {
        //   value: '小七',
        //   label: '小七',
        // },
        // {
        //   value: '小八',
        //   label: '小八',
        // },
        // {
        //   value: '小9',
        //   label: '小9',
        // },
        // {
        //   value: '小10',
        //   label: '小10',
        // },
        // {
        //   value: '小11',
        //   label: '小11',
        // },
        // {
        //   value: '小12',
        //   label: '小13',
        // },
        // {
        //   value: '小14',
        //   label: '小14',
        // },
        // {
        //   value: '小15',
        //   label: '小15',
        // },

        // {
        //   value: '小16',
        //   label: '小16',
        // },
        // {
        //   value: '小17',
        //   label: '小17',
        // },
        // {
        //   value: '小18',
        //   label: '小18',
        // },
        // {
        //   value: '小19',
        //   label: '小19',
        // },

      ],
      // 教师列表
      teacherList: [
        {
          value: '张老师',
          label: '张老师',
        },
        {
          value: '王老师',
          label: '王老师',
        },
        {
          value: '刘老师',
          label: '刘老师',
        },
        {
          value: '陈老师',
          label: '陈老师',
        },
        {
          value: '赵老师',
          label: '赵老师',
        },
        {
          value: '萧老师',
          label: '萧老师',
        },
      ],

    }
  },

  methods: {
    searchStudents(text) {
      // 根据输入字符串请求远端搜索接口
      this.studentList = allStudents.filter(item => item.includes(text))
    },
  },

  created() {
    // 通过接口获取我的学生
    this.studentList = myStudents
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">
@import '~vars';
</style>
