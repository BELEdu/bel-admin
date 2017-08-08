<template>
  <div class="cal-wrapper">
    <div class="cal-body">
      <div class="weeks clearfix">
        <span v-for="dayName in i18n[calendar.locale].dayNames" class="item">{{dayName}}</span>
      </div>
      <div class="dates clearfix">
        <div v-for="date in dayList" class="item">
          <p class="date-num" @click="handleChangeCurday(date)" :style="{color: date.status && (today == date.date) ? customColor : ''}">
            {{date.status ? date.date.split('-')[2] : '&nbsp'}}</p>
          <slot :showEvents="date"></slot>
        </div>
      </div>
    </div>
    <div class="cal-header">
      <div class="cal-header-left" @click="preMonth">
        <div class="arrow-left icon">&nbsp</div>
      </div>
      <div class="cal-header-title">{{curYearMonth}}</div>
      <div class="cal-header-right" @click="nextMonth">
        <div class="arrow-right icon">&nbsp</div>
      </div>
    </div>
  </div>
</template>

<script>
  /**
   * 日历组件
   * @author  chenliangshan
   * @version 2017/07/25
   */

  import { formatDate, parseDate } from '@/utils/date'
  import i18n from './i18n'

  export default {
    name: 'calendar',
    data() {
      const date = new Date(this.date !== '' ? new Date(this.date) : new Date().setDate(1))
      return {
        i18n,
        curDate: {
          curYear: date.getFullYear(),
          curMonth: date.getMonth(),
          curDate: date.getDate(),
        },
      }
    },
    props: {
      date: {
        type: String,
        default: '',
      },
      calendar: {
        type: Object,
        default() {
          return {
            locale: 'zh',
            color: '#00a8ff',
          }
        },
      },
    },
    computed: {
      dayList() {
        const firstDay = new Date(`${this.curDate.curYear}-${(this.curDate.curMonth + 1).toString().padStart(2, '0')}-01`)
        const startTimestamp = firstDay - (1000 * 60 * 60 * 24 * (firstDay.getDay() - 1))
        let item
        let status
        const tempArr = []
        for (let i = 0; i < 42; i += 1) {
          item = new Date(startTimestamp + (i * 1000 * 60 * 60 * 24))
          if (this.curDate.curMonth === item.getMonth()) {
            status = 1
          } else {
            status = 0
          }
          tempArr.push({
            date: formatDate(item),
            status,
          })
        }
        return tempArr
      },
      today() {
        return formatDate(new Date())
      },
      curYearMonth() {
        const tempDate = Date.parse(new Date(`${this.curDate.curYear}-${(this.curDate.curMonth + 1).toString().padStart(2, '0')}-01`))
        return formatDate(tempDate, this.i18n[this.calendar.locale].format)
      },
      customColor() {
        return this.calendar.color
      },
    },
    methods: {
      nextMonth() {
        if (this.curDate.curMonth < 11) {
          this.curDate.curMonth += 1
        } else {
          this.curDate.curYear += 1
          this.curDate.curMonth = 0
        }
        this.monthChanged()
      },
      preMonth() {
        if (this.curDate.curMonth > 0) {
          this.curDate.curMonth -= 1
        } else {
          this.curDate.curYear -= 1
          this.curDate.curMonth = 11
        }
        this.monthChanged()
      },
      monthChanged() {
        this.$emit('month-changed', formatDate(parseDate(this.curYearMonth, this.i18n[this.calendar.locale].format)))
      },
      handleChangeCurday(date) {
        this.$emit('day-changed', date.date)
      },
    },
  }
</script>
<style lang="less">
  @import "~vars";
  @large-padding: 15px;
  @small-padding: 10px;
  @icon-border-size: 1px;
  .cal-wrapper {
    .cal-header {
      position: relative;
      width: 100%;
      text-align: center;
      overflow: hidden;
      & > div {
        display: inline-block;
        vertical-align: middle;
        line-height: 20px;
        padding: @large-padding;
        box-sizing: border-box;
      }
      &-title {
        font-size: 20px;
        min-width: 140px;
        text-align: center;
      }
      &-left, &-right {
        width: 40px;
        cursor: pointer;
        user-select: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        &:hover {
          .icon:before {
            border-color: @link-hover-color;
          }
        }
      }
    }
    .cal-body {
      width: 100%;
      .weeks {
        width: 100%;
        text-align: center;
        font-size: 1rem;
        .item {
          line-height: 50px;
          float: left;
          width: 14.28571428571429%;
        }
      }
      .dates {
        width: 100%;
        text-align: center;
        font-size: 1rem;
        .item {
          position: relative;
          float: left;
          display: block;
          width: 14.28571428571429%;
          cursor: default;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          .date-num {
            font-size: 1rem;
            position: relative;
            z-index: 3;
          }
        }
      }
    }
  }

  .arrow-left.icon, .arrow-right.icon {
    color: #000;
    position: relative;
    margin-top: 10px;
  }

  .arrow-left.icon:before {
    content: '';
    position: absolute;
    left: 1px;
    top: 0;
    width: 10px;
    height: 10px;
    border-top: solid @icon-border-size #333;
    border-right: solid @icon-border-size #333;
    -webkit-transform: rotate(-135deg);
    transform: rotate(-135deg);
  }

  .arrow-right.icon:before {
    content: '';
    position: absolute;
    right: 1px;
    top: 0;
    width: 10px;
    height: 10px;
    border-top: solid @icon-border-size #333;
    border-right: solid @icon-border-size #333;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
  }
</style>
