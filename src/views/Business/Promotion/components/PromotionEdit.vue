<template>
  <Modal
    class="business__promotion_edit"
    :value="visible"
    :title="typeof target === 'number'
      ? '编辑优惠活动'
      : '添加优惠活动'
    "
    @on-cancel="cancel"
  >
    <Form
      :label-width="70"
      ref="form"
      :model="fdata"
      :rules="rules"
    >
      <app-form-alert
        :errors="formErrors" full-width
      ></app-form-alert>
      <Form-item label="优惠名称" prop="display_name">
        <Input
          v-model="fdata.display_name"
          :disabled="readonly"
        ></Input>
      </Form-item>
      <Form-item label="最低总额" prop="enjoy_price">
        <InputNumber
          :min="0"
          v-model="fdata.enjoy_price"
          :disabled="readonly"
        ></InputNumber>
        <i>元</i>
      </Form-item>
      <Form-item label="优惠类型" prop="promotion_type">
        <v-button-radio
          :data="preConfig.promotion_type"
          v-model="fdata.promotion_type"
          :readonly="readonly"
          size="small"
        ></v-button-radio>
      </Form-item>
      <!-- 立减金额 -->
      <template v-if="fdata.promotion_type===1">
        <Form-item label="立减金额" prop="minus_price">
          <InputNumber
            :min="0"
            v-model="fdata.minus_price"
            :disabled="readonly"
          ></InputNumber>
          <i>元</i>
        </Form-item>
      </template>
      <!-- 折扣率 -->
      <template v-else-if="fdata.promotion_type===2">
        <Form-item label="折扣率" prop="discount">
          <InputNumber
            :min="0"
            v-model="fdata.discount"
            :disabled="readonly"
          ></InputNumber>
          <i>%</i>
        </Form-item>
      </template>
      <!-- 送产品 -->
      <template v-else>
        <Form-item label="赠送产品" prop="free_product_id">
          <Select
            v-model="fdata.free_product_id"
            :disabled="readonly"
          >
            <Option
              v-for="product in preConfig.product_list"
              :key="product.value"
              :value="product.value"
            >{{product.display_name}}</Option>
          </Select>
        </Form-item>
        <Form-item label="赠送数量" prop="free_product_total">
          <InputNumber
            :min="1"
            v-model="fdata.free_product_total"
            :disabled="readonly"
          ></InputNumber>
          <i>个</i>
        </Form-item>
      </template>
      <Form-item label="有效期限" prop="period" required>
        <DatePicker
          v-model="fdata.period"
          format="yyyy-MM-dd"
          type="daterange"
          placement="bottom-end"
          placeholder="选择日期"
          :editable="false"
        ></DatePicker>
      </Form-item>
      <Form-item label="优惠说明">
        <Input
          type="textarea"
          v-model="fdata.description"
        ></Input>
      </Form-item>
      <Form-item label="适用校区">
        <vTableCheckbox
          :value.sync="fdata.area_ids"
          :list="preConfig.school_list"
          label="校区"
        ></vTableCheckbox>
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
import vButtonRadio from '@/views/Question/components/ButtonRadio'
import vTableCheckbox from '@/views/Business/components/TableCheckbox'
import { formatDate } from '@/utils/date'
import form from '@/mixins/form'

const initFdata = () => ({
  display_name: '',
  enjoy_price: null,
  promotion_type: 1,
  minus_price: null,
  discount: null,
  free_product_id: null,
  free_product_total: null,
  // Datepicker绑定数据，后端不需要，关联start_at、end_at
  period: [],
  start_at: '',
  end_at: '',
  description: '',
  area_ids: [],
})

export default {
  name: 'BusinessPromotionEdit',

  mixins: [form],

  components: {
    vButtonRadio,
    vTableCheckbox,
  },

  props: {
    target: {},
    visible: {
      type: Boolean,
      required: true,
    },
    edition: {
      type: Object,
    },
    readonly: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      preConfig: {
        promotion_type: [],
        school_list: [],
      },

      fdata: initFdata(),

      rules: {
        display_name: [
          this.$rules.required('优惠名称'),
        ],
        enjoy_price: [
          this.$rules.required('最低总额', 'number', 'change'),
        ],
        promotion_type: [
          this.$rules.required('优惠类型', 'number', 'change'),
        ],
        minus_price: [
          this.$rules.required('立减金额', 'number', 'change'),
        ],
        discount: [
          this.$rules.required('折扣率', 'number', 'change'),
        ],
        free_product_id: [
          this.$rules.required('赠送产品', 'number', 'change'),
        ],
        free_product_total: [
          this.$rules.required('赠送数量', 'number', 'change'),
        ],
        period: [
          { validator: this.validatePeriod, trigger: 'change' },
        ],
      },

      confirmLoading: false,
    }
  },

  watch: {
    visible(value) {
      if (value) {
        if (typeof this.target === 'number') {
          this.dataDecode(this.edition)
        }
      } else {
        this.$refs.form.resetFields()
        this.fdata = initFdata()
      }
    },
  },

  methods: {
    /* --- initialization --- */

    fetchPreConfig() {
      this.$http.get('/promotion/store_before')
        .then((res) => { this.preConfig = { ...res } })
    },

    /* --- Assistance --- */

    validatePeriod(rule, value, callback) {
      return value[0] && value[1]
        ? callback()
        : callback(new Error('有效期限不能为空'))
    },

    dataEncode() {
      const start_at = formatDate(this.fdata.period[0])
      const end_at = formatDate(this.fdata.period[1])
      const { period, ...rest } = this.fdata
      return { ...rest, ...{ start_at, end_at } }
    },

    dataDecode(edition) {
      const period = [edition.start_at, edition.end_at]
      this.fdata = { ...edition, period }
    },

    /* --- control --- */

    cancel() {
      this.confirmLoading = false
      this.$emit('update:visible', false)
      // mixins中的数据
      this.formErrors = {}
    },

    /* --- business --- */

    preSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.confirmLoading = true
          this.submit()
            .then(() => {
              this.cancel()
              this.$emit('success')
            })
            .catch(this.errorHandler)
        }
      })
    },

    submit() {
      const url = this.target
        ? `/promotion/${this.target}`
        : '/promotion'
      if (this.target) {
        return this.$http.patch(url, this.dataEncode(this.fdata))
      }
      return this.$http.post(url, this.dataEncode(this.fdata))
    },
  },

  created() {
    this.fetchPreConfig()
  },
}
</script>

<style lang="less">
.business__promotion_edit {

  & .ivu-input-number {
    width: 95%;

    & + i {
      float: right;
      font-style: normal;
    }
  }

  & .ivu-date-picker {
    width: 100%;
  }

  & input[disabled] {
    background-color: #fff;
    opacity: 1;
  }

  & .ivu-select-disabled > .ivu-select-selection{
    background-color: #fff;
    opacity: 1;
  }
}
</style>
