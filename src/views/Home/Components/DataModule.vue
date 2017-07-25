<template>
  <div>
    <template v-if="$attrs.type==='contract'">
      签约
    </template>
    <template v-if="$attrs.type==='warning'">
      预警
    </template>
    <template v-if="$attrs.type==='income'">
      收入
    </template>
    <template v-if="$attrs.type==='approval'">
      审批
    </template>
    <template v-if="$attrs.type==='course'">
      <home-calendar @day-changed="calendarDay" :date="$attrs.data.currentMonth">
        <template scope="date">
          <span class="event-icon" v-for="(list, index) in courseConvert(date)"
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
  </div>
</template>
<script>
  /**
   * 首页模块
   * @author  chenliangshan
   * @version 2017/07/24
   */
  import { isEmpty } from 'lodash'
  import HomeCalendar from './HomeCalendar'

  export default {
    name: 'data-module',
    components: { HomeCalendar },
    data() {
      return {
        courseData: [
          {
            type: 1,
            date: '2017-07-08',
            start_at: '09:50',
            end_at: '10:50',
            display_name: 'test1',
          }, {
            type: 1,
            date: '2017-08-14',
            start_at: '13:50',
            end_at: '14:50',
            display_name: 'test15',
          }, {
            type: 1,
            date: '2017-08-14',
            start_at: '19:50',
            end_at: '20:50',
            display_name: 'test12',
          }, {
            type: 2,
            date: '2017-08-24',
            start_at: '09:50',
            end_at: '10:50',
            display_name: 'test13',
          }, {
            type: 1,
            date: '2017-09-14',
            start_at: '09:50',
            end_at: '10:50',
            display_name: 'test14',
          }],
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
  .event-icon {
    margin-right: 2px;
    .ivu-icon {
      padding: 4px;
    }
  }
</style>
