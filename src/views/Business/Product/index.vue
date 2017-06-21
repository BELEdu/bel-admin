<template>
  <div class="hotline">
    <Form class="app-search-form">
      <Form-item label="来访日期">
        <Date-picker class="hotline__form-date" placeholder="开始日期"></Date-picker>
      </Form-item>
      <Form-item label="至">
        <Date-picker class="hotline__form-date" placeholder="结束日期"></Date-picker>
      </Form-item>
      <Form-item label="内容查找">
        <Input class="hotline__form-keyword" placeholder="请输入关键字"></Input>
      </Form-item>
      <Form-item>
        <Checkbox></Checkbox>
        <span style="font-size: 14px;">不显示停售</span>
      </Form-item>
      <Form-item style="float: right; margin: 0;">
        <Button type="primary">查询搜索</Button>
      </Form-item>
    </Form>
  
    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
      <h2 icon="">产品管理</h2>
      </Col>
      <Col>
      <Button type="primary" @click="toCreate()">添加产品</Button>
      </Col>
    </Row>
  
    <!-- 列表展示 -->
    <Table size="small" :columns="colConfig" :data="buffer.data" stripe></Table>
  
    <!-- 分页插件 -->
    <app-pager @on-change="pageTo" @on-page-size-change="pagesizeTo" :data="buffer"></app-pager>
  </div>
</template>

<script>
/**
 * 业务管理 - 产品管理
 * @author hjz
 * @version 2017-06-06
 */
import { GLOBAL, BUSINESS } from '@/store/mutationTypes'
import { colConfig, list_decode } from './modules/config'

export default {
  name: 'business-hotline',

  data() {
    return {
      colConfig: colConfig(this),
    }
  },

  computed: {
    buffer() {
      return list_decode(this.$store.state.business.buffer.product)
    },
  },

  methods: {
    pageTo(page) {
      const per_page = this.buffer.per_page
      this.$router.push({ path: this.$route.path, query: { page, per_page } })
    },
    pagesizeTo(per_page) {
      this.$router.push({ path: this.$route.path, query: { page: 1, per_page } })
    },
    toCreate() {
      this.$router.push('/business/product/edit')
    },
    toUpdate(row) {
      this.$router.push(`/business/product/edit/${row.id}`)
    },
    toDelete(row) {
      this.$store.dispatch(BUSINESS.EDIT.DELETE, row.id)
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
.hotline {

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
</style>
