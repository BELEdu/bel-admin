<template>
  <div class="studyprogress-edit">

    <Steps :current="step" class="studyprogress-steps" v-if="step < 4">
      <Step title="完善基础信息"></Step>
      <Step title="添加知识点"></Step>
      <Step title="安排计划"></Step>
      <Step title="提交计划"></Step>
    </Steps>
    <app-editor-title></app-editor-title>
    <Form class="app-form-entire" :label-width="120" :model="form" :rules="rules" ref="form">
      <step-one
        v-show="step === 0 || step >= 3"
        :subjectTypes="subjectTypes"
        :versions="versions"
        :teachers="teachers"
        :form="form"
        :isStudent="isStudent"
      ></step-one>

      <step-two
        v-show="step === 1 || step >= 3"
        :step="step"
        :knowledgepoints="knowledgepoints"
        :form="form"
      >
        <app-knowledge-tree
          :data="baseData" v-model="form.points"
          @select="data => selectedData = data"
        ></app-knowledge-tree>
      </step-two>

      <step-three
        v-show="step === 2 || step >= 3"
        :step="step"
        :course="form.course"
        :selectedData="selectedData"
        @addLesson="addLesson"
        @removeLesson="removeLesson"
        @sortLesson="sortLesson"
      ></step-three>

      <Form-item>
        <Button type="ghost" size="large" @click="goBack()">取消</Button>
        <Button type="ghost" size="large" @click="prevStep" v-show="step > 0 && step < 4">上一步</Button>
        <Button type="primary" size="large" @click="nextStep" v-show="step < 3">下一步</Button>
        <Button type="primary" size="large" @click="beforeSubmit()" :loading="formLoading" v-show="step >= 3">确定</Button>
      </Form-item>

    </Form>
  </div>
</template>

<script>
/**
 * 学员管理 - 学习进度 - 创建/编辑计划
 * @author lmh
 * @version 2017-06-29
 */

import { mapState } from 'vuex'
import { GLOBAL } from '@/store/mutationTypes'
import { form, goBack } from '@/mixins'
import StepOne from './StepOne'
import StepTwo from './StepTwo'
import StepThree from './StepThree'

// JS中对象（包括数组等等）是引用类型，其它都是原始类型
function Course() {
  this.id = null
  this.course_num = 1
  this.course_knowledge = []
}

