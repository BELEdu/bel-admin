<template>
  <div class="contract">
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
          v-model="query.between.apply_time"
          format="yyyy-MM-dd" type="daterange" placement="bottom-start"
          placeholder="申请日期范围" style="width: 200px"
          :editable="false"
        >
        </Date-picker>
      </Form-item>
      <!-- 特殊字段搜索 -->
      <!--<Form-item>
        <Select
          v-model="query.equal.subject_id"
          placeholder="选择学科"
          style="width: 150px;"
        >
          <Option
            v-for="item in subject"
            :value="item.value"
          >
            {{item.display_name}}
          </Option>
        </Select>
      </Form-item>-->
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
      <h2 icon="">
        <svg class="svg-icon" width="15px" height="15px" viewBox="0 0 200 200">
          <path d="M39.301,45.091h104.158v11.541H39.301V45.091z M183.74,156.492c0.673-0.771,1.294-1.735,1.865-2.858
            c0.57-1.116,0.396-2.134-0.497-3.028l-1.614-1.689c-0.845-0.895-1.392-1.389-1.616-1.516c-1.144-0.77-2.211-0.893-3.229-0.323
            c-1.02,0.546-2.037,1.342-3.056,2.36c-2.609,2.584-5.167,5.094-7.726,7.576c-2.533,2.461-4.941,4.821-7.205,7.059
            c-0.793,0.793-1.689,1.267-2.632,1.438c-0.97,0.147-1.741-0.146-2.311-0.944l-1.592-1.663c-0.743-0.797-1.515-1.64-2.309-2.531
            l-2.285-2.612c-0.747-0.845-1.267-1.442-1.618-1.761c-0.669-0.573-1.439-0.923-2.282-1.095c-0.845-0.177-1.741,0.122-2.634,0.919
            l-0.845,0.77c-0.472,0.372-0.918,0.818-1.367,1.343c-0.446,0.497-0.893,0.942-1.364,1.341l-0.845,0.744
            c-1.69,1.815-1.468,3.877,0.696,6.233c0.668,0.797,1.563,1.77,2.705,2.958c1.119,1.167,2.311,2.435,3.552,3.777
            c1.266,1.341,2.508,2.657,3.752,3.95c1.24,1.29,2.311,2.333,3.23,3.106c0.894,0.916,2.137,1.314,3.725,1.266
            c1.59-0.049,2.784-0.521,3.555-1.418c1.587-1.465,3.404-3.229,5.441-5.314c2.034-2.062,4.172-4.176,6.357-6.311
            c2.209-2.111,4.37-4.224,6.458-6.31C180.14,159.896,182.053,158.057,183.74,156.492L183.74,156.492z M160.661,122.684
            c5.095,0,9.889,0.967,14.41,2.931c4.546,1.962,8.496,4.644,11.901,7.998c3.376,3.355,6.084,7.306,8.047,11.775
            c1.99,4.496,2.98,9.266,2.98,14.31c0,5.168-0.99,9.988-2.98,14.461c-1.962,4.492-4.671,8.418-8.047,11.799
            c-3.405,3.353-7.355,5.984-11.901,7.898c-4.521,1.917-9.315,2.859-14.41,2.859c-5.217,0-10.085-0.942-14.606-2.859
            c-4.52-1.914-8.496-4.546-11.873-7.898c-3.405-3.381-6.085-7.307-8.074-11.799c-1.99-4.473-2.982-9.293-2.982-14.461
            c0-5.044,0.992-9.813,2.982-14.31c1.989-4.47,4.669-8.42,8.074-11.775c3.377-3.354,7.354-6.034,11.873-7.998
            C150.576,123.65,155.444,122.684,160.661,122.684z M39.301,68.269h104.158v11.54H39.301V68.269L39.301,68.269z M27.665,33.456
            h12.198h98.905h16.325v57.991H27.665V33.456z M4.488,173.367c0,5.908,5.348,10.697,11.636,10.697h106.641
            c-4.535-7.022-7.171-15.387-7.171-24.366c0-24.832,20.136-44.969,44.967-44.969c6.291,0,12.275,1.294,17.711,3.625V91.447h-11.637
            V21.914V10.37H16.124v11.544v69.532H4.488V173.367L4.488,173.367z"/>
        </svg>
        合同审批
      </h2>
      </Col>
      <Col>
      <Button type="primary" @click="toCreate()">添加审批</Button>
      </Col>
    </Row>

    <Table :columns="colConfig" :data="buffer.data" border></Table>

    <app-pager @on-change="goTo" @on-page-size-change="pageSizeChange" :data="buffer"></app-pager>
  </div>
</template>

<script>
/**
 * 业务管理 - 合同审批
 * @author hjz
 * @version 2017-06-06
 */
import { mapState } from 'vuex'
import { list } from '@/mixins'
import { GLOBAL, BUSINESS } from '@/store/mutationTypes'
import { colConfig, searchConfig } from './modules/config'

export default {
  name: 'business-contract',

  mixins: [list],

  data() {
    return {
      // 搜索配置
      ...searchConfig(),
      colConfig: colConfig(this),
    }
  },

  computed: {
    ...mapState({
      buffer: state => state.business.buffer.contract,
    }),
  },

  methods: {
    // 创建合同跳转
    toCreate() {
      this.$router.push('/business/contract/edit')
    },
    // 查看合同进度
    toCheck(row) {
      this.$router.push(`/business/contract/audit/${row.id}`)
    },
    // 退费
    // eslint-disable-next-line
    toRefund(row) {
      this.$router.push('/business/contract/refund/1')
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

.contract {

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
