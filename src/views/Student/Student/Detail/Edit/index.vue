<template>
  <div>
    <app-editor-title></app-editor-title>


    <Form
     :label-width="130"
     :model="form"
     :rules="rules"
     ref="form"
     class="app-form-entire"
    >
      <app-form-alert :errors="formErrors"></app-form-alert>
      <!-- 学员基本信息 -->
      <basic
       :form="form"
       :isUpdate="isUpdate"
       :genders="genders"
       :grades="grades"
       :communicationTypes="communicationTypes"
       :studentCurrentStatus="studentCurrentStatus"
       :subjectTypes="subjectTypes"
      ></basic>

      <!-- 家长信息 -->
      <parents
       :parent="form.parent"
       :genders="genders"
       @addParent="addParent"
       @removeParent="removeParent"
      ></parents>

      <!-- 表单提交按钮 -->
      <Form-item>
        <Button @click="goBack()">取消</Button>
        <Button type="primary" @click="submit()" >
          提交
        </Button>
      </Form-item>

    </Form>
  </div>
</template>

<script>
/**
 * 学员管理 - 学员信息 - 学员详情 -基础信息
 * @author zml
 * @version 2017-06-15
 */

import { mapState } from 'vuex'
import { GLOBAL } from '@/store/mutationTypes'
import format from 'date-fns/format'
// import format from 'date-fns/format'
import Basic from './components/Basic'
import Parents from './components/Parents'


const defaultParent = {
  parent_name: '', // 家长姓名
  gender: 1, // 家长性别
  phone: '', // 联系方式
  identity_card: '', // 家长身份证
  is_guardian: 1, // 是否监护人
  relation: '', // 亲属关系
  city: '', // 现住城市
  address: '', // 街道地址
  email: '', // 家长邮箱
  other_phone: '', // 辅助联系方式
  total_score: '', // 家庭总收入
}

const defaultSublist = {
  birth_at: '', // 出生日期
  belong_teacher: '', // 归属教师
  turn_recommend_staff: '', // 转介绍员工
  turn_recommend_student: '', // 转介绍学员
  customer_resource: '', // 客户资源所在地
  information_source: '', // 信息来源
  communication_type: '', // 沟通类型
}

export default {
  name: 'app-student-student-detail-edit',

  data() {
    return {
      form: {
        display_name: '', // 学员姓名
        number: '', // 学员编号（仅可读）
        gender: 1, // 学员性别
        phone: '', // 联系方式
        identity_card: '', // 身份证号
        join_grade: '', // 入学年级
        current_grade: '', // 当前年级
        school_name: '', // 在读学校
        subject_type: 3, // 文理科
        is_repeat: 0, // 是否复读
        user_id: '', // 初始建档人（仅可读）

        belong_counselor: '', // 归属咨询师
        belong_customer_relationships: '', // 归属学管师
        is_vip: '', // vip
        student_current_status: '', // 学生当前状态
        original_contractor_id: '', // 初始签约人（仅可读）

        // 待定数据
        sublist: { ...defaultSublist },

        // 家长
        parent: [],
      },

      rules: {
        display_name: [
          this.$rules.required('学生姓名'),
          this.$rules.length(1, 32),
        ],
        phone: [
          this.$rules.required('学生联系方式'),
          this.$rules.mobile,
        ],
      },

      formErrors: {}, // 表单提交错误信息
    }
  },

  computed: {
    ...mapState({
      // 获取数据字典
      genders: state => state.dicts.gender, // 男女
      grades: state => state.dicts.grade, // 年级
      communicationTypes: state => state.dicts.communication_type, // 沟通类型
      studentCurrentStatus: state => state.dicts.student_current_status, // 当前状态
      subjectTypes: state => state.dicts.subject_type, // 文理分科
    }),

    // 判断是修改还是新增
    isUpdate() {
      return !!this.$router.currentRoute.params.studentId
    },

    // 学员id
    id() {
      return this.$router.currentRoute.params.studentId
    },
  },

  methods: {
    addParent() {
      this.form.parent.push({ ...defaultParent })
    },

    removeParent(index) {
      this.form.parent.splice(index, 1)
    },

    // 获取各个下拉菜单的数据
    getListData() {
      return this.$http.get('/student/create')
        .then((res) => {
          window.console.log(res)
        })
    },

    // 获取当前编辑学员的数据
    getClassData() {
      return this.$http.get(`/student/${this.id}`)
        .then((res) => {
          this.form = {
            ...this.form,
            ...res,
            sublist: res.sublist && Object.keys(res.sublist).length ? res.sublist : defaultSublist,
          }
        })
    },

     // 提交表单
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
           // 处理日期格式
          const data = {
            ...this.form,
            birth_at: this.form.sublist.birth_at ? format(this.form.sublist.birth_at, 'YYYY-MM-DD') : '',
          }

          // 提交时如果是修改操作
          if (this.isUpdate) {
            this.$http.patch(`/student/${this.id}`, data)
              .then(this.successHandler)
              .catch(this.errorHandler)
          }
          // 提交时如果是添加操作
          if (this.isUpdate === false) {
            this.$http.post('/student', data)
              .then(this.successHandler)
              .catch(this.errorHandler)
          }
        }
      })
    },

    successHandler() {
      this.goBack()
    },

    errorHandler({ errors }) {
      if (errors) {
        this.formErrors = errors
      } else {
        this.formErrors = { error: ['服务端错误，请稍后重试'] }
      }
      this.$emit('scrollToTop')
    },

    goBack() {
      this.$router.go(-1)
    },
  },

  components: {
    Basic,
    Parents,
  },

  created() {
    // 判断是编辑还是新建，以此调用不同的接口
    (this.isUpdate ? this.getClassData : this.getListData)()
      .then(() => this.$store.commit(GLOBAL.LOADING.HIDE))
  },
}
</script>

<style lang="less">

</style>
