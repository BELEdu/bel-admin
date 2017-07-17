<template>
  <div>
    <Form inline class="app-search-form">
      <Form-item>
        <Input v-model="query.like[likeKey]" placeholder="请输入关键字">
          <Select v-model="likeKey" slot="prepend" style="width:6em;">
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
          <svg class="svg-icon" viewBox="0 0 200 200" width="16px" height="16px">
            <path d="M199.95,158.65l0.05-20.287c0,0-13.388-2.664-13.625-3.563c-0.25-0.988-0.513-1.977-0.8-2.914
	c1.563-2.898,9.112-9.299,9.112-9.299l-15.112-20.1c0,0-9.788,8.063-12.226,9.211c-1.137-0.449-2.324-0.836-3.574-1.211
	c-1.313-0.326-4.95-13.238-4.95-13.238l-20.338-0.175c0,0-2.2,12.5-5.475,13.351c-1.112,0.313-2.213,0.736-3.313,1.25
	c-2.438-1.188-12.226-9.375-12.226-9.375l-15.112,20.449c0,0,7.575,7.625,8.075,10.176c-0.313,0.799-0.625,1.625-0.9,2.449
	c-3.25,1.137-12.5,2.975-12.5,2.975l0.05,20.287c0,0,10.738,2.238,12.788,4.025c0.423,1.164,0.902,2.309,1.438,3.426
	c-2.475,3.1-9.112,8.262-9.112,8.262l15.575,20.287c0,0,12.237-7.924,14.25-8.375c1,0.426,2.012,0.838,3.05,1.201
	c1.837,0.65,3.149,12.463,3.149,12.463L158.551,200c0,0,0.699-11.6,2.188-12.063c1.462-0.463,2.912-1,4.313-1.613
	c1.712,0.676,9.725,8.664,9.725,8.664l20.074-20.451c0,0-7.462-5.15-9.512-7.924c0.554-1.16,1.063-2.34,1.525-3.539
	C187.551,161.238,199.95,158.65,199.95,158.65z M148.287,174.025c-14.149,0-25.625-11.475-25.625-25.625
	s11.476-25.613,25.625-25.613c14.15,0,25.613,11.463,25.613,25.613S162.425,174.025,148.287,174.025z M83.112,96.113
	c23.3,0,47.013-22.913,47.013-47.175S107.55,0,84.25,0S37.775,25.275,37.775,49.525C37.775,73.788,59.813,96.113,83.112,96.113z
	 M93.362,106.213h-33.6c-11.663,0-31.38,15.936-44.95,36.25C8.766,151.538,4.5,162.5,0.15,180.85
	c21.1-0.1,39.763-0.213,82.212-0.361c14.088-0.039,4.488-11.613,4.488-26.289C86.85,120.762,115.375,106.213,93.362,106.213z"/>
          </svg>
          角色管理
        </h2>
      </Col>
      <Col>
        <Button type="primary" @click="$router.push('/system/role/edit')">添加角色</Button>
      </Col>
    </Row>

    <Table
      class="app-table"
      :columns="columns"
      :data="list.data"
      border
    ></Table>

    <app-pager :data="list" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>

    <app-warn-modal v-model="removeModal" title="删除确认" action="删除" :loading="formLoading" @on-ok="beforeRemove">
      <Form :model="form" :rules="rules" ref="form">
        <app-form-alert :errors="formErrors"></app-form-alert>
        <div class="text-center" style="margin: -10px 0 10px;">
          <p>该角色的成员不为空。</p>
          <p>删除该角色后，将导致其关联的用户不可用。是否继续删除？</p>
        </div>
        <Form-item prop="password">
          <Input type="password" placeholder="请输入密码" v-model="form.password"></Input>
        </Form-item>
      </Form>
    </app-warn-modal>
  </div>
</template>

<script>
/**
 * 系统管理 - 角色管理
 * @author lmh
 * @version 2017-06-22
 */

import { mapState } from 'vuex'
import { list, remove } from '@/mixins'
import { SYSTEM } from '@/store/mutationTypes'
import { createButton } from '@/utils'

export default {
  name: 'app-system-role',

  mixins: [list, remove],

  data() {
    return {
      likeKeys: [
        { label: '角色编号', value: 'role_number' },
        { label: '角色名称', value: 'display_name' },
        { label: '所属部门', value: 'department_id' },
      ],
      likeKey: 'display_name',

      columns: [
        { title: '序号', type: 'index', align: 'center', width: 50 },
        { title: '角色编号', key: 'role_number', align: 'center' },
        { title: '角色名称', key: 'display_name', align: 'center' },
        { title: '所属部门', key: 'department_name', align: 'center' },
        {
          title: '角色类型',
          key: 'role_type',
          align: 'center',
          render: (h, { row }) => h('span', row.role_type === 1 ? '系统定制' : '自定义'),
        },
        { title: '角色描述', key: 'description', align: 'center', width: 300 },
        {
          title: '操作',
          align: 'center',
          render: createButton([
            { text: '删除', type: 'error', isShow: ({ row }) => row.role_type === 2, click: row => this.prepareRemove(row.id) },
            // { text: '筛选角色', type: 'primary', click: this.filterByDisplayName },
            { text: '编辑', type: 'primary', click: row => this.$router.push(`/system/role/edit/${row.id}`) },
          ]),
        },
      ],
    }
  },

  computed: {
    ...mapState({
      list: state => state.system.role.list,
    }),
  },

  methods: {
    // 按角色名称筛选列表
    // filterByDisplayName({ display_name }) {
    //   this.query.equal = { display_name }
    //   this.search()
    // },

    // 获取列表数据
    getData(qs) {
      return this.$store.dispatch(SYSTEM.ROLE.INIT, qs)
    },

    remove() {
      return this.$store.dispatch(SYSTEM.ROLE.DELETE, {
        id: this.removeId,
        CheckoutPassword: this.CheckoutPassword,
      })
    },
  },
}
</script>
