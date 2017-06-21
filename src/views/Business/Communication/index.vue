<template>
  <main class="communication">
    <Form class="app-search-form">
      <Form-item label="沟通日期">
        <Date-picker class="communication__form-date" placeholder="开始日期"></Date-picker>
      </Form-item>
      <Form-item label="至">
        <Date-picker class="communication__form-date" placeholder="结束日期"></Date-picker>
      </Form-item>
      <Form-item label="内容查找">
        <Input class="communication__form-keyword" placeholder="请输入关键字"></Input>
      </Form-item>
      <Form-item label="当前状态">
        <Select placeholder="当前状态选择">
          <Option value="1">未签约</Option>
          <Option value="2">已结课</Option>
          <Option value="3">已休学</Option>
          <Option value="4">已签约</Option>
        </Select>
      </Form-item>
      <Form-item style="float: right; margin: 0;">
        <Button type="primary">查询搜索</Button>
      </Form-item>
    </Form>
  
    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
      <h2>沟通记录</h2>
      </Col>
      <Col>
      <Button type="primary" icon="archive">下载导入模板</Button>
      <Button type="primary">导入记录</Button>
      <Button type="primary" @click="toCreate()">添加记录</Button>
      </Col>
    </Row>
  
    <Table v-if="buffer" size="small" :columns="colConfig" :data="buffer.data" stripe></Table>
  
    <app-pager :data="buffer" @on-change="pageTo" @on-page-size-change="pagesizeTo"></app-pager>
  </main>
</template>

<script>
/**
 * 业务管理 - 沟通记录
 * @author hjz
 * @version 2017-06-06
 */
import { mapState } from 'vuex'
import { GLOBAL, BUSINESS } from '@/store/mutationTypes'
import { colConfig } from './modules/config'


export default {
  name: 'business-communication',

  data() {
    return {
      colConfig: colConfig(this),
    }
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
      this.$router.push('/business/communication/edit')
    },
    toUpdate(row) {
      this.$router.push(`/business/communication/edit/${row.id}`)
    },
    toDelete(row) {
      this.$store.dispatch(BUSINESS.EDIT.DELETE, row.id)
    },
  },

  computed: {
    ...mapState({
      buffer: state => state.business.buffer.communication,
    }),
  },
  // 根据当前路由进行初始化
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
.communication {

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
