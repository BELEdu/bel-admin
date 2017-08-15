<template>
  <main class="communication">
    <!-- 顶部搜索 -->
    <Form class="app-search-form">
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
          v-model="query['between[first_communication_at]']"
          format="yyyy-MM-dd" type="daterange" placement="bottom-start"
          placeholder="首次沟通日期范围" style="width: 200px"
          :editable="false"
        >
        </Date-picker>
      </Form-item>
      <!-- 选择当前状态 -->
      <Form-item>
        <Select
          v-model="query['equal[student_current_status]']"
          placeholder="选择当前状态"
          style="width: 150px;"
        >
          <Option
            v-for="item in student_current_status"
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
          placeholder="选择类型"
          style="width: 150px;"
        >
          <Option
            v-for="item in communication_type"
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
      <h2>沟通记录</h2>
      </Col>
      <Col>
      <Button type="primary" icon="archive">下载导入模板</Button>
      <Button type="primary">导入记录</Button>
      <Button type="primary" @click="toCreate()">添加记录</Button>
      </Col>
    </Row>

    <Table v-if="buffer" border
      :columns="colConfig"
       :data="buffer.data"
      @on-sort-change="sort"></Table>

    <app-pager :data="buffer" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>

    <!--删除提醒框-->
    <app-warn-modal v-model="warn.show" :title="warn.title" :loading="warn.loading" @on-ok="doDelete()">
      <p>删除该条记录后将无法再恢复，是否继续删除？</p>
    </app-warn-modal>
  </main>
</template>

<script>
/**
 * 业务管理 - 沟通记录
 * @author hjz
 * @version 2017-06-06
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
    }
  },

  computed: {
    ...mapState({
      buffer: state => state.business.buffer.communication,
      student_current_status: state => state.dicts.student_current_status,
      communication_type: state => state.dicts.communication_type,
    }),
  },

  methods: {
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

.communication {

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
