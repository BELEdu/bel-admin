<template>
  <div>
    <!-- 搜索表单 -->
    <Form inline class="app-search-form">
      <Form-item>
        <Input v-model="query.like[likeKey]" placeholder="请输入关键字">
          <Select v-model="likeKey" slot="prepend" style="width:7em;">
            <Option v-for="likeKey in likeKeys" :key="likeKey.value" :value="likeKey.value">{{ likeKey.label }}</Option>
          </Select>
        </Input>
      </Form-item>
      <Form-item>
        <Select v-model="query.equal.satisfaction" style="width:8em;" placeholder="请选择满意度" >
          <Option v-for="item in satisfaction" :value="item.value" :key="item.display_name">{{item.display_name}}</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Date-picker v-model="query.between.meeting_date" format="yyyy-MM-dd" type="daterange" placeholder="请选择会议时间日期"></Date-picker>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search" @click="search">搜索</Button>
      </Form-item>
    </Form>

     <!-- 操作按钮 -->
    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2>交流会列表</h2>
      </Col>
      <Col>
        <Button type="primary" @click="$router.push(`/student/student/${studentId}/meeting/edit`)">添加交流会</Button>
      </Col>
    </Row>

    <!-- 删除模态框 -->
    <app-warn-modal
      v-model="modal.delete"
      title="删除确认"
      :loading="loading.delete"
      @on-ok="meetingDelete(meetingId)"
      action="删除"
    >
      <div class="text-center">删除编号为 <a>{{meetingId}}</a> 的交流会记录后，将无法恢复。<br>是否继续删除</div>
    </app-warn-modal>

    <!-- 交流会列表 -->
    <Table class="app-table" :columns="columns" :data="list.data" border @on-sort-change="sort"></Table>

    <!-- 分页 -->
    <app-pager :data="list" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>

  </div>
</template>

<script>
/**
 * 学员管理 - 学员信息 - 学员详情 - 交流会
 * @author zml
 * @version 2017-06-14
 * @version 2017-06-26
 */
import { mapState } from 'vuex'
import { list } from '@/mixins'
import { STUDENT } from '@/store/mutationTypes'
import { createButton } from '@/utils'

export default {
  name: 'app-student-student-detail-meeting',

  mixins: [list],

  data() {
    return {

      likeKeys: [
        { label: '家长姓名', value: 'parent_name' },
      ],
      likeKey: 'parent_name',
      query: {
        equal: {
          satisfaction: null,
        },
        between: {
          meeting_date: [],
        },
      },

      // 表格配置
      columns: [
        { title: '会议时间', key: 'meeting_date', align: 'center', sortable: 'custom' },
        { title: '会议类型', key: 'meeting_type_name', align: 'center' },
        { title: '参会家长', key: 'parent_name', align: 'center' },
        {
          title: '参会员工',
          key: 'meeting_person',
          align: 'center',
          render: (h, params) => {
            const { meeting_person } = params.row
            const text = meeting_person
              .reduce((result, item) => `${result} ${item.username}，`, '')
              .slice(0, -1)
            return h('span', text)
          },
        },
        {
          title: '附件',
          key: 'meeting_attachment',
          align: 'center',
          render: (h, params) => {
            const { meeting_attachment: attachs } = params.row
            return h(
              'div',
              attachs.map(({ name, url }) => h('a', {
                class: 'attachs_space',
                attrs: {
                  title: name,
                  href: `https://oa-api.caihonggou.com${url}`,
                  target: '_blank',
                },
              }, name)),
            )
          },
        },
        { title: '家长满意度', key: 'satisfaction_name', align: 'center' },
        { title: '创建人', key: 'user_name', align: 'center' },
        {
          title: '操作',
          key: 13,
          align: 'center',
          width: 140,
          render: createButton([
            // 删除该学员
            { text: '删除', type: 'error', click: row => this.openDeleteModal(row.id) },
            { text: '编辑', type: 'primary', click: row => this.$router.push(`/student/student/${this.studentId}/meeting/edit/${row.id}`) },
          ]),
        },
      ],

      modal: { // 弹窗状态
        delete: false,
      },

      loading: { // 模态框确定按钮loading状态
        delete: false,
      },

      meetingId: '', // 交流会ID（删除用）
    }
  },

  computed: {
    // 使用mapState获取list
    ...mapState({
      list: state => state.student.meeting.list,
      satisfaction: state => state.dicts.satisfaction,
    }),

    studentId() {
      return +this.$router.currentRoute.params.studentId
    },
  },

  methods: {
    // 获取列表数据
    getData(qs) {
      return this.$store.dispatch(STUDENT.STUDENT.MEETING.INIT, {
        id: this.studentId,
        query: qs,
      })
    },

    // 打开删除模态框
    openDeleteModal(meetingId) {
      this.modal.delete = true
      this.meetingId = meetingId
    },

    // 删除交流会
    meetingDelete(meetingId) {
      this.meetingId = meetingId
      // 禁止连续点击
      this.loading.delete = true
      this.$store.dispatch(STUDENT.STUDENT.MEETING.DELETE, meetingId)
      .then(() => {
        this.loading.delete = false
        this.modal.delete = false
        this.$Message.warning('删除成功！')
      })
    },
  },

}
</script>

<style <style lang="less">
  .attachs_space{
    display: block
  }
</style>
