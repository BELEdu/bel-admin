<template>
  <div>

    <Form inline class="app-search-form">
      <Form-item>
        <Input type="text" v-model="formSearch.keyword" placeholder="请输入关键字"></Input>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search">搜索</Button>
      </Form-item>
    </Form>

    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2>学习进度</h2>
      </Col>
    </Row>

    <Table class="app-table" :columns="columns" :data="sdata" border></Table>

    <app-pager :data="pager" @on-change="() => {}"></app-pager>

  </div>
</template>

<script>
/**
 * 学员管理 - 学习进度 - 学员列表
 * @author zml
 * @version 2017-06-08
 * @version 2017-06-16
 * @version 2017-06-29
 */
import { GLOBAL } from '@/store/mutationTypes'
import { createButton } from '@/utils'
import sdata from './Data/sdata'

export default {
  name: 'app-student-studyprogress-student',

  data() {
    return {
       // 搜索栏配置
      formSearch: {
        keyword: '',
      },
       // 表格配置
      columns: [
        {
          title: '学员姓名',
          key: 'display_name',
          align: 'center',
          render: (h, params) => {
            const { display_name, number } = params.row
            return h('Tooltip', {
              props: {
                content: number,
                placement: 'right',
              },
            }, display_name)
          },
        },
        { title: '当前年级', key: 2, align: 'center' },
        { title: '归属学管师', key: 3, align: 'center' },
        { title: '签约课时', key: 4, align: 'center' },
        { title: '剩余课时', key: 5, align: 'center' },
        {
          title: '课时',
          key: 'class',
          align: 'left',
          width: '200',
          render: (h, params) => {
            const { class_now, class_total } = params.row
            const text = `总课时：${class_total}`
             // eslint-disable-next-line
            const percent = class_total === 0 ? 0 : Math.round(class_now / class_total * 100)
            // const percent = Math.round(point_now / point_total *10000)/100 //保留小数点后两位
            return h('div', [
              h('span', text),
              h('Progress', {
                props: {
                  percent,
                  status: 'active',
                },
              }),
            ])
          },
        },
        {
          title: '学习知识点进度',
          key: 'point',
          align: 'left',
          width: '200',
          render: (h, params) => {
            const { point_now, point_total } = params.row
            const text = `总知识点：${point_total}个`
             // eslint-disable-next-line
            const percent = point_total === 0 ? 0 : Math.round(point_now / point_total * 100)
            // const percent = Math.round(point_now / point_total *10000)/100 //保留小数点后两位
            return h('div', [
              h('span', text),
              h('Progress', {
                props: {
                  percent,
                  status: 'active',
                },
              }),
            ])
          },
        },
        {
          title: '操作',
          key: 8,
          align: 'center',
          width: 300,
          render: createButton([
            { text: '学习进度', type: 'primary', click: row => this.$router.push(`/student/studyprogress/student/${row.id}/progress`) },
            { text: '编辑计划', type: 'primary', click: row => this.$router.push(`/student/studyprogress/student/${row.id}/plan`) },
            { text: '添加计划', type: 'primary', click: row => this.$router.push(`/student/studyprogress/student/${row.id}/add`) },
            { text: '历史计划', type: 'primary', click: row => this.$router.push(`/student/studyprogress/student/${row.id}/history`) },
          ]),
        },
      ],
       // 表格数据
      sdata,
       // 分页配置
      pager: undefined,
    }
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>

<style lang="less">
@import '~vars';
</style>
