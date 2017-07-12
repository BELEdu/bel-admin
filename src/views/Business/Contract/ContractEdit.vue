<template>
  <main class="app-form-entire contract-create">
    <app-editor-title></app-editor-title>
    <Steps :current="process - 1" class="contract-create-step steps-fix">
      <Step title="选择流程" ></Step>
      <Step title="输入学员信息" ></Step>
      <Step title="选择产品" ></Step>
      <Step title="提交审批" ></Step>
    </Steps>
    <!-- 审批流程表单 -->
    <Form :label-width="130" v-show="process === 1" ref="flowForm" :model="fdata.info" :rules="infoRules">
      <Form-item label="合同名称" prop="display_name">
        <Input placeholder="请输入合同名称" v-model="fdata.info.display_name"></Input>
      </Form-item>
      <!-- 与系统相关，先空着，传假数据 -->
      <Form-item label="流程名称" prop="flow_id">
        <Select v-model='fdata.info.flow_id'>
          <Option value="1">新签流程审批</Option>
          <Option value="2">续费流程审批</Option>
          <Option value="3">试听流程审批</Option>
        </Select>
      </Form-item>
      <!-- 合同模板 -->
      <Form-item label="合同模板" prop="template_type">
        <Select v-model="fdata.info.template_type">
          <Option value="1">模板一</Option>
          <Option value="1">模板二</Option>
          <Option value="1">模板三</Option>
        </Select>
      </Form-item>
      <!-- 与系统相关，先空着，传假数据 -->
      <Form-item label="咨询主任" required>
        <Select>
          <Option value="1">甲</Option>
          <Option value="2">乙</Option>
          <Option value="3">丙</Option>
        </Select>
      </Form-item>
      <!-- 与系统相关，先空着，传假数据 -->
      <Form-item label="校长" required>
        <Select>
          <Option value="1">甲</Option>
          <Option value="2">乙</Option>
          <Option value="3">丙</Option>
        </Select>
      </Form-item>
      <!-- 第一步过关按钮 -->
      <Form-item>
        <Button @click="goBack()">取消</Button>
        <Button type="primary" @click="toNextForm('flowForm')">下一步</Button>
      </Form-item>
    </Form>
    <!-- 审批流程表单end -->
    <!-- 学员信息表单 -->
    <Form :label-width="130" v-show="process === 2" ref="studentForm" :model="fdata.student" :rules="studentRules">
      <template v-for="(item, index) in studentFormRender">

        <Form-item label="学员性别" v-if="index === 8">
          <Radio-group v-model="fdata.student.gender">
            <Radio
              v-for="item in dicts.gender"
              :label="item.value"
              :key="item.display_name">
              <span>{{item.display_name}}</span>
            </Radio>
          </Radio-group>
        </Form-item>

        <Row v-else-if="index === 6">
          <Col span="10">
          <Form-item label="填写地址">
            <app-map-cascader v-model="fdata.student.areas_code"></app-map-cascader>
          </Form-item>
          </Col>
          <Col span="14" class="contract-create__student-location">
          <Form-item>
            <Input placeholder="请输入街道地址"></Input>
          </Form-item>
          </Col>
        </Row>

        <Form-item v-else :label="item.label" :prop="item.prop">
          <Input :placeholder="item.pholder" v-model="fdata.student[item.prop]"></Input>
        </Form-item>
      </template>

      <Form-item>
        <Button @click="goBack()">取消</Button>
        <Button type="ghost" @click="step(-1)">上一步</Button>
        <Button type="primary" @click="toNextForm('studentForm')">下一步</Button>
      </Form-item>
    </Form>
    <!-- 学员信息表单end -->
    <!-- 产品信息表单 -->
    <Form :label-width="130" v-show="process === 3" ref="productForm" :model="fdata.product" :rules="productRules">
      <!-- 产品选择 -->
      <Form class="contract-create__product" :label-width="95" v-for="(item, index) in fdata.product.list" :model="item" ref="products" :rules="productRules" inline :key="index">
        <!--<template v-for="(item, index) in fdata.product.list">-->
        <Form-item class="contract-create__product__select" label="选择产品" prop="product_id">
          <Select v-model="item.product_id">
            <Option :value="1">甲</Option>
            <Option :value="2">乙</Option>
            <Option :value="3">丙</Option>
          </Select>
        </Form-item>
        <Form-item label="购买数量" prop="number">
          <Input-number v-model="item.number"></Input-number>
        </Form-item>
        <Form-item label="优惠比例" prop="discount_rate">
          <Input-number v-model="item.discount_rate" :min="0" :max="100"></Input-number>
        </Form-item>
        <Form-item class="contract-create__product__delete">
          <Button size="small" type="error" @click.stop="deleteProduct(index)">删除</Button>
        </Form-item>
        <!--</template>-->
      </Form>
      <!-- 新增产品按钮 -->
      <Row type="flex" justify="center" class="contract-create__product__create">
        <Col span="4">
        <Button type="dashed" long icon="plus-round" @click.stop="createProduct()">新增产品</Button>
        </Col>
      </Row>
      <!-- 新增产品按钮end -->
      <!-- 产品选择end -->
      <Form-item label="优惠金额" prop="discount">
        <Input placeholder="请输入优惠率" v-model="fdata.product.discount"></Input>
      </Form-item>
      <Form-item label="辅导地点" prop="location">
        <Input placeholder="请输入辅导地点" v-model="fdata.product.location"></Input>
      </Form-item>
      <Form-item label="审批说明" prop="note">
        <Input type="textarea" :rows="6" v-model="fdata.product.note"></Input>
      </Form-item>
      <Form-item>
        <Button @click="goBack()">取消</Button>
        <Button type="ghost" @click="step(-1)">上一步</Button>
        <Button type="primary" @click="handleSubmit('productForm')">提交</Button>
      </Form-item>
    </Form>
    <!-- 产品信息表单end -->
  </main>
