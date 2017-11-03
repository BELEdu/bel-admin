<template>
  <div class="contract">
    <!-- 顶部搜索 -->
    <Form class="app-search-form app-search-form-layout">
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
          v-model="query['between[apply_date]']"
          format="yyyy-MM-dd" type="daterange" placement="bottom-start"
          placeholder="申请日期范围"
          style="width: 200px"
          :editable="false"
        >
        </Date-picker>
      </Form-item>
      <!-- 特殊字段搜索 -->
      <Form-item>
        <Select
          v-model="query['equal[apply_status]']"
          placeholder="审批进度"
          style="width: 150px;"
        >
          <Option value="">全部进度</Option>
          <Option
            v-for="item in apply_status"
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

    <Row class="app-content-topbar">
      <h2>
        <svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="15" height="15"><path d="M39.301 45.091h104.158v11.541H39.301V45.091zM183.74 156.492c.673-.771 1.294-1.735 1.865-2.858.57-1.116.396-2.134-.497-3.028l-1.614-1.689c-.845-.895-1.392-1.389-1.616-1.516-1.144-.77-2.211-.893-3.229-.323-1.02.546-2.037 1.342-3.056 2.36a1031.88 1031.88 0 0 1-7.726 7.576 1170.097 1170.097 0 0 0-7.205 7.059c-.793.793-1.689 1.267-2.632 1.438-.97.147-1.741-.146-2.311-.944l-1.592-1.663c-.743-.797-1.515-1.64-2.309-2.531l-2.285-2.612c-.747-.845-1.267-1.442-1.618-1.761a4.97 4.97 0 0 0-2.282-1.095c-.845-.177-1.741.122-2.634.919l-.845.77a9.784 9.784 0 0 0-1.367 1.343c-.446.497-.893.942-1.364 1.341l-.845.744c-1.69 1.815-1.468 3.877.696 6.233.668.797 1.563 1.77 2.705 2.958a288.658 288.658 0 0 1 3.552 3.777c1.266 1.341 2.508 2.657 3.752 3.95 1.24 1.29 2.311 2.333 3.23 3.106.894.916 2.137 1.314 3.725 1.266 1.59-.049 2.784-.521 3.555-1.418a148.507 148.507 0 0 0 5.441-5.314 489.98 489.98 0 0 1 6.357-6.311 407.503 407.503 0 0 0 6.458-6.31 260.973 260.973 0 0 1 5.691-5.467zm-23.079-33.808c5.095 0 9.889.967 14.41 2.931a38.582 38.582 0 0 1 11.901 7.998c3.376 3.355 6.084 7.306 8.047 11.775 1.99 4.496 2.98 9.266 2.98 14.31 0 5.168-.99 9.988-2.98 14.461a38.23 38.23 0 0 1-8.047 11.799c-3.405 3.353-7.355 5.984-11.901 7.898-4.521 1.917-9.315 2.859-14.41 2.859-5.217 0-10.085-.942-14.606-2.859-4.52-1.914-8.496-4.546-11.873-7.898-3.405-3.381-6.085-7.307-8.074-11.799-1.99-4.473-2.982-9.293-2.982-14.461 0-5.044.992-9.813 2.982-14.31 1.989-4.47 4.669-8.42 8.074-11.775 3.377-3.354 7.354-6.034 11.873-7.998 4.521-1.965 9.389-2.931 14.606-2.931zM39.301 68.269h104.158v11.54H39.301v-11.54zM27.665 33.456H155.093v57.991H27.665V33.456zM4.488 173.367c0 5.908 5.348 10.697 11.636 10.697h106.641a44.765 44.765 0 0 1-7.171-24.366c0-24.832 20.136-44.969 44.967-44.969a44.823 44.823 0 0 1 17.711 3.625V91.447h-11.637V10.37H16.124v81.076H4.488v81.921z"/></svg>
        签约审批
      </h2>
      <Button type="primary" @click="toCreate()">添加审批</Button>
    </Row>

    <Table border
      :columns="colConfig"
      :data="tableInfo.data"
      @on-sort-change="sort"></Table>

    <app-pager
      :data="tableInfo"
      @on-change="goTo"
      @on-page-size-change="pageSizeChange"
    ></app-pager>
  </div>
</template>

<script>
/**
 * 业务管理 - 签约审批
 *
 * @author huojinzhao
 */
import { mapState } from 'vuex'
import { list, tableCommon } from '@/mixins'
import {
  colConfig,
  searchConfig,
} from './modules/config'

export default {
  name: 'BusinessContract',

  mixins: [list, tableCommon],

  data() {
    return {
      // 搜索配置
      ...searchConfig(),

      colConfig: colConfig(this),
    }
  },

  computed: {
    ...mapState({
      apply_status: state => state.dicts.apply_status,
    }),
  },

  methods: {
    // 创建合同跳转
    toCreate() {
      this.$router.push('contract/edit')
    },

    // 查看合同进度
    toCheck(row) {
      if (row.refund_tag) {
        this.$router.push(`contract/refund/info/${row.id}`)
      } else {
        this.$router.push(`contract/info/${row.id}`)
      }
    },

    // 合同审批
    toApprove(row) {
      if (row.refund_tag) {
        this.$router.push(`contract/refund/audit/${row.id}`)
      } else {
        this.$router.push(`contract/audit/${row.id}`)
      }
    },

    // 重新提交操作
    toRecheck(row) {
      if (row.refund_tag) {
        this.$router.push(`contract/refund/edit/${row.id}`)
      } else {
        this.$router.push(`contract/edit/${row.id}`)
      }
    },

    // 退费
    toRefund(row) {
      this.$router.push(`contract/refund/${row.id}`)
    },

    // 取消合同
    toCancel({ id }) {
      this.$Modal.confirm({
        title: '取消确认',
        content: '取消该审批后将无法重新提交，是否确认取消？',
        loading: true,
        onOk: () => this.doCancel(id),
      })
    },

    doCancel(id) {
      this.$http.post(`/contract/cancel/${id}`)
        .then(() => {
          this.$Modal.remove()
          this.fetchData()
        })
    },
  },
}
</script>

<style lang="less">

</style>
