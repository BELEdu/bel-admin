<template>
  <div>
    <!-- 搜索表单 -->
    <Form inline class="app-search-form">
      <Form-item>
        <Row>
          <Col span="11">
            <Date-picker type="date" v-model="formSearch.start" placeholder="选择日期"></Date-picker>
          </Col>
          <Col span="2" style="text-align: center">至</Col>
          <Col span="11">
            <Date-picker type="date" v-model="formSearch.end" placeholder="选择日期"></Date-picker>
          </Col>
        </Row>
      </Form-item>
      <Form-item>
        <Input type="text" v-model="formSearch.keyword" placeholder="请输入关键字"></Input>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search">搜索</Button>
      </Form-item>
    </Form>

     <!-- 操作按钮 -->
    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2>交流会列表</h2>
      </Col>
      <Col>
        <Button type="primary" @click="$router.push('/student/student/detail/meeting/edit')">添加交流会</Button>
      </Col>
    </Row>

    <!-- 删除模态框 -->
    <app-warn-modal
      v-model="modal.delete"
      title="删除确认"
      :loading="loading.delete"
      @on-ok="meetingDelete(name)"
      action="删除"
    >
      <div class="text-center">删除该 <a href="">{{name}}</a> 交流会记录后，将无法恢复。<br>是否继续删除</div>
    </app-warn-modal>

    <!-- 学员信息表格 -->
    <Table class="app-table" :columns="columns" :data="fdata" border></Table>

    <!-- 分页 -->
    <app-pager :data="pager" @on-change="() => {}"></app-pager>

  </div>
</template>

<script>
/**
 * 学员管理 - 学员信息 - 学员详情 - 交流会
 * @author zml
 * @version 2017-06-14
 */
import { GLOBAL } from '@/store/mutationTypes'
import { createButton } from '@/utils'
import fdata from './fdata'

export default {
  name: 'app-student-student-detail-meeting',

  data() {
    return {
      // 搜索表单
      formSearch: {
        start: '',
        end: '',
        keyword: '',
      },
      modal: {
        delete: false,
      },
      // 模态框确定按钮loading状态
      loading: {
        delete: false,
      },
      // 表格配置
      columns: [
        { title: '会议类型', key: 'name', align: 'center' },
        { title: '会议时间', key: 2, align: 'center' },
        { title: '家长姓名', key: 3, align: 'center' },
        { title: '与会人员', key: 4, align: 'center' },
        {
          title: '附件',
          key: 'file',
          align: 'center',
          // 剩余课时小于10的时候变红
          render: (h, params) => {
            const row = params.row
            const className = 'color-primary'
            const text = row.file
            const link = 'https://www.baidu.com/link?url=2yIvX64nLJN5XXgyhzUfgCC12QmlPxQpF7cG6iPxFGVZ4D7DomywRxbW5ZQRrTqXErDevEYqwceq0PidCO-dLdjqriQtKHLWN6E4gxsrowy&wd=&eqid=8410049c00009e5c0000000659424693'
            return h('a', {
              class: className,
              attrs: {
                href: link,
                title: '我是附件',
                target: '_blank',
              },
            }, text)
          },
        },
        {
          title: '操作',
          key: 13,
          align: 'center',
          width: 140,
          render: createButton([
            // 删除该学员
            { icon: 'trash-a', type: 'warning', click: row => this.openDeleteModal(row.name) },
            { icon: 'edit', type: 'primary', click: () => this.$router.push('/student/student/detail/meeting/edit/10086') },
          ]),
        },
      ],
      // 表格数据
      fdata,
      // 分页配置
      pager: undefined,
      // 会议类型
      name: '',
    }
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },

  methods: {
    // 打开删除模态框
    openDeleteModal(name) {
      this.modal.delete = true
      // 传入表格中对应学员编号
      this.name = name
    },
    // 删除未签约学员
    meetingDelete(name) {
      this.name = name
      // 禁止连续点击
      this.loading.delete = true
      // 用延时模拟请求成功
      setTimeout(() => {
        this.loading.delete = false
        this.modal.delete = false
        this.$Message.warning('删除成功！')
      }, 1500)
    },
  },

}
</script>

<style <style lang="less">

</style>
