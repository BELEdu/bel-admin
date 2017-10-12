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
        :columns="contractCol"
        :data="[data]"
      >
      </Table>
    </Card>

   <Card dis-hover :bordered="false">
      <h4 slot="title">产品列表</h4>
      <Table
        border
        :columns="productCol"
        :data="data.contract_product"
      ></Table>
    </Card>

    <Card
      v-if="data.contract_promotion.length"
      dis-hover
      :bordered="false"
    >
      <h4 slot="title">优惠列表</h4>
      <Table
        border
        :columns="promotionCol"
        :data="data.contract_promotion"
      ></Table>
    </Card>
  </div>
</template>

<script>
/**
 * 合同审批 - 审批信息 - 普通合同
 *
 * @author huojinzhao
 */

import { renderSeriesName } from '../modules/config'
import AuditStudentInfo from './AuditStudentInfo'

export default {
  name: 'AuditContentContract',

  components: {
    AuditStudentInfo,
  },

  props: {
    data: {
      type: Object,
      required: true,
    },
  },

  data: () => ({
    contractCol: [
      {
        title: '审批编号',
        key: 'contract_number',
        width: 120,
        align: 'center',
      },
      {
        title: '产品名称',
        align: 'center',
        width: 260,
        render: renderSeriesName('product_name'),
      },
      {
        title: '总课时',
        key: 'course_total',
        align: 'center',
      },
      {
        title: '产品总额',
        key: 'original_money',
        align: 'center',
      },
      {
        title: '优惠名称',
        align: 'center',
        width: 260,
        render: renderSeriesName('promotion_name'),
      },
      {
        title: '审批总额',
        key: 'money',
        align: 'center',
      },
    ],

    productCol: [
      {
        title: '产品编号',
        key: 'product_number',
        align: 'center',
        width: 150,
      },
      {
        title: '产品名称',
        width: 260,
        key: 'product_name',
        align: 'center',
      },
      {
        title: '每课时单价(元)',
        key: 'price',
        align: 'center',
      },
      {
        title: '购买数量',
        key: 'number',
        align: 'center',
      },
      {
        title: '运营类型',
        key: 'sale_type_name',
        align: 'center',
      },
      {
        title: '产品总额',
        key: 'money',
        align: 'center',
      },
      {
        title: '耗课单价',
        key: 'salary',
        align: 'center',
      },
    ],

    promotionCol: [
      {
        title: '优惠名称',
        key: 'promotion_name',
        align: 'center',
      },
      {
        title: '最低总额',
        key: 'enjoy_price',
        align: 'center',
      },
      {
        title: '优惠内容',
        key: 'content',
        align: 'center',
      },
      {
        title: '优惠说明',
        key: 'description',
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
