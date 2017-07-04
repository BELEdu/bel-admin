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
        <Button type="primary" @click="beforeSubmit()" :loading="formLoading">
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
import format from 'date-fns/format'
import { GLOBAL } from '@/store/mutationTypes'
import { form, goBack } from '@/mixins'
import Basic from '../components/Basic'
import Parents from '../components/Parents'


const defaultParent = {
  parent_name: '', // 家长姓名
  gender: null, // 家长性别
  phone: '', // 联系方式
  identity_card: '', // 家长身份证
  is_guardian: null, // 是否监护人
  relation: '', // 亲属关系
  city: '', // 现住城市
  address: '', // 街道地址
  email: '', // 家长邮箱
  other_phone: '', // 辅助联系方式
  total_score: '', // 家庭总收入
}

const defaultSublist = {
  birth_at: null, // 出生日期
  belong_teacher: null, // 归属教师
  turn_recommend_staff: null, // 转介绍员工
  turn_recommend_student: null, // 转介绍学员
  customer_resource: '', // 客户资源所在地
  information_source: '', // 信息来源
  communication_type: null, // 沟通类型
}

export default {
  name: 'app-student-student-detail-edit',

  mixins: [form, goBack],

  data() {
    return {
      backRoute: '/student/student',

      form: {
        display_name: '', // 学员姓名
        number: '', // 学员编号（仅可读）
        gender: null, // 学员性别
        phone: '', // 联系方式
        identity_card: '', // 身份证号
        join_grade: null, // 入学年级
        current_grade: null, // 当前年级
        school_name: '', // 在读学校
        subject_type: null, // 文理科
        is_repeat: null, // 是否复读
        user_id: '', // 初始建档人（仅可读）

        belong_counselor: null, // 归属咨询师
        belong_customer_relationships: null, // 归属学管师
        is_vip: null, // vip
        student_current_status: null, // 学生当前状态
        original_contractor_id: '', // 初始签约人（仅可读）

        // 待定数据
        sublist: { ...defaultSublist },

        // 家长
        parent: [],
      },

      rules: {
        display_name: [
          this.$rules.required('学生姓名'),
          this.$rules.name,
          this.$rules.max(32),
        ],
        phone: [
          this.$rules.mobile,
        ],
        identity_card: [
          this.$rules.idcard,
        ],
      },
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
          // eslint-disable-next-line
          console.log(res)
        })
    },

    // 获取当前编辑学员的数据
    getClassData() {
      return this.$http.get(`/student/${this.id}`)
        .then((res) => {
          this.form = {
            ...this.form,
            ...res,
            // 处理日期格式
            sublist: res.sublist && Object.keys(res.sublist).length ? {
              ...res.sublist,
              birth_at: res.sublist.birth_at ? new Date(res.sublist.birth_at) : null,
            } : defaultSublist,
          }
        })
    },

     // 提交表单
    submit() {
      const data = {
        ...this.form,
        sublist: {
          ...this.form.sublist,
          // 处理日期格式
          birth_at: this.form.sublist.birth_at ? format(this.form.sublist.birth_at, 'YYYY-MM-DD') : null,
        },
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
