<template>
  <div>
    <Form inline class="app-search-form">
      <Form-item prop="startTime">
        <Date-picker type="date" v-model="form.startTime" placeholder="请选择时间"></Date-picker>
      </Form-item>
      <Form-item prop="keyword">
        <Input v-model="form.keyword" placeholder="请输入关键词"></Input>
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
          <Option value="">全部</Option>
          <Option value="0">待确认</Option>
          <Option value="1">已排定</Option>
          <Option value="2">已上课</Option>
          <Option value="3">已取消</Option>
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
   * 教师排课-周课表
   * @author  chenliangshan
   * @update    2017/07/01
   */

  import { list } from '@/mixins'
  import WeeklyTable from '../../Components/WeeklyTable'

  export default{
    name: 'app-teacher-course-week',
    mixins: [list],
    components: { WeeklyTable },
    data() {
      return {
        // 弹窗数据
        formItem: {},
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
      }
    },
    methods: {
      // 获取教师周课表数据
      getData(qs) {
        return this.$http.get(`/teachercurricula/weekly/${this.$route.params.id}${qs}`)
          .then((data) => {
            this.weeklyData = data
          })
      },
    },
  }
</script>

<style lang="less" scoped>
  .ivu-tabs, .ivu-table {
    overflow: visible;
  }
  .teacher-modal-content {
    padding: 0 20px;
  }
  .points {
    h3 {
      font-size: 14px;
      margin: 0;
      padding: 20px 0;
    }
  }
</style>
