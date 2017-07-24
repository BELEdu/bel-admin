<template>
  <main class="app-form-entire contract-refund">
    <app-editor-title></app-editor-title>
    <Steps :current="process - 1" class="contract-refund-step steps-fix">
      <Step title="选择审批流程" ></Step>
      <Step title="确定退费" ></Step>
      <Step title="提交审批" ></Step>
    </Steps>
    <!-- 审批流程表单 -->
    <Form :label-width="130" v-if="flowInfo"
      v-show="process === 1" ref="infoForm"
      :model="fdata.info" :rules="infoRules"
     >
      <Form-item label="退费合同名称">
        <span class="contract-refund__text">
          {{fdata.info.display_name}}
         </span>
      </Form-item>
      <Form-item label="退费合同编号">
        <span class="contract-refund__text">
          {{fdata.info.approval_number}}
         </span>
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
              {{user.realname}}
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
    <!-- end 审批流程表 -->
    <!-- 确定退费信息 -->
    <Form :label-width="130" v-show="process === 2"
      ref="productForm" :model="fdata.product" :rules="productRules">
      <Form-item label="学员姓名">
        <span class="contract-refund__text">
          {{fdata.product.student_name}}
        </span>
      </Form-item>
      <Form-item label="退费原因" prop="note">
        <Input type="textarea" :rows="5" v-model="fdata.product.note"></Input>
      </Form-item>
      <Form-item label="退费明细">
        <Table :columns="detailConfig" :data="fdata.product.list" border size="small">
          <span slot="footer">
            说明：每个产品的退订金额=产品单价*（1-优惠比例）*退订数量
          </span>
        </Table>
      </Form-item>
      <Form-item label="退费总额">
        <span class="contract-refund__text">
          ￥{{fdata.product.money}}
         </span>
      </Form-item>
      <!-- 第二步过关按钮 -->
      <Form-item>
        <Button @click="goBack()">取消</Button>
        <Button type="ghost" @click="step(-1)">上一步</Button>
        <Button type="primary" @click="handleSubmit('productForm')">提交</Button>
      </Form-item>
    </Form>
    <!-- end 确定退费信息 -->
  </main>
</template>

<script>
/**
 * 合同审批 - 退费流程
 * @author hjz
 * @version 2017-07-11
 */
import { goBack } from '@/mixins'
import { GLOBAL, BUSINESS } from '@/store/mutationTypes'
// eslint-disable-next-line
import { Http } from '@/utils'
import flow from './mixins/flow'
import {
  refundInit,
  unit_encode,
  unit_decode,
  formRules,
 } from './modules/refundConfig'

export default {
  name: 'ContractRefund',

  mixins: [goBack, flow],

  data() {
    return {
      // 最终提交给后端的数据
      fdata: refundInit(),
      // 提交按钮状态控制
      loading: false,
      // 表单验证
      ...formRules(this),
      // 流程控制
      process: 1,
      // 退费明细配置
      detailConfig: [
        { key: 'product_name', title: '产品名称', align: 'center' },
        { key: 'price', title: '产品单价', align: 'center' },
        { key: 'number', title: '购买数量', align: 'center' },
        { key: 'discount_rate', title: '优惠比例', align: 'center' },
        { key: 'money', title: '产品总额', align: 'center' },
        { key: 'course_used', title: '已消耗量', align: 'center' },
        { key: 'course_remain', title: '退订数量', align: 'center' },
        { key: 'refund_money', title: '退订金额', align: 'center' },
      ],
    }
  },

  methods: {
    // 进入下一步
    step(value) {
      if (this.process > 2 || this.process < 0) return
      this.process = this.process + value
    },
    // 提交编辑好的表单数据
    submit() {
      // 开启按钮loadding
      this.loading = true
      // 若表单数据和服务器要求不符，根据需要进行二次处理
      const fdata = unit_encode(this.fdata)

      // 新增退费合同
      if (this.$route.meta.action === 'create') {
        // 虽新增，但用到旧合同id，保存在post数据中belong_contract_id字段
        this.$store.dispatch(BUSINESS.EDIT.CREATE, fdata)
          .then(() => { this.loading = false; this.goBack() })
      // 更新退费合同
      } else {
        const id = this.$route.params.id
        this.$store.dispatch(BUSINESS.EDIT.CREATE, { id, fdata })
          .then(() => { this.loading = false; this.goBack() })
      }
    },
    // Form click提交表单事件handler
    handleSubmit(name) {
      this.$refs[name].validate((valid) => { if (valid) this.submit() })
    },
  },

  created() {
    // 新增退费合同
    if (this.$route.meta.action === 'create') {
      // 设置fdata的合同id
      this.fdata.info.belong_contract_id = parseInt(this.$route.params.id, 10)

      // 获取合同基本信息
      this.$store.dispatch(BUSINESS.EDIT.INIT, this.$route)
        .then((res) => {
          this.fdata = unit_decode(res, this.fdata)
          this.$store.commit(GLOBAL.LOADING.HIDE)
        })
        .catch(() => this.$store.commit(GLOBAL.LOADING.HIDE))

    // 更新退费合同
    } else {
      // 更新的数据有belong_contract_id，需要返还的时该退费合同的id
      this.fdata.info.id = parseInt(this.$route.params.id, 10)

      // 获取更新合同数据
      this.$store.dispatch(BUSINESS.EDIT.INIT, this.$route)
        .then((res) => {
          this.isDealAuthority = false
          this.fdata = unit_decode(res)
          this.$store.commit(GLOBAL.LOADING.HIDE)
        })
        .catch(() => this.$store.commit(GLOBAL.LOADING.HIDE))
    }
  },
}
</script>

<style lang="less">

@gutter-block: 8px;

.contract-refund {
  position: relative;

  & .ivu-table-wrapper {

    & table {
      width: 100%;
    }
  }
}

.contract-refund__text {
  font-size: 14px;
}

.contract-refund-step {
  margin-bottom: 40px;
  padding-left: 50px;
}
</style>

