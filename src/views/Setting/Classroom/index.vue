<template>
  <div class="setting-classroom">
    <Form inline class="app-search-form">
      <Form-item>
        <Input v-model="likeValue" placeholder="请输入关键字">
        <Select v-model="likeKey" slot="prepend" style="width:6em;">
          <Option v-for="key in likeKeys" :key="key.value" :value="key.value">{{ key.label }}</Option>
        </Select>
        </Input>
      </Form-item>
      <Form-item>
        <Select v-model="query['equal[classroom_status]']">
          <Option value="">全部</Option>
          <Option value="1">上课</Option>
          <Option value="2">下课</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search" @click="search">搜索</Button>
      </Form-item>
    </Form>

    <Row class="app-content-header" type="flex" justify="space-between">
      <Col :span="12">
      <h2><Icon type="ios-albums"/> 教室管理</h2>
      </Col>
      <Col :span="12" class="text-right">
      <Button
        type="primary"
        icon="plus-round"
        v-if="this.verifyPermissions('front.setting.classroom.store')"
        @click.native="editHandler(false)"
      >添加教室</Button>
      </Col>
    </Row>

    <!--列表-->
    <Table class="app-table" :columns="columns" :data="list.data" border @on-sort-change="sort"></Table>

    <!--分页-->
    <app-pager :data="list" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>

    <!--添加|编辑教室-->
    <app-form-modal
      :title="dialog.title"
      v-model="dialog.visible"
      :loading="dialog.loading"
      @on-ok="submitForm"
      @on-cancel="cancelHandler"
      @on-close="cancelHandler"
    >
      <Form :model="dialog.form" ref="classForm" :rules="dialog.rulesForm" class="setting-classroom__dialog">
        <app-form-alert :errors="formErrors"></app-form-alert>
        <FormItem prop="department_id" label="校区">
          <Select v-model="dialog.form.department_id" :disabled="dialog.type !== 'add'" @on-change="getClassNumber(dialog.form.department_id)">
            <Option v-for="list in dialog.schoolList" :key="list.id" :value="list.id">{{list.display_name}}</Option>
          </Select>
        </FormItem>
        <FormItem prop="classroom_number" label="教室编号">
          <Input
            placeholder="请填写教室编号"
            type="text"
            :disabled="dialog.type !== 'add'"
            v-model="dialog.form.classroom_number"/>
        </FormItem>
        <FormItem label="备注">
          <Input
            placeholder="请填写备注"
            type="textarea"
            :autosize="{minRows: 6,maxRows: 8}"
            v-model="dialog.form.remark"/>
        </FormItem>
      </Form>
    </app-form-modal>

    <!--查看设备-->
    <app-form-modal
      title="查看设备"
      v-model="dialog.view"
      :loading="false"
      :ok-btn="false"
      cancel-value="关闭"
    >
      <Table class="app-table" :columns="viewColumns" :data="dialog.currentItem.equipment" border></Table>
    </app-form-modal>
  </div>
</template>

