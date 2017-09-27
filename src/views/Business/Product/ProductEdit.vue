<template>
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
        >
          <Option
            v-for="item in preConfig.product_type"
            :value="item.value"
            :key="item.display_name"
          >{{item.display_name}}</Option>
        </Select>
      </Form-item>
      <Form-item
        label="学习目标"
        prop="study_target"
      >
        <Select
          placeholder="请选择......"
          v-model="fdata.study_target"
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
        >
          <Option
            v-for="item in preConfig.grade_range_subject_list"
            :value="item.value"
            :key="item.display_name"
          >{{item.display_name}}</Option>
        </Select>
      </Form-item>
      <Form-item
        label="班级容量"
        prop="class_capacity"
      >
        <Select
          placeholder="请选择......"
          v-model="fdata.class_capacity"
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
      >
        <Radio-group v-model="fdata.sale_type">
          <Radio
            v-for="item in preConfig.sale_type"
            :label="item.value"
            :key="item.display_name"
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
        ></InputNumber>
        <span>元</span>
      </Form-item>
      <Form-item label="销售状态">
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
import { GLOBAL, BUSINESS } from '@/store/mutationTypes'
import { Http } from '@/utils'
import { editInit, unit_encode, unit_decode } from './modules/config'
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
        price: [
          this.$rules.required('每课时单价', 'number', 'change'),
          this.$rules.price,
        ],
      },
    }
  },

  methods: {
    /* --- Assistance --- */

    autoName() {
      const name = this.getName(this.fdata.grade, this.preConfig.grade)
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
      return name
    },

    getName(value, before) {
      return before.find(item => value === item.value).display_name
    },

    /* --- business --- */

    // 提交编辑好的表单数据
    submit() {
      this.loading = true
      const fdata = unit_encode(this.fdata)
      // 产品名称非输入，而是自动生成
      fdata.display_name = this.autoName()
      if (this.$route.params.id) {
        const id = this.$route.params.id
        this.$store.dispatch(BUSINESS.EDIT.UPDATE, { id, fdata })
          .then(() => this.goBack())
          .catch(this.errorHandler)
          .then(() => { this.loading = false })
      } else {
        this.$store.dispatch(BUSINESS.EDIT.CREATE, fdata)
          .then(() => {
            this.goBack()
          })
          .catch(this.errorHandler)
          .then(() => { this.loading = false })
      }
    },

    handleSubmit(name) {
      this.$refs[name]
        .validate((valid) => { if (valid) this.submit() })
    },
  },

  beforeRouteEnter(to, from, next) {
    Http.get('/product/store_before')
      // eslint-disable-next-line
      .then(data => next((vm) => { vm.preConfig = { ...data } }))
  },

  created() {
    this.$store.dispatch(BUSINESS.EDIT.INIT, this.$route)
      .then((res) => {
        this.fdata = unit_decode(res)
        this.$store.commit(GLOBAL.LOADING.HIDE)
      })
      .catch(() => this.$store.commit(GLOBAL.LOADING.HIDE))
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
