<template>
  <main class="contract-refund">
    <app-editor-title></app-editor-title>

    <!-- 进度条 -->
    <Steps
      class="contract-refund-step steps-fix"
      :current="process - 1"
    >
      <Step title="选择审批流程"></Step>
      <Step title="确定退费"></Step>
      <Step title="提交审批"></Step>
    </Steps>

    <!-- step1: 审批流程表单 -->
    <Form
      class="app-form-entire"
      :label-width="130"
      v-if="flowInfo"
      v-show="process === 1"
      ref="flowForm"
      :model="fdata"
      :rules="rules"
     >
      <Form-item label="审批编号">
        <span class="contract-refund__text">
          {{fdata.contract_number}}
        </span>
      </Form-item>
      <!-- 选择流程确定合同和角色选择 -->
      <Form-item label="流程名称" prop="flow_id">
        <Select
          v-model="fdata.flow_id"
          @on-change="changeFlow"
        >
          <Option
            v-for="item in flowInfo.flow_list"
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
          @click="checkFlowForm()"
        >下一步</Button>
      </Form-item>
    </Form>

    <!-- step2: 确定退费信息 -->
    <Form
      class="app-form-entire"
      v-show="process === 2"
      :label-width="130"
      ref="refundForm"
      :model="fdata"
      :rules="rules"
    >
      <Form-item label="学员姓名">
        <span class="contract-refund__text">
          {{fdata.student_name}}
        </span>
      </Form-item>
      <Form-item label="学员编号">
        <span class="contract-refund__text">
          {{fdata.student_number}}
        </span>
      </Form-item>
      <Form-item label="签约审批总额">
        <span class="contract-refund__text">
          ￥{{fdata.money}}
        </span>
      </Form-item>
      <Form-item label="退费明细">
        <contract-refund-table
          :data="fdata.contract_product"
        ></contract-refund-table>
      </Form-item>
      <Form-item label="审批总额">
        <span class="contract-refund__text">
          ￥{{-fdata.refund}}
         </span>
      </Form-item>
      <Form-item
        label="审批说明"
        prop="note"
      >
        <Input
          type="textarea"
          :rows="5"
          v-model="fdata.note"
        ></Input>
      </Form-item>
      <!-- 第二步过关按钮 -->
      <Form-item>
        <Button @click="goBack()">取消</Button>
        <Button
          type="ghost"
          @click="step(-1)"
        >
          上一步
        </Button>
        <Button
          type="primary"
          @click="preSubmit"
        >
          提交
        </Button>
      </Form-item>
    </Form>
  </main>
</template>

<script>
/**
 * 合同审批 - 退费合同创建
 *
 * @author huojinzhao
 */
import { goBack } from '@/mixins'
import { GLOBAL } from '@/store/mutationTypes'
import flow from './mixins/flow'
import {
  refundInit,
  formRules,
} from './modules/refundConfig'
import ContractRefundTable from './components/ContractRefundTable'

export default {
  name: 'ContractRefund',

  mixins: [goBack, flow],

  components: {
    ContractRefundTable,
  },

  data() {
    return {
      // 最终提交给后端的数据
      fdata: refundInit(),
      // 提交按钮状态控制
      confirmLoading: false,
      // 表单验证
      rules: formRules(this),
      // 流程控制
      process: 1,
    }
  },

  methods: {
    /* --- Initialization --- */

    // 新建&重新提交 退费合同 预数据
    fetchContractInfo(id) {
      if (this.$route.meta.action === 'create') {
        this.fdata.belong_contract_id = id
        return this.$http.get(`/contract/refund/create/${id}`)
      }
      return this.$http.get(`/contract/refund/edit/${id}`)
    },


    // 将请求预数据和初始数据合并
    fetchSucceed(res) {
      if (this.$route.meta.action === 'update') {
        this.isDealAuthority = false
      }
      this.fdata = { ...this.fdata, ...res }
    },

    /* --- Asistance --- */

    // 进入下一步
    step(value) {
      if (this.process > 2 || this.process < 0) return
      this.process = this.process + value
    },

    /* --- Business --- */

    preSubmit() {
      this.$refs.refundForm
        .validate(valid => valid && this.submit()
          .then(() => this.goBack())
          .catch(() => { this.confirmLoading = false }),
        )
    },

    // 提交编辑好的表单数据
    submit() {
      // 开启按钮loadding
      this.confirmLoading = true

      // 新增退费合同
      if (this.$route.meta.action === 'create') {
        return this.$http.post('/contract/refund', this.fdata)
      }

      // 更新退费合同
      const id = this.$route.params.id
      return this.$http.patch(`/contract/refund/edit/${id}`, this.fdata)
    },
  },

  created() {
    const id = parseInt(this.$route.params.id, 10)

    this.fetchContractInfo(id)
      .then(res => this.fetchSucceed(res))
      .catch(() => {})
      .then(() => this.$store.commit(GLOBAL.LOADING.HIDE))
  },
}
</script>

<style lang="less">
@import '~vars';

@gutter-block: 8px;

.contract-refund {
  width: @content-max-width;
  position: relative;

  & .ivu-table-wrapper {

    & table {
      width: 100%;
    }
  }

  &__text {
    font-size: 14px;
  }
}

.contract-refund-step {
  margin-bottom: 40px;
  padding-left: 50px;
}
</style>

