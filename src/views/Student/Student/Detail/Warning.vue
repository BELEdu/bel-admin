<template>
  <div>

    <!-- 搜索表单 -->
   <Form inline class="app-search-form">
      <Form-item>
        <Select style="width:8em;" placeholder="请选择状态" >
          <Option value="预警中">预警中</Option>
          <Option value="已取消">已取消</Option>
          <Option value="取消预警">取消预警</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search" @click="search">搜索</Button>
      </Form-item>
    </Form>

    <!-- 操作按钮 -->
    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2>预警记录</h2>
      </Col>
    </Row>

    <!-- 取消预警模态框 -->
    <app-form-modal
      v-model="modal.cancel"
      title="取消预警"
      :loading="loading.cancel"
      @on-ok="cancelSubmit()"
    >
      <Form ref="formCancel" :model="formCancel" :label-width="60">
        ID：{{warningId}}
        <Form-item label="取消说明" >
          <Input v-model="formCancel.text" type="textarea" :autosize="{minRows: 4,maxRows: 8}" placeholder="请输入..."></Input>
        </Form-item>
      </Form>
    </app-form-modal>

     <!-- 预警已解决模态框 -->
    <app-form-modal
      v-model="modal.ok"
      title="预警已解决"
      :loading="loading.ok"
      @on-ok="okSubmit()"
    >
      <Form ref="formOk" :model="formOk" :label-width="60">
        ID：{{warningId}}
        <Form-item label="解决说明" >
          <Input v-model="formOk.text" type="textarea" :autosize="{minRows: 4,maxRows: 8}" placeholder="请输入..."></Input>
        </Form-item>
      </Form>
    </app-form-modal>

    <!-- 预警信息列表 -->
    <Table class="app-table" :columns="columns" :data="list.data" border @on-sort-change="sort"></Table>

    <!-- 分页 -->
    <app-pager :data="list" @on-change="goTo" @on-page-size-change="pageSizeChange"></app-pager>

  </div>
</template>

<script>
/**
 * 学员管理 - 学员信息 - 学员详情 - 预警信息
 * @author zml
 * @version 2017-06-14
 */
import { mapState } from 'vuex'
import { list } from '@/mixins'
import { STUDENT } from '@/store/mutationTypes'
import { createButton } from '@/utils'


export default {
  name: 'app-student-student-detail-warning',

  mixins: [list],

  data() {
    return {
      query: {
        equal: {
          1111111: '',
        },
      },
      // 取消预警表单
      formCancel: {
        text: '',
      },
      // 解决预警表单
      formOk: {
        text: '',
      },
      // 模态框配置
      modal: {
        cancel: false,
        ok: false,
      },
      // 模态框确定按钮loading状态
      loading: {
        cancel: false,
        ok: false,
      },
      // 表格配置
      columns: [
        { title: 'ID', key: 'id', align: 'center', sortable: 'custom' },
        { title: '预警类型', key: 'warning_type', align: 'center' },
        { title: '预警时间', key: 3, align: 'center', sortable: 'custom' },
        { title: '操作人', key: 'user_id', align: 'center' },
        { title: '操作人岗位', key: 5, align: 'center' },
        { title: '预警原因', key: 'warning_reason', align: 'center' },
        { title: '状态', key: 'warning_status', align: 'center' },
        {
          title: '操作',
          key: 8,
          align: 'center',
          width: 160,
          render: createButton([
            // 取消预警
            { text: '取消预警', type: 'primary', click: row => this.warningCancel(row.id) },
            // 已解决
            { text: '已解决', type: 'primary', click: row => this.warningOk(row.id) },
          ]),
        },
      ],

      // 预警ID
      warningId: '',
    }
  },

  computed: {
    // 使用mapState获取list
    ...mapState({
      list: state => state.student.warning.list,
    }),

    studentId() {
      return this.$router.currentRoute.params.studentId
    },
  },

  methods: {

    // 取消预警
    warningCancel(id) {
      this.warningId = id
      this.modal.cancel = true
    },
    // 解决预警
    warningOk(id) {
      this.warningId = id
      this.modal.ok = true
    },
    // 取消预警表单提交
    cancelSubmit() {
      // 禁止连续点击
      this.loading.cancel = true
      // 用延时模拟请求成功
      setTimeout(() => {
        this.loading.cancel = false
        this.modal.cancel = false
        this.$Message.success('提交成功！')
        // 重置该表单
        this.formCancel.text = ''
      }, 1500)
    },
    // 解决预警表单提交
    okSubmit() {
      // 禁止连续点击
      this.loading.ok = true
      // 用延时模拟请求成功
      setTimeout(() => {
        this.loading.ok = false
        this.modal.ok = false
        this.$Message.success('提交成功！')
        // 重置该表单
        this.formOk.text = ''
      }, 1500)
    },

     // 获取列表数据
    getData(qs) {
      return this.$store.dispatch(STUDENT.STUDENT.WARNING.INIT, {
        id: this.studentId,
        query: qs,
      })
    },
  },

}
</script>

<style <style lang="less">

</style>
