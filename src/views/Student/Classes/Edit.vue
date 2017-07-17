<template>
  <div>
    <app-editor-title></app-editor-title>
    <Form :label-width="140" class="app-form-entire" :model="form" :rules="rules" ref="form">
      <app-form-alert :errors="formErrors"></app-form-alert>
      <Form-item label="班级名称" prop="display_name">
        <Input placeholder="请输入班级名称" v-model="form.display_name" :disabled="isUpdate"></Input>
      </Form-item>
      <Form-item label="产品分类" prop="product_id">
        <Select placeholder="请选择..." v-model="form.product_id" :disabled="isUpdate">
          <Option v-for="item in classes_product_data" :value="item.id" :key="item.display_name">{{ item.display_name }}</Option>
        </Select>
      </Form-item>
      <Form-item label="班主任">
        <Select placeholder="请选择..." v-model="form.classes_director" >
          <Option v-for="item in classes_teacher_data" :value="item.id" :key="item.username">{{ item.username }}</Option>
        </Select>
      </Form-item>
      <Form-item label="教师">
        <Select placeholder="请选择老师..." v-model="form.teachers" filterable multiple>
          <Option v-for="item in classes_teacher_data" :value="item.id" :key="item.username">{{ item.username }}</Option>
        </Select>
      </Form-item>
      <Form-item label="开班级日期">
        <Date-picker type="daterange" placeholder="请选择开办日期" v-model="classesDate"></Date-picker>
      </Form-item>
      <Form-item label="设定假期" v-if="isCoach">
        <Checkbox-group v-model="form.calendar.week">
          <Checkbox :label="1">每周一</Checkbox>
          <Checkbox :label="2">每周二</Checkbox>
          <Checkbox :label="3">每周三</Checkbox>
          <Checkbox :label="4">每周四</Checkbox>
          <Checkbox :label="5">每周五</Checkbox>
          <Checkbox :label="6">每周六</Checkbox>
          <Checkbox :label="7">每周日</Checkbox>
        </Checkbox-group>
      </Form-item>

      <Form-item class="special" v-if="isCoach">
        <Row :gutter="16">
          <Col span='6' v-for="(item, index) in form.calendar.special_at" :key="index">
            <Form-item
             :prop="`calendar.special_at.${index}.specialDate`"
             :rules="[$rules.required(`第${index+1}个特殊假期`, 'array', 'change')]"
            >
              <Date-picker v-model="item.specialDate" class="original" type="daterange" :clearable="false"></Date-picker>
            </Form-item>
            <Button type="text" shape="circle" icon="close-round" @click="removeSpecial(index)"></Button>
          </Col>
          <Col span='6'>
            <Form-item>
              <Button type="dashed" class="special__btn" icon="plus" long @click="addSpecial">新增假期</Button>
            </Form-item>
          </Col>
        </Row>
      </Form-item>

      <Form-item label="选择学员">
        <Select v-model="form.students" placeholder="请选择学生..." multiple filterable>
          <Option v-for="item in student_data" :value="item.value" :key="item.display_name">{{ item.display_name }}</Option>
        </Select>
      </Form-item>
      <!--<Form-item label="选择学员（测试）" >
          <Select v-model="form.student" placeholder="请选择学生..." multiple remote filterable :remote-method="searchStudents">
            <Option v-for="item in studentList" :value="item" :key="item">{{ item }}</Option>
          </Select>
        </Form-item>-->
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
import format from 'date-fns/format'
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

// const defaultSpecial = {
//   start_at: null,
//   end_at: null,
// }

const defaultSpecial = {
  specialDate: [],
}