<script>
  /**
   * 教室设备
   * @author chenliangshan
   * @version 2017-10-27
   */

  import { list, form, verify } from '@/mixins'
  import { createButton } from '@/utils'

  export default {
    name: 'setting-classroom',

    mixins: [list, form, verify],

    data() {
      return {
        likeKeys: [
          { label: '校区', value: 'display_name' },
          { label: '教室编号', value: 'equipment_number' },
          { label: '教师名称', value: 'equipment_type_name' },
          { label: '教室设备', value: 'equipment_display_number' },
        ],

        likeKey: 'display_name',

        query: {
          'equal[classroom_status]': '',
        },

        dialog: {
          schoolList: [],
          visible: false,
          loading: false,
          form: {
            department_id: '',
            classroom_number: '',
            remark: '',
          },
          currentItem: {},
          title: '添加教室',
          type: 'add',
          rulesForm: {
            department_id: [
              { required: true, type: 'number', message: '请选择校区' },
            ],
            classroom_number: [
              { required: true, type: 'string', message: '请填写教室编号' },
              { type: 'string', min: 4, max: 4, message: '请填写4位有效教室编号' },
            ],
            remark: [
              { type: 'string', max: 255, message: '不能超过250个字符' },
            ],
          },

          view: false,
        },

        columns: [
          {
            title: '校区',
            align: 'center',
            render: (h, param) => h('span', null, `${param.row.department ? param.row.department.display_name : ''}`),
          },
          { title: '教室编号', key: 'classroom_number', align: 'center' },
          {
            title: '教室设备',
            align: 'center',
            render: (h, param) => param.row.equipment.map(item => h('p', null, `${item.equipment_display_number}`)),
          },
          { title: '教室状态', key: 'classroom_status_name', align: 'center' },
          { title: '备注', key: 'remark', align: 'center' },
          {
            title: '操作',
            align: 'center',
            width: 140,
            render: createButton([
              { text: '编辑',
                type: 'primary',
                isShow: () => this.verifyPermissions('front.setting.classroom.update'),
                click: (row) => {
                  this.editHandler(row)
                },
              },
              { text: '查看设备',
                type: 'primary',
                isShow: () => this.verifyPermissions('front.setting.classroom.show'),
                click: (row) => {
                  this.showHandler(row)
                },
              },
            ]),
          },
        ],

        viewColumns: [
          { title: '设备编号', key: 'equipment_display_number', align: 'center' },
          { title: '设备类型', key: 'equipment_type_name', align: 'center' },
          { title: '设备状态', key: 'equipment_status_name', align: 'center' },
        ],

        list: {},
      }
    },

    methods: {
      getData(qs) {
        return this.$http.get(`/setting/classroom${qs}`)
          .then((result) => {
            this.list = { ...result }
          })
      },

      // 获取教室编号
      getClassNumber(id) {
        if (!id) return false
        return this.$http.get(`/setting/classroom/classroom_number?department_id=${id}`)
          .then(({ classroom_number }) => {
            this.dialog.form.classroom_number = classroom_number
          })
      },

      // 添加|编辑教室
      editHandler(item = '') {
        this.$http.get('/setting/classroom/store_before')
          .then(({ school_list }) => {
            this.dialog.schoolList = [...school_list]
            if (item) {
              // 编辑
              this.dialog.currentItem = item
              const { department_id, classroom_number, remark } = this.dialog.currentItem
              this.dialog.form = { department_id, classroom_number, remark }
              this.dialog.type = 'edit'
              this.dialog.title = '编辑教室'
            } else {
              // 添加
              this.dialog.type = 'add'
              this.dialog.title = '添加教室'
            }
            this.dialog.visible = true
          })
      },

      // 添加|编辑提交
      submitForm() {
        this.$refs.classForm.validate((valid) => {
          if (valid) {
            this.dialog.loading = true
            if (this.dialog.type === 'edit') {
              this.$http.patch(`/setting/classroom/${this.dialog.currentItem.id}`, this.dialog.form)
                .then(() => {
                  this.$Message.success({
                    content: '编辑成功',
                    onClose: () => {
                      this.dialog.loading = false
                      this.dialog.visible = false
                      this.fetchData()
                    },
                  })
                })
                .catch((errors) => {
                  this.dialog.loading = false
                  this.errorHandler(errors)
                })
            } else {
              this.$http.post('/setting/classroom', this.dialog.form)
                .then(() => {
                  this.$Message.success({
                    content: '添加成功',
                    onClose: () => {
                      this.dialog.loading = false
                      this.dialog.visible = false
                      this.fetchData()
                    },
                  })
                })
                .catch((errors) => {
                  this.dialog.loading = false
                  this.errorHandler(errors)
                })
            }
          }
        })
      },

      // 查看设备
      showHandler(item) {
        this.dialog.currentItem = item
        this.dialog.view = true
      },

      // 取消跟关闭操作
      cancelHandler() {
        this.dialog.form = {
          department_id: '',
          classroom_number: '',
          remark: '',
        }
        this.$refs.classForm.resetFields()
      },
    },
  }
</script>

<style lang="less" scoped>
  .setting-classroom {

  }
</style>
