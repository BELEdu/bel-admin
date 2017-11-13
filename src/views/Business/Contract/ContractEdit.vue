<template>
  <main class="contract-create">
    <app-editor-title></app-editor-title>

    <!-- 操作进度条提示 -->
    <Steps
      :current="process - 1"
      class="step steps-fix"
    >
      <Step title="选择流程"></Step>
      <Step title="输入学员信息"></Step>
      <Step title="选择产品"></Step>
      <Step title="提交审批"></Step>
    </Steps>

    <!-- 流程一：审批流程 -->
    <Form
      class="app-form-entire"
      :label-width="130"
      v-if="flowInfo"
      v-show="process === 1"
      :model="fdata"
      :rules="rules"
      ref="flowForm"
     >
      <Form-item label="学员编号" prop="student_number">
        <Input
          placeholder="请输入学员编号"
          v-model="fdata.student_number"
        ></Input>
      </Form-item>
      <!-- 选择流程确定合同和角色选择 -->
      <Form-item label="流程名称" prop="flow_id">
        <Select
          @on-change="changeFlow"
          v-model="fdata.flow_id"
        >
          <Option
            v-for="item in filterFlow(flowInfo.flow_list)"
            :value="item.id"
            :key="item.id"
          >
            {{item.display_name}}
           </Option>
        </Select>
      </Form-item>
      <!-- 流程数据 角色信息 -->
      <Form-item
        v-for="(item, index) in flowInfo.role_list"
        :key="item.display_name"
        :rules="rules.authorityRules"
        :label="item.display_name"
        :prop="'authority.' + index + '.user_id'"
      >
        <Select
          v-model="fdata.authority[index].user_id"
        >
          <Option
            v-for="user in item.users"
            :value="user.id"
            :key="user.id"
          >
            {{user.realname}}
          </Option>
        </Select>
      </Form-item>
      <!-- 第一步过关按钮 -->
      <Form-item>
        <Button @click="goBack()">取消</Button>
        <Button
          type="primary"
          @click="checkFlowForm(fetchStudentInfo)"
        >下一步</Button>
      </Form-item>
    </Form>

    <!-- 流程二：学员信息表单 -->
    <Form
      class="app-form-entire"
      :label-width="130"
      v-show="process === 2"
      :model="fdata"
      :rules="rules"
      ref="studentForm"
    >
      <template v-for="item in studentFormRender">
        <Form-item
          v-if="item.type === 'input'"
          :label="item.label"
          :prop="item.prop"
        >
          <Input
            :placeholder="item.pholder"
            v-model="fdata[item.prop]"
          ></Input>
        </Form-item>

        <Form-item
          v-else-if="item.type === 'select'"
          :label="item.label"
          :prop="item.prop"
        >
          <Select
            v-model="fdata[item.prop]"
          >
            <Option
              v-for="option in dicts[item.dictName]"
              :key="option.value || option.id"
              :value="option.value || option.id"
            >{{option.display_name}}</Option>
          </Select>
        </Form-item>

        <Form-item
          v-else-if="item.type === 'radio'"
          :label="item.label"
          :prop="item.prop"
        >
          <Radio-group v-model="fdata[item.prop]">
            <Radio
              v-for="option in dicts[item.dictName]"
              :label="option.value"
              :key="option.display_name"
            >
              <span>{{option.display_name}}</span>
            </Radio>
          </Radio-group>
        </Form-item>

        <template v-else>
          <Form-item
            class="student-areas"
            :label="item.label"
            prop="areas_code"
            required
          >
            <app-map-cascader
              v-model="fdata.areas_code"
            ></app-map-cascader>
          </Form-item>
          <Form-item
            class="student-location"
            :label-width="0"
            prop="location"
          >
            <Input
              placeholder="请输入街道"
              v-model="fdata.location"
            ></Input>
          </Form-item>
        </template>
      </template>

      <Form-item>
        <Button
          @click="goBack()"
        >取消</Button>
        <Button
          type="ghost"
          @click="step(-1)"
        >上一步</Button>
        <Button
          type="primary"
          @click="checkStudentForm"
        >下一步</Button>
      </Form-item>
    </Form>

    <!-- 第三步：产品信息表单 -->
    <Form
      class="app-form-entire"
      :label-width="130"
      v-if="process === 3"
      :model="fdata"
      ref="productForm"
    >
      <app-form-alert :errors="formErrors"></app-form-alert>
      <!-- 产品选择 -->
      <Form-item
        class="product-product"
        v-for="(item, index) in fdata.contract_product"
        :key="index"
        label="选择产品"
        :prop="`contract_product[${index}].product_id`"
        :rules="rules.contract_product"
      >
        <Select
          v-model="item.product_id"
          @on-change="calcProductMoney(item)"
        >
          <Option
            v-for="product in productList"
            v-show="filterProducts(product, item.product_id)"
            :value="product.id"
            :key="product.id"
          >
            {{product.display_name}}
          </Option>
        </Select>

        <span class="text">购买数量</span>

        <Input-number
          :min="1"
          v-model="item.number"
          @on-change="calcProductMoney(item)"
        ></Input-number>

        <span class="text">合计 {{item.money}}元</span>

        <Button
          class="product-delete"
          v-show="fdata.contract_product.length > 1"
          size="small"
          type="error"
          @click.stop="deleteProduct(index)"
        >删除</Button>
      </Form-item>

      <!-- 新增产品 -->
      <div
        class="product-create"
      >
        <Button
          v-show="fdata.contract_product.length < productList.length"
          type="dashed"
          icon="plus-round"
          @click.stop="createProduct"
        >新增产品</Button>
      </div>

      <!-- 产品净总金额 -->
      <Form-item label="产品总额">
        <span>{{fdata.original_money}}元</span>
      </Form-item>

      <!-- 优惠选择 -->
      <Form-item
        class="product-promotion"
        v-for="(item, index) in fdata.contract_promotion"
        :key="index"
        label="优惠活动"
      >
        <Select
          size="small"
          v-model="item.promotion_id"
        >
          <Option
            :value="-1"
            @click.native="selectPromotion(index, { promotion_id: -1 })"
          >无</Option>
          <Option
            v-for="promotion in promotionList"
            v-show="filterPromotions(promotion, item.promotion_id)"
            :value="promotion.id"
            :key="promotion.id"
            @click.native="selectPromotion(index, promotion)"
          >
            {{promotion.display_name}}
          </Option>
        </Select>
        <Button
          class="product-delete"
          v-show="fdata.contract_promotion.length > 1"
          size="small"
          type="error"
          @click.stop="deletePromotion(index)"
        >删除</Button>
      </Form-item>

      <!-- 新增优惠 -->
      <div
        class="product-create"
      >
        <Button
          v-show="fdata.contract_promotion.length < promotionList.length"
          type="dashed"
          icon="plus-round"
          @click.stop="createPromotion"
        >新增优惠</Button>
      </div>

      <!-- 优惠后总金额 -->
      <Form-item label="审批总额">
        <span>{{fdata.money}}元</span>
      </Form-item>

      <Form-item label="审批说明" prop="note">
        <Input
          type="textarea"
          :rows="6"
          v-model="fdata.note"
        ></Input>
      </Form-item>
      <Form-item>
        <Button
          @click="goBack()"
        >取消</Button>
        <Button
          type="ghost"
          @click="step(-1)"
        >上一步</Button>
        <Button
          :loading="confirmLoading"
          type="primary"
          @click="preSubmit"
        >提交</Button>
      </Form-item>
    </Form>
  </main>
