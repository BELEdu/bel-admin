<template>
  <div>
    <h1 class="app-form-header">
      <Icon type="edit"></Icon>
      添加用户
    </h1>

    <Form class="app-form-entire" :label-width="140">
      <Form-item label="用户名">
        <Input placeholder="请输入用户名"></Input>
      </Form-item>
      <Form-item label="姓名">
        <Input placeholder="请输入姓名"></Input>
      </Form-item>
      <Form-item label="员工编号">
        <Input placeholder="请输入员工编号"></Input>
      </Form-item>
      <Form-item label="邮箱账号">
        <Input placeholder="请输入邮箱账号"></Input>
      </Form-item>
      <Form-item label="手机号码">
        <Input placeholder="请输入手机号码"></Input>
      </Form-item>
      <Form-item label="性别">
        <Radio-group>
          <Radio>男</Radio>
          <Radio>女</Radio>
        </Radio-group>
      </Form-item>
      <Form-item label="岗位性质">
        <Radio-group>
          <Radio>全职</Radio>
          <Radio>兼职</Radio>
        </Radio-group>
      </Form-item>
      <Form-item label="部门角色">
        <Cascader placeholder="请选择部门与角色" :data="data"></Cascader>
      </Form-item>
      <Form-item label="密码">
        <Input type="password" placeholder="请输入密码"></Input>
      </Form-item>
      <Form-item label="重复密码">
        <Input type="password" placeholder="请输入密码"></Input>
      </Form-item>
      <Form-item label="状态">
        <i-switch size="large">
          <span slot="open">启用</span>
          <span slot="close">禁用</span>
        </i-switch>
      </Form-item>

      <Form-item>
        <Button type="ghost" size="large">取消</Button>
        <Button type="primary" size="large">提交</Button>
      </Form-item>
    </Form>
  </div>
</template>

<script>
/**
 * 系统管理 - 用户管理 - 用户详情页（新建/编辑）
 * @author lmh
 * @version 2017-06-07
 */

import { GLOBAL } from '@/store/mutationTypes'

export default {
  name: 'app-system-user-detail',

  data: () => ({
    data: [{
      value: 'beijing',
      label: '北京',
      children: [
        {
          value: 'gugong',
          label: '故宫',
        },
        {
          value: 'tiantan',
          label: '天坛',
        },
        {
          value: 'wangfujing',
          label: '王府井',
        },
      ],
    }, {
      value: 'jiangsu',
      label: '江苏',
      children: [
        {
          value: 'nanjing',
          label: '南京',
          children: [
            {
              value: 'fuzimiao',
              label: '夫子庙',
            },
          ],
        },
        {
          value: 'suzhou',
          label: '苏州',
          children: [
            {
              value: 'zhuozhengyuan',
              label: '拙政园',
            },
            {
              value: 'shizilin',
              label: '狮子林',
            },
          ],
        },
      ],
    }],
  }),

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>
