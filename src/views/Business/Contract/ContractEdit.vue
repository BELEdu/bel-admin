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
    <Form :label-width="130" v-if="flowInfo"
      v-show="process === 1" ref="infoForm"
      :model="fdata.info" :rules="infoRules"
     >
      <Form-item label="合同名称" prop="display_name">
        <Input placeholder="请输入合同名称" v-model="fdata.info.display_name"></Input>
      </Form-item>
      <!-- 选择流程确定合同和角色选择 -->
      <Form-item label="流程名称" prop="flow_id">
        <Select v-model="fdata.info.flow_id" @on-change="changeFlow">
          <Option
            v-for="item in flowInfo.flow_list"
            :value="item.id" :key="item.id"
          >
            {{item.display_name}}
           </Option>
        </Select>
      </Form-item>
      <!-- 合同模板 -->
      <Form-item v-if="flowInfo.flow_template_list.length"
        label="合同模板" prop="template_type"
      >
        <Select v-model="fdata.info.template_type">
          <Option v-for="item in flowInfo.flow_template_list"
            :value="item.id" :key="item.id"
            >
            {{item.display_name}}
           </Option>
        </Select>
      </Form-item>
      <!-- 流程数据 角色信息 -->
      <Form :label-width="130" ref="authorityForm"
        :model="fdata.info.authority[index]"
        v-for="(item, index) in flowInfo.role_list"
        :key="item.display_name" :rules="authorityRules"
      >
        <Form-item prop="user_id" :label="item.display_name">
          <Select v-model="fdata.info.authority[index].user_id">
            <Option v-for="user in item.users"
              :value="user.id" :key="user.id"
            >
              {{user.username}}
            </Option>
          </Select>
        </Form-item>
      </Form>
      <!-- 第一步过关按钮 -->
      <Form-item>
        <Button @click="goBack()">取消</Button>
        <Button type="primary" @click="checkMulForm('infoForm', 'authorityForm')">下一步</Button>
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
      <Form class="contract-create__product"
        :label-width="95" :model="item" inline
        v-for="(item, index) in fdata.product.list"
        ref="products" :rules="productRules" :key="index"
      >
        <!--<template v-for="(item, index) in fdata.product.list">-->
        <Form-item class="contract-create__product__select"
          v-if="productList.length" label="选择产品" prop="product_id"
        >
          <Select v-model="item.product_id"
            @on-change="calPrice(index)"
          >
            <Option v-for="item in productList"
              :value="item.id" :key="item.id"
            >
              {{item.display_name}}
            </Option>
          </Select>
        </Form-item>
        <Form-item label="购买数量" prop="number">
          <Input-number v-model="item.number"
            :min="1" @on-change="calPrice(index)"
          ></Input-number>
        </Form-item>
        <Form-item label="优惠比例" prop="discount_rate">
          <Input-number v-model="item.discount_rate"
            :min="0" :max="100" @on-change="calPrice(index)"
          ></Input-number>
        </Form-item>
        <div>
          <span>合计</span>
           <span>{{item.money}}元</span>
          <!-- <span>{{0}}元</span> -->
          <Button size="small" type="error"
            @click.stop="deleteProduct(index)"
          >删除</Button>
        </div>
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
      <Form-item label="合同金额" prop="discount">
        <span class="contract-create__text">{{productsPrice}}元</span>
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
import flow from './mixins/flow'
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

  mixins: [goBack, flow],

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
      // 后端产品列表数据
      productList: [],
    }
  },

  computed: {
    dicts() {
      const { gender } = this.$store.state.dicts
      return { gender }
    },
    productsPrice() {
      const list = this.fdata.product.list
      return list.reduce(((acc, cv) => acc + cv.money), 0)
    },
  },

  methods: {
    calPrice(index) {
      const target = this.fdata.product.list[index]
      const product = this.productList
        .find(item => item.id === target.product_id)

      if (product) {
        const price = parseInt(product.price, 10)
        const number = target.number
        const discount = (100 - target.discount_rate) / 100
        const money = number * price * discount
        target.money = Math.ceil(money)
      } else {
        target.money = 0
      }
    },
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
      upValid = this.groupValidate('products')

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

    // 请求第三步需要的产品列表
    Http.get('/product_list?sale_status=1')
      .then((res) => { this.productList = res })
  },
}
</script>

<style lang="less">

@gutter-unit: 8px;

.contract-create {

  &__text {
    font-size: 14px;
  }
}

.contract-create-step {
  margin-bottom: 40px;
  padding-left: 50px;
}

.contract-create__product {
  margin-left: 35px !important;
  margin-bottom: 0 !important;

  &>.ivu-form-item:not(:first-child) {
    // background-color: red;

    & .ivu-form-item-label {
      padding-right: 14px;
      width: 75px !important;
    }

    & .ivu-form-item-content {
      margin-left: 75px !important;
    }
  }

  &>div:last-of-type {
    position: relative;
    display: inline-block;
    margin-left: 10px;
    width: 139px;
    line-height: 32px;
    font-size: 14px;

    &>button {
      position: absolute;
      right: 0;
      margin-top: 4px;
    }
  }

  &__delete {
    &.ivu-form-item {
      margin: 0 !important;
    }

    & .ivu-form-item-content {
      margin-left: @gutter-unit !important;
    }

    & .ivu-btn {
      width: 40px !important;
      margin: 0 !important;
    }
  }

  &__select {
    & .ivu-form-item-content {
      width: 345px !important;
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
