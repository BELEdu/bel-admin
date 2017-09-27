<template>
  <Modal
    class="business__communication-record"
    :value="visible"
    title="沟通记录"
    @on-cancel="cancel"
  >
    <Form
      :model="fdata"
      :rules="rules"
      ref="form"
    >
      <app-form-alert :errors="formErrors"></app-form-alert>
      <Form-item
        label="历史沟通记录"
      >
        <Table
          border
          size="small"
          :data="logs"
          :columns="colConfig"
        ></Table>
      </Form-item>
      <Form-item
        label="沟通时间"
        prop="communication_at"
        required
      >
        <Date-picker
          placeholder="年 / 月 / 日"
          :editable="false"
          v-model="fdata.communication_at"
        ></Date-picker>
      </Form-item>
      <Form-item
        label="沟通情况"
        prop="content"
      >
        <Input
          type="textarea"
          :rows="4"
          v-model="fdata.content"
        ></Input>
      </Form-item>
    </Form>
    <footer slot="footer">
      <Button
        type="text"
        @click="cancel"
      >取消</Button>
      <Button
        type="primary"
        :loading="confirmLoading"
        @click="preSubmit"
      >确定</Button>
    </footer>
  </Modal>
</template>

<script>
/**
 * 业务管理 - 沟通记录 - 记录
 *
 * @author huojinzhao
 */

import { form } from '@/mixins'
import { formatDate } from '@/utils/date'

const initFdata = () => ({
  communication_at: '',
  content: '',
})

export default {
  name: 'business-communication-record',

  mixins: [form],

  props: {
    logs: {
      type: Array,
      // required: true,
    },

    visible: {
      type: Boolean,
      required: true,
    },

    target: {
      type: Number,
      // required: true,
    },
  },

  data() {
    return {
      colConfig: [
        {
          title: '沟通时间',
          key: 'communication_at',
          align: 'center',
          width: 100,
        },
        {
          title: '沟通情况',
          align: 'center',
          render: (h, { row }) => h('div',
            {
              style: {
                'text-align': 'left',
              },
            },
            row.content,
          ),
        },
      ],

      rules: {
        communication_at: [
          { validator: this.validateAt },
        ],
        content: [
          {
            required: true,
            message: '请填写沟通情况',
            trigger: 'blur',
          },
        ],
      },

      fdata: initFdata(),

      confirmLoading: false,
    }
  },

  methods: {
    cancel() {
      this.confirmLoading = false
      this.$refs.form.resetFields()
      this.$emit('update:visible', false)
    },

    preSubmit() {
      this.$refs.form.validate(valid => valid && this.submit())
    },

    submit() {
      const url = `/communication/${this.target}/log`
      const data = {
        communication_at: formatDate(this.fdata.communication_at),
        content: this.fdata.content,
      }
      this.$http.post(url, data)
        .then(() => {
          this.cancel()
          this.$emit('success')
        })
        .catch((errors) => {
          this.errorHandler(errors)
          this.confirmLoading = false
        })
    },

    validateAt(rule, value, callback) {
      if (value) return callback()
      return callback(new Error('请输入沟通时间'))
    },
  },
}
</script>

<style lang="less">
.business__communication-record {

  & .ivu-form-item-label {
    float: none;
    display: block;
    margin-bottom: 12px;
    padding: 0;
    text-align: left;
    font-size: 14px;
  }

  & .ivu-date-picker {
    width: 100%;
  }
}
</style>
