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
            v-for="item in preConfig.sale_status"
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
      :data="tableInfo.data"
      @on-sort-change="sort"
    ></Table>

    <!-- 分页插件 -->
    <app-pager
      @on-change="goTo"
      @on-page-size-change="pageSizeChange"
      :data="tableInfo"
     ></app-pager>
  </div>
</template>

<script>
/**
 * 业务管理 - 产品管理
 *
 * @author huojinzhao
 */

import { list, tableCommon } from '@/mixins'
import {
  colConfig,
  searchConfig,
} from './modules/config'

export default {
  name: 'BusinessProduct',

  mixins: [list, tableCommon],

  data() {
    return {
      // 搜索配置
      ...searchConfig(),

      colConfig: colConfig(this),

      preConfig: null,
    }
  },

  methods: {
    /* --- initialization --- */

    getPreconfig() {
      this.$http.get('/product/index_before')
        .then(({ search_fields, ...rest }) => {
          this.likeKeys = search_fields
          this.preConfig = { ...rest }
        })
    },

    /* --- business --- */

    toCreate() {
      this.$router.push('/business/product/edit')
    },

    toUpdate(row) {
      this.$router.push(`/business/product/edit/${row.id}`)
    },
  },

  created() {
    this.getPreconfig()
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
