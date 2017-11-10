d<template>
  <main
    class="product-edit"
    v-if="preConfig"
  >
    <app-editor-title></app-editor-title>
    <Form
      class="app-form-entire product-edit-form"
      ref="form"
      :label-width="110"
      :rules="formRules"
      :model="fdata"
    >
      <app-form-alert :errors="formErrors"></app-form-alert>
      <Form-item
        label="产品类型"
        prop="product_type"
      >
        <Select
          placeholder="请选择......"
          v-model="fdata.product_type"
          :disabled="$route.params.id && fdata.is_used"
        >
          <Option
            v-for="item in preConfig.product_type"
            :value="item.value"
            :key="item.display_name"
          >{{item.display_name}}</Option>
        </Select>
      </Form-item>
      <Form-item
        v-if="fdata.product_type !== 5"
        label="学习目标"
        prop="study_target"
      >
        <Select
          placeholder="请选择......"
          v-model="fdata.study_target"
          :disabled="$route.params.id && fdata.is_used"
        >
          <Option
            v-for="item in preConfig.study_target"
            :value="item.value"
            :key="item.display_name"
          >{{item.display_name}}</Option>
        </Select>
      </Form-item>
      <Form-item
        label="年级"
        prop="grade"
      >
        <Select
          placeholder="请选择......"
          v-model="fdata.grade"
          :disabled="$route.params.id && fdata.is_used"
        >
          <Option
            v-for="item in preConfig.grade"
            :value="item.value"
            :key="item.display_name"
          >{{item.display_name}}</Option>
        </Select>
      </Form-item>
      <Form-item
        label="学科"
        prop="grade_range_subject_id"
      >
        <Select
          placeholder="请选择......"
          v-model="fdata.grade_range_subject_id"
          :disabled="$route.params.id && fdata.is_used"
        >
          <Option
            v-for="item in preConfig.grade_range_subject_list"
            :value="item.value"
            :key="item.display_name"
          >{{item.display_name}}</Option>
        </Select>
      </Form-item>
      <Form-item
        v-if="fdata.product_type !== 5"
        label="班级容量"
        prop="class_capacity"
      >
        <Select
          placeholder="请选择......"
          v-model="fdata.class_capacity"
          :disabled="$route.params.id && fdata.is_used"
        >
          <Option
            v-for="item in preConfig.class_capacity"
            :value="item.value"
            :key="item.display_name"
          >{{item.display_name}}</Option>
        </Select>
      </Form-item>
      <Form-item
        label="运营类型"
        prop="sale_type"
      >
        <Radio-group
          v-model="fdata.sale_type"
        >
          <Radio
            v-for="item in preConfig.sale_type"
            :label="item.value"
            :key="item.display_name"
            :disabled="$route.params.id && fdata.is_used"
          >
            <span>{{item.display_name}}</span>
          </Radio>
        </Radio-group>
      </Form-item>
      <Form-item
        label="每课时单价"
        prop="price"
      >
        <InputNumber
          :min="0"
          placeholder="输入每课时单价"
          v-model="fdata.price"
          style="width: 250px;"
          :disabled="
            ($route.params.id && fdata.is_used)
            || priceDisabled
          "
        ></InputNumber>
        <span>元</span>
      </Form-item>
      <Form-item
        label="销售状态"
        prop="sale_status"
      >
        <Radio-group
          v-model="fdata.sale_status"
        >
          <Radio
            v-for="item in preConfig.sale_status"
            :label="item.value" :key="item.display_name"
          >
            <span>{{item.display_name}}</span>
          </Radio>
        </Radio-group>
      </Form-item>
      <Form-item label="销售校区">
        <v-table-checkbox
          :value.sync="fdata.area_ids"
          :list="preConfig.school_list"
          label="校区"
        ></v-table-checkbox>
      </Form-item>
      <Form-item>
        <Button @click="goBack()">取消</Button>
        <Button
          type="primary"
          @click="handleSubmit('form')"
        >提交</Button>
      </Form-item>
    </Form>
  </main>
</template>

<script>
/**
 * 产品管理 - 产品编辑
 *
 * @author huojinzhao
 */

