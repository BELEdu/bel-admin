<template>
  <div class="business-promotion">
    <!-- 顶部搜索 -->
    <App-table-form v-if="preConfig" @on-submit="search">
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
    </App-table-form>
    <!-- end 顶部搜索 -->

    <div class="app-content-topbar">
      <h2><Icon type="pricetags"/> 优惠活动列表</h2>
      <Button
        type="primary"
        @click="toCreate()"
      >添加优惠活动</Button>
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

    <!-- 活动编辑 -->
    <v-promotion-edit
      :visible.sync="promotionDialog.active"
      :edition="promotionDialog.info"
      :target="promotionDialog.target"
      :readonly="promotionDialog.readonly"
      @success="editionSucceed"
    ></v-promotion-edit>
  </div>
</template>

<script>
/**
 * 业务管理 - 优惠活动
 *
 * @author huojinzhao
 */

import { list, tableCommon } from '@/mixins'
import vPromotionEdit from './components/PromotionEdit'
import {
  colConfig,
  searchConfig,
} from './modules/config'

export default {
  name: 'BusinessPromotion',

  mixins: [list, tableCommon],

  components: {
    vPromotionEdit,
  },

  data() {
    return {
      // 搜索配置
      ...searchConfig(),

      // Table配置
      colConfig: colConfig(this),

      // before数据
      preConfig: null,

      // 优惠编辑
      promotionDialog: {
        active: false,
        info: null,
        target: null,
        readonly: false,
      },
    }
  },

  methods: {
    /* --- initialization --- */

    getPreconfig() {
      this.$http.get('/promotion/index_before')
        .then(({ search_fields, ...rest }) => {
          this.likeKeys = search_fields
          this.preConfig = { ...rest }
        })
    },

    /* --- Assitance --- */

    configPromotion(
      info = null,
      target = null,
      readonly = false,
    ) {
      return { active: true, info, target, readonly }
    },

    /* --- bussiness --- */

    toCreate() {
      this.promotionDialog = this.configPromotion()
    },

    toUpdate(row) {
      this.$http.get(`/promotion/${row.id}`)
        .then((res) => {
          this.promotionDialog = this.configPromotion(res, row.id, true)
        })
    },

    editionSucceed() {
      this.fetchData()
    },
  },

  created() {
    this.getPreconfig()
  },
}
</script>

<style lang="less">

</style>
