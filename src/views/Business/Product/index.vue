<template>
  <div class="product">
    <!-- 顶部搜索 -->
    <Form
      v-if="preConfig"
      class="app-search-form"
    >
      <!-- 关键字检索 -->
      <Form-item>
        <Input
          placeholder="搜索关键字"
          v-model="likeValue"
          style="width: calc(7em + 200px);"
        >
          <Select
            v-model="likeKey"
            slot="prepend"
            style="width: 7em"
          >
            <Option
              v-for="likeKey in likeKeys"
              :key="likeKey.field_name"
              :value="likeKey.field_name"
            >
              {{ likeKey.display_name }}
            </Option>
          </Select>
        </Input>
      </Form-item>
      <!-- 学科搜索 -->
      <Form-item>
        <Select
          v-model="query['equal[grade_range_subject_id]']"
          placeholder="选择学科"
          style="width: 150px;"
        >
          <Option value="">全部学科</Option>
          <Option
            v-for="item in preConfig.grade_range_subject_id"
            :value="item.id"
            :key="item.id"
          >
            {{item.display_name}}
          </Option>
        </Select>
      </Form-item>
      <!-- 运营类型 -->
      <Form-item>
        <Select
          v-model="query['equal[sale_type]']"
          placeholder="运营类型"
          style="width: 150px;"
        >
          <Option value="">全部类型</Option>
          <Option
            v-for="item in preConfig.sale_type"
            :value="item.value"
            :key="item.value"
          >
            {{item.display_name}}
          </Option>
        </Select>
      </Form-item>
      <!-- 销售状态 -->
      <Form-item>
        <Select
          v-model="query['equal[sale_status]']"
          placeholder="销售状态"
          style="width: 150px;"
        >
          <Option value="">全部状态</Option>
          <Option
            v-for="item in preConfig.sale_type"
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

    <div class="app-content-topbar">
      <h2>产品管理</h2>
      <Button
        type="primary"
        @click="toCreate()"
      >添加产品</Button>
    </div>

    <!-- 列表展示 -->
    <Table border
      :columns="colConfig"
      :data="buffer.data"
      @on-sort-change="sort"
    ></Table>

    <!-- 分页插件 -->
    <app-pager
      @on-change="goTo"
      @on-page-size-change="pageSizeChange"
      :data="buffer"
     ></app-pager>

    <!--删除提醒框-->
    <app-warn-modal
      v-model="warn.show"
      :title="warn.title"
      :loading="warn.loading"
      @on-ok="doDelete()"
    >
      <p>删除该条记录后将无法再恢复，是否继续删除？</p>
    </app-warn-modal>
  </div>
</template>

<script>
/**
 * 业务管理 - 产品管理
 *
 * @author huojinzhao
 */

import Http from '@/utils/http'
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
      preConfig: null,
    }
  },

  computed: {
    buffer() {
      return list_decode(this.$store.state.business.buffer.product)
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
  beforeRouteEnter(to, from, next) {
    Http.get('/product/index_before')
      .then(({ search_fields, ...args }) => {
        next((vm) => {
          // eslint-disable-next-line
          vm.likeKeys = search_fields
          // eslint-disable-next-line
          vm.preConfig = { ...args }
        })
      })
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
