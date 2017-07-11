<template>
  <div>
    <Form inline class="app-search-form">
      <Form-item>
        <Input v-model="query.like[likeKey]" placeholder="请输入关键字">
          <Select v-model="likeKey" slot="prepend" style="width: 6em">
            <Option v-for="likeKey in likeKeys" :key="likeKey.value" :value="likeKey.value">{{ likeKey.label }}</Option>
          </Select>
        </Input>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search" @click="search">搜索</Button>
      </Form-item>
    </Form>

    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2>
          <svg class="svg-icon" viewBox="0 0 200 200" width="19px" height="19px">
            <path d="M2.718,95.046h104.898v23.479H2.718V95.046z M2.718,48.085h104.898v23.48H2.718V48.085z M2.718,142.004H72.65v23.479H2.718
	V142.004L2.718,142.004z M187.261,136.127c-5.442-1.873-10.979-3.846-17.611-5.871c-8.881-2.711-17.733-5.882-17.733-5.882v-5.868
	c0,0,11.74-11.729,11.74-35.223c0-5.87,0.006-7.402,0.006-11.646c0-14.769-10.625-22.788-23.364-23.539v0.005
	c-12.738,0.752-23.363,8.771-23.363,23.54c0,4.245,0.006,5.777,0.006,11.647c0,23.492,11.741,35.221,11.741,35.221v5.871
	c0,0-8.854,3.169-17.734,5.882c-6.633,2.025-12.169,3.997-17.611,5.871c-11.74,4.038-11.74,23.479-11.74,23.479v5.87h58.702H199
	v-5.87C199.001,159.608,199.001,140.165,187.261,136.127z"/>
          </svg>
          用户列表
        </h2>
      </Col>
      <Col>
        <Button type="primary" @click="$router.push('/system/user/edit')">添加用户</Button>
      </Col>
    </Row>

    <Table
      class="app-table"
      :columns="columns"
      :data="list.data"
      border
      @on-sort-change="sort"
    ></Table>

    <app-pager :data="list" @on-change="goTo"></app-pager>
  </div>
</template>

<script>
/**
 * 系统管理 - 用户管理
 * @author lmh
 * @version 2017-06-22 初步动态化
 */

import { mapState } from 'vuex'
import { list } from '@/mixins'
import { SYSTEM } from '@/store/mutationTypes'
import { createButton } from '@/utils'

export default {
  name: 'app-system-user',

  mixins: [list],

  data() {
    return {
      likeKeys: [
        { label: '员工编号', value: 'user_number' },
        { label: '用户名', value: 'username' },
        { label: '姓名', value: 'realname' },
        { label: '手机号码', value: 'mobile' },
        { label: '岗位性质', value: 'users_job_type' },
        { label: '状态', value: 'status' },
      ],
      likeKey: 'user_number',

      columns: [
        { title: '员工编号', key: 'user_number', align: 'center' },
        { title: '用户名', key: 'username', align: 'center' },
        { title: '姓名', key: 'realname', align: 'center' },
        { title: '手机号码', key: 'mobile', align: 'center' },
        { title: '邮箱', key: 'email', align: 'center' },
        { title: '性别', key: 'gender', align: 'center' },
        { title: '部门角色', key: 'users_job_type', align: 'center' },
        { title: '岗位性质', key: 'users_job_type', align: 'center' },
        { title: '最近登录时间', key: 'updated_at', align: 'center', sortable: 'custom' },
        { title: '状态', key: 'status', align: 'center' },
        {
          title: '操作',
          key: 11,
          align: 'center',
          width: 110,
          render: createButton([
            { text: '删除', type: 'error' },
            { text: '编辑', type: 'primary', click: row => this.$router.push(`/system/user/edit/${row.id}`) },
          ]),
        },
      ],
    }
  },

  computed: {
    ...mapState({
      list: state => state.system.user.list,
    }),
  },

  methods: {
    getData(qs) {
      return this.$store.dispatch(SYSTEM.USER.INIT, qs)
    },
  },
}
</script>

<style>

</style>
