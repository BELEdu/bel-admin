<template>
  <main class="app-form-entire product-edit">
    <app-editor-title></app-editor-title>
    <Form :label-width="110" ref="form" :rules="formRules" :model="fdata">
      <Form-item label="产品名称" prop="display_name">
        <Input placeholder="请输入产品名称" v-model="fdata.display_name"></Input>
      </Form-item>
      <Form-item label="产品类型" v-if="dicts.product_type.length" prop="product_type_id">
        <Select placeholder="请选择......" v-model="fdata.product_type_id">
          <Option v-for="item in dicts.product_type" :value="item.value" :key="item.display_name">{{item.display_name}}</Option>
        </Select>
      </Form-item>
      <Form-item label="产品子类型">
        <Select placeholder="请选择......" v-model="fdata.product_subtype_id">
          <Option v-for="item in sub_type" :value="item.value" :key="item.display_name">{{item.display_name}}</Option>
        </Select>
        </Select>
      </Form-item>
      <Form-item label="课程时长" prop="course_duration">
        <Input placeholder="请输入课程时长" v-model="fdata.course_duration"></Input>
      </Form-item>
      <Form-item label="产品单价" prop="price">
        <Input placeholder="请输入产品单价" v-model="fdata.price"></Input>
      </Form-item>
      <Form-item label="销售状态">
        <Radio-group v-model="fdata.sale_status">
          <Radio v-for="item in dicts.sale_status" :label="item.value" :key="item.display_name">
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
                <Checkbox v-model="allareas">
                  <span>全选</span>
                </Checkbox>
              </dd>
            </dl>
          </div>
          <Checkbox-group v-model="fdata.product_areas" class="product-edit__areas-right">
            <dl>
              <dt>全选</dt>
              <dd v-for="item in school_list" :key="item.display_name">
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
        <Button type="primary" @click="handleSubmit('form')">提交</Button>
      </Form-item>
    </Form>
  </main>
</template>

<script>
/**
 * 产品管理 - 产品编辑
 * @author hjz
 * @version 2017-06-07
 */

import { goBack } from '@/mixins'
import { GLOBAL, BUSINESS } from '@/store/mutationTypes'
import { Http } from '@/utils'
import { editInit, unit_encode, unit_decode } from './modules/config'

export default {

  mixins: [goBack],

  data() {
    return {
      // 最终提交给后端的数据
      fdata: editInit(),
      // 提交按钮状态控制
      loading: false,
      // 校区数据
      school_list: [],
      // 表单验证
      formRules: {
        display_name: [
          this.$rules.required('产品名称'),
          this.$rules.length(2, 10),
          this.$rules.name,
        ],
        product_type_id: [
          this.$rules.required('产品类型', 'number', 'change'),
        ],
        course_duration: [
          this.$rules.required('课程时长'),
          { type: 'string', pattern: /^[1-9][0-9]*$/, message: '请输入有效数字', trigger: 'blur' },
        ],
        price: [
          this.$rules.required('产品单价'),
          this.$rules.price,
        ],
      },
      // 校区全选
      allareas: false,
    }
  },

  computed: {
    // store字典数据
    dicts() {
      const { product_type, product_areas, sale_status } = this.$store.state.dicts
      return { product_type, product_areas, sale_status }
    },
    // 产品子类列表
    sub_type() {
      const id = this.fdata.product_type_id
      const arr = this.dicts.product_type
      if (id && arr.length) {
        const product = arr.find(item => item.value === id)
        if (product) return product.children
      }
      return []
    },
    // 选中校区列表
    areasChosed() {
      return this.fdata.product_areas
    },
  },

  watch: {
    allareas(nv) {
      if (nv) {
        const list = this.school_list.map(item => item.id)
        this.fdata.product_areas = list
      } else if (this.fdata.product_areas.length === this.school_list.length) {
        this.fdata.product_areas = []
      }
    },
    areasChosed(nv) {
      if (nv.length === this.school_list.length) {
        this.allareas = true
      } else {
        this.allareas = false
      }
    },
  },

  methods: {
    // 提交编辑好的表单数据
    submit() {
      // 开启按钮loadding
      this.loading = true
      // 根据接口文档转化数据
      const fdata = unit_encode(this.fdata)
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

  created() {
    Http.get('/school_list')
      .then((res) => {
        this.school_list = res
      })

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
