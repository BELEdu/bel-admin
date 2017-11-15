<template>
  <div>
    <!-- 管理收藏标签模态框 -->
    <app-form-modal
      :value="value"
      @input="value => $emit('input', value)"
      title="管理学校参考线"
      :width="600"
      :loading="loading.modal"
      @on-ok="closeModal"
      @on-cancel="closeModal"
      :maskClosable="true"
      class="refer-modal"
    >
      <Form
        ref="form"
        :model="form"
        :rules="rules"
        :label-width="0"
      >
        <app-form-alert :errors="formErrors"></app-form-alert>

          <Row>
            <Col span="9">
              <Form-item prop="campuse_id" label="选择学校">
                <Select
                  v-model="form.campuse_id"
                  placeholder="请选择学校"
                >
                  <Option
                    v-for="school in campuses"
                    :value="school.id"
                    :key="school.id"
                  >{{ school.display_name }}</Option>
                </Select>
              </Form-item>
            </Col>

            <Col span="4" offset="1">
              <Form-item prop="normal_score" label="普通生分值" required>
                <InputNumber
                  v-model="form.normal_score"
                  :min="0"
                  :precision="0"
                ></InputNumber>
              </Form-item>
            </Col>

            <Col span="4" offset="1">
              <Form-item prop="excellent_score" label="优秀生分值" required>
                <InputNumber
                  v-model="form.excellent_score"
                  :min="0"
                  :precision="0"
                ></InputNumber>
              </Form-item>
            </Col>

            <!-- 添加按钮 -->
            <Col span="4" offset="1">
              <Button
                class="refer-modal__add"
                type="primary"
                long
                :loading="formLoading"
                @click="beforeSubmit"
              >添加</Button>
            </Col>
          </Row>

      </Form>

      <!-- 参考线列表 -->
      <div class="refer-modal__table">
        <Table size="small" class="app-table point-table" :columns="columns" :data="data" border></Table>
      </div>

    </app-form-modal>

    <!-- 删除模态框 -->
    <app-warn-modal
      v-model="deleteModal"
      title="删除确认"
      :loading="loading.delete"
      @on-ok="deleteItem()"
      action="删除"
    >
      <div class="text-center">删除该标签 <span class="color-primary">" {{deleteName}} "</span> 后将无法再恢复，是否继续删除？</div>
    </app-warn-modal>
  </div>
</template>

<script>
/**
 * 学校参考线弹窗
 * @author zml
 * @version 2017-11-14
 */


import { form } from '@/mixins'
import { createButton } from '@/utils'

export default {
  name: 'refer-modal',

  mixins: [form],

  props: {
    value: {
      type: Boolean,
      required: true,
      default: false,
    },
    id: {
      type: Number,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
    campuses: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      loading: {
        modal: false, // 添加按钮loading
        delete: false, // 确认删除按钮loading
      },

      deleteModal: false, // 删除模态框
      deleteId: null, // 待删除参考线id
      deleteName: '', // 待删除参考线名称

      form: {
        campuse_id: null,
        normal_score: 0,
        excellent_score: 0,
      },

      rules: {
        campuse_id: [
          this.$rules.required('学校', 'number', 'change'),
        ],
      },

      columns: [
        { title: '学校', key: 'campuse_name', align: 'center' },
        { title: '普通生分值', key: 'normal_score', align: 'center' },
        { title: '优秀生分值', key: 'excellent_score', align: 'center' },
        {
          title: '操作',
          align: 'center',
          width: 100,
          render: createButton([
            { text: '删除', type: 'error', click: row => this.openDeleteModal(row.id, row.campuse_name) },
          ]),
        },
      ],

    }
  },

  computed: {
    // 当普通生分值大于优秀生分值时，返回true
    isWrong() {
      return this.form.normal_score > this.form.excellent_score
    },
  },

  watch: {
    // 监听重置表单
    value() {
      this.resetHandler()
    },
  },

  methods: {
    closeModal() { // 关闭该模态框
      this.$emit('closeReferModal')
    },

    resetHandler() { // 重置表单
      this.$refs.form.resetFields()
      this.formErrors = {}
    },

    submit() { // 添加参考线
      if (this.isWrong) {
        this.$Message.warning('普通生分值不能大于优秀生分值，请修改！')
        this.formLoading = false
      } else {
        this.formLoading = true
        this.$http.post(`/paper/${this.id}/refer_school`, {
          ...this.form,
          paper_id: this.id,
        })
          .then(this.successHandler)
          .catch(this.errorHandler)
      }
    },

    successHandler() { // 添加参考线成功
      this.resetHandler()
      this.formLoading = false
      this.$Message.success('添加成功！')
      this.$emit('updateData')
    },

    openDeleteModal(id, name) { // 打开删除确认模态框
      this.deleteId = id
      this.deleteName = name
      this.deleteModal = true
    },

    deleteItem() { // 删除参考线
      this.loading.delete = true
      this.$http.delete(`/paper/${this.id}/refer_school/${this.deleteId}`)
        .then(() => {
          this.loading.delete = false
          this.deleteModal = false
          this.$Message.warning('删除成功')
          this.$emit('updateData')
        })
        .catch(({ message }) => {
          this.loading.delete = false
          this.$Message.error(message)
        })
    },

  },

}
</script>

<style lang="less">
@import '~vars';
.refer-modal {
  .ivu-input-number {
    width: 100%;
  }

  &__add {
    margin-top: 32px;
  }

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
