<template>
  <div class="student-schedule">
    <Form inline class="app-search-form">
      <Form-item>
        <Input v-model="likeValue" placeholder="请输入关键字">
        <Select v-model="likeKey" slot="prepend" style="width:6em;">
          <Option v-for="key in likeKeys" :key="key.value" :value="key.value">{{ key.label }}</Option>
        </Select>
        </Input>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search" @click="search">搜索</Button>
      </Form-item>
    </Form>

    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
      <h2><Icon type="ios-calendar"/> 教师课表</h2>
      </Col>
    </Row>

    <!--教师课表-->
    <Table class="app-table" :columns="columns" :data="list.data" border @on-sort-change="sort"></Table>

    <!--分页-->
    <app-pager :data="list" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>
  </div>
</template>

<script>
  /**
   * 学习计划-课表
   * @author chenliangshan
   * @version 2017-10-19
   */
  import { mapState } from 'vuex'
  import { list } from '@/mixins'
  import { STUDENT } from '@/store/mutationTypes'
  import { createButton } from '@/utils'

  export default {
    name: 'student-schedule',

    mixins: [list],

    data() {
      return {
        likeKeys: [
          { label: '教师姓名', value: 'realname' },
          { label: '学科', value: 'subject_name' },
        ],

        likeKey: 'realname',

        columns: [
          { title: '序号', type: 'index', width: 60, align: 'center' },
          { title: '教师姓名', key: 'realname', width: 200, align: 'center' },
          {
            title: '学科',
            align: 'center',
            render: (h, prams) => h('div', {
              domProps: {
                innerHTML: prams.row.subject_name,
              },
            }),
          },
          { title: '累计学生数', key: 'students', align: 'center' },
          { title: '待上课数', key: 'ready_courses', align: 'center' },
          { title: '已完成课数', key: 'finish_courses', align: 'center' },
          {
            title: '操作',
            align: 'center',
            width: 140,
            render: createButton([
              { text: '排课管理',
                type: 'primary',
                click: (row) => {
                  this.$router.push(`/student/schedule/manage/${row.id}`)
                },
              },
            ]),
          },
        ],
      }
    },

    computed: {
      ...mapState({
        list: state => state.student.schedule.list,
      }),
    },

    methods: {
      getData(qs) {
        return this.$store.dispatch(STUDENT.SCHEDULE.LIST, qs)
      },
    },

  }
</script>