export default {
  name: 'app-student-classes-edit',

  mixins: [form, goBack],

  data() {
    return {
      form: {
        display_name: '',  // 班级名称
        product_id: null, // 产品id
        product_type_id: null, // 产品类型id
        classes_director: null, // 班主任
        start_at: null, // 开始时间
        end_at: null, // 结束时间
        students: [], // 班级学生列表
        teachers: [], // 班级老师列表
        calendar: {
          week: [], // 星期几
          special_at: [], // 特殊日期（例如节假日）
        },
        // student: [], // 班级学生列表（测试）
      },

      rules: {
        display_name: [
          this.$rules.required('班级名称'),
          this.$rules.length(2, 32),
        ],
        product_id: [
          this.$rules.required('产品分类', 'number', 'change'),
        ],
      },

      classes_product_data: [], // 产品数据源
      classes_teacher_data: [], // 任课教师数据源
      student_data: [], // 班级学生数据源
      classesDate: [], // 开班日期（range）

       // studentList: [], // 班级学生数据源（测试）
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
    isCoach() { // 根据当前选的产品判断该产品是否是晚辅导
      const product_id = this.form.product_id
      if (product_id) {
        return this.classes_product_data.find(
          item => item.id === product_id,
        ).product_type_id === 3
      }
      return false
    },
  },

  methods: {
    // 根据输入字符串请求远端搜索接口（测试）
    // searchStudents(text) {
    //   this.studentList = allStudents.filter(item => item.includes(text))
    // },

    // 提交表单
    submit() {
      const data = {
        ...this.form,
         // 处理时间段格式
        start_at: this.classesDate ? format(this.classesDate[0], 'YYYY-MM-DD') : null,
        end_at: this.classesDate ? format(this.classesDate[1], 'YYYY-MM-DD') : null,
        calendar: {
          ...this.form.calendar,
          special_at:
          this.form.calendar.special_at ?
          this.form.calendar.special_at.map(item => ({
            start_at: format(item.specialDate[0], 'YYYY-MM-DD'),
            end_at: format(item.specialDate[1], 'YYYY-MM-DD'),
          })) : null,
        },
      }

      if (this.isUpdate) { // 提交时如果是修改操作
        this.form.id = this.$router.currentRoute.params.id
        this.$http.patch(`/classes/${this.form.id}`, data)
          .then(this.successHandler)
          .catch(this.errorHandler)
      }

      if (this.isUpdate === false) { // 提交时如果是添加操作
        this.$http.post('/classes', data)
          .then(this.successHandler)
          .catch(this.errorHandler)
      }
    },

    getTeacherData() { // 获取教师数据源
      this.$http.get('/teacher_list?attr=is_student_teac')
        .then((res) => {
          this.classes_teacher_data = res
        })
    },

    getProductData() { // 获取产品数据源
      this.$http.get('/product_list')
        .then((res) => {
          this.classes_product_data = res
        })
    },

    getListData() { //  获取班主任、班级学员的数据源
      return this.$http.get('/classes/create')
        .then((res) => {
          this.student_data = res.student_data
        })
    },

    getClassData() { // 获取当前编辑班级的数据
      const editId = this.$router.currentRoute.params.id // 从url获取编辑的id
      return this.$http.get(`/classes/${editId}`)
        .then((res) => {
          const { // 将班主任、班级学员的数据源解构出来，需要提交的数据放在this.form中
            classes_director_data,
            student_data,
            start_at,
            end_at,
            ...others
          } = res

          this.form = {
            ...others,
            calendar: {
              ...others.calendar,
              special_at:
              others.calendar.special_at ?
              others.calendar.special_at.map(item => ({
                specialDate: [item.end_at, item.start_at],
              })) : null,
            },
          }
          this.student_data = student_data

          if (start_at !== null && end_at !== null) {
            this.classesDate = [start_at, end_at]
          }
        })
    },

    addSpecial() {
      this.form.calendar.special_at.push({ ...defaultSpecial })
    },

    removeSpecial(index) {
      this.form.calendar.special_at.splice(index, 1)
    },
  },

  created() {
    // 通过接口获取我的学生(测试)
    // this.studentList = myStudents

    this.getProductData()
    this.getTeacherData()

    ; (this.isUpdate ? this.getClassData : this.getListData)()
      .then(() => this.$store.commit(GLOBAL.LOADING.HIDE))
  },
}
</script>

<style lang="less">
@import '~vars';

.special {
  .ivu-icon.ivu-input-icon{
    display: none;
  }
  .original input.ivu-input {
    padding: 7px 7px;
    // border: 1px solid #fff;
    &:focus {
      box-shadow: none
    }
  }
  .ivu-col {
    .ivu-form-item {
      display: inline-block;
      width:76%;
      // margin-top: 15px;
      margin-bottom: 15px;
    }
  }
  &__btn.ivu-btn.ivu-btn-dashed.ivu-btn-long {
    width: 150px;
    margin-top: 0;
  }
}

</style>
