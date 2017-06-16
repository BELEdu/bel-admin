<template>
  <div>
    <Form inline class="app-search-form">
      <Form-item prop="startTime">
        <Date-picker type="date" :value="form.startTime" placeholder="开始时间"></Date-picker>
      </Form-item>
      <Form-item prop="endTime">
        <Date-picker type="date" :value="form.emdTime" placeholder="结束时间"></Date-picker>
      </Form-item>
      <Form-item prop="keyword">
        <Input v-model="form.keyword" placeholder="请输入关键词"></Input>
      </Form-item>
      <Form-item>
        <Select v-model="form.subject">
          <Option>全部</Option>
          <Option>英语</Option>
          <Option>数字</Option>
          <Option>语文</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Select v-model="form.status">
          <Option>全部</Option>
          <Option>待确认</Option>
          <Option>已排定</Option>
          <Option>已取消</Option>
          <Option>已上课</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search">搜索</Button>
      </Form-item>
    </Form>

    <Row class="app-content-header" type="flex" justify="space-between">
      <Col><h2>学员排课表</h2></Col>
    </Row>

    <Tabs type="card" :animated="false">
      <Tab-pane label="日课表" name="1"></Tab-pane>
      <Tab-pane label="周课表" name="2"></Tab-pane>
      <Table class="app-table" :columns="columns" :data="data" border></Table>
      <app-pager></app-pager>
    </Tabs>
  </div>
</template>

<script>
/**
 * 学员排课表
 * @author  chenliangshan
 * @date    2017/06/15
 */

import { GLOBAL } from '@/store/mutationTypes'
import { createButton } from '@/utils'

export default{
  name: 'app-arrange-edit',
  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
  data() {
    return {
      form: {},
      columns: [
        { type: 'index', title: '序号', width: 50 },
        { title: '班级', key: 'b' },
        { title: '学员姓名', key: 'c' },
        { title: '学员编号', key: 'd' },
        { title: '当前年级', key: 'e' },
        { title: '班主任', key: 'f' },
        { title: '学管师', key: 'g' },
        { title: '产品名称', key: 'h' },
        { title: '剩余课时', key: 'i' },
        {
          title: '操作',
          key: 10,
          align: 'center',
          render: createButton([
            {
              icon: 'edit',
              type: 'primary',
              click: (params) => {
                this.$router.push(`/arrange/student/edit/${params.a}`)
              },
              text: '排课管理',
            },
          ]),
        },
      ],
      data: [
        {
          a: 1,
          b: '-',
          c: '王芳',
          d: 'xxxxxx',
          e: '初中三年级',
          f: '候晓辉',
          g: '吴红',
          h: '个性化一对一教学，晚间辅导',
          i: '18',
        },
        {
          a: 2,
          b: '奥数小班',
          c: '赵芳',
          d: '112312',
          e: '初中三年级',
          f: '方一勺',
          g: '赖小天',
          h: '个性化一对一教学',
          i: '20',
        },
      ],
    }
  },
}
</script>
