<template>
  <div class="student-student-edit">
    <!-- 标题 -->
    <app-editor-title v-if="!isReview"></app-editor-title>

    <!-- 表单 -->
    <Form
      :label-width="130"
      :model="form"
      :rules="rules"
      ref="form"
      class="app-form-entire"
    >
      <!-- 表单错误组件 -->
      <app-form-alert :errors="formErrors"></app-form-alert>

      <!-- 学员基础信息 -->
      <form-basic
        :form="form"
        :isUpdate="isUpdate"
        :isReview="isReview"
        :genders="genders"
        :grades="grades"
        :studentCurrentStatus="student_current_status"
        :campusList="campusList"
        :familyIncomeType="family_income_type"
      ></form-basic>

      <!-- 家长信息 -->
      <form-parents
        :parent="form.parent"
        :isUpdate="isUpdate"
        :isReview="isReview"
        :genders="genders"
        :relation="relation"
        @addParent="addParent"
        @removeParent="removeParent"
      ></form-parents>

      <!-- 表单提交按钮 -->
      <Form-item v-if="!isReview">
        <Button @click="goBack()">取消</Button>
        <Button
          type="primary"
          @click="beforeSubmit()"
          :loading="formLoading"
        >提交</Button>
      </Form-item>
    </Form>

  </div>
</template>

<script>
/**
 * 学员课程 - 学员管理 - 添加/编辑/展示学员信息组件
 * @author zml
 * @version 2017-10-10
 */

import { mapState } from 'vuex'
import { GLOBAL } from '@/store/mutationTypes'
import { form, goBack } from '@/mixins'
import FormBasic from './components/FormBasic'
import FormParents from './components/FormParents'

// 默认家长信息
const defaultParent = {
  parent_name: '', // 姓名
  gender: 3, // 性别
  identity_card: '', // 身份证
  phone: '', // 电话
  is_guardian: 1, // 是否监护人
  relation: null, // 关系
}

export default {
  name: 'app-student-student-detail-edit',

  mixins: [form, goBack],

  components: {
    FormBasic,
    FormParents,
  },

  data() {
    return {
      form: {
        head_name: '', // 头像名
        head_url: '', // 头像地址
        display_name: '', // 学员名
        phone: '', // 电话
        identity_card: '', // 身份证
        gender: 3, // 性别
        birth_at: '', // 生日
        current_grade: null, // 当前年级id
        current_school: null, // 当前学校id
        family_income_type: null, // 家庭状态id
        address: '', // 地址
        areas_code: [], // 省市区
        parent: [], // 家长

        number: '', // 编号
        student_current_status: null, // 当前状态
        user_id: null, // 建档人
        department_name: '', // 所有签约校区
      },

      rules: {
        display_name: [
          this.$rules.required('学生姓名'),
          this.$rules.name,
        ],
        phone: [
          this.$rules.required('学员手机号码'),
          this.$rules.mobile,
        ],
        identity_card: [
          this.$rules.idcard,
        ],
      },

      campusList: [], // 在读学校数据源
    }
  },

  computed: {
    ...mapState({
      genders: state => state.dicts.gender, // 性别数据源
      grades: state => state.dicts.grade, // 当前年级数据源
      student_current_status: state => state.dicts.student_current_status, // 学员当前状态数据源
      family_income_type: state => state.dicts.family_income_type, // 家庭经济状况数据源
      relation: state => state.dicts.relation, // 亲属类型
    }),

    id() { // 学员id
      return +this.$router.currentRoute.params.id
    },

    isUpdate() { // 是否是编辑
      return !!this.$router.currentRoute.params.id
    },

    isReview() { // 是否是查看
      const pathArry = this.$route.path.split('/')
      return pathArry[pathArry.length - 1] === 'info'
    },
  },

  methods: {
    // 添加家长
    addParent() {
      this.form.parent.push({ ...defaultParent })
    },

    // 删除家长
    removeParent(index) {
      this.form.parent.splice(index, 1)
    },

    // 学员详情数据
    getStudentData() {
      return this.$http.get(`/student/${this.id}`)
        .then((res) => {
          this.form = {
            ...this.form,
            ...res,
          }
          this.$store.commit(GLOBAL.LOADING.HIDE)
        })
        .catch(({ message }) => {
          this.errorNotice(message)
        })
    },

    // 获取在读学校数据源
    getCampusList() {
      return this.$http.get('/campus_list')
        .then((res) => {
          this.campusList = res
        })
        .catch(({ message }) => {
          this.errorNotice(message)
        })
    },

    // 提交表单
    submit() {
      const data = {
        ...this.form,
      }
      // 判断是编辑还是新建，以此提交不同的接口
      ;(
        this.isUpdate ?
          this.$http.patch(`/student/${this.id}`, data) :
          this.$http.post('/student', data)
      )
        .then(this.successHandler)
        .catch(this.errorHandler)
    },

    // 接口错误处理
    errorNotice(message) {
      this.$Notice.error({
        title: message,
        duration: 0,
      })
    },
  },

  created() {
    this.getCampusList()
    // 如果是 编辑学员或查看学员 先获取学员数据
    if (this.isUpdate) {
      this.getStudentData()
    } else {
      this.$store.commit(GLOBAL.LOADING.HIDE)
    }
  },

}
</script>

<style lang="less">
</style>
