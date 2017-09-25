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
        <div class="product-edit__areas">
          <div class="product-edit__areas-left">
            <dl>
              <dt></dt>
              <dd>
                <Checkbox
                  v-model="allareas"
                  @click.native.prevent="setAllAreasStatus"
                >
                  <span>全选</span>
                </Checkbox>
              </dd>
            </dl>
          </div>
          <Checkbox-group
            class="product-edit__areas-right"
            v-model="fdata.area_ids"
          >
            <dl>
              <dt>校区</dt>
              <dd
                v-for="item in preConfig.school_list"
                :key="item.display_name"
              >
                <Checkbox :label="item.id">
                  <span>{{item.display_name}}</span>
                </Checkbox>
              </dd>
            </dl>
          </Checkbox-group>
        </div>
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

import { goBack } from '@/mixins'
import { GLOBAL, BUSINESS } from '@/store/mutationTypes'
import { Http } from '@/utils'
import { editInit, unit_encode, unit_decode } from './modules/config'

export default {

  mixins: [goBack],

  data() {
    return {
      preConfig: null,

      // 最终提交给后端的数据
      fdata: editInit(),

      // 提交按钮状态控制
      loading: false,

      // 校区数据
      school_list: [],

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

      // 校区全选
      allareas: false,
    }
  },

  watch: {
    'fdata.area_ids': 'getAllAreasStatus',
  },

  methods: {
    /* --- Assistance --- */

    getAllAreasStatus() {
      let all = false
      if (this.fdata.area_ids.length > 0) {
        // 校区有可能删除或者更新，而fdata.area_ids不会
        // 所以拿校区到fdata中比对
        all = this.preConfig
          .school_list.every(item => this.fdata.area_ids.includes(item.id))
      }
      this.allareas = all
    },

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

    setAllAreasStatus() {
      const nextStatus = !this.allareas
      if (nextStatus) {
        const list = this.preConfig
          .school_list.map(item => item.id)
        this.fdata.area_ids = list
      } else {
        this.fdata.area_ids = []
      }
    },

    // 提交编辑好的表单数据
    submit() {
      // 开启按钮loadding
      this.loading = true
      // 根据接口文档转化数据
      const fdata = unit_encode(this.fdata)
      fdata.display_name = this.autoName()
      if (this.$route.params.id) {
        const id = this.$route.params.id
        this.$store.dispatch(BUSINESS.EDIT.UPDATE, { id, fdata })
          .then(() => { this.loading = false; this.goBack() })
      } else {
        this.$store.dispatch(BUSINESS.EDIT.CREATE, fdata)
          .then(() => { this.loading = false; this.goBack() })
      }
    },

    // Form click提交表单事件handler @click.stop="submit"
    handleSubmit(name) {
      // 其他处理...
      // 进行表单提交
      this.$refs[name].validate((valid) => { if (valid) this.submit() })
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

.product-edit__areas {
  display: flex;
  border: 1px solid @border-color-base;

  &-left {
    flex-basis: 100px;
    flex-shrink: 0;
    text-align: center;

    & dt {
      height: 33px;
      border-bottom: 1px solid @border-color-base;
    }

    & dd {
      text-align: center;

      & .ivu-checkbox-wrapper {
        margin: 0 !important;
      }
    }
  }

  &-right {
    border-left: 1px solid @border-color-base;
    padding-left: 20px;
    flex-grow: 1;

    & dt {
      margin-left: -20px;
      border-bottom: 1px solid @border-color-base;
      text-align: center;
    }

    & dd {
      display: inline-block;
    }
  }
}

.ie {

  .product-edit__areas {

    &-left {
      float: left;
      width: 100px;
    }

    &-right {
      overflow: hidden;
    }

  }
}
</style>
