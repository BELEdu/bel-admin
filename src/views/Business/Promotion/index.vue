<template>
  <div class="business-promotion">
    <!-- 顶部搜索 -->
    <Form
      v-if="preConfig"
      class="app-search-form  app-search-form-layout"
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
      <!-- 优惠类型 -->
      <Form-item>
        <Select
          v-model="query['equal[promotion_type]']"
          placeholder="优惠类型"
          style="width: 150px;"
        >
          <Option value="">全部类型</Option>
          <Option
            v-for="item in preConfig.promotion_type"
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
      <h2>优惠活动列表</h2>
      <Button
        type="primary"
        @click="toCreate()"
      >添加优惠活动</Button>
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
 * 业务管理 - 优惠活动
 *
 * @author huojinzhao
 */

import Http from '@/utils/http'
import { list } from '@/mixins'
import { colConfig, searchConfig } from './modules/config'

export default {
  name: 'business-promotion',

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

      // before数据
      preConfig: null,

      // 列表数据
      buffer: {},
    }
  },

  methods: {
    /* --- initialization --- */

    getData(queryUrl) {
      const url = queryUrl
        ? `/promotion?${queryUrl}`
        : '/promotion'
      return this.$http.get(url)
        .then((res) => {
          // this.buffer = this.listDecode(res)
          this.buffer = res
        })
    },

    /* --- Assitance --- */

    listDecode(buffer) {
      const data = buffer.data.map((item) => {
        const validity_period = `
          ${item.start_at.splice(0, 10)}
          -
          ${item.end_at.splice(0, 10)}
        `
        return { ...item, ...{ validity_period } }
      })
      return { ...buffer, ...{ data } }
    },

    /* --- bussiness --- */

    toCreate() {
      this.$router.push('/business/product/edit')
    },

    toUpdate(row) {
      this.$router.push(`/business/product/edit/${row.id}`)
    },

    /* deletion */

    toDelete(row) {
      this.warn.loading = false
      this.warn.show = true
      this.warn.row = row
    },

    doDelete() {
      this.warn.loading = true
      this.$http.delete(`/promotion/${this.warn.row.id}`)
        .then(() => {
          this.buffer.data = this.buffer.data
            .filter(item => item.id !== this.warn.row.id)
        })
        .then(() => {
          this.warn.show = false
        })
    },
  },

  beforeRouteEnter(to, from, next) {
    Http.get('/promotion/index_before')
      .then(({ search_fields, ...args }) => {
        next((vm) => {
          // eslint-disable-next-line
          vm.likeKeys = search_fields
          // eslint-disable-next-line
          vm.preConfig = { ...args }
        })
      })
  },
}
</script>

<style lang="less">

</style>
