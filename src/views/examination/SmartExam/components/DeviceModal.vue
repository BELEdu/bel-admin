<template>
  <app-form-modal
    :value="value"
    @input="value => $emit('input', value)"
    :title="`开始测试：${testNumber}`"
    :loading="formLoading"
    @on-ok="submit"
    @on-cancel="closeModal"
  >
    <div class="smartexam-device">
      <Form
        ref="form"
        :rules="rules"
        :model="form"
        :label-width="100"
        v-if="isOnline"
      >
        <app-form-alert :errors="formErrors"></app-form-alert>

        <!-- 学生设备 -->
        <Form-item
          v-for="(item,index) in students"
          :key="item.student_id"
          :label="item.student.display_name"
        >
          <Select
            v-model="form.start_test[index].equipment_id"
            placeholder="请输入或选择设备编号"
            filterable
            remote
            :remote-method="remoteMethodDevice"
            :loading="loading.device"
            transfer
          >
            <Option
              v-for="item in deviceData"
              :value="item.id"
              :disabled="hasSelected(item.id)"
              :key="item.id"
            >{{ item.equipment_display_number }}</Option>
          </Select>
        </Form-item>

      </Form>
    </div>

    <p class="text-center"  v-if="!isOnline">是否确定开始测试？</p>

    <p class="color-error" v-else>注意：请确保要选择的设备已开机</p>

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
    testNumber: {
      type: String,
      required: true,
    },
    students: {
      type: Array,
      required: true,
    },
    answerType: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      // 设备编号数据
      deviceData: [],

      // 远程搜索loading
      loading: {
        device: false,
      },

      // 表单
      form: {
        start_test: [],
      },

      rules: {},
    }
  },

  computed: {
    isOnline() {
      return this.answerType === 1
    },
  },

  watch: {
    students(val) {
      this.form.start_test = val.map(({ id }) => ({
        id,
        equipment_id: '',
      }))
    },
  },

  methods: {
    // 提交
    submit() {
      const data = this.form
      this.formLoading = true
      this.$http.post(`/test/start_test/${this.answerType}`, data)
        .then(this.successHandler)
        .catch(this.errorHandler)
    },

    // 提交成功
    successHandler() {
      this.$Message.success('开始测试！')
      this.formLoading = false
      this.closeModal()
      this.$emit('update')
    },

    // 关闭弹窗
    closeModal() {
      this.$emit('closeDeviceModal')
      this.$refs.form.resetFields()
      this.formErrors = {}
      this.formLoading = false
    },

    // 判断列表中的设备是否已经被其他学员选择
    hasSelected(value) {
      return this.form.start_test.some(item => item.equipment_id === value)
    },

    // 设备编号远程搜索（自动补全）
    remoteMethodDevice(query) {
      if (query !== '') {
        this.loading.device = true
        this.$http.get(`/test/equipment_autocomplete?equipment_display_number=${query}`)
          .then((res) => {
            this.deviceData = res
            this.loading.device = false
          })
      } else {
        this.deviceData = []
      }
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
