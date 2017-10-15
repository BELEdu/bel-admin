<template>
  <div class="home-data-module">
    <!--本月签约-->
    <template v-if="$attrs.type==='contract'">
      <app-echarts :auto-resize="false" :set-option="contractData"></app-echarts>
    </template>
    <!--预警-->
    <template v-if="$attrs.type==='warning'">
      <Table height="113"
             size="small"
             stripe
             :columns="warning.columns"
             :data="warning.data"></Table>
    </template>
    <!--本月签约课时收入-->
    <template v-if="$attrs.type==='income'">
      <app-echarts :auto-resize="false" :set-option="incomeData"></app-echarts>
    </template>
    <!--我的审批-->
    <template v-if="$attrs.type==='approval'">
      <Table height="273"
             size="small"
             stripe
             :columns="approval.columns"
             :data="approval.data"></Table>
    </template>
    <!--我的排课表-->
    <template v-if="$attrs.type==='course'">
      <home-calendar @day-changed="calendarDay" :date="$attrs.data.currentMonth">
        <template slot-scope="date">
          <span class="calendar-event-icon" v-for="(list, index) in courseConvert(date)"
                v-if="list.item.length"
                    :key="index">
            <Tooltip placement="top">
                <Icon type="person" v-if="list.type === 1"></Icon>
                <Icon type="person-stalker" v-if="list.type === 2"></Icon>
                <template slot="content">
                  <div v-for="item in list.item">{{item.start_at}}-{{item.end_at}} {{item.display_name}}</div>
                </template>
            </Tooltip>
          </span>
        </template>
      </home-calendar>
    </template>
    <!--本月签约课时收入占比-->
    <template v-if="$attrs.type==='incomeCompared'">
      <app-echarts :auto-resize="false" :set-option="incomeComparedData"></app-echarts>
    </template>
    <!--本月各校区签约金额占比-->
    <template v-if="$attrs.type==='amountCompared'">
      <app-echarts :set-option="amountComparedData"></app-echarts>
    </template>
    <!--我的测试管理-->
    <template v-if="$attrs.type==='testManager'">
      <Table height="233"
             size="small"
             stripe
             :columns="testManager.columns"
             :data="testManager.data"></Table>
    </template>
    <!--本月签约排行-->
    <template v-if="$attrs.type==='contractSort'">
      <Tabs value="1" :animated="false">
        <Tab-pane label="本月排行" name="1">
          <Table height="439"
                 size="small"
                 stripe
                 :columns="contractSort.columns"
                 :data="contractSort.currentMonth"></Table>
        </Tab-pane>
        <Tab-pane label="上月排行" name="2">
          <Table height="439"
                 size="small"
                 stripe
                 :columns="contractSort.columns"
                 :data="contractSort.prevMonth"></Table>
        </Tab-pane>
      </Tabs>
    </template>
    <!--我的学员-->
    <template v-if="$attrs.type==='myStudent'">
      <Table height="293"
             size="small"
             stripe
             :columns="student.columns"
             :data="student.data"></Table>
    </template>
    <!--我的班级-->
    <template v-if="$attrs.type==='myClass'">
      <Table height="353"
             size="small"
             stripe
             :columns="myClass.columns"
             :data="myClass.data"></Table>
    </template>
    <!--本月耗课-->
    <template v-if="$attrs.type==='tookPeriod'">
      <app-echarts :auto-resize="false" :set-option="tookPeriodData"></app-echarts>
    </template>
    <!--本月耗课排行-->
    <template v-if="$attrs.type==='tookPeriodSort'">
      <Tabs value="1" :animated="false">
        <Tab-pane label="本月排行" name="1">
          <Table height="439"
                 size="small"
                 stripe
                 :columns="tookPeriodSort.columns"
                 :data="tookPeriodSort.currentMonth"></Table>
        </Tab-pane>
        <Tab-pane label="上月排行" name="2">
          <Table height="439"
                 size="small"
                 stripe
                 :columns="tookPeriodSort.columns"
                 :data="tookPeriodSort.prevMonth"></Table>
        </Tab-pane>
      </Tabs>
    </template>
  </div>
</template>
<script>
  /**
   * 首页模块
   * @author  chenliangshan
   * @version 2017/07/24
   */

  /*eslint-disable*/

  import { isEmpty } from 'lodash'
  import HomeCalendar from './Calendar'
  // import { createButton } from '@/utils'
  import mockJson from './mock-json'

  export default {
    name: 'data-module',
    components: { HomeCalendar },
    data() {
      return {
        ...mockJson(this)
//        // 我的教师课表
//        courseData: mockJson.courseData,
//        // 本月签约
//        contractData: mockJson.contractData,
//        // 本月签约课时收入
//        incomeData: mockJson.incomeData,
//        // 本月签约课时收入占比
//        incomeComparedData: mockJson.incomeComparedData,
//        // 本月各校区签约金额占比
//        amountComparedData: mockJson.amountComparedData,
//        // 本月耗课
//        tookPeriodData: mockJson.tookPeriodData,
//        // 预警
//        warning: mockJson.warning,
//        // 我的审批
//        approval: mockJson.approval,
//        // 我的审批
//        testManager: mockJson.testManager,
//        // 我的学员
//        student: mockJson.student,
//        // 本月签约排行
//        contractSort: mockJson.contractSort,
//        // 我的班级
//        myClass: mockJson.myClass,
//        // 本月耗课排行
//        tookPeriodSort: mockJson.tookPeriodSort,
      }
    },
    methods: {
      calendarDay(date) {
        window.console.log(date)
      },
      courseConvert(date) {
        const course = this.courseData
        const find = course.filter(item => item.date === date.showEvents.date)
        if (!isEmpty(find)) {
          const arr = [
            { type: 1, item: [] },
            { type: 2, item: [] },
          ]
          find.forEach((val) => {
            arr[val.type - 1].item.push(val)
          })
          return arr
        }
        return []
      },
    },
  }
</script>
<style lang="less">
  @import "~vars";
  .home-data-module {
    &, .sub-module {
      width: 100%;
      height: 100%;
    }
    /* 重置iview Tabs样式 */
    .ivu-tabs-bar {
      border-bottom: 0;
      .ivu-tabs-nav-wrap {
        margin-bottom: 0;
        text-align: center;
      }
      .ivu-tabs-nav {
        float: inherit;
        display: inline-block;
        border-bottom: 1px solid #d7dde4;
        .ivu-tabs-tab {
          margin-right: 0;
          padding: 8px 18px;
          + .ivu-tabs-tab {
            margin-left: 16px;
          }
        }
      }
      .ivu-tabs-ink-bar {
        bottom: -1px;
      }
    }
  }
  .calendar-event-icon {
    margin-right: 2px;
    .ivu-icon {
      padding: 4px;
    }
  }
  .warning-color {
    color: @error-color
  }
</style>
