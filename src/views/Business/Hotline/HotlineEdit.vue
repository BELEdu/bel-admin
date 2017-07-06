<template>
  <main class="hotlineeditor app-form-entire" v-if="fdata">
    <app-editor-title></app-editor-title>
    <Form :label-width="130" :rules="formRules" ref="form" :model="fdata">
      <Form-item label="来访时间" required prop="visited_at">
        <Date-picker placeholder="年 / 月 / 日" v-model="fdata.visited_at" formate="yyyy-MM-dd" type="date" :editable="false"></Date-picker>
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
        <!--地区接口还未确定 -->
        <Cascader :data="map" trigger="hover"></Cascader>
      </Form-item>
      <Form-item label="当前年级">
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
          <Option value="1">甲</Option>
          <Option value="2">乙</Option>
          <Option value="3">丙</Option>
          <Option value="4">丁</Option>
        </Select>
      </Form-item>
      <Form-item label="市场专员" prop="market_staff_name">
        <Input placeholder="请输入市场专员" v-model="fdata.market_staff_name"></Input>
      </Form-item>
      <Form-item label="在读学校" prop="school_name">
        <Input placeholder="请输入在读学校名称" v-model="fdata.school_name"></Input>
      </Form-item>
      <Form-item label="二次上门日期">
        <Date-picker placeholder="年 / 月 / 日" v-model="fdata.return_visited_at" :editable="false"></Date-picker>
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

import map from '@/views/Business/casdata'
import { goBack } from '@/mixins'
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
      // 表单预置数据
      map,
      // 年级信息 - 后端字典数据
      grade: null,
      formRules: {
        visited_at: [{ required: true, message: '请选择日期' }],
        elder_name: [
          { required: true, message: '请输入家长姓名', trigger: 'blur' },
          { type: 'string', min: 2, max: 10, message: '长度应该在2到10之间' },
          { type: 'string', pattern: /^[A-Za-z\u4e00-\u9fa5]+$/, message: '仅允许中文，大小写字母', trigger: 'blur' },
        ],
        student_name: [
          { required: true, message: '请输入学生姓名', trigger: 'blur' },
          { type: 'string', min: 2, max: 10, message: '长度应该在2到10之间', trigger: 'blur' },
          { type: 'string', pattern: /^[A-Za-z\u4e00-\u9fa5]+$/, message: '仅允许中文，大小写字母', trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          { type: 'string', pattern: /^1/, min: 11, max: 11, message: '请输入正确的手机号码', trigger: 'blur' },
        ],
        market_staff_name: [
          { type: 'string', min: 2, max: 10, message: '长度应该在2到10之间' },
          { type: 'string', pattern: /^[A-Za-z\u4e00-\u9fa5]+$/, min: 2, max: 10, message: '请输入正确的姓名', trigger: 'blur' },
        ],
        school_name: [
          { type: 'string', min: 2, max: 20, message: '长度应该在2到20之间' },
          { type: 'string', pattern: /^[A-Za-z\u4e00-\u9fa5]+$/, message: '仅允许中文，大小写字母', trigger: 'blur' },
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
          .then(() => { this.loading = false; this.cancel() })
      } else {
        this.$store.dispatch(BUSINESS.EDIT.CREATE, fdata)
          .then(() => { this.loading = false; this.cancel() })
      }
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => { if (valid) this.submit() })
    },
  },

  created() {
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
