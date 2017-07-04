<template>
  <div class="studyprogress-edit">
    <Steps :current="step" class="studyprogress-steps" v-if="step < 4">
      <Step title="完善基础信息"></Step>
      <Step title="添加知识点"></Step>
      <Step title="安排计划"></Step>
      <Step title="提交计划"></Step>
    </Steps>

    <Form class="app-form-entire" :label-width="120">
      <step-one
        v-show="step === 0 || step >= 3"
        :subjectTypes="subjectTypes"
      ></step-one>

      <step-two
        v-show="step === 1 || step >= 3"
        :step="step"
        :knowledgepoints="knowledgepoints"
      >
        <app-knowledge-tree
          :data="baseData" v-model="form.points"
          @select="data => selectedData = data"
        ></app-knowledge-tree>
      </step-two>

      <step-three
        v-show="step === 2 || step >= 3"
        :step="step"
        :lessons="form.lessons"
        :selectedData="selectedData"
        @addLesson="addLesson"
        @removeLesson="removeLesson"
        @sortLesson="sortLesson"
      ></step-three>

      <Form-item>
        <Button type="ghost" size="large">取消</Button>
        <Button type="ghost" size="large" @click="prevStep" v-show="step > 0 && step < 4">上一步</Button>
        <Button type="primary" size="large" @click="nextStep" v-show="step < 3">下一步</Button>
        <Button type="primary" size="large" @click="nextStep" v-show="step >= 3">确定</Button>
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
import StepOne from './StepOne'
import StepTwo from './StepTwo'
import StepThree from './StepThree'

export default {
  name: 'app-student-studyprogress-editplan',

  props: {
    initialStep: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      step: 0,

      form: {
        lessons: [
          { time: '', knowledgepoints: [] },
        ],
        points: [],
      },

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
    }
  },

  computed: {
    ...mapState({
      subjectTypes: state => state.dicts.course_subject_type,
    }),
  },

  methods: {
    prevStep() {
      this.step -= 1
    },

    nextStep() {
      this.step += 1
    },

    addLesson() {
      this.form.lessons.push({ time: '', knowledgepoints: [] })
    },

    removeLesson(index) {
      this.form.lessons.splice(index, 1)
    },

    sortLesson(index, order) {
      const lesson = this.form.lessons.splice(index, 1)[0]
      this.form.lessons.splice(index + order, 0, lesson)
    },
  },

  components: {
    StepOne,
    StepTwo,
    StepThree,
  },

  created() {
    this.step = this.initialStep
    this.$store.commit(GLOBAL.LOADING.HIDE)
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
