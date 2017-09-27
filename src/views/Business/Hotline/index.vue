<template>
  <div class="hotline">
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
      <!-- 日期范围搜索 -->
      <Form-item>
        <Date-picker
          v-model="query['between[visited_at]']"
          format="yyyy-MM-dd"
          type="daterange"
          placement="bottom-start"
          placeholder="来访日期范围"
          style="width: 200px"
          :editable="false"
        >
        </Date-picker>
      </Form-item>
      <!-- 当前状态搜索 -->
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
      <!-- 报班意向搜索 -->
      <Form-item>
        <Select
          v-model="query['equal[apply_course_intention]']"
          placeholder="报班意向"
          style="width: 150px;"
        >
          <Option value="">全部意向</Option>
          <Option
            v-for="item in preConfig.apply_course_intention"
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
      <h2>热线登记</h2>
      <Button
        type="primary"
        @click="toCreate()"
      >添加热线</Button>
      <Button type="primary">导入热线</Button>
    </div>

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
 * 业务管理 - 热线登记
 *
 * @author huojinzhao
 */

import { mapState } from 'vuex'
import { list } from '@/mixins'
import { GLOBAL, BUSINESS } from '@/store/mutationTypes'
import { colConfig, searchConfig } from './modules/config'

export default {
  name: 'business-hotline',

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

      colConfig: colConfig(this),

      preConfig: null,
    }
  },

  computed: {
    ...mapState({
      buffer: state => state.business.buffer.hotline,
      student_current_status: state => state.dicts.student_current_status,
    }),
  },

  methods: {
    /* --- initialization --- */

    getPreconfig() {
      this.$http.get('/hotline/index_before')
        .then(({ search_fields, ...rest }) => {
          this.likeKeys = [...search_fields]
          this.preConfig = { ...rest }
        })
    },

    /* --- business --- */

    // 进入新增编辑路由页，例子：/business/hotline/edit
    toCreate() {
      this.$router.push('/business/hotline/edit')
    },

    // 进入修改路由，例子：/business/hotline/edit/:id
    // row为createButton方法传入的参数，写死
    toUpdate(row) {
      this.$router.push(`/business/hotline/edit/${row.id}`)
    },

    // 删除某一列表项
    toDelete(row) {
      // this.$store.dispatch(BUSINESS.EDIT.DELETE, row.id)
      this.warn.loading = false
      this.warn.show = true
      this.warn.row = row
    },

    doDelete() {
      this.warn.loading = true
      this.$store.dispatch(BUSINESS.EDIT.DELETE, this.warn.row.id)
        .then(() => {
          this.warn.show = false
        })
    },
  },

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