export default {
  name: 'app-student-studyprogress-editplan',

  mixins: [form, goBack],

  props: {
    initialStep: {
      type: Number,
      default: 0,
    },
    planId: { // 编辑的时候点击科目传回计划id
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      step: 0,

      form: {
        points: [],

        id: null, // 计划id
        model_id: null, // 学员id或者班级id
        subject_type: null, // 科目
        teaching_version: null, // 教材版本
        teacher_id: null, // 教师id
        character_analysis: '', // 学员分析
        methods_measures: '', // 拟采用的方法或措施
        teaching_objectives: '',  // 教学目标
        course: [new Course()], // 排课计划
        weakKnowledge: [], // 薄弱知识点
      },

      knowledgeData: [], // 知识点数据源
      teachers: [], // 教师数据源

      knowledgepoints: [
        '数与式', '有理数', '一元一次方程', '二元一次方程', '非负数的性质：绝对值',
        '非负数的性质：绝对值', '数与式', '有理数', '一元一次方程', '二元一次方程',
        '二元一次方程', '非负数的性质：绝对值', '数与式', '有理数', '一元一次方程',
        '一元一次方程', '二元一次方程', '非负数的性质：绝对值', '数与式', '有理数',
      ],

      baseData: [{
        expand: true,
        title: '平行线',
        children: [
          { title: '平行线' },
          { title: '同位角、内错角、同旁内角' },
          { title: '平行线的判定' },
          { title: '平行线的性质' },
          { title: '圆形的平移' },
        ],
      }, {
        expand: true,
        title: '平行线',
        children: [
          { title: '平行线' },
          { title: '同位角、内错角、同旁内角' },
          { title: '平行线的判定' },
          { title: '平行线的性质' },
          { title: '圆形的平移' },
        ],
      }, {
        expand: true,
        title: '平行线',
        children: [
          { title: '平行线' },
          { title: '同位角、内错角、同旁内角' },
          { title: '平行线的判定' },
          { title: '平行线的性质' },
          { title: '圆形的平移' },
        ],
      }, {
        expand: true,
        title: '平行线',
        children: [
          { title: '平行线' },
          { title: '同位角、内错角、同旁内角' },
          { title: '平行线的判定' },
          { title: '平行线的性质' },
          { title: '圆形的平移' },
        ],
      }],

      selectedData: [],

      rules: {
        subject_type: [
          this.$rules.required('上课科目', 'number', 'change'),
        ],
        teaching_version: [
          this.$rules.required('教材版本', 'number', 'change'),
        ],
        teacher_id: [
          this.$rules.required('授课教师', 'number', 'change'),
        ],
      },
    }
  },

  computed: {
    ...mapState({
      grades: state => state.dicts.grade, // 年级
      subjectTypes: state => state.dicts.course_subject_type, // 上课科目
      versions: state => state.dicts.teaching_version, // 教材版本
    }),

    id() { // 学生或者班级id（从路由获得）
      return +this.$router.currentRoute.params.id
    },

    type() { // 班级计划还是学员计划（从路由获得）
      return this.$router.currentRoute.params.type
    },

    isAdd() {
      const pathArry = this.$route.path.split('/')
      return pathArry[pathArry.length - 1] === 'add'
    },

    isStudent() {
      return this.type === 'student'
    },

  },

  watch: {
    planId() {
      this.getEditData()
    },
  },

  methods: {
    prevStep() {
      this.step -= 1
    },

    nextStep() {
      this.step += 1
    },

    addLesson() {
      this.form.course.push(new Course())
    },

    removeLesson(index) {
      this.form.course.splice(index, 1)
    },

    sortLesson(index, order) { // 等待接口返回是否可编辑状态时再改动
      // const siblingCourse = this.form.course[index + order]
      // if (!siblingCourse.a) {
      const course = this.form.course.splice(index, 1)[0]
      this.form.course.splice(index + order, 0, course)
      // }
    },

    getEditData() { // 获取编辑数据
      const api = this.isStudent ? `/studentplan/info/${this.planId}` : `/classesplan/info/${this.planId}`
      return this.$http.get(api)
        .then((res) => {
          const {
            knowledgeData,
            ...others
          } = res

          this.form = {
            ...others,
          }

          this.knowledgeData = knowledgeData
        })
    },

    getAddData() { // 获取添加数据（到时候从这里获取知识点）
      return this.$http.get('/studentplan/create')
        .then((res) => {
          // eslint-disable-next-line
          console.log(res)
          this.form.model_id = this.id
        })
    },

    getTeacherData() { // 获取教师数据
      this.$http.get('/teacher_list?attr=is_student_teac')
      .then((res) => {
        this.teachers = res
      })
    },

    submit() {
      const data = {
        ...this.form,
        course: this.form.course.map((item, index) => ({
          ...item,
          sort_value: index + 1,
        })),
      }


      // console.log(data)
      this.$Message.info('提交成功')


      if (this.isAdd) {
        const addApi = this.isStudent ? `/studentplan/${this.id}` : `/classesplan/${this.id}`
        this.$http.post(addApi, data)
         .then(this.successHandler)
         .catch(this.errorHandler)
      } else {
        const editApi = this.isStudent ? `/studentplan/${data.id}` : `/classesplan/${data.id}`
        this.$http.patch(editApi, data)
         .then(this.successHandler)
         .catch(this.errorHandler)
      }
    },
  },

  components: {
    StepOne,
    StepTwo,
    StepThree,
  },

  created() {
    this.step = this.initialStep

    this.getTeacherData()

    ;(this.isAdd ? this.getAddData : this.getEditData)()
      .then(() => this.$store.commit(GLOBAL.LOADING.HIDE))
  },
}
</script>

<style lang="less">
@import "~vars.less";

.studyprogress-edit {
  padding: 0 40px;

  &__sub-title {
    font-size: 14px;
    margin-bottom: 1em;
  }
}

.studyprogress-steps {
  width: @content-max-width + 210px;
  margin-bottom: 40px;
}
</style>
