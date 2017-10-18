<template>
  <app-form-modal
    :value="value"
    @input="value => $emit('input', value)"
    title="开始测试"
    :loading="formLoading"
    @on-ok="submit()"
    @on-cancel="closeModal()"
  >
    <div class="smartexam-device">
      <Form ref="form" :model="form" :label-width="70">
        <app-form-alert :errors="formErrors"></app-form-alert>

        <!-- 学生设备 -->
        <Form-item
          v-for="(item,index) in form.studentData"
          :key="index"
          :label="item.name"
        >
          <Select
            v-model="form.studentData[index].device_number"
            placeholder="请输入或选择设备编号"
            filterable
          >
            <Option
              v-for="item in deviceData"
              :value="item.value"
              :disabled="hasSelected(item.value)"
              :key="item.display_name"
            >{{ item.display_name }}</Option>
          </Select>
        </Form-item>

      </Form>
    </div>

  </app-form-modal>
</template>

<script>
/**
 * 班级管理 - 快捷编辑学员
 * @author zml
 * @version 2017-06-29
 */
import { form } from '@/mixins'

export default {
  name: 'app-examination-smartexam-device-modal',

  mixins: [form],

  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      deviceData: [
        {
          value: 10010,
          display_name: 10010,
        },
        {
          value: 10011,
          display_name: 10011,
        },
        {
          value: 20010,
          display_name: 20010,
        },
      ],


      // 表单
      form: {
        studentData: Array(12).fill(null).map(() => ({
          name: '张三',
          device_number: null,
        })),
      },

    }
  },

  methods: {
    closeModal() {
      this.$emit('closeDeviceModal')
      this.$refs.form.resetFields()
      this.formErrors = {}
      this.formLoading = false
    },

    // 判断列表中的设备是否已经被其他学员选择
    hasSelected(value) {
      return this.form.studentData.some(item => item.device_number === value)
    },
  },
}
</script>

<style lang="less">
.smartexam-device {
  padding-right: 30px;
  max-height: 500px;
  overflow: auto;
}
</style>
