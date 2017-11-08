<template>
  <div>
    <!-- 管理收藏标签模态框 -->
    <app-form-modal
      :value="value"
      @input="value => $emit('input', value)"
      title="管理收藏标签"
      :loading="loading.modal"
      @on-ok="closeModal()"
      @on-cancel="closeModal()"
      :maskClosable="true"
      class="label-modal"
    >
      <Form ref="form" :model="form" :rules="rules" :label-width="0">
        <app-form-alert :errors="formErrors"></app-form-alert>
        <Form-item prop="display_name">
          <Row>
            <Col span="19">
              <Input placeholder="请输入标签名称" v-model="form.display_name"></Input>
            </Col>
            <Col span="4" offset="1">
              <Button type="primary" long @click="beforeSubmit" :loading="formLoading">添加</Button>
            </Col>
          </Row>
        </Form-item>
      </Form>

      <div class="label-modal__table">
        <Table size="small" class="app-table point-table" :columns="columns" :data="list" border></Table>
      </div>
    </app-form-modal>

    <!-- 删除模态框 -->
    <app-warn-modal
      v-model="deleteModal"
      title="删除确认"
      :loading="loading.delete"
      @on-ok="deleteLabel()"
      action="删除"
    >
      <div class="text-center">删除该标签 <span class="color-primary">" {{deleteName}} "</span> 后将无法再恢复，是否继续删除？</div>
    </app-warn-modal>
  </div>
</template>

<script>
/**
 * 管理收藏标签
 * @author zml
 * @version 2017-09-11
 */

import { mapState } from 'vuex'
import { LABEL } from '@/store/mutationTypes'
import { form } from '@/mixins'
import { createButton } from '@/utils'

export default {
  name: 'user-label-modal',

  mixins: [form],

  props: {
    value: {
      type: Boolean,
      required: true,
      default: false,
    },
  },

  data() {
    return {
      loading: {
        modal: false, // 添加按钮loading
        delete: false, // 确认删除按钮loading
      },

      deleteModal: false, // 删除模态框
      deleteId: null, // 待删除标签id
      deleteName: '', // 待删除标签名称

      form: {
        display_name: '',
      },

      rules: {
        display_name: [
          this.$rules.required('标签名称'),
          this.$rules.length(1, 50),
        ],
      },

      columns: [
        { title: '标签', key: 'display_name', align: 'center' },
        { title: '关联题数', key: 'question_count', align: 'center' },
        {
          title: '操作',
          key: 10,
          align: 'center',
          width: 100,
          render: createButton([
            { text: '删除', type: 'error', click: row => this.openDeleteModal(row.id, row.display_name) },
          ]),
        },
      ],

    }
  },

  computed: {
    ...mapState({
      list: state => state.label.list,
    }),
  },

  watch: {
    value() {
      this.resetHandler()
    },
  },

  methods: {
    closeModal() { // 关闭该模态框
      this.$emit('closeLabelModal')
    },

    resetHandler() { // 重置表单
      this.$refs.form.resetFields()
      this.formErrors = {}
    },

    submit() { // 添加用户标签
      this.formLoading = true
      this.$store.dispatch(LABEL.CREATE, this.form)
        .then(this.successHandler)
        .catch(this.errorHandler)
    },

    successHandler() { // 添加用户标签成功
      this.resetHandler()
      this.formLoading = false
      this.$Message.success('添加成功！')
    },

    openDeleteModal(id, name) { // 打开删除确认模态框
      this.deleteId = id
      this.deleteName = name
      this.deleteModal = true
    },

    deleteLabel() { // 删除用户标签
      this.loading.delete = true
      this.$store.dispatch(LABEL.DELETE, this.deleteId)
        .then(() => {
          this.loading.delete = false
          this.deleteModal = false
          this.$Message.warning('删除成功')
        })
        .catch(({ message }) => {
          this.loading.delete = false
          this.$Message.error(message)
        })
    },

    getLabelData() { // 用户标签列表
      this.$store.dispatch(LABEL.INIT)
        .catch(({ message }) => {
          this.$Message.error(message)
        })
    },
  },

  created() {
    this.getLabelData()
  },
}
</script>

<style lang="less">
@import '~vars';
.label-modal {

  .ivu-table-small td {
    height: 36px;
  }

  .app-table th .ivu-table-cell,
  .app-table td .ivu-table-cell {
    padding: 4px 12px;
  }

  &__table {
    border-top: 1px solid @border-color-split ;
    border-bottom: 1px solid @border-color-split ;
    max-height: 286px;
    overflow: auto;

    .ivu-table-wrapper {
      border-top: 0;
    }

    .ivu-table:before {
      height: 0;
    }

    tr:last-child td {
      border-bottom: 0;
    }
  }
}
</style>
