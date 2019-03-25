<template>
  <div class="hotline">
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
      <!-- 日期范围搜索 -->
      <Form-item>
        <app-date-picker
          style="width:16em;"
          v-model="query['between[visited_at]']"
          format="yyyy-MM-dd"
          type="daterange"
          placeholder="来访日期范围"
          :editable="false"
        ></app-date-picker>
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
    </App-table-form>
    <!-- end 顶部搜索 -->

    <div class="app-content-topbar">
      <h2><Icon type="ios-compose"/> 热线登记</h2>
      <Button
        type="primary"
        @click="toCreate()"
      >添加热线</Button>
      <Button type="primary">导入热线</Button>
    </div>

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
 * bussiness - hotline
 *
 * @author big
 * @date 2019.3.25
 */

import { list, tableCommon } from '@/mixins'
import {
  colConfig,
  searchConfig,
} from './modules/config'

export default {
  name: 'BusinessHotline',

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
      this.$http.get('/oa/business/hotline')
        .then(({ search_fields, ...data }) => {
          console.log(search_fields)
          console.log(data)
          // this.likeKeys = [...search_fields]
          // this.preConfig = { ...rest }
        })
    },

    /* --- business --- */

    // 进入新增编辑路由页
    toCreate() {
      this.$router.push('/business/hotline/edit')
    },

    // row为createButton方法传入的参数，写死
    toUpdate(row) {
      this.$router.push(`/business/hotline/edit/${row.id}`)
    },
  },

  created() {
    this.getPreconfig()
  },
}
</script>

<style lang="less">

</style>
