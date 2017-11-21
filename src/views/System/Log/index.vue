<template>
  <div>
    <App-table-form @on-submit="search">
      <Form-item>
        <app-date-picker
          type="daterange"
          date-type="daterange"
          v-model="query['between[created_at]']"
          @on-change="val => query['between[created_at]'] = !val[0] ? [] : val"
          placeholder="选择日期"></app-date-picker>
      </Form-item>
      <Form-item>
        <Input type="text" v-model="query['equal[model_name]']" placeholder="请输入关键字"></Input>
      </Form-item>
    </App-table-form>

    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2>
          <svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 200 200"><path d="M165.777 2H34.692c-7.209 0-13.108 5.898-13.108 13.108v170.41c0 7.211 5.899 13.109 13.108 13.109h131.085c7.211 0 13.109-5.896 13.109-13.109V15.108C178.887 7.898 172.988 2 165.777 2zM69.94 181.473H57.207V18.656H69.94v162.817zm75.153-125.44l-13.109-13.108-13.108 13.108V16.707h26.218v39.326h-.001z"/></svg>
          日志管理
        </h2>
      </Col>
      <Col>
        <Button type="primary">导出日志</Button>
      </Col>
    </Row>

    <!--列表-->
    <Table class="app-table" :columns="columns" :data="list.data" border @on-sort-change="sort"></Table>

    <!--分页-->
    <app-pager :data="list" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>

    <!--查看详细-->
    <app-form-modal
      title="查看"
      v-model="dialog.view"
      :loading="false"
      :ok-btn="false"
      cancel-value="关闭"
    >
      <Table class="app-table" :columns="viewColumns" :data="dialog.currentItem.log_list" border></Table>
    </app-form-modal>
  </div>
</template>

<script>
  /**
   * 系统日志
   * @author chenliangshan
   * @version 2017-10-30
   */

  import { GLOBAL } from '@/store/mutationTypes'
  import { list } from '@/mixins'
  import { createButton } from '@/utils'

  export default {
    name: 'app-system-log',

    mixins: [list],

    data() {
      return {
        query: {
          'equal[model_name]': '',
          'between[created_at]': [],
        },

        columns: [
          { title: '操作时间', key: 'created_at', align: 'center' },
          { title: '用户名', key: 'username', align: 'center' },
          { title: '姓名', key: 'user_realname', align: 'center' },
          { title: '模块', key: 'model_name', align: 'center' },
          { title: '部门角色', key: 'department_name', align: 'center' },
          {
            title: '操作',
            align: 'center',
            width: 140,
            render: createButton([
              { text: '查看',
                type: 'primary',
                click: (row) => {
                  this.viewHandler(row)
                },
              },
            ]),
          },
        ],

        list: {},

        dialog: {
          view: false,
          currentItem: {},
        },

        viewColumns: [
          {
            title: '字段名(中)',
            align: 'center',
            render: (h, { row }) => h('div', null, `${row.field_cn}`),
          },
          {
            title: '字段名(英)',
            align: 'center',
            render: (h, { row }) => h('div', null, `${row.field_en}`),
          },
          {
            title: '旧值',
            align: 'center',
            render: (h, { row }) => h('span', null, `${row.old_value || '-'}`),
          },
          {
            title: '新值',
            align: 'center',
            render: (h, { row }) => h('span', null, `${row.new_value}`),
          },
        ],
      }
    },

    methods: {
      getData(qs) {
        return this.$http.get(`/log${qs}`)
          .then((result) => {
            this.list = { ...result }
          })
      },

      viewHandler(row) {
        this.dialog.currentItem = { ...row }
        this.dialog.view = true
      },
    },

    created() {
      this.$store.commit(GLOBAL.LOADING.HIDE)
    },
  }
</script>

<style lang="postcss" scoped>

</style>
