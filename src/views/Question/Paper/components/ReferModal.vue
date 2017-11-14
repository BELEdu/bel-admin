<template>
  <div>
    <!-- 管理收藏标签模态框 -->
    <app-form-modal
      :value="value"
      @input="value => $emit('input', value)"
      title="管理学校参考线"
      :width="600"
      :loading="loading.modal"
      @on-ok="closeModal()"
      @on-cancel="closeModal()"
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
              <Form-item prop="school_id" label="选择学校">
                <Select
                  v-model="form.school_id"
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
              <Form-item prop="normal" label="普通生分值" required>
                <InputNumber
                  v-model="form.normal"
                  :min="0"
                  :precision="0"
                ></InputNumber>
              </Form-item>
            </Col>

            <Col span="4" offset="1">
              <Form-item prop="high" label="优秀生分值" required>
                <InputNumber
                  v-model="form.high"
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
      @on-ok="deleteLabel()"
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

// import { mapState } from 'vuex'
// import { LABEL } from '@/store/mutationTypes'
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
      deleteId: null, // 待删除标签id
      deleteName: '', // 待删除标签名称

      form: {
        school_id: null,
        normal: 0,
        high: 0,
      },

      rules: {
        school_id: [
          this.$rules.required('学校', 'array', 'change'),
        ],
      },

      columns: [
        { title: '学校', key: 'display_name', align: 'center' },
        { title: '普通生分值', key: 'normal', align: 'center' },
        { title: '优秀生分值', key: 'high', align: 'center' },
        {
          title: '操作',
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
    // ...mapState({
    //   list: state => state.label.list,
    // }),
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

    submit() { // 添加用户标签
      this.formLoading = true
      // this.$store.dispatch(LABEL.CREATE, this.form)
      //   .then(this.successHandler)
      //   .catch(this.errorHandler)
      this.successHandler()
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
      // this.$store.dispatch(LABEL.DELETE, this.deleteId)
      //   .then(() => {
      //     this.loading.delete = false
      //     this.deleteModal = false
      //     this.$Message.warning('删除成功')
      //   })
      //   .catch(({ message }) => {
      //     this.loading.delete = false
      //     this.$Message.error(message)
      //   })
      this.loading.delete = false
      this.deleteModal = false
      this.$Message.warning('删除成功')
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
