<template>
  <div class="setting-equipment">
    <Form inline class="app-search-form">
      <Form-item>
        <Input v-model="likeValue" placeholder="请输入关键字">
        <Select v-model="likeKey" slot="prepend" style="width:6em;">
          <Option v-for="key in likeKeys" :key="key.value" :value="key.value">{{ key.label }}</Option>
        </Select>
        </Input>
      </Form-item>
      <Form-item>
        <Select v-model="query['equal[equipment_status]']" placeholder="设备状态" style="width: 6em;">
          <Option value="">全部</Option>
          <Option
            v-for="item in equipmentStatus"
            :key="item.value"
            :value="item.value"
          >{{ item.display_name }}</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search" @click="search">搜索</Button>
      </Form-item>
    </Form>

    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
      <h2><Icon type="toggle-filled"/> 设备管理</h2>
      </Col>
    </Row>

    <!--列表-->
    <Table class="app-table" :columns="columns" :data="list.data" border @on-sort-change="sort"></Table>

    <!--分页-->
    <app-pager :data="list" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>

    <!--删除-->
    <app-warn-modal
      title="删除教室"
      v-model="dialog.delete"
      :loading="dialog.deleteLoading"
      @on-ok="deleteForm"
    >
      <div class="text-center">该教室删除后将无法恢复，是否继续删除？</div>
    </app-warn-modal>
  </div>
</template>

<script>
  /**
   * 设备管理
   * @author chenliangshan
   * @version 2017-10-27
   */

  import { mapState } from 'vuex'
  import { list, form } from '@/mixins'
  import { createButton } from '@/utils'

  export default {
    name: 'setting-equipment',

    mixins: [list, form],

    data() {
      return {
        likeKeys: [
          { label: '硬件编号', value: 'hardware_number' },
          { label: '设备编号', value: 'equipment_display_number' },
          { label: '设备类型', value: 'equipment_type_name' },
          { label: '教室编号', value: 'equipment_number' },
        ],

        likeKey: 'hardware_number',

        query: {
          'equal[equipment_status]': '',
        },

        columns: [
          { title: '设备编号', key: 'equipment_display_number', align: 'center' },
          { title: '设备类型', key: 'equipment_type_name', align: 'center' },
          { title: '设备状态', key: 'equipment_status_name', align: 'center' },
          {
            title: '是否占用',
            align: 'center',
            render: (h, param) => h('span', null, param.row.is_used ? '是' : '否'),
          },
          {
            title: '操作',
            align: 'center',
            width: 140,
            render: createButton([
              { text: '删除',
                type: 'error',
                isShow: ({ row }) => row.operation.delete,
                click: (row) => {
                  this.deleteHandler(row)
                },
              },
            ]),
          },
        ],

        list: {},

        dialog: {
          currentItem: {},
          delete: false,
          deleteLoading: false,
        },
      }
    },

    computed: {
      ...mapState({
        equipmentStatus: state => state.dicts.equipment_status,
      }),
    },

    methods: {
      getData(qs) {
        return this.$http.get(`/setting/equipment${qs}`)
          .then((result) => {
            this.list = result
          })
      },

      // 删除操作
      deleteHandler(item) {
        this.dialog.currentItem = item
        this.dialog.delete = true
      },

      // 删除设备
      deleteForm() {
        this.dialog.deleteLoading = true
        this.$http.delete(`/setting/equipment/${this.dialog.currentItem.id}`)
          .then(() => {
            this.$Message.success({
              content: '删除成功',
              onClose: () => {
                this.dialog.deleteLoading = false
                this.dialog.delete = false
                this.fetchData()
              },
            })
          })
          .catch(() => {
            this.dialog.deleteLoading = false
            this.$Message.error('删除失败')
          })
      },
    },
  }
</script>

<style lang="less" scoped>
  .setting-equipment {

  }
</style>
