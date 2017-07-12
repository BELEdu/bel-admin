<template>
  <main class="app-form-entire contract-refund">
    <app-editor-title></app-editor-title>
    <Steps :current="process - 1" class="contract-refund-step steps-fix">
      <Step title="选择审批流程" ></Step>
      <Step title="确定退费" ></Step>
      <Step title="提交审批" ></Step>
    </Steps>
    <!-- 审批流程表单 -->
    <Form :label-width="130"
      v-show="process === 1" ref="infoForm"
      :model="fdata.info" :rules="infoRules"
     >
      <Form-item label="退费合同名称">
        <span class="contract-refund__text">
          {{contractInfo.info.display_name}}
         </span>
      </Form-item>
      <Form-item label="退费合同编号">
        <span class="contract-refund__text">
          {{contractInfo.info.approval_number}}
         </span>
      </Form-item>
      <!-- 流程数据 合同流程 -->
      <Form-item v-if="flowInfo" label="流程名称" required>
        <Select v-model="fdata.flow_id" @on-change="changeFlow">
          <Option
            v-for="item in flowInfo.flow_list"
            :value="item.id">
            {{item.display_name}}
           </Option>
        </Select>
      </Form-item>
      <!-- 合同模板 -->
      <Form-item label="合同模板" prop="template_type">
        <Select v-model="fdata.info.template_type">
          <Option v-for="item in flowInfo.flow_template_list"
            :value="item.id"
            >
            {{item.display_name}}
           </Option>
        </Select>
      </Form-item>
      <!-- 流程数据 角色信息 -->
      <Form-item
        v-if="flowInfo" v-for="(item, index) in flowInfo.role_list"
        :label="item.display_name" required>
        <Select v-model="this.fdata.authority[index].user_id">
          <Option
            v-for="user in item.users" :value="user.id">
            {{user.username}}
          </Option>
        </Select>
      </Form-item>
      <!-- 第一步过关按钮 -->
      <Form-item>
        <Button @click="goBack()">取消</Button>
        <Button type="primary" @click="toNextForm('infoForm')">下一步</Button>
      </Form-item>
    </Form>
    <!-- end 审批流程表 -->
    <!-- 确定退费信息 -->
    <Form :label-width="130" v-show="process === 2" ref="productForm">
      <Form-item label="学员姓名">
        <span class="contract-refund__text">
          {{contractInfo.product.student_name}}
        </span>
      </Form-item>
      <Form-item label="退费原因">
        <Input type="textarea" :rows="5" v-model="fdata.product.note"></Input>
      </Form-item>
      <Form-item label="退费明细">
        <Table :columns="detailConfig" :data="detailData" border size="small">
          <span slot="footer">
            说明：每个产品的退订金额=产品单价*（1-优惠比例）*退订数量
          </span>
        </Table>
      </Form-item>
      <Form-item label="退费总额">
        <span class="contract-refund__text">
          ￥{{contractInfo.product.money}}
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
import { refundInit, unit_encode } from './modules/refundConfig'
import { formRules } from './modules/editConfig'

export default {
  name: 'ContractRefund',

  mixins: [goBack],

  data() {
    return {
      // 最终提交给后端的数据
      fdata: refundInit(),
      // 合同基本信息
      contractInfo: {},
      // 流程信息
      flowInfo: null,
      // 提交按钮状态控制
      loading: false,
      // 表单验证
      ...formRules(this),
      // 流程控制
      process: 1,
      // 退费明细配置
      detailConfig: [
        { key: '1', title: '产品名称', align: 'center' },
        { key: '2', title: '产品单价', align: 'center' },
        { key: '3', title: '购买数量', align: 'center' },
        { key: '4', title: '优惠比例', align: 'center' },
        { key: '5', title: '产品总额', align: 'center' },
        { key: '6', title: '已消耗量', align: 'center' },
        { key: '7', title: '退订数量', align: 'center' },
        { key: '8', title: '退订金额', align: 'center' },
      ],
      detailData: [
        {
          1: '个性化一对一教学',
          2: '￥200',
          3: 30,
          4: '10%',
          5: '￥5400',
          6: 14,
          7: 16,
          8: '￥2880',
        },
        {
          1: '个性化一对一教学',
          2: '￥200',
          3: 30,
          4: '10%',
          5: '￥5400',
          6: 14,
          7: 16,
          8: '￥2880',
        },
      ],
    }
  },

  methods: {
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
      // 虽新增，但用到旧合同id，保存在post数据中belong_contract_id字段中
      this.$store.dispatch(BUSINESS.EDIT.CREATE, fdata)
        .then(() => { this.loading = false; this.goBack() })
    },
    // 进入下个表单前先进行验证
    toNextForm(name) {
      this.$refs[name].validate((valid) => { if (valid) this.step(+1) })
    },
    // Form click提交表单事件handler
    handleSubmit(name) {
      this.$refs[name].validate((valid) => { if (valid) this.submit() })
    },
    // 选择流程名称时根据流程id更改url？flow_id=value
    changeFlow(value) {
      this.$router.push({
        path: this.$route.path,
        query: {
          flow_id: value,
        },
      })
    },
    // 请求flowInfo
    reqFlowInfo() {
      // 更新flowInfo，主要是合同模板和角色信息
      const baseUrl = '/contract/create'
      const queryFlow = this.query.flow_id
        ? `?flow_id = ${this.query.flow_id}`
        : ''

      return Http.get(`${baseUrl}${queryFlow}`)
        .then((res) => {
          this.flowInfo = res
          this.dealRoleKey()
        })
    },
    // 使用请求回来的flowInfo重构表单角色数组结构
    dealRoleKey() {
      const info = this.flowInfo
      const authority = []
      info.role_list.forEach((item) => {
        authority.push({ role_id: item.id, user_id: null })
      })
      // fdata.info重构
      this.fdata.info.authority = authority
      this.fdata.info.template_type = null
    },
  },

  created() {
    // 设置fdata的合同id
    this.fdata.belong_contract_id = this.$route.query.id

    // 获取合同基本信息
    this.$store.dispatch(BUSINESS.EDIT.INIT, this.$route)
      .then((res) => {
        this.contractInfo = res
        this.fdata.product.list = res.product.list
        this.$store.commit(GLOBAL.LOADING.HIDE)
      })
      .catch(() => this.$store.commit(GLOBAL.LOADING.HIDE))

    // 请求合同流程数据集合
    this.reqFlowInfo()
  },

  beforeRouteUpdate() {
    // 选择流程名称后一起url变化，重新请求flowInfo
    this.reqFlowInfo()
      .then(() => this.$store.commit(GLOBAL.LOADING.HIDE))
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

