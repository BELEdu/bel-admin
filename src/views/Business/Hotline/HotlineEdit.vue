<template>
  <main class="hotlineeditor app-form-entire" v-if="fdata">
    <app-editor-title></app-editor-title>
    <Form :label-width="130" :rules="formRules" ref="form" :model="fdata">
      <Form-item label="来访时间" required prop="visited_at">
        <app-date-picker placeholder="年 / 月 / 日" v-model="fdata.visited_at" formate="yyyy-MM-dd" :editable="false"></app-date-picker>
      </Form-item>
      <Form-item label="家长姓名" required prop="elder_name">
        <Input placeholder="请输入家长姓名" v-model="fdata.elder_name"></Input>
      </Form-item>
      <Form-item label="学员姓名" required prop="student_name">
        <Input placeholder="请输入学员姓名" v-model="fdata.student_name"></Input>
      </Form-item>
      <Form-item label="联系方式" required prop="mobile">
        <Input placeholder="请输入联系方式" v-model="fdata.mobile"></Input>
      </Form-item>
      <Form-item label="选择地区">
        <app-map-cascader v-model="fdata.areas_code"></app-map-cascader>
      </Form-item>
      <Form-item label="当前年级" prop="grade">
        <Select placeholder="请选择......" v-model="fdata.grade">
          <Option
            v-if="dicts.grade"
            v-for="item in dicts.grade"
            :value="item.value"
            :key="item.display_name"
          >
            {{item.display_name}}
          </Option>
        </Select>
      </Form-item>
      <Form-item label="邀约咨询师">
        <Select placeholder="请选择......" v-model="fdata.invited_teacher_id">
          <Option
            v-for="item in advisories"
            :key="item.id"
            :value="item.id">{{item.username}}</Option>
        </Select>
      </Form-item>
      <Form-item label="市场专员" prop="market_staff_name">
        <Input placeholder="请输入市场专员" v-model="fdata.market_staff_name"></Input>
      </Form-item>
      <Form-item label="在读学校" prop="school_name">
        <Input placeholder="请输入在读学校名称" v-model="fdata.school_name"></Input>
      </Form-item>
      <Form-item label="二次上门日期">
        <app-date-picker placeholder="年 / 月 / 日" v-model="fdata.return_visited_at" :editable="false"></app-date-picker>
      </Form-item>
      <Form-item>
        <Button @click.stop="goBack">取消</Button>
        <Button type="primary" @click.stop="handleSubmit('form')" :loading="loading">提交</Button>
      </Form-item>
    </Form>
  </main>
</template>

<script>
/**
 * 热线登记 - 热线编辑
 * @author hjz
 * @version 2017-06-06
 */

import { goBack } from '@/mixins'
import { Http } from '@/utils'
import { GLOBAL, BUSINESS } from '@/store/mutationTypes'
import { editInit, encode } from './modules/config'

export default {
  name: 'hotline-editor',

  mixins: [goBack],

  data() {
    return {
      // 最终提交给后端的数据
      fdata: editInit(),
      // 提交按钮状态控制
      loading: false,
      // 咨询师数据
      advisories: null,
      formRules: {
        visited_at: [this.$rules.required('来访时间')],
        elder_name: [
          this.$rules.required('家长姓名'),
          this.$rules.length(2, 10),
          this.$rules.name,
        ],
        student_name: [
          this.$rules.required('家长姓名'),
          this.$rules.length(2, 10),
          this.$rules.name,
        ],
        mobile: [
          this.$rules.required('手机号码'),
          this.$rules.mobile,
        ],
        grade: [this.$rules.required('当前年级', 'number', 'change')],
        market_staff_name: [
          this.$rules.length(2, 10),
          this.$rules.name,
        ],
        school_name: [
          this.$rules.length(2, 20),
          this.$rules.name,
        ],
      },
    }
  },

  computed: {
    dicts() {
      const { grade } = this.$store.state.dicts
      return { grade }
    },
  },

  methods: {
    submit() {
      this.loading = true
      const fdata = encode(this.fdata)

      if (this.$route.params.id) {
        const id = this.$route.params.id
        this.$store.dispatch(BUSINESS.EDIT.UPDATE, { id, fdata })
          .then(() => { this.loading = false; this.goBack() })
      } else {
        this.$store.dispatch(BUSINESS.EDIT.CREATE, fdata)
          .then(() => { this.loading = false; this.goBack() })
      }
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => { if (valid) this.submit() })
    },
  },

  created() {
    // 获取咨询师数据
    Http.get('/teacher_list?attr=is_student_advisory')
      .then((res) => { this.advisories = res })

    this.$store.dispatch(BUSINESS.EDIT.INIT, this.$route)
      .then((res) => { this.fdata = res; this.$store.commit(GLOBAL.LOADING.HIDE) })
      .catch(() => this.$store.commit(GLOBAL.LOADING.HIDE))
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
