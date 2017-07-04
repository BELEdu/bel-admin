<template>
  <div class="contract">
    <Form class="app-search-form">
      <Form-item label="来访日期">
        <Date-picker class="contract__form-date" placeholder="开始日期"></Date-picker>
      </Form-item>
      <Form-item label="至">
        <Date-picker class="contract__form-date" placeholder="结束日期"></Date-picker>
      </Form-item>
      <Form-item label="内容查找">
        <Input class="contract__form-keyword" placeholder="请输入关键字"></Input>
      </Form-item>
      <Form-item label="仅显示审批" class="ivu-switch-fix">
        <i-switch size="large">
          <span slot="open">审批</span>
          <span slot="close">全部</span>
        </i-switch>
      </Form-item>
      <Form-item>
        <Button type="primary">查询搜索</Button>
      </Form-item>
    </Form>
  
    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
      <h2 icon="">合同审批</h2>
      </Col>
      <Col>
      <Button type="primary" @click="toCreate()">添加审批</Button>
      </Col>
    </Row>
  
    <Table :columns="colConfig" :data="buffer.data" border></Table>
  
    <app-pager @on-change="pageTo" @on-page-size-change="pagesizeTo" :data="buffer"></app-pager>
  </div>
</template>

<script>
/**
 * 业务管理 - 合同审批
 * @author hjz
 * @version 2017-06-06
 */
import { mapState } from 'vuex'
import { GLOBAL, BUSINESS } from '@/store/mutationTypes'
import { colConfig } from './modules/config'

export default {
  name: 'business-contract',

  data() {
    return {
      colConfig: colConfig(this),
    }
  },

  computed: {
    ...mapState({
      buffer: state => state.business.buffer.contract,
    }),
  },

  methods: {
    pageTo(page) {
      const per_page = this.buffer.per_page
      this.$router.push({ path: this.$route.path, query: { page, per_page } })
    },
    pagesizeTo(per_page) {
      this.$router.push({ path: this.$route.path, query: { page: 1, per_page } })
    },
    // 创建合同跳转
    toCreate() {
      this.$router.push('/business/contract/edit')
    },
    // 合同进度跳转
    toCheck(row) {
      this.$router.push(`/business/contract/audit/${row.id}`)
    },
  },

  created() {
    this.$store.dispatch(BUSINESS.PAGE.INIT, this.$route)
      .then(() => this.$store.commit(GLOBAL.LOADING.HIDE))
  },

  beforeRouteUpdate(to, from, next) {
    this.$store.dispatch(BUSINESS.PAGE.INIT, to)
      .then(() => { this.$store.commit(GLOBAL.LOADING.HIDE); next() })
  },

}
</script>

<style lang="less">
.contract {

  & .ivu-form-item {
    display: inline-block;

    &:first-child {
      margin-right: 7px;
    }
  }

  & .ivu-form-item-label {
    font-size: 14px;
  }

  & .ivu-form-item-content {
    display: inline-block;
  }

  &__form-keyword {
    width: 200px;
  }

  &__form-date {
    width: 150px;
  }
}

.app-search-form {

  &>.ivu-form-item {

    &:last-child {
      float: right;
      margin-right: 0;
    }
  }
}
</style>
