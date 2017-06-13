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
        <Button type="primary" @click.stop="toQuery">查询搜索</Button>
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
    <!--<app-pager @on-change="pageTo" @on-page-size-change="pagesizeTo"
        :total="buffer.total" :page-size="buffer.last_page" :per_page="buffer.per_page">
      </app-pager>-->
    <app-pager @on-change="pageTo" @on-page-size-change="pagesizeTo"></app-pager>
  </div>
</template>

<script>
/**
 * 业务管理 - 热线登记
 * @author hjz
 * @version 2017-06-06
 */

/**
 * @version 2017-06-08
 * @todo 根据后端口完成组件
 * 1. 根据api查询字段绑定字段 queryBuilder
 * 2. 在created完成store init，然后在computed中取回
 * 3. 完成根据分页行为更新store数据
 * 4. 删除操作 { 字段名称; 字段值; }
 * 5. 新增 & 添加 操作
 */

import { mapState } from 'vuex'
// eslint-disable-next-line
import { GLOBAL, BIZ } from '@/store/mutationTypes'
// import fdata from './fdata'
import fcolConfig from './fcolConfig'


export default {
  name: 'biz-hotline',

  data() {
    return {
      // @param {type: Obect} queryBuilder 查询条件字段对象
      fcol: fcolConfig,
      // fdata,
    }
  },

  computed: {
    ...mapState({
      buffer: state => state.biz.buffer,
    }),
  },

  methods: {
    toCreate() {
      this.$router.push('/business/hotline/edit')
    },
    // @params 根据后端api数据决定，应该是id
    toUpdate() {
      this.$router.push('/business/hotline/edit/5')
    },
    toQuery() {
      // 条件搜索操作, 将querybuilder传入store处理
      // 如果放在mixins里面querybuilder的结构可以是{ api; data(可能包括非表单，但是必须标识字段); }
    },
    // @params 和查询需求参数相同
    toDelete() {
      // 删除字段，取标识传入store
    },
    pageTo(page) {
      // buffer目前取不到，先注释
      // const per_page = this.buffer.per_page
      // this.$router.replace({ path: this.$route.path, query: { current_page, per_page } })
      this.$router.push({ path: this.$route.path, query: { page, per_page: 10 } })
      // this.$router.push(`/business/hotline?page=${page}&per_page=10`)
    },
    pagesizeTo(per_page) {
      this.$router.replace({ path: this.$route.path, query: { page: 1, per_page } })
    },
  },

  beforeRouteUpdate(to, from, next) {
    // 看怎么定后端路由，如果是 /business/hotlineedit 可以直接使用
    // 如果是/business/hotline/edit 就需要做if过滤：
    // if(to.path.split('/').length === 2)
    // 执行下面方法
    this.$store.dispatch(BIZ.INIT, to)
      .then(() => { this.$store.commit(GLOBAL.LOADING.HIDE); next() })
  },

  created() {
    this.$store.dispatch(BIZ.INIT, this.$route)
      .then(() => this.$store.commit(GLOBAL.LOADING.HIDE))
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
