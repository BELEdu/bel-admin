<template>
  <div>
    <dash-board icon="clock" title="课时统计" :data="dashboard"></dash-board>

    <Form inline class="app-search-form">
      <Form-item>
        <Input placeholder="请输入关键字"></Input>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search">搜索</Button>
      </Form-item>
    </Form>

    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
        <h2>课时列表</h2>
      </Col>
    </Row>
  </div>
</template>

<script>
import { GLOBAL } from '@/store/mutationTypes'
import DashBoard from './components/DashBoard'

export default {
  name: 'app-analysis-lesson',

  data: () => ({
    dashboard: [
      { label: '本月消耗课时量', value: '6000' },
      { label: '本月消耗课时量', value: '6000' },
      { label: '本月消耗课时量', value: '6000' },
      { label: '本月消耗课时量', value: '6000' },
      { label: '本月消耗课时量', value: '6000' },
    ],
  }),

  components: {
    dashBoard: DashBoard,
  },

  created() {
    this.$store.commit(GLOBAL.LOADING.HIDE)
  },
}
</script>
