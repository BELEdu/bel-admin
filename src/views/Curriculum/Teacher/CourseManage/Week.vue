<template>
  <div>
    <Form inline class="app-search-form">
      <Form-item>
        <Date-picker v-model="weekStartDate"
                     @on-change="dateChange"
                     placeholder="请选择时间"></Date-picker>
      </Form-item>
      <Form-item>
        <Input v-model="query.like[likeKey]" placeholder="请输入关键词">
        <Select v-model="likeKey" slot="prepend" style="width:6em">
          <Option v-for="likeKey in likeKeys"
                  :key="likeKey.value"
                  :value="likeKey.value">{{ likeKey.label }}</Option>
        </Select>
        </Input>
      </Form-item>
      <Form-item>
        <Select v-model="query.equal.subject_id">
          <Option value="">全部</Option>
          <Option v-for="list in subjectType"
                  :key="list.value"
                  :value="list.value">{{list.display_name}}</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Select v-model="query.equal.schedule_status">
          <Option value="">全部</Option>
          <Option value="0">待确认</Option>
          <Option value="1">已排定</Option>
          <Option value="2">已上课</Option>
          <Option value="3">已取消</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search" @click="search">搜索</Button>
      </Form-item>
    </Form>

    <!--列表工具模块-->
    <Row class="app-content-header" type="flex" justify="space-between">
      <Col>
      <h2><Icon type="ios-calendar" /> 周课表</h2>
      </Col>
      <Col>
      <Button type="primary">打印</Button>
      </Col>
    </Row>
    <Weekly-table :data="weeklyData"
                  @on-prev="getPrevWeek"
                  @on-next="getNextWeek"></Weekly-table>
  </div>
</template>

<script>
  /**
   * 教师排课-周课表
   * @author  chenliangshan
   * @update    2017/07/01
   */

  import { list } from '@/mixins'
  import { getDateRange, prevWeek, nextWeek } from '@/utils/date'
  import WeeklyTable from '../../Components/WeeklyTable'

  export default{
    name: 'app-teacher-course-week',
    mixins: [list],
    components: { WeeklyTable },
    data() {
      return {
        // 搜索字段
        query: {
          between: {
            created_at: [],
          },
          equal: {
            schedule_status: '',
          },
        },
        likeKeys: [
          { label: '教师姓名', value: 'teacher_name' },
          { label: '教学对象', value: 'display_name' },
          { label: '学管师', value: 'counsellor_name' },
        ],
        likeKey: 'teacher_name',
        subjectType: [
          { display_name: '语文', value: 1 },
          { display_name: '数学', value: 2 },
          { display_name: '英语', value: 3 },
        ],
        // 弹窗数据
        formItem: {},
        // 周课表字段
        weeklyColums: [],
        // 周课表数据
        weeklyData: {},
      }
    },
    computed: {
      // 显示周期间开始日期
      weekStartDate() {
        return this.$route.query['between[created_at][]'] ? this.$route.query['between[created_at][]'][0] : ''
      },
    },
    methods: {
      // 获取教师周课表数据
      getData(qs) {
        return this.$http.get(`/teachercurricula/weekly/${this.$route.params.id}${qs}`)
          .then((data) => {
            this.weeklyData = data
          })
      },
      // 监听日期变化
      dateChange(val) {
        // 设置指定日期所在周里开始与结束日期
        this.query.between.created_at = getDateRange(val)
      },
      // 查看上一周课表
      getPrevWeek() {
        this.query.between.created_at = prevWeek(this.query.between.created_at[0])
        this.updateData()
      },
      // 查看上一周课表
      getNextWeek() {
        this.query.between.created_at = nextWeek(this.query.between.created_at[0])
        this.updateData()
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
