<template>
  <div class="app-form-entire">
    <app-editor-title></app-editor-title>
    <Form :label-width="130">
      <Form-item label="班级名称" required>
        <Input placeholder="请输入班级名称"></Input>
      </Form-item>
      <Form-item label="班级分类">
        <Select placeholder="请选择...">
          <Option value="1">奥数小班</Option>
          <Option value="2">作文小班</Option>
          <Option value="3">新初一衔接班</Option>
        </Select>
      </Form-item>
      <Form-item label="当前年级">
        <Select placeholder="请选择...">
          <Option value="1">小学一年级</Option>
          <Option value="2">小学二年级</Option>
          <Option value="3">小学三年级</Option>
        </Select>
      </Form-item>
      <Form-item label="班主任">
        <Select placeholder="请选择...">
          <Option value="1">张三</Option>
          <Option value="2">李四</Option>
          <Option value="3">王五</Option>
        </Select>
      </Form-item>
      <Form-item label="教师">
        <Select placeholder="请选择...">
          <Option value="1">张三</Option>
          <Option value="2">李四</Option>
          <Option value="3">王五</Option>
        </Select>
      </Form-item>
      <Form-item label="开办日期" >
        <Date-picker placeholder="请选择开办日期"></Date-picker>
      </Form-item>
      <Form-item label="选择学员" >
        <Select v-model="formClass.student" placeholder="请选择学生..." filterable multiple>
          <Option v-for="item in studentList" :value="item.value" :key="item">{{ item.label }}</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Button>取消</Button>
        <Button type="primary">提交</Button>
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
 */
import { GLOBAL } from '@/store/mutationTypes'

export default {
  name: 'app-student-classes-edit',

  data() {
    return {
      // 编辑班级表单
      formClass: {
        student: [],
      },
       // 学生列表
      studentList: [
        {
          value: '张三',
          label: '张三',
        },
        {
          value: '李四',
          label: '李四',
        },
        {
          value: '王五',
          label: '王五',
        },
        {
          value: '小六',
          label: '小六',
        },
        {
          value: '小七',
          label: '小七',
        },
        {
          value: '小八',
          label: '小八',
        },
      ],

    }
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">
@import '~vars';
</style>
