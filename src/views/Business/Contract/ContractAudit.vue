<template>
  <main class="app-form-entire contract-detail" v-if="contractDetail">
    <app-editor-title></app-editor-title>

    <Card :bordered="false" dis-hover>
      <h4 slot="title">审批进度</h4>
      <!-- 进度步进条 -->
      <Steps class="steps-fix">
        <Step v-for="(item, index) in contractDetail.authority"
          :key="index" :status="stepStatus[index].status"
          :title="stepStatus[index].title"
          :content="`${item.role_name} ${item.username}`"
        ></Step>
      </Steps>
    </Card>

    <Card class="contract-detail__info" :bordered="false" dis-hover>
      <h4 slot="title">审批内容</h4>
      <Row type="flex" justify="space-between">
        <Col class="contract-detail__info-student">
        <span>校区：{{contractDetail.school_name}}</span>
        <span>学员：{{contractDetail.student_name}}</span>
        <span>学员编号：{{contractDetail.student_number}}</span>
        <span>监护人：{{contractDetail.guardian_name}}</span>
        </Col>
        <Col>
        <Button type="primary" size="small">下载合同</Button>
        <Button type="primary" size="small">预览合同</Button>
        </Col>
      </Row>
      <!-- 合同列表  -->
      <Table :columns="contractCol" :data="[contractDetail]" border></Table>
      <!-- 产品列表  -->
      <Table :columns="productCol" :data="contractDetail.product_detail" border></Table>
    </Card>

    <Card v-if="contractDetail.approval_tag"
      class="contract-detail__opinion"
      :bordered="false" dis-hover
    >
      <h4 slot="title">审批意见</h4>
      <Form :model="fdata" ref="commentForm" :rules="commentRule">
        <Form-item prop="comment">
          <Input type="textarea" :rows="6" v-model="fdata.comment"></Input>
        </Form-item>
        <Form-item class="contract-detail__opinion__btn-container">
          <Button type="primary"
            @click="handleSubmit('commentForm', 3)"
            :loading="loading[3]"
          >同意</Button>
          <Button type="error"
            @click="handleSubmit('commentForm', 1)"
            :loading="loading[1]"
          >驳回</Button>
          <Button type="success" @click="goBack">返回</Button>
        </Form-item>
      </Form>
    </Card>

    <Card :bordered="false" dis-hover>
      <h4 slot="title">审批历史</h4>
      <Table :columns="hisCol" :data="contractDetail.approval" border></Table>
    </Card>
  </main>
</template>

<script>
/**
 * 合同审批 - 审批流程
 * @author hjz
 * @version 2017-06-08
 */
import { goBack } from '@/mixins'
import { Http } from '@/utils'
import { GLOBAL, BUSINESS } from '@/store/mutationTypes'
// eslint-disable-next-line
import { colConfig, list_decode } from './modules/auditConfig'

export default {
  name: 'ContractAudit',

  mixins: [goBack],

  data() {
    return {
      // 该审批页面多个列表的配置
      ...colConfig,
      // 合同详情页数据
      contractDetail: null,
      // 步进状态
      stepStatus: null,
      // 提交按钮状态控制
      loading: [true, false, true, false],
      // 提交数据
      fdata: {
        comment: '',
        // 1：驳回 | 3：同意
        apply_status: 2,
      },
      // 表单验证
      commentRule: {
        comment: this.$rules.required('审批意见'),
      },
    }
  },

  methods: {
    handleSubmit(name, apply_status) {
      // 写入提交状态
      this.fdata.apply_status = apply_status
      // 进行表单验证
      this.$refs[name].validate((valid) => {
        if (valid) {
          // 按钮进入loading状态
          this.$set(this.loading, apply_status, true)
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
    createStep() {
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

  created() {
    this.$store.dispatch(BUSINESS.EDIT.INIT, this.$route)
      .then((res) => {
        // 有些数据需要做单位转化
        this.contractDetail = list_decode(res)
        // 生成步进信息
        this.stepStatus = this.createStep()
        // 如果是退费合同，需要调整列标签
        if (this.contractDetail.refund_tag) {
          this.contractCol[5].title = '退费说明'
        }
        this.$store.commit(GLOBAL.LOADING.HIDE)
      })
      .catch(() => this.$store.commit(GLOBAL.LOADING.HIDE))
  },
}
</script>

<style lang="less">
.contract-detail {

  &__info {
    margin-top: 15px !important;

    &-student {
      & span {
        margin-right: 10px;
      }
    }

    & .ivu-table-wrapper {
      margin-top: 20px !important;
    }
  }

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
      margin-top: 0 !important;
    }
  }
}
</style>
