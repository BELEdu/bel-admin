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
          <Option value="4">已签约</Option>
        </Select>
      </Form-item>
      <Form-item>
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
  
    <Table :columns="colConfig" :data="buffer.data" border></Table>
    <!-- 分页插件 -->
    <app-pager @on-change="pageTo" @on-page-size-change="pagesizeTo" :data="buffer"></app-pager>
  
    <!--删除提醒框-->
    <app-warn-modal v-model="warn.show" :title="warn.title" :loading="warn.loading" @on-ok="doDelete()">
      <p>删除该条记录后将无法再恢复，是否继续删除？</p>
    </app-warn-modal>
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
import { colConfig } from './modules/config'

export default {
  name: 'business-hotline',

  data() {
    return {
      warn: {
        show: false,
        title: '确认删除',
        row: null,
        loading: false,
      },
      colConfig: colConfig(this),
    }
  },

  computed: {
    ...mapState({
      buffer: state => state.business.buffer.hotline,
    }),
  },

  methods: {
    // 进入新增编辑路由页，例子：/business/hotline/edit
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
      // this.$store.dispatch(BUSINESS.EDIT.DELETE, row.id)
      this.warn.show = true
      this.warn.row = row
    },
    doDelete() {
      this.warn.loading = true
      this.$store.dispatch(BUSINESS.EDIT.DELETE, this.warn.row.id)
        .then(() => {
          this.warn.loading = false
          this.warn.show = false
        })
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
    pageTo(page) {
      const per_page = this.buffer.per_page
      this.$router.push({ path: this.$route.path, query: { page, per_page } })
    },
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

.app-search-form {

  &>.ivu-form-item {

    &:last-child {
      float: right;
      margin-right: 0;
    }
  }
}
</style>
