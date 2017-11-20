<template>
  <div class="setting-school">
    <Form inline class="app-search-form">
      <Form-item>
        <app-map-cascader v-model="areaCode" :level="2"></app-map-cascader>
      </Form-item>
      <Form-item>
        <Input v-model="query['equal[display_name]']" placeholder="请输入学校名称"/>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search" @click="search">搜索</Button>
      </Form-item>
    </Form>

    <Row class="app-content-header" type="flex" justify="space-between">
      <Col :span="12">
        <h2><Icon type="flag"/> 学校管理</h2>
      </Col>
      <Col :span="12" class="text-right">
        <Button type="primary" icon="plus-round" @click="dialog.visible = true">添加学校</Button>
      </Col>
    </Row>

    <!--列表-->
    <Table class="app-table" :columns="columns" :data="list.data" border @on-sort-change="sort"></Table>

    <!--分页-->
    <app-pager :data="list" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>

    <!--添加学校-->
    <app-form-modal
      title="添加学校"
      v-model="dialog.visible"
      :loading="dialog.loading"
      @on-ok="addSubmit"
    >
      <Form :model="dialog.addForm" ref="addForm" :rules="dialog.rulesForm" class="setting-school__dialog">
        <app-form-alert :errors="formErrors"></app-form-alert>
        <FormItem prop="area" label="地区">
          <app-map-cascader v-model="dialog.addForm.area" :level="2"></app-map-cascader>
        </FormItem>
        <FormItem prop="displayName" label="输入学校名称<每行新增一个学校>">
          <Input
            placeholder="请填写学校名称"
            type="textarea"
            :autosize="{minRows: 8,maxRows: 14}"
            v-model="dialog.addForm.displayName"/>
        </FormItem>
      </Form>
    </app-form-modal>

    <!--编辑学校-->
    <app-form-modal
      title="编辑学校"
      v-model="dialog.edit"
      :loading="dialog.editLoading"
      @on-ok="editSubmit"
    >
      <Form :model="dialog.editForm" ref="editForm" :rules="dialog.rulesForm" class="setting-school__dialog">
        <app-form-alert :errors="formErrors"></app-form-alert>
        <FormItem prop="area" label="地区">
          <app-map-cascader v-model="dialog.editForm.area" :level="2"></app-map-cascader>
        </FormItem>
        <FormItem prop="displayName" label="输入学校名称<每行新增一个学校>">
          <Input
            placeholder="请填写学校名称"
            type="text"
            v-model="dialog.editForm.displayName"/>
        </FormItem>
      </Form>
    </app-form-modal>

    <!--删除-->
    <app-warn-modal
      title="删除学校"
      v-model="dialog.delete"
      :loading="dialog.deleteLoading"
      @on-ok="deleteForm"
    >
      <div class="text-center">该学校删除后将无法恢复，是否继续删除？</div>
    </app-warn-modal>
  </div>
</template>

