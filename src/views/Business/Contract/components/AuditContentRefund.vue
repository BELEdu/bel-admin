<template>
  <div class="audit-content-contract">
    <Card
      class="audit-content-contract__audit-info"
      dis-hover
      :bordered="false"
    >
      <h4 slot="title">审批内容</h4>
      <audit-student-info :data="data"></audit-student-info>
      <!-- 合同列表  -->
      <Table
        border
        :columns="refundCol"
        :data="[data]"
      >
      </Table>
    </Card>

    <Card dis-hover :bordered="false">
      <h4 slot="title">退费明细</h4>
      <contract-refund-table
        :data="data.contract_product"
      ></contract-refund-table>
    </Card>

    <Card dis-hover :bordered="false">
      <h4 slot="title">退费说明</h4>
      <div>{{data.note}}</div>
    </Card>
  </div>
</template>

<script>
/**
 * 合同审批 - 审批信息 - 退费合同
 *
 * @author huojinzhao
 */

import { renderSeriesName } from '../modules/config'
import AuditStudentInfo from './AuditStudentInfo'
import ContractRefundTable from './ContractRefundTable'

export default {
  name: 'AuditContentRefund',

  components: {
    AuditStudentInfo,
    ContractRefundTable,
  },

  props: {
    data: {
      type: Object,
      required: true,
    },
  },

  data: () => ({
    refundCol: [
      {
        title: '审批编号',
        key: 'contract_number',
        align: 'center',
      },
      {
        title: '签约审批编号',
        key: 'original_contract_number',
        align: 'center',
      },
      {
        title: '产品名称',
        key: 'product_name',
        align: 'center',
        render: renderSeriesName('product_name'),
      },
      {
        title: '总课时',
        key: 'course_total',
        align: 'center',
      },
      {
        title: '签约审批总额',
        key: 'original_money',
        align: 'center',
      },
      {
        title: '审批总额',
        key: 'money',
        align: 'center',
      },
    ],
  }),
}
</script>

<style lang="less">
.audit-content-contract {

  &__audit-info {
    margin-top: 15px !important;

    & .ivu-table-wrapper {
      margin-top: 20px !important;
    }
  }
}
</style>
