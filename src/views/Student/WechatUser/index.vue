/*
 * 家长管理列表
 * @Author: chenliangshan
 * @Date: 2018-01-18 17:38:40
 * @Last Modified by: chenliangshan
 * @Last Modified time: 2018-01-18 18:32:41
 */

<template>
  <div class="wechat-user">
    <App-table-form @on-submit="search">
      <!-- 关键字搜索 -->
      <Form-item>
        <Input
          v-model="likeValue"
          placeholder="请输入关键字"
        >
          <Select
            v-model="likeKey"
            slot="prepend"
            style="width:7em;"
          >
            <Option
              v-for="likeKey in likeKeys"
              :key="likeKey.value"
              :value="likeKey.value"
            >{{ likeKey.label }}</Option>
          </Select>
        </Input>
      </Form-item>

    </App-table-form>

    <!-- 操作按钮 -->
    <Row
      class="app-content-header"
      type="flex"
      justify="space-between"
    >
      <Col>
        <h2><Icon type="android-contacts"/> 家长列表</h2>
      </Col>
    </Row>

    <!-- 家长信息表格 -->
    <Table
      class="app-table"
      :columns="columns"
      :data="wechatUser.data"
      border
      @on-sort-change="sort"
    ></Table>

    <!-- 分页 -->
    <app-pager
      :data="wechatUser"
      @on-change="goTo"
      @on-page-size-change="pageSizeChange"
    ></app-pager>

    <!-- 解绑弹窗 -->
    <UntieModal
      :visible.sync="untie.visible"
      :students="untie.students"
      @update="fetchData"
    ></UntieModal>

  </div>
</template>

<script>
  import { list } from '@/mixins'
  import { createButton } from '@/utils'
  import UntieModal from './components/UntieModal'

  export default {
    name: 'wechat-user',

    components: {
      UntieModal,
    },

    mixins: [list],

    data() {
      return {
        likeKeys: [
          { label: '家长姓名', value: 'name' },
          { label: '手机号码', value: 'phone' },
          { label: '学员姓名', value: 'student_name' },
        ],
        likeKey: 'name',
        columns: [
          { title: '微信昵称', key: 'nickname', align: 'center', width: 180 },
          { title: '微信 openID', key: 'openid', align: 'center', sortable: 'custom' },
          { title: '真实姓名', key: 'name', align: 'center', width: 180, sortable: 'custom' },
          { title: '手机号码', key: 'phone', align: 'center', width: 180 },
          {
            title: '学员姓名',
            align: 'center',
            render: (h, params) => {
              const studentStr = params.row.students.reduce((str, name, i) => `${str}${i > 0 ? ',' : ''} ${name.display_name}`, '')
              return h('span', null, studentStr)
            },
          },
          {
            title: '操作',
            key: 10086,
            align: 'center',
            width: 100,
            render: createButton([
              {
                text: '解绑',
                type: 'primary',
                isShow: ({ row }) => row.students.length > 0,
                click: row => this.openUntieModal(row.students) },
            ]),
          },
        ],
        wechatUser: {},

        // 解绑弹窗参数
        untie: {
          visible: false,
          students: [],
        },
      }
    },

    methods: {
      // 获取家长信息列表
      getData(qs) {
        return this.$http.get(`/wechatuser?${qs}`)
          .then((result) => {
            this.wechatUser = { ...result }
          })
          .catch(({ message }) => {
            this.errorNotice(message)
          })
      },

      // 打开解绑弹窗
      openUntieModal(students) {
        this.untie.students = students
        this.untie.visible = true
      },
    },

  }
</script>

