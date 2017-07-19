<template>
  <div>
    <Form inline class="app-search-form">
      <Form-item>
        <Row>
          <Col span="11">
            <Date-picker type="date" v-model="form.start" placeholder="选择日期"></Date-picker>
          </Col>
          <Col span="2" style="text-align: center">至</Col>
          <Col span="11">
            <Date-picker type="date" v-model="form.end" placeholder="选择日期"></Date-picker>
          </Col>
        </Row>
      </Form-item>
      <Form-item>
        <Input type="text" v-model="form.keyword" placeholder="请输入关键字"></Input>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search">查询</Button>
      </Form-item>
    </Form>

    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2>
          <svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 200 200"><path d="M165.777 2H34.692c-7.209 0-13.108 5.898-13.108 13.108v170.41c0 7.211 5.899 13.109 13.108 13.109h131.085c7.211 0 13.109-5.896 13.109-13.109V15.108C178.887 7.898 172.988 2 165.777 2zM69.94 181.473H57.207V18.656H69.94v162.817zm75.153-125.44l-13.109-13.108-13.108 13.108V16.707h26.218v39.326h-.001z"/></svg>
          日志管理
        </h2>
      </Col>
      <Col>
        <Button type="primary">导出日志</Button>
      </Col>
    </Row>

    <Table class="app-table" :columns="columns" :data="data" border></Table>

    <app-pager :data="pager" @on-change="() => {}"></app-pager>
  </div>
</template>

<script>
import { GLOBAL } from '@/store/mutationTypes'

export default {
  name: 'app-system-log',

  data: () => ({
    form: {
      start: '',
      end: '',
      keyword: '',
    },

    columns: [
      { title: '操作时间', key: 1, align: 'center' },
      { title: '用户名', key: 2, align: 'center' },
      { title: '姓名', key: 3, align: 'center' },
      { title: '部门角色', key: 4, align: 'center' },
      { title: '操作功能模块', key: 5, align: 'center' },
      { title: '操作内容描述', key: 6, align: 'center', width: '30%' },
    ],

    data: [
      {
        1: '2017-04-05 18:22',
        2: 'JSBH1000',
        3: '侯晓辉',
        4: '厦门分公司/教学部-教师',
        5: '排课管理-教师排课-教师排课表',
        6: '确认了【李加航】2017/4/30 10：00-12:00 的排课',
      },
      {
        1: '2017-04-05 18:22',
        2: 'JSBH1000',
        3: '侯晓辉',
        4: '厦门分公司/教学部-教师',
        5: '排课管理-教师排课-教师排课表',
        6: '确认了【李加航】2017/4/30 10：00-12:00 的排课',
      },
    ],

    pager: undefined,
  }),

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style>

</style>
