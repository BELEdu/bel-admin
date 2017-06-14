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
      <Form-item label="当前状态" class="ivu-switch-fix">
        <Select placeholder="当前状态选择">
          <Option value="1">未签约</Option>
          <Option value="2">已结课</Option>
          <Option value="3">已休学</Option>
          <Option value="3">已签约</Option>
        </Select>
      </Form-item>
      <Form-item style="float: right; margin: 0;">
        <Button type="primary" @click.stop="toFiltrate">查询搜索</Button>
      </Form-item>
    </Form>
  
    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
      <h2 icon="">热线登记</h2>
      </Col>
      <Col>
      <Button type="primary">导入热线</Button>
      <Button type="primary" @click="toCreate()">添加热线</Button>
      </Col>
    </Row>
  
    <Table size="small" :columns="fcol" :data="buffer.data" stripe></Table>
    <!-- 分页插件 -->
    <app-pager @on-change="pageTo" @on-page-size-change="pagesizeTo" :data="buffer"></app-pager>
  </div>
</template>

<script>
/**
 * 业务管理 - 热线登记
 * @author hjz
 * @version 2017-06-06
 */

import { mapState } from 'vuex'
import { GLOBAL, BUSINESS } from '@/store/mutationTypes'
import fcolConfig from './fcolConfig'

export default {
  name: 'business-hotline',

  data() {
    return {
      // @param {type: Obect} searchOptions 查询条件字段对象
      fcol: fcolConfig(this),
    }
  },

  computed: {
    // 分页数据，包含后端返回的完整信息
    // 1. 绑定到Table组件 :data="buffer.data"
    // 2. 绑定到app-pager组件 :data="buffer"
    ...mapState({
      buffer: state => state.server.buffer,
    }),
  },

  methods: {
    // 进入新增路由，例子：/business/hotline/edit
    toCreate() {
      this.$router.push('/business/hotline/edit')
    },
    // 进入修改路由，例子：/business/hotline/edit/:id
    // row为createButton方法传入的参数，写死
    toUpdate(row) {
      this.$router.push(`/business/hotline/edit/${row.id}`)
    },
    // 删除某一列表项
    toDelete(row) {
      this.$store.dispatch(BUSINESS.EDIT.DELETE, row.id)
    },
    toFiltrate() {
      // 封装一个公共方法formEncoded(obj)，将对象转化成键值对字符串
      // const query = {
      //   ...this.$route.query,
      //   // 查询条件对象
      //   ...this.searchOptions,
      // }
      // this.$router.push(`/business/hotline/edit?${formEncoded(query)}`)
    },
    // 绑定到app-pager组件 @on-change="pageTo"
    pageTo(page) {
      const per_page = this.buffer.per_page
      this.$router.push({ path: this.$route.path, query: { page, per_page } })
    },
    // 绑定到app-pager组件 @on-page-size-change="pagesizeTo"
    pagesizeTo(per_page) {
      this.$router.push({ path: this.$route.path, query: { page: 1, per_page } })
    },
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
.hotline {
  position: relative;

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
