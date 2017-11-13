<template>
  <div class="contract-refund-table">
    <Table
      border
      size="small"
      :columns="refundColConfig"
      :data="data"
    >
      <div slot="footer">
        <span>￥{{totalSpend}}</span>
        <span>总扣除金额</span>
      </div>
    </Table>
    <dl>
      <dt>说明：</dt>
      <dd>每个产品的扣除金额 = 每课时单价*已消耗数量；</dd>
      <dd>审批总额 =  -（签约审批总额 - 总扣除金额）；</dd>
    </dl>
  </div>
</template>

<script>
/**
 * 合同审批 - 审批信息 - 退费信息列表
 *
 * @author huojinzhao
 * @desc 供 AuditContentRefund、ContractRefund 使用
 */

export default {
  name: 'ContractRefundTable',

  props: {
    data: {
      type: Array,
      required: true,
    },
  },

  data: () => ({
    refundColConfig: [
      {
        key: 'product_number',
        title: '产品编号',
        align: 'center',
        width: 150,
      },
      {
        key: 'product_name',
        title: '产品名称',
        align: 'center',
        width: 260,
      },
      {
        key: 'original_price',
        title: '每课时单价',
        align: 'center',
      },
      {
        key: 'total',
        title: '购买数量',
        align: 'center',
      },
      {
        key: 'used',
        title: '已消耗数量',
        align: 'center',
      },
      {
        key: 'refund_number',
        title: '退订数量',
        align: 'center',
      },
      {
        key: 'spend',
        title: '扣除金额',
        align: 'center',
        width: 100,
      },
    ],
  }),

  computed: {
    totalSpend() {
      return this.data.reduce((acc, product) => acc + product.spend, 0)
    },
  },
}
</script>

<style lang="less">
@import '~vars';

.contract-refund-table {

  & .ivu-table-footer {
    height: 40px;
    line-height: 40px;

    & span {
      display: block;
      line-height: 40px;
      text-align: center;
    }

    & span:first-child {
      float: right;
      border-left: 1px solid @border-color-base;
      width: 101px;
    }

    & span:last-child {
      overflow: hidden;
    }
  }

  & dl {
    margin-top: 5px;

    & > dt {
      float: left;
      font-size: 12px;
    }

    & > dd {
      font-size: 12px;
    }

    & > dd:last-child {
     padding-left: 3em;
    }
  }
}
</style>
