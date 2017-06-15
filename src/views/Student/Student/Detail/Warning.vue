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
      <Form ref="formCancel" :model="formCancel"  :label-width="60">
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

     <!-- 学员信息表格 -->
    <Table class="app-table" :columns="columns" :data="fdata" border></Table>

    <!-- 分页 -->
    <app-pager :data="pager" @on-change="() => {}"></app-pager>

  </div>
</template>

<script>
/**
 * 学员管理 - 学员信息 - 学员详情 - 预警信息
 * @author zml
 * @version 2017-06-14
 */
import { GLOBAL } from '@/store/mutationTypes'
import { createButton } from '@/utils'
import fdata from './fdata'

export default {
  name: 'app-student-student-detail-warning',

  data() {
    return {
      // 搜索表单
      formSearch: {
        start: '',
        end: '',
        keyword: '',
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
        { title: 'ID', key: 'id', align: 'center' },
        { title: '预警类型', key: 2, align: 'center' },
        { title: '预警时间', key: 3, align: 'center' },
        { title: '操作人', key: 4, align: 'center' },
        { title: '操作人岗位', key: 5, align: 'center' },
        { title: '预警原因', key: 6, align: 'center' },
        { title: '状态', key: 7, align: 'center' },
        {
          title: '操作',
          key: 8,
          align: 'center',
          width: 140,
          render: createButton([
            // 取消预警
            { icon: 'loop', type: 'warning', click: row => this.warningCancel(row.id) },
            // 已解决
            { icon: 'checkmark', type: 'primary', click: row => this.warningOk(row.id) },
          ]),
        },
      ],
      // 表格数据
      fdata,
      // 分页配置
      pager: undefined,
      // 预警ID
      warningId: '',
    }
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
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
  },

}
</script>

<style <style lang="less">

</style>