import { goBack, form } from '@/mixins'
import { GLOBAL } from '@/store/mutationTypes'
import { editInit } from './modules/config'
import vTableCheckbox from '../components/TableCheckbox'

export default {
  name: 'business-product-edit',

  mixins: [goBack, form],

  components: {
    vTableCheckbox,
  },

  data() {
    return {
      preConfig: null,

      // 最终提交给后端的数据
      fdata: editInit(),

      // 提交按钮状态控制
      loading: false,

      // 表单验证
      formRules: {
        product_type: [
          this.$rules.required('产品类型', 'number', 'change'),
        ],
        study_target: [
          this.$rules.required('学习目标', 'number', 'change'),
        ],
        grade: [
          this.$rules.required('年级', 'number', 'change'),
        ],
        grade_range_subject_id: [
          this.$rules.required('学科', 'number', 'change'),
        ],
        class_capacity: [
          this.$rules.required('班级容量', 'number', 'change'),
        ],
        sale_type: [
          this.$rules.required('运营类型', 'number', 'change'),
        ],
        price: [
          this.$rules.required('每课时单价', 'number', 'change'),
          this.$rules.price,
        ],
        sale_status: [
          this.$rules.required('销售状态', 'number', 'change'),
        ],
      },

      priceDisabled: false,
    }
  },

  watch: {
    'fdata.sale_type': 'changeSaleType',

    'fdata.product_type': 'changeProductType',
  },

  methods: {
    /* --- Initialization --- */

    getPreConfig() {
      this.$http.get('/product/store_before')
        .then((res) => { this.preConfig = res })
    },

    fetchUpdationInfo(id) {
      if (!id) return Promise.resolve()

      return this.$http.get(`/product/${id}`)
        .then((res) => { this.fdata = res })
        .catch(() => {})
    },

    /* --- Assistance --- */

    autoName() {
      const name = this.getName(
        this.fdata.grade,
        this.preConfig.grade,
      )
        + this.getName(
          this.fdata.grade_range_subject_id,
          this.preConfig.grade_range_subject_list,
        )
        + this.getName(
          this.fdata.product_type,
          this.preConfig.product_type,
        )
        + this.getName(
          this.fdata.study_target,
          this.preConfig.study_target,
        )
        + this.getName(
          this.fdata.class_capacity,
          this.preConfig.class_capacity,
        )
        + (this.fdata.sale_type === 1 ? '(赠品)' : '')
      return name
    },

    getName(value, before) {
      const target = before.find(item => value === item.value)
      return target ? target.display_name : ''
    },

    changeSaleType(nv) {
      // 赠品
      // eslint-disable-next-line
      nv === 1 ? this.offPrice() : this.onPrice()
    },

    offPrice() {
      this.fdata.price = 0
      this.priceDisabled = true
    },

    onPrice() {
      this.priceDisabled = false
    },

    changeProductType(nv) {
      // 晚辅导
      // eslint-disable-next-line
      nv === 5 && this.fitNightStudy()
    },

    fitNightStudy() {
      this.fdata.study_target = null
      this.fdata.class_capacity = null
    },

    /* --- business --- */

    // 提交编辑好的表单数据
    submit() {
      this.loading = true

      const id = this.$route.params.id

      const fdata = this.fdata
      fdata.display_name = this.autoName()

      const method = id ? 'patch' : 'post'
      const uri = id ? `/product/${id}` : '/product'

      return this.$http[method](uri, fdata)
    },

    handleSubmit(name) {
      this.$refs[name]
        .validate((valid) => {
          if (valid) {
            this.submit()
              .then(() => this.goBack())
              .catch(this.errorHandler)
              .then(() => { this.loading = false })
          }
        })
    },
  },

  created() {
    this.getPreConfig()

    this.fetchUpdationInfo(this.$route.params.id)
      .then(() => this.$store.commit(GLOBAL.LOADING.HIDE))
  },
}
</script>

<style lang="less">
@import "~vars";

@gutter-unit: 5px;

// ivu组件样式修改
.product-edit-form {

  &>.ivu-form-item {

    &:nth-child(5),
    &:nth-child(6),
    &:nth-child(7), {

      & .ivu-input-wrapper {
        width: 95% !important;

        &+span {
          margin-left: @gutter-unit;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
