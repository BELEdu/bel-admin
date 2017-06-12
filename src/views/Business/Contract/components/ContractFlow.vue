<template>
  <main class="app-form-entire contract-detail">
    <app-editor-title></app-editor-title>
  
    <Card :bordered="false" dis-hover>
      <h4 slot="title">审批进度</h4>
      <Steps class="steps-fix" :current="0">
        <Step title="" content="咨询师张飞"></Step>
        <Step title="" content="咨询主任关羽"></Step>
        <Step title="" content="校长刘备"></Step>
        <Step title="" content="结束"></Step>
      </Steps>
    </Card>
  
    <Card class="contract-detail__info" :bordered="false" dis-hover>
      <h4 slot="title">审批内容</h4>
      <Row type="flex" justify="space-between">
        <Col class="contract-detail__info-student">
        <span>校区：厦门思明校区</span>
        <span>学员：李四</span>
        <span>学员编号：1025422545</span>
        <span>预览合同</span>
        </Col>
        <Col>
        <Button type="primary" size="small">下载合同</Button>
        <Button type="primary" size="small">预览合同</Button>
        </Col>
      </Row>
      <Table :columns="contractCol" :data="contractData"></Table>
      <Table :columns="checkCol" :data="checkData"></Table>
    </Card>
  
    <Card class="contract-detail__opinion" :bordered="false" dis-hover>
      <h4 slot="title">审批意见</h4>
      <Form>
        <Form-item>
          <Input type="textarea" :rows="5"></Input>
        </Form-item>
        <Form-item>
          <Button type="primary">同意</Button>
          <Button type="success">保存</Button>
          <Button type="error">驳回</Button>
        </Form-item>
      </Form>
    </Card>
  
    <Card :bordered="false" dis-hover>
      <h4 slot="title">审批历史</h4>
      <Table :columns="hisCol" :data="hisData"></Table>
    </Card>
  </main>
</template>

<script>
/**
 * 合同审批 - 审批流程
 * @author hjz
 * @version 2017-06-08
 */
import { GLOBAL } from '@/store/mutationTypes'

export default {
  name: 'ContractFlow',

  data: () => ({
    contractCol: [
      { title: '审批编号', key: 1, align: 'center', width: 110 },
      { title: '合同编号', key: 2, align: 'center', width: 110 },
      { title: '合同名称', key: 3, align: 'center', width: 200 },
      { title: '产品名称', key: 4, align: 'center', width: 250 },
      { title: '总课时', key: 5, align: 'center' },
      { title: '优惠金额', key: 6, align: 'center' },
      { title: '合同总金额', key: 7, align: 'center' },
    ],
    contractData: [
      {
        1: 'CHSP00120170522001',
        2: 'JYXT001201704001',
        3: '李四一对一试听辅导协议',
        4: '个性化一对一教学、一次性服务费',
        5: '35',
        6: '￥300',
        7: '￥5600',
      },
    ],
    checkCol: [
      { title: '产品编号', key: 1, align: 'center' },
      { title: '产品名称', key: 2, align: 'center' },
      { title: '产品分类', key: 3, align: 'center' },
      { title: '产品子分类', key: 4, align: 'center' },
      { title: '课时长（分钟）', key: 5, align: 'center', width: 120 },
      { title: '产品单价', key: 6, align: 'center' },
      { title: '购买数量', key: 7, align: 'center' },
      { title: '优惠比例', key: 8, align: 'center' },
      { title: '产品总金额', key: 9, align: 'center' },
    ],
    checkData: new Array(3).fill({
      1: 'C1001201705001',
      2: '个性化一对一教学',
      3: '一对一教学',
      4: '个性化一对一教学',
      5: '120',
      6: '￥200',
      7: '30',
      8: '10%',
      9: '￥5400',
    }),
    hisCol: [
      { title: '审批人', key: 1, align: 'center' },
      { title: '审批人岗位', key: 2, align: 'center' },
      { title: '审批结果', key: 3, align: 'center' },
      { title: '审批意见', key: 4, align: 'center' },
      { title: '审批时间', key: 5, align: 'center' },
    ],
    hisData: new Array(3).fill({
      1: '张飞',
      2: '咨询师',
      3: '申请',
      4: '请审批',
      5: '2017-04-20 17:25',
    }),
  }),

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">
.contract-detail {

  &__info {
    margin-top: 20px !important;

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

    & button {
      margin-top: 0 !important;
    }
  }

  // & .ivu-steps {
  //   display: flex !important;
  //   justify-content: center !important;
  //   margin-top: 20px !important;

  //   & .ivu-steps-item:last-child {
  //     width: auto !important;
  //   }
  // }
}
</style>