</template>

<script>
/**
 * 合同审批 - 添加审批
 *
 * @author huojinzhao
 */

import { GLOBAL } from '@/store/mutationTypes'
import { goBack, form } from '@/mixins'
import flow from './mixins/flow'
import {
  editInit,
  productOrigin,
  promotionOrigin,
  unit_encode,
  formRules,
  studentFormRender,
} from './modules/editConfig'

export default {
  name: 'BusinessContractEditor',

  mixins: [goBack, flow, form],

  data() {
    return {
      // 最终提交给后端的数据
      fdata: editInit(),
      // 提交按钮状态控制
      loading: false,
      // 表单验证
      rules: formRules(this),
      // 流程控制
      process: 1,
      // step2: 表单渲染
      studentFormRender: studentFormRender(),
      // step2: 校园数据
      campuses: [],
      // step3: 产品列表数据
      productList: [],
      // step3: 原始优惠列表
      promotionList: [],
      // step3: 没给优惠对应活动列表，type: <array: object>
      dupPromotionList: [[]],
      // step3: 表单提交loading
      confirmLoading: false,
    }
  },

  computed: {
    dicts() {
      return ({
        ...this.$store.state.dicts,
        school_list: this.campuses,
      })
    },
  },

  created() {
    // 请求第二步需要的学校列表
    this.fetchCampuses()

    // 请求第三步需要的产品列表
    this.fetchProducts()

    // 更新合同数据
    const id = this.$route.params.id
    if (id) {
      this.fetchContractInfo(id)
        .then(() => this.$store.commit(GLOBAL.LOADING.HIDE))
    } else {
      this.$store.commit(GLOBAL.LOADING.HIDE)
    }
  },

  methods: {
    /* --- Initialization --- */

    fetchContractInfo(id) {
      return this.$http.get(`/contract/edit/${id}`)
        .then(({
          contract_promotion,
          ...rest
        }) => {
          this.isDealAuthority = false

          if (!contract_promotion.length) {
            // eslint-disable-next-line
            contract_promotion = [{ promotion_id: -1 }]
          }
          this.fdata = {
            ...this.fdata,
            ...rest,
            contract_promotion,
          }
        })
    },

    fetchCampuses() {
      this.$http.get('/contract/campus/list')
        .then((res) => { this.campuses = res })
    },

    fetchProducts() {
      const url = '/contract_step3?sale_status=1&sale_type=2'
      this.$http.get(url)
        .then(({
          product_list,
          promotion_list,
        }) => {
          this.productList = product_list
          this.promotionList = promotion_list
        })
    },

    /* --- Assitance --- */

    // 进入下一步
    step(value) {
      if (this.process > 3 || this.process < 0) return
      this.process = this.process + value
    },

    filterFlow(flowList) {
      return flowList.filter(item => item.flow_type_id !== 4)
    },

    /* --- 第一步 --- */

    fetchStudentInfo() {
      // 更新合同数据
      const contractId = this.$route.params.id
      if (contractId) return Promise.resolve()

      const number = this.fdata.student_number.trim()

      const url = `/student/number/${number}`
      return this.$http.get(url)
        .then(({ id, ...rest }) => {
          this.fdata = { ...this.fdata, ...rest }
        })
        .catch(() => this.$Notice.error({
          title: '错误',
          desc: '学生信息请求出错',
          duration: 0,
        }))
    },

    /* --- 第二步 --- */

    validateAreas(rule, value, callback) {
      return value && value.length
        ? callback()
        : callback('地区信息不能为空')
    },

    validateLocation(rule, value, callback) {
      return value && value.length
        ? callback()
        : callback('街道信息不能为空')
    },

    checkStudentForm() {
      this.$refs.studentForm
        .validate((valid) => { if (valid) this.step(+1) })
    },

    /* --- 第三步 --- */

    /* 产品相关 */

    // 添加产品项
    createProduct() {
      this.$refs.productForm
        .validate(valid => valid
          && this.fdata.contract_product.push(productOrigin()),
        )
    },

    // 删除产品项，至少保留一个
    deleteProduct(index) {
      const list = this.fdata.contract_product
      if (list.length > 1) list.splice(index, 1)
      this.calcOriginPrice()
    },

    // 产品选项过滤
    filterProducts(product, id) {
      // 选中不过滤
      if (product.id === id) return true
      // 非选中过滤
      return this.fdata.contract_product
        .every(item => item.product_id !== product.id)
    },

    // 计算单个产品金额
    calcProductMoney(product) {
      const target = this.productList
        .find(item => item.id === product.product_id)
      if (target) {
        const money = (target.price * product.number).toFixed(2)
        // eslint-disable-next-line
        product.money = parseFloat(money)
        this.calcOriginPrice()
      }
    },

    // 计算净总金额，后计算优惠后总额
    calcOriginPrice() {
      this.fdata.original_money = this
        .fdata.contract_product
        .reduce((acc, product) => acc + product.money, 0)
      this.initPromotion()
    },

    /* 优惠相关 */

    initPromotion() {
      this.fdata.contract_promotion = [promotionOrigin()]
      this.calcMoney()
    },

    createPromotion() {
      this.fdata.contract_promotion.push(promotionOrigin())
    },

    deletePromotion(index) {
      this.fdata.contract_promotion.splice(index, 1)
      this.calcMoney()
    },

    selectPromotion(index, promotion) {
      // 添加优惠信息
      const list = this.fdata.contract_promotion
      list[index] = { ...list[index], ...promotion }

      // 重置优惠列表
      this.fdata.contract_promotion = list.slice(0, index + 1)

      this.$nextTick(() => this.calcMoney())
    },

    calcMoney() {
      this.fdata.money = this.fdata.contract_promotion
        .reduce((acc, promotion) => {
          const {
            promotion_id: id,
            promotion_type: type,
          } = promotion

          if (id >= 0 && type === 1) {
            return this.calcMinus(acc, promotion)
          }

          if (id >= 0 && type === 2) {
            return this.calcDiscount(acc, promotion)
          }

          return acc
        }, this.fdata.original_money)
    },

    calcMinus(price, promotion) {
      const result = (price - promotion.minus_price).toFixed(2)
      return parseFloat(result)
    },

    calcDiscount(price, promotion) {
      const result = (price * (1 - (promotion.discount / 100))).toFixed(2)
      return parseFloat(result)
    },

    filterPromotions(promotion, id) {
      // 选中不过滤
      if (promotion.id === id) return true

      // 非选中过滤
      const result = this.fdata.contract_promotion
        .every(item => item.promotion_id !== promotion.id)

      if (this.fdata.contract_promotion.length === 1) {
        return result && promotion.enjoy_price <= this.fdata.original_money
      }

      return result && promotion.enjoy_price <= this.fdata.money
    },

    preSubmit() {
      this.$refs.productForm
        .validate(valid => valid && this.submit()
          .then(() => this.goBack())
          .catch(this.errorHandler)
          .catch(() => { this.confirmLoading = false }),
        )
    },

    // 提交编辑好的表单数据
    submit() {
      const id = this.$route.params.id
      // 开启按钮loadding
      this.confirmLoading = true
      // 若表单数据和服务器要求不符，根据需要进行二次处理
      const fdata = unit_encode(this.fdata)
      // 判断新增还是修改
      if (id) {
        return this.$http.patch(`/contract/edit/${id}`, fdata)
      }
      return this.$http.post('/contract', fdata)
    },
  },
}
</script>

<style lang="less">
@import '~vars';

@gutter-unit: 8px;

.contract-create {
  width: @content-max-width;

  &__text {
    font-size: 14px;
  }

  & .step {
    margin-bottom: 40px;
    padding-left: 50px;
  }

  & .student {

    &-areas {
      display: inline-block;
      width: 45%;
    }

    &-location {
      float: right;
      width: 50%;

      & .ivu-form-item-content {
        margin-left: 0 !important;
      }
    }
  }

  & .product {

    &-product {

      & .ivu-select {
        width: 60%;
      }

      & .text {
        margin: 0 10px 0 30px;
      }
    }

    &-promotion {

      & .ivu-select {
        width: 60%;
      }

      & .text {
        margin: 0 10px 0 30px;
      }

      & .product-delete {
        float: none;
        margin-left: 10px;
      }
    }

    &-create {
      margin-bottom: 30px;
      text-align: center;

      & > button {
        width: 150px;
      }
    }

    &-delete {
      float: right;
      margin-top: 3px;
    }
  }
}
</style>
