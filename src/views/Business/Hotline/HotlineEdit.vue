<template>
  <main class="hotlineeditor" v-if="preConfig">
    <app-editor-title></app-editor-title>
    <Form
      class="app-form-entire"
      :label-width="130"
      :rules="formRules"
      :model="fdata"
      ref="form"
    >
      <app-form-alert :errors="formErrors"></app-form-alert>
      <Form-item label="学员姓名" prop="student_name">
        <Input
          placeholder="请输入学员姓名"
          v-model="fdata.student_name"
        ></Input>
      </Form-item>
      <Form-item label="学员性别" prop="gender">
        <Radio-group
          v-model="fdata.gender"
        >
          <Radio
            v-for="item in preConfig.gender"
            :label="item.value"
            :key="item.value"
          >
            <span>{{item.display_name}}</span>
          </Radio>
        </Radio-group>
      </Form-item>
      <Form-item label="家长姓名" prop="elder_name">
        <Input
          placeholder="请输入家长姓名"
          v-model="fdata.elder_name"
        ></Input>
      </Form-item>
      <Form-item label="手机号码" prop="mobile">
        <Input
          placeholder="请输入联系方式"
          v-model="fdata.mobile"
        ></Input>
      </Form-item>
      <Form-item label="在读学校" prop="school_name">
        <Input
          placeholder="请输入在读学校名称"
          v-model="fdata.school_name"
        ></Input>
      </Form-item>
      <Form-item label="当前年级" prop="grade">
        <Select
          placeholder="请选择......"
          v-model="fdata.grade"
        >
          <Option
            v-for="item in preConfig.grade"
            :value="item.value"
            :key="item.display_name"
          >
            {{item.display_name}}
          </Option>
        </Select>
      </Form-item>
      <Form-item label="报班意向">
        <Radio-group
          v-model="fdata.apply_course_intention"
        >
          <Radio
            v-for="item in preConfig.apply_course_intention"
            :label="item.value"
            :key="item.value"
          >
            <span>{{item.display_name}}</span>
          </Radio>
        </Radio-group>
      </Form-item>
      <Form-item label="邀约咨询师">
        <Select
          placeholder="请选择......"
          v-model="fdata.invited_teacher_id"
        >
          <Option
            v-for="item in preConfig.invited_teacher_list"
            :key="item.value"
            :value="item.value"
          >
            {{item.realname}}
          </Option>
        </Select>
      </Form-item>
      <Form-item label="市场专员" prop="market_staff_name">
        <Input
          placeholder="请输入市场专员"
          v-model="fdata.market_staff_name"
        ></Input>
      </Form-item>
      <Form-item label="来访时间" required prop="visited_at">
        <app-date-picker
          placeholder="年 / 月 / 日"
          v-model="fdata.visited_at"
          formate="yyyy-MM-dd"
          :editable="false"
        ></app-date-picker>
      </Form-item>
      <Form-item label="回访时间" prop="return_visited_at">
        <app-date-picker
          placeholder="年 / 月 / 日"
          v-model="fdata.return_visited_at"
          formate="yyyy-MM-dd"
          :editable="false"
        ></app-date-picker>
      </Form-item>
      <Form-item>
        <Button @click.stop="goBack">取消</Button>
        <Button
          type="primary"
          @click.stop="handleSubmit('form')"
          :loading="loading"
        >提交</Button>
      </Form-item>
    </Form>
  </main>
</template>

<script>
/**
 * 热线登记 - 热线编辑
 *
 * @author huojinzhao
 */

import { parseDate } from '@/utils/date'
import { goBack, form } from '@/mixins'
import { GLOBAL } from '@/store/mutationTypes'
import { editInit } from './modules/config'

export default {
  name: 'hotline-editor',

  mixins: [goBack, form],

  data() {
    return {
      // 最终提交给后端的数据
      fdata: editInit(),

      // 提交按钮状态控制
      loading: false,

      // 咨询师数据
      advisories: null,

      formRules: {
        student_name: [
          this.$rules.required('学员姓名'),
          this.$rules.length(2, 10),
          this.$rules.name,
        ],
        gender: [
          this.$rules.required('学员性别', 'number', 'change'),
        ],
        elder_name: [
          this.$rules.required('家长姓名'),
          this.$rules.length(2, 10),
          this.$rules.name,
        ],
        mobile: [
          this.$rules.required('手机号码'),
          this.$rules.mobile,
        ],
        school_name: [
          this.$rules.length(2, 20),
          this.$rules.name,
        ],
        grade: [
          this.$rules.required('当前年级', 'number', 'change'),
        ],
        market_staff_name: [
          this.$rules.length(2, 10),
          this.$rules.name,
        ],
        visited_at: [
          this.$rules.required('来访时间', 'string', 'change'),
        ],
        return_visited_at: [
          {
            validator: this.validateReturnAt,
            trigger: 'change',
          },
        ],
      },

      preConfig: null,
    }
  },

  methods: {
    /* --- initialization --- */

    getPreConfig() {
      this.$http.get('/hotline/store_before')
        .then((res) => { this.preConfig = res })
    },

    fetchUpdationInfo(id) {
      if (!id) return Promise.resolve()
      return this.$http.get(`/hotline/${id}`)
        .then((res) => { this.fdata = res })
        .catch(() => {})
    },

    /* --- business ---  */

    submit() {
      this.loading = true

      const id = this.$route.params.id

      const fdata = this.fdata
      const method = id ? 'patch' : 'post'
      const uri = id ? `/hotline/${id}` : '/hotline'

      return this.$http[method](uri, fdata)
    },

    handleSubmit(name) {
      this.$refs[name]
        .validate((valid) => {
          if (valid) {
            this.submit()
              .then(() => this.goBack())
              .catch(this.errorHandler)
              .then(() => { this.loading = false })
          }
        })
    },

    // 表单验证函数
    validateReturnAt(rule, value, callback) {
      if (this.fdata.visited_at !== ''
        && value !== null
      ) {
        const from = parseDate(this.fdata.visited_at).valueOf()
        const to = parseDate(this.fdata.return_visited_at).valueOf()
        if (from > to) callback('回访时间应大于来访时间')
      }
      callback()
    },
  },

  created() {
    this.getPreConfig()

    this.fetchUpdationInfo(this.$route.params.id)
      .then(() => this.$store.commit(GLOBAL.LOADING.HIDE))
  },
}
</script>

<style lang="less">
// iview样式重写
.hotlineeditor {

  & .ivu-date-picker {
    display: block;
  }
}
</style>
