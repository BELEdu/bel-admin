<template>
  <div>
    <Form inline class="app-search-form">
      <Form-item prop="startTime">
        <Date-picker type="date" v-model="form.startTime" placeholder="请选择时间"></Date-picker>
      </Form-item>
      <Form-item>
        <Select v-model="form.subject">
          <Option value="1">全部</Option>
          <Option value="2">英语</Option>
          <Option value="3">数字</Option>
          <Option value="4">语文</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Select v-model="form.status">
          <Option value="1">全部</Option>
          <Option value="2">待确认</Option>
          <Option value="3">已排定</Option>
          <Option value="4">已取消</Option>
          <Option value="5">已上课</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search">搜索</Button>
      </Form-item>
    </Form>

    <!--列表工具模块-->
    <Row class="app-content-header" type="flex" justify="end">
      <Col>
      <Button type="primary">打印</Button>
      </Col>
    </Row>
    <Weekly-table :data="weeklyData"></Weekly-table>
  </div>
</template>

<script>
/**
 * 学员排课表
 * @author  chenliangshan
 * @update    2017/06/28
 */

import { GLOBAL } from '@/store/mutationTypes'
import { list } from '@/mixins'
import WeeklyTable from '../../Components/WeeklyTable'

export default{
  name: 'app-student-course-manage',
  mixins: [list],
  components: { WeeklyTable },
  data() {
    return {
      // 搜索字段
      form: {
//        startTime: '',
//        endTime: '',
//        keyword: '',
//        subject: '',
//        status: '',
      },
      // 周课表字段
      weeklyColums: [],
      // 周课表数据
      weeklyData: {},
      // 分页数据
      pager: {
        // 默认分页数据
        defaultPage: {
          page: 1,
          per_page: 10,
        },
        // (日课表)分页数据
        daily: {},
        // (周课表)分页数据
        weekly: {},
      },
    }
  },
  methods: {
    // 获取学员周课表数据
    getData() {
      this.$http.get(`/studentcurricula/weekly/${this.$route.params.id}`)
        .then((data) => {
          this.$store.commit(GLOBAL.LOADING.HIDE)
          this.weeklyData = data
        })
    },
  },
}
</script>
