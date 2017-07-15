<template>
  <div class="product">
    <!-- 顶部搜索 -->
    <Form class="app-search-form">
      <!-- 关键字检索 -->
      <Form-item>
        <Input
          placeholder="搜索关键字"
          v-model="query.like[likeKey]"
          style="width: calc(7em + 200px);"
        >
          <Select
            v-model="likeKey"
            slot="prepend"
            style="width: 7em"
          >
            <Option
              v-for="likeKey in likeKeys"
              :key="likeKey.value"
              :value="likeKey.value"
            >
              {{ likeKey.label }}
            </Option>
          </Select>
        </Input>
      </Form-item>
      <!-- 日期范围搜索 -->
      <Form-item>
        <Date-picker
          v-model="query.between.created_at"
          format="yyyy-MM-dd" type="daterange" placement="bottom-start"
          placeholder="创建日期范围" style="width: 200px"
          :editable="false"
        >
        </Date-picker>
      </Form-item>
      <!-- 学科搜索 -->
      <Form-item>
        <Select
          v-model="query.equal.subject_id"
          placeholder="选择学科"
          style="width: 150px;"
        >
          <!-- <Option value="1">数学</Option> -->
          <Option
            v-for="item in dicts.subject_item"
            :value="item.value"
            :key="item.value"
          >
            {{item.display_name}}
          </Option>
        </Select>
      </Form-item>
      <!-- 查询按钮 -->
      <Form-item>
        <Button type="primary" icon="ios-search" @click="search">
          搜索
        </Button>
      </Form-item>
    </Form>
    <!-- end 顶部搜索 -->

    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
      <h2 icon="">产品管理</h2>
      </Col>
      <Col>
      <Button type="primary" @click="toCreate()">添加产品</Button>
      </Col>
    </Row>

    <!-- 列表展示 -->
    <Table border
      :columns="colConfig"
      :data="buffer.data"
      @on-sort-change="sort"></Table>

    <!-- 分页插件 -->
    <app-pager @on-change="goTo" @on-page-size-change="pageSizeChange" :data="buffer"></app-pager>
    <!--删除提醒框-->
    <app-warn-modal v-model="warn.show" :title="warn.title" :loading="warn.loading" @on-ok="doDelete()">
      <p>删除该条记录后将无法再恢复，是否继续删除？</p>
    </app-warn-modal>
  </div>
</template>

<script>
/**
 * 业务管理 - 产品管理
 * @author hjz
 * @version 2017-06-06
 */

// import { mapState } from 'vuex'
import { list } from '@/mixins'
import { GLOBAL, BUSINESS } from '@/store/mutationTypes'
import { colConfig, list_decode, searchConfig } from './modules/config'

export default {
  name: 'business-product',

  mixins: [list],

  data() {
    return {
      // 搜索配置
      ...searchConfig(),
      // 删除对话框数据
      warn: {
        show: false,
        title: '确认删除',
        row: null,
        loading: false,
      },
      // Table配置
      colConfig: colConfig(this),
    }
  },

  computed: {
    buffer() {
      return list_decode(this.$store.state.business.buffer.product)
    },
    dicts() {
      const { subject_item } = this.$store.state.dicts
      return { subject_item }
    },
  },

  methods: {
    toCreate() {
      this.$router.push('/business/product/edit')
    },
    toUpdate(row) {
      this.$router.push(`/business/product/edit/${row.id}`)
    },
    // 提醒：预备删除某一列
    toDelete(row) {
      this.warn.loading = false
      this.warn.show = true
      this.warn.row = row
    },
    // 确认删除
    doDelete() {
      this.warn.loading = true
      this.$store.dispatch(BUSINESS.EDIT.DELETE, this.warn.row.id)
        .then(() => {
          this.warn.show = false
        })
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

@gutter-block: 8px;

.product {

  & .ivu-form-item {
    display: inline-block;
    margin-right: @gutter-block;
  }

  & .ivu-form-item-label {
    font-size: 14px;
  }

  & .ivu-form-item-content {
    display: inline-block;
  }
}
</style>
