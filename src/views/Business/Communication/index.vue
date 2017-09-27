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
      <h2>沟通记录</h2>
      <Button type="primary" @click="toCreate()">添加记录</Button>
      <Button type="primary">导入记录</Button>
      <Button type="primary" icon="archive">下载导入模板</Button>
    </Row>

    <Table border
      v-if="buffer"
      :columns="colConfig"
      :data="buffer.data"
      @on-sort-change="sort"
    ></Table>

    <app-pager
      :data="buffer"
      @on-change="goTo"
      @on-page-size-change="pageSizeChange"
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
  </main>
</template>

<script>
/**
 * 业务管理 - 沟通记录
 *
 * @author huojinzhao
 */

import { mapState } from 'vuex'
import { list } from '@/mixins'
import { GLOBAL, BUSINESS } from '@/store/mutationTypes'
import { colConfig, searchConfig } from './modules/config'


export default {
  name: 'business-communication',

  mixins: [list],

  data() {
    return {
      // 搜索配置
      ...searchConfig(),

      // 删除警告对话框数据
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
    ...mapState({
      buffer: state => state.business.buffer.communication,
    }),
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

  // 根据当前路由进行初始化
  created() {
    this.getPreconfig()
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

</style>
