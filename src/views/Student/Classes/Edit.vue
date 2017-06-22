<template>
  <div>
    <app-editor-title></app-editor-title>
    <!--{{isUpdate}}，{{form.classes_type}}，{{form.current_grade}}，{{form.classes_director}}，{{form.teachers}}，{{form.start_at}}，{{form.students}}-->

    <Form :label-width="130" class="app-form-entire" :model="form" :rules="rules" ref="form" >
      <app-form-alert :errors="formErrors"></app-form-alert>
      <Form-item label="班级名称" required prop="display_name">
        <Input placeholder="请输入班级名称" v-model="form.display_name"></Input>
      </Form-item>
      <Form-item label="班级分类" required prop="classes_type">
        <Select placeholder="请选择..." v-model="form.classes_type">
          <Option v-for="item in classes_type" :value="item.value" :key="item.display_name">{{ item.display_name }}</Option>
        </Select>
      </Form-item>
      <Form-item label="当前年级" >
        <Select placeholder="请选择..." v-model="form.current_grade">
          <Option v-for="item in grade" :value="item.value" :key="item.display_name">{{ item.display_name }}</Option>
        </Select>
      </Form-item>
      <Form-item label="班主任">
        <Select placeholder="请选择..." v-model="form.classes_director" >
          <Option v-for="item in classes_director_data" :value="item.value" :key="item.display_name">{{ item.display_name }}</Option>
        </Select>
      </Form-item>
      <Form-item label="教师">
        <Select placeholder="请选择老师..." v-model="form.teachers" filterable multiple >
          <Option v-for="item in classes_teacher_data" :value="item.value" :key="item.display_name">{{ item.display_name }}</Option>
        </Select>
      </Form-item>
      <Form-item label="开办日期" >
        <Date-picker placeholder="请选择开办日期" v-model="form.start_at" ></Date-picker>
      </Form-item>
      <!--<Form-item label="选择学员（测试）" >
        <Select v-model="form.student" placeholder="请选择学生..." multiple remote filterable :remote-method="searchStudents">
          <Option v-for="item in studentList" :value="item" :key="item">{{ item }}</Option>
        </Select>
      </Form-item>-->
      <Form-item label="选择学员" >
        <Select v-model="form.students" placeholder="请选择学生..." multiple filterable>
          <Option v-for="item in student_data" :value="item.value" :key="item.display_name">{{ item.display_name }}</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Button @click="goBack()">取消</Button>
        <Button type="primary" @click="submit()" :loading="loading.submit">
          提交
        </Button>
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
 * @version 2017-06-21
 */

import { mapState } from 'vuex'
import { GLOBAL } from '@/store/mutationTypes'
// 引入日期处理库
import format from 'date-fns/format'

// const myStudents = [
//   '张三',
//   '李四',
//   '王五',
// ]


// // eslint-disable-next-line
// const allStudents = [
//   ...myStudents,
//   '赵六',
//   '赵7',
//   '赵8',
//   '赵9',
//   '赵10',
// ]

export default {
  name: 'app-student-classes-edit',

  data() {
    return {
      form: {
        id: '',
        display_name: '',  // 班级名称
        classes_type: '', // 班级分类
        current_grade: '', // 当前年级
        classes_director: '', // 班主任
        start_at: '', // 开始时间
        students: [], // 班级学生列表
        teachers: [], // 班级老师列表

        // student: [], // 班级学生列表（测试）
      },

      rules: {
        display_name: [
          { required: true, message: '班级名称必填', trigger: 'change' },
          { min: 2, max: 32, message: '字符长度应在2到32之间', trigger: 'blur' },
        ],
        classes_type: [
          { type: 'number', required: true, message: '班级分类必填', trigger: 'change' },
        ],
      },

      formErrors: {}, // 表单提交错误信息

      classes_type: [], // 班级分类数据源（字典）
      grade: [], // 年级数据源（字典）
      classes_director_data: [], // 班主数据源
      classes_teacher_data: [], // 任课教师数据源
      student_data: [], // 班级学生数据源
      // studentList: [], // 班级学生数据源（测试）

      loading: {
        submit: false, // 提交表单的loading
      },
    }
  },

  computed: {
    // 使用mapState获取list
    ...mapState({
      list: state => state.student.classes.list,
    }),
    // 判断是编辑还是新增
    isUpdate() {
      return !!this.$router.currentRoute.params.id
    },
  },

  methods: {
    // 根据输入字符串请求远端搜索接口（测试）
    // searchStudents(text) {
    //   this.studentList = allStudents.filter(item => item.includes(text))
    // },

    // 提交表单
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 处理日期格式
          this.form = {
            ...this.form,
            start_at: this.form.start_at ? format(this.form.start_at, 'YYYY-MM-DD') : '',
          }
          // 等同于
          // this.form.start_at = this.form.start_at ? format(this.form.start_at, 'YYYY-MM-DD') : ''

          this.loading.submit = true

          // 提交时如果是修改操作
          if (this.isUpdate) {
            this.form.id = this.$router.currentRoute.params.id
            this.$http.patch(`/classes/${this.form.id}`, this.form)
              .then(this.successHandler)
              .catch(this.errorHandler)
          }
          // 提交时如果是添加操作
          if (this.isUpdate === false) {
            this.$http.post('/classes', this.form)
              .then(this.successHandler)
              .catch(this.errorHandler)
          }
        }
      })
    },

    successHandler() {
      this.loading.submit = false
      this.goBack()
    },

    errorHandler({ errors }) {
      this.loading.submit = false

      // 后台返回errors字段时，按errors字段展示错误信息
      // 否则展示一个统一的错误信息（这里还没有考虑message的情况？）
      if (errors) {
        this.formErrors = errors
      } else {
        this.formErrors = { error: ['服务端错误，请稍后重试'] }
      }
      this.$emit('scrollToTop')
    },

    // 取消（返回上一页）
    goBack() {
      this.$router.go(-1)
    },

    getDicts() {
      return this.$http.get('/dict?keys=grade,classes_type')
        .then((res) => {
          // 将班级类型和年级类型数据字典放在data中
          this.grade = res.grade
          this.classes_type = res.classes_type
        })
    },

    // 获取各个下拉菜单的数据
    getListData() {
      this.$http.get('/classes/create')
       .then((res) => {
        //  获取班主任、任课教师、班级学员的数据源
         this.classes_director_data = res.classes_director_data
         this.classes_teacher_data = res.classes_teacher_data
         this.student_data = res.student_data
       })
    },

    // 获取当前编辑班级的数据
    getClassData() {
      // 从url获取编辑的id
      const editId = this.$router.currentRoute.params.id
      this.$http.get(`/classes/${editId}`)
        .then((res) => {
          // 将班主任、任课教师、班级学员的数据源解构出来，需要提交的数据放在this.form中
          const {
            classes_director_data,
            classes_teacher_data,
            student_data,
            ...form
          } = res

          this.form = form
          this.classes_director_data = classes_director_data
          this.classes_teacher_data = classes_teacher_data
          this.student_data = student_data
        })
    },
  },

  created() {
    // 通过接口获取我的学生(测试)
    // this.studentList = myStudents

    // 不论是新增还是修改，都先获取班级类型和年级类型数据字典
    this.getDicts()
      .then(() => {
        // 判断是否是修改操作
        if (this.isUpdate) {
          return this.getClassData()
        }
        return this.getListData()
      })
      .then(() => this.$store.commit(GLOBAL.LOADING.HIDE))
  },
}
</script>

<style lang="less">
@import '~vars';
</style>
