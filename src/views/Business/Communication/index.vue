<template>
  <main class="communication">
    <!-- 顶部搜索 -->
    <Form
      v-if="preConfig"
      class="app-search-form app-search-form-layout"
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
      <!-- 选择当前状态 -->
      <Form-item>
        <Select
          v-model="query['equal[student_current_status]']"
          placeholder="当前状态"
          style="width: 150px;"
        >
          <Option value="">全部状态</Option>
          <Option
            v-for="item in preConfig.student_current_status"
            :value="item.value"
            :key="item.value"
          >
            {{item.display_name}}
          </Option>
        </Select>
      </Form-item>
      <!-- 选择类型 -->
      <Form-item>
        <Select
          v-model="query['equal[communication_type]']"
          placeholder="沟通类型"
          style="width: 150px;"
        >
          <Option value="">全部类型</Option>
          <Option
            v-for="item in preConfig.communication_type"
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
      <h2><Icon type="ios-paper"/> 沟通记录</h2>
      <Button type="primary" @click="toCreate()">添加记录</Button>
      <Button type="primary">导入记录</Button>
      <Button type="primary" icon="archive">下载导入模板</Button>
    </Row>

    <Table border
      v-if="tableInfo"
      :columns="colConfig"
      :data="tableInfo.data"
      @on-sort-change="sort"
    ></Table>

    <app-pager
      :data="tableInfo"
      @on-change="goTo"
      @on-page-size-change="pageSizeChange"
    ></app-pager>

    <v-record
      :visible.sync="recordModal.active"
      :logs="recordModal.data"
      :target="recordModal.id"
      @success="recordEditionSucceed"
    ></v-record>
  </main>
</template>

<script>
/**
 * 业务管理 - 沟通记录
 *
 * @author huojinzhao
 */

import { list, tableCommon } from '@/mixins'
import {
  colConfig,
  searchConfig,
} from './modules/config'
import vRecord from './components/record'


export default {
  name: 'business-communication',

  mixins: [list, tableCommon],

  components: {
    vRecord,
  },

  data() {
    return {
      // 搜索配置
      ...searchConfig(),

      // Table配置
      colConfig: colConfig(this),

      preConfig: null,

      recordModal: {
        active: false,
        id: null,
        data: [],
      },
    }
  },

  methods: {
    /* --- initialization --- */

    getPreconfig() {
      this.$http.get('/communication/index_before')
        .then(({ search_fields, ...rest }) => {
          this.likeKeys = [...search_fields]
          this.preConfig = { ...rest }
        })
    },

    /* --- business --- */

    toCreate() {
      this.$router.push('/business/communication/edit')
    },

    toUpdate(row) {
      this.$router.push(`/business/communication/edit/${row.id}`)
    },

    showRecord(row) {
      this.$http.get(`/communication/${row.id}`)
        .then(({ communication_logs: logs }) => {
          this.recordModal = {
            active: true,
            data: logs,
            id: row.id,
          }
        })
    },

    recordEditionSucceed() {
      this.fetchData()
    },
  },

  // 根据当前路由进行初始化
  created() {
    this.getPreconfig()
  },
}
</script>

<style lang="less">

</style>