<script>
  /**
   * 学校管理
   * @author chenliangshan
   * @version 2017-10-25
   */

  import { mapState } from 'vuex'
  import trim from 'lodash/trim'
  import { list, form } from '@/mixins'
  import { SETTING } from '@/store/mutationTypes'
  import { createButton } from '@/utils'

  export default {
    name: 'setting-school',

    mixins: [list, form],

    data() {
      return {
        query: {
          'equal[province_code]': '',
          'equal[city_code]': '',
          'equal[display_name]': '',
        },

        areaCode: [],

        columns: [
          { title: '学校名称', key: 'display_name', align: 'center' },
          { title: '地区', key: 'area', align: 'center' },
          {
            title: '操作',
            width: 140,
            align: 'center',
            render: createButton([
              { text: '编辑',
                isShow: ({ row }) => row.operation.edit,
                type: 'primary',
                click: (row) => {
                  this.edit(row)
                },
              },
              { text: '删除',
                isShow: ({ row }) => row.operation.delete,
                type: 'error',
                click: (row) => {
                  this.deleteHandler(row)
                },
              },
            ]),
          },
        ],

        dialog: {
          visible: false,
          loading: false,
          addForm: {
            area: [],
            displayName: '',
          },
          rulesForm: {
            area: [
              { required: true, type: 'array', message: '请选择地区' },
              {
                type: 'array',
                validator: (type, value, callback) => {
                  if (value.length === 2) {
                    return callback([])
                  }
                  return callback(['请选择市级地区'])
                },
              },
            ],
            displayName: [
              { required: true, message: '请填写学校名称' },
              { type: 'string', max: 255, message: '不能超出250个字符' },
              {
                type: 'string',
                validator: (type, value, callback) => {
                  if (trim(value)) {
                    return callback([])
                  }
                  return callback(['不能以空格开头'])
                },
              },
            ],
          },

          edit: false,
          editLoading: false,
          editItem: {},
          editForm: {
            area: [],
            displayName: '',
          },

          delete: false,
          deleteLoading: false,
          deleteItem: {},
        },
      }
    },

    computed: {
      ...mapState({
        list: state => state.setting.school.list,
      }),
    },

    watch: {
      areaCode(val) {
        if (val.length) {
          this.query['equal[province_code]'] = val[0]
          this.query['equal[city_code]'] = val[1]
        } else {
          this.query['equal[province_code]'] = ''
          this.query['equal[city_code]'] = ''
        }
      },
    },

    methods: {
      getData(qs, to) {
        this.areaCode = to.query['equal[province_code]'] ?
          [to.query['equal[province_code]'], to.query['equal[city_code]']] : []
        return this.$store.dispatch(SETTING.SCHOOL.LIST, qs)
      },

      // 添加学校
      addSubmit() {
        this.$refs.addForm.validate((valid) => {
          const { displayName, area } = this.dialog.addForm
          if (valid && trim(displayName)) {
            const [province_code, city_code] = area
            let campuses = []
            if (trim(displayName)) {
              campuses = trim(displayName).split('\n').map(name => ({
                display_name: name,
              }))
            }
            this.dialog.loading = true
            this.$http.post('/setting/school', {
              province_code,
              city_code,
              campuses,
            })
              .then(() => {
                this.$Message.success({
                  content: '添加成功',
                  onClose: () => {
                    this.$refs.addForm.resetFields()
                    this.dialog.loading = false
                    this.dialog.visible = false
                    this.goTo()
                  },
                })
              })
              .catch((errors) => {
                this.dialog.loading = false
                this.errorHandler(errors)
              })
          }
        })
      },

      // 编辑学校
      edit(item) {
        this.dialog.editItem = { ...item }
        this.dialog.edit = true
        this.$http.get(`/setting/school/${item.id}`)
          .then(({ province_code, city_code, display_name }) => {
            this.dialog.editForm = {
              area: [province_code, city_code],
              displayName: display_name,
            }
          })
          .catch(() => {
            this.dialog.edit = false
            this.$Message.error('请求失败')
          })
      },

      // 更新学校
      editSubmit() {
        this.$refs.editForm.validate((valid) => {
          const { displayName, area } = this.dialog.editForm
          const [province_code, city_code] = area
          if (valid && trim(displayName)) {
            this.dialog.editLoading = true
            this.$http.patch(`/setting/school/${this.dialog.editItem.id}`, {
              id: this.dialog.editItem.id,
              province_code,
              city_code,
              display_name: displayName,
            })
              .then(() => {
                this.$Message.success({
                  content: '编辑成功',
                  onClose: () => {
                    this.$refs.editForm.resetFields()
                    this.dialog.editLoading = false
                    this.dialog.edit = false
                    this.dialog.editItem = {}
                    this.fetchData()
                  },
                })
              })
              .catch((errors) => {
                this.dialog.editLoading = false
                this.errorHandler(errors)
              })
          }
        })
      },

      // 删除操作
      deleteHandler(item) {
        this.dialog.deleteItem = item
        this.dialog.delete = true
      },

      // 删除学校
      deleteForm() {
        this.dialog.deleteLoading = true
        this.$http.delete(`/setting/school/${this.dialog.deleteItem.id}`)
          .then(() => {
            this.$Message.success({
              content: '删除成功',
              onClose: () => {
                this.dialog.deleteLoading = false
                this.dialog.delete = false
                this.dialog.deleteItem = {}
                this.fetchData()
              },
            })
          })
          .catch((errors) => {
            this.dialog.deleteLoading = false
            this.errorHandler(errors)
          })
      },
    },

  }
</script>

<style lang="less" scoped>
  .setting-school {

    &__dialog {
      width: 300px;
      margin: 0 auto;
    }
  }
</style>
