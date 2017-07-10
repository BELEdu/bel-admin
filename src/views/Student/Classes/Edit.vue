<template>
  <div>
    <app-editor-title></app-editor-title>
    <Form :label-width="140" class="app-form-entire" :model="form" :rules="rules" ref="form">
      <app-form-alert :errors="formErrors"></app-form-alert>
      <Form-item label="班级名称" prop="display_name">
        <Input placeholder="请输入班级名称" v-model="form.display_name"></Input>
      </Form-item>
      <Form-item label="班级分类" prop="classes_type">
        <Select placeholder="请选择..." v-model="form.classes_type" :disabled="isUpdate">
          <Option v-for="item in classes_type" :value="item.value" :key="item.display_name">{{ item.display_name }}</Option>
        </Select>
      </Form-item>
      <Form-item label="当前年级（要去掉）">
        <Select placeholder="请选择..." v-model="form.current_grade">
          <Option v-for="item in grade" :value="item.value" :key="item.display_name">{{ item.display_name }}</Option>
        </Select>
      </Form-item>
      <Form-item label="班主任">
        <Select placeholder="请选择..." v-model="form.classes_director">
          <Option v-for="item in classes_director_data" :value="item.value" :key="item.display_name">{{ item.display_name }}</Option>
        </Select>
      </Form-item>
      <Form-item label="教师">
        <Select placeholder="请选择老师..." v-model="form.teachers" filterable multiple>
          <Option v-for="item in classes_teacher_data" :value="item.id" :key="item.username">{{ item.username }}</Option>
        </Select>
      </Form-item>
      <!--<Form-item label="开办日期">
        <app-date-picker placeholder="请选择开办日期" v-model="form.start_at"></app-date-picker>
      </Form-item>-->
      <Form-item label="开办日期（range）">
        <Date-picker type="daterange" placeholder="请选择开办日期" v-model="range"></Date-picker>
      </Form-item>
      <!--<Form-item label="选择学员（测试）" >
          <Select v-model="form.student" placeholder="请选择学生..." multiple remote filterable :remote-method="searchStudents">
            <Option v-for="item in studentList" :value="item" :key="item">{{ item }}</Option>
          </Select>
        </Form-item>-->
      <Form-item label="设定假期">
        <Checkbox-group >
          <Checkbox label="1">每周一</Checkbox>
          <Checkbox label="2">每周二</Checkbox>
          <Checkbox label="3">每周三</Checkbox>
          <Checkbox label="4">每周四</Checkbox>
          <Checkbox label="5">每周五</Checkbox>
          <Checkbox label="6">每周六</Checkbox>
          <Checkbox label="7">每周日</Checkbox>
        </Checkbox-group>
      </Form-item>
      <Form-item>
        <Date-picker type="daterange" :options="options" placeholder="选择特定的日期" v-model="range2"></Date-picker>
      </Form-item>
      <Form-item label="选择学员">
        <Select v-model="form.students" placeholder="请选择学生..." multiple filterable>
          <Option v-for="item in student_data" :value="item.value" :key="item.display_name">{{ item.display_name }}</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Button @click="goBack()">取消</Button>
        <Button type="primary" @click="beforeSubmit()" :loading="formLoading">
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
// import format from 'date-fns/format'
import { form, goBack } from '@/mixins'

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

  mixins: [form, goBack],

  data() {
    return {
      form: {
        id: '',
        display_name: '',  // 班级名称
        classes_type: null, // 班级分类
        current_grade: null, // 当前年级
        classes_director: null, // 班主任
        start_at: null, // 开始时间
        students: [], // 班级学生列表
        teachers: [], // 班级老师列表

        // student: [], // 班级学生列表（测试）
      },

      rules: {
        display_name: [
          this.$rules.required('班级名称'),
          this.$rules.length(2, 32),
        ],
        classes_type: [
          this.$rules.required('班级分类', 'number', 'change'),
        ],
      },

      classes_director_data: [], // 班主数据源
      classes_teacher_data: [], // 任课教师数据源
      student_data: [], // 班级学生数据源
      // studentList: [], // 班级学生数据源（测试）
      range: [], // 开班日期时间段
      range2: [], // 选择特定的日期

      options: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000
        },
      },
    }
  },

  computed: {
    ...mapState({// 将班级类型和年级类型数据字典放在data中
      grade: state => state.dicts.grade,
      classes_type: state => state.dicts.classes_type,
    }),
    isUpdate() { // 判断是编辑还是新增
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
      // 处理日期格式
      // this.form = {
      //   ...this.form,
      //   start_at: this.form.start_at ? format(this.form.start_at, 'YYYY-MM-DD') : null,
      // }
      // this.form.start_at = this.form.start_at ? format(this.form.start_at, 'YYYY-MM-DD') : ''

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
    },

    // 获取教师数据源
    getTeacherData() {
      this.$http.get('/teacher_list?attr=is_student_teac')
        .then((res) => {
          this.classes_teacher_data = res
        })
    },

    // 获取各个下拉菜单的数据
    getListData() {
      return this.$http.get('/classes/create')
        .then((res) => {
          //  获取班主任、班级学员的数据源
          this.classes_director_data = res.classes_director_data
          this.student_data = res.student_data
        })
    },

    // 获取当前编辑班级的数据
    getClassData() {
      // 从url获取编辑的id
      const editId = this.$router.currentRoute.params.id
      return this.$http.get(`/classes/${editId}`)
        .then((res) => {
          // 将班主任、班级学员的数据源解构出来，需要提交的数据放在this.form中
          const {
            classes_director_data,
            student_data,
            ...others
          } = res

          this.form = { ...others }
          this.classes_director_data = classes_director_data
          this.student_data = student_data
        })
    },
  },

  created() {
    // 通过接口获取我的学生(测试)
    // this.studentList = myStudents

    this.getTeacherData()

    ; (this.isUpdate ? this.getClassData : this.getListData)()
      .then(() => this.$store.commit(GLOBAL.LOADING.HIDE))
  },
}
</script>

<style lang="less">
@import '~vars';
</style>
