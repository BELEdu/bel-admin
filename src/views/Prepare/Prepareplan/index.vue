<template>
  <div>

    <!-- 搜索 -->
    <Form inline class="app-search-form">
      <!-- 关键字 -->
      <Form-item>
        <Input v-model="likeValue" placeholder="请输入关键字">
          <Select
            v-model="likeKey"
            slot="prepend"
            style="width:6em;"
          >
            <Option
              v-for="likeKey in likeKeys"
              :key="likeKey.value"
              :value="likeKey.value"
            >{{ likeKey.label }}</Option>
          </Select>
        </Input>
      </Form-item>

      <Form-item>
        <Button type="primary" icon="ios-search" @click="search">搜索</Button>
      </Form-item>
    </Form>

    <!-- 标题 -->
    <Row class="app-content-header">
      <h2 icon="">教案管理</h2>
    </Row>
.
    <!--教案管理表格-->
    <Table
      class="app-table"
      :columns="columns"
      :data="list.data"
      border
      @on-sort-change="sort"
    ></Table>

   <!--分页-->
    <app-pager
      :data="list"
      @on-change="goTo"
      @on-page-size-change="pageSizeChange"
    ></app-pager>

  </div>
</template>

<script>
/**
 * 备课管理 - 教案管理 - 教师列表
 * @author zhoumenglin
 * @version 2017-10-17
 */

import { mapState } from 'vuex'
import { PREPARE } from '@/store/mutationTypes'
import { list } from '@/mixins'
import { createButton } from '@/utils'

export default {
  name: 'app-prepare-prepareplan',

  mixins: [list],

  data() {
    return {
      likeKeys: [
        { label: '教师姓名', value: 'realname' },
      ],
      likeKey: 'realname',

      columns: [
        { title: '教师姓名', key: 'realname', align: 'center' },
        { title: '班级总数量', key: 'classes', align: 'center', sortable: 'custom' },
        { title: '课程总数', key: 'schedules', align: 'center', sortable: 'custom' },
        { title: '已完成教案', key: 'with_schemes', align: 'center', sortable: 'custom' },
        { title: '待添加教案', key: 'without_schemes', align: 'center', sortable: 'custom' },
        { title: '未完成教案', key: 'miss_schemes', align: 'center', sortable: 'custom' },
        {
          title: '操作',
          align: 'center',
          width: 180,
          render: createButton([
            { text: '查看', type: 'primary', click: row => this.goTo(row.id, row.realname) },
          ]),
        },
      ],
    }
  },

  computed: {
    ...mapState({
      list: state => state.prepare.prepareplan.teachers,
    }),
  },

  methods: {
    // 获取教师数据
    getData(qs) {
      return this.$store.dispatch(PREPARE.PREPAREPLAN.INIT, qs)
    },

    // 查看教案
    goTo(id, name) {
      this.$store.commit(PREPARE.PREPAREPLAN.TEACHERNAME, name)
      this.$router.push(`/prepare/prepareplan/${id}`)
    },
  },

  created() {

  },
}
</script>

<style lang="less">

</style>
