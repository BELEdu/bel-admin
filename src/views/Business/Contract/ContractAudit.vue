<template>
  <main class="contract-detail">
    <app-editor-title></app-editor-title>

    <!-- 进度步进条 -->
    <Card dis-hover :bordered="false">
      <h4 slot="title">审批进度</h4>
      <Steps
        v-if="contractDetail.authority.length"
        class="steps-fix"
      >
        <Step
          v-for="(item, index) in contractDetail.authority"
          :key="index"
          :status="stepStatus[index].status"
          :title="stepStatus[index].title"
          :content="`${item.role_name} ${item.username}`"
        ></Step>
      </Steps>
    </Card>

    <!-- 普通合同信息 -->
    <audit-content-contract
      v-if="$route.meta.contractType === 'contract'"
      :data="contractDetail"
    >
    </audit-content-contract>

    <!-- 退费合同信息 -->
    <audit-content-refund
      v-else
      :data="contractDetail"
    >
    </audit-content-refund>

    <!-- 进行审批 -->
    <Card
      v-if="$route.meta.operationType === 'audit'"
      class="contract-detail__opinion"
      :bordered="false"
      dis-hover
    >
      <h4 slot="title">审批意见</h4>
      <Form
        :model="fdata"
        ref="commentForm"
        :rules="commentRules"
       >
        <Form-item prop="comment">
          <Input
            type="textarea"
            :rows="6"
            v-model="fdata.comment"
          ></Input>
        </Form-item>
        <Form-item
          class="contract-detail__opinion__btn-container"
        >
          <Button
            type="success"
            @click="preSubmit(3)"
            :loading="loading[3]"
          >同意</Button>
          <Button
            type="error"
            @click="preSubmit(1)"
            :loading="loading[1]"
          >驳回</Button>
          <Button
            type="ghost"
            @click="goBack"
          >返回</Button>
        </Form-item>
      </Form>
    </Card>

    <!-- 审批历史 -->
    <Card :bordered="false" dis-hover>
      <h4 slot="title">审批历史</h4>
      <Table border
        :columns="historyCol"
        :data="contractDetail.approval"
      ></Table>
    </Card>
  </main>
</template>

<script>
/**
 * 合同审批 - 审批信息 & 审批流程
 *
 * @author huojinzhao
 */
import { goBack } from '@/mixins'
import { Http } from '@/utils'
import { GLOBAL } from '@/store/mutationTypes'
import AuditContentContract from './components/AuditContentContract'
import AuditContentRefund from './components/AuditContentRefund'

export default {
  name: 'ContractAudit',

  mixins: [goBack],

  components: {
    AuditContentContract,
    AuditContentRefund,
  },

  data() {
    return {
      // 合同详情页数据
      contractDetail: {
        contract_product: [],
        contract_promotion: [],
        authority: [],
        approval: [],
      },
      // 审批历史table配置
      historyCol: [
        {
          title: '审批人',
          key: 'username',
          align: 'center',
        },
        {
          title: '审批人岗位',
          key: 'role_name',
          align: 'center',
        },
        {
          title: '审批结果',
          key: 'apply_status_name',
          align: 'center',
        },
        {
          title: '审批意见',
          key: 'comment',
          align: 'center',
        },
        {
          title: '审批时间',
          key: 'date',
          align: 'center',
        },
      ],
      // 提交按钮状态控制
      loading: [true, false, true, false],
      // 提交数据
      fdata: {
        comment: '',
        // 1：驳回 | 3：同意
        apply_status: 2,
      },
      // 表单验证
      commentRules: {
        comment: this.$rules.required('审批意见'),
      },
    }
  },

  computed: {
    // 步进状态
    stepStatus() {
      // 根据后端数据res.authority获取步进条状态
      if (this.contractDetail === null) return []

      const flow = this.contractDetail.authority
      const arr = flow.map((item) => {
        let status = ''
        let title = ''
        switch (item.apply_status) {
          case 1:
            status = 'error'
            title = '已驳回'
            break
          case 3:
            status = 'finish'
            title = '已通过'
            break
          default:
            status = 'wait'
            title = '未审批'
        }
        return { status, title }
      })

      const index = flow.findIndex(item => item.apply_status === 0)

      // 全部未审批 第一个人duty
      if (index === 0) {
        arr[0].status = 'process'
        arr[0].title = '待审核'
      }

      // 有人未审批，根据最后一个人结果判断下一个人状态
      if (index > 0 && index < arr.length - 1) {
        // 最后一个审批人同意，下一个人duty
        if (arr[index] === 'finish') {
          arr[index + 1].status = 'process'
          arr[index + 1].title = '待审核'
        }
      }

      return arr
    },
  },

  methods: {
    /* --- initialization --- */

    fetchAuditInfo() {
      const id = this.$route.params.id
      const type = this.$route.meta.contractType
      if (type === 'contract') {
        return this.$http.get(`/contract/audit/${id}`)
      }
      return this.$http.get(`/contract/refund/audit/${id}`)
    },

    /* --- business --- */

    preSubmit(apply_status) {
      // 写入提交状态
      this.fdata.apply_status = apply_status
      // 进行表单验证
      this.$refs.commentForm.validate((valid) => {
        if (valid) {
          // 按钮进入loading状态
          this.loading[apply_status] = true
          // 提交表单
          this.submit()
        }
      })
    },

    submit() {
      const id = this.$route.params.id
      Http.post(`/contract/approval/${id}`, this.fdata)
        .then(() => this.goBack())
    },
  },

  created() {
    this.fetchAuditInfo()
      .then((res) => {
        // 有些数据需要做单位转化
        this.contractDetail = {
          ...this.contractDetail,
          ...res,
        }
      })
      .catch(() => {})
      .then(() => this.$store.commit(GLOBAL.LOADING.HIDE))
  },
}
</script>

<style lang="less">
@import '~vars';

.contract-detail {
  width: @content-max-width;

  &__opinion {
    margin-top: 20px !important;

    &__btn-container {
      text-align: center;
      margin-bottom: 10px !important;

      &>.ivu-form-item-content {
        display: inline-block;
      }
    }

    & button {
      margin: 0 10px;
      width: 70px;
    }
  }
}
</style>