</template>

<script>
/**
 * 合同审批 - 添加审批
 * @author hjz
 * @version 2017-06-08
 */
import { goBack } from '@/mixins'
import { GLOBAL, BUSINESS } from '@/store/mutationTypes'
// eslint-disable-next-line
import { Http } from '@/utils'
import {
  editInit,
  productOrigin,
  unit_encode,
  // eslint-disable-next-line
  unit_decode,
  formRules,
  studentFormRender,
} from './modules/editConfig'

export default {
  name: 'ContractEditor',

  mixins: [goBack],

  data() {
    return {
      // 最终提交给后端的数据
      fdata: editInit(),
      // 提交按钮状态控制
      loading: false,
      // 表单验证
      ...formRules(this),
      // 流程控制
      process: 1,
      // 表单渲染
      ...studentFormRender(),
    }
  },

  computed: {
    dicts() {
      const { gender } = this.$store.state.dicts
      return { gender }
    },
  },

  methods: {
    // 添加产品项
    createProduct() {
      this.fdata.product.list.push(productOrigin())
    },
    // 删除产品项，至少保留一个
    deleteProduct(index) {
      const list = this.fdata.product.list
      if (list.length > 1) list.splice(index, 1)
    },
    // 进入下一步
    step(value) {
      if (this.process > 3 || this.process < 0) return
      this.process = this.process + value
    },
    // 提交编辑好的表单数据
    submit() {
      // 开启按钮loadding
      this.loading = true
      // 若表单数据和服务器要求不符，根据需要进行二次处理
      const fdata = unit_encode(this.fdata)
      // 判断新增还是修改
      if (this.$route.params.id) {
        const id = this.$route.params.id
        this.$store.dispatch(BUSINESS.EDIT.UPDATE, { id, fdata })
          .then(() => { this.loading = false; this.goBack() })
      } else {
        this.$store.dispatch(BUSINESS.EDIT.CREATE, fdata)
          .then(() => { this.loading = false; this.goBack() })
      }
    },
    // 进入下个表单前先进行验证
    toNextForm(name) {
      this.$refs[name].validate((valid) => { if (valid) this.step(+1) })
    },
    // Form click提交表单事件handler
    handleSubmit(name) {
      let upValid = false
      let downValid = false

      // 产品上表单验证
      upValid = this.$refs.products.every((item) => {
        let ok = false
        item.validate((valid) => {
          ok = valid
        })
        return ok
      })

      // 产品下表单验证
      this.$refs[name].validate((valid) => { downValid = valid })

      // 若上下都验证成功，提交表单数据
      if (upValid && downValid) this.submit()
    },
  },

  created() {
    this.$store.dispatch(BUSINESS.EDIT.INIT, this.$route)
      .then((res) => { this.fdata = res; this.$store.commit(GLOBAL.LOADING.HIDE) })
      .catch(() => this.$store.commit(GLOBAL.LOADING.HIDE))
  },
}
</script>

<style lang="less">

@gutter-block: 8px;

.contract-create-step {
  margin-bottom: 40px;
  padding-left: 50px;
}

.contract-create__product {
  margin-left: 35px !important;
  margin-bottom: 0 !important;

  &__delete {
    &.ivu-form-item {
      margin: 0 !important;
    }

    & .ivu-form-item-content {
      margin-left: @gutter-block !important;
    }

    & .ivu-btn {
      width: 40px !important;
      margin: 0 !important;
    }
  }

  &__select {
    & .ivu-form-item-content {
      width: 398px !important;
    }
  }

  &__create {
    margin-bottom: 30px;
  }
}

.contract-create__student {

  &-location {

    & .ivu-form-item-content {
      margin-left: 10px !important;
    }
  }
}

.ie {

  & .contract-create__product {

    &__create {

      & .ivu-col {
        width: 100%;
        text-align: center;
        padding-bottom: 30px;
        padding-left: 40px;

        & .ivu-btn {
          width: auto;
        }
      }
    }
  }
}
</style>
