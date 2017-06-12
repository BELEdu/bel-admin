<template>
  <div>
    <Breadcrumb class="app-creadcrumb">
      <Breadcrumb-item href="/">签约管理</Breadcrumb-item>
      <Breadcrumb-item href="/test">沟通记录</Breadcrumb-item>
    </Breadcrumb>

    <Form inline class="app-search-form">
      <Form-item prop="start">
        <Row>
          <Col span="11">
            <Date-picker type="date" placeholder="选择日期"></Date-picker>
          </Col>
          <Col span="2" style="text-align: center">至</Col>
          <Col span="11">
            <Date-picker type="date" placeholder="选择日期"></Date-picker>
          </Col>
        </Row>
      </Form-item>
      <Form-item prop="keyword">
        <Input type="text" v-model="form.keyword" placeholder="请输入关键字"></Input>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search" @click="handleSubmit('form')">查询</Button>
      </Form-item>
    </Form>

    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2>沟通记录</h2>
      </Col>
      <Col>
        <Button>导入</Button>
        <Button type="primary">添加记录</Button>
      </Col>
    </Row>
    <Table class="app-table" :columns="columns" :data="data" border></Table>

    <Page class="app-page" :total="100" show-total show-sizer show-elevator></Page>
  </div>
</template>

<script>
export default {
  data: () => ({
    form: {
      start: '',
      end: '',
      keyword: '',
    },

    columns: [
      { title: '沟通时间', key: '1', align: 'center', width: 84 },
      { title: '等级', key: '2', align: 'center', width: 84 },
      { title: '类型', key: '3', align: 'center' },
      { title: '回访时间', key: '4', align: 'center', width: 84 },
      { title: '学校', key: '5', align: 'center' },
      { title: '姓名', key: '6', align: 'center' },
      { title: '年级', key: '7', align: 'center' },
      { title: '性别', key: '8', align: 'center' },
      { title: '手机', key: '9', align: 'center', width: 115 },
      { title: '排行', key: '10', align: 'center' },
      { title: '偏科', key: '11', align: 'center', width: 50 },
      { title: '沟通情况', key: '12', align: 'center', width: 300 },
      {
        title: '操作',
        key: '13',
        width: '120',
        align: 'center',
        render: h => h('div', [
          h('Button', {
            props: {
              type: 'text',
              size: 'small',
            },
          }, '删除'),
          h('Button', {
            props: {
              type: 'text',
              size: 'small',
            },
          }, '编辑'),
        ]),
      },
    ],
    data: [
      {
        1: '20170411 18:00',
        2: '一级',
        3: '上门',
        4: '20170411 18:00',
        5: '厦门一中',
        6: '张三',
        7: '高一',
        8: '男',
        9: '13922334455',
        10: '段25名',
        11: '否',
        12: '孩子成绩段里20多名，孩子平时都是主要是在练习跆拳道，文化课学习上家长不是愿意让孩子学习，家里有个侄子现在应为学习都抑郁了。',
      },
      {
        1: '20170411 18:00',
        2: '二级',
        3: '沟通已签约',
        4: '20170411 18:00',
        5: '厦门一中',
        6: '李四',
        7: '高一',
        8: '男',
        9: '13922334455',
        10: '段25名',
        11: '否',
        12: '孩子成绩段里20多名，孩子平时都是主要是在练习跆拳道',
      },
      {
        1: '20170411 18:00',
        2: '二级',
        3: '转介绍',
        4: '20170411 18:00',
        5: '厦门一中',
        6: '王五',
        7: '初三',
        8: '男',
        9: '13922334455',
        10: '段25名',
        11: '否',
        12: '',
      },
      {
        1: '20170411 18:00',
        2: '一级',
        3: '上门',
        4: '20170411 18:00',
        5: '同安一中',
        6: '张三',
        7: '高一',
        8: '男',
        9: '13922334455',
        10: '段25名',
        11: '否',
        12: '孩子成绩段里20',
      },
      {
        1: '20170411 18:00',
        2: '一级',
        3: '直访',
        4: '20170411 18:00',
        5: '同安一中',
        6: '张三',
        7: '高一',
        8: '男',
        9: '13922334455',
        10: '段25名',
        11: '否',
        12: '孩子成绩段里20多名，孩子平时都是主要',
      },
      {
        1: '20170411 18:00',
        2: '一级',
        3: '上门',
        4: '20170411 18:00',
        5: '厦门一中',
        6: '张三',
        7: '高一',
        8: '男',
        9: '13922334455',
        10: '段25名',
        11: '否',
        12: '孩子成绩段里20多名，孩子平时都是主要',
      },
      {
        1: '20170411 18:00',
        2: '一级',
        3: '上门',
        4: '20170411 18:00',
        5: '厦门一中',
        6: '张三',
        7: '高一',
        8: '男',
        9: '13922334455',
        10: '段25名',
        11: '否',
        12: '孩子成绩段里20多名，孩子平时都是主要',
      },
      {
        1: '20170411 18:00',
        2: '一级',
        3: '上门',
        4: '20170411 18:00',
        5: '厦门一中',
        6: '张三',
        7: '高一',
        8: '男',
        9: '13922334455',
        10: '段25名',
        11: '否',
        12: '孩子成绩段里20多名，孩子平时都是主要',
      },
    ],
  }),

  created() {
    // 应该在做完接口请求后，关闭loading动画
    setTimeout(() => {
      this.$store.commit('hideLoading')
    }, 2000)
  },
}
</script>
