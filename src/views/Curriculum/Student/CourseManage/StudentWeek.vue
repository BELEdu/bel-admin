<template>
  <div>
    <Form inline class="app-search-form">
      <Form-item>
        <Date-picker v-model="baseDate" placeholder="请选择时间"></Date-picker>
      </Form-item>
      <Form-item>
        <Input v-model="likeValue" placeholder="请输入关键词">
          <Select v-model="likeKey" slot="prepend" style="width:6em">
            <Option v-for="likeKey in likeKeys"
                    :key="likeKey.value"
                    :value="likeKey.value">{{ likeKey.label }}</Option>
          </Select>
        </Input>
      </Form-item>
      <Form-item>
        <Select v-model="query['equal[subject_id]']">
          <Option value="">全部</Option>
          <Option v-for="list in subjectType"
                  :key="list.value"
                  :value="list.value">{{list.display_name}}</Option>
        </Select>
      </Form-item>
      <Form-item>
        <Select v-model="query['equal[schedule_status]']">
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
      <h2><Icon type="ios-calendar" /> 学员周课表</h2>
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
 * 学员排课表
 * @author  chenliangshan
 * @update    2017/07/01
 */

import { list } from '@/mixins'
import week from '../../mixins/week'
import WeeklyTable from '../../Components/WeeklyTable'

export default{
  name: 'app-student-course-manage',

  mixins: [list, week],

  components: { WeeklyTable },

  data() {
    return {
      // 搜索字段
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
        // (周课表)分页数据
        weekly: {},
      },
    }
  },

  methods: {
    // 获取学员周课表数据
    getData(qs) {
      return this.$http.get(`/studentcurricula/weekly/${this.$route.params.id}${qs}`)
        .then((data) => {
          this.weeklyData = data
        })
    },
  },
}
</script>
